import { Article, Fact, Asset } from '@semburat/domain';
import type { QualityGate as QualityGatePort } from '@semburat/domain';

export class QualityGateService {
  constructor(private readonly qualityGate: QualityGatePort) {}

  async evaluateArticle(
    article: Article,
    facts: Fact[],
    assets: Asset[]
  ): Promise<{ score: number; passed: boolean; issues: string[] }> {
    const result = this.qualityGate.evaluate(article, facts, assets);
    return {
      score: result.score,
      passed: result.passed,
      issues: result.issues,
    };
  }
}
