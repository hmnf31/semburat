export const migration001 = `-- Migration 0001: Initial schema
-- Combines all CREATE TABLE statements

CREATE TABLE IF NOT EXISTS topics (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT '\''active'\'',
  created_at TEXT NOT NULL DEFAULT (datetime('\''now'\'')),
  updated_at TEXT NOT NULL DEFAULT (datetime('\''now'\''))
);
CREATE INDEX IF NOT EXISTS idx_topics_slug ON topics(slug);
CREATE INDEX IF NOT EXISTS idx_topics_status ON topics(status);

CREATE TABLE IF NOT EXISTS trends (
  id TEXT PRIMARY KEY,
  topic_id TEXT REFERENCES topics(id),
  title TEXT NOT NULL,
  normalized_key TEXT NOT NULL UNIQUE,
  score REAL NOT NULL DEFAULT 0,
  velocity REAL NOT NULL DEFAULT 0,
  relevance REAL NOT NULL DEFAULT 0,
  freshness REAL NOT NULL DEFAULT 0,
  source_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT '\''candidate'\'',
  detected_at TEXT NOT NULL DEFAULT (datetime('\''now'\'')),
  created_at TEXT NOT NULL DEFAULT (datetime('\''now'\'')),
  updated_at TEXT NOT NULL DEFAULT (datetime('\''now'\''))
);
CREATE INDEX IF NOT EXISTS idx_trends_status ON trends(status);
CREATE INDEX IF NOT EXISTS idx_trends_score ON trends(score DESC);
CREATE INDEX IF NOT EXISTS idx_trends_detected_at ON trends(detected_at DESC);

CREATE TABLE IF NOT EXISTS sources (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  domain TEXT NOT NULL,
  title TEXT NOT NULL,
  publisher TEXT,
  published_at TEXT,
  accessed_at TEXT NOT NULL DEFAULT (datetime('\''now'\'')),
  source_type TEXT NOT NULL,
  reliability_state TEXT NOT NULL DEFAULT '\''unverified'\'',
  license_state TEXT NOT NULL DEFAULT '\''unknown'\'',
  created_at TEXT NOT NULL DEFAULT (datetime('\''now'\''))
);
CREATE INDEX IF NOT EXISTS idx_sources_domain ON sources(domain);
CREATE INDEX IF NOT EXISTS idx_sources_type ON sources(source_type);
CREATE INDEX IF NOT EXISTS idx_sources_reliability ON sources(reliability_state);

CREATE TABLE IF NOT EXISTS research (
  id TEXT PRIMARY KEY,
  trend_id TEXT NOT NULL REFERENCES trends(id),
  summary TEXT NOT NULL,
  facts_json TEXT NOT NULL,
  claims_json TEXT NOT NULL,
  conflicts_json TEXT NOT NULL DEFAULT '\''[]'\'',
  confidence_score REAL NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT '\''pending'\'',
  created_at TEXT NOT NULL DEFAULT (datetime('\''now'\'')),
  updated_at TEXT NOT NULL DEFAULT (datetime('\''now'\''))
);
CREATE INDEX IF NOT EXISTS idx_research_trend_id ON research(trend_id);
CREATE INDEX IF NOT EXISTS idx_research_status ON research(status);

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
  status TEXT NOT NULL DEFAULT '\''draft'\'',
  risk_level TEXT NOT NULL DEFAULT '\''low'\'',
  quality_score REAL NOT NULL DEFAULT 0,
  seo_title TEXT,
  meta_description TEXT,
  canonical_url TEXT,
  hero_asset_id TEXT,
  topic_id TEXT,
  source_count INTEGER NOT NULL DEFAULT 0,
  fact_check_status TEXT NOT NULL DEFAULT '\''pending'\'',
  version INTEGER NOT NULL DEFAULT 1,
  published_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('\''now'\'')),
  updated_at TEXT NOT NULL DEFAULT (datetime('\''now'\''))
);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_risk_level ON articles(risk_level);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);

CREATE TABLE IF NOT EXISTS article_versions (
  id TEXT PRIMARY KEY,
  article_id TEXT NOT NULL REFERENCES articles(id),
  version INTEGER NOT NULL,
  content TEXT NOT NULL,
  author_type TEXT NOT NULL,
  model TEXT,
  provider TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('\''now'\''))
);
CREATE INDEX IF NOT EXISTS idx_article_versions_article_id ON article_versions(article_id);
CREATE INDEX IF NOT EXISTS idx_article_versions_version ON article_versions(article_id, version DESC);

CREATE TABLE IF NOT EXISTS facts (
  id TEXT PRIMARY KEY,
  article_id TEXT NOT NULL REFERENCES articles(id),
  statement TEXT NOT NULL,
  normalized_statement TEXT NOT NULL,
  verification_status TEXT NOT NULL DEFAULT '\''unverified'\'',
  confidence REAL NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('\''now'\'')),
  updated_at TEXT NOT NULL DEFAULT (datetime('\''now'\''))
);
CREATE INDEX IF NOT EXISTS idx_facts_article_id ON facts(article_id);
CREATE INDEX IF NOT EXISTS idx_facts_status ON facts(verification_status);

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

CREATE TABLE IF NOT EXISTS assets (
  id TEXT PRIMARY KEY,
  article_id TEXT NOT NULL REFERENCES articles(id),
  type TEXT NOT NULL,
  storage_key TEXT NOT NULL,
  source_url TEXT,
  hash TEXT,
  creator TEXT,
  license_state TEXT NOT NULL DEFAULT '\''unknown'\'',
  credit_text TEXT,
  alt_text TEXT,
  metadata_json TEXT NOT NULL DEFAULT '\''{}'\'',
  created_at TEXT NOT NULL DEFAULT (datetime('\''now'\''))
);
CREATE INDEX IF NOT EXISTS idx_assets_article_id ON assets(article_id);
CREATE INDEX IF NOT EXISTS idx_assets_type ON assets(type);
CREATE INDEX IF NOT EXISTS idx_assets_license_state ON assets(license_state);

CREATE TABLE IF NOT EXISTS asset_licenses (
  id TEXT PRIMARY KEY,
  asset_id TEXT NOT NULL REFERENCES assets(id),
  license_type TEXT NOT NULL,
  permission_status TEXT NOT NULL DEFAULT '\''unknown'\'',
  usage_notes TEXT,
  copyright_holder TEXT,
  expires_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('\''now'\''))
);
CREATE INDEX IF NOT EXISTS idx_asset_licenses_asset_id ON asset_licenses(asset_id);

CREATE TABLE IF NOT EXISTS content_variants (
  id TEXT PRIMARY KEY,
  article_id TEXT NOT NULL REFERENCES articles(id),
  platform TEXT NOT NULL,
  format TEXT NOT NULL,
  content TEXT NOT NULL,
  asset_ids TEXT NOT NULL DEFAULT '\''[]'\'',
  approval_state TEXT NOT NULL DEFAULT '\''pending'\'',
  generation_metadata TEXT NOT NULL DEFAULT '\''{}'\'',
  created_at TEXT NOT NULL DEFAULT (datetime('\''now'\'')),
  published_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_content_variants_article_id ON content_variants(article_id);
CREATE INDEX IF NOT EXISTS idx_content_variants_platform ON content_variants(platform);
CREATE INDEX IF NOT EXISTS idx_content_variants_approval_state ON content_variants(approval_state);

CREATE TABLE IF NOT EXISTS publishing_jobs (
  id TEXT PRIMARY KEY,
  content_variant_id TEXT NOT NULL REFERENCES content_variants(id),
  target TEXT NOT NULL,
  scheduled_at TEXT,
  status TEXT NOT NULL DEFAULT '\''pending'\'',
  attempts INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  published_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('\''now'\'')),
  updated_at TEXT NOT NULL DEFAULT (datetime('\''now'\''))
);
CREATE INDEX IF NOT EXISTS idx_publishing_jobs_content_variant_id ON publishing_jobs(content_variant_id);
CREATE INDEX IF NOT EXISTS idx_publishing_jobs_status ON publishing_jobs(status);
CREATE INDEX IF NOT EXISTS idx_publishing_jobs_scheduled_at ON publishing_jobs(scheduled_at);

CREATE TABLE IF NOT EXISTS analytics_events (
  id TEXT PRIMARY KEY,
  content_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  value REAL NOT NULL DEFAULT 0,
  metadata_json TEXT NOT NULL DEFAULT '\''{}'\'',
  occurred_at TEXT NOT NULL DEFAULT (datetime('\''now'\''))
);
CREATE INDEX IF NOT EXISTS idx_analytics_events_content_id ON analytics_events(content_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_occurred_at ON analytics_events(occurred_at DESC);

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  action TEXT NOT NULL,
  changes_json TEXT,
  operator TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('\''now'\''))
);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

CREATE TABLE IF NOT EXISTS publishing_targets (
  id TEXT PRIMARY KEY,
  publishing_job_id TEXT NOT NULL REFERENCES publishing_jobs(id),
  platform TEXT NOT NULL,
  account_name TEXT,
  credentials_json TEXT NOT NULL DEFAULT '\''{}'\'',
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('\''now'\'')),
  updated_at TEXT NOT NULL DEFAULT (datetime('\''now'\''))
);
CREATE INDEX IF NOT EXISTS idx_publishing_targets_platform ON publishing_targets(platform);`;

export const migration002 = `-- Migration 0002: Additional composite indexes for query performance

CREATE INDEX IF NOT EXISTS idx_articles_status_category ON articles(status, category);
CREATE INDEX IF NOT EXISTS idx_trends_status_score ON trends(status, score DESC);
CREATE INDEX IF NOT EXISTS idx_facts_article_status ON facts(article_id, verification_status);
CREATE INDEX IF NOT EXISTS idx_assets_article_type ON assets(article_id, type);
CREATE INDEX IF NOT EXISTS idx_content_variants_article_platform ON content_variants(article_id, platform);
CREATE INDEX IF NOT EXISTS idx_publishing_jobs_variant_status ON publishing_jobs(content_variant_id, status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_created ON audit_logs(entity_type, entity_id, created_at DESC);`;
