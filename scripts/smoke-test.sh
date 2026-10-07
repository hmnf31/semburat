#!/usr/bin/env bash
#
# smoke-test.sh
# Validates that SEMBURAT is healthy after deployment.
#
# Usage: scripts/smoke-test.sh
# Environment variables:
#   WORKER_URL  - Base URL of the Cloudflare Worker (e.g. https://worker.example.com)
#   SITE_URL    - Base URL of the public website (e.g. https://example.com)
#
# Exit code: 0 if all checks pass, 1 otherwise.

set -euo pipefail

# Resolve WORKER_URL and SITE_URL with sensible defaults.
WORKER_URL="${WORKER_URL:-https://semburat-worker.workers.dev}"
SITE_URL="${SITE_URL:-https://semburat.example.com}"

PASS=0
FAIL=0
TOTAL=0

check() {
  local description="$1"
  local expected="$2"
  shift 2
  TOTAL=$((TOTAL + 1))
  echo -n "[CHECK] ${description} ... "
  if "$@" > /tmp/smoke_output 2>&1; then
    echo "PASS"
    PASS=$((PASS + 1))
  else
    echo "FAIL"
    FAIL=$((FAIL + 1))
    cat /tmp/smoke_output
  fi
}

check_http() {
  local description="$1"
  local url="$2"
  local expected_code="$3"
  TOTAL=$((TOTAL + 1))
  echo -n "[CHECK] ${description} ... "
  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" "${url}" || echo "000")
  if [ "${code}" = "${expected_code}" ]; then
    echo "PASS (HTTP ${code})"
    PASS=$((PASS + 1))
  else
    echo "FAIL (expected ${expected_code}, got ${code})"
    FAIL=$((FAIL + 1))
  fi
}

echo "=== SEMBURAT Smoke Test ==="
echo "Worker URL: ${WORKER_URL}"
echo "Site URL:   ${SITE_URL}"
echo ""

# 1. Worker health endpoint
check_http "Worker health endpoint" "${WORKER_URL}/health" "200"

# 2. Sitemap accessible
check_http "Sitemap is accessible" "${SITE_URL}/sitemap.xml" "200"

# 3. RSS feed accessible
check_http "RSS feed is accessible" "${SITE_URL}/rss.xml" "200"

# 4. Homepage returns 200
check_http "Homepage returns 200" "${SITE_URL}/" "200"

# 5. Article pages return 200 (check a known article)
check_http "Article page returns 200" "${SITE_URL}/articles/contoh-artikel/" "200"

# 6. Category page returns 200
check_http "Category page returns 200" "${SITE_URL}/categories/teknologi/" "200"

# 7. About page returns 200
check_http "About page returns 200" "${SITE_URL}/about/" "200"

# 8. Contact page returns 200
check_http "Contact page returns 200" "${SITE_URL}/contact/" "200"

# 9. Sitemap returns valid XML
check "Sitemap returns valid XML" bash -c "curl -s '${SITE_URL}/sitemap.xml' | grep -q '<urlset'"

# 10. RSS feed returns valid RSS XML
check "RSS feed returns valid RSS XML" bash -c "curl -s '${SITE_URL}/rss.xml' | grep -q '<rss'"

echo ""
echo "=== Results ==="
echo "Total:  ${TOTAL}"
echo "Passed: ${PASS}"
echo "Failed: ${FAIL}"

if [ "${FAIL}" -gt 0 ]; then
  echo "SMOKE TEST FAILED"
  exit 1
else
  echo "SMOKE TEST PASSED"
  exit 0
fi
