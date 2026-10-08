import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InstagramPublisher } from '../../../src/adapters/publishing/InstagramPublisher.js';
import { ContentVariant, Platform, ApprovalState } from '@semburat/domain';
import type { ContentVariantId, ArticleId, AssetId } from '@semburat/shared';

const PAGE_ID = '17841405822304914';
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
    platform: Platform.INSTAGRAM_FEED,
    format: 'image',
    content: 'Test content for Instagram',
    approvalState: ApprovalState.APPROVED,
    ...overrides,
  });
}

function mediaResponse(id: string) {
  return { ok: true, status: 200, json: async () => ({ id }) };
}

describe('InstagramPublisher', () => {
  let publisher: InstagramPublisher;
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch = vi.fn();
    publisher = new InstagramPublisher(ACCESS_TOKEN, PAGE_ID, mockFetch as typeof fetch);
  });

  it('publishes INSTAGRAM_FEED and returns externalId and permalink', async () => {
    mockFetch.mockResolvedValueOnce(mediaResponse('17895695668004550'));

    const variant = makeVariant({
      assetIds: ['550e8400-e29b-41d4-a716-446655440002'],
    });
    const result = await publisher.publish(variant);

    expect(result.externalId).toBe('17895695668004550');
    expect(result.url).toBe('https://www.instagram.com/p/17895695668004550/');
    expect(mockFetch).toHaveBeenCalledWith(
      'https://graph.facebook.com/v19.0/' + PAGE_ID + '/media',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.image_url).toBe('https://storage.googleapis.com/semburat/550e8400-e29b-41d4-a716-446655440002');
    expect(body.caption).toBe('Test content for Instagram');
    expect(body.access_token).toBe(ACCESS_TOKEN);
  });

  it('publishes INSTAGRAM_STORY using video_url when format is video', async () => {
    mockFetch.mockResolvedValueOnce(mediaResponse('17895695668004551'));

    const variant = makeVariant({
      platform: Platform.INSTAGRAM_STORY,
      format: 'video/mp4',
      assetIds: ['550e8400-e29b-41d4-a716-446655440003'],
    });
    const result = await publisher.publish(variant);

    expect(result.externalId).toBe('17895695668004551');
    expect(result.url).toBe('https://www.instagram.com/stories/' + PAGE_ID + '/');

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.video_url).toBe('https://storage.googleapis.com/semburat/550e8400-e29b-41d4-a716-446655440003');
    expect(body.image_url).toBeUndefined();
  });

  it('publishes INSTAGRAM_CAROUSEL creating child containers then parent', async () => {
    mockFetch
      .mockResolvedValueOnce(mediaResponse('child-1'))
      .mockResolvedValueOnce(mediaResponse('child-2'))
      .mockResolvedValueOnce(mediaResponse('carousel-1'));

    const variant = makeVariant({
      platform: Platform.INSTAGRAM_CAROUSEL,
      assetIds: ['550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440005'],
    });
    const result = await publisher.publish(variant);

    expect(result.externalId).toBe('carousel-1');
    expect(result.url).toBe('https://www.instagram.com/p/carousel-1/');
    expect(mockFetch).toHaveBeenCalledTimes(3);

    const firstChildBody = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(firstChildBody.image_url).toBe(
      'https://storage.googleapis.com/semburat/550e8400-e29b-41d4-a716-446655440004'
    );
    expect(firstChildBody.is_carousel_item).toBe('true');

    const parentBody = JSON.parse(mockFetch.mock.calls[2][1].body);
    expect(parentBody.children).toBe('child-1,child-2');
    expect(parentBody.caption).toBe('Test content for Instagram');
  });

  it('throws on non-Instagram platform', async () => {
    const variant = makeVariant({ platform: Platform.TELEGRAM });
    await expect(publisher.publish(variant)).rejects.toThrow(
      'InstagramPublisher can only publish to Instagram platforms'
    );
  });

  it('throws on Instagram API error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: { message: 'Invalid OAuth access token', code: 190 } }),
    });

    const variant = makeVariant({
      assetIds: ['550e8400-e29b-41d4-a716-446655440006'],
    });
    await expect(publisher.publish(variant)).rejects.toThrow(
      'Instagram API error: 400 Invalid OAuth access token'
    );
  });

  it('delete calls Graph API DELETE with the media id', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
    });

    await publisher.delete('17895695668004550');

    expect(mockFetch).toHaveBeenCalledWith(
      'https://graph.facebook.com/v19.0/17895695668004550?access_token=' + ACCESS_TOKEN,
      { method: 'DELETE' }
    );
  });
});
