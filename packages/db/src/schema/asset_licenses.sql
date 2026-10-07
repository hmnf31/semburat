CREATE TABLE IF NOT EXISTS asset_licenses (
  id TEXT PRIMARY KEY,
  asset_id TEXT NOT NULL REFERENCES assets(id),
  license_type TEXT NOT NULL,
  permission_status TEXT NOT NULL DEFAULT 'unknown',
  usage_notes TEXT,
  copyright_holder TEXT,
  expires_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_asset_licenses_asset_id ON asset_licenses(asset_id);
