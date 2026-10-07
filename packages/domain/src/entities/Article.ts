import { ValidationError } from '@semburat/shared';
import { Slug } from '../value-objects/Slug.js';
import { RiskLevel } from '../value-objects/RiskLevel.js';
import { QualityScore } from '../value-objects/QualityScore.js';

import type { ArticleId, ResearchId, AssetId, TopicId } from '@semburat/shared';

export enum ArticleStatus {
  DRAFT = 'draft',
  RESEARCHING = 'researching',
  VERIFIED = 'verified',
  EDITORIAL_REVIEW = 'editorial_review',
  APPROVED = 'approved',
  SCHEDULED = 'scheduled',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  REJECTED = 'rejected',
  NEEDS_RESEARCH = 'needs_research',
  NEEDS_ASSET = 'needs_asset',
  NEEDS_LICENSE = 'needs_license',
  NEEDS_REVIEW = 'needs_review',
}

export enum FactCheckStatus {
  PENDING = 'pending',
  PARTIAL = 'partial',
  COMPLETE = 'complete',
  FAILED = 'failed',
}

const VALID_TRANSITIONS: Record<ArticleStatus, ArticleStatus[]> = {
  [ArticleStatus.DRAFT]: [
    ArticleStatus.RESEARCHING,
    ArticleStatus.NEEDS_RESEARCH,
    ArticleStatus.REJECTED,
  ],
  [ArticleStatus.RESEARCHING]: [
    ArticleStatus.VERIFIED,
    ArticleStatus.NEEDS_RESEARCH,
    ArticleStatus.REJECTED,
  ],
  [ArticleStatus.VERIFIED]: [
    ArticleStatus.EDITORIAL_REVIEW,
    ArticleStatus.NEEDS_RESEARCH,
    ArticleStatus.REJECTED,
  ],
  [ArticleStatus.EDITORIAL_REVIEW]: [
    ArticleStatus.APPROVED,
    ArticleStatus.NEEDS_REVIEW,
    ArticleStatus.REJECTED,
  ],
  [ArticleStatus.APPROVED]: [
    ArticleStatus.SCHEDULED,
    ArticleStatus.PUBLISHED,
    ArticleStatus.REJECTED,
  ],
  [ArticleStatus.SCHEDULED]: [ArticleStatus.PUBLISHED, ArticleStatus.REJECTED],
  [ArticleStatus.PUBLISHED]: [ArticleStatus.ARCHIVED, ArticleStatus.REJECTED],
  [ArticleStatus.ARCHIVED]: [],
  [ArticleStatus.REJECTED]: [ArticleStatus.DRAFT],
  [ArticleStatus.NEEDS_RESEARCH]: [ArticleStatus.RESEARCHING, ArticleStatus.REJECTED],
  [ArticleStatus.NEEDS_ASSET]: [ArticleStatus.EDITORIAL_REVIEW, ArticleStatus.REJECTED],
  [ArticleStatus.NEEDS_LICENSE]: [ArticleStatus.EDITORIAL_REVIEW, ArticleStatus.REJECTED],
  [ArticleStatus.NEEDS_REVIEW]: [
    ArticleStatus.EDITORIAL_REVIEW,
    ArticleStatus.APPROVED,
    ArticleStatus.REJECTED,
  ],
};

export interface ArticleParams {
  id: ArticleId;
  researchId: ResearchId;
  title: string;
  slug: Slug | string;
  dek: string;
  summary: string;
  body: string;
  category: string;
  subcategory?: string;
  status?: ArticleStatus;
  riskLevel?: RiskLevel | string;
  qualityScore?: QualityScore | number;
  seoTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  heroAssetId?: AssetId;
  topicId?: TopicId;
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  version?: number;
  sourceCount?: number;
  factCheckStatus?: FactCheckStatus;
}

export class Article {
  public readonly id: ArticleId;
  public readonly researchId: ResearchId;
  public readonly title: string;
  public readonly slug: Slug;
  public readonly dek: string;
  public readonly summary: string;
  public readonly body: string;
  public readonly category: string;
  public readonly subcategory?: string;
  public readonly status: ArticleStatus;
  public readonly riskLevel: RiskLevel;
  public readonly qualityScore: QualityScore;
  public readonly seoTitle?: string;
  public readonly metaDescription?: string;
  public readonly canonicalUrl?: string;
  public readonly heroAssetId?: AssetId;
  public readonly topicId?: TopicId;
  public readonly publishedAt?: Date;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly version: number;
  public readonly sourceCount: number;
  public readonly factCheckStatus: FactCheckStatus;

