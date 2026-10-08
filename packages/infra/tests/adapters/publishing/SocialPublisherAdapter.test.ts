import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SocialPublisherAdapter } from '../../../src/adapters/publishing/SocialPublisherAdapter.js';
import { InstagramPublisher } from '../../../src/adapters/publishing/InstagramPublisher.js';
import { TelegramPublisher } from '../../../src/adapters/publishing/TelegramPublisher.js';
import { WebPublisher } from '../../../src/adapters/publishing/WebPublisher.js';
import { FacebookPublisher } from '../../../src/adapters/publishing/FacebookPublisher.js';
import { XPublisher } from '../../../src/adapters/publishing/XPublisher.js';
import { ThreadsPublisher } from '../../../src/adapters/publishing/ThreadsPublisher.js';
import { ReelPublisher } from '../../../src/adapters/publishing/ReelPublisher.js';
import { ShortPublisher } from '../../../src/adapters/publishing/ShortPublisher.js';
import { NewsletterPublisher } from '../../../src/adapters/publishing/NewsletterPublisher.js';
import { ContentVariant, Platform, ApprovalState } from '@semburat/domain';
import type { ContentVariantId, ArticleId, AssetId } from '@semburat/shared';

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
    platform: Platform.TELEGRAM,
    format: 'markdown',
    content: 'Test content',
    approvalState: ApprovalState.APPROVED,
    ...overrides,
  });
}

