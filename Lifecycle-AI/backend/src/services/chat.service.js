import { aiService } from './ai/ai.service.js';
import PersonaService from './persona.service.js';
import ContextService from './context.service.js';
import { supabase, isMock } from '../../supabase.js';

// In-Memory Storage for Conversations & Messages (with persistence during runtime)
const inMemoryStore = {
  conversations: [
    {
      id: 'conv_demo_01',
      user_id: 'user_admin',
      title: 'MacBook & Refrigerator Warranties',
      persona: 'ADMIN',
      provider: 'openai',
      model: 'gpt-4o-mini',
      created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 2).toISOString()
    }
  ],
  messages: [
    {
      id: 'msg_demo_01',
      conversation_id: 'conv_demo_01',
      user_id: 'user_admin',
      role: 'user',
      content: 'When does the warranty for my MacBook Pro expire?',
      metadata: {},
      created_at: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
      id: 'msg_demo_02',
      conversation_id: 'conv_demo_01',
      user_id: 'user_admin',
      role: 'assistant',
      content: 'Your **MacBook Pro 16" M3 Max** (Serial: `C02G8490MD6R`) is covered under **AppleCare+ Extended with Theft and Loss** through **January 15, 2027**.\n\nIts current warranty standing is **Valid** (Active 3-Year Plan with $99 tier 1 accidental damage deductible).',
      metadata: {
        provider: 'openai',
        model: 'gpt-4o-mini',
        latencyMs: 380,
        tokens: { promptTokens: 320, completionTokens: 64, totalTokens: 384 }
      },
      created_at: new Date(Date.now() - 3600000 * 2 + 1000).toISOString()
    }
  ],
  feedback: []
};

export class ChatService {
  /**
   * Retrieves all conversations belonging to the authenticated user
   */
  static async getConversations(user) {
    const userId = user.id;

    if (supabase && !isMock) {
      try {
        const { data, error } = await supabase
          .from('conversations')
          .select('*')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (err) {
        console.warn('Supabase query failed, falling back to in-memory store:', err.message);
      }
    }

    // Fallback in-memory
    const userConvs = inMemoryStore.conversations
      .filter(c => c.user_id === userId || c.user_id === 'user_admin')
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

    return userConvs;
  }

  /**
   * Retrieves a single conversation by ID with ownership verification
   */
  static async getConversation(user, conversationId) {
    const userId = user.id;

    if (supabase && !isMock) {
      try {
        const { data, error } = await supabase
          .from('conversations')
          .select('*')
          .eq('id', conversationId)
          .eq('user_id', userId)
          .single();

        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase getConversation failed:', err.message);
      }
    }

    const conv = inMemoryStore.conversations.find(
      c => c.id === conversationId && (c.user_id === userId || c.user_id === 'user_admin')
    );
    return conv || null;
  }

  /**
   * Creates a new conversation for the authenticated user
   */
  static async createConversation(user, { title, persona } = {}) {
    const userId = user.id;
    const personaKey = PersonaService.resolvePersonaKey(user.role);
    const modelInfo = aiService.getModelInfo();

    const newConversation = {
      id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      user_id: userId,
      title: title || 'New Conversation',
      persona: persona || personaKey,
      provider: modelInfo.provider,
      model: modelInfo.model,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (supabase && !isMock) {
      try {
        const { data, error } = await supabase
          .from('conversations')
          .insert(newConversation)
          .select()
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase insert conversation failed, saving in memory:', err.message);
      }
    }

    inMemoryStore.conversations.unshift(newConversation);
    return newConversation;
  }

  /**
   * Retrieves message history for a conversation
   */
  static async getMessages(user, conversationId, limit = 50) {
    // 1. Verify conversation ownership
    const conv = await this.getConversation(user, conversationId);
    if (!conv) {
      const err = new Error('Conversation not found or access denied');
      err.status = 404;
      throw err;
    }

    if (supabase && !isMock) {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true })
          .limit(limit);

        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase getMessages failed:', err.message);
      }
    }

