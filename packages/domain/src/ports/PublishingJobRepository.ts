import type { PublishingJob } from '../entities/PublishingJob.js';
import type { JobStatus } from '../entities/PublishingJob.js';

export interface PublishingJobRepository {
  insert(job: PublishingJob): Promise<void>;
  findById(id: string): Promise<PublishingJob | null>;
  findByStatus(status: JobStatus): Promise<PublishingJob[]>;
  update(job: PublishingJob): Promise<void>;
}
