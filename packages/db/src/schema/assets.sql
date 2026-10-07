CREATE TABLE IF NOT EXISTS assets (
  id TEXT PRIMARY KEY,
  article_id TEXT NOT NULL REFERENCES articles(id),
  type TEXT NOT NULL,
  storage_key TEXT NOT NULL,
  source_url TEXT,
  hash TEXT,
  creator TEXT,
  license_state TEXT NOT NULL DEFAULT 'unknown',
  credit_text TEXT,
  alt_text TEXT,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_assets_article_id ON assets(article_id);
CREATE INDEX IF NOT EXISTS idx_assets_type ON assets(type);
CREATE INDEX IF NOT EXISTS idx_assets_license_state ON assets(license_state);
