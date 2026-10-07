import { fromISO, toISO } from './D1Helpers.js';

import type { D1Database } from '@semburat/db';
import { Research, ResearchStatus } from '@semburat/domain';
import type { ResearchRepository as ResearchRepositoryPort } from '@semburat/domain';

export class D1ResearchRepository implements ResearchRepositoryPort {
  constructor(private readonly db: D1Database) {}

  async insert(research: Research): Promise<void> {
    const sql =
      'INSERT INTO research ' +
      '(id, trend_id, summary, facts_json, claims_json, conflicts_json, confidence_score, ' +
      'status, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)';
    await this.db
      .prepare(sql)
      .bind(
        research.id,
        research.trendId,
        research.summary,
        research.factsJson,
        research.claimsJson,
        research.conflictsJson,
        research.confidenceScore,
        research.status,
        toISO(research.createdAt),
        toISO(research.updatedAt)
      )
      .run();
  }

  async findById(id: string): Promise<Research | null> {
    const row = await this.db
      .prepare('SELECT * FROM research WHERE id = ? LIMIT 1')
      .bind(id)
      .first<Record<string, unknown>>();
    return row ? this.fromRow(row) : null;
  }

  async findByTrendId(trendId: string): Promise<Research | null> {
    const row = await this.db
      .prepare('SELECT * FROM research WHERE trend_id = ? LIMIT 1')
      .bind(trendId)
      .first<Record<string, unknown>>();
    return row ? this.fromRow(row) : null;
  }

  async update(research: Research): Promise<void> {
    const sql =
      'UPDATE research SET summary = ?, facts_json = ?, claims_json = ?, conflicts_json = ?, ' +
      'confidence_score = ?, status = ?, updated_at = ? WHERE id = ?';
    await this.db
      .prepare(sql)
      .bind(
        research.summary,
        research.factsJson,
        research.claimsJson,
        research.conflictsJson,
        research.confidenceScore,
        research.status,
        toISO(research.updatedAt),
        research.id
      )
      .run();
  }

  private fromRow(row: Record<string, unknown>): Research {
    return new Research({
      id: row.id as string,
      trendId: row.trend_id as string,
      summary: row.summary as string,
      factsJson: row.facts_json as string,
      claimsJson: row.claims_json as string,
      conflictsJson: row.conflicts_json as string,
      confidenceScore: row.confidence_score as number,
      status: row.status as ResearchStatus,
      createdAt: fromISO(row.created_at),
      updatedAt: fromISO(row.updated_at),
    });
  }
}
