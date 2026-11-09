import { logAgentToolExecution } from './auditLogger';
import { RankedProductItem, ProductComparisonSpec, ExtractedRequirements } from '../state';

export interface CompareProductsParams {
  conversationId: string;
  products: any[];
}

export async function compareProducts(
  params: CompareProductsParams
): Promise<ProductComparisonSpec[]> {
  return logAgentToolExecution({
    conversationId: params.conversationId,
    toolName: 'compareProducts',
    input: { productCount: params.products.length },
    executor: async () => {
      const { products } = params;
      if (!products || products.length === 0) return [];

      const features = [
        'Price',
        'Processor / CPU',
        'Memory / RAM',
        'Storage',
        'Graphics / GPU',
        'Display',
      ];

      const matrix: ProductComparisonSpec[] = features.map((feature) => {
        const values: Record<string, string> = {};

        products.forEach((p) => {
          const specs = p.specifications || {};
          let val = 'N/A';

          switch (feature) {
            case 'Price':
              val = `$${Number(p.price).toFixed(2)} ${p.currency}`;
              break;
            case 'Processor / CPU':
              val = specs.processor || specs.cpu || 'Multi-core High Performance';
              break;
            case 'Memory / RAM':
              val = specs.ram || specs.memory || 'Standard';
              break;
            case 'Storage':
              val = specs.storage || specs.ssd || 'High-speed SSD';
              break;
            case 'Graphics / GPU':
              val = specs.graphics || specs.gpu || 'Integrated / Dedicated GPU';
              break;
            case 'Display':
              val = specs.display || specs.screen || 'High Definition';
              break;
          }

          values[p.id] = val;
        });

        return { feature, values };
      });

      return matrix;
    },
  });
}

export interface RankProductsParams {
  conversationId: string;
  products: any[];
  requirements: ExtractedRequirements;
}

export async function rankProducts(
  params: RankProductsParams
): Promise<RankedProductItem[]> {
  return logAgentToolExecution({
    conversationId: params.conversationId,
    toolName: 'rankProducts',
    input: {
      candidateCount: params.products.length,
      requirements: params.requirements,
    },
    executor: async () => {
      const { products, requirements } = params;
      const budget = requirements.budget || Infinity;

      const scored = products.map((product) => {
        let score = 70; // baseline suitability
        const strengths: string[] = [];
        const tradeoffs: string[] = [];
        const specs = product.specifications || {};
        const price = Number(product.price);
        const nameLower = product.name.toLowerCase();
        const descLower = product.description.toLowerCase();

        // 1. Budget Fit Analysis
        if (price <= budget) {
          const savings = budget - price;
          if (savings > 0 && budget !== Infinity) {
            score += 10;
            strengths.push(`Within budget with $${savings.toFixed(0)} to spare`);
          } else {
            score += 5;
            strengths.push('Optimal utilization of target budget');
          }
        } else {
          score -= 15;
          tradeoffs.push(`Exceeds specified budget by $${(price - budget).toFixed(0)}`);
        }

        // 2. Machine Learning & High RAM evaluation
        const ramStr = (specs.ram || '').toLowerCase();
        if (ramStr.includes('32gb') || ramStr.includes('64gb')) {
          score += 15;
          strengths.push('32GB+ RAM ideal for ML workflows and local model inference');
        } else if (ramStr.includes('16gb')) {
          score += 10;
          strengths.push('16GB RAM handles development multitasking and standard datasets');
        } else if (ramStr.includes('8gb')) {
          score -= 5;
          tradeoffs.push('8GB RAM may bottleneck heavy Docker containers or ML training');
        }

        // 3. GPU / Gaming evaluation
        const gpuStr = (specs.graphics || specs.gpu || descLower).toLowerCase();
        if (gpuStr.includes('rtx') || gpuStr.includes('geforce') || gpuStr.includes('radeon')) {
          score += 10;
          strengths.push('Dedicated GPU enables fast rendering, tensor operations and smooth gaming');
        } else if (nameLower.includes('macbook') || nameLower.includes('apple')) {
          score += 10;
          strengths.push('Unified Memory architecture accelerates Neural Engine operations');
        }

        // 4. Portability & Display
        if (descLower.includes('retina') || descLower.includes('oled') || descLower.includes('4k')) {
          strengths.push('High-resolution display reduces eye fatigue during long coding sessions');
        }

        if (strengths.length === 0) {
          strengths.push('Reliable, modern hardware configuration');
        }
        if (tradeoffs.length === 0) {
          tradeoffs.push('Premium price point relative to entry-level alternatives');
        }

        // Cap score between 1 and 99
        const finalScore = Math.min(Math.max(score, 45), 98);

        return {
          productId: product.id,
          name: product.name,
          price,
          currency: product.currency,
          score: finalScore,
          rank: 0,
          strengths,
          tradeoffs,
          suitabilityReason: `Scored ${finalScore}/100 for ${requirements.useCase || 'your requirements'} based on hardware balance, performance, and budget efficiency.`,
          imageUrl: product.imageUrl,
          specifications: product.specifications,
        };
      });

      // Sort descending by score
      scored.sort((a, b) => b.score - a.score);

      // Assign ranks (1, 2, 3...)
      scored.forEach((item, index) => {
        item.rank = index + 1;
      });

      return scored;
    },
  });
}