describe('SocialPublisherAdapter', () => {
  let telegram: TelegramPublisher;
  let web: WebPublisher;
  let instagram: InstagramPublisher;
  let facebook: FacebookPublisher;
  let x: XPublisher;
  let threads: ThreadsPublisher;
  let reel: ReelPublisher;
  let short: ShortPublisher;
  let newsletter: NewsletterPublisher;
  let adapter: SocialPublisherAdapter;

  let telegramPublish: ReturnType<typeof vi.fn>;
  let telegramDelete: ReturnType<typeof vi.fn>;
  let webPublish: ReturnType<typeof vi.fn>;
  let webDelete: ReturnType<typeof vi.fn>;
  let instagramPublish: ReturnType<typeof vi.fn>;
  let instagramDelete: ReturnType<typeof vi.fn>;
  let facebookPublish: ReturnType<typeof vi.fn>;
  let facebookDelete: ReturnType<typeof vi.fn>;
  let xPublish: ReturnType<typeof vi.fn>;
  let xDelete: ReturnType<typeof vi.fn>;
  let threadsPublish: ReturnType<typeof vi.fn>;
  let threadsDelete: ReturnType<typeof vi.fn>;
  let reelPublish: ReturnType<typeof vi.fn>;
  let reelDelete: ReturnType<typeof vi.fn>;
  let shortPublish: ReturnType<typeof vi.fn>;
  let shortDelete: ReturnType<typeof vi.fn>;
  let newsletterPublish: ReturnType<typeof vi.fn>;
  let newsletterDelete: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    telegramPublish = vi.fn();
    telegramDelete = vi.fn();
    webPublish = vi.fn();
    webDelete = vi.fn();
    instagramPublish = vi.fn();
    instagramDelete = vi.fn();
    facebookPublish = vi.fn();
    facebookDelete = vi.fn();
    xPublish = vi.fn();
    xDelete = vi.fn();
    threadsPublish = vi.fn();
    threadsDelete = vi.fn();
    reelPublish = vi.fn();
    reelDelete = vi.fn();
    shortPublish = vi.fn();
    shortDelete = vi.fn();
    newsletterPublish = vi.fn();
    newsletterDelete = vi.fn();

    telegram = { publish: telegramPublish, delete: telegramDelete } as unknown as TelegramPublisher;
    web = { publish: webPublish, delete: webDelete } as unknown as WebPublisher;
    instagram = {
      publish: instagramPublish,
      delete: instagramDelete,
    } as unknown as InstagramPublisher;
    facebook = { publish: facebookPublish, delete: facebookDelete } as unknown as FacebookPublisher;
    x = { publish: xPublish, delete: xDelete } as unknown as XPublisher;
    threads = { publish: threadsPublish, delete: threadsDelete } as unknown as ThreadsPublisher;
    reel = { publish: reelPublish, delete: reelDelete } as unknown as ReelPublisher;
    short = { publish: shortPublish, delete: shortDelete } as unknown as ShortPublisher;
    newsletter = {
      publish: newsletterPublish,
      delete: newsletterDelete,
    } as unknown as NewsletterPublisher;

    adapter = new SocialPublisherAdapter(
      telegram,
      web,
      instagram,
      facebook,
      x,
      threads,
      reel,
      short,
      newsletter
    );
  });

  it('routes INSTAGRAM_FEED to InstagramPublisher', async () => {
    instagramPublish.mockResolvedValueOnce({
      externalId: 'feed-1',
      url: 'https://instagram.com/p/feed-1/',
    });

    const variant = makeVariant({ platform: Platform.INSTAGRAM_FEED });
    const result = await adapter.publish(variant);

    expect(instagramPublish).toHaveBeenCalledWith(variant);
    expect(telegramPublish).not.toHaveBeenCalled();
    expect(webPublish).not.toHaveBeenCalled();
    expect(result).toEqual({ externalId: 'feed-1', url: 'https://instagram.com/p/feed-1/' });
  });

  it('routes INSTAGRAM_STORY to InstagramPublisher', async () => {
    instagramPublish.mockResolvedValueOnce({
      externalId: 'story-1',
      url: 'https://instagram.com/stories/x/',
    });

    const variant = makeVariant({ platform: Platform.INSTAGRAM_STORY });
    await adapter.publish(variant);

    expect(instagramPublish).toHaveBeenCalledWith(variant);
    expect(telegramPublish).not.toHaveBeenCalled();
    expect(webPublish).not.toHaveBeenCalled();
  });

  it('routes INSTAGRAM_CAROUSEL to InstagramPublisher', async () => {
    instagramPublish.mockResolvedValueOnce({
      externalId: 'carousel-1',
      url: 'https://instagram.com/p/carousel-1/',
    });

    const variant = makeVariant({ platform: Platform.INSTAGRAM_CAROUSEL });
    await adapter.publish(variant);

    expect(instagramPublish).toHaveBeenCalledWith(variant);
    expect(telegramPublish).not.toHaveBeenCalled();
    expect(webPublish).not.toHaveBeenCalled();
  });

  it('routes TELEGRAM to TelegramPublisher', async () => {
    telegramPublish.mockResolvedValueOnce({ externalId: 'telegram:1', url: 'https://t.me/x/1' });

    const variant = makeVariant({ platform: Platform.TELEGRAM });
    await adapter.publish(variant);

    expect(telegramPublish).toHaveBeenCalledWith(variant);
    expect(instagramPublish).not.toHaveBeenCalled();
    expect(webPublish).not.toHaveBeenCalled();
  });

  it('routes WEB to WebPublisher', async () => {
    webPublish.mockResolvedValueOnce({ externalId: 'web-1', url: 'https://example.com/1' });

    const variant = makeVariant({ platform: Platform.WEB });
    await adapter.publish(variant);

    expect(webPublish).toHaveBeenCalledWith(variant);
    expect(telegramPublish).not.toHaveBeenCalled();
    expect(instagramPublish).not.toHaveBeenCalled();
  });

  it('routes FACEBOOK to FacebookPublisher', async () => {
    facebookPublish.mockResolvedValueOnce({
      externalId: 'facebook:1',
      url: 'https://facebook.com/1',
    });

    const variant = makeVariant({ platform: Platform.FACEBOOK });
    await adapter.publish(variant);

    expect(facebookPublish).toHaveBeenCalledWith(variant);
    expect(telegramPublish).not.toHaveBeenCalled();
    expect(webPublish).not.toHaveBeenCalled();
  });

  it('routes X to XPublisher', async () => {
    xPublish.mockResolvedValueOnce({ externalId: 'x:1', url: 'https://x.com/1' });

    const variant = makeVariant({ platform: Platform.X });
    await adapter.publish(variant);

    expect(xPublish).toHaveBeenCalledWith(variant);
    expect(telegramPublish).not.toHaveBeenCalled();
    expect(webPublish).not.toHaveBeenCalled();
  });

  it('routes THREADS to ThreadsPublisher', async () => {
    threadsPublish.mockResolvedValueOnce({ externalId: 'threads:1', url: 'https://threads.net/1' });

    const variant = makeVariant({ platform: Platform.THREADS });
    await adapter.publish(variant);

    expect(threadsPublish).toHaveBeenCalledWith(variant);
    expect(telegramPublish).not.toHaveBeenCalled();
    expect(webPublish).not.toHaveBeenCalled();
  });

  it('routes REEL to ReelPublisher', async () => {
    reelPublish.mockResolvedValueOnce({
      externalId: 'reel:1',
      url: 'https://instagram.com/reel/1/',
    });

    const variant = makeVariant({ platform: Platform.REEL, assetIds: ['asset-1'] });
    await adapter.publish(variant);

    expect(reelPublish).toHaveBeenCalledWith(variant);
    expect(telegramPublish).not.toHaveBeenCalled();
    expect(webPublish).not.toHaveBeenCalled();
  });

  it('routes SHORT to ShortPublisher', async () => {
    shortPublish.mockResolvedValueOnce({
      externalId: 'short:1',
      url: 'https://youtube.com/shorts/1',
    });

    const variant = makeVariant({ platform: Platform.SHORT, assetIds: ['asset-1'] });
    await adapter.publish(variant);

    expect(shortPublish).toHaveBeenCalledWith(variant);
    expect(telegramPublish).not.toHaveBeenCalled();
    expect(webPublish).not.toHaveBeenCalled();
  });

  it('routes NEWSLETTER to NewsletterPublisher', async () => {
    newsletterPublish.mockResolvedValueOnce({
      externalId: 'newsletter:1',
      url: 'https://newsletter.com/1',
    });

    const variant = makeVariant({ platform: Platform.NEWSLETTER });
    await adapter.publish(variant);

    expect(newsletterPublish).toHaveBeenCalledWith(variant);
    expect(telegramPublish).not.toHaveBeenCalled();
    expect(webPublish).not.toHaveBeenCalled();
  });

  it('throws on unsupported platform', async () => {
    const variant = makeVariant({ platform: 'UNKNOWN_PLATFORM' as Platform });
    await expect(adapter.publish(variant)).rejects.toThrow('Unsupported platform');
  });

  it('delete routes instagram: prefixed IDs to InstagramPublisher', async () => {
    await adapter.delete('instagram:17895695668004550');

    expect(instagramDelete).toHaveBeenCalledWith('instagram:17895695668004550');
    expect(telegramDelete).not.toHaveBeenCalled();
    expect(webDelete).not.toHaveBeenCalled();
  });

  it('delete routes reel: prefixed IDs to InstagramPublisher', async () => {
    await adapter.delete('reel:17895695668004550');

    expect(instagramDelete).toHaveBeenCalledWith('reel:17895695668004550');
    expect(telegramDelete).not.toHaveBeenCalled();
    expect(webDelete).not.toHaveBeenCalled();
  });

  it('delete routes telegram: prefixed IDs to TelegramPublisher', async () => {
    await adapter.delete('telegram:12345');

    expect(telegramDelete).toHaveBeenCalledWith('telegram:12345');
    expect(instagramDelete).not.toHaveBeenCalled();
    expect(webDelete).not.toHaveBeenCalled();
  });

  it('delete routes facebook: prefixed IDs to FacebookPublisher', async () => {
    await adapter.delete('facebook:987654321');

    expect(facebookDelete).toHaveBeenCalledWith('facebook:987654321');
    expect(telegramDelete).not.toHaveBeenCalled();
    expect(webDelete).not.toHaveBeenCalled();
  });

  it('delete routes x: prefixed IDs to XPublisher', async () => {
    await adapter.delete('x:1234567890');

    expect(xDelete).toHaveBeenCalledWith('x:1234567890');
    expect(telegramDelete).not.toHaveBeenCalled();
    expect(webDelete).not.toHaveBeenCalled();
  });

  it('delete routes threads: prefixed IDs to ThreadsPublisher', async () => {
    await adapter.delete('threads:1234567890');

    expect(threadsDelete).toHaveBeenCalledWith('threads:1234567890');
    expect(telegramDelete).not.toHaveBeenCalled();
    expect(webDelete).not.toHaveBeenCalled();
  });

  it('delete routes short: prefixed IDs to ShortPublisher', async () => {
    await adapter.delete('short:dQw4w9WgXcQ');

    expect(shortDelete).toHaveBeenCalledWith('short:dQw4w9WgXcQ');
    expect(telegramDelete).not.toHaveBeenCalled();
    expect(webDelete).not.toHaveBeenCalled();
  });

  it('delete routes newsletter: prefixed IDs to NewsletterPublisher', async () => {
    await adapter.delete('newsletter:campaign-abc123');

    expect(newsletterDelete).toHaveBeenCalledWith('newsletter:campaign-abc123');
    expect(telegramDelete).not.toHaveBeenCalled();
    expect(webDelete).not.toHaveBeenCalled();
  });

  it('delete routes non-prefixed IDs to WebPublisher', async () => {
    await adapter.delete('web-article-1');

    expect(webDelete).toHaveBeenCalledWith('web-article-1');
    expect(telegramDelete).not.toHaveBeenCalled();
    expect(instagramDelete).not.toHaveBeenCalled();
  });
});
