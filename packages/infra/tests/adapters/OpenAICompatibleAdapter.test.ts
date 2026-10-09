import { describe, it, expect, vi } from 'vitest';

import { OpenAICompatibleAdapter } from '../../src/adapters/openai-compatible/OpenAICompatibleAdapter.js';

function okResponse(payload: unknown): Response {
  return {
    ok: true,
    json: () => Promise.resolve(payload),
  } as unknown as Response;
}

describe('OpenAICompatibleAdapter', () => {
  it('posts to the configured base URL and returns generated text', async () => {
    const mockFetch = vi
      .fn()
      .mockResolvedValue(okResponse({ choices: [{ message: { content: 'halo dunia' } }] }));
    const adapter = new OpenAICompatibleAdapter({
      provider: 'groq',
      apiKey: 'gsk-test',
      baseUrl: 'https://api.groq.com/openai/v1/',
      model: 'llama-3.3-70b-versatile',
      fetch: mockFetch,
    });

    const result = await adapter.generateText('halo');

    expect(result).toBe('halo dunia');
    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe('https://api.groq.com/openai/v1/chat/completions');
    expect((init as RequestInit).headers).toMatchObject({ Authorization: 'Bearer gsk-test' });
    expect(JSON.parse((init as RequestInit).body as string).model).toBe('llama-3.3-70b-versatile');
  });

  it('parses structured JSON output', async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      okResponse({
        choices: [{ message: { content: JSON.stringify({ summary: 'ringkas', claims: [] }) } }],
      })
    );
    const adapter = new OpenAICompatibleAdapter({
      apiKey: 'key',
      baseUrl: 'https://api.example.com/v1',
      model: 'model-x',
      fetch: mockFetch,
    });

    const result = await adapter.generateStructured('extract', { type: 'object' });

    expect(result).toEqual({ summary: 'ringkas', claims: [] });
  });

  it('throws a provider-labelled error when structured output is empty', async () => {
    const mockFetch = vi
      .fn()
      .mockResolvedValue(okResponse({ choices: [{ message: { content: '' } }] }));
    const adapter = new OpenAICompatibleAdapter({
      provider: 'gemini',
      apiKey: 'key',
      baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
      model: 'gemini-3.6-flash',
      fetch: mockFetch,
    });

    await expect(adapter.generateStructured('x', {})).rejects.toThrow(/gemini/);
  });

  it('requires apiKey, baseUrl, and model', () => {
    expect(() => new OpenAICompatibleAdapter({ apiKey: '', baseUrl: 'b', model: 'm' })).toThrow(
      /API key/
    );
    expect(() => new OpenAICompatibleAdapter({ apiKey: 'k', baseUrl: '', model: 'm' })).toThrow(
      /base URL/
    );
    expect(() => new OpenAICompatibleAdapter({ apiKey: 'k', baseUrl: 'b', model: '' })).toThrow(
      /model/
    );
  });
});
