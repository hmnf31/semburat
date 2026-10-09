import type { ResearchProvider, ResearchResult } from '@semburat/domain';
import { SourceType } from '@semburat/domain';
import { ProviderError } from '@semburat/shared';
import type { FetchLike } from './FeedParser.js';

/** Subreddits that carry viral, gaming and Indonesian signals by default. */
export const DEFAULT_SUBREDDITS: readonly string[] = [
  'indonesia',
  'gaming',
  'GTA6',
  'MobileLegendsGame',
  'technology',
];

export interface RedditTrendAdapterOptions {
  subreddits?: string[];
  enabled?: boolean;
  fetchFn?: FetchLike;
  timeoutMs?: number;
  maxPerSubreddit?: number;
  userAgent?: string;
}

interface RedditPost {
  title?: string;
  permalink?: string;
  subreddit?: string;
  author?: string;
  selftext?: string;
  created_utc?: number;
  score?: number;
  num_comments?: number;
  over_18?: boolean;
  stickied?: boolean;
}

interface RedditListing {
  data?: { children?: Array<{ data?: RedditPost }> };
}

const defaultFetch: FetchLike = (input, init) => fetch(input, init);

export function parseSubredditList(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(',')
    .map((name) =>
      name
        .trim()
        .replace(/^\/?r\//i, '')
        .replace(/\/+$/, '')
    )
    .filter((name) => name.length > 0);
}

export class RedditTrendAdapter implements ResearchProvider {
  private readonly subreddits: string[];
  private readonly enabled: boolean;
  private readonly fetchFn: FetchLike;
  private readonly timeoutMs: number;
  private readonly maxPerSubreddit: number;
  private readonly userAgent: string;

  constructor(options: RedditTrendAdapterOptions = {}) {
    this.subreddits = options.subreddits ?? [...DEFAULT_SUBREDDITS];
    this.enabled = options.enabled ?? true;
    this.fetchFn = options.fetchFn ?? defaultFetch;
    this.timeoutMs = options.timeoutMs ?? 8000;
    this.maxPerSubreddit = options.maxPerSubreddit ?? 25;
    this.userAgent = options.userAgent ?? 'SEMBURAT/1.0 (+https://github.com/hmnf31/semburat)';
  }

  async search(query: string, maxResults: number): Promise<ResearchResult[]> {
    const terms = query
      .toLowerCase()
      .split(/\s+/)
      .map((term) => term.trim())
      .filter((term) => term.length >= 2);
    if (!this.enabled || this.subreddits.length === 0 || maxResults <= 0) return [];

    const batches = await Promise.all(
      this.subreddits.map((sub) => this.fetchSubreddit(sub).catch(() => [] as RedditPost[]))
    );

    const seen = new Set<string>();
    const results: ResearchResult[] = [];
    for (const post of batches.flat()) {
      const url = this.permalinkFor(post);
      if (!url || seen.has(url)) continue;
      const haystack = `${post.title ?? ''} ${post.selftext ?? ''}`.toLowerCase();
      if (terms.length > 0 && !terms.some((term) => haystack.includes(term))) continue;
      seen.add(url);
      results.push({
        url,
        title: post.title ?? url,
        snippet: this.snippetFor(post),
        publishedAt: post.created_utc ? new Date(post.created_utc * 1000) : undefined,
        publisher: post.subreddit ? `r/${post.subreddit}` : 'Reddit',
        publisherDomain: 'reddit.com',
        sourceType: SourceType.COMMUNITY,
      });
      if (results.length >= maxResults) break;
    }
    return results;
  }

  async fetchPage(url: string): Promise<{
    content: string;
    metadata: { title: string; publishedAt?: Date; author?: string };
  }> {
    if (!this.enabled) return { content: '', metadata: { title: url } };
    const jsonUrl = this.jsonUrlFor(url);
    let payload: unknown;
    try {
      payload = await this.getJson(jsonUrl);
    } catch (error) {
      throw new ProviderError('reddit', 'request failed', error as Error, { url });
    }
    const listing = Array.isArray(payload) ? payload : [payload];
    const post = (listing[0] as RedditListing | undefined)?.data?.children?.[0]?.data;
    if (!post) {
      throw new ProviderError('reddit', 'post not found', undefined, { url });
    }
    const comments = (listing[1] as RedditListing | undefined)?.data?.children ?? [];
    const commentText = comments
      .map((child) => child.data?.selftext ?? '')
      .filter((text) => text.length > 0)
      .slice(0, 5)
      .join('\n');
    const content = [post.title, post.selftext, commentText]
      .filter((part) => typeof part === 'string' && part.trim().length > 0)
      .join('\n\n');
    return {
      content,
      metadata: {
        title: post.title ?? url,
        publishedAt: post.created_utc ? new Date(post.created_utc * 1000) : undefined,
        author: post.author,
      },
    };
  }

  private async fetchSubreddit(subreddit: string): Promise<RedditPost[]> {
    const url = `https://old.reddit.com/r/${encodeURIComponent(subreddit)}/hot.json?limit=${this.maxPerSubreddit}&raw_json=1`;
    const payload = (await this.getJson(url)) as RedditListing;
    const children = payload?.data?.children ?? [];
    return children
      .map((child) => child.data)
      .filter((post): post is RedditPost => Boolean(post) && !post?.stickied && !post?.over_18);
  }

  private async getJson(url: string): Promise<unknown> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const response = await this.fetchFn(url, {
        signal: controller.signal,
        headers: { 'user-agent': this.userAgent, accept: 'application/json' },
      });
      if (!response.ok) {
        throw new Error(`unexpected status ${response.status}`);
      }
      return (await response.json()) as unknown;
    } finally {
      clearTimeout(timer);
    }
  }

  private permalinkFor(post: RedditPost): string | undefined {
    if (!post.permalink) return undefined;
    return `https://www.reddit.com${post.permalink}`;
  }

  private jsonUrlFor(url: string): string {
    const parsed = new URL(url);
    const cleanPath = parsed.pathname.replace(/\/+$/, '');
    return `https://old.reddit.com${cleanPath}.json?raw_json=1`;
  }

  private snippetFor(post: RedditPost): string {
    const base = post.selftext?.trim() || post.title || '';
    const stats = [
      typeof post.score === 'number' ? `${post.score} upvotes` : '',
      typeof post.num_comments === 'number' ? `${post.num_comments} komentar` : '',
    ]
      .filter(Boolean)
      .join(', ');
    const snippet = stats ? `${base} (${stats})` : base;
    return snippet.length > 400 ? `${snippet.slice(0, 399).trimEnd()}…` : snippet;
  }
}
