const fs = require('fs');
const content =
  'import { ValidationError } from "semburat-shared";\n' +
  'import { Slug } from "../value-objects/Slug.js";\n' +
  'import { RiskLevel } from "../value-objects/RiskLevel.js";\n' +
  'import { QualityScore } from "../value-objects/QualityScore.js";\n\n' +
  'export type ArticleId = string;\n' +
  'export type ResearchId = string;\n' +
  'export type AssetId = string;\n' +
  'export type TopicId = string;\n\n' +
  'export enum ArticleStatus {\n' +
  '  DRAFT = "draft",\n' +
  '  RESEARCHING = "researching",\n' +
  '  VERIFIED = "verified",\n' +
  '  EDITORIAL_REVIEW = "editorial_review",\n' +
  '  APPROVED = "approved",\n' +
  '  SCHEDULED = "scheduled",\n' +
  '  PUBLISHED = "published",\n' +
  '  ARCHIVED = "archived",\n' +
  '  REJECTED = "rejected",\n' +
  '  NEEDS_RESEARCH = "needs_research",\n' +
  '  NEEDS_ASSET = "needs_asset",\n' +
  '  NEEDS_LICENSE = "needs_license",\n' +
  '  NEEDS_REVIEW = "needs_review",\n' +
  '}\n\n' +
  'export enum FactCheckStatus {\n' +
  '  PENDING = "pending",\n' +
  '  PARTIAL = "partial",\n' +
  '  COMPLETE = "complete",\n' +
  '  FAILED = "failed",\n' +
  '}\n\n' +
  'const VALID_TRANSITIONS = {\n' +
  '  [ArticleStatus.DRAFT]: [ArticleStatus.RESEARCHING, ArticleStatus.NEEDS_RESEARCH, ArticleStatus.REJECTED],\n' +
  '  [ArticleStatus.RESEARCHING]: [ArticleStatus.VERIFIED, ArticleStatus.NEEDS_RESEARCH, ArticleStatus.REJECTED],\n' +
  '  [ArticleStatus.VERIFIED]: [ArticleStatus.EDITORIAL_REVIEW, ArticleStatus.NEEDS_RESEARCH, ArticleStatus.REJECTED],\n' +
  '  [ArticleStatus.EDITORIAL_REVIEW]: [ArticleStatus.APPROVED, ArticleStatus.NEEDS_REVIEW, ArticleStatus.REJECTED],\n' +
  '  [ArticleStatus.APPROVED]: [ArticleStatus.SCHEDULED, ArticleStatus.PUBLISHED, ArticleStatus.REJECTED],\n' +
  '  [ArticleStatus.SCHEDULED]: [ArticleStatus.PUBLISHED, ArticleStatus.REJECTED],\n' +
  '  [ArticleStatus.PUBLISHED]: [ArticleStatus.ARCHIVED, ArticleStatus.REJECTED],\n' +
  '  [ArticleStatus.ARCHIVED]: [],\n' +
  '  [ArticleStatus.REJECTED]: [ArticleStatus.DRAFT],\n' +
  '  [ArticleStatus.NEEDS_RESEARCH]: [ArticleStatus.RESEARCHING, ArticleStatus.REJECTED],\n' +
  '  [ArticleStatus.NEEDS_ASSET]: [ArticleStatus.EDITORIAL_REVIEW, ArticleStatus.REJECTED],\n' +
  '  [ArticleStatus.NEEDS_LICENSE]: [ArticleStatus.EDITORIAL_REVIEW, ArticleStatus.REJECTED],\n' +
  '  [ArticleStatus.NEEDS_REVIEW]: [ArticleStatus.EDITORIAL_REVIEW, ArticleStatus.REJECTED],\n' +
  '};\n\n' +
  'export class Article {\n' +
  '  constructor(params) {\n' +
  '    if (!params.title || params.title.length < 5 || params.title.length > 200) {\n' +
  '      throw new ValidationError("Title must be between 5 and 200 characters");\n' +
  '    }\n' +
  '    if (!params.dek || params.dek.length < 10 || params.dek.length > 300) {\n' +
  '      throw new ValidationError("Dek must be between 10 and 300 characters");\n' +
  '    }\n' +
  '    if (!params.body || params.body.length < 100) {\n' +
  '      throw new ValidationError("Body must be at least 100 characters");\n' +
  '    }\n' +
  '    if (!params.category) {\n' +
  '      throw new ValidationError("Category is required");\n' +
  '    }\n\n' +
  '    this.id = params.id;\n' +
  '    this.researchId = params.researchId;\n' +
  '    this.title = params.title;\n' +
  '    this.slug = params.slug instanceof Slug ? params.slug : Slug.fromString(params.slug);\n' +
  '    this.dek = params.dek;\n' +
  '    this.summary = params.summary;\n' +
  '    this.body = params.body;\n' +
  '    this.category = params.category;\n' +
  '    this.subcategory = params.subcategory;\n' +
  '    this.status = params.status ?? ArticleStatus.DRAFT;\n' +
  '    this.riskLevel = params.riskLevel instanceof RiskLevel ? params.riskLevel : RiskLevel.fromString(params.riskLevel ?? "LOW");\n' +
  '    this.qualityScore = params.qualityScore instanceof QualityScore ? params.qualityScore : QualityScore.fromNumber(params.qualityScore ?? 0);\n' +
  '    this.seoTitle = params.seoTitle;\n' +
  '    this.metaDescription = params.metaDescription;\n' +
  '    this.canonicalUrl = params.canonicalUrl;\n' +
  '    this.heroAssetId = params.heroAssetId;\n' +
  '    this.topicId = params.topicId;\n' +
  '    this.publishedAt = params.publishedAt;\n' +
  '    this.createdAt = params.createdAt ?? new Date();\n' +
  '    this.updatedAt = params.updatedAt ?? new Date();\n' +
  '    this.version = params.version ?? 1;\n' +
  '    this.sourceCount = params.sourceCount ?? 0;\n' +
  '    this.factCheckStatus = params.factCheckStatus ?? FactCheckStatus.PENDING;\n' +
  '  }\n\n' +
  '  canTransitionTo(newStatus) {\n' +
  '    return VALID_TRANSITIONS[this.status]?.includes(newStatus) ?? false;\n' +
  '  }\n\n' +
  '  withTitle(title) {\n' +
  '    return new Article({ ...this.toParams(), title, updatedAt: new Date(), version: this.version + 1 });\n' +
  '  }\n\n' +
  '  withStatus(status) {\n' +
  '    if (!this.canTransitionTo(status)) {\n' +
  '      throw new ValidationError(`Cannot transition from ${this.status} to ${status}`);\n' +
  '    }\n' +
  '    return new Article({ ...this.toParams(), status, updatedAt: new Date(), version: this.version + 1 });\n' +
  '  }\n\n' +
  '  withQualityScore(score) {\n' +
  '    const qualityScore = score instanceof QualityScore ? score : QualityScore.fromNumber(score);\n' +
  '    return new Article({ ...this.toParams(), qualityScore, updatedAt: new Date(), version: this.version + 1 });\n' +
  '  }\n\n' +
  '  markPublished() {\n' +
  '    return new Article({\n' +
  '      ...this.toParams(),\n' +
  '      status: ArticleStatus.PUBLISHED,\n' +
  '      publishedAt: new Date(),\n' +
  '      updatedAt: new Date(),\n' +
  '      version: this.version + 1,\n' +
  '    });\n' +
  '  }\n\n' +
  '  markRejected(reason) {\n' +
  '    return new Article({\n' +
  '      ...this.toParams(),\n' +
  '      status: ArticleStatus.REJECTED,\n' +
  '      updatedAt: new Date(),\n' +
  '      version: this.version + 1,\n' +
  '    });\n' +
  '  }\n\n' +
  '  toParams() {\n' +
  '    return {\n' +
  '      id: this.id,\n' +
  '      researchId: this.researchId,\n' +
  '      title: this.title,\n' +
  '      slug: this.slug,\n' +
  '      dek: this.dek,\n' +
  '      summary: this.summary,\n' +
  '      body: this.body,\n' +
  '      category: this.category,\n' +
  '      subcategory: this.subcategory,\n' +
  '      status: this.status,\n' +
  '      riskLevel: this.riskLevel,\n' +
  '      qualityScore: this.qualityScore,\n' +
  '      seoTitle: this.seoTitle,\n' +
  '      metaDescription: this.metaDescription,\n' +
  '      canonicalUrl: this.canonicalUrl,\n' +
  '      heroAssetId: this.heroAssetId,\n' +
  '      topicId: this.topicId,\n' +
  '      publishedAt: this.publishedAt,\n' +
  '      createdAt: this.createdAt,\n' +
  '      updatedAt: this.updatedAt,\n' +
  '      version: this.version,\n' +
  '      sourceCount: this.sourceCount,\n' +
  '      factCheckStatus: this.factCheckStatus,\n' +
  '    };\n' +
  '  }\n' +
  '}\n';
fs.writeFileSync('E:/semburat-project/packages/domain/src/entities/Article.ts', content);
console.log('Article.ts written');