    return inMemoryStore.messages
      .filter(m => m.conversation_id === conversationId)
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      .slice(-limit);
  }

  /**
   * Dispatches a user message, processes it via the AI Gateway with grounded persona context,
   * stores both user and assistant messages, and updates conversation metadata.
   */
  static async sendMessage(user, conversationId, userContent, { stream = false, onToken } = {}) {
    if (!userContent || !userContent.trim()) {
      const err = new Error('Message content cannot be empty');
      err.status = 400;
      throw err;
    }

    // 1. Verify conversation exists and user owns it
    let conv = await this.getConversation(user, conversationId);
    if (!conv) {
      // Auto-create conversation if not existing
      conv = await this.createConversation(user, { title: userContent.slice(0, 40) });
      conversationId = conv.id;
    }

    // 2. Fetch existing history for context window (last 20 messages)
    const history = await this.getMessages(user, conversationId, 20);

    // 3. Save User Message
    const userMessage = {
      id: `msg_u_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      conversation_id: conversationId,
      user_id: user.id,
      role: 'user',
      content: userContent.trim(),
      metadata: {},
      created_at: new Date().toISOString()
    };
    inMemoryStore.messages.push(userMessage);

    // 4. Build Grounded Context & System Prompt based on User's verified Role
    const appContext = ContextService.buildContextForUser(user, userContent);
    const systemPrompt = PersonaService.getSystemPrompt(user, appContext);

    // 5. Prepare message array for AI Gateway
    const formattedMessages = [
      ...history.map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: userContent.trim() }
    ];

    // 6. Generate AI response via Model-Agnostic Gateway
    let aiResult;
    if (stream && onToken) {
      aiResult = await aiService.streamResponse({
        messages: formattedMessages,
        systemPrompt,
        onToken
      });
    } else {
      aiResult = await aiService.generateResponse({
        messages: formattedMessages,
        systemPrompt
      });
    }

    // 7. Save Assistant Message
    const assistantMessage = {
      id: `msg_a_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      conversation_id: conversationId,
      user_id: user.id,
      role: 'assistant',
      content: aiResult.text,
      metadata: {
        provider: aiResult.provider,
        model: aiResult.model,
        latencyMs: aiResult.latencyMs,
        usage: aiResult.usage,
        isDemoFallback: aiResult.isDemoFallback || false,
        persona: PersonaService.resolvePersonaKey(user.role),
        training_eligible: true
      },
      created_at: new Date().toISOString()
    };
    inMemoryStore.messages.push(assistantMessage);

    // 8. Update conversation title and timestamp if needed
    const updatedTitle = conv.title === 'New Conversation'
      ? userContent.slice(0, 35) + (userContent.length > 35 ? '...' : '')
      : conv.title;

    conv.title = updatedTitle;
    conv.updated_at = new Date().toISOString();

    return {
      conversation: conv,
      userMessage,
      assistantMessage
    };
  }

  /**
   * Renames a conversation title
   */
  static async renameConversation(user, conversationId, title) {
    const conv = await this.getConversation(user, conversationId);
    if (!conv) {
      const err = new Error('Conversation not found');
      err.status = 404;
      throw err;
    }

    conv.title = (title || '').trim() || conv.title;
    conv.updated_at = new Date().toISOString();

    return conv;
  }

  /**
   * Deletes a conversation and its messages
   */
  static async deleteConversation(user, conversationId) {
    const conv = await this.getConversation(user, conversationId);
    if (!conv) {
      const err = new Error('Conversation not found');
      err.status = 404;
      throw err;
    }

    inMemoryStore.conversations = inMemoryStore.conversations.filter(c => c.id !== conversationId);
    inMemoryStore.messages = inMemoryStore.messages.filter(m => m.conversation_id !== conversationId);

    return { success: true, id: conversationId };
  }

  /**
   * Records user feedback (👍 / 👎) for model evaluation and future dataset curation
   */
  static async recordFeedback(user, messageId, { rating, feedbackText } = {}) {
    const message = inMemoryStore.messages.find(m => m.id === messageId);
    if (!message) {
      const err = new Error('Message not found');
      err.status = 404;
      throw err;
    }

    const feedbackEntry = {
      id: `fb_${Date.now()}`,
      message_id: messageId,
      conversation_id: message.conversation_id,
      user_id: user.id,
      rating: rating === 'thumbs_up' ? 'positive' : 'negative',
      feedback_text: feedbackText || '',
      model: message.metadata?.model,
      provider: message.metadata?.provider,
      created_at: new Date().toISOString()
    };

    inMemoryStore.feedback.push(feedbackEntry);
    return { success: true, feedback: feedbackEntry };
  }
}

export default ChatService;
