export interface ExtractedRequirements {
  category?: string;
  query?: string;
  budget?: number;
  currency?: string;
  preferences?: string[];
  useCase?: string;
}

export interface ProductComparisonSpec {
  feature: string;
  values: Record<string, string>;
}

export interface RankedProductItem {
  productId: string;
  name: string;
  price: number;
  currency: string;
  score: number; // 0 to 100
  rank: number;
  strengths: string[];
  tradeoffs: string[];
  suitabilityReason: string;
  imageUrl?: string | null;
  specifications?: Record<string, any> | null;
}

export interface AgentState {
  conversationId: string;
  userId: string;
  userMessage: string;
  intent:
    | 'SHOPPING_RESEARCH'
    | 'PRODUCT_COMPARISON'
    | 'PURCHASE_INTENT'
    | 'PAYMENT_STATUS'
    | 'GENERAL_CONVERSATION'
    | 'QUESTION_ANSWERING';
  requirements: ExtractedRequirements;
  searchResults: any[];
  comparisonMatrix?: ProductComparisonSpec[];
  rankedProducts: RankedProductItem[];
  selectedProductId?: string;
  selectedQuantity?: number;
  draftOrderId?: string;
  paypalOrderId?: string;
  approvalUrl?: string | null;
  paymentStatus?: string;
  requiresApproval: boolean;
  agentResponse: string;
  activeAgent:
    | 'supervisor'
    | 'memory'
    | 'research'
    | 'analyst'
    | 'purchase'
    | 'payment_verify'
    | 'consultant';
  productContext?: any;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
  error?: string;
}
