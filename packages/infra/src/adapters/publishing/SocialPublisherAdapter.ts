import { ContentVariant, Platform } from '@semburat/domain';
import type { Publisher } from '@semburat/domain';
import { TelegramPublisher } from './TelegramPublisher.js';
import { WebPublisher } from './WebPublisher.js';

export class SocialPublisherAdapter implements Publisher {
  constructor(
    private readonly telegram: TelegramPublisher,
    private readonly web: WebPublisher
  ) {}

  async publish(variant: ContentVariant): Promise<{ externalId: string; url: string }> {
    switch (variant.platform) {
      case Platform.TELEGRAM:
        return this.telegram.publish(variant);
      case Platform.WEB:
        return this.web.publish(variant);
      default:
        throw new Error('Unsupported platform: ' + variant.platform);
    }
  }

  async delete(externalId: string): Promise<void> {
    if (externalId.startsWith('telegram:')) {
      await this.telegram.delete(externalId);
    } else {
      await this.web.delete(externalId);
    }
  }
}
