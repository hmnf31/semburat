import { randomUUID } from 'node:crypto';

import {
  Article,
  ArticleStatus,
  Asset,
  Fact,
  FactCheckStatus,
  LicenseState,
  QualityGateResult,
  ReliabilityState,
  Research,
  ResearchStatus,
  Source,
  SourceType,
  Trend,
  VerificationStatus,
} from '@semburat/domain';

import type {
  AIProvider,
  ArticleRepository,
  AssetRepository,
  FactEvidenceRepository,
  FactRepository,
  ResearchProvider,
  ResearchRepository,
  SourceRepository,
  TrendRepository,
} from '@semburat/domain';

import { EditorialGenerationService } from './EditorialGenerationService.js';
import { FactExtractionService } from './FactExtractionService.js';
import { FactVerificationService } from './FactVerificationService.js';
import { QualityGateService } from './QualityGateService.js';

interface ExtractedClaim {
  statement: string;
  confidence: number;
  supportType: string;
  sources: string[];
}

interface ResearchExtractionResult {
  summary?: string;
  claims?: ExtractedClaim[];
  conflicts?: string[];
  confidenceScore?: number;
}

const RESEARCH_MAX_RESULTS = 10;
const MAX_RETRIES = 3;
const INITIAL_BACKOFF_MS = 500;
const MAX_BACKOFF_MS = 8000;

const RESEARCH_EXTRACTION_SCHEMA = {
  type: 'object',
  properties: {
    summary: { type: 'string' },
    claims: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          statement: { type: 'string' },
          confidence: { type: 'number', minimum: 0, maximum: 1 },
          supportType: {
            type: 'string',
            enum: ['supports', 'contradicts', 'partial', 'neutral'],
          },
          sources: { type: 'array', items: { type: 'string' } },
        },
        required: ['statement', 'confidence', 'supportType', 'sources'],
      },
    },
    conflicts: { type: 'array', items: { type: 'string' } },
    confidenceScore: { type: 'number', minimum: 0, maximum: 1 },
  },
  required: ['summary', 'claims', 'conflicts', 'confidenceScore'],
};

export class TrendResearchPipeline {
  constructor(
    private readonly trendRepo: TrendRepository,
    private readonly sourceRepo: SourceRepository,
    private readonly researchRepo: ResearchRepository,
    private readonly articleRepo: ArticleRepository,
    private readonly factRepo: FactRepository,
    private readonly factEvidenceRepo: FactEvidenceRepository,
    private readonly assetRepo: AssetRepository,
    private readonly aiProvider: AIProvider,
    private readonly researchProvider: ResearchProvider,
    private readonly factExtractionService: FactExtractionService,
    private readonly factVerificationService: FactVerificationService,
    private readonly editorialGenerationService: EditorialGenerationService,
    private readonly qualityGateService: QualityGateService
  ) {}

  async processTrend(trendId: string): Promise<Article> {
    const trend = await this.trendRepo.findById(trendId);
    if (!trend) {
      throw new Error(`Trend not found: ${trendId}`);
    }

    const articleId = this.buildArticleId(trend.id);
    const existingArticle = await this.articleRepo.findById(articleId);
    if (existingArticle) {
      this.log('info', 'Trend already processed, returning existing article', {
        trendId: trend.id,
        articleId: existingArticle.id,
        status: existingArticle.status,
      });
      return existingArticle;
    }

    try {
      const research = await this.runResearch(trend);
      const draft = await this.createDraftArticle(trend, research);
      const article = draft.withStatus(ArticleStatus.RESEARCHING);
      await this.articleRepo.update(article);

      const facts = await this.extractFacts(research, article);
      const verifiedFacts = await this.verifyFacts(article);
      const editorialArticle = await this.generateEditorial(article, research, verifiedFacts);

      const assets: Asset[] = [];
      const quality = await this.runQualityGate(editorialArticle, verifiedFacts, assets);

      const finalArticle = this.applyQualityOutcome(editorialArticle, quality);
      await this.articleRepo.update(finalArticle);
      await this.factRepo.bulkInsert(verifiedFacts);

      this.log('info', 'Trend research pipeline completed', {
        trendId: trend.id,
        researchId: research.id,
        articleId: finalArticle.id,
        status: finalArticle.status,
        qualityScore: finalArticle.qualityScore.value,
        factCount: verifiedFacts.length,
      });

      return finalArticle;
    } catch (error) {
      this.log('error', 'Trend research pipeline failed', {
        trendId: trend.id,
        error: (error as Error).message,
      });
      throw error;
    }
  }

  async processTrendBatch(limit: number): Promise<Article[]> {
    const trends = await this.trendRepo.findByScore(0, limit);
    const articles: Article[] = [];
    for (const trend of trends) {
      try {
        const article = await this.processTrend(trend.id);
        articles.push(article);
      } catch (error) {
        this.log('error', 'Failed to process trend in batch', {
          trendId: trend.id,
          error: (error as Error).message,
        });
      }
    }
    return articles;
  }

