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
  status TEXT NOT NULL DEFAULT 'candidate',
  detected_at TEXT NOT NULL DEFAULT (datetime('now')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_trends_status ON trends(status);
CREATE INDEX IF NOT EXISTS idx_trends_score ON trends(score DESC);
CREATE INDEX IF NOT EXISTS idx_trends_detected_at ON trends(detected_at DESC);
