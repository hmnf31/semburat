import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AnalyticsService } from '../../src/services/AnalyticsService.js';
import { AnalyticsEvent } from '@semburat/domain';
import type { AnalyticsEventRepository } from '@semburat/domain';
import type { ArticleRepository } from '@semburat/domain';
import { Article, ArticleStatus, Slug, RiskLevel, QualityScore } from '@semburat/domain';

describe('AnalyticsService', () => {
  let mockAnalyticsRepo: AnalyticsEventRepository;
  let mockArticleRepo: ArticleRepository;
  let service: AnalyticsService;

  const createMockArticle = (id: string): Article => {
    return new Article({
      id,
      researchId: 'research-1',
      title: 'Test Article ' + id,
      slug: Slug.fromString('test-article-' + id),
      dek: 'Test article description for testing purposes',
      summary: 'Test summary content',
      body: 'Test body content that is long enough to pass validation requirements for article creation in the system',
      category: 'Test',
      status: ArticleStatus.PUBLISHED,
      riskLevel: RiskLevel.fromString('LOW'),
      qualityScore: QualityScore.fromNumber(80),
    });
  };

  beforeEach(() => {
    mockAnalyticsRepo = {
      insert: vi.fn().mockResolvedValue(undefined),
      findByContentId: vi.fn().mockResolvedValue([]),
      aggregateByEventType: vi.fn().mockResolvedValue([]),
    } as AnalyticsEventRepository;

    mockArticleRepo = {
      insert: vi.fn().mockResolvedValue(undefined),
      findById: vi.fn().mockResolvedValue(null),
      findBySlug: vi.fn().mockResolvedValue(null),
      findByStatus: vi.fn().mockResolvedValue({ articles: [], nextCursor: null }),
      findAll: vi.fn().mockResolvedValue([]),
      update: vi.fn().mockResolvedValue(undefined),
      updateStatus: vi.fn().mockResolvedValue(undefined),
    } as ArticleRepository;

    service = new AnalyticsService(mockAnalyticsRepo, mockArticleRepo);
  });

  it('trackEvent creates and persists an AnalyticsEvent', async () => {
    await service.trackEvent('content-1', 'view', 5, { source: 'web' });

    expect(mockAnalyticsRepo.insert).toHaveBeenCalledTimes(1);
    const inserted = (mockAnalyticsRepo.insert as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(inserted).toBeInstanceOf(AnalyticsEvent);
    expect(inserted.contentId).toBe('content-1');
    expect(inserted.eventType).toBe('view');
    expect(inserted.value).toBe(5);
    expect(inserted.metadata).toEqual({ source: 'web' });
  });

  it('getContentPerformance aggregates event values by type', async () => {
    vi.mocked(mockAnalyticsRepo.aggregateByEventType).mockResolvedValueOnce([
      { eventType: 'view', total: 100 },
      { eventType: 'click', total: 12 },
      { eventType: 'engagement', total: 34 },
      { eventType: 'revenue', total: 500 },
    ]);

    const perf = await service.getContentPerformance('content-1');

    expect(perf).toEqual({
      totalViews: 100,
      totalClicks: 12,
      totalEngagement: 34,
      totalRevenue: 500,
    });
    expect(mockAnalyticsRepo.aggregateByEventType).toHaveBeenCalledWith('content-1');
  });

  it('getRevenuePerThousandVisitors computes correctly and returns zero without views', async () => {
    vi.mocked(mockAnalyticsRepo.aggregateByEventType)
      .mockResolvedValueOnce([{ eventType: 'revenue', total: 500 }])
      .mockResolvedValueOnce([
        { eventType: 'view', total: 250 },
        { eventType: 'revenue', total: 500 },
      ]);

    const zeroResult = await service.getRevenuePerThousandVisitors('content-1');
    expect(zeroResult).toBe(0);

    const computed = await service.getRevenuePerThousandVisitors('content-1');
    expect(computed).toBe(2000);
  });

  it('getTopContent returns top content by views from published articles', async () => {
    const articles = [
      createMockArticle('article-1'),
      createMockArticle('article-2'),
      createMockArticle('article-3'),
    ];
    vi.mocked(mockArticleRepo.findAll).mockResolvedValueOnce(articles);

    vi.mocked(mockAnalyticsRepo.findByContentId)
      .mockResolvedValueOnce([
        { id: 'evt-1', contentId: 'article-1', eventType: 'view', value: 100, metadata: {}, occurredAt: new Date() },
        { id: 'evt-2', contentId: 'article-1', eventType: 'click', value: 10, metadata: {}, occurredAt: new Date() },
      ])
      .mockResolvedValueOnce([
        { id: 'evt-3', contentId: 'article-2', eventType: 'view', value: 200, metadata: {}, occurredAt: new Date() },
      ])
      .mockResolvedValueOnce([
        { id: 'evt-4', contentId: 'article-3', eventType: 'click', value: 5, metadata: {}, occurredAt: new Date() },
      ]);

    const result = await service.getTopContent(10);

    expect(mockArticleRepo.findAll).toHaveBeenCalledWith(30);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ contentId: 'article-2', totalViews: 200 });
    expect(result[1]).toEqual({ contentId: 'article-1', totalViews: 100 });
  });

  it('getTopContent returns empty array when no articles have views', async () => {
    const articles = [createMockArticle('article-1')];
    vi.mocked(mockArticleRepo.findAll).mockResolvedValueOnce(articles);
    vi.mocked(mockAnalyticsRepo.findByContentId).mockResolvedValueOnce([
      { id: 'evt-1', contentId: 'article-1', eventType: 'click', value: 5, metadata: {}, occurredAt: new Date() },
    ]);

    const result = await service.getTopContent(10);

    expect(result).toHaveLength(0);
  });

  it('getTopContent respects limit parameter', async () => {
    const articles = [
      createMockArticle('article-1'),
      createMockArticle('article-2'),
      createMockArticle('article-3'),
    ];
    vi.mocked(mockArticleRepo.findAll).mockResolvedValueOnce(articles);

    vi.mocked(mockAnalyticsRepo.findByContentId)
      .mockResolvedValueOnce([{ id: 'evt-1', contentId: 'article-1', eventType: 'view', value: 100, metadata: {}, occurredAt: new Date() }])
      .mockResolvedValueOnce([{ id: 'evt-2', contentId: 'article-2', eventType: 'view', value: 200, metadata: {}, occurredAt: new Date() }])
      .mockResolvedValueOnce([{ id: 'evt-3', contentId: 'article-3', eventType: 'view', value: 300, metadata: {}, occurredAt: new Date() }]);

    const result = await service.getTopContent(2);

    expect(result).toHaveLength(2);
    expect(result[0].contentId).toBe('article-3');
    expect(result[1].contentId).toBe('article-2');
  });
});
