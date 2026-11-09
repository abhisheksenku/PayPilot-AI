import { Op } from 'sequelize';
import { Product } from '../../models';
import { channel3Client, NormalizedProduct } from '../../integrations/channel3/channel3Client';

export interface ProductSearchFilters {
  query?: string;
  category?: string;
  maxPrice?: number;
  minPrice?: number;
  limit?: number;
}

export class ProductService {
  /**
   * Discovers products via Channel3 (with database fallback and caching)
   */
  public async discoverProducts(filters: ProductSearchFilters): Promise<Product[]> {
    const { query = '', category, maxPrice, minPrice, limit = 8 } = filters;

    // 1. Try Channel3 live API discovery first
    if (query || category) {
      const channel3Results = await channel3Client.search(query, category);

      if (channel3Results && channel3Results.length > 0) {
        // Cache discovered products into MySQL for verified price locking
        for (const item of channel3Results) {
          await Product.upsert({
            externalId: item.externalId,
            name: item.name,
            description: item.description,
            price: item.price,
            currency: item.currency,
            imageUrl: item.imageUrl,
            specifications: item.specifications,
            source: item.source,
          });
        }
      }
    }

    // 2. Query MySQL database (works for both cached Channel3 items & verified fallback catalog)
    const whereClause: any = {};

    if (maxPrice && maxPrice > 0) {
      whereClause.price = { [Op.lte]: maxPrice };
    }

    if (minPrice && minPrice > 0) {
      whereClause.price = {
        ...whereClause.price,
        [Op.gte]: minPrice,
      };
    }

    const searchTerms: string[] = [];
    if (query) searchTerms.push(query);
    if (category) searchTerms.push(category);

    if (searchTerms.length > 0) {
      const keywordConditions = searchTerms.map((term) => ({
        [Op.or]: [
          { name: { [Op.like]: `%${term}%` } },
          { description: { [Op.like]: `%${term}%` } },
        ],
      }));
      whereClause[Op.and] = keywordConditions;
    }

    let products = await Product.findAll({
      where: whereClause,
      limit,
      order: [['price', 'ASC']],
    });

    // If specific search returned empty, fall back to broader match
    if (products.length === 0 && (query || category)) {
      const fallbackTerm = category || query;
      products = await Product.findAll({
        where: {
          [Op.or]: [
            { name: { [Op.like]: `%${fallbackTerm}%` } },
            { description: { [Op.like]: `%${fallbackTerm}%` } },
          ],
        },
        limit,
      });
    }

    return products;
  }

  /**
   * Retrieves single product by UUID
   */
  public async getProductById(id: string): Promise<Product | null> {
    return Product.findByPk(id);
  }

  /**
   * Lists all products for frontend catalog browsing
   */
  public async listAll(limit = 50): Promise<Product[]> {
    return Product.findAll({
      limit,
      order: [['createdAt', 'DESC']],
    });
  }
}

export const productService = new ProductService();
