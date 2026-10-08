import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FacebookPublisher } from '../../../src/adapters/publishing/FacebookPublisher.js';
import { ContentVariant, Platform, ApprovalState } from '@semburat/domain';
import type { ContentVariantId, ArticleId } from '@semburat/shared';

const PAGE_ID = '123456789012345';
const ACCESS_TOKEN = 'test-access-token';

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
    platform: Platform.FACEBOOK,
    format: 'text',
    content: 'Test content for Facebook',
    approvalState: ApprovalState.APPROVED,
    ...overrides,
  });
}

function mediaResponse(id: string) {
  return { ok: true, status: 200, json: async () => ({ id }) };
}

describe('FacebookPublisher', () => {
  let publisher: FacebookPublisher;
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch = vi.fn();
    publisher = new FacebookPublisher(ACCESS_TOKEN, PAGE_ID, mockFetch as typeof fetch);
  });

  it('publishes to Facebook and returns externalId and url', async () => {
    mockFetch.mockResolvedValueOnce(mediaResponse(PAGE_ID + '_987654321'));

    const variant = makeVariant();
    const result = await publisher.publish(variant);

    expect(result.externalId).toBe('facebook:987654321');
    expect(result.url).toBe('https://www.facebook.com/' + PAGE_ID + '/posts/987654321');
    expect(mockFetch).toHaveBeenCalledWith(
      'https://graph.facebook.com/v19.0/' + PAGE_ID + '/feed',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.message).toBe('Test content for Facebook');
    expect(body.access_token).toBe(ACCESS_TOKEN);
  });

  it('throws on non-FACEBOOK platform', async () => {
    const variant = makeVariant({ platform: Platform.WEB });
    await expect(publisher.publish(variant)).rejects.toThrow(
      'FacebookPublisher can only publish to Facebook'
    );
  });

  it('throws on Facebook API error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: { message: 'Invalid OAuth access token', code: 190 } }),
    });

    const variant = makeVariant();
    await expect(publisher.publish(variant)).rejects.toThrow(
      'Facebook API error: 400 Invalid OAuth access token'
    );
  });

  it('delete calls Graph API DELETE with the post id', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
    });

    await publisher.delete('facebook:987654321');

    expect(mockFetch).toHaveBeenCalledWith(
      'https://graph.facebook.com/v19.0/987654321?access_token=' + ACCESS_TOKEN,
      { method: 'DELETE' }
    );
  });

  it('handles missing id in response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({}),
    });

    const variant = makeVariant();
    const result = await publisher.publish(variant);

    expect(result.externalId).toBe('facebook:mock-post-id');
  });
});
