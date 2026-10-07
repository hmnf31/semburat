export class TrendScoringService {
  score(trend: {
    velocity: number;
    relevance: number;
    freshness: number;
    sourceCount: number;
    riskScore: number;
  }): number {
    const s =
      trend.velocity * 0.25 +
      trend.relevance * 0.25 +
      trend.freshness * 0.2 +
      trend.sourceCount * 0.15 -
      trend.riskScore * 0.15;
    return Math.max(0, Math.min(100, Math.round(s)));
  }
  getRecommendation(score: number): string {
    if (score >= 90) return 'priority';
    if (score >= 75) return 'generate';
    if (score >= 60) return 'queue';
    if (score >= 40) return 'monitor';
    return 'ignore';
  }
}
