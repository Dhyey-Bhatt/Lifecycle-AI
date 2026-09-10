/**
 * AIProvider Base Class (Interface Contract)
 * 
 * All AI providers (OpenAI, Local/Ollama, Custom Lifecycle LLM, Anthropic, etc.)
 * must inherit from this class and implement its standard interface.
 * 
 * This ensures that the chat service, API controllers, and frontend
 * remain completely model-agnostic.
 */
export class AIProvider {
  constructor(config = {}) {
    this.name = config.name || 'base-provider';
    this.defaultModel = config.defaultModel || 'default-model';
    this.config = config;
  }

  /**
   * Returns provider and active model metadata
   */
  getModelInfo() {
    return {
      provider: this.name,
      model: this.defaultModel,
      isConfigured: true
    };
  }

  /**
   * Health check to verify provider connectivity and API key validity
   */
  async healthCheck() {
    throw new Error(`healthCheck() is not implemented in provider "${this.name}"`);
  }

  /**
   * Generates a single complete AI response
   * @param {Object} params
   * @param {Array<{role: string, content: string}>} params.messages - Conversation history
   * @param {string} params.systemPrompt - Role & context system prompt
   * @param {number} [params.temperature=0.7] - Creativity parameter
   * @param {number} [params.maxTokens=1000] - Max tokens to generate
   * @param {string} [params.model] - Specific model override
   * @returns {Promise<{
   *   text: string,
   *   model: string,
   *   provider: string,
   *   usage?: { promptTokens: number, completionTokens: number, totalTokens: number },
   *   latencyMs: number
   * }>}
   */
  async generateResponse(params) {
    throw new Error(`generateResponse() is not implemented in provider "${this.name}"`);
  }

  /**
   * Streams token chunks for real-time response generation
   * @param {Object} params
   * @param {Array<{role: string, content: string}>} params.messages
   * @param {string} params.systemPrompt
   * @param {Function} params.onToken - Callback (token: string) => void
   * @param {Function} params.onComplete - Callback (fullResponse: Object) => void
   * @param {Function} params.onError - Callback (error: Error) => void
   */
  async streamResponse(params) {
    throw new Error(`streamResponse() is not implemented in provider "${this.name}"`);
  }

  /**
   * Estimates or calculates token count for a given text
   * @param {string} text
   * @returns {number}
   */
  countTokens(text = '') {
    // Standard heuristic fallback: ~4 characters per token
    return Math.ceil((text || '').length / 4);
  }

  /**
   * Optional: Generate text embeddings for future RAG / semantic search
   * @param {string|string[]} text
   * @returns {Promise<number[]|number[][]>}
   */
  async embed(text) {
    throw new Error(`embed() is not implemented in provider "${this.name}"`);
  }
}

export default AIProvider;
