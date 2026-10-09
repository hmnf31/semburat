import type { ResearchProvider, ResearchResult } from '@semburat/domain';
import { SourceType } from '@semburat/domain';
import { ProviderError } from '@semburat/shared';
import {
  decodeHttpText,
  extractHtmlPage,
  fetchWithTimeout,
  mapWithConcurrency,
  parseFeed,
  publisherDomainFor,
  type FeedItem,
  type FetchLike,
} from './FeedParser.js';

export const GOOGLE_NEWS_RSS_HEADLINES = 'https://news.google.com/rss';

export const DEFAULT_FEEDS: readonly string[] = [GOOGLE_NEWS_RSS_HEADLINES];

/**
 * Curated feeds that surface gaming, esports and viral topics beyond the
 * Google News aggregator. Used as the runtime default when RSS_FEEDS is unset.
 */
export const CURATED_FEEDS: readonly string[] = [
  GOOGLE_NEWS_RSS_HEADLINES,
  'https://store.steampowered.com/feeds/news.xml',
  'https://feeds.ign.com/ign/all',
  'https://www.eurogamer.net/feed',
  'https://www.dexerto.com/feed/',
];

export interface RSSAdapterOptions {
  feeds?: string[];
  enabled?: boolean;
  fetchFn?: FetchLike;
  timeoutMs?: number;
  maxConcurrency?: number;
}

const defaultFetch: FetchLike = (input, init) => fetch(input, init);

export function parseFeedList(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(',')
    .map((feed) => feed.trim())
    .filter((feed) => feed.length > 0);
}

export class RSSAdapter implements ResearchProvider {
  private readonly feeds: string[];
  private readonly enabled: boolean;
  private readonly fetchFn: FetchLike;
  private readonly timeoutMs: number;
  private readonly maxConcurrency: number;

  constructor(options: RSSAdapterOptions = {}) {
    this.feeds = options.feeds ?? [...DEFAULT_FEEDS];
    this.enabled = options.enabled ?? true;
    this.fetchFn = options.fetchFn ?? defaultFetch;
    this.timeoutMs = options.timeoutMs ?? 8000;
    this.maxConcurrency = options.maxConcurrency ?? 4;
  }

  async search(query: string, maxResults: number): Promise<ResearchResult[]> {
    const trimmed = query.trim().toLowerCase();
    if (!this.enabled || this.feeds.length === 0 || maxResults <= 0) return [];
    const batches = await mapWithConcurrency(this.feeds, this.maxConcurrency, async (feed) => {
      try {
        const response = await fetchWithTimeout(this.fetchFn, feed, this.timeoutMs);
        if (!response.ok) return [];
        return parseFeed(await decodeHttpText(response), feed);
      } catch {
        return [];
      }
    });
    const terms = trimmed.split(/\s+/).filter(Boolean);
    const seen = new Set<string>();
    const items = batches
      .flat()
      .filter((item) => terms.length === 0 || this.matches(item, terms))
      .sort((a, b) => (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0))
      .filter((item) => {
        if (seen.has(item.url)) return false;
        seen.add(item.url);
        return true;
      });
    return items.slice(0, maxResults).map((item) => ({
      url: item.url,
      title: item.title,
      snippet: item.snippet,
      publishedAt: item.publishedAt,
      publisher: item.publisher,
      publisherDomain: publisherDomainFor(item),
      sourceType: SourceType.ESTABLISHED_MEDIA,
    }));
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
      throw new ProviderError('rss', 'request failed', error as Error, { url });
    }
    if (!response.ok) {
      throw new ProviderError('rss', `unexpected status ${response.status}`, undefined, { url });
    }
    return extractHtmlPage(await decodeHttpText(response), url);
  }

  private matches(item: FeedItem, terms: string[]): boolean {
    const haystack = `${item.title} ${item.snippet}`.toLowerCase();
    return terms.some((term) => haystack.includes(term));
  }
}
