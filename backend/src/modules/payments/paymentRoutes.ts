import { Router } from 'express';
import { paymentController } from './paymentController';

const router = Router();

router.post('/create-order', paymentController.createOrder);
router.post('/capture-order', paymentController.captureOrder);
router.get('/orders', paymentController.getOrders);
router.get('/order/:orderId', paymentController.getOrderDetails);

export default router;
