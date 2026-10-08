import { ContentVariant, Platform } from '@semburat/domain';
import type { Publisher } from '@semburat/domain';

interface FacebookMediaResponse {
  id: string;
}

interface FacebookErrorResponse {
  error?: {
    message?: string;
    code?: number;
    type?: string;
  };
}

const FACEBOOK_GRAPH_API_BASE = 'https://graph.facebook.com/v19.0';

export class FacebookPublisher implements Publisher {
  constructor(
    private readonly accessToken: string,
    private readonly pageId: string,
    private readonly fetchFn: typeof fetch = globalThis.fetch
  ) {}

  async publish(variant: ContentVariant): Promise<{ externalId: string; url: string }> {
    if (variant.platform !== Platform.FACEBOOK) {
      throw new Error('FacebookPublisher can only publish to Facebook, got ' + variant.platform);
    }

    const apiUrl = FACEBOOK_GRAPH_API_BASE + '/' + this.pageId + '/feed';
    const response = await this.fetchFn(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: variant.content,
        access_token: this.accessToken,
      }),
    });

    if (!response.ok) {
      const error = await this.parseError(response);
      throw new Error('Facebook API error: ' + response.status + ' ' + error);
    }

    const data = (await response.json()) as FacebookMediaResponse;
    const postId = data.id?.split('_').pop() ?? data.id ?? 'mock-post-id';

    return {
      externalId: 'facebook:' + postId,
      url: 'https://www.facebook.com/' + this.pageId + '/posts/' + postId,
    };
  }

  async delete(externalId: string): Promise<void> {
    const postId = externalId.replace('facebook:', '');
    const apiUrl = FACEBOOK_GRAPH_API_BASE + '/' + postId + '?access_token=' + this.accessToken;
    const response = await this.fetchFn(apiUrl, { method: 'DELETE' });

    if (!response.ok) {
      const errorBody = await this.parseError(response);
      throw new Error('Facebook API delete error: ' + response.status + ' ' + errorBody);
    }
  }

  private async parseError(response: Response): Promise<string> {
    try {
      const body = (await response.json()) as FacebookErrorResponse;
      if (body.error?.message) {
        return body.error.message;
      }
      return JSON.stringify(body);
    } catch {
      return 'Unknown error';
    }
  }
}
