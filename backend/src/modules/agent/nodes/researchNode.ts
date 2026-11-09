import { AgentState } from '../state';
import { searchProducts } from '../tools/searchProducts';

export async function researchNode(state: AgentState): Promise<Partial<AgentState>> {
  const { conversationId, requirements } = state;

  const results = await searchProducts({
    conversationId,
    query: requirements.query,
    category: requirements.category,
    maxPrice: requirements.budget,
    limit: 6,
  });

  return {
    activeAgent: 'research',
    searchResults: results,
  };
}
