CREATE TABLE IF NOT EXISTS fact_evidence (
  id TEXT PRIMARY KEY,
  fact_id TEXT NOT NULL REFERENCES facts(id),
  source_id TEXT NOT NULL REFERENCES sources(id),
  evidence_text TEXT NOT NULL,
  evidence_location TEXT,
  support_type TEXT NOT NULL,
  confidence REAL NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_fact_evidence_fact_id ON fact_evidence(fact_id);
CREATE INDEX IF NOT EXISTS idx_fact_evidence_source_id ON fact_evidence(source_id);
