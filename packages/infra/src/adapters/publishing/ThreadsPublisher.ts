import { ContentVariant, Platform } from '@semburat/domain';
import type { Publisher } from '@semburat/domain';

interface ThreadsMediaResponse {
  id: string;
}

interface ThreadsErrorResponse {
  error?: {
    message?: string;
    code?: number;
    type?: string;
  };
}

const THREADS_API_BASE = 'https://graph.threads.net/v1.0';

export class ThreadsPublisher implements Publisher {
  constructor(
    private readonly accessToken: string,
    private readonly userId: string,
    private readonly fetchFn: typeof fetch = globalThis.fetch
  ) {}

  async publish(variant: ContentVariant): Promise<{ externalId: string; url: string }> {
    if (variant.platform !== Platform.THREADS) {
      throw new Error('ThreadsPublisher can only publish to Threads, got ' + variant.platform);
    }

    // Step 1: Create media container
    const containerId = await this.createContainer(variant);

    // Step 2: Publish the container
    const postId = await this.publishContainer(containerId);

    return {
      externalId: 'threads:' + postId,
      url: 'https://www.threads.net/@' + this.userId + '/post/' + postId,
    };
  }

  async delete(externalId: string): Promise<void> {
    const postId = externalId.replace('threads:', '');
    const apiUrl = THREADS_API_BASE + '/' + postId + '?access_token=' + this.accessToken;
    const response = await this.fetchFn(apiUrl, { method: 'DELETE' });

    if (!response.ok) {
      const errorBody = await this.parseError(response);
      throw new Error('Threads API delete error: ' + response.status + ' ' + errorBody);
    }
  }

  private async createContainer(variant: ContentVariant): Promise<string> {
    const apiUrl = THREADS_API_BASE + '/' + this.userId + '/threads';
    const params: Record<string, string> = {
      text: variant.content,
      access_token: this.accessToken,
    };

    // Threads supports media attachments, but for now we publish text-only
    // If variant has assets, they could be added here

    const response = await this.fetchFn(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await this.parseError(response);
      throw new Error('Threads API error creating container: ' + response.status + ' ' + error);
    }

    const data = (await response.json()) as ThreadsMediaResponse;
    if (!data.id) {
      throw new Error('Threads API response missing container id');
    }

    return data.id;
  }

  private async publishContainer(containerId: string): Promise<string> {
    const apiUrl = THREADS_API_BASE + '/' + this.userId + '/threads_publish';
    const response = await this.fetchFn(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creation_id: containerId,
        access_token: this.accessToken,
      }),
    });

    if (!response.ok) {
      const error = await this.parseError(response);
      throw new Error('Threads API error publishing: ' + response.status + ' ' + error);
    }

    const data = (await response.json()) as ThreadsMediaResponse;
    return data.id ?? containerId;
  }

  private async parseError(response: Response): Promise<string> {
    try {
      const body = (await response.json()) as ThreadsErrorResponse;
      if (body.error?.message) {
        return body.error.message;
      }
      return JSON.stringify(body);
    } catch {
      return 'Unknown error';
    }
  }
}
