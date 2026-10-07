import { fromISO, toISO } from './D1Helpers.js';

import type { D1Database } from '@semburat/db';
import { Trend, TrendStatus } from '@semburat/domain';
import type { TrendRepository as TrendRepositoryPort } from '@semburat/domain';

export class D1TrendRepository implements TrendRepositoryPort {
  constructor(private readonly db: D1Database) {}

  async insert(trend: Trend): Promise<void> {
    await this.upsert(trend);
  }

  async findById(id: string): Promise<Trend | null> {
    const row = await this.db
      .prepare('SELECT * FROM trends WHERE id = ? LIMIT 1')
      .bind(id)
      .first<Record<string, unknown>>();
    return row ? this.fromRow(row) : null;
  }

  async findByNormalizedKey(key: string): Promise<Trend | null> {
    const row = await this.db
      .prepare('SELECT * FROM trends WHERE normalized_key = ? LIMIT 1')
      .bind(key)
      .first<Record<string, unknown>>();
    return row ? this.fromRow(row) : null;
  }

  async findByStatus(status: TrendStatus): Promise<Trend[]> {
    const result = await this.db
      .prepare('SELECT * FROM trends WHERE status = ?')
      .bind(status)
      .all<Record<string, unknown>>();
    return (result.results ?? []).map((row) => this.fromRow(row));
  }

  async findByScore(minScore: number, limit: number): Promise<Trend[]> {
    const result = await this.db
      .prepare('SELECT * FROM trends WHERE score >= ? ORDER BY score DESC, id LIMIT ?')
      .bind(minScore, limit)
      .all<Record<string, unknown>>();
    return (result.results ?? []).map((row) => this.fromRow(row));
  }

  async update(trend: Trend): Promise<void> {
    const sql = [
      'UPDATE trends SET topic_id = ?, title = ?, normalized_key = ?, score = ?, velocity = ?,',
      'relevance = ?, freshness = ?, source_count = ?, status = ?, detected_at = ?, updated_at = ?',
      'WHERE id = ?',
    ].join(' ');
    await this.db
      .prepare(sql)
      .bind(
        trend.topicId ?? null,
        trend.title,
        trend.normalizedKey,
        trend.score,
        trend.velocity,
        trend.relevance,
        trend.freshness,
        trend.sourceCount,
        trend.status,
        toISO(trend.detectedAt),
        toISO(trend.updatedAt),
        trend.id
      )
      .run();
  }

  async upsert(trend: Trend): Promise<void> {
    const sql = [
      'INSERT OR REPLACE INTO trends',
      '(id, topic_id, title, normalized_key, score, velocity, relevance, freshness,',
      'source_count, status, detected_at, created_at, updated_at)',
      'VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',
    ].join(' ');
    await this.db
      .prepare(sql)
      .bind(
        trend.id,
        trend.topicId ?? null,
        trend.title,
        trend.normalizedKey,
        trend.score,
        trend.velocity,
        trend.relevance,
        trend.freshness,
        trend.sourceCount,
        trend.status,
        toISO(trend.detectedAt),
        toISO(trend.createdAt),
        toISO(trend.updatedAt)
      )
      .run();
  }

  private fromRow(row: Record<string, unknown>): Trend {
    return new Trend({
      id: row.id as string,
      topicId: row.topic_id ? (row.topic_id as string) : undefined,
      title: row.title as string,
      normalizedKey: row.normalized_key as string,
      score: row.score as number,
      velocity: row.velocity as number,
      relevance: row.relevance as number,
      freshness: row.freshness as number,
      sourceCount: row.source_count as number,
      status: row.status as TrendStatus,
      detectedAt: fromISO(row.detected_at),
      createdAt: fromISO(row.created_at),
      updatedAt: fromISO(row.updated_at),
    });
  }
}
