import { Router } from 'express';
import healthRoutes from './healthRoutes';
import paymentRoutes from '../modules/payments/paymentRoutes';
import agentRoutes from '../modules/agent/agentRoutes';
import productRoutes from '../modules/products/productRoutes';

const router = Router();

// Health check
router.use('/health', healthRoutes);

// Payments API
router.use('/payments', paymentRoutes);
router.use('/v1/payments', paymentRoutes);

// Multi-Agent System API
router.use('/agent', agentRoutes);
router.use('/v1/agent', agentRoutes);

// Products & Discovery API
router.use('/products', productRoutes);
router.use('/v1/products', productRoutes);

export default router;
