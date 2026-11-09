import { config } from '../../config/env';

export interface Channel3ProductRaw {
  id: string;
  title: string;
  description: string;
  price: number | string;
  currency?: string;
  image_url?: string;
  images?: string[];
  specifications?: Record<string, any>;
  brand?: string;
  category?: string;
  in_stock?: boolean;
}

export interface NormalizedProduct {
  externalId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  imageUrl: string | null;
  specifications: Record<string, any>;
  source: 'channel3_live' | 'channel3_fallback';
}

export class Channel3Client {
  private apiKey: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = config.channel3.apiKey;
    this.apiUrl = process.env.CHANNEL3_API_URL || 'https://api.channel3.ai/v1';
  }

  /**
   * Searches products using the Channel3 API, or returns null if not configured / API fails
   */
  public async search(query: string, category?: string): Promise<NormalizedProduct[] | null> {
    if (!this.apiKey || this.apiKey === 'your_channel3_api_key') {
      // Graceful fallback when no Channel3 API key is configured
      return null;
    }

    try {
      const url = new URL(`${this.apiUrl}/products/search`);
      url.searchParams.append('q', query);
      if (category) url.searchParams.append('category', category);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn(`[Channel3] API response: ${response.status} ${response.statusText}. Using fallback catalog.`);
        return null;
      }

      const data = await response.json();
      const products: Channel3ProductRaw[] = data.products || data.items || [];

      return products.map((item) => this.normalizeProduct(item));
    } catch (error: any) {
      console.warn(`[Channel3] Failed to connect to Channel3 API (${error.message}). Utilizing verified fallback catalog.`);
      return null;
    }
  }

  /**
   * Normalizes raw Channel3 API responses to PayPilot standard product format
   */
  public normalizeProduct(raw: Channel3ProductRaw): NormalizedProduct {
    const parsedPrice = typeof raw.price === 'string' ? parseFloat(raw.price.replace(/[^0-9.]/g, '')) : raw.price;

    return {
      externalId: raw.id || `CH3-${Math.random().toString(36).substring(2, 9)}`,
      name: raw.title || 'Product',
      description: raw.description || '',
      price: isNaN(parsedPrice) ? 0 : parsedPrice,
      currency: raw.currency || 'USD',
      imageUrl: raw.image_url || (raw.images && raw.images[0]) || null,
      specifications: raw.specifications || {},
      source: 'channel3_live',
    };
  }
}

export const channel3Client = new Channel3Client();
