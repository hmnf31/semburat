import { describe, it, expect } from 'vitest';
import { Article, ArticleStatus, FactCheckStatus } from '../../src/entities/Article.js';
import { Slug } from '../../src/value-objects/Slug.js';
import { RiskLevel } from '../../src/value-objects/RiskLevel.js';
import { QualityScore } from '../../src/value-objects/QualityScore.js';
import { ValidationError } from '@semburat/shared';

describe('Article', () => {
  const validParams = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    researchId: '550e8400-e29b-41d4-a716-446655440001',
    title: 'Valid Article Title Here',
    slug: 'valid-article-title',
    dek: 'This is a valid dek for the article',
    summary: 'Summary of the article',
    body: 'This is the body of the article which is long enough to pass validation requirements for the article content.',
    category: 'news',
  };

  it('should create an article with valid data', () => {
    const article = new Article(validParams);
    expect(article.id).toBe(validParams.id);
    expect(article.title).toBe(validParams.title);
    expect(article.status).toBe(ArticleStatus.DRAFT);
    expect(article.riskLevel.value).toBe('LOW');
    expect(article.qualityScore.value).toBe(0);
    expect(article.version).toBe(1);
    expect(article.factCheckStatus).toBe(FactCheckStatus.PENDING);
  });

  it('should throw ValidationError for title too short', () => {
    expect(() => new Article({ ...validParams, title: 'Shrt' })).toThrow(ValidationError);
  });

  it('should throw ValidationError for title too long', () => {
    expect(() => new Article({ ...validParams, title: 'a'.repeat(201) })).toThrow(ValidationError);
  });

  it('should throw ValidationError for dek too short', () => {
    expect(() => new Article({ ...validParams, dek: 'Short' })).toThrow(ValidationError);
  });

  it('should throw ValidationError for body too short', () => {
    expect(() => new Article({ ...validParams, body: 'Short body' })).toThrow(ValidationError);
  });

  it('should throw ValidationError for missing category', () => {
    expect(() => new Article({ ...validParams, category: '' })).toThrow(ValidationError);
  });

  it('canTransitionTo should return true for valid transitions', () => {
    const article = new Article(validParams);
    expect(article.canTransitionTo(ArticleStatus.RESEARCHING)).toBe(true);
    expect(article.canTransitionTo(ArticleStatus.NEEDS_RESEARCH)).toBe(true);
    expect(article.canTransitionTo(ArticleStatus.REJECTED)).toBe(true);
  });

  it('canTransitionTo should return false for invalid transitions', () => {
    const article = new Article(validParams);
    expect(article.canTransitionTo(ArticleStatus.PUBLISHED)).toBe(false);
    expect(article.canTransitionTo(ArticleStatus.APPROVED)).toBe(false);
  });

  it('withTitle should return new Article with updated title', () => {
    const article = new Article(validParams);
    const newArticle = article.withTitle('New Valid Title Here');
    expect(newArticle.title).toBe('New Valid Title Here');
    expect(newArticle.version).toBe(2);
    expect(newArticle.updatedAt).not.toBe(article.updatedAt);
  });

  it('withStatus should return new Article with updated status', () => {
    const article = new Article(validParams);
    const newArticle = article.withStatus(ArticleStatus.RESEARCHING);
    expect(newArticle.status).toBe(ArticleStatus.RESEARCHING);
    expect(newArticle.version).toBe(2);
  });

  it('withStatus should throw for invalid transition', () => {
    const article = new Article(validParams);
    expect(() => article.withStatus(ArticleStatus.PUBLISHED)).toThrow(ValidationError);
  });

  it('withQualityScore should return new Article with updated score', () => {
    const article = new Article(validParams);
    const newArticle = article.withQualityScore(85);
    expect(newArticle.qualityScore.value).toBe(85);
    expect(newArticle.version).toBe(2);
  });

  it('markPublished should set status to PUBLISHED and set publishedAt', () => {
    const article = new Article({ ...validParams, status: ArticleStatus.APPROVED });
    const published = article.markPublished();
    expect(published.status).toBe(ArticleStatus.PUBLISHED);
    expect(published.publishedAt).toBeInstanceOf(Date);
    expect(published.version).toBe(2);
  });

  it('markRejected should set status to REJECTED', () => {
    const article = new Article(validParams);
    const rejected = article.markRejected('Quality issues');
    expect(rejected.status).toBe(ArticleStatus.REJECTED);
    expect(rejected.version).toBe(2);
  });

  it('should accept Slug and RiskLevel value objects', () => {
    const slug = Slug.fromString('custom-slug');
    const riskLevel = RiskLevel.fromString('HIGH');
    const article = new Article({ ...validParams, slug, riskLevel });
    expect(article.slug).toBe(slug);
    expect(article.riskLevel).toBe(riskLevel);
  });

  it('withHeroAsset should set heroAssetId on a new Article instance', () => {
    const article = new Article(validParams);
    const withHero = article.withHeroAsset('550e8400-e29b-41d4-a716-446655440099');
    expect(withHero.heroAssetId).toBe('550e8400-e29b-41d4-a716-446655440099');
    expect(withHero.version).toBe(2);
    expect(article.heroAssetId).toBeUndefined();
  });
});
