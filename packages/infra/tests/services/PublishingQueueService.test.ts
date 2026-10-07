import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PublishingQueueService } from '../../src/services/PublishingQueueService.js';
import {
  PublishingJob,
  JobStatus,
  ContentVariant,
  Platform,
  ApprovalState,
  Article,
  ArticleStatus,
  FactCheckStatus,
} from '@semburat/domain';
import type { PublishingJobRepository } from '@semburat/domain';
import type { ContentVariantRepository } from '@semburat/domain';
import type { ArticleRepository } from '@semburat/domain';
import type { Publisher } from '@semburat/domain';
import type { ContentVariantId, ArticleId, ResearchId } from '@semburat/shared';

function makeArticle(overrides: Partial<ConstructorParameters<typeof Article>[0]> = {}): Article {
  return new Article({
    id: '550e8400-e29b-41d4-a716-446655440001',
    researchId: '550e8400-e29b-41d4-a716-446655440002',
    title: 'Valid Article Title Here',
    slug: 'valid-article-title',
    dek: 'This is a valid dek for the article',
    summary: 'Summary of the article',
    body: 'This is the body of the article which is long enough to pass validation requirements for the article content.',
    category: 'news',
    status: ArticleStatus.APPROVED,
    factCheckStatus: FactCheckStatus.COMPLETE,
    ...overrides,
  });
}

function makeVariant(
  overrides: Partial<{
    id: ContentVariantId;
    articleId: ArticleId;
    platform: Platform;
    format: string;
    content: string;
    approvalState: ApprovalState;
  }> = {}
): ContentVariant {
  return new ContentVariant({
    id: '550e8400-e29b-41d4-a716-446655440000',
    articleId: '550e8400-e29b-41d4-a716-446655440001',
    platform: Platform.WEB,
    format: 'html',
    content: '<p>Test content for web</p>',
    approvalState: ApprovalState.APPROVED,
    ...overrides,
  });
}

function makeJob(
  overrides: Partial<ConstructorParameters<typeof PublishingJob>[0]> = {}
): PublishingJob {
  return new PublishingJob({
    id: '550e8400-e29b-41d4-a716-446655440010',
    contentVariantId: '550e8400-e29b-41d4-a716-446655440000',
    target: 'web',
    status: JobStatus.PENDING,
    attempts: 0,
    ...overrides,
  });
}

