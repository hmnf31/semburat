import type { AnalyticsEvent } from '../entities/AnalyticsEvent.js';

export interface AnalyticsEventRepository {
  insert(event: AnalyticsEvent): Promise<void>;
  findByContentId(contentId: string, limit: number): Promise<AnalyticsEvent[]>;
  aggregateByEventType(contentId: string): Promise<Array<{ eventType: string; total: number }>>;
}
