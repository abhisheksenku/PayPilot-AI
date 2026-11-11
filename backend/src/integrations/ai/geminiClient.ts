import { config } from '../../config/env';

export class GeminiClient {
  private apiKey: string;
  private model: string;

  constructor() {
    this.apiKey = config.gemini.apiKey;
    this.model = 'gemini-3.5-flash';
  }

  public isAvailable(): boolean {
    return Boolean(this.apiKey && this.apiKey.length > 10 && !this.apiKey.includes('your_'));
  }

  /**
   * Generates natural language text using Gemini
   */
  public async generateText(prompt: string, systemInstruction?: string): Promise<string | null> {
    if (!this.isAvailable()) return null;

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

      const contents: any[] = [];
      if (systemInstruction) {
        contents.push({
          role: 'user',
          parts: [{ text: `[System Instructions]: ${systemInstruction}\n\n[User Request]: ${prompt}` }],
        });
      } else {
        contents.push({
          role: 'user',
          parts: [{ text: prompt }],
        });
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents }),
      });

      if (!response.ok) {
        // Fallback to gemini-flash-latest if needed
        if (response.status === 404 && this.model !== 'gemini-flash-latest') {
          this.model = 'gemini-flash-latest';
          return this.generateText(prompt, systemInstruction);
        }
        const errorText = await response.text();
        console.warn(`[Gemini API] Response status ${response.status}: ${errorText.substring(0, 150)}`);
        return null;
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      return text || null;
    } catch (err: any) {
      console.warn(`[Gemini API] Warning calling Gemini: ${err.message}`);
      return null;
    }
  }

  /**
   * Generates structured JSON output using Gemini's JSON mode
   */
  public async generateStructured<T>(prompt: string, schemaDescription: string): Promise<T | null> {
    if (!this.isAvailable()) return null;

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

      const systemInstruction = `You are an AI commerce intelligence parser. Output strictly valid JSON matching this schema: ${schemaDescription}. No markdown wrappers, no formatting, output pure JSON only.`;

      const contents = [
        {
          role: 'user',
          parts: [{ text: `${systemInstruction}\n\nInput to parse: "${prompt}"` }],
        },
      ];

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            responseMimeType: 'application/json',
          },
        }),
      });

      if (!response.ok) {
        if (response.status === 404 && this.model !== 'gemini-flash-latest') {
          this.model = 'gemini-flash-latest';
          return this.generateStructured<T>(prompt, schemaDescription);
        }
        return null;
      }

      const data = await response.json();
      const jsonText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!jsonText) return null;

      return JSON.parse(jsonText) as T;
    } catch (err) {
      return null;
    }
  }
}

export const geminiClient = new GeminiClient();