describe('PublishingQueueService', () => {
  let service: PublishingQueueService;
  let mockPublishingJobRepo: PublishingJobRepository;
  let mockContentVariantRepo: ContentVariantRepository;
  let mockArticleRepo: ArticleRepository;
  let mockPublisher: Publisher;
  let variant: ContentVariant;
  let article: Article;

  beforeEach(() => {
    variant = makeVariant();
    article = makeArticle();

    mockPublishingJobRepo = {
      insert: vi.fn().mockResolvedValue(undefined),
      findById: vi.fn(),
      findByStatus: vi.fn().mockResolvedValue([]),
      update: vi.fn().mockResolvedValue(undefined),
    };

    mockContentVariantRepo = {
      insert: vi.fn(),
      findById: vi.fn().mockResolvedValue(variant),
      findByArticleId: vi.fn(),
      updateApprovalState: vi.fn().mockResolvedValue(undefined),
    };

    mockArticleRepo = {
      insert: vi.fn(),
      findById: vi.fn().mockResolvedValue(article),
      findBySlug: vi.fn(),
      findByStatus: vi.fn(),
      update: vi.fn().mockResolvedValue(undefined),
      updateStatus: vi.fn(),
    };

    mockPublisher = {
      publish: vi.fn().mockResolvedValue({ externalId: 'web:123', url: 'https://example.com' }),
      delete: vi.fn().mockResolvedValue(undefined),
    };

    service = new PublishingQueueService(
      mockPublishingJobRepo,
      mockContentVariantRepo,
      mockArticleRepo
    );
  });

  describe('queuePublishing', () => {
    it('creates and persists a PublishingJob, returns job ID', async () => {
      const jobId = await service.queuePublishing(variant.id, 'web');

      expect(jobId).toBeDefined();
      expect(mockPublishingJobRepo.insert).toHaveBeenCalled();
      const insertedJob = (mockPublishingJobRepo.insert as ReturnType<typeof vi.fn>).mock
        .calls[0][0];
      expect(insertedJob.contentVariantId).toBe(variant.id);
      expect(insertedJob.target).toBe('web');
      expect(insertedJob.status).toBe(JobStatus.PENDING);
      expect(insertedJob.attempts).toBe(0);
    });

    it('uses scheduledAt when provided', async () => {
      const scheduledAt = new Date(Date.now() + 3600000);
      const jobId = await service.queuePublishing(variant.id, 'web', scheduledAt);

      const insertedJob = (mockPublishingJobRepo.insert as ReturnType<typeof vi.fn>).mock
        .calls[0][0];
      expect(insertedJob.scheduledAt).toEqual(scheduledAt);
    });

    it('throws when variant not found', async () => {
      (mockContentVariantRepo.findById as ReturnType<typeof vi.fn>).mockResolvedValue(null);
      await expect(service.queuePublishing('non-existent', 'web')).rejects.toThrow(
        'ContentVariant not found'
      );
    });
  });

  describe('processQueue', () => {
    it('processes pending jobs and marks them succeeded', async () => {
      const job = makeJob({ status: JobStatus.PENDING });
      (mockPublishingJobRepo.findByStatus as ReturnType<typeof vi.fn>)
        .mockResolvedValueOnce([job])
        .mockResolvedValueOnce([]);

      await service.processQueue(mockPublisher);

      expect(mockPublishingJobRepo.findByStatus).toHaveBeenCalledWith(JobStatus.PENDING);
      expect(mockPublishingJobRepo.findByStatus).toHaveBeenCalledWith(JobStatus.RETRYING);
      expect(mockPublisher.publish).toHaveBeenCalledWith(variant);
      expect(mockPublishingJobRepo.update).toHaveBeenCalledTimes(2);
      const succeededJob = (mockPublishingJobRepo.update as ReturnType<typeof vi.fn>).mock
        .calls[1][0];
      expect(succeededJob.status).toBe(JobStatus.SUCCEEDED);
      expect(mockContentVariantRepo.updateApprovalState).toHaveBeenCalledWith(
        variant.id,
        ApprovalState.APPROVED
      );
    });

    it('skips jobs scheduled for the future', async () => {
      const futureJob = makeJob({
        status: JobStatus.PENDING,
        scheduledAt: new Date(Date.now() + 3600000),
      });
      (mockPublishingJobRepo.findByStatus as ReturnType<typeof vi.fn>)
        .mockResolvedValueOnce([futureJob])
        .mockResolvedValueOnce([]);

      await service.processQueue(mockPublisher);

      expect(mockPublisher.publish).not.toHaveBeenCalled();
      expect(mockPublishingJobRepo.update).not.toHaveBeenCalled();
    });

    it('marks job as FAILED after max attempts exceeded', async () => {
      const job = makeJob({ status: JobStatus.RETRYING, attempts: 2 });
      (mockPublishingJobRepo.findByStatus as ReturnType<typeof vi.fn>)
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([job]);
      (mockPublisher.publish as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('API error')
      );

      await service.processQueue(mockPublisher);

      expect(mockPublishingJobRepo.update).toHaveBeenCalledTimes(2);
      const failedJob = (mockPublishingJobRepo.update as ReturnType<typeof vi.fn>).mock.calls[1][0];
      expect(failedJob.status).toBe(JobStatus.FAILED);
      expect(failedJob.lastError).toBe('API error');
      expect(failedJob.attempts).toBe(3);
    });

    it('marks job as RETRYING when attempts < max', async () => {
      const job = makeJob({ status: JobStatus.PENDING, attempts: 0 });
      (mockPublishingJobRepo.findByStatus as ReturnType<typeof vi.fn>)
        .mockResolvedValueOnce([job])
        .mockResolvedValueOnce([]);
      (mockPublisher.publish as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('API error')
      );

      await service.processQueue(mockPublisher);

      expect(mockPublishingJobRepo.update).toHaveBeenCalledTimes(2);
      const retriedJob = (mockPublishingJobRepo.update as ReturnType<typeof vi.fn>).mock
        .calls[1][0];
      expect(retriedJob.status).toBe(JobStatus.RETRYING);
      expect(retriedJob.attempts).toBe(1);
    });
  });

  describe('getJobStatus', () => {
    it('returns job status info', async () => {
      const job = makeJob({ status: JobStatus.RUNNING, attempts: 1, lastError: 'test error' });
      (mockPublishingJobRepo.findById as ReturnType<typeof vi.fn>).mockResolvedValue(job);

      const status = await service.getJobStatus(job.id);

      expect(status).toEqual({
        status: JobStatus.RUNNING,
        attempts: 1,
        lastError: 'test error',
      });
    });

    it('throws when job not found', async () => {
      (mockPublishingJobRepo.findById as ReturnType<typeof vi.fn>).mockResolvedValue(null);
      await expect(service.getJobStatus('non-existent')).rejects.toThrow('PublishingJob not found');
    });
  });

  describe('cancelJob', () => {
    it('cancels a pending job', async () => {
      const job = makeJob({ status: JobStatus.PENDING });
      (mockPublishingJobRepo.findById as ReturnType<typeof vi.fn>).mockResolvedValue(job);

      await service.cancelJob(job.id);

      expect(mockPublishingJobRepo.update).toHaveBeenCalled();
      const cancelledJob = (mockPublishingJobRepo.update as ReturnType<typeof vi.fn>).mock
        .calls[0][0];
      expect(cancelledJob.status).toBe(JobStatus.CANCELLED);
    });

    it('throws when job not found', async () => {
      (mockPublishingJobRepo.findById as ReturnType<typeof vi.fn>).mockResolvedValue(null);
      await expect(service.cancelJob('non-existent')).rejects.toThrow('PublishingJob not found');
    });
  });
});
