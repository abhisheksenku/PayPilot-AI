import { config } from '../../config/env';

export interface GroundingMetadata {
  webSearchQueries?: string[];
  searchChunks?: Array<{ web?: { uri?: string; title?: string } }>;
}

export interface GenerateTextOptions {
  systemInstruction?: string;
  enableSearchGrounding?: boolean;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
  timeoutMs?: number;
}

export interface GenerateStructuredOptions {
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
  timeoutMs?: number;
}

export class GeminiClient {
  private apiKey: string;
  private primaryModel = 'gemini-flash-latest';
  private fallbackModels = ['gemini-2.5-flash-lite', 'gemini-pro-latest', 'gemini-3-flash-preview'];
  private lastGroundingMetadata: GroundingMetadata | null = null;
  private lastModelUsed: string | null = null;

  constructor() {
    this.apiKey = config.gemini.apiKey;
  }

  public isAvailable(): boolean {
    return Boolean(this.apiKey && this.apiKey.length > 10 && !this.apiKey.includes('your_'));
  }

  public getLastGroundingMetadata(): GroundingMetadata | null {
    return this.lastGroundingMetadata;
  }

  public getLastModelUsed(): string | null {
    return this.lastModelUsed;
  }

  /**
   * Helper that fetches an endpoint with an AbortController timeout.
   */
  private async fetchWithTimeout(url: string, body: any, timeoutMs = 8000): Promise<Response> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timer);
      return response;
    } catch (err) {
      clearTimeout(timer);
      throw err;
    }
  }

  /**
   * Cascading request execution across primary and fallback models.
   */
  private async callCascade(
    buildBody: (model: string) => any,
    timeoutMs = 8000
  ): Promise<{ data: any; model: string } | null> {
    const models = [this.primaryModel, ...this.fallbackModels];

    for (const model of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;
        const body = buildBody(model);
        const res = await this.fetchWithTimeout(url, body, timeoutMs);

        if (res.ok) {
          const data = await res.json();
          this.lastModelUsed = model;
          return { data, model };
        }

        // On 404, 429, 503, cascade to next available model
        console.warn(`[Gemini Cascade] ${model} returned HTTP ${res.status}. Cascading to fallback model...`);
      } catch (err: any) {
        console.warn(`[Gemini Cascade] ${model} request error: ${err.message}. Cascading to fallback model...`);
      }
    }

    return null;
  }

  /**
   * Generates natural language text using Gemini with multi-turn history and optional Google Search Grounding.
   */
  public async generateText(
    prompt: string,
    options?: string | GenerateTextOptions
  ): Promise<string | null> {
    if (!this.isAvailable()) return null;
    this.lastGroundingMetadata = null;

    const opts: GenerateTextOptions =
      typeof options === 'string' ? { systemInstruction: options } : options || {};
    const timeout = opts.timeoutMs || 8000;

    let userPrompt = prompt;
    if (opts.history && opts.history.length > 0) {
      const formattedHistory = opts.history
        .slice(-4)
        .map((h) => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content.substring(0, 150)}`)
        .join('\n');
      userPrompt = `[Prior Conversation Context]:\n${formattedHistory}\n\n[Current User Message]: ${prompt}`;
    }

    const contents: any[] = [];
    if (opts.systemInstruction) {
      contents.push({
        role: 'user',
        parts: [{ text: `[System Instructions]: ${opts.systemInstruction}\n\n${userPrompt}` }],
      });
    } else {
      contents.push({
        role: 'user',
        parts: [{ text: userPrompt }],
      });
    }

    // 1. Attempt with Google Search Grounding if requested
    if (opts.enableSearchGrounding) {
      const groundedResult = await this.callCascade(
        () => ({
          contents,
          tools: [{ google_search: {} }],
        }),
        timeout
      );

      if (groundedResult?.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        const candidate = groundedResult.data.candidates[0];
        if (candidate.groundingMetadata) {
          this.lastGroundingMetadata = candidate.groundingMetadata;
        }
        return candidate.content.parts[0].text;
      }

      console.warn(
        '[Gemini Grounding] Search Grounding quota reserved or rate-limited; cascading seamlessly to direct intelligence synthesis.'
      );
    }

    // 2. Direct intelligence cascade (ungrounded)
    const directResult = await this.callCascade(() => ({ contents }), timeout);
    return directResult?.data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
  }

  /**
   * Generates structured JSON output using Gemini's JSON mode with multi-turn history support.
   */
  public async generateStructured<T>(
    prompt: string,
    schemaDescription: string,
    options?: GenerateStructuredOptions
  ): Promise<T | null> {
    if (!this.isAvailable()) return null;

    let userPrompt = prompt;
    if (options?.history && options.history.length > 0) {
      const formattedHistory = options.history
        .slice(-4)
        .map((h) => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content.substring(0, 150)}`)
        .join('\n');
      userPrompt = `[Prior Conversation Context]:\n${formattedHistory}\n\n[Current Input to Parse]: "${prompt}"`;
    }

    const systemInstruction = `You are an AI commerce intelligence parser. Output strictly valid JSON matching this schema: ${schemaDescription}. No markdown wrappers, no formatting, output pure JSON only.`;

    const contents = [
      {
        role: 'user',
        parts: [{ text: `${systemInstruction}\n\nInput to parse: "${userPrompt}"` }],
      },
    ];

    const result = await this.callCascade(
      () => ({
        contents,
        generationConfig: {
          responseMimeType: 'application/json',
        },
      }),
      options?.timeoutMs || 8000
    );

    const jsonText = result?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!jsonText) return null;

    try {
      return JSON.parse(jsonText) as T;
    } catch {
      return null;
    }
  }
}

export const geminiClient = new GeminiClient();
