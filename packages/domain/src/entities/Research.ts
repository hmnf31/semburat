import { ValidationError } from '@semburat/shared';

import type { ResearchId, TrendId } from '@semburat/shared';

export enum ResearchStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  NEEDS_REVIEW = 'needs_review',
}

export interface ResearchParams {
  id: ResearchId;
  trendId: TrendId;
  summary: string;
  factsJson?: string;
  claimsJson?: string;
  conflictsJson?: string;
  confidenceScore?: number;
  status?: ResearchStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Research {
  public readonly id: ResearchId;
  public readonly trendId: TrendId;
  public readonly summary: string;
  public readonly factsJson: string;
  public readonly claimsJson: string;
  public readonly conflictsJson: string;
  public readonly confidenceScore: number;
  public readonly status: ResearchStatus;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(params: ResearchParams) {
    if (!params.summary || params.summary.trim().length === 0) {
      throw new ValidationError('Research summary cannot be empty');
    }
    if (
      params.confidenceScore !== undefined &&
      (params.confidenceScore < 0 || params.confidenceScore > 1)
    ) {
      throw new ValidationError('Confidence score must be between 0 and 1');
    }

    this.id = params.id;
    this.trendId = params.trendId;
    this.summary = params.summary.trim();
    this.factsJson = params.factsJson ?? '[]';
    this.claimsJson = params.claimsJson ?? '[]';
    this.conflictsJson = params.conflictsJson ?? '[]';
    this.confidenceScore = params.confidenceScore ?? 0;
    this.status = params.status ?? ResearchStatus.PENDING;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
  }

  withStatus(status: ResearchStatus): Research {
    return new Research({ ...this.toParams(), status, updatedAt: new Date() });
  }

  private toParams(): ResearchParams {
    return {
      id: this.id,
      trendId: this.trendId,
      summary: this.summary,
      factsJson: this.factsJson,
      claimsJson: this.claimsJson,
      conflictsJson: this.conflictsJson,
      confidenceScore: this.confidenceScore,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
