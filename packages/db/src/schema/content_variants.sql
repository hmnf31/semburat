CREATE TABLE IF NOT EXISTS content_variants (
  id TEXT PRIMARY KEY,
  article_id TEXT NOT NULL REFERENCES articles(id),
  platform TEXT NOT NULL,
  format TEXT NOT NULL,
  content TEXT NOT NULL,
  asset_ids TEXT NOT NULL DEFAULT '[]',
  approval_state TEXT NOT NULL DEFAULT 'pending',
  generation_metadata TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  published_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_content_variants_article_id ON content_variants(article_id);
CREATE INDEX IF NOT EXISTS idx_content_variants_platform ON content_variants(platform);
CREATE INDEX IF NOT EXISTS idx_content_variants_approval_state ON content_variants(approval_state);
