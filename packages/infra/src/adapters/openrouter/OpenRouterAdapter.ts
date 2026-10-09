import { OpenAICompatibleAdapter } from '../openai-compatible/OpenAICompatibleAdapter.js';

import type { FetchFn } from '../openai-compatible/OpenAICompatibleAdapter.js';

export interface OpenRouterConfig {
  apiKey: string;
  baseUrl?: string;
  model?: string;
  maxRetries?: number;
  fetch?: FetchFn;
}

const DEFAULT_BASE_URL = 'https://openrouter.ai/api/v1';
const DEFAULT_MODEL = 'google/gemini-2.0-flash-exp';

export class OpenRouterAdapter extends OpenAICompatibleAdapter {
  constructor(config: OpenRouterConfig) {
    super({
      provider: 'openrouter',
      apiKey: config.apiKey,
      baseUrl: config.baseUrl ?? DEFAULT_BASE_URL,
      model: config.model ?? DEFAULT_MODEL,
      maxRetries: config.maxRetries,
      fetch: config.fetch,
    });
  }
}
