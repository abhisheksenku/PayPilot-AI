import { config } from '../../config/env';

export interface PayPalAccessTokenResponse {
  scope: string;
  access_token: string;
  token_type: string;
  app_id: string;
  expires_in: number;
  nonce: string;
}

export interface PayPalAmount {
  currency_code: string;
  value: string;
  breakdown?: {
    item_total?: {
      currency_code: string;
      value: string;
    };
    tax_total?: {
      currency_code: string;
      value: string;
    };
    shipping?: {
      currency_code: string;
      value: string;
    };
  };
}

export interface PayPalPurchaseUnitInput {
  reference_id?: string;
  description?: string;
  custom_id?: string;
  amount: PayPalAmount;
  items?: Array<{
    name: string;
    unit_amount: {
      currency_code: string;
      value: string;
    };
    quantity: string;
    description?: string;
  }>;
}

export interface PayPalCreateOrderPayload {
  intent: 'CAPTURE' | 'AUTHORIZE';
  purchase_units: PayPalPurchaseUnitInput[];
  application_context?: {
    brand_name?: string;
    landing_page?: 'LOGIN' | 'BILLING' | 'NO_PREFERENCE';
    user_action?: 'CONTINUE' | 'PAY_NOW';
    return_url?: string;
    cancel_url?: string;
  };
}

export interface PayPalOrderResponse {
  id: string;
  status: 'CREATED' | 'SAVED' | 'APPROVED' | 'VOIDED' | 'COMPLETED' | 'PAYER_ACTION_REQUIRED';
  intent: string;
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
  purchase_units?: any[];
  payer?: any;
}

export interface PayPalCaptureResponse {
  id: string;
  status: 'COMPLETED' | 'DECLINED' | 'PARTIALLY_REFUNDED' | 'PENDING' | 'REFUNDED' | 'FAILED';
  purchase_units: Array<{
    reference_id: string;
    payments: {
      captures: Array<{
        id: string;
        status: 'COMPLETED' | 'DECLINED' | 'PENDING' | 'REFUNDED';
        amount: {
          currency_code: string;
          value: string;
        };
        final_capture: boolean;
        seller_protection?: {
          status: string;
        };
        create_time: string;
        update_time: string;
      }>;
    };
  }>;
  payer?: {
    name?: {
      given_name?: string;
      surname?: string;
    };
    email_address?: string;
    payer_id?: string;
  };
}

export class PayPalClient {
  private baseUrl: string;
  private cachedToken: string | null = null;
  private tokenExpiresAt: number = 0;

  constructor() {
    this.baseUrl =
      config.paypal.mode === 'live'
        ? 'https://api-m.paypal.com'
        : 'https://api-m.sandbox.paypal.com';
  }

  /**
   * Retrieves or reuses a cached OAuth2 Bearer Access Token.
   */
  public async getAccessToken(): Promise<string> {
    const now = Date.now();
    // Re-use token if it is valid for at least another 60 seconds
    if (this.cachedToken && this.tokenExpiresAt > now + 60000) {
      return this.cachedToken;
    }

    if (!config.paypal.clientId || !config.paypal.clientSecret) {
      throw new Error(
        '[PayPal] Missing PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET in environment variables.'
      );
    }

    const auth = Buffer.from(
      `${config.paypal.clientId}:${config.paypal.clientSecret}`
    ).toString('base64');

    const response = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `[PayPal Auth Error] Status: ${response.status} - ${errorText}`
      );
    }

    const data = (await response.json()) as PayPalAccessTokenResponse;
    this.cachedToken = data.access_token;
    this.tokenExpiresAt = now + data.expires_in * 1000;

    return this.cachedToken;
  }

  /**
   * Creates an order with PayPal REST API v2
   */
  public async createOrder(
    payload: PayPalCreateOrderPayload
  ): Promise<PayPalOrderResponse> {
    const accessToken = await this.getAccessToken();

    const response = await fetch(`${this.baseUrl}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(
        `[PayPal Create Order Error] ${response.status}: ${JSON.stringify(
          responseData
        )}`
      );
    }

    return responseData as PayPalOrderResponse;
  }

  /**
   * Captures payment for an approved PayPal order
   */
  public async captureOrder(paypalOrderId: string): Promise<PayPalCaptureResponse> {
    const accessToken = await this.getAccessToken();

    const response = await fetch(
      `${this.baseUrl}/v2/checkout/orders/${paypalOrderId}/capture`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(
        `[PayPal Capture Order Error] ${response.status}: ${JSON.stringify(
          responseData
        )}`
      );
    }

    return responseData as PayPalCaptureResponse;
  }

  /**
   * Fetches order details by PayPal Order ID
   */
  public async getOrderDetails(paypalOrderId: string): Promise<PayPalOrderResponse> {
    const accessToken = await this.getAccessToken();

    const response = await fetch(
      `${this.baseUrl}/v2/checkout/orders/${paypalOrderId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(
        `[PayPal Get Order Error] ${response.status}: ${JSON.stringify(
          responseData
        )}`
      );
    }

    return responseData as PayPalOrderResponse;
  }
}

export const paypalClient = new PayPalClient();
