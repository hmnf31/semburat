import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HumanReviewQueueService } from '../../src/services/HumanReviewQueueService.js';
import { Article, ArticleStatus, type ArticleRepository } from '@semburat/domain';

const createArticle = (
  overrides: Partial<{
    id: string;
    researchId: string;
    status: ArticleStatus;
  }> = {}
): Article => {
  return new Article({
    id: overrides.id ?? '123e4567-e89b-12d3-a456-426614174000',
    researchId: overrides.researchId ?? '223e4567-e89b-12d3-a456-426614174001',
    title: 'Test Article Title',
    slug: 'test-article-title',
    dek: 'This is a test dek that is long enough for validation',
    summary: 'This is a test summary.',
    body: 'This is the body of the test article. It needs to be at least 100 characters long to pass the validation requirements of the Article constructor. This sentence ensures we meet that threshold.',
    category: 'news',
    status: overrides.status,
  });
};

describe('HumanReviewQueueService', () => {
  let mockArticleRepo: ArticleRepository;
  let service: HumanReviewQueueService;

  beforeEach(() => {
    mockArticleRepo = {
      insert: vi.fn(),
      findById: vi.fn(),
      findBySlug: vi.fn(),
      findByStatus: vi.fn(),
      update: vi.fn(),
      updateStatus: vi.fn(),
    } as ArticleRepository;
    service = new HumanReviewQueueService(mockArticleRepo);
  });

  it('enqueueForReview sets NEEDS_REVIEW status', async () => {
    const article = createArticle({ status: ArticleStatus.EDITORIAL_REVIEW });
    vi.mocked(mockArticleRepo.findById).mockResolvedValue(article);
    vi.mocked(mockArticleRepo.update).mockResolvedValue(undefined);

    await service.enqueueForReview(article.id, 'needs review');

    expect(mockArticleRepo.findById).toHaveBeenCalledWith(article.id);
    expect(mockArticleRepo.update).toHaveBeenCalledTimes(1);
    const updated = vi.mocked(mockArticleRepo.update).mock.calls[0][0] as Article;
    expect(updated.status).toBe(ArticleStatus.NEEDS_REVIEW);
  });

  it('getReviewQueue returns articles with NEEDS_REVIEW', async () => {
    const articles = [
      createArticle({
        id: '123e4567-e89b-12d3-a456-426614174000',
        status: ArticleStatus.NEEDS_REVIEW,
      }),
      createArticle({
        id: '223e4567-e89b-12d3-a456-426614174000',
        status: ArticleStatus.NEEDS_REVIEW,
      }),
    ];
    vi.mocked(mockArticleRepo.findByStatus).mockResolvedValue({
      articles,
      nextCursor: null,
    });

    const result = await service.getReviewQueue(10);

    expect(mockArticleRepo.findByStatus).toHaveBeenCalledWith(ArticleStatus.NEEDS_REVIEW, 10);
    expect(result).toHaveLength(2);
    expect(result.every((a) => a.status === ArticleStatus.NEEDS_REVIEW)).toBe(true);
  });

  it('approve changes status to APPROVED', async () => {
    const article = createArticle({ status: ArticleStatus.NEEDS_REVIEW });
    vi.mocked(mockArticleRepo.findById).mockResolvedValue(article);
    vi.mocked(mockArticleRepo.update).mockResolvedValue(undefined);

    const result = await service.approve(article.id, 'operator');

    expect(result.status).toBe(ArticleStatus.APPROVED);
    expect(mockArticleRepo.update).toHaveBeenCalledTimes(1);
    const updated = vi.mocked(mockArticleRepo.update).mock.calls[0][0] as Article;
    expect(updated.status).toBe(ArticleStatus.APPROVED);
  });

  it('reject changes status to REJECTED', async () => {
    const article = createArticle({ status: ArticleStatus.NEEDS_REVIEW });
    vi.mocked(mockArticleRepo.findById).mockResolvedValue(article);
    vi.mocked(mockArticleRepo.update).mockResolvedValue(undefined);

    const result = await service.reject(article.id, 'operator', 'reason');

    expect(result.status).toBe(ArticleStatus.REJECTED);
    expect(mockArticleRepo.update).toHaveBeenCalledTimes(1);
    const updated = vi.mocked(mockArticleRepo.update).mock.calls[0][0] as Article;
    expect(updated.status).toBe(ArticleStatus.REJECTED);
  });
});
