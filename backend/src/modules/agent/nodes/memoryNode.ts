import { Message } from '../../../models';
import { AgentState } from '../state';

export async function memoryNode(state: AgentState): Promise<Partial<AgentState>> {
  if (!state.conversationId) {
    return { activeAgent: 'memory' };
  }

  try {
    const recentMessages = await Message.findAll({
      where: { conversationId: state.conversationId },
      order: [['createdAt', 'ASC']],
      limit: 10,
    });

    const history = recentMessages.map((m) => ({
      role: (m.role === 'assistant' ? 'assistant' : 'user') as 'user' | 'assistant',
      content: m.content,
    }));

    return {
      activeAgent: 'memory',
      history,
    };
  } catch (error) {
    return { activeAgent: 'memory' };
  }
}
