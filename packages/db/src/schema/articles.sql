CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY,
  research_id TEXT REFERENCES research(id),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  dek TEXT NOT NULL,
  summary TEXT,
  body TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  risk_level TEXT NOT NULL DEFAULT 'low',
  quality_score REAL NOT NULL DEFAULT 0,
  seo_title TEXT,
  meta_description TEXT,
  canonical_url TEXT,
  hero_asset_id TEXT,
  topic_id TEXT,
  source_count INTEGER NOT NULL DEFAULT 0,
  fact_check_status TEXT NOT NULL DEFAULT 'pending',
  version INTEGER NOT NULL DEFAULT 1,
  published_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_risk_level ON articles(risk_level);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
