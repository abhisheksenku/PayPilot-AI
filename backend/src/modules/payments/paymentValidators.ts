import { z } from 'zod';

export const createOrderSchema = z.object({
  userId: z.string().uuid().optional().default('00000000-0000-0000-0000-000000000001'),
  productId: z.string().uuid({ message: 'Valid product UUID is required' }),
  quantity: z.number().int().positive().default(1),
  returnUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
});

export const capturePaymentSchema = z.object({
  paypalOrderId: z.string().min(1, { message: 'PayPal Order ID is required' }),
  orderId: z.string().uuid().optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type CapturePaymentInput = z.infer<typeof capturePaymentSchema>;
