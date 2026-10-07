CREATE TABLE IF NOT EXISTS publishing_targets (
  id TEXT PRIMARY KEY,
  publishing_job_id TEXT NOT NULL REFERENCES publishing_jobs(id),
  platform TEXT NOT NULL,
  account_name TEXT,
  credentials_json TEXT NOT NULL DEFAULT '{}',
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_publishing_targets_platform ON publishing_targets(platform);
