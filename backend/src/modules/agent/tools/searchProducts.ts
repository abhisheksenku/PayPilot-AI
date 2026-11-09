import { productService } from '../../products/productService';
import { logAgentToolExecution } from './auditLogger';

export interface SearchProductsParams {
  conversationId: string;
  query?: string;
  category?: string;
  maxPrice?: number;
  minPrice?: number;
  limit?: number;
}

export async function searchProducts(params: SearchProductsParams): Promise<any[]> {
  return logAgentToolExecution({
    conversationId: params.conversationId,
    toolName: 'searchProducts',
    input: params,
    executor: async () => {
      const products = await productService.discoverProducts({
        query: params.query,
        category: params.category,
        maxPrice: params.maxPrice,
        minPrice: params.minPrice,
        limit: params.limit || 8,
      });

      return products.map((p) => p.toJSON());
    },
  });
}
