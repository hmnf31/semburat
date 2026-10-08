import { describe, expect, it } from 'vitest';
import { createAiProvider, createContainer, createResearchProvider } from './container.js';
import type { Env } from './env.js';
function makeEnv(overrides: Partial<Env> = {}): Env {
  return {
    DB: undefined as never,
    ASSETS: undefined as never,
    ENVIRONMENT: 'test',
    ...overrides,
  } as Env;
}
describe('createAiProvider', () => {
  it('uses OpenRouter when an API key is configured', () => {
    const result = createAiProvider(makeEnv({ OPENROUTER_API_KEY: 'sk-test' }));
    expect(result.mode).toBe('openrouter');
    expect(result.provider.constructor.name).toBe('OpenRouterAdapter');
  });
  it('falls back to the mock provider without an API key', () => {
    const result = createAiProvider(makeEnv());
    expect(result.mode).toBe('mock');
    expect(result.provider.constructor.name).toBe('MockAIProvider');
  });
});
describe('createResearchProvider', () => {
  it('composes news, RSS and trends adapters', () => {
    const provider = createResearchProvider();
    expect(provider.constructor.name).toBe('EnhancedResearchAdapter');
  });
});
describe('createContainer', () => {
  it('wires the pipeline, discovery and review services', () => {
    const container = createContainer(makeEnv());
    expect(container.aiMode).toBe('mock');
    expect(container.trendDiscovery).toBeDefined();
    expect(container.pipeline).toBeDefined();
    expect(container.reviewQueue).toBeDefined();
    expect(container.storage).toBeDefined();
    expect(container.articleRepo).toBeDefined();
    expect(container.trendRepo).toBeDefined();
    expect(container.analyticsRepo).toBeDefined();
  });
  it('reports the research provider implementation', () => {
    const container = createContainer(makeEnv());
    expect(container.researchProvider.constructor.name).toBe('EnhancedResearchAdapter');
  });
});
