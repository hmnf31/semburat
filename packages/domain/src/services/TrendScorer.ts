export interface TrendScoreInput {
  velocity: number;
  relevance: number;
  freshness: number;
  sourceCount: number;
  riskScore: number;
}

export class TrendScorer {
  calculateScore(input: TrendScoreInput): number {
    const { velocity, relevance, freshness, sourceCount, riskScore } = input;

    const velocityWeight = 0.25;
    const relevanceWeight = 0.3;
    const freshnessWeight = 0.2;
    const sourceCountWeight = 0.15;
    const riskPenaltyWeight = 0.1;

    const normalizedSourceCount = Math.min(sourceCount / 10, 1) * 100;

    const score =
      velocity * velocityWeight +
      relevance * relevanceWeight +
      freshness * freshnessWeight +
      normalizedSourceCount * sourceCountWeight -
      riskScore * riskPenaltyWeight;

    return Math.round(Math.max(0, Math.min(100, score * (100 / 90))));
  }

  getRecommendation(score: number): string {
    if (score >= 80) return 'PRIORITY';
    if (score >= 60) return 'GENERATE';
    if (score >= 40) return 'QUEUE';
    if (score >= 20) return 'MONITOR';
    return 'IGNORE';
  }
}
