#!/usr/bin/env bash
#
# check-secrets.sh
# Scans the repository for potential secrets and fails if any are found in tracked files.
#
# Usage: scripts/check-secrets.sh
# Run from the repository root.
set -euo pipefail

# Resolve repository root: prefer git toplevel, else current directory.
if git rev-parse --show-toplevel >/dev/null 2>&1; then
  REPO_ROOT="$(git rev-parse --show-toplevel)"
else
  REPO_ROOT="$(pwd)"
fi

cd "${REPO_ROOT}"

# Patterns that indicate a potential secret.
PATTERNS=(
  # Generic API key / token / secret assignments
  '(?i)(api[_-]?key|secret|token|password|passwd)\s*[:=]\s*["'"'"'][A-Za-z0-9_\-\.]{16,}["'"'"']'
  # Private key blocks
  '-----BEGIN (RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----'
  # OpenRouter key prefix
  'sk-or-[A-Za-z0-9_\-]{20,}'
  # Telegram bot token pattern (digits:alphanumeric)
  '[0-9]{8,10}:[A-Za-z0-9_\-]{35}'
  # MiniMax API key pattern
  'MM-[A-Za-z0-9_\-]{20,}'
  # Google service-account private key field
  '"private_key"\s*:\s*"[A-Za-z0-9_\-\.]{40,}"'
  # Generic long random strings assigned to env vars
  '(?i)process\.env\.[A-Z_]+\s*=\s*["'"'"'][A-Za-z0-9_\-\.]{20,}["'"'"']'
)

echo "=== SEMBURAT Secret Scan ==="
echo "Repository: ${REPO_ROOT}"
echo ""

FOUND_SECRETS=0
MATCHES=""

# Collect candidate files using git ls-files (falls back to find).
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  mapfile -t FILES < <(git ls-files -- ':!secrets' ':!.env*' ':!*.secret' ':!wrangler.tmp' ':!node_modules' ':!.turbo' ':!dist' ':!.next' ':!build' ':!coverage')
else
  # Fallback: use find with prune expressions.
  PRUNE_ARGS=()
  for dir in '.git' 'node_modules' '.turbo' 'dist' '.next' 'build' 'coverage' 'secrets'; do
    PRUNE_ARGS+=(-path "./${dir}" -prune -o)
  done
  FILE_ARGS=()
  for pattern in '.env' '.env.*' '*.secret' 'wrangler.tmp'; do
    FILE_ARGS+=(-not -name "${pattern}")
  done
  mapfile -t FILES < <(find . "${PRUNE_ARGS[@]}" -type f "${FILE_ARGS[@]}" -print 2>/dev/null)
fi

for file in "${FILES[@]}"; do
  [[ -n "${file}" ]] || continue
  [[ -f "${file}" ]] || continue
  for pattern in "${PATTERNS[@]}"; do
    hits="$(grep -nEI -- "${pattern}" "${file}" 2>/dev/null || true)"
    if [[ -n "${hits}" ]]; then
      FOUND_SECRETS=1
      MATCHES+="${file}"
      while IFS= read -r line; do
        MATCHES+="
  ${line}"
      done <<< "${hits}"
      MATCHES+="
"
    fi
  done
done

if [[ "${FOUND_SECRETS}" -eq 1 ]]; then
  echo "FAIL: Potential secrets detected in tracked files:"
  echo "${MATCHES}"
  echo ""
  echo "Remove or externalize these secrets before committing."
  exit 1
else
  echo "PASS: No secrets detected."
  exit 0
fi