  private async runResearch(trend: Trend): Promise<Research> {
    const existingResearch = await this.researchRepo.findByTrendId(trend.id);
    if (existingResearch) {
      this.log('info', 'Reusing existing research for trend', {
        trendId: trend.id,
        researchId: existingResearch.id,
      });
      return existingResearch;
    }

    const searchResults = await this.researchProvider.search(trend.title, RESEARCH_MAX_RESULTS);
    if (searchResults.length === 0) {
      throw new Error(`No sources found for trend: ${trend.id}`);
    }

    const sourceBlocks: string[] = [];
    for (const result of searchResults) {
      await this.trackSource(result.url, result.title);
      try {
        const page = await this.researchProvider.fetchPage(result.url);
        sourceBlocks.push(`[Source: ${result.title} (${result.url})]\n${page.content}`);
      } catch (error) {
        this.log('warn', 'Failed to fetch research source', {
          trendId: trend.id,
          url: result.url,
          error: (error as Error).message,
        });
      }
    }

    if (sourceBlocks.length === 0) {
      throw new Error(`All research sources failed to fetch for trend: ${trend.id}`);
    }

    const prompt = this.buildExtractionPrompt(trend.title, sourceBlocks.join('\n---\n'));
    const extraction = await this.retryWithBackoff(
      async () =>
        (await this.aiProvider.generateStructured(
          prompt,
          RESEARCH_EXTRACTION_SCHEMA
        )) as ResearchExtractionResult,
      'researchExtraction',
      { trendId: trend.id }
    );

    if (!extraction.summary || extraction.summary.trim().length === 0) {
      throw new Error(`Research extraction returned an empty summary for trend: ${trend.id}`);
    }

    const research = new Research({
      id: this.buildResearchId(trend.id),
      trendId: trend.id,
      summary: extraction.summary,
      factsJson: JSON.stringify([]),
      claimsJson: JSON.stringify(extraction.claims ?? []),
      conflictsJson: JSON.stringify(extraction.conflicts ?? []),
      confidenceScore: extraction.confidenceScore ?? 0,
      status: ResearchStatus.COMPLETED,
    });

    await this.researchRepo.insert(research);

    this.log('info', 'Research completed for trend', {
      trendId: trend.id,
      researchId: research.id,
      sourceCount: sourceBlocks.length,
      claimCount: extraction.claims?.length ?? 0,
      conflictCount: extraction.conflicts?.length ?? 0,
      confidenceScore: research.confidenceScore,
    });

    return research;
  }

  private async extractFacts(research: Research, article: Article): Promise<Fact[]> {
    const facts = await this.retryWithBackoff(
      () => this.factExtractionService.extractFactsFromResearch(research.id, article.id),
      'factExtraction',
      { researchId: research.id, articleId: article.id }
    );

    this.log('info', 'Facts extracted from research', {
      researchId: research.id,
      articleId: article.id,
      factCount: facts.length,
    });

    return facts;
  }

  private async verifyFacts(article: Article): Promise<Fact[]> {
    const facts = await this.retryWithBackoff(
      () => this.factVerificationService.verifyArticleFacts(article.id),
      'factVerification',
      { articleId: article.id }
    );

    const verifiedCount = facts.filter(
      (fact) => fact.verificationStatus === VerificationStatus.VERIFIED
    ).length;

    this.log('info', 'Facts verified for article', {
      articleId: article.id,
      factCount: facts.length,
      verifiedCount,
    });

    return facts;
  }

  private async generateEditorial(
    article: Article,
    research: Research,
    facts: Fact[]
  ): Promise<Article> {
    const factInputs = facts.map((fact) => ({
      statement: fact.statement,
      confidence: fact.confidence,
    }));

    const generated = await this.retryWithBackoff(
      () =>
        this.editorialGenerationService.generateArticle(
          research.summary,
          factInputs,
          article.category
        ),
      'editorialGeneration',
      { articleId: article.id, researchId: research.id }
    );

    const updated = new Article({
      id: article.id,
      researchId: article.researchId,
      title: generated.title,
      slug: article.slug,
      dek: generated.dek,
      summary: generated.summary,
      body: generated.body,
      category: article.category,
      subcategory: article.subcategory,
      status: article.status,
      riskLevel: article.riskLevel,
      qualityScore: article.qualityScore,
      seoTitle: generated.seo_title,
      metaDescription: generated.meta_description,
      canonicalUrl: article.canonicalUrl,
      heroAssetId: article.heroAssetId,
      topicId: article.topicId,
      publishedAt: article.publishedAt,
      createdAt: article.createdAt,
      updatedAt: new Date(),
      version: article.version + 1,
      sourceCount: article.sourceCount,
      factCheckStatus: FactCheckStatus.COMPLETE,
    });

    await this.articleRepo.update(updated);

    this.log('info', 'Editorial content generated for article', {
      articleId: article.id,
      title: generated.title,
      bodyLength: generated.body.length,
      faqCount: generated.faq.length,
    });

    return updated;
  }

