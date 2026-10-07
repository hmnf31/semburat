CREATE TABLE IF NOT EXISTS research (
  id TEXT PRIMARY KEY,
  trend_id TEXT NOT NULL REFERENCES trends(id),
  summary TEXT NOT NULL,
  facts_json TEXT NOT NULL,
  claims_json TEXT NOT NULL,
  conflicts_json TEXT NOT NULL DEFAULT '[]',
  confidence_score REAL NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_research_trend_id ON research(trend_id);
CREATE INDEX IF NOT EXISTS idx_research_status ON research(status);
