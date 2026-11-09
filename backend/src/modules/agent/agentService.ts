import { Conversation, Message, User } from '../../models';
import { commerceGraph } from './graph';
import { AgentState } from './state';

export interface ChatMessageInput {
  conversationId?: string;
  userId?: string;
  message: string;
  selectedProductId?: string;
  selectedQuantity?: number;
}

export class AgentService {
  /**
   * Processes a multi-agent chat message through the LangGraph workflow
   */
  public async processMessage(input: ChatMessageInput): Promise<AgentState> {
    const { userId = '00000000-0000-0000-0000-000000000001', message } = input;

    // 1. Ensure user exists
    let user = await User.findByPk(userId);
    if (!user) {
      user = await User.create({
        id: userId,
        name: 'Demo Shopper',
        email: `shopper-${userId.substring(0, 8)}@paypilot.ai`,
        passwordHash: 'demohash',
      });
    }

    // 2. Ensure conversation exists
    let conversation: Conversation | null = null;
    if (input.conversationId) {
      conversation = await Conversation.findByPk(input.conversationId);
    }

    if (!conversation) {
      conversation = await Conversation.create({
        userId: user.id,
        title: message.substring(0, 40) + '...',
      });
    }

    // 3. Save incoming user message in MySQL
    await Message.create({
      conversationId: conversation.id,
      role: 'user',
      content: message,
    });

    // 4. Execute Multi-Agent Graph
    const finalState = await commerceGraph.execute({
      conversationId: conversation.id,
      userId: user.id,
      userMessage: message,
      selectedProductId: input.selectedProductId,
      selectedQuantity: input.selectedQuantity,
    });

    // 5. Save AI response in MySQL
    if (finalState.agentResponse) {
      await Message.create({
        conversationId: conversation.id,
        role: 'assistant',
        content: finalState.agentResponse,
      });
    }

    return finalState;
  }
}

export const agentService = new AgentService();
