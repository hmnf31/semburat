import type { AnalyticsEventRepository } from '@semburat/domain';
import { AnalyticsEvent } from '@semburat/domain';

export interface ContentPerformance {
  totalViews: number;
  totalClicks: number;
  totalEngagement: number;
  totalRevenue: number;
}

export interface TopContentEntry {
  contentId: string;
  totalViews: number;
}

const VIEW_EVENT_TYPES = new Set(['view', 'impression']);
const CLICK_EVENT_TYPES = new Set(['click', 'cta']);
const ENGAGEMENT_EVENT_TYPES = new Set(['engagement', 'like', 'share', 'comment']);
const REVENUE_EVENT_TYPES = new Set(['revenue', 'conversion']);

export class AnalyticsService {
  constructor(private readonly analyticsEventRepo: AnalyticsEventRepository) {}

  async trackEvent(
    contentId: string,
    eventType: string,
    value: number,
    metadata: Record<string, unknown> = {}
  ): Promise<void> {
    const event = AnalyticsEvent.forContent(contentId, eventType, value, metadata);
    await this.analyticsEventRepo.insert(event);
  }

  async getContentPerformance(contentId: string): Promise<ContentPerformance> {
    const aggregates = await this.analyticsEventRepo.aggregateByEventType(contentId);

    let totalViews = 0;
    let totalClicks = 0;
    let totalEngagement = 0;
    let totalRevenue = 0;

    for (const aggregate of aggregates) {
      const { eventType, total } = aggregate;
      if (VIEW_EVENT_TYPES.has(eventType)) {
        totalViews += total;
      } else if (CLICK_EVENT_TYPES.has(eventType)) {
        totalClicks += total;
      } else if (ENGAGEMENT_EVENT_TYPES.has(eventType)) {
        totalEngagement += total;
      } else if (REVENUE_EVENT_TYPES.has(eventType)) {
        totalRevenue += total;
      }
    }

    return { totalViews, totalClicks, totalEngagement, totalRevenue };
  }

  async getTopContent(limit: number): Promise<TopContentEntry[]> {
    const seen = new Map<string, number>();
    const candidateIds = await this.resolveCandidateContentIds(limit);

    for (const contentId of candidateIds) {
      const events = await this.analyticsEventRepo.findByContentId(contentId, 1000);
      let views = 0;
      for (const event of events) {
        if (VIEW_EVENT_TYPES.has(event.eventType)) {
          views += event.value;
        }
      }
      if (views > 0) {
        seen.set(contentId, views);
      }
    }

    return Array.from(seen.entries())
      .map(([contentId, totalViews]) => ({ contentId, totalViews }))
      .sort((a, b) => b.totalViews - a.totalViews)
      .slice(0, limit);
  }

  async getRevenuePerThousandVisitors(contentId: string): Promise<number> {
    const performance = await this.getContentPerformance(contentId);
    if (performance.totalViews === 0) {
      return 0;
    }
    return (performance.totalRevenue / performance.totalViews) * 1000;
  }

  private async resolveCandidateContentIds(_limit: number): Promise<string[]> {
    return [];
  }
}
