import {
  PublishingJob,
  JobStatus,
  ContentVariant,
  Platform,
  ApprovalState,
} from '@semburat/domain';
import type { PublishingJobRepository } from '@semburat/domain';
import type { ContentVariantRepository } from '@semburat/domain';
import type { ArticleRepository } from '@semburat/domain';
import type { Publisher } from '@semburat/domain';

const MAX_ATTEMPTS = 3;

export class PublishingQueueService {
  constructor(
    private readonly publishingJobRepo: PublishingJobRepository,
    private readonly contentVariantRepo: ContentVariantRepository,
    private readonly articleRepo: ArticleRepository
  ) {}

  async queuePublishing(variantId: string, target: string, scheduledAt?: Date): Promise<string> {
    const variant = await this.contentVariantRepo.findById(variantId);
    if (!variant) {
      throw new Error('ContentVariant not found: ' + variantId);
    }

    const job = new PublishingJob({
      id: crypto.randomUUID(),
      contentVariantId: variantId,
      target,
      scheduledAt,
      status: JobStatus.PENDING,
      attempts: 0,
    });

    await this.publishingJobRepo.insert(job);
    return job.id;
  }

  async processQueue(publisher: Publisher): Promise<void> {
    const pendingJobs = await this.publishingJobRepo.findByStatus(JobStatus.PENDING);
    const retryingJobs = await this.publishingJobRepo.findByStatus(JobStatus.RETRYING);
    const jobs = [...pendingJobs, ...retryingJobs];

    for (const job of jobs) {
      if (job.scheduledAt && job.scheduledAt > new Date()) {
        continue;
      }

      const runningJob = job.markRunning();
      await this.publishingJobRepo.update(runningJob);

      try {
        const variant = await this.contentVariantRepo.findById(job.contentVariantId);
        if (!variant) {
          throw new Error('ContentVariant not found: ' + job.contentVariantId);
        }

        await publisher.publish(variant);

        const succeededJob = runningJob.markSucceeded();
        await this.publishingJobRepo.update(succeededJob);

        const updatedVariant = variant.markPublished();
        await this.contentVariantRepo.updateApprovalState(variant.id, updatedVariant.approvalState);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const nextAttempts = runningJob.attempts + 1;
        let failedJob: PublishingJob;

        if (nextAttempts >= MAX_ATTEMPTS) {
          failedJob = new PublishingJob({
            id: runningJob.id,
            contentVariantId: runningJob.contentVariantId,
            target: runningJob.target,
            scheduledAt: runningJob.scheduledAt,
            status: JobStatus.FAILED,
            attempts: nextAttempts,
            lastError: errorMessage,
            publishedAt: runningJob.publishedAt,
            createdAt: runningJob.createdAt,
            updatedAt: new Date(),
          });
        } else {
          failedJob = new PublishingJob({
            id: runningJob.id,
            contentVariantId: runningJob.contentVariantId,
            target: runningJob.target,
            scheduledAt: runningJob.scheduledAt,
            status: JobStatus.RETRYING,
            attempts: nextAttempts,
            lastError: errorMessage,
            publishedAt: runningJob.publishedAt,
            createdAt: runningJob.createdAt,
            updatedAt: new Date(),
          });
        }

        await this.publishingJobRepo.update(failedJob);
      }
    }
  }

  async getJobStatus(
    jobId: string
  ): Promise<{ status: string; attempts: number; lastError?: string }> {
    const job = await this.publishingJobRepo.findById(jobId);
    if (!job) {
      throw new Error('PublishingJob not found: ' + jobId);
    }
    return {
      status: job.status,
      attempts: job.attempts,
      lastError: job.lastError,
    };
  }

  async cancelJob(jobId: string): Promise<void> {
    const job = await this.publishingJobRepo.findById(jobId);
    if (!job) {
      throw new Error('PublishingJob not found: ' + jobId);
    }

    const cancelledJob = new PublishingJob({
      id: job.id,
      contentVariantId: job.contentVariantId,
      target: job.target,
      scheduledAt: job.scheduledAt,
      status: JobStatus.CANCELLED,
      attempts: job.attempts,
      lastError: job.lastError,
      publishedAt: job.publishedAt,
      createdAt: job.createdAt,
      updatedAt: new Date(),
    });

    await this.publishingJobRepo.update(cancelledJob);
  }
}
