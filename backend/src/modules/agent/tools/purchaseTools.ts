import { Product, AgentApproval } from '../../../models';
import { paymentService } from '../../payments/paymentService';
import { logAgentToolExecution } from './auditLogger';

export interface ValidateProductParams {
  conversationId: string;
  productId: string;
}

export async function validateProduct(params: ValidateProductParams): Promise<any> {
  return logAgentToolExecution({
    conversationId: params.conversationId,
    toolName: 'validateProduct',
    input: params,
    executor: async () => {
      const product = await Product.findByPk(params.productId);
      if (!product) {
        throw new Error(`Product '${params.productId}' does not exist in verified catalog.`);
      }

      return {
        valid: true,
        productId: product.id,
        name: product.name,
        price: Number(product.price),
        currency: product.currency,
        source: product.source,
      };
    },
  });
}

export interface CreatePayPalOrderToolParams {
  conversationId: string;
  userId: string;
  productId: string;
  quantity?: number;
}

export async function createPayPalOrderTool(params: CreatePayPalOrderToolParams): Promise<any> {
  return logAgentToolExecution({
    conversationId: params.conversationId,
    toolName: 'createPayPalOrder',
    input: params,
    executor: async () => {
      // 1. Call PaymentService to draft Order and create real PayPal Sandbox order
      const result = await paymentService.createOrder({
        userId: params.userId,
        productId: params.productId,
        quantity: params.quantity || 1,
      });

      // 2. Register Human Approval Checkpoint
      await AgentApproval.create({
        orderId: result.orderId,
        userId: params.userId,
        approvalStatus: 'pending',
      });

      return {
        orderId: result.orderId,
        paypalOrderId: result.paypalOrderId,
        amount: result.amount,
        currency: result.currency,
        approvalUrl: result.approvalUrl,
        requiresApproval: true,
      };
    },
  });
}
