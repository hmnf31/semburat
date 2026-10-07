import { Article } from '../entities/Article.js';
import { Fact } from '../entities/Fact.js';
import { Asset } from '../entities/Asset.js';
import { RiskLevel } from '../value-objects/RiskLevel.js';

export interface QualityGateResult {
  score: number;
  passed: boolean;
  issues: string[];
}

export class QualityGate {
  evaluate(article: Article, facts: Fact[], assets: Asset[]): QualityGateResult {
    const issues: string[] = [];
    let score = 100;

    if (!this.checkSourceCoverage(facts, 3)) {
      issues.push('Insufficient source coverage (minimum 3 sources required)');
      score -= 20;
    }

    if (!this.checkAssetProvenance(assets)) {
      issues.push('Asset provenance issues (unknown or restricted licenses)');
      score -= 15;
    }

    if (!this.checkRiskPolicy(article.riskLevel)) {
      issues.push('High-risk content requires additional review');
      score -= 10;
    }

    const verifiedFacts = facts.filter((f) => f.verificationStatus === 'verified').length;
    const totalFacts = facts.length;
    if (totalFacts > 0 && verifiedFacts / totalFacts < 0.7) {
      issues.push('Less than 70% of facts are verified');
      score -= 15;
    }

    if (article.body.length < 500) {
      issues.push('Article body too short (minimum 500 characters)');
      score -= 10;
    }

    if (!article.seoTitle || article.seoTitle.length < 30) {
      issues.push('SEO title missing or too short');
      score -= 5;
    }

    if (!article.metaDescription || article.metaDescription.length < 120) {
      issues.push('Meta description missing or too short');
      score -= 5;
    }

    return {
      score: Math.max(0, score),
      passed: score >= 75 && issues.length === 0,
      issues,
    };
  }

  checkSourceCoverage(facts: Fact[], requiredCount: number): boolean {
    // This would need to be implemented with actual source tracking
    return facts.length >= requiredCount;
  }

  checkAssetProvenance(assets: Asset[]): boolean {
    return assets.every((asset) => asset.canBePublished());
  }

  checkRiskPolicy(riskLevel: RiskLevel): boolean {
    return !riskLevel.isHighRisk();
  }
}
