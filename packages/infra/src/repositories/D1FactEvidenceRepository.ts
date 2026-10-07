import { uuid } from './D1Helpers.js';

import type { D1Database } from '@semburat/db';
import { FactEvidence, SupportType } from '@semburat/domain';
import type { FactEvidenceRepository as FactEvidenceRepositoryPort } from '@semburat/domain';

export class D1FactEvidenceRepository implements FactEvidenceRepositoryPort {
  constructor(private readonly db: D1Database) {}

  async insert(evidence: FactEvidence): Promise<void> {
    const sql =
      'INSERT OR REPLACE INTO fact_evidence ' +
      '(id, fact_id, source_id, evidence_text, evidence_location, support_type, confidence) ' +
      'VALUES (?,?,?,?,?,?,?)';
    await this.db
      .prepare(sql)
      .bind(
        uuid(),
        evidence.factId,
        evidence.sourceId,
        evidence.evidenceText,
        evidence.evidenceLocation ?? null,
        evidence.supportType,
        evidence.confidence
      )
      .run();
  }

  async findByFactId(factId: string): Promise<FactEvidence[]> {
    const result = await this.db
      .prepare('SELECT * FROM fact_evidence WHERE fact_id = ? ORDER BY id ASC')
      .bind(factId)
      .all<Record<string, unknown>>();
    return (result.results ?? []).map((row) => this.fromRow(row));
  }

  private fromRow(row: Record<string, unknown>): FactEvidence {
    return new FactEvidence({
      factId: row.fact_id as string,
      sourceId: row.source_id as string,
      evidenceText: row.evidence_text as string,
      evidenceLocation: row.evidence_location ? (row.evidence_location as string) : undefined,
      supportType: row.support_type as SupportType,
      confidence: row.confidence as number,
    });
  }
}
