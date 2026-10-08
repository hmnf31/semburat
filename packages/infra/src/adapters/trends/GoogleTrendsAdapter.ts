import { fetchWithTimeout, parseFeed, type FetchLike } from '../research/FeedParser.js';
import { GOOGLE_NEWS_RSS_HEADLINES } from '../research/RSSAdapter.js';

export interface GoogleTrendData {
  title: string;
  normalizedKey: string;
  score: number;
  sourceCount: number;
}

export interface GoogleTrendsAdapterOptions {
  endpoint?: string;
  enabled?: boolean;
  fetchFn?: FetchLike;
  timeoutMs?: number;
  maxItems?: number;
  maxTopics?: number;
}

const defaultFetch: FetchLike = (input, init) => fetch(input, init);

const STOPWORDS = new Set([
  'yang',
  'dan',
  'di',
  'ke',
  'dari',
  'untuk',
  'pada',
  'dengan',
  'ini',
  'itu',
  'karena',
  'sebagai',
  'atau',
  'juga',
  'akan',
  'telah',
  'ada',
  'bisa',
  'dapat',
  'lebih',
  'serta',
  'oleh',
  'sebuah',
  'dalam',
  'tanpa',
  'antara',
  'hingga',
  'sekitar',
  'masih',
  'belum',
  'the',
  'and',
  'for',
  'with',
  'from',
  'into',
  'over',
  'after',
  'before',
  'that',
  'this',
  'will',
  'have',
  'been',
  'are',
  'was',
  'were',
  'its',
  'his',
  'her',
  'their',
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 4 && !STOPWORDS.has(token) && !/^\d+$/.test(token));
}

function bigrams(tokens: string[]): string[][] {
  const pairs: string[][] = [];
  for (let i = 0; i + 1 < tokens.length; i += 1) {
    pairs.push([tokens[i], tokens[i + 1]]);
  }
  return pairs;
}

interface TopicCluster {
  key: string;
  title: string;
  count: number;
  latest: number;
}

function freshnessBonus(latest: number, now: number): number {
  if (latest <= 0) return 0;
  const hours = (now - latest) / 3_600_000;
  if (hours <= 6) return 30;
  if (hours <= 24) return 20;
  if (hours <= 72) return 10;
  return 0;
}

export class GoogleTrendsAdapter {
  private readonly endpoint: string;
  private readonly enabled: boolean;
  private readonly fetchFn: FetchLike;
  private readonly timeoutMs: number;
  private readonly maxItems: number;
  private readonly maxTopics: number;

  constructor(options: GoogleTrendsAdapterOptions = {}) {
    this.endpoint = options.endpoint ?? GOOGLE_NEWS_RSS_HEADLINES;
    this.enabled = options.enabled ?? true;
    this.fetchFn = options.fetchFn ?? defaultFetch;
    this.timeoutMs = options.timeoutMs ?? 8000;
    this.maxItems = options.maxItems ?? 50;
    this.maxTopics = options.maxTopics ?? 20;
  }

  async getTrendingTopics(_geo: string): Promise<GoogleTrendData[]> {
    if (!this.enabled) return [];
    const url = `${this.endpoint}?hl=id&gl=ID&ceid=ID:id`;
    let xml: string;
    try {
      const response = await fetchWithTimeout(this.fetchFn, url, this.timeoutMs);
      if (!response.ok) return [];
      xml = await response.text();
    } catch {
      return [];
    }
    const items = parseFeed(xml, url).slice(0, this.maxItems);
    const clusters = new Map<string, TopicCluster>();
    const now = Date.now();
    for (const item of items) {
      const published = item.publishedAt?.getTime() ?? 0;
      for (const pair of bigrams(tokenize(`${item.title} ${item.snippet}`))) {
        const key = pair.join(' ');
        const existing = clusters.get(key) ?? {
          key,
          title: pair.join(' '),
          count: 0,
          latest: 0,
        };
        existing.count += 1;
        existing.latest = Math.max(existing.latest, published);
        clusters.set(key, existing);
      }
    }
    return [...clusters.values()]
      .sort((a, b) => b.count - a.count || b.latest - a.latest)
      .slice(0, this.maxTopics)
      .map((cluster) => ({
        title: cluster.title.replace(/\b\w/g, (char) => char.toUpperCase()),
        normalizedKey: cluster.key.replace(/\s+/g, '-'),
        score: Math.min(100, 40 + cluster.count * 10 + freshnessBonus(cluster.latest, now)),
        sourceCount: cluster.count,
      }));
  }

  async getTopTrends(limit: number): Promise<GoogleTrendData[]> {
    const topics = await this.getTrendingTopics('ID');
    return topics.slice(0, Math.max(0, limit));
  }
}