  private async runQualityGate(
    article: Article,
    facts: Fact[],
    assets: Asset[]
  ): Promise<QualityGateResult> {
    const result = await this.qualityGateService.evaluateArticle(article, facts, assets);

    this.log('info', 'Quality gate evaluated article', {
      articleId: article.id,
      score: result.score,
      passed: result.passed,
      issues: result.issues,
    });

    return result;
  }

  private applyQualityOutcome(article: Article, quality: QualityGateResult): Article {
    if (!quality.passed) {
      this.log('warn', 'Quality gate failed, article needs further research', {
        articleId: article.id,
        score: quality.score,
        issues: quality.issues,
      });
      return article.withStatus(ArticleStatus.NEEDS_RESEARCH).withQualityScore(quality.score);
    }
    return article.withStatus(ArticleStatus.VERIFIED).withQualityScore(quality.score);
  }

  private async createDraftArticle(trend: Trend, research: Research): Promise<Article> {
    const article = new Article({
      id: this.buildArticleId(trend.id),
      researchId: research.id,
      title: trend.title,
      slug: this.buildSlug(trend.title),
      dek: `Draft dek for trend: ${trend.title}`.slice(0, 300),
      summary: research.summary,
      body: this.buildPlaceholderBody(trend.title),
      category: 'general',
      status: ArticleStatus.DRAFT,
    });
    await this.articleRepo.insert(article);
    return article;
  }

  private async trackSource(url: string, title: string): Promise<void> {
    try {
      const domain = new URL(url).hostname.replace('www.', '');
      const existing = await this.sourceRepo.findByDomain(domain);

      const source =
        existing.length > 0
          ? new Source({
              ...existing[0].toParams(),
              accessedAt: new Date(),
            })
          : new Source({
              id: randomUUID(),
              url,
              domain,
              title,
              publisher: domain,
              sourceType: SourceType.ESTABLISHED_MEDIA,
              reliabilityState: ReliabilityState.UNVERIFIED,
              licenseState: LicenseState.UNKNOWN,
              createdAt: new Date(),
            });

      await this.sourceRepo.upsert(source);
    } catch (error) {
      this.log('warn', 'Failed to track research source', {
        url,
        error: (error as Error).message,
      });
    }
  }

  private async retryWithBackoff<T>(
    operation: () => Promise<T>,
    operationName: string,
    context: Record<string, unknown>
  ): Promise<T> {
    let lastError: unknown;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;

        if (attempt >= MAX_RETRIES) {
          break;
        }

        const delayMs = Math.min(INITIAL_BACKOFF_MS * 2 ** attempt, MAX_BACKOFF_MS);

        this.log('warn', 'AI call failed, retrying with bounded backoff', {
          operation: operationName,
          attempt: attempt + 1,
          maxAttempts: MAX_RETRIES + 1,
          delayMs,
          error: (error as Error).message,
          ...context,
        });

        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    if (lastError instanceof Error) {
      throw lastError;
    }
    throw new Error(`Operation ${operationName} failed after ${MAX_RETRIES + 1} attempts`);
  }

  private buildExtractionPrompt(trendTitle: string, sourcesText: string): string {
    return [
      'You are an editorial research assistant for SEMBURAT, an Indonesian media intelligence platform.',
      '',
      `TREND: ${trendTitle}`,
      '',
      'Given the following sources about the trend, extract:',
      '1. A concise summary (2-3 sentences in Indonesian)',
      '2. Key claims with confidence scores (0-1) and their supporting source URLs',
      '3. Any conflicts or contradictions between sources',
      '4. An overall confidence score for the research (0-1)',
      '',
      'SOURCES:',
      sourcesText,
      '',
      'Return ONLY valid JSON that matches the provided schema.',
    ].join('\n');
  }

  private buildPlaceholderBody(title: string): string {
    return (
      `Draft article body for trend "${title}". ` +
      'The editorial content is generated by the editorial generation service ' +
      'after facts have been extracted from research and verified against sources. ' +
      'This placeholder keeps the draft article valid during the research pipeline.'
    );
  }

  private buildSlug(title: string): string {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 100)
      .replace(/-+$/g, '');
    return slug.length > 0 ? slug : `trend-${randomUUID()}`;
  }

  private buildArticleId(trendId: string): string {
    return `art_${trendId}`;
  }

  private buildResearchId(trendId: string): string {
    return `res_${trendId}`;
  }

  private log(
    level: 'info' | 'warn' | 'error',
    message: string,
    context: Record<string, unknown>
  ): void {
    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level,
        service: 'TrendResearchPipeline',
        message,
        context,
      })
    );
  }
}
