import { AgentState } from '../state';
import { validateProduct, createPayPalOrderTool } from '../tools/purchaseTools';

export async function purchaseNode(state: AgentState): Promise<Partial<AgentState>> {
  const { conversationId, userId, selectedProductId, rankedProducts, selectedQuantity } = state;

  // Identify target product: explicit selection or top-ranked product
  const targetProductId = selectedProductId || rankedProducts[0]?.productId;

  if (!targetProductId) {
    return {
      activeAgent: 'purchase',
      requiresApproval: false,
      agentResponse:
        'Please select a specific product from the recommendations above before proceeding to checkout.',
    };
  }

  // 1. Validate Product through backend service
  const productData = await validateProduct({
    conversationId,
    productId: targetProductId,
  });

  // 2. Draft order and create real PayPal Sandbox order
  const orderResult = await createPayPalOrderTool({
    conversationId,
    userId,
    productId: targetProductId,
    quantity: selectedQuantity || 1,
  });

  const formattedAmount =
    orderResult.currency === 'INR' || Number(orderResult.amount) > 2000
      ? `₹${Number(orderResult.amount).toLocaleString('en-IN')} INR`
      : `$${Number(orderResult.amount).toFixed(2)} ${orderResult.currency}`;

  const responseText =
    `I have prepared your order for **${productData.name}** at the verified price of **${formattedAmount}**.\n\n` +
    `💳 **PayPal Order ID:** \`${orderResult.paypalOrderId}\`\n\n` +
    `⚠️ **Mandatory Approval Required:** As an AI agent, I cannot capture payments without your explicit authorization. Please click the PayPal checkout button below to approve this payment.`;

  return {
    activeAgent: 'purchase',
    selectedProductId: targetProductId,
    draftOrderId: orderResult.orderId,
    paypalOrderId: orderResult.paypalOrderId,
    approvalUrl: orderResult.approvalUrl,
    requiresApproval: true,
    agentResponse: responseText,
  };
}
