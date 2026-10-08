import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WebPublisher } from '../../../src/adapters/publishing/WebPublisher.js';
import {
  ContentVariant,
  Platform,
  ApprovalState,
  Article,
  ArticleStatus,
  FactCheckStatus,
} from '@semburat/domain';
import type { ArticleRepository } from '@semburat/domain';
import type { ContentVariantId, ArticleId, ResearchId, AssetId } from '@semburat/shared';

function makeArticle(overrides: Partial<ConstructorParameters<typeof Article>[0]> = {}): Article {
  return new Article({
    id: '550e8400-e29b-41d4-a716-446655440001',
    researchId: '550e8400-e29b-41d4-a716-446655440002',
    title: 'Valid Article Title Here',
    slug: 'valid-article-title',
    dek: 'This is a valid dek for the article',
    summary: 'Summary of the article',
    body: 'This is the body of the article which is long enough to pass validation requirements for the article content.',
    category: 'news',
    status: ArticleStatus.PUBLISHED,
    factCheckStatus: FactCheckStatus.COMPLETE,
    ...overrides,
  });
}

function makeVariant(
  overrides: Partial<{
    id: ContentVariantId;
    articleId: ArticleId;
    platform: Platform;
    format: string;
    content: string;
    approvalState: ApprovalState;
  }> = {}
): ContentVariant {
  return new ContentVariant({
    id: '550e8400-e29b-41d4-a716-446655440000',
    articleId: '550e8400-e29b-41d4-a716-446655440001',
    platform: Platform.WEB,
    format: 'html',
    content: '<p>Test content for web</p>',
    approvalState: ApprovalState.APPROVED,
    ...overrides,
  });
}

describe('WebPublisher', () => {
  let publisher: WebPublisher;
  let mockArticleRepo: ArticleRepository;
  let article: Article;

  beforeEach(() => {
    article = makeArticle();
    mockArticleRepo = {
      findById: vi.fn().mockResolvedValue(article),
      findBySlug: vi.fn(),
      findByStatus: vi.fn(),
      findAll: vi.fn().mockResolvedValue([]),
      insert: vi.fn(),
      update: vi.fn().mockResolvedValue(undefined),
      updateStatus: vi.fn(),
    } as ArticleRepository;
    publisher = new WebPublisher(mockArticleRepo);
  });

  it('publishes to web, updates article status to PUBLISHED, returns externalId and url', async () => {
    const articleToPublish = makeArticle({ status: ArticleStatus.APPROVED });
    (mockArticleRepo.findById as ReturnType<typeof vi.fn>).mockResolvedValue(articleToPublish);

    const variant = makeVariant();
    const result = await publisher.publish(variant);

    expect(result.externalId).toBe(articleToPublish.id);
    expect(result.url).toBe('https://semburat.com/valid-article-title');
    expect(mockArticleRepo.findById).toHaveBeenCalledWith(variant.articleId);
    expect(mockArticleRepo.update).toHaveBeenCalled();
    const updatedArticle = (mockArticleRepo.update as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(updatedArticle.status).toBe(ArticleStatus.PUBLISHED);
    expect(updatedArticle.publishedAt).toBeDefined();
  });

  it('uses canonicalUrl when available', async () => {
    const articleWithCanonical = makeArticle({
      status: ArticleStatus.APPROVED,
      canonicalUrl: 'https://custom.com/article',
    });
    (mockArticleRepo.findById as ReturnType<typeof vi.fn>).mockResolvedValue(articleWithCanonical);

    const variant = makeVariant();
    const result = await publisher.publish(variant);

    expect(result.url).toBe('https://custom.com/article');
  });

  it('throws on non-WEB platform', async () => {
    const variant = makeVariant({ platform: Platform.TELEGRAM });
    await expect(publisher.publish(variant)).rejects.toThrow(
      'WebPublisher can only publish to web'
    );
  });

  it('throws when article not found', async () => {
    (mockArticleRepo.findById as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    const variant = makeVariant();
    await expect(publisher.publish(variant)).rejects.toThrow('Article not found');
  });

  it('delete archives the article', async () => {
    await publisher.delete(article.id);

    expect(mockArticleRepo.findById).toHaveBeenCalledWith(article.id);
    expect(mockArticleRepo.update).toHaveBeenCalled();
    const updatedArticle = (mockArticleRepo.update as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(updatedArticle.status).toBe(ArticleStatus.ARCHIVED);
  });

  it('throws when deleting non-existent article', async () => {
    (mockArticleRepo.findById as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    await expect(publisher.delete('non-existent')).rejects.toThrow('Article not found');
  });
});
