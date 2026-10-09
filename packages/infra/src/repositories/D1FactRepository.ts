import { toISO, fromISO } from './D1Helpers.js';

import type { D1Database } from '@semburat/db';
import { Fact, VerificationStatus } from '@semburat/domain';
import type { FactRepository as FactRepositoryPort } from '@semburat/domain';

export class D1FactRepository implements FactRepositoryPort {
  constructor(private readonly db: D1Database) {}

  async insert(fact: Fact): Promise<void> {
    const sql =
      'INSERT OR REPLACE INTO facts ' +
      '(id, article_id, statement, normalized_statement, verification_status, confidence, ' +
      'created_at, updated_at) VALUES (?,?,?,?,?,?,?,?)';
    await this.db
      .prepare(sql)
      .bind(
        fact.id,
        fact.articleId,
        fact.statement,
        fact.normalizedStatement,
        fact.verificationStatus,
        fact.confidence,
        toISO(fact.createdAt),
        toISO(fact.updatedAt)
      )
      .run();
  }

  async findById(id: string): Promise<Fact | null> {
    const row = await this.db
      .prepare('SELECT * FROM facts WHERE id = ? LIMIT 1')
      .bind(id)
      .first<Record<string, unknown>>();
    return row ? this.fromRow(row) : null;
  }

  async findByArticleId(articleId: string): Promise<Fact[]> {
    const result = await this.db
      .prepare('SELECT * FROM facts WHERE article_id = ? ORDER BY created_at ASC')
      .bind(articleId)
      .all<Record<string, unknown>>();
    return (result.results ?? []).map((row) => this.fromRow(row));
  }

  async bulkInsert(facts: Fact[]): Promise<void> {
    if (facts.length === 0) return;
    const sql =
      'INSERT OR REPLACE INTO facts ' +
      '(id, article_id, statement, normalized_statement, verification_status, confidence, ' +
      'created_at, updated_at) VALUES (?,?,?,?,?,?,?,?)';
    const statements = facts.map((fact) =>
      this.db
        .prepare(sql)
        .bind(
          fact.id,
          fact.articleId,
          fact.statement,
          fact.normalizedStatement,
          fact.verificationStatus,
          fact.confidence,
          toISO(fact.createdAt),
          toISO(fact.updatedAt)
        )
    );
    await this.db.batch(statements);
  }

  async deleteByArticleId(articleId: string): Promise<void> {
    await this.db.prepare('DELETE FROM facts WHERE article_id = ?').bind(articleId).run();
  }

  private fromRow(row: Record<string, unknown>): Fact {
    return new Fact({
      id: row.id as string,
      articleId: row.article_id as string,
      statement: row.statement as string,
      normalizedStatement: row.normalized_statement as string,
      verificationStatus: row.verification_status as VerificationStatus,
      confidence: row.confidence as number,
      createdAt: fromISO(row.created_at),
      updatedAt: fromISO(row.updated_at),
    });
  }
}
