import { ContentVariant, Platform } from '@semburat/domain';
import type { Publisher } from '@semburat/domain';

interface ReelMediaResponse {
  id: string;
}

interface ReelErrorResponse {
  error?: {
    message?: string;
    code?: number;
    type?: string;
  };
}

const REEL_API_BASE = 'https://graph.facebook.com/v19.0';
const ASSET_URL_BASE = 'https://storage.googleapis.com/semburat/';

export class ReelPublisher implements Publisher {
  constructor(
    private readonly accessToken: string,
    private readonly pageId: string,
    private readonly fetchFn: typeof fetch = globalThis.fetch
  ) {}

  async publish(variant: ContentVariant): Promise<{ externalId: string; url: string }> {
    if (variant.platform !== Platform.REEL) {
      throw new Error('ReelPublisher can only publish to REEL, got ' + variant.platform);
    }

    if (!variant.assetIds || variant.assetIds.length === 0) {
      throw new Error('Reel publishing requires at least one video asset');
    }

    const videoUrl = ASSET_URL_BASE + variant.assetIds[0];

    const mediaId = await this.createReel(videoUrl, variant.content);

    return {
      externalId: 'reel:' + mediaId,
      url: 'https://www.instagram.com/reel/' + mediaId + '/',
    };
  }

  async delete(externalId: string): Promise<void> {
    const mediaId = externalId.replace('reel:', '');
    const apiUrl = REEL_API_BASE + '/' + mediaId + '?access_token=' + this.accessToken;
    const response = await this.fetchFn(apiUrl, { method: 'DELETE' });

    if (!response.ok) {
      const errorBody = await this.parseError(response);
      throw new Error('Reel API delete error: ' + response.status + ' ' + errorBody);
    }
  }

  private async createReel(videoUrl: string, caption: string): Promise<string> {
    const apiUrl = REEL_API_BASE + '/' + this.pageId + '/reels';
    const response = await this.fetchFn(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        video_url: videoUrl,
        caption,
        access_token: this.accessToken,
      }),
    });

    if (!response.ok) {
      const errorBody = await this.parseError(response);
      throw new Error('Reel API error: ' + response.status + ' ' + errorBody);
    }

    const data = (await response.json()) as ReelMediaResponse;
    const mediaId = data.id ?? 'mock-reel-id';

    return mediaId;
  }

  private async parseError(response: Response): Promise<string> {
    try {
      const body = (await response.json()) as ReelErrorResponse;
      if (body.error?.message) {
        return body.error.message;
      }
      return JSON.stringify(body);
    } catch {
      return 'Unknown error';
    }
  }
}
