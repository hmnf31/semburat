import type { ResearchProvider, ResearchResult } from '@semburat/domain';
import { NewsAdapter } from './NewsAdapter.js';
import { RSSAdapter } from './RSSAdapter.js';
import { GoogleTrendsAdapter } from '../trends/GoogleTrendsAdapter.js';
import type { GoogleTrendData } from '../trends/GoogleTrendsAdapter.js';

export class EnhancedResearchAdapter implements ResearchProvider {
  constructor(
    private readonly newsAdapter: NewsAdapter,
    private readonly rssAdapter: RSSAdapter,
    private readonly googleTrendsAdapter: GoogleTrendsAdapter
  ) {}

  async search(query: string, maxResults: number): Promise<ResearchResult[]> {
    const perAdapter = Math.ceil(maxResults / 3);

    const [newsResults, rssResults, trendsResults] = await Promise.all([
      this.newsAdapter.search(query, perAdapter),
      this.rssAdapter.search(query, perAdapter),
      this.searchGoogleTrends(query, perAdapter),
    ]);

    const combined = [...newsResults, ...rssResults, ...trendsResults];
    const unique = this.deduplicate(combined);

    return unique.slice(0, maxResults);
  }

  async fetchPage(url: string): Promise<{
    content: string;
    metadata: { title: string; publishedAt?: Date; author?: string };
  }> {
    const isFeed = /(\.xml|\.rss|\.atom)(\?|$)/i.test(url) || /\/(rss|feed)(\?|$)/i.test(url);
    if (isFeed) {
      return this.rssAdapter.fetchPage(url);
    }

    return this.newsAdapter.fetchPage(url);
  }

  private async searchGoogleTrends(query: string, maxResults: number): Promise<ResearchResult[]> {
    try {
      const trends = await this.googleTrendsAdapter.getTrendingTopics('ID');
      const filtered = trends.filter(
        (t: GoogleTrendData) =>
          t.title.toLowerCase().includes(query.toLowerCase()) ||
          query.toLowerCase().includes(t.title.toLowerCase())
      );

      return filtered.slice(0, maxResults).map((t: GoogleTrendData) => ({
        url: `https://trends.google.com/trends/explore?q=${encodeURIComponent(t.title)}`,
        title: t.title,
        snippet: `Google Trends: ${t.title} (score: ${t.score}, sources: ${t.sourceCount})`,
      }));
    } catch {
      return [];
    }
  }

  private deduplicate(results: ResearchResult[]): ResearchResult[] {
    const seen = new Set<string>();
    return results.filter((r) => {
      if (seen.has(r.url)) return false;
      seen.add(r.url);
      return true;
    });
  }
}
