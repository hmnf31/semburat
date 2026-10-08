import { ContentVariant, Platform } from '@semburat/domain';
import type { Publisher } from '@semburat/domain';

interface XTweetResponse {
  data: {
    id: string;
    text: string;
  };
}

interface XErrorResponse {
  errors?: Array<{
    message?: string;
    code?: number;
  }>;
  detail?: string;
}

const X_API_BASE = 'https://api.twitter.com/2';

export class XPublisher implements Publisher {
  constructor(
    private readonly accessToken: string,
    private readonly fetchFn: typeof fetch = globalThis.fetch
  ) {}

  async publish(variant: ContentVariant): Promise<{ externalId: string; url: string }> {
    if (variant.platform !== Platform.X) {
      throw new Error('XPublisher can only publish to X, got ' + variant.platform);
    }

    const apiUrl = X_API_BASE + '/tweets';
    const response = await this.fetchFn(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.accessToken,
      },
      body: JSON.stringify({
        text: variant.content,
      }),
    });

    if (!response.ok) {
      const error = await this.parseError(response);
      throw new Error('X API error: ' + response.status + ' ' + error);
    }

    const data = (await response.json()) as XTweetResponse;
    const tweetId = data.data?.id ?? 'mock-tweet-id';

    return {
      externalId: 'x:' + tweetId,
      url: 'https://x.com/i/web/status/' + tweetId,
    };
  }

  async delete(externalId: string): Promise<void> {
    const tweetId = externalId.replace('x:', '');
    const apiUrl = X_API_BASE + '/tweets/' + tweetId;
    const response = await this.fetchFn(apiUrl, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + this.accessToken,
      },
    });

    if (!response.ok) {
      const errorBody = await this.parseError(response);
      throw new Error('X API delete error: ' + response.status + ' ' + errorBody);
    }
  }

  private async parseError(response: Response): Promise<string> {
    try {
      const body = (await response.json()) as XErrorResponse;
      if (body.errors && body.errors.length > 0) {
        return body.errors[0].message ?? 'Unknown error';
      }
      if (body.detail) {
        return body.detail;
      }
      return JSON.stringify(body);
    } catch {
      return 'Unknown error';
    }
  }
}
