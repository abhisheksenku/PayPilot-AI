import { Router } from 'express';
import { agentController } from './agentController';
import { optionalAuth } from '../../middleware/authMiddleware';

const router = Router();

router.post('/chat', optionalAuth, agentController.chat);
router.get('/conversations', optionalAuth, agentController.getConversations);
router.get('/executions/:conversationId', agentController.getExecutions);

export default router;
