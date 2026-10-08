import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ReelPublisher } from '../../../src/adapters/publishing/ReelPublisher.js';
import { ContentVariant, Platform, ApprovalState } from '@semburat/domain';
import type { ContentVariantId, ArticleId, AssetId } from '@semburat/shared';

const PAGE_ID = '123456789012345';
const ACCESS_TOKEN = 'test-access-token';

function makeVariant(
  overrides: Partial<{
    id: ContentVariantId;
    articleId: ArticleId;
    platform: Platform;
    format: string;
    content: string;
    assetIds: AssetId[];
    approvalState: ApprovalState;
  }> = {}
): ContentVariant {
  return new ContentVariant({
    id: '550e8400-e29b-41d4-a716-446655440000',
    articleId: '550e8400-e29b-41d4-a716-446655440001',
    platform: Platform.REEL,
    format: 'video/mp4',
    content: 'Test reel content',
    assetIds: ['asset-1'],
    approvalState: ApprovalState.APPROVED,
    ...overrides,
  });
}

function mediaResponse(id: string) {
  return { ok: true, status: 200, json: async () => ({ id }) };
}

describe('ReelPublisher', () => {
  let publisher: ReelPublisher;
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch = vi.fn();
    publisher = new ReelPublisher(ACCESS_TOKEN, PAGE_ID, mockFetch as typeof fetch);
  });

  it('publishes to Reel and returns externalId and url', async () => {
    mockFetch.mockResolvedValueOnce(mediaResponse('17895695668004550'));

    const variant = makeVariant();
    const result = await publisher.publish(variant);

    expect(result.externalId).toBe('reel:17895695668004550');
    expect(result.url).toBe('https://www.instagram.com/reel/17895695668004550/');
    expect(mockFetch).toHaveBeenCalledWith(
      'https://graph.facebook.com/v19.0/' + PAGE_ID + '/reels',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.video_url).toBe('https://storage.googleapis.com/semburat/asset-1');
    expect(body.caption).toBe('Test reel content');
    expect(body.access_token).toBe(ACCESS_TOKEN);
  });

  it('throws on non-REEL platform', async () => {
    const variant = makeVariant({ platform: Platform.WEB });
    await expect(publisher.publish(variant)).rejects.toThrow(
      'ReelPublisher can only publish to REEL'
    );
  });

  it('throws when no asset provided', async () => {
    const variant = makeVariant({ assetIds: [] });
    await expect(publisher.publish(variant)).rejects.toThrow(
      'Reel publishing requires at least one video asset'
    );
  });

  it('throws on Reel API error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: { message: 'Invalid video format', code: 324 } }),
    });

    const variant = makeVariant();
    await expect(publisher.publish(variant)).rejects.toThrow(
      'Reel API error: 400 Invalid video format'
    );
  });

  it('delete calls Graph API DELETE with the media id', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
    });

    await publisher.delete('reel:17895695668004550');

    expect(mockFetch).toHaveBeenCalledWith(
      'https://graph.facebook.com/v19.0/17895695668004550?access_token=' + ACCESS_TOKEN,
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

    expect(result.externalId).toBe('reel:mock-reel-id');
  });
});
