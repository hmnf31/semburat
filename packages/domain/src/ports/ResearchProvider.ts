import type { SourceType } from '../entities/Source.js';

export interface ResearchResult {
  url: string;
  title: string;
  snippet: string;
  publishedAt?: Date;
  /** Display name of the publisher behind a redirect/aggregator link. */
  publisher?: string;
  /** Domain of the actual publisher, when it differs from `url` (Google News, Reddit mirrors). */
  publisherDomain?: string;
  sourceType?: SourceType;
}

export interface ResearchProvider {
  search(query: string, maxResults: number): Promise<ResearchResult[]>;
  fetchPage(
    url: string
  ): Promise<{ content: string; metadata: { title: string; publishedAt?: Date; author?: string } }>;
}
