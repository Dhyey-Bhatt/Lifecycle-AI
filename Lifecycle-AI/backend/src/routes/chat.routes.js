import { Router } from 'express';
import { chatController } from '../controllers/chat.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';

const router = Router();

// Apply Authentication to all Chat endpoints
router.use(authenticateUser);

// Metadata & Provider info
router.get('/model-info', chatController.getModelInfo);
router.get('/providers', chatController.getProvidersStatus);
router.post('/switch-provider', chatController.switchProvider);

// Conversation CRUD
router.get('/conversations', chatController.getConversations);
router.post('/conversations', chatController.createConversation);
router.patch('/conversations/:conversationId', chatController.renameConversation);
router.delete('/conversations/:conversationId', chatController.deleteConversation);

// Messages CRUD & Streaming
router.get('/conversations/:conversationId/messages', chatController.getMessages);
router.post('/conversations/:conversationId/messages', chatController.sendMessage);
router.post('/conversations/:conversationId/stream', chatController.streamMessage);

// Feedback rating (thumbs up / thumbs down)
router.post('/messages/:messageId/feedback', chatController.recordFeedback);

export default router;
