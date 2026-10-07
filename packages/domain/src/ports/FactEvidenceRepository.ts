import type { FactEvidence } from '../entities/FactEvidence.js';

export interface FactEvidenceRepository {
  insert(evidence: FactEvidence): Promise<void>;
  findByFactId(factId: string): Promise<FactEvidence[]>;
}
