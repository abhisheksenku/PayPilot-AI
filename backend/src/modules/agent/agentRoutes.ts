import { Router } from 'express';
import { agentController } from './agentController';

const router = Router();

router.post('/chat', agentController.chat);
router.get('/executions/:conversationId', agentController.getExecutions);

export default router;
