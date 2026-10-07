import { ValidationError } from '@semburat/shared';

import type { TopicId, TrendId } from '@semburat/shared';

export enum TrendStatus {
  CANDIDATE = 'candidate',
  SCORED = 'scored',
  SELECTED = 'selected',
  RESEARCHED = 'researched',
  ARCHIVED = 'archived',
  IGNORED = 'ignored',
}

export interface TrendParams {
  id: TrendId;
  topicId?: TopicId;
  title: string;
  normalizedKey: string;
  score?: number;
  velocity?: number;
  relevance?: number;
  freshness?: number;
  sourceCount?: number;
  status?: TrendStatus;
  detectedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Trend {
  public readonly id: TrendId;
  public readonly topicId?: TopicId;
  public readonly title: string;
  public readonly normalizedKey: string;
  public readonly score: number;
  public readonly velocity: number;
  public readonly relevance: number;
  public readonly freshness: number;
  public readonly sourceCount: number;
  public readonly status: TrendStatus;
  public readonly detectedAt: Date;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(params: TrendParams) {
    if (!params.title || params.title.trim().length === 0) {
      throw new ValidationError('Trend title cannot be empty');
    }
    if (!params.normalizedKey || params.normalizedKey.trim().length === 0) {
      throw new ValidationError('Normalized key cannot be empty');
    }
    if (params.score !== undefined && (params.score < 0 || params.score > 100)) {
      throw new ValidationError('Score must be between 0 and 100');
    }
    if (params.velocity !== undefined && (params.velocity < 0 || params.velocity > 100)) {
      throw new ValidationError('Velocity must be between 0 and 100');
    }
    if (params.relevance !== undefined && (params.relevance < 0 || params.relevance > 100)) {
      throw new ValidationError('Relevance must be between 0 and 100');
    }
    if (params.freshness !== undefined && (params.freshness < 0 || params.freshness > 100)) {
      throw new ValidationError('Freshness must be between 0 and 100');
    }

    this.id = params.id;
    this.topicId = params.topicId;
    this.title = params.title.trim();
    this.normalizedKey = params.normalizedKey.trim().toLowerCase();
    this.score = params.score ?? 0;
    this.velocity = params.velocity ?? 0;
    this.relevance = params.relevance ?? 0;
    this.freshness = params.freshness ?? 0;
    this.sourceCount = params.sourceCount ?? 0;
    this.status = params.status ?? TrendStatus.CANDIDATE;
    this.detectedAt = params.detectedAt ?? new Date();
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
  }

  withScore(score: number): Trend {
    if (score < 0 || score > 100) {
      throw new ValidationError('Score must be between 0 and 100');
    }
    return new Trend({
      ...this.toParams(),
      score,
      status: this.score === 0 && score > 0 ? TrendStatus.SCORED : this.status,
      updatedAt: new Date(),
    });
  }

  incrementSourceCount(): Trend {
    return new Trend({
      ...this.toParams(),
      sourceCount: this.sourceCount + 1,
      updatedAt: new Date(),
    });
  }

  private toParams(): TrendParams {
    return {
      id: this.id,
      topicId: this.topicId,
      title: this.title,
      normalizedKey: this.normalizedKey,
      score: this.score,
      velocity: this.velocity,
      relevance: this.relevance,
      freshness: this.freshness,
      sourceCount: this.sourceCount,
      status: this.status,
      detectedAt: this.detectedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
