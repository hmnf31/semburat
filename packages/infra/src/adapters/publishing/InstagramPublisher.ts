import { ContentVariant, Platform } from '@semburat/domain';
import type { Publisher } from '@semburat/domain';

interface InstagramMediaResponse {
  id: string;
}

interface InstagramErrorResponse {
  error?: {
    message?: string;
    code?: number;
    type?: string;
  };
}

const INSTAGRAM_GRAPH_API_BASE = 'https://graph.facebook.com/v19.0';

const ASSET_URL_BASE = 'https://storage.googleapis.com/semburat/';

const INSTAGRAM_PLATFORMS = new Set<Platform>([
  Platform.INSTAGRAM_FEED,
  Platform.INSTAGRAM_STORY,
  Platform.INSTAGRAM_CAROUSEL,
]);

export class InstagramPublisher implements Publisher {
  constructor(
    private readonly accessToken: string,
    private readonly pageId: string,
    private readonly fetchFn: typeof fetch = globalThis.fetch
  ) {}

  async publish(variant: ContentVariant): Promise<{ externalId: string; url: string }> {
    if (!INSTAGRAM_PLATFORMS.has(variant.platform)) {
      throw new Error(
        'InstagramPublisher can only publish to Instagram platforms, got ' + variant.platform
      );
    }

    switch (variant.platform) {
      case Platform.INSTAGRAM_FEED:
        return this.publishFeed(variant);
      case Platform.INSTAGRAM_STORY:
        return this.publishStory(variant);
      case Platform.INSTAGRAM_CAROUSEL:
        return this.publishCarousel(variant);
      default:
        throw new Error('Unsupported Instagram platform: ' + String(variant.platform));
    }
  }

  async delete(externalId: string): Promise<void> {
    const apiUrl =
      INSTAGRAM_GRAPH_API_BASE + '/' + externalId + '?access_token=' + this.accessToken;
    const response = await this.fetchFn(apiUrl, { method: 'DELETE' });

    if (!response.ok) {
      const errorBody = await this.parseError(response);
      throw new Error('Instagram API delete error: ' + response.status + ' ' + errorBody);
    }
  }

  private async publishFeed(variant: ContentVariant): Promise<{ externalId: string; url: string }> {
    const mediaId = await this.createMedia({
      image_url: this.requireAssetUrl(variant),
      caption: variant.content,
    });

    return {
      externalId: mediaId,
      url: 'https://www.instagram.com/p/' + mediaId + '/',
    };
  }

  private async publishStory(variant: ContentVariant): Promise<{ externalId: string; url: string }> {
    const params: Record<string, string> = {};
    if (variant.format.startsWith('video')) {
      params.video_url = this.requireAssetUrl(variant);
    } else {
      params.image_url = this.requireAssetUrl(variant);
    }

    const mediaId = await this.createMedia(params);

    return {
      externalId: mediaId,
      url: 'https://www.instagram.com/stories/' + this.pageId + '/',
    };
  }

  private async publishCarousel(
    variant: ContentVariant
  ): Promise<{ externalId: string; url: string }> {
    if (!variant.assetIds || variant.assetIds.length === 0) {
      throw new Error('Carousel publishing requires at least one asset');
    }

    const childMediaIds: string[] = [];
    for (const assetId of variant.assetIds) {
      const childMediaId = await this.createMedia({
        image_url: ASSET_URL_BASE + assetId,
        is_carousel_item: 'true',
      });
      childMediaIds.push(childMediaId);
    }

    const mediaId = await this.createMedia({
      children: childMediaIds.join(','),
      caption: variant.content,
    });

    return {
      externalId: mediaId,
      url: 'https://www.instagram.com/p/' + mediaId + '/',
    };
  }

  private async createMedia(params: Record<string, string>): Promise<string> {
    const apiUrl = INSTAGRAM_GRAPH_API_BASE + '/' + this.pageId + '/media';
    const response = await this.fetchFn(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...params, access_token: this.accessToken }),
    });

    if (!response.ok) {
      const errorBody = await this.parseError(response);
      throw new Error('Instagram API error: ' + response.status + ' ' + errorBody);
    }

    const data = (await response.json()) as InstagramMediaResponse;
    if (!data.id) {
      throw new Error('Instagram API response missing media id');
    }

    return data.id;
  }

  private requireAssetUrl(variant: ContentVariant): string {
    if (!variant.assetIds || variant.assetIds.length === 0) {
      throw new Error('Instagram publishing requires at least one asset');
    }
    return ASSET_URL_BASE + variant.assetIds[0];
  }

  private async parseError(response: Response): Promise<string> {
    try {
      const body = (await response.json()) as InstagramErrorResponse;
      if (body.error?.message) {
        return body.error.message;
      }
      return JSON.stringify(body);
    } catch {
      return 'Unknown error';
    }
  }
}
