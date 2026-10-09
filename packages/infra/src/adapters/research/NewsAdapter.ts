import type { ResearchProvider, ResearchResult } from '@semburat/domain';
import { SourceType } from '@semburat/domain';
import { ProviderError } from '@semburat/shared';
import {
  extractHtmlPage,
  fetchWithTimeout,
  parseFeed,
  publisherDomainFor,
  type FetchLike,
} from './FeedParser.js';

export const GOOGLE_NEWS_RSS_SEARCH = 'https://news.google.com/rss/search';

export interface NewsAdapterOptions {
  endpoint?: string;
  enabled?: boolean;
  fetchFn?: FetchLike;
  timeoutMs?: number;
}

const defaultFetch: FetchLike = (input, init) => fetch(input, init);

export class NewsAdapter implements ResearchProvider {
  private readonly endpoint: string;
  private readonly enabled: boolean;
  private readonly fetchFn: FetchLike;
  private readonly timeoutMs: number;

  constructor(options: NewsAdapterOptions = {}) {
    this.endpoint = options.endpoint ?? GOOGLE_NEWS_RSS_SEARCH;
    this.enabled = options.enabled ?? true;
    this.fetchFn = options.fetchFn ?? defaultFetch;
    this.timeoutMs = options.timeoutMs ?? 8000;
  }

  async search(query: string, maxResults: number): Promise<ResearchResult[]> {
    const trimmed = query.trim();
    if (!this.enabled || !trimmed || maxResults <= 0) return [];
    const url = `${this.endpoint}?q=${encodeURIComponent(trimmed)}&hl=id&gl=ID&ceid=ID:id`;
    let response: Response;
    try {
      response = await fetchWithTimeout(this.fetchFn, url, this.timeoutMs);
    } catch {
      return [];
    }
    if (!response.ok) return [];
    try {
      return parseFeed(await response.text(), url)
        .slice(0, maxResults)
        .map((item) => ({
          url: item.url,
          title: item.title,
          snippet: item.snippet,
          publishedAt: item.publishedAt,
          publisher: item.publisher,
          publisherDomain: publisherDomainFor(item),
          sourceType: SourceType.ESTABLISHED_MEDIA,
        }));
    } catch {
      return [];
    }
  }

  async fetchPage(url: string): Promise<{
    content: string;
    metadata: { title: string; publishedAt?: Date; author?: string };
  }> {
    if (!this.enabled) return { content: '', metadata: { title: url } };
    let response: Response;
    try {
      response = await fetchWithTimeout(this.fetchFn, url, this.timeoutMs);
    } catch (error) {
      throw new ProviderError('news', 'request failed', error as Error, { url });
    }
    if (!response.ok) {
      throw new ProviderError('news', `unexpected status ${response.status}`, undefined, { url });
    }
    return extractHtmlPage(await response.text(), url);
  }
}
