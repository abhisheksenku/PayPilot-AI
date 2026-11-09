import { Request, Response, NextFunction } from 'express';
import { productService } from './productService';

export class ProductController {
  public async getProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { q, category, maxPrice, minPrice, limit } = req.query;

      const products = await productService.discoverProducts({
        query: typeof q === 'string' ? q : undefined,
        category: typeof category === 'string' ? category : undefined,
        maxPrice: maxPrice ? parseFloat(String(maxPrice)) : undefined,
        minPrice: minPrice ? parseFloat(String(minPrice)) : undefined,
        limit: limit ? parseInt(String(limit), 10) : 50,
      });

      res.status(200).json({
        success: true,
        data: products,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getProductById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const product = await productService.getProductById(id);

      if (!product) {
        res.status(404).json({
          success: false,
          error: { message: `Product with ID '${id}' not found.` },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const productController = new ProductController();
