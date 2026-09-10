import { AIProvider } from './ai.provider.js';

/**
 * LocalAIProvider (Ollama / Local Open-Source LLM Provider)
 * 
 * Connects directly to local Ollama server or any OpenAI-compatible local server (vLLM / llama.cpp / LocalAI).
 * Allows 100% free AI development without incurring any cloud API costs.
 * 
 * Supports:
 * - Real-time streaming via Ollama NDJSON chunks
 * - Model status verification and availability check
 * - Actionable diagnostics and installation guidance
 */
export class LocalAIProvider extends AIProvider {
  constructor(config = {}) {
    super({
      name: 'local',
      defaultModel: config.defaultModel || process.env.LOCAL_AI_MODEL || process.env.OLLAMA_MODEL || 'llama3:latest',
      ...config
    });

    this.endpoint = (config.endpoint || process.env.OLLAMA_BASE_URL || process.env.LOCAL_AI_ENDPOINT || 'http://localhost:11434').replace(/\/+$/, '');
  }

  getModelInfo() {
    return {
      provider: 'local',
      providerLabel: 'Local AI (Ollama / Self-Hosted)',
      model: this.defaultModel,
      endpoint: this.endpoint,
      isConfigured: true,
      description: 'Free local open-source model running on your device via Ollama'
    };
  }

  /**
   * Health check to test if Ollama server is running and model is loaded
   */
  async healthCheck() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`${this.endpoint}/api/tags`, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const availableModels = (data.models || []).map(m => m.name);
        const hasConfiguredModel = availableModels.some(name => 
          name === this.defaultModel || name.startsWith(this.defaultModel.split(':')[0])
        );

        return {
          status: 'healthy',
          provider: 'local',
          endpoint: this.endpoint,
          configuredModel: this.defaultModel,
          hasConfiguredModel,
          installedModels: availableModels
        };
      }
      return { status: 'unreachable', provider: 'local', endpoint: this.endpoint };
    } catch (e) {
      return {
        status: 'offline',
        provider: 'local',
        endpoint: this.endpoint,
        error: e.message,
        helpMessage: `Ollama is offline. Start Ollama with 'ollama serve' or launch the Ollama app.`
      };
    }
  }

  /**
   * Synchronous response generation via Ollama /api/chat
   */
  async generateResponse({
    messages = [],
    systemPrompt = '',
    temperature = 0.7,
    maxTokens = 1500,
    model = this.defaultModel
  } = {}) {
    const startTime = Date.now();
    const activeModel = model || this.defaultModel;

    const formattedMessages = [
      ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
      ...messages.map(m => ({
        role: m.role === 'bot' || m.role === 'assistant' ? 'assistant' : m.role,
        content: String(m.content || m.text || '')
      }))
    ];

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout for local inference

      const response = await fetch(`${this.endpoint}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          model: activeModel,
          messages: formattedMessages,
          stream: false,
          options: {
            temperature: Number(temperature) || 0.7,
            num_predict: Number(maxTokens) || 1500
          }
        })
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        if (response.status === 404 || errorText.includes('not found')) {
          throw new Error(`Local model "${activeModel}" is not installed in Ollama. Run: "ollama run ${activeModel}" in your terminal to install it.`);
        }
        throw new Error(`Ollama returned HTTP error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      const latencyMs = Date.now() - startTime;

      return {
        text: data.message?.content || data.response || '',
        model: activeModel,
        provider: 'local',
        latencyMs,
        usage: {
          promptTokens: data.prompt_eval_count || 0,
          completionTokens: data.eval_count || 0,
          totalTokens: (data.prompt_eval_count || 0) + (data.eval_count || 0)
        }
      };
    } catch (err) {
      console.warn('⚠️ LocalAIProvider Error:', err.message);
      const latencyMs = Date.now() - startTime;

      let guidanceMessage = `⚠️ **Local AI (Ollama) Unavailable**\n\nCould not connect to Ollama at \`${this.endpoint}\`.\n\n**To run for FREE using Local AI:**\n1. Install Ollama from [https://ollama.com](https://ollama.com)\n2. Download a model in your terminal:\n   \`\`\`bash\n   ollama run llama3\n   \`\`\`\n3. Configure \`backend/.env\`:\n   \`\`\`bash\n   AI_PROVIDER=local\n   LOCAL_AI_MODEL=llama3:latest\n   \`\`\`\n4. Restart the backend server.`;

      if (err.message.includes('not installed')) {
        guidanceMessage = `⚠️ **Model Not Found in Ollama**\n\n${err.message}`;
      }

      return {
        text: guidanceMessage,
        model: activeModel,
        provider: 'local',
        latencyMs,
        isDemoFallback: true
      };
    }
  }

  /**
   * Real-time Token Streaming via Ollama Stream NDJSON
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
    const activeModel = model || this.defaultModel;

    const formattedMessages = [
      ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
      ...messages.map(m => ({
        role: m.role === 'bot' || m.role === 'assistant' ? 'assistant' : m.role,
        content: String(m.content || m.text || '')
      }))
    ];

    try {
      const response = await fetch(`${this.endpoint}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: activeModel,
          messages: formattedMessages,
          stream: true,
          options: {
            temperature: Number(temperature) || 0.7,
            num_predict: Number(maxTokens) || 1500
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Ollama returned HTTP ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let fullText = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop(); // Keep partial line in buffer

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const parsed = JSON.parse(line);
            const chunk = parsed.message?.content || '';
            if (chunk) {
              fullText += chunk;
              if (onToken) onToken(chunk);
            }
          } catch (e) {
            // Ignore parse errors on partial lines
          }
        }
      }

      const latencyMs = Date.now() - startTime;
      const result = {
        text: fullText,
        model: activeModel,
        provider: 'local',
        latencyMs
      };

      if (onComplete) onComplete(result);
      return result;
    } catch (err) {
      console.warn('⚠️ Ollama streaming failed, falling back to generateResponse:', err.message);
      const fallbackResult = await this.generateResponse({ messages, systemPrompt, temperature, maxTokens, model: activeModel });
      if (onToken) onToken(fallbackResult.text);
      if (onComplete) onComplete(fallbackResult);
      return fallbackResult;
    }
  }
}

export default LocalAIProvider;
