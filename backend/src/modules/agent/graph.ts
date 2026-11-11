import { AgentState } from './state';
import { supervisorNode } from './nodes/supervisorNode';
import { memoryNode } from './nodes/memoryNode';
import { researchNode } from './nodes/researchNode';
import { analystNode } from './nodes/analystNode';
import { purchaseNode } from './nodes/purchaseNode';
import { paymentVerifyNode } from './nodes/paymentVerifyNode';

export class CommerceAgentGraph {
  /**
   * Executes the orchestrated multi-agent state graph
   */
  public async execute(initialState: Partial<AgentState>): Promise<AgentState> {
    let state: AgentState = {
      conversationId: initialState.conversationId || 'default-session',
      userId: initialState.userId || '00000000-0000-0000-0000-000000000001',
      userMessage: initialState.userMessage || '',
      intent: 'SHOPPING_RESEARCH',
      requirements: initialState.requirements || {},
      searchResults: initialState.searchResults || [],
      rankedProducts: initialState.rankedProducts || [],
      selectedProductId: initialState.selectedProductId,
      selectedQuantity: initialState.selectedQuantity || 1,
      draftOrderId: initialState.draftOrderId,
      paypalOrderId: initialState.paypalOrderId,
      requiresApproval: false,
      agentResponse: '',
      activeAgent: 'supervisor',
      ...initialState,
    };

    // Node 1: Memory Retrieval
    const memoryUpdate = await memoryNode(state);
    state = { ...state, ...memoryUpdate };

    // Node 2: Supervisor Analysis & Routing
    const supervisorUpdate = await supervisorNode(state);
    state = { ...state, ...supervisorUpdate };

    // Conditional Routing
    switch (state.intent) {
      case 'PURCHASE_INTENT': {
        // If no product is selected or ranked yet, discover and rank candidates first
        if (!state.selectedProductId && (!state.rankedProducts || state.rankedProducts.length === 0)) {
          const researchUpdate = await researchNode(state);
          state = { ...state, ...researchUpdate };

          const analystUpdate = await analystNode(state);
          state = { ...state, ...analystUpdate };
          break;
        }

        // Node 3: Purchase Agent (Draft order + PayPal Sandbox order + Human approval checkpoint)
        const purchaseUpdate = await purchaseNode(state);
        state = { ...state, ...purchaseUpdate };
        break;
      }

      case 'PAYMENT_STATUS': {
        // Node 4: Payment Verification Agent
        const verifyUpdate = await paymentVerifyNode(state);
        state = { ...state, ...verifyUpdate };
        break;
      }

      case 'GENERAL_CONVERSATION': {
        state.agentResponse =
          "👋 Hello! I am **PayPilot AI**, your autonomous shopping assistant. You can tell me what you're looking for (e.g. *\"I need a laptop under $1200 for coding and machine learning\"*) and I will research the best options, compare specs, and prepare your PayPal checkout!";
        break;
      }

      case 'SHOPPING_RESEARCH':
      case 'PRODUCT_COMPARISON':
      default: {
        // Node 5: Shopping Research Agent (Channel3 & Catalog Search)
        const researchUpdate = await researchNode(state);
        state = { ...state, ...researchUpdate };

        // Node 6: Product Analyst Agent (Comparison & Multi-attribute ranking)
        const analystUpdate = await analystNode(state);
        state = { ...state, ...analystUpdate };
        break;
      }
    }

    return state;
  }
}

export const commerceGraph = new CommerceAgentGraph();
