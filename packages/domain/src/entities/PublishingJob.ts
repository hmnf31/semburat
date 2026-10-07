import { ValidationError } from '@semburat/shared';

import type { ContentVariantId, PublishingJobId } from '@semburat/shared';

export enum JobStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  RETRYING = 'retrying',
}

export interface PublishingJobParams {
  id: PublishingJobId;
  contentVariantId: ContentVariantId;
  target: string;
  scheduledAt?: Date;
  status?: JobStatus;
  attempts?: number;
  lastError?: string;
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class PublishingJob {
  public readonly id: PublishingJobId;
  public readonly contentVariantId: ContentVariantId;
  public readonly target: string;
  public readonly scheduledAt?: Date;
  public readonly status: JobStatus;
  public readonly attempts: number;
  public readonly lastError?: string;
  public readonly publishedAt?: Date;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(params: PublishingJobParams) {
    if (!params.target || params.target.trim().length === 0) {
      throw new ValidationError('Target cannot be empty');
    }

    this.id = params.id;
    this.contentVariantId = params.contentVariantId;
    this.target = params.target.trim();
    this.scheduledAt = params.scheduledAt;
    this.status = params.status ?? JobStatus.PENDING;
    this.attempts = params.attempts ?? 0;
    this.lastError = params.lastError;
    this.publishedAt = params.publishedAt;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
  }

  incrementAttempts(): PublishingJob {
    return new PublishingJob({
      ...this.toParams(),
      attempts: this.attempts + 1,
      updatedAt: new Date(),
    });
  }

  markRunning(): PublishingJob {
    return new PublishingJob({
      ...this.toParams(),
      status: JobStatus.RUNNING,
      updatedAt: new Date(),
    });
  }

  markSucceeded(): PublishingJob {
    return new PublishingJob({
      ...this.toParams(),
      status: JobStatus.SUCCEEDED,
      publishedAt: new Date(),
      updatedAt: new Date(),
    });
  }

  markFailed(error: string): PublishingJob {
    return new PublishingJob({
      ...this.toParams(),
      status: JobStatus.FAILED,
      lastError: error,
      updatedAt: new Date(),
    });
  }

  private toParams(): PublishingJobParams {
    return {
      id: this.id,
      contentVariantId: this.contentVariantId,
      target: this.target,
      scheduledAt: this.scheduledAt,
      status: this.status,
      attempts: this.attempts,
      lastError: this.lastError,
      publishedAt: this.publishedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
