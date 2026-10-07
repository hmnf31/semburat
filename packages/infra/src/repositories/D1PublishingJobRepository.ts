import { fromISO, toISO } from './D1Helpers.js';

import type { D1Database } from '@semburat/db';
import { PublishingJob, JobStatus } from '@semburat/domain';
import type { PublishingJobRepository as PublishingJobRepositoryPort } from '@semburat/domain';

export class D1PublishingJobRepository implements PublishingJobRepositoryPort {
  constructor(private readonly db: D1Database) {}

  async insert(job: PublishingJob): Promise<void> {
    const sql =
      'INSERT OR REPLACE INTO publishing_jobs ' +
      '(id, content_variant_id, target, scheduled_at, status, attempts, last_error, ' +
      'published_at, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)';
    await this.db
      .prepare(sql)
      .bind(
        job.id,
        job.contentVariantId,
        job.target,
        toISO(job.scheduledAt),
        job.status,
        job.attempts,
        job.lastError ?? null,
        toISO(job.publishedAt),
        toISO(job.createdAt),
        toISO(job.updatedAt)
      )
      .run();
  }

  async findById(id: string): Promise<PublishingJob | null> {
    const row = await this.db
      .prepare('SELECT * FROM publishing_jobs WHERE id = ? LIMIT 1')
      .bind(id)
      .first<Record<string, unknown>>();
    return row ? this.fromRow(row) : null;
  }

  async findByStatus(status: JobStatus): Promise<PublishingJob[]> {
    const result = await this.db
      .prepare('SELECT * FROM publishing_jobs WHERE status = ? ORDER BY scheduled_at ASC')
      .bind(status)
      .all<Record<string, unknown>>();
    return (result.results ?? []).map((row) => this.fromRow(row));
  }

  async update(job: PublishingJob): Promise<void> {
    const sql =
      'UPDATE publishing_jobs SET content_variant_id = ?, target = ?, scheduled_at = ?, status = ?, ' +
      'attempts = ?, last_error = ?, published_at = ?, created_at = ?, updated_at = ? WHERE id = ?';
    await this.db
      .prepare(sql)
      .bind(
        job.contentVariantId,
        job.target,
        toISO(job.scheduledAt),
        job.status,
        job.attempts,
        job.lastError ?? null,
        toISO(job.publishedAt),
        toISO(job.createdAt),
        toISO(job.updatedAt),
        job.id
      )
      .run();
  }

  private fromRow(row: Record<string, unknown>): PublishingJob {
    return new PublishingJob({
      id: row.id as string,
      contentVariantId: row.content_variant_id as string,
      target: row.target as string,
      scheduledAt: fromISO(row.scheduled_at),
      status: row.status as JobStatus,
      attempts: row.attempts as number,
      lastError: row.last_error ? (row.last_error as string) : undefined,
      publishedAt: fromISO(row.published_at),
      createdAt: fromISO(row.created_at),
      updatedAt: fromISO(row.updated_at),
    });
  }
}
