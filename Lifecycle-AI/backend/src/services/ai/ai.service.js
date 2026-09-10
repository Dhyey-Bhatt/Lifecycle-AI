import { OpenAIProvider } from './openai.provider.js';
import { LocalAIProvider } from './local.provider.js';

/**
 * AIService (AI Gateway / Provider Factory)
 * 
 * Central gateway that decouples the entire application from any single AI vendor.
 * Supports OpenAI (Cloud) and Ollama / Local AI out of the box.
 * 
 * Switching between OpenAI, Local LLM, and future custom Lifecycle AI models requires
 * only updating `AI_PROVIDER` in .env, without touching any controllers or frontend code.
 */
class AIService {
  constructor() {
    this.providers = new Map();
    this.activeProviderName = (process.env.AI_PROVIDER || 'openai').toLowerCase();
    this.initProviders();
  }

  initProviders() {
    // 1. Register OpenAI Provider
    const openaiProvider = new OpenAIProvider({
      apiKey: process.env.OPENAI_API_KEY,
      defaultModel: process.env.OPENAI_MODEL || process.env.AI_MODEL || 'gpt-4o-mini'
    });
    this.providers.set('openai', openaiProvider);

    // 2. Register Local Provider (Ollama / Local AI)
    const localProvider = new LocalAIProvider({
      endpoint: process.env.OLLAMA_BASE_URL || process.env.LOCAL_AI_ENDPOINT || 'http://localhost:11434',
      defaultModel: process.env.LOCAL_AI_MODEL || process.env.OLLAMA_MODEL || 'llama3:latest'
    });
    this.providers.set('local', localProvider);
  }

  /**
   * Register a new custom provider at runtime
   */
  registerProvider(name, providerInstance) {
    this.providers.set(name.toLowerCase(), providerInstance);
  }

  /**
   * Sets active provider dynamically at runtime (for dev testing)
   */
  setActiveProvider(name) {
    const cleanName = (name || '').toLowerCase();
    if (this.providers.has(cleanName)) {
      this.activeProviderName = cleanName;
      return true;
    }
    return false;
  }

  /**
   * Retrieves active provider instance
   */
  getProvider(name = null) {
    const providerName = (name || this.activeProviderName || process.env.AI_PROVIDER || 'openai').toLowerCase();
    const provider = this.providers.get(providerName);

    if (!provider) {
      console.warn(`⚠️ AI Provider "${providerName}" not found. Falling back to "openai".`);
      return this.providers.get('openai');
    }

    return provider;
  }

  /**
   * Returns active model and provider metadata
   */
  getModelInfo() {
    const provider = this.getProvider();
    const info = provider.getModelInfo();
    return {
      ...info,
      activeProvider: this.activeProviderName,
      availableProviders: Array.from(this.providers.keys())
    };
  }

  /**
   * Returns comprehensive status diagnostics for all registered providers
   */
  async getProvidersStatus() {
    const statuses = {};
    for (const [name, provider] of this.providers.entries()) {
      try {
        const health = await provider.healthCheck();
        const info = provider.getModelInfo();
        statuses[name] = {
          ...info,
          ...health,
          isActive: name === this.activeProviderName
        };
      } catch (e) {
        statuses[name] = {
          provider: name,
          status: 'error',
          error: e.message,
          isActive: name === this.activeProviderName
        };
      }
    }

    return {
      activeProvider: this.activeProviderName,
      providers: statuses
    };
  }

  /**
   * Generates a complete AI response through the active provider
   */
  async generateResponse(params = {}) {
    const provider = this.getProvider(params.provider);
    return provider.generateResponse(params);
  }

  /**
   * Streams token chunks through the active provider
   */
  async streamResponse(params = {}) {
    const provider = this.getProvider(params.provider);
    return provider.streamResponse(params);
  }

  /**
   * Health check on active AI provider
   */
  async healthCheck() {
    const provider = this.getProvider();
    return provider.healthCheck();
  }
}

export const aiService = new AIService();
export default aiService;
