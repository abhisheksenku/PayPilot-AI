const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export interface ChatResponse {
  conversationId: string;
  activeAgent: string;
  intent: string;
  agentResponse: string;
  requirements: {
    category?: string;
    budget?: number;
    currency?: string;
    preferences?: string[];
    useCase?: string;
  };
  rankedProducts: Array<{
    productId: string;
    name: string;
    price: number;
    currency: string;
    score: number;
    rank: number;
    strengths: string[];
    tradeoffs: string[];
    suitabilityReason: string;
    imageUrl?: string | null;
    specifications?: Record<string, any> | null;
  }>;
  requiresApproval: boolean;
  draftOrderId?: string;
  paypalOrderId?: string;
  approvalUrl?: string | null;
}

export interface ProductItem {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  currency: string;
  rating: number;
  reviewsCount: number;
  stock: number;
  inStock: boolean;
  specifications: Record<string, any>;
  imageUrl: string;
  source: string;
}

export interface OrderItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  currency: string;
  status: 'PENDING' | 'AUTHORIZED' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  paypalOrderId?: string;
  paypalCaptureId?: string;
  createdAt: string;
  Product?: ProductItem;
}

export interface ExecutionLog {
  id: string;
  conversationId: string;
  toolName: string;
  status: string;
  executionTime: number;
  createdAt: string;
  input: any;
  output: any;
}

export const api = {
  /**
   * Send a prompt to the multi-agent system
   */
  async sendMessage(params: {
    message: string;
    conversationId?: string;
    selectedProductId?: string;
    selectedQuantity?: number;
  }): Promise<ChatResponse> {
    const res = await fetch(`${API_BASE_URL}/agent/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Request failed with status ${res.status}`);
    }

    const json = await res.json();
    return json.data;
  },

  /**
   * Retrieve tool execution audit logs for a conversation
   */
  async getExecutions(conversationId: string): Promise<ExecutionLog[]> {
    const res = await fetch(`${API_BASE_URL}/agent/executions/${conversationId}`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  },

  /**
   * Fetch product catalog with optional query filters
   */
  async getProducts(params?: { search?: string; category?: string; maxPrice?: number }): Promise<ProductItem[]> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.category) query.append('category', params.category);
    if (params?.maxPrice) query.append('maxPrice', String(params.maxPrice));

    const res = await fetch(`${API_BASE_URL}/products?${query.toString()}`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  },

  /**
   * Fetch single product details by ID
   */
  async getProductById(id: string): Promise<ProductItem | null> {
    const res = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  },

  /**
   * Create PayPal Order with server-side price validation
   */
  async createPayPalOrder(data: {
    productId: string;
    quantity: number;
    currency?: string;
    conversationId?: string;
  }): Promise<{ orderId: string; paypalOrderId: string; approvalUrl: string; totalAmount: number }> {
    const res = await fetch(`${API_BASE_URL}/payments/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to initialize PayPal order');
    }

    const json = await res.json();
    return json.data;
  },

  /**
   * Capture PayPal Order upon user authorization
   */
  async capturePayPalOrder(data: {
    orderId: string;
    paypalOrderId: string;
  }): Promise<{ status: string; captureId: string; orderId: string }> {
    const res = await fetch(`${API_BASE_URL}/payments/capture-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to capture PayPal payment');
    }

    const json = await res.json();
    return json.data;
  },

  /**
   * Fetch all orders
   */
  async getOrders(): Promise<OrderItem[]> {
    const res = await fetch(`${API_BASE_URL}/payments/orders`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  },

  /**
   * Check backend health
   */
  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch('http://localhost:5000/api/health');
      const json = await res.json();
      return json.success === true;
    } catch {
      return false;
    }
  },
};
