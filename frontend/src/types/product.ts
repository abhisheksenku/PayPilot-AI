export interface ProductSpecification {
  processor?: string;
  ram?: string;
  storage?: string;
  graphics?: string;
  display?: string;
  battery?: string;
  weight?: string;
  tgp?: string;
  [key: string]: string | undefined;
}

export interface Product {
  id: string;
  externalId?: string;
  name: string;
  description: string;
  price: number | string;
  currency: string;
  imageUrl?: string;
  category?: string;
  specifications: ProductSpecification;
  source?: string;
  stock?: number;
}

export interface RankedProduct extends Product {
  score: number;
  strengths: string[];
  tradeoffs: string[];
  rank?: number;
}
