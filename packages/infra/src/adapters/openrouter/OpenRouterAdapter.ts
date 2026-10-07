import { ProviderError } from '@semburat/shared';

import type { AIProvider } from '@semburat/domain';

export type FetchFn = (input: string | URL, init?: RequestInit) => Promise<Response>;

export interface OpenRouterConfig {
  apiKey: string;
  baseUrl?: string;
  model?: string;
  maxRetries?: number;
  fetch?: FetchFn;
}

const DEFAULT_BASE_URL = 'https://openrouter.ai/api/v1';
const DEFAULT_MODEL = 'google/gemini-2.0-flash-exp';
const DEFAULT_MAX_RETRIES = 3;
const INITIAL_BACKOFF_MS = 200;

type ChatCompletionChunk = {
  choices: Array<{
    delta: {
      content?: string;
    };
  }>;
};

export class OpenRouterAdapter implements AIProvider {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly model: string;
  private readonly maxRetries: number;
  private readonly fetchFn: FetchFn;

  constructor(config: OpenRouterConfig) {
    if (!config.apiKey) {
      throw new Error('OpenRouter API key is required');
    }
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl?.replace(/\/+$/, '') ?? DEFAULT_BASE_URL;
    this.model = config.model ?? DEFAULT_MODEL;
    this.maxRetries = config.maxRetries ?? DEFAULT_MAX_RETRIES;
    this.fetchFn = config.fetch ?? globalThis.fetch.bind(globalThis);
  }

  async generateStructured(prompt: string, schema: object): Promise<object> {
    const messages: Array<{ role: string; content: string }> = [
      {
        role: 'system',
        content:
          'You are a precise research assistant. Output ONLY valid JSON matching this schema: ' +
          JSON.stringify(schema),
      },
      { role: 'user', content: prompt },
    ];
    const body = {
      model: this.model,
      messages,
      response_format: { type: 'json_object' },
      temperature: 0,
    };
    const result = await this.requestJson(body);
    const content = this.extractContent(result);
    if (!content) {
      throw new ProviderError(
        'openrouter',
        'Structured generation returned empty content',
        undefined,
        {
          schema,
        }
      );
    }
    try {
      return JSON.parse(content) as object;
    } catch (err) {
      throw new ProviderError(
        'openrouter',
        'Failed to parse structured JSON response',
        err as Error,
        {
          contentPreview: content.slice(0, 200),
        }
      );
    }
  }

  async generateText(prompt: string): Promise<string> {
    const body = {
      model: this.model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    };
    const result = await this.requestJson(body);
    return this.extractContent(result) ?? '';
  }

  async *streamChat(messages: Array<{ role: string; content: string }>): AsyncIterable<string> {
    const body = {
      model: this.model,
      messages,
      stream: true,
      temperature: 0.7,
    };
    const response = await this.requestRaw(body);
    if (!response.body) {
      throw new ProviderError('openrouter', 'Streaming response has no body');
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split(/\r?\n\r?\n/);
        buffer = events.pop() ?? '';
        for (const event of events) {
          const data = this.parseSSE(event);
          if (data === null) continue;
          if (data === '[DONE]') return;
          const chunk = data as ChatCompletionChunk;
          const delta = chunk.choices?.[0]?.delta?.content;
          if (typeof delta === 'string' && delta.length > 0) yield delta;
        }
      }
      if (buffer) {
        const data = this.parseSSE(buffer);
        if (data && data !== '[DONE]') {
          const chunk = data as ChatCompletionChunk;
          const delta = chunk.choices?.[0]?.delta?.content;
          if (typeof delta === 'string' && delta.length > 0) yield delta;
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  private async requestJson(body: object): Promise<Record<string, unknown>> {
    const response = await this.requestRaw(body);
    return (await response.json()) as Record<string, unknown>;
  }

  private async requestRaw(body: object): Promise<Response> {
    const attempts = this.maxRetries + 1;
    for (let attempt = 0; attempt < attempts; attempt++) {
      let response: Response;
      try {
        response = await this.fetchFn(this.url('/chat/completions'), {
          method: 'POST',
          headers: this.headers(),
          body: JSON.stringify(body),
        });
      } catch (err) {
        if (attempt < this.maxRetries) {
          await this.backoff(attempt);
          continue;
        }
        throw new ProviderError('openrouter', 'Network request failed', err as Error);
      }
      if (response.ok) return response;
      const retryable = response.status >= 500 || response.status === 429;
      const text = await response.text();
      if (retryable && attempt < this.maxRetries) {
        await this.backoff(attempt);
        continue;
      }
      throw new ProviderError(
        'openrouter',
        'OpenRouter request failed: ' + response.status,
        undefined,
        {
          status: response.status,
          body: text.slice(0, 500),
        }
      );
    }
    throw new ProviderError('openrouter', 'Exceeded maximum retry attempts');
  }

  private parseSSE(event: string): ChatCompletionChunk | null | string {
    if (!event || event === '[DONE]') return '[DONE]';
    if (!event.startsWith('data:')) return null;
    const json = event.replace(/^data:\s*/, '').trim();
    if (json === '[DONE]') return '[DONE]';
    try {
      return JSON.parse(json) as ChatCompletionChunk;
    } catch {
      return null;
    }
  }

  private extractContent(result: Record<string, unknown>): string | null {
    const choices = result.choices as Array<{ message?: { content?: string } }> | undefined;
    return choices?.[0]?.message?.content ?? null;
  }

  private url(path: string): string {
    return this.baseUrl + path;
  }

  private headers(): Record<string, string> {
    return {
      Authorization: 'Bearer ' + this.apiKey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
  }

  private backoff(attempt: number): Promise<void> {
    const ms = INITIAL_BACKOFF_MS * 2 ** attempt;
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
