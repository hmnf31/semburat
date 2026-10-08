import { ContentVariant, Platform } from '@semburat/domain';
import type { Publisher } from '@semburat/domain';

interface NewsletterResponse {
  id: string;
}

interface NewsletterErrorResponse {
  error?: {
    message?: string;
    code?: number;
  };
}

const NEWSLETTER_API_BASE = 'https://api.semburat.com/newsletter';

export class NewsletterPublisher implements Publisher {
  constructor(
    private readonly apiKey: string,
    private readonly listId: string,
    private readonly fetchFn: typeof fetch = globalThis.fetch
  ) {}

  async publish(variant: ContentVariant): Promise<{ externalId: string; url: string }> {
    if (variant.platform !== Platform.NEWSLETTER) {
      throw new Error('NewsletterPublisher can only publish to NEWSLETTER, got ' + variant.platform);
    }

    const campaignId = await this.createCampaign(variant);

    return {
      externalId: 'newsletter:' + campaignId,
      url: 'https://newsletter.semburat.com/campaign/' + campaignId,
    };
  }

  async delete(externalId: string): Promise<void> {
    const campaignId = externalId.replace('newsletter:', '');
    const apiUrl = NEWSLETTER_API_BASE + '/campaigns/' + campaignId;
    const response = await this.fetchFn(apiUrl, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + this.apiKey,
      },
    });

    if (!response.ok) {
      const errorBody = await this.parseError(response);
      throw new Error('Newsletter API delete error: ' + response.status + ' ' + errorBody);
    }
  }

  private async createCampaign(variant: ContentVariant): Promise<string> {
    const apiUrl = NEWSLETTER_API_BASE + '/campaigns';
    const response = await this.fetchFn(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.apiKey,
      },
      body: JSON.stringify({
        list_id: this.listId,
        subject: variant.format,
        html_content: variant.content,
        text_content: variant.content,
      }),
    });

    if (!response.ok) {
      const errorBody = await this.parseError(response);
      throw new Error('Newsletter API error: ' + response.status + ' ' + errorBody);
    }

    const data = (await response.json()) as NewsletterResponse;
    const campaignId = data.id ?? 'mock-campaign-id';

    return campaignId;
  }

  private async parseError(response: Response): Promise<string> {
    try {
      const body = (await response.json()) as NewsletterErrorResponse;
      if (body.error?.message) {
        return body.error.message;
      }
      return JSON.stringify(body);
    } catch {
      return 'Unknown error';
    }
  }
}
