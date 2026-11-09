import { Request, Response, NextFunction } from 'express';
import { paymentService } from './paymentService';
import { createOrderSchema, capturePaymentSchema } from './paymentValidators';

export class PaymentController {
  /**
   * POST /api/v1/payments/create-order
   */
  public async createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = createOrderSchema.parse(req.body);
      const result = await paymentService.createOrder(validatedData);

      res.status(201).json({
        success: true,
        message: 'PayPal Sandbox order created successfully.',
        data: result,
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * POST /api/v1/payments/capture-order
   */
  public async captureOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = capturePaymentSchema.parse(req.body);
      const result = await paymentService.capturePayment(validatedData);

      res.status(200).json({
        success: true,
        message: 'PayPal Sandbox payment captured and verified successfully.',
        data: result,
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * GET /api/v1/payments/order/:orderId
   */
  public async getOrderDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orderId = String(req.params.orderId);
      const order = await paymentService.getPaymentDetails(orderId);

      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * GET /api/v1/payments/orders
   */
  public async getOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : 50;
      const orders = await paymentService.getAllOrders(limit);

      res.status(200).json({
        success: true,
        data: orders,
      });
    } catch (error: any) {
      next(error);
    }
  }
}

export const paymentController = new PaymentController();
