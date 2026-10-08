import { ContentVariant, Platform } from '@semburat/domain';
import type { Publisher } from '@semburat/domain';

interface ShortVideoResponse {
  id: string;
}

interface ShortErrorResponse {
  error?: {
    message?: string;
    code?: number;
    domain?: string;
  };
}

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';
const ASSET_URL_BASE = 'https://storage.googleapis.com/semburat/';

export class ShortPublisher implements Publisher {
  constructor(
    private readonly accessToken: string,
    private readonly fetchFn: typeof fetch = globalThis.fetch
  ) {}

  async publish(variant: ContentVariant): Promise<{ externalId: string; url: string }> {
    if (variant.platform !== Platform.SHORT) {
      throw new Error('ShortPublisher can only publish to SHORT, got ' + variant.platform);
    }

    if (!variant.assetIds || variant.assetIds.length === 0) {
      throw new Error('Short publishing requires at least one video asset');
    }

    const videoUrl = ASSET_URL_BASE + variant.assetIds[0];

    const videoId = await this.uploadShort(videoUrl, variant.content);

    return {
      externalId: 'short:' + videoId,
      url: 'https://www.youtube.com/shorts/' + videoId,
    };
  }

  async delete(externalId: string): Promise<void> {
    const videoId = externalId.replace('short:', '');
    const apiUrl = YOUTUBE_API_BASE + '/videos?id=' + videoId + '&access_token=' + this.accessToken;
    const response = await this.fetchFn(apiUrl, { method: 'DELETE' });

    if (!response.ok) {
      const errorBody = await this.parseError(response);
      throw new Error('YouTube Shorts API delete error: ' + response.status + ' ' + errorBody);
    }
  }

  private async uploadShort(videoUrl: string, content: string): Promise<string> {
    const apiUrl =
      YOUTUBE_API_BASE + '/videos?part=snippet,status&access_token=' + this.accessToken;
    const response = await this.fetchFn(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        snippet: {
          title: content.slice(0, 100),
          description: content,
          tags: ['shorts'],
          categoryId: '22',
        },
        status: {
          privacyStatus: 'public',
          selfDeclaredMadeForKids: false,
        },
        media: {
          body: videoUrl,
        },
      }),
    });

    if (!response.ok) {
      const errorBody = await this.parseError(response);
      throw new Error('YouTube Shorts API error: ' + response.status + ' ' + errorBody);
    }

    const data = (await response.json()) as ShortVideoResponse;
    const videoId = data.id ?? 'mock-short-id';

    return videoId;
  }

  private async parseError(response: Response): Promise<string> {
    try {
      const body = (await response.json()) as ShortErrorResponse;
      if (body.error?.message) {
        return body.error.message;
      }
      return JSON.stringify(body);
    } catch {
      return 'Unknown error';
    }
  }
}
