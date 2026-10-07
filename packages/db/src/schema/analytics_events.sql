CREATE TABLE IF NOT EXISTS analytics_events (
  id TEXT PRIMARY KEY,
  content_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  value REAL NOT NULL DEFAULT 0,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  occurred_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_analytics_events_content_id ON analytics_events(content_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_occurred_at ON analytics_events(occurred_at DESC);
