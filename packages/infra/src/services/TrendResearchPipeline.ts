import {
  Article,
  ArticleStatus,
  Trend,
  Research,
  Fact,
  Asset,
  QualityGate,
  QualityGateResult,
} from '@semburat/domain';

import type {
  TrendRepository,
  SourceRepository,
  ResearchRepository,
  ArticleRepository,
  FactRepository,
  FactEvidenceRepository,
  AssetRepository,
  AIProvider,
  ResearchProvider,
} from '@semburat/domain';

export class TrendResearchPipeline {
  private readonly qualityGate = new QualityGate();

  constructor(
    private readonly trendRepo: TrendRepository,
    private readonly sourceRepo: SourceRepository,
    private readonly researchRepo: ResearchRepository,
    private readonly articleRepo: ArticleRepository,
    private readonly factRepo: FactRepository,
    private readonly factEvidenceRepo: FactEvidenceRepository,
    private readonly assetRepo: AssetRepository,
    private readonly aiProvider: AIProvider,
    private readonly researchProvider: ResearchProvider
  ) {}

  async processTrend(trendId: string): Promise<Article> {
    const trend = await this.trendRepo.findById(trendId);
    if (!trend) {
      throw new Error(`Trend not found: ${trendId}`);
    }

    const research = await this.runResearch(trend);
    const article = await this.createDraftArticle(trend, research);
    const facts = await this.extractFacts(research, article);
    const verifiedFacts = await this.verifyFacts(facts);
    await this.generateEditorial(research, verifiedFacts);
    const assets: Asset[] = [];
    const quality = await this.runQualityGate(article, verifiedFacts, assets);

    const finalArticle = article.withStatus(ArticleStatus.VERIFIED).withQualityScore(quality.score);

    await this.articleRepo.update(finalArticle);
    await this.factRepo.bulkInsert(verifiedFacts);

    return finalArticle;
  }

  async processTrendBatch(limit: number): Promise<Article[]> {
    const trends = await this.trendRepo.findByScore(0, limit);
    const articles: Article[] = [];
    for (const trend of trends) {
      try {
        const article = await this.processTrend(trend.id);
        articles.push(article);
      } catch {
        // Continue processing other trends on failure
      }
    }
    return articles;
  }

  private async createDraftArticle(trend: Trend, research: Research): Promise<Article> {
    const slug = trend.title.toLowerCase().replace(/\s+/g, '-');
    const article = new Article({
      id: `art_${trend.id}`,
      researchId: research.id,
      title: trend.title,
      slug,
      dek: `Draft dek for ${trend.title}`,
      summary: research.summary,
      body: 'Draft body placeholder.',
      category: 'general',
      status: ArticleStatus.DRAFT,
    });
    await this.articleRepo.insert(article);
    return article;
  }

  private async runResearch(trend: Trend): Promise<Research> {
    const research = new Research({
      id: `res_${trend.id}`,
      trendId: trend.id,
      summary: `Research summary for trend: ${trend.title}`,
      status: 'completed' as never,
    });
    await this.researchRepo.insert(research);
    return research;
  }

  private async extractFacts(research: Research, article: Article): Promise<Fact[]> {
    return [
      new Fact({
        id: `fact_${research.id}_1`,
        articleId: article.id,
        statement: 'Placeholder fact statement.',
        verificationStatus: 'unverified' as never,
      }),
    ];
  }

  private async verifyFacts(facts: Fact[]): Promise<Fact[]> {
    return facts.map((f) => f.withVerificationStatus('verified' as never).withConfidence(0.8));
  }

  private async generateEditorial(research: Research, facts: Fact[]): Promise<Partial<Article>> {
    return {
      body: `Editorial body based on research: ${research.summary}. Facts count: ${facts.length}`,
    };
  }

  private async runQualityGate(
    article: Article,
    facts: Fact[],
    assets: Asset[]
  ): Promise<QualityGateResult> {
    return this.qualityGate.evaluate(article, facts, assets);
  }
}
