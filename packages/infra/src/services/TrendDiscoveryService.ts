import type { TrendRepository, ResearchProvider, AIProvider } from '@semburat/domain';
import { Trend, TrendStatus } from '@semburat/domain';
import { TrendNormalizationService } from './TrendNormalizationService.js';
import { TrendDeduplicationService } from './TrendDeduplicationService.js';
import { TrendScoringService } from './TrendScoringService.js';

export class TrendDiscoveryService {
  constructor(
    private readonly trendRepo: TrendRepository,
    private readonly researchProvider: ResearchProvider,
    private readonly aiProvider: AIProvider,
    private readonly normalizer = new TrendNormalizationService(),
    private readonly deduplicator = new TrendDeduplicationService(),
    private readonly scorer = new TrendScoringService()
  ) {}

  async discoverTrends(queries: string[]): Promise<Trend[]> {
    const allCandidates: Array<{ title: string; url: string; source: string }> = [];
    for (const q of queries) {
      const results = await this.researchProvider.search(q, 10);
      for (const r of results) {
        allCandidates.push({ title: r.title, url: r.url, source: r.url });
      }
    }
    const normalized = this.normalizer.normalize(allCandidates);
    const deduped = this.deduplicator.deduplicate(normalized);
    const trends: Trend[] = [];
    for (const item of deduped) {
      if (item.isDuplicate) continue;
      const normalizedItem = normalized.find((n) => n.normalizedKey === item.normalizedKey);
      const sourceCount = normalizedItem ? normalizedItem.sourceUrls.length : 0;
      const score = this.scorer.score({
        velocity: 50,
        relevance: 50,
        freshness: 50,
        sourceCount,
        riskScore: 20,
      });
      const trend = new Trend({
        id: crypto.randomUUID(),
        title: item.title,
        normalizedKey: item.normalizedKey,
        score,
        velocity: 50,
        relevance: 50,
        freshness: 50,
        sourceCount,
        status: TrendStatus.CANDIDATE,
        detectedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await this.trendRepo.insert(trend);
      trends.push(trend);
    }
    return trends;
  }

  async getRankedTrends(limit: number): Promise<Trend[]> {
    const all = await this.trendRepo.findByScore(0, 1000);
    return all.slice(0, limit);
  }
}
