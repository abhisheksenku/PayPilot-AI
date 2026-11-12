import { Request, Response, NextFunction } from 'express';
import { agentService } from './agentService';
import { AgentExecution, Conversation, Message } from '../../models';

export class AgentController {
  /**
   * POST /api/v1/agent/chat
   */
  public async chat(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { message, conversationId, selectedProductId, selectedQuantity } = req.body;
      const effectiveUserId =
        req.user?.userId ||
        req.body.userId ||
        '00000000-0000-0000-0000-000000000001';

      if (!message || typeof message !== 'string') {
        res.status(400).json({
          success: false,
          error: { message: 'A non-empty string `message` is required.' },
        });
        return;
      }

      const result = await agentService.processMessage({
        message,
        conversationId,
        userId: effectiveUserId,
        selectedProductId,
        selectedQuantity,
      });

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/agent/conversations
   */
  public async getConversations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const effectiveUserId =
        req.user?.userId ||
        (req.query.userId as string) ||
        '00000000-0000-0000-0000-000000000001';

      const conversations = await Conversation.findAll({
        where: { userId: effectiveUserId },
        include: [
          {
            model: Message,
            as: 'messages',
          },
        ],
        order: [
          ['createdAt', 'DESC'],
          [{ model: Message, as: 'messages' }, 'createdAt', 'ASC'],
        ],
        limit: 15,
      });

      res.status(200).json({
        success: true,
        data: conversations,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/agent/executions/:conversationId
   */
  public async getExecutions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const conversationId = String(req.params.conversationId);
      const executions = await AgentExecution.findAll({
        where: { conversationId },
        order: [['createdAt', 'ASC']],
      });

      res.status(200).json({
        success: true,
        data: executions,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const agentController = new AgentController();
