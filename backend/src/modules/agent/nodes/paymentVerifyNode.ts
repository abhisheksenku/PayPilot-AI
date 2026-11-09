import { AgentState } from '../state';
import { getPaymentStatusTool } from '../tools/paymentVerifyTools';

export async function paymentVerifyNode(state: AgentState): Promise<Partial<AgentState>> {
  const { conversationId, paypalOrderId, draftOrderId } = state;

  const statusResult = await getPaymentStatusTool({
    conversationId,
    paypalOrderId,
    orderId: draftOrderId,
  });

  let responseText = '';
  if (statusResult.isCompleted) {
    responseText = `🎉 **Payment Verified!** Your transaction for Order \`${statusResult.orderId}\` has been captured successfully via PayPal (Capture ID: \`${statusResult.paypalCaptureId}\`). Your receipt and confirmation have been logged.`;
  } else {
    responseText = `ℹ️ **Payment Status:** The payment for PayPal Order \`${statusResult.paypalOrderId || paypalOrderId}\` is currently **${statusResult.paypalLiveStatus || statusResult.dbStatus}**.`;
  }

  return {
    activeAgent: 'payment_verify',
    paymentStatus: statusResult.dbStatus,
    agentResponse: responseText,
  };
}
