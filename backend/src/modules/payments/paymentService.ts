import { Product, Order, Transaction, User, AgentApproval } from '../../models';
import { paypalClient, PayPalOrderResponse, PayPalCaptureResponse } from '../../integrations/paypal/paypalClient';

export interface CreateOrderParams {
  userId: string;
  productId: string;
  quantity?: number;
  returnUrl?: string;
  cancelUrl?: string;
}

export interface CreateOrderResult {
  orderId: string;
  paypalOrderId: string;
  status: string;
  amount: number;
  currency: string;
  approvalUrl: string | null;
  product: {
    id: string;
    name: string;
    price: number;
  };
}

export interface CapturePaymentParams {
  paypalOrderId: string;
  orderId?: string;
}

export interface CapturePaymentResult {
  success: boolean;
  orderId: string;
  paypalOrderId: string;
  paypalCaptureId: string;
  status: string;
  amount: number;
  currency: string;
  payer?: any;
}

export class PaymentService {
  /**
   * Creates an order with strict server-side price validation
   */
  public async createOrder(params: CreateOrderParams): Promise<CreateOrderResult> {
    const { userId, productId, quantity = 1, returnUrl, cancelUrl } = params;

    if (quantity < 1) {
      throw new Error('Order quantity must be at least 1.');
    }

    // 1. Fetch genuine product from database (Server-Side Price Validation)
    const product = await Product.findByPk(productId);
    if (!product) {
      throw new Error(`Product with ID '${productId}' was not found in the catalog.`);
    }

    // Ensure user exists (fallback create demo user if needed for seamless testing)
    let user = await User.findByPk(userId);
    if (!user) {
      user = await User.create({
        id: userId,
        name: 'Demo Shopper',
        email: `shopper-${userId.substring(0, 8)}@paypilot.ai`,
        passwordHash: 'demohash',
      });
    }

    // 2. Compute verified amount
    const verifiedPrice = Number(product.price);
    const totalAmount = Number((verifiedPrice * quantity).toFixed(2));
    const currency = product.currency || 'USD';

    // 3. Draft order in MySQL
    const order = await Order.create({
      userId: user.id,
      productId: product.id,
      quantity,
      amount: totalAmount,
      currency,
      status: 'pending',
    });

    // 4. Create Order in PayPal Sandbox
    const paypalPayload = {
      intent: 'CAPTURE' as const,
      purchase_units: [
        {
          reference_id: order.id,
          description: `PayPilot AI purchase: ${product.name}`,
          amount: {
            currency_code: currency,
            value: totalAmount.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: currency,
                value: totalAmount.toFixed(2),
              },
            },
          },
          items: [
            {
              name: product.name.substring(0, 127),
              unit_amount: {
                currency_code: currency,
                value: verifiedPrice.toFixed(2),
              },
              quantity: quantity.toString(),
              description: (product.description || '').substring(0, 127),
            },
          ],
        },
      ],
      application_context: {
        brand_name: 'PayPilot AI',
        user_action: 'PAY_NOW' as const,
        return_url: returnUrl || 'http://localhost:3000/checkout/success',
        cancel_url: cancelUrl || 'http://localhost:3000/checkout/cancel',
      },
    };

    const paypalOrder: PayPalOrderResponse = await paypalClient.createOrder(paypalPayload);

    // 5. Persist PayPal Transaction Record
    await Transaction.create({
      orderId: order.id,
      paypalOrderId: paypalOrder.id,
      amount: totalAmount,
      currency,
      status: 'created',
    });

    // Extract checkout approval URL
    const approvalLink = paypalOrder.links.find((l) => l.rel === 'approve');

    return {
      orderId: order.id,
      paypalOrderId: paypalOrder.id,
      status: order.status,
      amount: totalAmount,
      currency,
      approvalUrl: approvalLink ? approvalLink.href : null,
      product: {
        id: product.id,
        name: product.name,
        price: verifiedPrice,
      },
    };
  }

  /**
   * Captures payment for an approved PayPal order with idempotency protection
   */
  public async capturePayment(params: CapturePaymentParams): Promise<CapturePaymentResult> {
    const { paypalOrderId } = params;

    // 1. Locate Transaction in DB
    const transaction = await Transaction.findOne({
      where: { paypalOrderId },
      include: [{ model: Order, as: 'order' }],
    });

    if (!transaction) {
      throw new Error(`Transaction for PayPal Order '${paypalOrderId}' does not exist.`);
    }

    // Idempotency: If already completed, return existing success state
    if (transaction.status === 'completed' && transaction.paypalCaptureId) {
      return {
        success: true,
        orderId: transaction.orderId,
        paypalOrderId: transaction.paypalOrderId,
        paypalCaptureId: transaction.paypalCaptureId,
        status: 'completed',
        amount: Number(transaction.amount),
        currency: transaction.currency,
      };
    }

    // 2. Call PayPal Sandbox to Capture payment
    const captureResponse: PayPalCaptureResponse = await paypalClient.captureOrder(paypalOrderId);

    const captureUnit = captureResponse.purchase_units?.[0]?.payments?.captures?.[0];
    if (!captureUnit || captureUnit.status !== 'COMPLETED') {
      const errorStatus = captureUnit ? captureUnit.status : captureResponse.status;
      await transaction.update({ status: 'failed' });
      const order = await Order.findByPk(transaction.orderId);
      if (order) await order.update({ status: 'failed' });

      throw new Error(`Payment capture not completed. PayPal status: ${errorStatus}`);
    }

    const captureId = captureUnit.id;

    // 3. Update Database Records
    await transaction.update({
      paypalCaptureId: captureId,
      status: 'completed',
    });

    const order = await Order.findByPk(transaction.orderId);
    if (order) {
      await order.update({ status: 'paid' });

      // Update approval log if registered
      const approval = await AgentApproval.findOne({ where: { orderId: order.id } });
      if (approval) {
        await approval.update({
          approvalStatus: 'approved',
          approvedAt: new Date(),
        });
      }
    }

    return {
      success: true,
      orderId: transaction.orderId,
      paypalOrderId: transaction.paypalOrderId,
      paypalCaptureId: captureId,
      status: 'completed',
      amount: Number(transaction.amount),
      currency: transaction.currency,
      payer: captureResponse.payer,
    };
  }

  /**
   * Retrieves verified payment and order details
   */
  public async getPaymentDetails(orderId: string) {
    const order = await Order.findByPk(orderId, {
      include: [
        { model: Product, as: 'product' },
        { model: Transaction, as: 'transaction' },
      ],
    });

    if (!order) {
      throw new Error(`Order with ID '${orderId}' not found.`);
    }

    return order;
  }

  /**
   * Retrieves all orders with product and transaction associations
   */
  public async getAllOrders(limit: number = 50) {
    return Order.findAll({
      limit,
      order: [['createdAt', 'DESC']],
      include: [
        { model: Product, as: 'product' },
        { model: Transaction, as: 'transaction' },
      ],
    });
  }
}

export const paymentService = new PaymentService();
