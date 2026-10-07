import { describe, it, expect } from 'vitest';
import { PublishingJob, JobStatus } from '../../src/entities/PublishingJob.js';
import { ValidationError } from '@semburat/shared';

describe('PublishingJob', () => {
  const validParams = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    contentVariantId: '550e8400-e29b-41d4-a716-446655440001',
    target: 'https://api.twitter.com/v2/tweets',
  };

  it('should create a publishing job with valid data', () => {
    const job = new PublishingJob(validParams);
    expect(job.id).toBe(validParams.id);
    expect(job.contentVariantId).toBe(validParams.contentVariantId);
    expect(job.target).toBe('https://api.twitter.com/v2/tweets');
    expect(job.status).toBe(JobStatus.PENDING);
    expect(job.attempts).toBe(0);
  });

  it('should throw ValidationError for empty target', () => {
    expect(() => new PublishingJob({ ...validParams, target: '' })).toThrow(ValidationError);
  });

  it('incrementAttempts should return new Job with incremented attempts', () => {
    const job = new PublishingJob(validParams);
    const newJob = job.incrementAttempts();
    expect(newJob.attempts).toBe(1);
    expect(newJob.updatedAt).not.toBe(job.updatedAt);
  });

  it('markRunning should set status to RUNNING', () => {
    const job = new PublishingJob(validParams);
    const newJob = job.markRunning();
    expect(newJob.status).toBe(JobStatus.RUNNING);
    expect(newJob.updatedAt).not.toBe(job.updatedAt);
  });

  it('markSucceeded should set status to SUCCEEDED and set publishedAt', () => {
    const job = new PublishingJob(validParams);
    const newJob = job.markSucceeded();
    expect(newJob.status).toBe(JobStatus.SUCCEEDED);
    expect(newJob.publishedAt).toBeInstanceOf(Date);
    expect(newJob.updatedAt).not.toBe(job.updatedAt);
  });

  it('markFailed should set status to FAILED and set lastError', () => {
    const job = new PublishingJob(validParams);
    const newJob = job.markFailed('Network error');
    expect(newJob.status).toBe(JobStatus.FAILED);
    expect(newJob.lastError).toBe('Network error');
    expect(newJob.updatedAt).not.toBe(job.updatedAt);
  });
});
