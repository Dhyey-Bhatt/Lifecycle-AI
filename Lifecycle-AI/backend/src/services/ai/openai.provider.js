import OpenAI from 'openai';
import { AIProvider } from './ai.provider.js';

/**
 * OpenAIProvider
 * 
 * Production implementation of AIProvider backed by the official OpenAI Node SDK.
 * Exposes both synchronous completions and token streaming.
 */
export class OpenAIProvider extends AIProvider {
  constructor(config = {}) {
    super({
      name: 'openai',
      defaultModel: config.defaultModel || process.env.AI_MODEL || 'gpt-4o-mini',
      ...config
    });

    const apiKey = config.apiKey || process.env.OPENAI_API_KEY;
    this.apiKey = apiKey;

    if (apiKey && apiKey !== 'your_openai_api_key' && !apiKey.startsWith('sk-placeholder')) {
      this.client = new OpenAI({ apiKey });
      this.isConfigured = true;
    } else {
      this.client = null;
      this.isConfigured = false;
    }
  }

  getModelInfo() {
    return {
      provider: 'openai',
      model: this.defaultModel,
      isConfigured: this.isConfigured,
      capabilities: ['chat', 'stream', 'embeddings', 'tool_calling']
    };
  }

  async healthCheck() {
    if (!this.isConfigured || !this.client) {
      return {
        status: 'unconfigured',
        provider: 'openai',
        message: 'OPENAI_API_KEY is not configured in backend/.env'
      };
    }

    try {
      const start = Date.now();
      await this.client.models.list();
      return {
        status: 'healthy',
        provider: 'openai',
        latencyMs: Date.now() - start
      };
    } catch (error) {
      return {
        status: 'error',
        provider: 'openai',
        message: error.message
      };
    }
  }

  /**
   * Helper: Formats the system prompt and conversation messages for OpenAI Chat API
   */
  _buildOpenAIMessages(messages, systemPrompt) {
    const formatted = [];

    if (systemPrompt && systemPrompt.trim()) {
      formatted.push({
        role: 'system',
        content: systemPrompt.trim()
      });
    }

    for (const msg of messages) {
      formatted.push({
        role: msg.role === 'bot' || msg.role === 'assistant' ? 'assistant' : msg.role,
        content: String(msg.content || msg.text || '')
      });
    }

    return formatted;
  }

  /**
   * Generate complete response via OpenAI Chat Completion API
   */
  async generateResponse({
    messages = [],
    systemPrompt = '',
    temperature = 0.7,
    maxTokens = 1500,
    model = this.defaultModel
  } = {}) {
    const startTime = Date.now();

    if (!this.isConfigured || !this.client) {
      // Fallback message when key is not yet set by user
      const latencyMs = Date.now() - startTime;
      return {
        text: `⚠️ **OpenAI API Key Not Configured**\n\nTo enable live AI completions with OpenAI, please add your API key in \`backend/.env\`:\n\`\`\`bash\nOPENAI_API_KEY=sk-proj-...\nAI_PROVIDER=openai\nAI_MODEL=gpt-4o-mini\n\`\`\`\nThen restart the backend server. The AI gateway is running in model-agnostic ready mode.`,
        model: model,
        provider: 'openai',
        latencyMs,
        usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
        isDemoFallback: true
      };
    }

    try {
      const openAiMessages = this._buildOpenAIMessages(messages, systemPrompt);

      const response = await this.client.chat.completions.create({
        model: model || this.defaultModel,
        messages: openAiMessages,
        temperature: Number(temperature) || 0.7,
        max_tokens: Number(maxTokens) || 1500
      });

      const choice = response.choices[0];
      const text = choice?.message?.content || '';
      const latencyMs = Date.now() - startTime;

      return {
        text,
        model: response.model || model,
        provider: 'openai',
        latencyMs,
        usage: {
          promptTokens: response.usage?.prompt_tokens || 0,
          completionTokens: response.usage?.completion_tokens || 0,
          totalTokens: response.usage?.total_tokens || 0
        },
        finishReason: choice?.finish_reason || 'stop'
      };
    } catch (error) {
      console.error('❌ OpenAIProvider Error:', error);
      const latencyMs = Date.now() - startTime;

      // Handle common OpenAI API errors gracefully
      let errorMessage = error.message;
      if (error.status === 401) {
        errorMessage = 'Invalid OpenAI API key. Please check your OPENAI_API_KEY in backend/.env.';
      } else if (error.status === 429) {
        errorMessage = 'OpenAI rate limit or quota exceeded. Please check your OpenAI account billing.';
      }

      throw new Error(`OpenAI Provider Error: ${errorMessage}`);
    }
  }

  /**
   * Real-time Token Streaming via Server-Sent Events / Chunk callback
   */
  async streamResponse({
    messages = [],
    systemPrompt = '',
    temperature = 0.7,
    maxTokens = 1500,
    model = this.defaultModel,
    onToken,
    onComplete,
    onError
  } = {}) {
    const startTime = Date.now();

    if (!this.isConfigured || !this.client) {
      const fallbackText = `⚠️ **OpenAI API Key Not Configured**\n\nTo enable live AI streaming with OpenAI, please add your key to \`backend/.env\`:\n\`\`\`bash\nOPENAI_API_KEY=sk-proj-...\nAI_PROVIDER=openai\nAI_MODEL=gpt-4o-mini\n\`\`\`\nRestart the server to begin generating real AI responses.`;
      
      // Simulate streaming for friendly UX fallback
      const words = fallbackText.split(' ');
      for (const word of words) {
        if (onToken) onToken(word + ' ');
        await new Promise(r => setTimeout(r, 20));
      }

      const result = {
        text: fallbackText,
        model: model,
        provider: 'openai',
        latencyMs: Date.now() - startTime,
        isDemoFallback: true
      };
      if (onComplete) onComplete(result);
      return result;
    }

    try {
      const openAiMessages = this._buildOpenAIMessages(messages, systemPrompt);

      const stream = await this.client.chat.completions.create({
        model: model || this.defaultModel,
        messages: openAiMessages,
        temperature: Number(temperature) || 0.7,
        max_tokens: Number(maxTokens) || 1500,
        stream: true
      });

      let fullText = '';

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content || '';
        if (delta) {
          fullText += delta;
          if (onToken) onToken(delta);
        }
      }

      const latencyMs = Date.now() - startTime;
      const result = {
        text: fullText,
        model: model || this.defaultModel,
        provider: 'openai',
        latencyMs,
        usage: {
          promptTokens: this.countTokens(systemPrompt + messages.map(m => m.content).join(' ')),
          completionTokens: this.countTokens(fullText),
          totalTokens: this.countTokens(systemPrompt + messages.map(m => m.content).join(' ') + fullText)
        }
      };

      if (onComplete) onComplete(result);
      return result;
    } catch (error) {
      console.error('❌ OpenAI Stream Error:', error);
      if (onError) onError(error);
      throw error;
    }
  }

  /**
   * Future RAG Embedding using text-embedding-3-small
   */
  async embed(text) {
    if (!this.isConfigured || !this.client) {
      throw new Error('OpenAI Provider not configured for embeddings');
    }
    const input = Array.isArray(text) ? text : [text];
    const response = await this.client.embeddings.create({
      model: 'text-embedding-3-small',
      input
    });
    return Array.isArray(text)
      ? response.data.map(d => d.embedding)
      : response.data[0].embedding;
  }
}

export default OpenAIProvider;
