import { fromISO, toISO, jsonParse, jsonQuote } from './D1Helpers.js';

import type { D1Database } from '@semburat/db';
import { AnalyticsEvent } from '@semburat/domain';
import type { AnalyticsEventRepository as AnalyticsEventRepositoryPort } from '@semburat/domain';

export interface EventAggregate {
  eventType: string;
  total: number;
}

export class D1AnalyticsEventRepository implements AnalyticsEventRepositoryPort {
  constructor(private readonly db: D1Database) {}

  async insert(event: AnalyticsEvent): Promise<void> {
    const sql =
      'INSERT OR REPLACE INTO analytics_events ' +
      '(id, content_id, event_type, value, metadata_json, occurred_at) VALUES (?,?,?,?,?,?)';
    await this.db
      .prepare(sql)
      .bind(
        event.id,
        event.contentId,
        event.eventType,
        event.value,
        jsonQuote(event.metadata),
        toISO(event.occurredAt)
      )
      .run();
  }

  async findByContentId(contentId: string, limit: number): Promise<AnalyticsEvent[]> {
    const result = await this.db
      .prepare(
        'SELECT * FROM analytics_events WHERE content_id = ? ORDER BY occurred_at DESC LIMIT ?'
      )
      .bind(contentId, limit)
      .all<Record<string, unknown>>();
    return (result.results ?? []).map((row) => this.fromRow(row));
  }

  async aggregateByEventType(contentId: string): Promise<EventAggregate[]> {
    const result = await this.db
      .prepare('SELECT event_type, value FROM analytics_events WHERE content_id = ?')
      .bind(contentId)
      .all<Record<string, unknown>>();
    const aggregates = new Map<string, number>();
    for (const row of result.results ?? []) {
      const eventType = row.event_type as string;
      const value = (row.value as number) ?? 0;
      aggregates.set(eventType, (aggregates.get(eventType) ?? 0) + value);
    }
    return Array.from(aggregates.entries()).map(([eventType, total]) => ({ eventType, total }));
  }

  private fromRow(row: Record<string, unknown>): AnalyticsEvent {
    return new AnalyticsEvent({
      id: row.id as string,
      contentId: row.content_id as string,
      eventType: row.event_type as string,
      value: row.value as number,
      metadata: jsonParse(row.metadata_json as string, {}),
      occurredAt: fromISO(row.occurred_at),
    });
  }
}
