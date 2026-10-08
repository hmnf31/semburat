import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ThreadsPublisher } from '../../../src/adapters/publishing/ThreadsPublisher.js';
import { ContentVariant, Platform, ApprovalState } from '@semburat/domain';
import type { ContentVariantId, ArticleId } from '@semburat/shared';

const USER_ID = '17841405822304914';
const ACCESS_TOKEN = 'test-threads-token';

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
    platform: Platform.THREADS,
    format: 'text',
    content: 'Test Threads post',
    approvalState: ApprovalState.APPROVED,
    ...overrides,
  });
}

function containerResponse(id: string) {
  return { ok: true, status: 200, json: async () => ({ id }) };
}

describe('ThreadsPublisher', () => {
  let publisher: ThreadsPublisher;
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch = vi.fn();
    publisher = new ThreadsPublisher(ACCESS_TOKEN, USER_ID, mockFetch as typeof fetch);
  });

  it('publishes to Threads and returns externalId and url', async () => {
    mockFetch
      .mockResolvedValueOnce(containerResponse('container-123'))
      .mockResolvedValueOnce(containerResponse('post-456'));

    const variant = makeVariant();
    const result = await publisher.publish(variant);

    expect(result.externalId).toBe('threads:post-456');
    expect(result.url).toBe('https://www.threads.net/@' + USER_ID + '/post/post-456');
    expect(mockFetch).toHaveBeenCalledTimes(2);

    // First call: create container
    expect(mockFetch.mock.calls[0][0]).toBe(
      'https://graph.threads.net/v1.0/' + USER_ID + '/threads'
    );
    const firstBody = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(firstBody.text).toBe('Test Threads post');
    expect(firstBody.access_token).toBe(ACCESS_TOKEN);

    // Second call: publish container
    expect(mockFetch.mock.calls[1][0]).toBe(
      'https://graph.threads.net/v1.0/' + USER_ID + '/threads_publish'
    );
    const secondBody = JSON.parse(mockFetch.mock.calls[1][1].body);
    expect(secondBody.creation_id).toBe('container-123');
    expect(secondBody.access_token).toBe(ACCESS_TOKEN);
  });

  it('throws on non-THREADS platform', async () => {
    const variant = makeVariant({ platform: Platform.WEB });
    await expect(publisher.publish(variant)).rejects.toThrow(
      'ThreadsPublisher can only publish to Threads'
    );
  });

  it('throws on Threads API error creating container', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: { message: 'Invalid text content', code: 100 } }),
    });

    const variant = makeVariant();
    await expect(publisher.publish(variant)).rejects.toThrow(
      'Threads API error creating container: 400 Invalid text content'
    );
  });

  it('throws on Threads API error publishing', async () => {
    mockFetch.mockResolvedValueOnce(containerResponse('container-123')).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: { message: 'Container expired', code: 200 } }),
    });

    const variant = makeVariant();
    await expect(publisher.publish(variant)).rejects.toThrow(
      'Threads API error publishing: 400 Container expired'
    );
  });

  it('delete calls Threads API DELETE with the post id', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
    });

    await publisher.delete('threads:post-456');

    expect(mockFetch).toHaveBeenCalledWith(
      'https://graph.threads.net/v1.0/post-456?access_token=' + ACCESS_TOKEN,
      { method: 'DELETE' }
    );
  });

  it('throws on missing container id', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({}),
    });

    const variant = makeVariant();
    await expect(publisher.publish(variant)).rejects.toThrow(
      'Threads API response missing container id'
    );
  });
});
