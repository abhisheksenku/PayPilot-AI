import { Order, Transaction } from '../../../models';
import { paypalClient } from '../../../integrations/paypal/paypalClient';
import { logAgentToolExecution } from './auditLogger';

export interface PaymentStatusParams {
  conversationId: string;
  paypalOrderId?: string;
  orderId?: string;
}

export async function getPaymentStatusTool(params: PaymentStatusParams): Promise<any> {
  return logAgentToolExecution({
    conversationId: params.conversationId,
    toolName: 'getPaymentStatus',
    input: params,
    executor: async () => {
      let transaction: Transaction | null = null;

      if (params.paypalOrderId) {
        transaction = await Transaction.findOne({
          where: { paypalOrderId: params.paypalOrderId },
          include: [{ model: Order, as: 'order' }],
        });
      } else if (params.orderId) {
        transaction = await Transaction.findOne({
          where: { orderId: params.orderId },
          include: [{ model: Order, as: 'order' }],
        });
      }

      if (!transaction) {
        return {
          found: false,
          status: 'unknown',
          message: 'No matching transaction found in record.',
        };
      }

      // Check live status from PayPal Sandbox if paypalOrderId is present
      let paypalLiveStatus = 'UNKNOWN';
      try {
        const paypalOrder = await paypalClient.getOrderDetails(transaction.paypalOrderId);
        paypalLiveStatus = paypalOrder.status;
      } catch (err: any) {
        paypalLiveStatus = 'UNAVAILABLE';
      }

      return {
        found: true,
        orderId: transaction.orderId,
        paypalOrderId: transaction.paypalOrderId,
        paypalCaptureId: transaction.paypalCaptureId,
        dbStatus: transaction.status,
        paypalLiveStatus,
        amount: Number(transaction.amount),
        currency: transaction.currency,
        isCompleted: transaction.status === 'completed' || paypalLiveStatus === 'COMPLETED',
      };
    },
  });
}
