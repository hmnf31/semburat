import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ContentRepurposingService } from '../../src/services/ContentRepurposingService.js';
import { Article, ArticleStatus, ApprovalState, Platform, ContentVariant } from '@semburat/domain';
import type { ContentVariantRepository, ArticleRepository, AIProvider } from '@semburat/domain';
import { Slug } from '@semburat/domain';
import { RiskLevel } from '@semburat/domain';
import { QualityScore } from '@semburat/domain';
import type { ArticleId, ResearchId } from '@semburat/shared';

describe('ContentRepurposingService', () => {
  let mockAIProvider: AIProvider;
  let mockArticleRepo: ArticleRepository;
  let mockContentVariantRepo: ContentVariantRepository;
  let service: ContentRepurposingService;
  let testArticle: Article;

  beforeEach(() => {
    mockAIProvider = {
      generateStructured: vi.fn(),
      generateText: vi.fn(),
      streamChat: vi.fn(),
    } as AIProvider;

    mockArticleRepo = {
      insert: vi.fn(),
      findById: vi.fn(),
      findBySlug: vi.fn(),
      findByStatus: vi.fn(),
      findAll: vi.fn().mockResolvedValue([]),
      update: vi.fn(),
      updateStatus: vi.fn(),
    } as ArticleRepository;

    mockContentVariantRepo = {
      insert: vi.fn(),
      findById: vi.fn(),
      findByArticleId: vi.fn(),
      updateApprovalState: vi.fn(),
    } as ContentVariantRepository;

    service = new ContentRepurposingService(
      mockContentVariantRepo,
      mockArticleRepo,
      mockAIProvider
    );

    testArticle = new Article({
      id: 'article-1' as ArticleId,
      researchId: 'research-1' as ResearchId,
      title: 'Test Article Title About Indonesian News',
      slug: Slug.fromString('test-article-title'),
      dek: 'This is a test lead paragraph providing context.',
      summary: 'Test summary for the article.',
      body: 'This is the body of the test article which contains enough content to pass validation requirements for the article content generation and testing purposes.',
      category: 'news',
      status: ArticleStatus.APPROVED,
      riskLevel: RiskLevel.fromString('LOW'),
      qualityScore: QualityScore.fromNumber(80),
    });
  });

  describe('generateVariantsForArticle', () => {
    it('returns variants for all platforms', async () => {
      vi.mocked(mockArticleRepo.findById).mockResolvedValue(testArticle);
      vi.mocked(mockAIProvider.generateStructured).mockResolvedValue({
        content: 'Generated content',
      });
      vi.mocked(mockContentVariantRepo.insert).mockResolvedValue(undefined);

      const variants = await service.generateVariantsForArticle('article-1');

      expect(variants).toHaveLength(10);
      expect(mockArticleRepo.findById).toHaveBeenCalledWith('article-1');
      expect(mockAIProvider.generateStructured).toHaveBeenCalledTimes(10);
      expect(mockContentVariantRepo.insert).toHaveBeenCalledTimes(10);

      const platforms = variants.map((v) => v.platform);
      expect(platforms).toContain(Platform.WEB);
      expect(platforms).toContain(Platform.INSTAGRAM_FEED);
      expect(platforms).toContain(Platform.INSTAGRAM_STORY);
      expect(platforms).toContain(Platform.INSTAGRAM_CAROUSEL);
      expect(platforms).toContain(Platform.FACEBOOK);
      expect(platforms).toContain(Platform.X);
      expect(platforms).toContain(Platform.THREADS);
      expect(platforms).toContain(Platform.TELEGRAM);
      expect(platforms).toContain(Platform.REEL);
      expect(platforms).toContain(Platform.SHORT);

      variants.forEach((variant) => {
        expect(variant.content).toBe('Generated content');
        expect(variant.approvalState).toBe(ApprovalState.PENDING);
        expect(variant.articleId).toBe('article-1');
      });
    });

    it('throws when article not found', async () => {
      vi.mocked(mockArticleRepo.findById).mockResolvedValue(null);

      await expect(service.generateVariantsForArticle('missing-article')).rejects.toThrow(
        'Article not found: missing-article'
      );
    });
  });

  describe('approveVariant', () => {
    it('sets APPROVED state', async () => {
      const existingVariant = new ContentVariant({
        id: 'variant-1' as any,
        articleId: 'article-1' as ArticleId,
        platform: Platform.WEB,
        format: 'canonical',
        content: 'Existing content',
        approvalState: ApprovalState.PENDING,
      });

      vi.mocked(mockContentVariantRepo.findById).mockResolvedValue(existingVariant);
      vi.mocked(mockContentVariantRepo.updateApprovalState).mockResolvedValue(undefined);

      const result = await service.approveVariant('variant-1');

      expect(result.approvalState).toBe(ApprovalState.APPROVED);
      expect(mockContentVariantRepo.findById).toHaveBeenCalledWith('variant-1');
      expect(mockContentVariantRepo.updateApprovalState).toHaveBeenCalledWith(
        'variant-1',
        ApprovalState.APPROVED
      );
    });

    it('throws when variant not found', async () => {
      vi.mocked(mockContentVariantRepo.findById).mockResolvedValue(null);

      await expect(service.approveVariant('missing-variant')).rejects.toThrow(
        'Variant not found: missing-variant'
      );
    });
  });

  describe('rejectVariant', () => {
    it('sets REJECTED state', async () => {
      const existingVariant = new ContentVariant({
        id: 'variant-1' as any,
        articleId: 'article-1' as ArticleId,
        platform: Platform.WEB,
        format: 'canonical',
        content: 'Existing content',
        approvalState: ApprovalState.PENDING,
      });

      vi.mocked(mockContentVariantRepo.findById).mockResolvedValue(existingVariant);
      vi.mocked(mockContentVariantRepo.updateApprovalState).mockResolvedValue(undefined);

      const result = await service.rejectVariant('variant-1', 'Low quality');

      expect(result.approvalState).toBe(ApprovalState.REJECTED);
      expect(mockContentVariantRepo.findById).toHaveBeenCalledWith('variant-1');
      expect(mockContentVariantRepo.updateApprovalState).toHaveBeenCalledWith(
        'variant-1',
        ApprovalState.REJECTED
      );
    });

    it('throws when variant not found', async () => {
      vi.mocked(mockContentVariantRepo.findById).mockResolvedValue(null);

      await expect(service.rejectVariant('missing-variant', 'Reason')).rejects.toThrow(
        'Variant not found: missing-variant'
      );
    });
  });
});
