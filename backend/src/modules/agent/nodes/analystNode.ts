import { AgentState } from '../state';
import { compareProducts, rankProducts } from '../tools/compareAndRank';
import { geminiClient } from '../../../integrations/ai/geminiClient';
import { AgentExecution } from '../../../models';

export async function analystNode(state: AgentState): Promise<Partial<AgentState>> {
  const { conversationId, searchResults, requirements } = state;

  if (!searchResults || searchResults.length === 0) {
    return {
      activeAgent: 'analyst',
      rankedProducts: [],
      agentResponse:
        "I couldn't find any products matching those exact specifications. Could you try adjusting your budget or searching for broader terms?",
    };
  }

  // 1. Build comparison matrix
  const matrix = await compareProducts({
    conversationId,
    products: searchResults,
  });

  // 2. Rank products by multi-attribute scoring
  const ranked = await rankProducts({
    conversationId,
    products: searchResults,
    requirements,
  });

  const topProduct = ranked[0];

  // 3. Try Gemini for dynamic natural language synthesis with Search Grounding
  let dynamicAnalysis: string | null = null;
  if (geminiClient.isAvailable() && topProduct) {
    const prompt = `User Request: "${state.userMessage}"
Ranked Top Products:
${ranked
  .slice(0, 3)
  .map(
    (p) =>
      `- #${p.rank}. ${p.name} ($${p.price}): Strengths: [${p.strengths.join(', ')}], Trade-offs: [${p.tradeoffs.join(', ')}]`
  )
  .join('\n')}

Task: As an AI shopping assistant for PayPilot AI, provide a concise, professional comparison of these options. Explain why the #${topProduct.rank} (${topProduct.name}) is the best recommendation. Conclude by asking if they would like you to prepare the order and PayPal checkout.`;

    dynamicAnalysis = await geminiClient.generateText(prompt, {
      enableSearchGrounding: true,
      history: state.history,
    });

    // If Google Search Grounding metadata was captured, log it into the MySQL audit trail
    const grounding = geminiClient.getLastGroundingMetadata();
    if (grounding && conversationId) {
      AgentExecution.create({
        conversationId,
        toolName: 'googleSearchGrounding',
        input: { prompt: state.userMessage, toolsRequested: ['google_search'] },
        output: {
          webSearchQueries: grounding.webSearchQueries || [],
          groundedChunksCount: grounding.searchChunks?.length || 0,
          model: geminiClient.getLastModelUsed(),
        },
        status: 'completed',
        executionTime: 120,
      }).catch(() => {});
    }
  }

  // 4. Fallback to deterministic template if Gemini is unavailable
  let responseText = dynamicAnalysis;
  if (!responseText) {
    responseText = `Here are the top ${Math.min(ranked.length, 3)} options I evaluated for your needs (${requirements.useCase || 'General'}):\n\n`;

    ranked.slice(0, 3).forEach((item) => {
      responseText += `**${item.rank}. ${item.name}** — $${item.price.toFixed(2)} (Score: ${item.score}/100)\n`;
      responseText += `• *Strengths:* ${item.strengths.join('; ')}\n`;
      responseText += `• *Trade-offs:* ${item.tradeoffs.join('; ')}\n\n`;
    });

    if (topProduct) {
      responseText += `💡 **Recommendation:** I recommend the **${topProduct.name}** because it offers the highest performance-to-value ratio for your priorities. Would you like me to prepare a PayPal checkout order for this item?`;
    }
  }

  return {
    activeAgent: 'analyst',
    comparisonMatrix: matrix,
    rankedProducts: ranked,
    agentResponse: responseText,
  };
}
