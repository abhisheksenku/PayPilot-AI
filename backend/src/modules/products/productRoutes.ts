import { Router } from 'express';
import { productController } from './productController';

const router = Router();

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

export default router;
