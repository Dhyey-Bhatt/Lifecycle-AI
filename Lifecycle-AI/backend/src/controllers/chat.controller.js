import { ChatService } from '../services/chat.service.js';
import { aiService } from '../services/ai/ai.service.js';

export const chatController = {
  /**
   * GET /api/chat/model-info
   */
  async getModelInfo(req, res) {
    try {
      const info = aiService.getModelInfo();
      res.json({
        ...info,
        userPersona: req.user?.role || 'Admin'
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  /**
   * GET /api/chat/providers
   */
  async getProvidersStatus(req, res) {
    try {
      const status = await aiService.getProvidersStatus();
      res.json(status);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  /**
   * POST /api/chat/switch-provider
   */
  async switchProvider(req, res) {
    try {
      const { provider } = req.body || {};
      const success = aiService.setActiveProvider(provider);
      if (success) {
        const info = aiService.getModelInfo();
        return res.json({ success: true, activeProvider: provider, modelInfo: info });
      }
      return res.status(400).json({ error: `Provider "${provider}" is not available.` });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  /**
   * GET /api/chat/conversations
   */
  async getConversations(req, res) {
    try {
      const conversations = await ChatService.getConversations(req.user);
      res.json(conversations);
    } catch (err) {
      console.error('getConversations error:', err);
      res.status(err.status || 500).json({ error: err.message });
    }
  },

  /**
   * POST /api/chat/conversations
   */
  async createConversation(req, res) {
    try {
      const { title, persona } = req.body || {};
      const conversation = await ChatService.createConversation(req.user, { title, persona });
      res.status(201).json(conversation);
    } catch (err) {
      console.error('createConversation error:', err);
      res.status(err.status || 500).json({ error: err.message });
    }
  },

  /**
   * GET /api/chat/conversations/:conversationId/messages
   */
  async getMessages(req, res) {
    try {
      const { conversationId } = req.params;
      const messages = await ChatService.getMessages(req.user, conversationId);
      res.json(messages);
    } catch (err) {
      console.error('getMessages error:', err);
      res.status(err.status || 500).json({ error: err.message });
    }
  },

  /**
   * POST /api/chat/conversations/:conversationId/messages
   */
  async sendMessage(req, res) {
    try {
      const { conversationId } = req.params;
      const { content, message } = req.body || {};
      const messageText = content || message;

      if (!messageText || !messageText.trim()) {
        return res.status(400).json({ error: 'Message content is required.' });
      }

      const result = await ChatService.sendMessage(req.user, conversationId, messageText);
      res.json(result);
    } catch (err) {
      console.error('sendMessage error:', err);
      res.status(err.status || 500).json({ error: err.message });
    }
  },

  /**
   * POST /api/chat/conversations/:conversationId/stream (Server-Sent Events)
   */
  async streamMessage(req, res) {
    const { conversationId } = req.params;
    const { content, message } = req.body || {};
    const messageText = content || message;

    if (!messageText || !messageText.trim()) {
      return res.status(400).json({ error: 'Message content is required.' });
    }

    // Initialize SSE Headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    try {
      const result = await ChatService.sendMessage(req.user, conversationId, messageText, {
        stream: true,
        onToken: (token) => {
          res.write(`data: ${JSON.stringify({ type: 'token', token })}\n\n`);
        }
      });

      res.write(`data: ${JSON.stringify({ type: 'done', result })}\n\n`);
      res.end();
    } catch (err) {
      console.error('streamMessage error:', err);
      res.write(`data: ${JSON.stringify({ type: 'error', error: err.message })}\n\n`);
      res.end();
    }
  },

  /**
   * PATCH /api/chat/conversations/:conversationId
   */
  async renameConversation(req, res) {
    try {
      const { conversationId } = req.params;
      const { title } = req.body || {};
      if (!title || !title.trim()) {
        return res.status(400).json({ error: 'New title is required.' });
      }

      const updated = await ChatService.renameConversation(req.user, conversationId, title);
      res.json(updated);
    } catch (err) {
      console.error('renameConversation error:', err);
      res.status(err.status || 500).json({ error: err.message });
    }
  },

  /**
   * DELETE /api/chat/conversations/:conversationId
   */
  async deleteConversation(req, res) {
    try {
      const { conversationId } = req.params;
      const result = await ChatService.deleteConversation(req.user, conversationId);
      res.json(result);
    } catch (err) {
      console.error('deleteConversation error:', err);
      res.status(err.status || 500).json({ error: err.message });
    }
  },

  /**
   * POST /api/chat/messages/:messageId/feedback
   */
  async recordFeedback(req, res) {
    try {
      const { messageId } = req.params;
      const { rating, feedbackText } = req.body || {};

      const result = await ChatService.recordFeedback(req.user, messageId, { rating, feedbackText });
      res.json(result);
    } catch (err) {
      console.error('recordFeedback error:', err);
      res.status(err.status || 500).json({ error: err.message });
    }
  }
};

export default chatController;
