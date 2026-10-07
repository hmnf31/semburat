CREATE TABLE IF NOT EXISTS article_versions (
  id TEXT PRIMARY KEY,
  article_id TEXT NOT NULL REFERENCES articles(id),
  version INTEGER NOT NULL,
  content TEXT NOT NULL,
  author_type TEXT NOT NULL,
  model TEXT,
  provider TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_article_versions_article_id ON article_versions(article_id);
CREATE INDEX IF NOT EXISTS idx_article_versions_version ON article_versions(article_id, version DESC);
