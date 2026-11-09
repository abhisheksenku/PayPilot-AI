import { Request, Response, NextFunction } from 'express';
import { agentService } from './agentService';
import { AgentExecution } from '../../models';

export class AgentController {
  /**
   * POST /api/v1/agent/chat
   */
  public async chat(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { message, conversationId, userId, selectedProductId, selectedQuantity } = req.body;

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
        userId,
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
