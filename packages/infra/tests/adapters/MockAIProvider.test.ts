import { describe, it, expect } from 'vitest';
import { MockAIProvider } from '../../src/adapters/mock/MockAIProvider.js';

const requiredSchema = (required: string[]): object => ({
  type: 'object',
  required,
  properties: {},
});

describe('MockAIProvider.generateStructured', () => {
  it('returns a research extraction shape when the schema requires summary and claims', async () => {
    const provider = new MockAIProvider();

    const result = (await provider.generateStructured(
      'extract research',
      requiredSchema(['summary', 'claims', 'conflicts', 'confidenceScore'])
    )) as { summary?: string; claims?: unknown[]; conflicts?: unknown[]; confidenceScore?: number };

    expect(result.summary).toBeTruthy();
    expect(Array.isArray(result.claims)).toBe(true);
    expect(result.claims?.length).toBeGreaterThan(0);
    expect(Array.isArray(result.conflicts)).toBe(true);
    expect(typeof result.confidenceScore).toBe('number');
  });

  it('returns a fact extraction shape with evidence when the schema requires facts', async () => {
    const provider = new MockAIProvider();

    const result = (await provider.generateStructured(
      'extract facts',
      requiredSchema(['facts'])
    )) as { facts?: Array<{ statement: string; confidence: number; evidence: unknown[] }> };

    expect(Array.isArray(result.facts)).toBe(true);
    expect(result.facts?.length).toBeGreaterThan(0);
    expect(result.facts?.[0].statement).toBeTruthy();
    expect(Array.isArray(result.facts?.[0].evidence)).toBe(true);
  });

  it('returns a verification shape when the schema requires verificationStatus', async () => {
    const provider = new MockAIProvider();

    const result = (await provider.generateStructured(
      'verify claim',
      requiredSchema(['verificationStatus', 'confidence'])
    )) as { verificationStatus?: string; confidence?: number };

    expect(result.verificationStatus).toBe('verified');
    expect(typeof result.confidence).toBe('number');
  });

  it('returns a full editorial article when the schema requires editorial fields', async () => {
    const provider = new MockAIProvider();

    const result = (await provider.generateStructured(
      'editorial article',
      requiredSchema([
        'title',
        'dek',
        'body',
        'summary',
        'key_points',
        'faq',
        'seo_title',
        'meta_description',
      ])
    )) as {
      title?: string;
      body?: string;
      key_points?: unknown[];
      faq?: Array<{ question?: string; answer?: string }>;
      seo_title?: string;
      meta_description?: string;
    };

    expect(result.title).toBeTruthy();
    expect(result.body).toBeTruthy();
    expect(result.key_points?.length).toBeGreaterThan(0);
    expect(result.faq?.length).toBeGreaterThan(0);
    expect(result.faq?.[0].question).toBeTruthy();
    expect(result.faq?.[0].answer).toBeTruthy();
    expect(result.seo_title).toBeTruthy();
    expect(result.meta_description).toBeTruthy();
  });

  it('falls back to prompt-based responses when no schema is provided', async () => {
    const provider = new MockAIProvider();

    const result = (await provider.generateStructured('verify conflict konflik')) as {
      status?: string;
    };

    expect(result.status).toBe('verified');
  });
});
