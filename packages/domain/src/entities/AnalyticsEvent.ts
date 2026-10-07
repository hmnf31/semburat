import { ValidationError } from '@semburat/shared';

import type { AnalyticsEventId } from '@semburat/shared';

export interface AnalyticsEventParams {
  id: AnalyticsEventId;
  contentId: string;
  eventType: string;
  value?: number;
  metadata?: Record<string, unknown>;
  occurredAt?: Date;
}

export class AnalyticsEvent {
  public readonly id: AnalyticsEventId;
  public readonly contentId: string;
  public readonly eventType: string;
  public readonly value: number;
  public readonly metadata: Record<string, unknown>;
  public readonly occurredAt: Date;

  constructor(params: AnalyticsEventParams) {
    if (!params.eventType || params.eventType.trim().length === 0) {
      throw new ValidationError('Event type cannot be empty');
    }
    if (!params.contentId || params.contentId.trim().length === 0) {
      throw new ValidationError('Content id cannot be empty');
    }
    if (params.value !== undefined && params.value < 0) {
      throw new ValidationError('Event value cannot be negative');
    }

    this.id = params.id;
    this.contentId = params.contentId;
    this.eventType = params.eventType.trim();
    this.value = params.value ?? 0;
    this.metadata = params.metadata ?? {};
    this.occurredAt = params.occurredAt ?? new Date();
  }

  static forContent(
    contentId: string,
    eventType: string,
    value = 0,
    metadata?: Record<string, unknown>
  ): AnalyticsEvent {
    return new AnalyticsEvent({ id: crypto.randomUUID(), contentId, eventType, value, metadata });
  }
}
