import { describe, it, expect, vi, beforeEach } from 'vitest';
import { XPublisher } from '../../../src/adapters/publishing/XPublisher.js';
import { ContentVariant, Platform, ApprovalState } from '@semburat/domain';
import type { ContentVariantId, ArticleId } from '@semburat/shared';

const ACCESS_TOKEN = 'test-bearer-token';

function makeVariant(
  overrides: Partial<{
    id: ContentVariantId;
    articleId: ArticleId;
    platform: Platform;
    format: string;
    content: string;
    approvalState: ApprovalState;
  }> = {}
): ContentVariant {
  return new ContentVariant({
    id: '550e8400-e29b-41d4-a716-446655440000',
    articleId: '550e8400-e29b-41d4-a716-446655440001',
    platform: Platform.X,
    format: 'text',
    content: 'Test tweet content',
    approvalState: ApprovalState.APPROVED,
    ...overrides,
  });
}

function tweetResponse(id: string) {
  return {
    ok: true,
    status: 200,
    json: async () => ({ data: { id, text: 'Test tweet content' } }),
  };
}

describe('XPublisher', () => {
  let publisher: XPublisher;
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch = vi.fn();
    publisher = new XPublisher(ACCESS_TOKEN, mockFetch as typeof fetch);
  });

  it('publishes to X and returns externalId and url', async () => {
    mockFetch.mockResolvedValueOnce(tweetResponse('17895695668004550'));

    const variant = makeVariant();
    const result = await publisher.publish(variant);

    expect(result.externalId).toBe('x:17895695668004550');
    expect(result.url).toBe('https://x.com/i/web/status/17895695668004550');
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.twitter.com/2/tweets',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + ACCESS_TOKEN,
        },
      })
    );

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.text).toBe('Test tweet content');
  });

  it('throws on non-X platform', async () => {
    const variant = makeVariant({ platform: Platform.WEB });
    await expect(publisher.publish(variant)).rejects.toThrow(
      'XPublisher can only publish to X'
    );
  });

  it('throws on X API error with errors array', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ errors: [{ message: 'Unauthorized', code: 32 }] }),
    });

    const variant = makeVariant();
    await expect(publisher.publish(variant)).rejects.toThrow(
      'X API error: 401 Unauthorized'
    );
  });

  it('throws on X API error with detail', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ detail: 'Tweet text is too long' }),
    });

    const variant = makeVariant();
    await expect(publisher.publish(variant)).rejects.toThrow(
      'X API error: 400 Tweet text is too long'
    );
  });

  it('delete calls X API DELETE with the tweet id', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ data: { deleted: true } }),
    });

    await publisher.delete('x:17895695668004550');

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.twitter.com/2/tweets/17895695668004550',
      expect.objectContaining({
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + ACCESS_TOKEN,
        },
      })
    );
  });
});
