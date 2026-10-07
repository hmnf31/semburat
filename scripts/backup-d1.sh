#!/usr/bin/env bash
set -euo pipefail

# backup-d1.sh
# Exports the SEMBURAT D1 database to a SQL dump and uploads it to R2.
# A timestamped backup is created on each run.
#
# Usage: scripts/backup-d1.sh
#
# Environment variables:
#   D1_DATABASE_NAME        - Name of the D1 database (default: semburat-db)
#   R2_BACKUP_BUCKET        - Name of the R2 bucket for backups (default: semburat-backups)
#   BACKUP_PREFIX           - Key prefix for backup objects (default: d1)
#   CLOUDFLARE_ACCOUNT_ID   - Required: Cloudflare account ID
#   CLOUDFLARE_API_TOKEN    - Required: Cloudflare API token with D1 and R2 permissions
#
# Exit codes:
#   0 - Backup succeeded
#   1 - Missing required environment variables
#   2 - Export or upload step failed

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${REPO_ROOT}"

D1_DATABASE_NAME="${D1_DATABASE_NAME:-semburat-db}"
R2_BACKUP_BUCKET="${R2_BACKUP_BUCKET:-semburat-backups}"
BACKUP_PREFIX="${BACKUP_PREFIX:-d1}"

echo "=== SEMBURAT D1 Backup ==="
echo "Database:  ${D1_DATABASE_NAME}"
echo "R2 Bucket: ${R2_BACKUP_BUCKET}"
echo "Prefix:    ${BACKUP_PREFIX}"
echo ""

# Validate required environment variables.
for var in CLOUDFLARE_ACCOUNT_ID CLOUDFLARE_API_TOKEN; do
  if [[ -z "${!var:-}" ]]; then
    echo "ERROR: ${var} environment variable is not set."
    exit 1
  fi
done

TIMESTAMP="$(date -u +%Y%m%dT%H%M%SZ)"
BACKUP_KEY="${BACKUP_PREFIX}/semburat-db-${TIMESTAMP}.sql"
TMP_FILE="$(mktemp /tmp/semburat-d1-backup-XXXX.sql)"

cleanup() {
  rm -f "${TMP_FILE}"
}
trap cleanup EXIT

echo "[1/3] Exporting D1 database to SQL dump..."
if ! npx --no-install wrangler d1 export "${D1_DATABASE_NAME}" --output "${TMP_FILE}"; then
  echo "ERROR: D1 export failed."
  exit 2
fi

if [[ ! -s "${TMP_FILE}" ]]; then
  echo "ERROR: Export file is empty."
  exit 2
fi

FILE_SIZE=$(wc -c < "${TMP_FILE}")
echo "    Exported ${FILE_SIZE} bytes to $(basename "${TMP_FILE}")"

echo "[2/3] Uploading backup to R2..."
if ! npx --no-install wrangler r2 object put "${R2_BACKUP_BUCKET}" "${BACKUP_KEY}" --file "${TMP_FILE}"; then
  echo "ERROR: R2 upload failed."
  exit 2
fi
echo "    Uploaded to r2://${R2_BACKUP_BUCKET}/${BACKUP_KEY}"

echo "[3/3] Cleaning up temporary files..."
cleanup
trap - EXIT
echo "    Temporary file removed."

echo ""
echo "Backup completed successfully."
echo "  Backup key: ${BACKUP_KEY}"
echo "  File size:  ${FILE_SIZE} bytes"
echo ""
echo "Retention is managed by R2 lifecycle rules configured on ${R2_BACKUP_BUCKET}."