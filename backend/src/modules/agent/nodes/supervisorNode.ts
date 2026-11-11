import { AgentState, ExtractedRequirements } from '../state';
import { geminiClient } from '../../../integrations/ai/geminiClient';

export async function supervisorNode(state: AgentState): Promise<Partial<AgentState>> {
  const text = (state.userMessage || '').trim();
  const textLower = text.toLowerCase();

  let intent: AgentState['intent'] = 'SHOPPING_RESEARCH';
  let requirements: ExtractedRequirements = { ...state.requirements };

  // Try Gemini AI Structured Intent Extraction if configured
  if (geminiClient.isAvailable()) {
    try {
      const aiParsed = await geminiClient.generateStructured<{
        intent: AgentState['intent'];
        category?: string;
        budget?: number;
        currency?: string;
        preferences?: string[];
        useCase?: string;
      }>(
        text,
        `{
          "intent": "SHOPPING_RESEARCH (when user is searching, needing a product, or asking for recommendations)" | "PRODUCT_COMPARISON (comparing specific models or features)" | "PURCHASE_INTENT (ONLY when user explicitly asks to buy, order, or checkout a specific product)" | "PAYMENT_STATUS" | "GENERAL_CONVERSATION",
          "category": "laptop" | "smartphone" | "monitor" | "audio" | "accessories",
          "budget": number (in USD, convert INR to USD by dividing by 85 if mentioned in Rs/INR),
          "currency": "USD",
          "preferences": string[],
          "useCase": string
        }`,
        { history: state.history }
      );

      if (aiParsed && aiParsed.intent) {
        intent = aiParsed.intent;
        // Guard: If classified as PURCHASE_INTENT without explicit buy/checkout action verb, treat as SHOPPING_RESEARCH
        if (
          intent === 'PURCHASE_INTENT' &&
          !textLower.match(/\b(buy|checkout|order now|proceed to pay|pay for|purchase this)\b/)
        ) {
          intent = 'SHOPPING_RESEARCH';
        }
        if (aiParsed.category) requirements.category = aiParsed.category;
        if (aiParsed.budget) requirements.budget = aiParsed.budget;
        if (aiParsed.currency) requirements.currency = aiParsed.currency;
        if (aiParsed.preferences) requirements.preferences = aiParsed.preferences;
        if (aiParsed.useCase) requirements.useCase = aiParsed.useCase;

        return {
          activeAgent: 'supervisor',
          intent,
          requirements,
        };
      }
    } catch (err) {
      // Fall through to deterministic extractor
    }
  }

  // Deterministic Intent Detection (Shield & Fallback)
  if (
    textLower.includes('buy') ||
    textLower.includes('checkout') ||
    textLower.includes('purchase') ||
    textLower.includes('order') ||
    textLower.includes('proceed') ||
    textLower.includes('select') ||
    textLower.includes('choose') ||
    textLower.includes('pay for')
  ) {
    intent = 'PURCHASE_INTENT';
  } else if (
    textLower.includes('compare') ||
    textLower.includes('difference between') ||
    textLower.includes('versus') ||
    textLower.includes('vs')
  ) {
    intent = 'PRODUCT_COMPARISON';
  } else if (
    textLower.includes('status') ||
    textLower.includes('payment done') ||
    textLower.includes('is it paid') ||
    textLower.includes('track order')
  ) {
    intent = 'PAYMENT_STATUS';
  } else if (
    textLower.startsWith('hi') ||
    textLower.startsWith('hello') ||
    textLower.startsWith('help') ||
    text.length < 5
  ) {
    intent = 'GENERAL_CONVERSATION';
  }

  // Budget Extraction
  const budgetMatchINR = text.match(/(?:₹|rs\.?|inr)\s*([\d,]+)/i) || text.match(/under\s*₹?\s*([\d,]+)/i);
  const budgetMatchUSD = text.match(/\$\s*([\d,]+)/i) || text.match(/(?:under|below|budget)\s*(?:\$)?\s*([\d,]+)\s*(?:usd|dollars)?/i);

  if (budgetMatchINR) {
    const rawNum = parseFloat(budgetMatchINR[1].replace(/,/g, ''));
    if (!isNaN(rawNum)) {
      requirements.budget = text.includes('₹') || /rs|inr/i.test(text) ? Math.round(rawNum / 85) : rawNum;
      requirements.currency = 'USD';
    }
  } else if (budgetMatchUSD) {
    const rawNum = parseFloat(budgetMatchUSD[1].replace(/,/g, ''));
    if (!isNaN(rawNum)) {
      requirements.budget = rawNum;
      requirements.currency = 'USD';
    }
  }

  // Category Extraction
  if (textLower.includes('laptop') || textLower.includes('macbook') || textLower.includes('notebook')) {
    requirements.category = 'laptop';
  } else if (textLower.includes('phone') || textLower.includes('mobile') || textLower.includes('iphone')) {
    requirements.category = 'smartphone';
  } else if (textLower.includes('monitor') || textLower.includes('screen') || textLower.includes('display')) {
    requirements.category = 'monitor';
  } else if (textLower.includes('headphone') || textLower.includes('earbuds') || textLower.includes('audio')) {
    requirements.category = 'audio';
  }

  // Preferences & Use Case
  const preferences: string[] = [];
  if (textLower.includes('machine learning') || textLower.includes('ml') || textLower.includes('ai')) {
    preferences.push('Machine Learning');
  }
  if (textLower.includes('programming') || textLower.includes('coding') || textLower.includes('developer')) {
    preferences.push('Programming');
  }
  if (textLower.includes('gaming') || textLower.includes('games')) {
    preferences.push('Gaming');
  }
  if (textLower.includes('battery') || textLower.includes('portable')) {
    preferences.push('Long Battery');
  }

  requirements.preferences = preferences;
  requirements.useCase = preferences.length > 0 ? preferences.join(', ') : 'General Productivity';

  return {
    activeAgent: 'supervisor',
    intent,
    requirements,
  };
}
