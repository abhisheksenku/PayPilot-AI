import { Product } from './product';

export type OrderStatus =
  | 'DRAFT'
  | 'AWAITING_APPROVAL'
  | 'AUTHORIZED'
  | 'CAPTURED'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED';

export interface Order {
  id: string;
  userId?: string;
  productId: string;
  product?: Product;
  Product?: Product;
  totalAmount: number | string;
  currency: string;
  status: OrderStatus;
  paypalOrderId?: string;
  paypalCaptureId?: string;
  approvalUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Transaction {
  id: string;
  orderId: string;
  paypalCaptureId?: string;
  amount: number | string;
  currency: string;
  status: 'COMPLETED' | 'PENDING' | 'REFUNDED' | 'FAILED';
  paymentMethod: string;
  createdAt: string;
}
