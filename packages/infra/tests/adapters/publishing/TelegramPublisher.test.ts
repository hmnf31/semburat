import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TelegramPublisher } from '../../../src/adapters/publishing/TelegramPublisher.js';
import { ContentVariant, Platform, ApprovalState } from '@semburat/domain';
import type { ContentVariantId, ArticleId } from '@semburat/shared';

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
    platform: Platform.TELEGRAM,
    format: 'markdown',
    content: 'Test content for Telegram',
    approvalState: ApprovalState.APPROVED,
    ...overrides,
  });
}

describe('TelegramPublisher', () => {
  let publisher: TelegramPublisher;
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch = vi.fn();
    publisher = new TelegramPublisher(
      'test-bot-token',
      '-1001234567890',
      mockFetch as typeof fetch
    );
  });

  it('publishes to Telegram and returns externalId and url', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ result: { message_id: 12345 } }),
    });

    const variant = makeVariant();
    const result = await publisher.publish(variant);

    expect(result.externalId).toBe('telegram:12345');
    expect(result.url).toBe('https://t.me/c/1234567890/12345');
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.telegram.org/bottest-bot-token/sendMessage',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
    );
  });

  it('throws on non-TELEGRAM platform', async () => {
    const variant = makeVariant({ platform: Platform.WEB });
    await expect(publisher.publish(variant)).rejects.toThrow(
      'TelegramPublisher can only publish to Telegram'
    );
  });

  it('throws on Telegram API error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      text: async () => 'Bad Request: chat not found',
    });

    const variant = makeVariant();
    await expect(publisher.publish(variant)).rejects.toThrow('Telegram API error');
  });

  it('delete calls Telegram deleteMessage API', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({ ok: true }) });

    await publisher.delete('telegram:12345');

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.telegram.org/bottest-bot-token/deleteMessage',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ chat_id: '-1001234567890', message_id: '12345' }),
      })
    );
  });

  it('uses mock message_id when response missing', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ result: {} }),
    });

    const variant = makeVariant();
    const result = await publisher.publish(variant);

    expect(result.externalId).toBe('telegram:mock-message-id');
  });
});
