import { Router } from 'express';
import { paymentController } from './paymentController';
import { optionalAuth } from '../../middleware/authMiddleware';

const router = Router();

router.post('/create-order', optionalAuth, paymentController.createOrder);
router.post('/capture-order', optionalAuth, paymentController.captureOrder);
router.get('/orders', optionalAuth, paymentController.getOrders);
router.get('/order/:orderId', optionalAuth, paymentController.getOrderDetails);

export default router;
