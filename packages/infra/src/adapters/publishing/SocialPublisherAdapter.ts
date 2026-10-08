import { ContentVariant, Platform } from '@semburat/domain';
import type { Publisher } from '@semburat/domain';
import { InstagramPublisher } from './InstagramPublisher.js';
import { TelegramPublisher } from './TelegramPublisher.js';
import { WebPublisher } from './WebPublisher.js';
import { FacebookPublisher } from './FacebookPublisher.js';
import { XPublisher } from './XPublisher.js';
import { ThreadsPublisher } from './ThreadsPublisher.js';
import { ReelPublisher } from './ReelPublisher.js';
import { ShortPublisher } from './ShortPublisher.js';
import { NewsletterPublisher } from './NewsletterPublisher.js';

export class SocialPublisherAdapter implements Publisher {
  constructor(
    private readonly telegram: TelegramPublisher,
    private readonly web: WebPublisher,
    private readonly instagram: InstagramPublisher,
    private readonly facebook: FacebookPublisher,
    private readonly x: XPublisher,
    private readonly threads: ThreadsPublisher,
    private readonly reel: ReelPublisher,
    private readonly short: ShortPublisher,
    private readonly newsletter: NewsletterPublisher
  ) {}

  async publish(variant: ContentVariant): Promise<{ externalId: string; url: string }> {
    switch (variant.platform) {
      case Platform.TELEGRAM:
        return this.telegram.publish(variant);
      case Platform.WEB:
        return this.web.publish(variant);
      case Platform.INSTAGRAM_FEED:
      case Platform.INSTAGRAM_STORY:
      case Platform.INSTAGRAM_CAROUSEL:
        return this.instagram.publish(variant);
      case Platform.FACEBOOK:
        return this.facebook.publish(variant);
      case Platform.X:
        return this.x.publish(variant);
      case Platform.THREADS:
        return this.threads.publish(variant);
      case Platform.REEL:
        return this.reel.publish(variant);
      case Platform.SHORT:
        return this.short.publish(variant);
      case Platform.NEWSLETTER:
        return this.newsletter.publish(variant);
      default:
        throw new Error('Unsupported platform: ' + variant.platform);
    }
  }

  async delete(externalId: string): Promise<void> {
    if (externalId.startsWith('telegram:')) {
      await this.telegram.delete(externalId);
    } else if (externalId.startsWith('instagram:') || externalId.startsWith('reel:')) {
      await this.instagram.delete(externalId);
    } else if (externalId.startsWith('facebook:')) {
      await this.facebook.delete(externalId);
    } else if (externalId.startsWith('x:')) {
      await this.x.delete(externalId);
    } else if (externalId.startsWith('threads:')) {
      await this.threads.delete(externalId);
    } else if (externalId.startsWith('short:')) {
      await this.short.delete(externalId);
    } else if (externalId.startsWith('newsletter:')) {
      await this.newsletter.delete(externalId);
    } else {
      await this.web.delete(externalId);
    }
  }
}
