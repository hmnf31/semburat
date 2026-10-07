-- Migration 0002: Additional composite indexes for query performance

CREATE INDEX IF NOT EXISTS idx_articles_status_category ON articles(status, category);
CREATE INDEX IF NOT EXISTS idx_trends_status_score ON trends(status, score DESC);
CREATE INDEX IF NOT EXISTS idx_facts_article_status ON facts(article_id, verification_status);
CREATE INDEX IF NOT EXISTS idx_assets_article_type ON assets(article_id, type);
CREATE INDEX IF NOT EXISTS idx_content_variants_article_platform ON content_variants(article_id, platform);
CREATE INDEX IF NOT EXISTS idx_publishing_jobs_variant_status ON publishing_jobs(content_variant_id, status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_created ON audit_logs(entity_type, entity_id, created_at DESC);