  constructor(params: ArticleParams) {
    if (!params.title || params.title.length < 5 || params.title.length > 200) {
      throw new ValidationError('Title must be between 5 and 200 characters');
    }
    if (!params.dek || params.dek.length < 10 || params.dek.length > 300) {
      throw new ValidationError('Dek must be between 10 and 300 characters');
    }
    if (!params.body || params.body.length < 100) {
      throw new ValidationError('Body must be at least 100 characters');
    }
    if (!params.category) {
      throw new ValidationError('Category is required');
    }

    this.id = params.id;
    this.researchId = params.researchId;
    this.title = params.title;
    this.slug = params.slug instanceof Slug ? params.slug : Slug.fromString(params.slug);
    this.dek = params.dek;
    this.summary = params.summary;
    this.body = params.body;
    this.category = params.category;
    this.subcategory = params.subcategory;
    this.status = params.status ?? ArticleStatus.DRAFT;
    this.riskLevel =
      params.riskLevel instanceof RiskLevel
        ? params.riskLevel
        : RiskLevel.fromString(params.riskLevel ?? 'LOW');
    this.qualityScore =
      params.qualityScore instanceof QualityScore
        ? params.qualityScore
        : QualityScore.fromNumber(params.qualityScore ?? 0);
    this.seoTitle = params.seoTitle;
    this.metaDescription = params.metaDescription;
    this.canonicalUrl = params.canonicalUrl;
    this.heroAssetId = params.heroAssetId;
    this.topicId = params.topicId;
    this.publishedAt = params.publishedAt;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
    this.version = params.version ?? 1;
    this.sourceCount = params.sourceCount ?? 0;
    this.factCheckStatus = params.factCheckStatus ?? FactCheckStatus.PENDING;
  }

  canTransitionTo(newStatus: ArticleStatus): boolean {
    return VALID_TRANSITIONS[this.status]?.includes(newStatus) ?? false;
  }

  withTitle(title: string): Article {
    return new Article({
      ...this.toParams(),
      title,
      updatedAt: new Date(),
      version: this.version + 1,
    });
  }

  withStatus(status: ArticleStatus): Article {
    if (!this.canTransitionTo(status)) {
      throw new ValidationError(`Cannot transition from ${this.status} to ${status}`);
    }
    return new Article({
      ...this.toParams(),
      status,
      updatedAt: new Date(),
      version: this.version + 1,
    });
  }

  withQualityScore(score: QualityScore | number): Article {
    const qualityScore = score instanceof QualityScore ? score : QualityScore.fromNumber(score);
    return new Article({
      ...this.toParams(),
      qualityScore,
      updatedAt: new Date(),
      version: this.version + 1,
    });
  }

  markPublished(): Article {
    return new Article({
      ...this.toParams(),
      status: ArticleStatus.PUBLISHED,
      publishedAt: new Date(),
      updatedAt: new Date(),
      version: this.version + 1,
    });
  }

  markRejected(reason: string): Article {
    void reason;
    return new Article({
      ...this.toParams(),
      status: ArticleStatus.REJECTED,
      updatedAt: new Date(),
      version: this.version + 1,
    });
  }

  private toParams(): ArticleParams {
    return {
      id: this.id,
      researchId: this.researchId,
      title: this.title,
      slug: this.slug,
      dek: this.dek,
      summary: this.summary,
      body: this.body,
      category: this.category,
      subcategory: this.subcategory,
      status: this.status,
      riskLevel: this.riskLevel,
      qualityScore: this.qualityScore,
      seoTitle: this.seoTitle,
      metaDescription: this.metaDescription,
      canonicalUrl: this.canonicalUrl,
      heroAssetId: this.heroAssetId,
      topicId: this.topicId,
      publishedAt: this.publishedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      version: this.version,
      sourceCount: this.sourceCount,
      factCheckStatus: this.factCheckStatus,
    };
  }
}
