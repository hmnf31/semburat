CREATE TABLE IF NOT EXISTS facts (
  id TEXT PRIMARY KEY,
  article_id TEXT NOT NULL REFERENCES articles(id),
  statement TEXT NOT NULL,
  normalized_statement TEXT NOT NULL,
  verification_status TEXT NOT NULL DEFAULT 'unverified',
  confidence REAL NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_facts_article_id ON facts(article_id);
CREATE INDEX IF NOT EXISTS idx_facts_status ON facts(verification_status);
