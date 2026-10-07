CREATE TABLE IF NOT EXISTS sources (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  domain TEXT NOT NULL,
  title TEXT NOT NULL,
  publisher TEXT,
  published_at TEXT,
  accessed_at TEXT NOT NULL DEFAULT (datetime('now')),
  source_type TEXT NOT NULL,
  reliability_state TEXT NOT NULL DEFAULT 'unverified',
  license_state TEXT NOT NULL DEFAULT 'unknown',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_sources_domain ON sources(domain);
CREATE INDEX IF NOT EXISTS idx_sources_type ON sources(source_type);
CREATE INDEX IF NOT EXISTS idx_sources_reliability ON sources(reliability_state);
