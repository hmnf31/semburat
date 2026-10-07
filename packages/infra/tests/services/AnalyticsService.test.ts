import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AnalyticsService } from '../../src/services/AnalyticsService.js';
import { AnalyticsEvent } from '@semburat/domain';
import type { AnalyticsEventRepository } from '@semburat/domain';

describe('AnalyticsService', () => {
  let mockRepo: AnalyticsEventRepository;
  let service: AnalyticsService;

  beforeEach(() => {
    mockRepo = {
      insert: vi.fn().mockResolvedValue(undefined),
      findByContentId: vi.fn().mockResolvedValue([]),
      aggregateByEventType: vi.fn().mockResolvedValue([]),
    } as AnalyticsEventRepository;
    service = new AnalyticsService(mockRepo);
  });

  it('trackEvent creates and persists an AnalyticsEvent', async () => {
    await service.trackEvent('content-1', 'view', 5, { source: 'web' });

    expect(mockRepo.insert).toHaveBeenCalledTimes(1);
    const inserted = (mockRepo.insert as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(inserted).toBeInstanceOf(AnalyticsEvent);
    expect(inserted.contentId).toBe('content-1');
    expect(inserted.eventType).toBe('view');
    expect(inserted.value).toBe(5);
    expect(inserted.metadata).toEqual({ source: 'web' });
  });

  it('getContentPerformance aggregates event values by type', async () => {
    vi.mocked(mockRepo.aggregateByEventType).mockResolvedValueOnce([
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
    expect(mockRepo.aggregateByEventType).toHaveBeenCalledWith('content-1');
  });

  it('getRevenuePerThousandVisitors computes correctly and returns zero without views', async () => {
    vi.mocked(mockRepo.aggregateByEventType)
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
});
