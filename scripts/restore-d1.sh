#!/usr/bin/env bash
set -euo pipefail

# restore-d1.sh
# Restores the SEMBURAT D1 database from a SQL backup stored in R2.
#
# Usage:
#   scripts/restore-d1.sh --latest
#   scripts/restore-d1.sh --file d1/semburat-db-20261007T020000Z.sql
#   BACKUP_FILE=d1/semburat-db-20261007T020000Z.sql scripts/restore-d1.sh
#
# Environment variables:
#   D1_DATABASE_NAME        - Name of the D1 database to restore into (default: semburat-db)
#   R2_BACKUP_BUCKET        - Name of the R2 bucket with backups (default: semburat-backups)
#   BACKUP_FILE             - R2 key of the backup file (alternative to --file)
#   KEEP_DATA               - If "1", preserves existing data; if "0", cleans first (default: "1")
#   CLOUDFLARE_ACCOUNT_ID   - Required: Cloudflare account ID
#   CLOUDFLARE_API_TOKEN    - Required: Cloudflare API token with D1 and R2 permissions
#
# Exit codes:
#   0  - Restore succeeded
#   1  - Missing required arguments or environment variables
#   2  - Download or import failed

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${REPO_ROOT}"

D1_DATABASE_NAME="${D1_DATABASE_NAME:-semburat-db}"
R2_BACKUP_BUCKET="${R2_BACKUP_BUCKET:-semburat-backups}"
BACKUP_FILE="${BACKUP_FILE:-}"
KEEP_DATA="${KEEP_DATA:-1}"

echo "=== SEMBURAT D1 Restore ==="
echo "Database:  ${D1_DATABASE_NAME}"
echo "R2 Bucket: ${R2_BACKUP_BUCKET}"
echo ""

# Validate required environment variables.
for var in CLOUDFLARE_ACCOUNT_ID CLOUDFLARE_API_TOKEN; do
  if [[ -z "${!var:-}" ]]; then
    echo "ERROR: ${var} environment variable is not set."
    exit 1
  fi
done

# Parse command-line arguments.
SELECTED_FILE=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --latest)
      SELECTED_FILE=""
      shift
      ;;
    --file)
      if [[ $# -lt 2 ]]; then
        echo "ERROR: --file requires a value."
        exit 1
      fi
      SELECTED_FILE="$2"
      shift 2
      ;;
    --file=*)
      SELECTED_FILE="${1#*=}"
      shift
      ;;
    --help|-h)
      echo "Usage: scripts/restore-d1.sh [--latest | --file <r2-key>]"
      echo ""
      echo "Options:"
      echo "  --latest           Restore from the most recent backup in R2"
      echo "  --file <key>       Restore from a specific backup key in R2"
      echo "  --help, -h         Show this help message"
      echo ""
      echo "Environment variables:"
      echo "  D1_DATABASE_NAME   Target D1 database name (default: semburat-db)"
      echo "  R2_BACKUP_BUCKET   R2 bucket containing backups (default: semburat-backups)"
      echo "  BACKUP_FILE        R2 key of the backup (alternative to --file)"
      echo "  KEEP_DATA          Keep existing data (1) or clean first (0)"
      echo ""
      echo "Examples:"
      echo "  scripts/restore-d1.sh --latest"
      echo "  scripts/restore-d1.sh --file d1/semburat-db-20261007T020000Z.sql"
      echo "  KEEP_DATA=0 scripts/restore-d1.sh --latest"
      exit 0
      ;;
    *)
      echo "ERROR: Unknown argument: ${1}"
      echo "Use --file <key> or --latest. See --help for details."
      exit 1
      ;;
  esac
done

# Determine which backup file to restore.
if [[ -z "${SELECTED_FILE}" && -n "${BACKUP_FILE}" ]]; then
  SELECTED_FILE="${BACKUP_FILE}"
fi

if [[ -n "${SELECTED_FILE}" ]]; then
  BACKUP_KEY="${SELECTED_FILE}"
else
  echo "Resolving latest backup from R2..."

  # Ensure jq is available for parsing JSON output.
  if ! command -v jq &>/dev/null; then
    echo "ERROR: jq is required for --latest mode."
    echo "Install jq or specify a backup key with: scripts/restore-d1.sh --file <key>"
    exit 1
  fi

  BACKUP_KEY="$(
    npx --no-install wrangler r2 object list "${R2_BACKUP_BUCKET}" --prefix "d1/" --json \
    | jq -r 'sort_by(.Modified) | last | .Key' 2>/dev/null || true
  )"

  if [[ -z "${BACKUP_KEY}" ]]; then
    echo "ERROR: No backup files found in r2://${R2_BACKUP_BUCKET}/d1/"
    echo "Specify a backup with: scripts/restore-d1.sh --file <key>"
    exit 2
  fi
fi

echo "Selected backup key: ${BACKUP_KEY}"
echo "Keep existing data:  ${KEEP_DATA}"
echo ""

# Download backup from R2.
TMP_FILE="$(mktemp /tmp/semburat-d1-restore-XXXX.sql)"

cleanup() {
  rm -f "${TMP_FILE}"
}
trap cleanup EXIT

echo "[1/3] Downloading backup from R2..."
if ! npx --no-install wrangler r2 object get "${R2_BACKUP_BUCKET}" "${BACKUP_KEY}" --file "${TMP_FILE}"; then
  echo "ERROR: R2 download failed."
  exit 2
fi

if [[ ! -s "${TMP_FILE}" ]]; then
  echo "ERROR: Downloaded backup file is empty."
  exit 2
fi

FILE_SIZE=$(wc -c < "${TMP_FILE}")
echo "    Downloaded ${FILE_SIZE} bytes"

# Import into D1.
echo "[2/3] Importing into D1 database..."

IMPORT_ARGS=(d1 import)
if [[ "${KEEP_DATA}" == "0" ]]; then
  IMPORT_ARGS+=(--clean)
  echo "    Cleaning existing data before import (KEEP_DATA=0)."
else
  echo "    Preserving existing data (KEEP_DATA=1). Conflicts will be skipped."
fi
IMPORT_ARGS+=("${D1_DATABASE_NAME}" --file "${TMP_FILE}")

if ! npx --no-install wrangler "${IMPORT_ARGS[@]}"; then
  echo "ERROR: D1 import failed."
  exit 2
fi

echo "[3/3] Cleaning up..."
cleanup
trap - EXIT
echo "    Temporary file removed."

echo ""
echo "Restore completed successfully."
echo "  Database:  ${D1_DATABASE_NAME}"
echo "  Backup:    ${BACKUP_KEY}"
echo "  File size: ${FILE_SIZE} bytes"
echo ""
echo "Verify the restored data by querying the database directly."