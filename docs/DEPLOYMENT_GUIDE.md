# SEMBURAT Deployment Guide

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Deployment Steps](#deployment-steps)
4. [CI/CD Pipeline](#cicd-pipeline)
5. [Monitoring After Deploy](#monitoring-after-deploy)
6. [Troubleshooting](#troubleshooting)
7. [Rollback Procedure](#rollback-procedure)
8. [Cost Control](#cost-control)
9. [Production Checklist](#production-checklist)

## Prerequisites

### Cloudflare Account

- An active Cloudflare account with access to Workers, D1, R2, and Pages.
- Account ID can be found in the Cloudflare dashboard URL or via wrangler whoami.
- API token with at least the following permissions:
  - Workers: Read, Edit
  - D1: Read, Edit
  - R2: Read, Edit
  - Pages: Read, Edit

### Required Tools

- Node.js 20.x or later
- pnpm 9.x (package manager is pinned to pnpm@9.12.0)
- Cloudflare Wrangler CLI (installed via the worker app dependency)
- Git

### Install Dependencies

\\\ash
pnpm install
\\\

This installs workspace dependencies and links local packages.

## Environment Setup

### Copy Environment Template

\\\ash
cp .env.example .env
\\\

Edit .env and fill in real values. Never commit .env or any file containing real secrets.

### Environment Variable Categories

| Variable                       | Scope  | Description                           |
| ------------------------------ | ------ | ------------------------------------- |
| NODE_ENV                       | PUBLIC | development, staging, production      |
| CLOUDFLARE_ACCOUNT_ID          | SERVER | Cloudflare account ID                 |
| CLOUDFLARE_API_TOKEN           | SERVER | Scoped Cloudflare API token           |
| D1_DATABASE_ID                 | SERVER | UUID of the D1 database               |
| R2_BUCKET                      | SERVER | Name of the R2 storage bucket         |
| R2_PUBLIC_BASE_URL             | SERVER | Public base URL for signed assets     |
| RESEARCH_MODE                  | SERVER | live (default) or offline             |
| RSS_FEEDS                      | SERVER | Extra RSS feeds, comma separated      |
| OPENROUTER_API_KEY             | SERVER | OpenRouter API key                    |
| OPENROUTER_DEFAULT_MODEL       | SERVER | Default model identifier              |
| OLLAMA_BASE_URL                | SERVER | Optional local Ollama base URL        |
| OLLAMA_DEFAULT_MODEL           | SERVER | Optional local Ollama model           |
| TELEGRAM_BOT_TOKEN             | SERVER | Bot token from @BotFather             |
| TELEGRAM_WEBHOOK_SECRET        | SERVER | Webhook validation secret             |
| MINIMAX_API_KEY                | SERVER | MiniMax API key                       |
| MINIMAX_MODEL                  | SERVER | MiniMax model identifier              |
| GOOGLE_SHEETS_CREDENTIALS_JSON | SERVER | Service-account credentials JSON      |
| GOOGLE_SHEETS_SPREADSHEET_ID   | SERVER | Operational spreadsheet ID            |
| APP_BASE_URL                   | SERVER | Backend base URL                      |
| PUBLIC_SITE_URL                | PUBLIC | Public website URL                    |
| PUBLIC_API_BASE_URL            | PUBLIC | Worker API base URL for the web build |
| TELEGRAM_ALLOWED_USER_IDS      | SERVER | Allowed Telegram user IDs             |
| LOG_LEVEL                      | SERVER | debug, info, warn, error              |

### Secrets Management

- Store secrets in GitHub repository secrets under Settings > Secrets and variables > Actions.
- Map each [SERVER] variable to a GitHub Actions secret with the same name.
- Use wrangler secret put for local Worker secrets.
- Never hardcode credentials in source files. Run scripts/check-secrets.sh before pushing.

### Local Development Setup

\\\ash

# Install dependencies

pnpm install

# Copy and configure environment

cp .env.example .env

# Start development servers (Worker + Web)

pnpm dev
\\\

The Worker runs via wrangler dev and the Astro web app runs via stro dev.

## Deployment Steps

### 1. Database Setup (D1)

Create the D1 database:
\\\ash
wrangler d1 create semburat-db
\\\

Copy the UUID from the output and set it as D1_DATABASE_ID in your environment.

Update pps/worker/wrangler.jsonc with the real database ID:
\\\jsonc
"d1_databases": [
{
"binding": "DB",
"database_id": "<real-uuid-from-output>",
"database_name": "semburat-db",
}
]
\\\

Apply migrations:
\\\ash
cd apps/worker
wrangler d1 execute semburat-db --file migrations/0001_initial.sql
\\\

Migration rules:

- Never manually alter production schema without a migration.
- Create migrations under pps/worker/migrations/.
- Test migrations locally before applying.
- Keep migrations versioned and backwards-compatible where possible.

### 2. R2 Bucket Setup

Create the R2 bucket:
\\\ash
wrangler r2 create semburat-assets
\\\

Set R2_BUCKET=semburat-assets in your environment. Update pps/worker/wrangler.jsonc:
\\\jsonc
"r2_buckets": [
{
"binding": "ASSETS",
"bucket_name": "semburat-assets",
}
]
\\\

Use deterministic storage keys:
\\\
assets/{asset_id}/{variant}.{ext}
\\\

### 3. Worker Deployment

\\\ash
cd apps/worker
pnpm deploy
\\\

This runs wrangler deploy which:

- Builds the Worker bundle
- Validates bindings and variables
- Deploys to Cloudflare
- Returns the deployment URL

Verify the deployment:
\\\ash
curl https://semburat-worker.<your-subdomain>.workers.dev/health
\\\

### 4. Web Deployment (Astro to Cloudflare Pages)

Configure Cloudflare Pages:

1. Go to Cloudflare Dashboard > Workers & Pages > Pages.
2. Create a new Pages project.
3. Set build settings:
   - Build command: pnpm build (runs stro build)
   - Build output directory: dist
   - Root directory: pps/web

Deploy via CLI:
\\\ash
cd apps/web
astro build
wrangler pages deploy dist --project-name semburat-web --branch main
\\\

Or connect the GitHub repository for automatic deployments on push to main.

Note: the `semburat-web` Pages project uses `main` as its production branch. A deploy sent with
another branch name (for example the repository's working branch) only creates a preview URL.

Verify:
\\\ash
curl -I https://semburat.example.com/
\\\

### 5. Telegram Bot Configuration

1. Create a bot via @BotFather and obtain the token.
2. Set TELEGRAM_BOT_TOKEN in your environment.
3. Set TELEGRAM_WEBHOOK_SECRET for webhook validation.
4. Register the webhook:
   \\\ash
   curl -X POST "https://api.telegram.org/bot/setWebhook" \
   -H "Content-Type: application/json" \
   -d "{\"url\": \"/telegram/webhook\", \"secret_token\": \"\"}"
   \\\

5. Verify webhook status:
   \\\ash
   curl "https://api.telegram.org/bot/getWebhookInfo"
   \\\

#### Live setup (Oktober 2026)

- Bot: `@SemburatId_bot`.
- Secrets dipasang dengan `wrangler secret put ... --env production` **dan** `--env staging`:
  `TELEGRAM_BOT_TOKEN`, `TELEGRAM_WEBHOOK_SECRET` (64 karakter hex acak), `TELEGRAM_ALLOWED_USER_IDS` (operator).
- Webhook terdaftar di **production** saja (Telegram hanya mengizinkan satu webhook per bot):
  `https://semburat-worker-production.theahuda.workers.dev/api/telegram/webhook` dengan `secret_token`.
- Staging diverifikasi dengan POST langsung ke
  `https://semburat-worker-staging.theahuda.workers.dev/api/telegram/webhook` memakai header
  `x-telegram-bot-api-secret-token`.
- Endpoint menolak permintaan tanpa secret (401) dan mengabaikan pengirim yang tidak ada di
  `TELEGRAM_ALLOWED_USER_IDS`.
- Catatan: hostname `workers.dev` yang baru dibuat butuh beberapa menit sampai DNS-nya terbaca Telegram;
  bila `setWebhook` menjawab `Failed to resolve host`, ulangi setelah beberapa menit.

### 6. Verification Steps

After deployment, run the smoke test:
\\\ash
scripts/smoke-test.sh
\\\

Manual verification checklist:

- [ ] Worker health endpoint returns 200
- [ ] Sitemap is accessible and returns XML
- [ ] RSS feed is accessible and returns valid XML
- [ ] Article pages return HTTP 200
- [ ] Telegram webhook is registered and receiving updates
- [ ] D1 database is connected and queries succeed
- [ ] R2 bucket is accessible for read/write
- [ ] Environment variables are correctly injected
- [ ] No secrets are exposed in client bundles
- [ ] Scheduled jobs are running (if configured)

## CI/CD Pipeline

### GitHub Actions Workflow

The production deployment workflow is defined in .github/workflows/deploy.yml.

It runs on push to main branch and performs:

1. **Checkout** repository
2. **Install** dependencies with pnpm
3. **Lint** all packages
4. **Format check** with Prettier
5. **Typecheck** across all packages
6. **Test** with Vitest
7. **Build** with Turborepo
8. **Secret scan** via scripts/check-secrets.sh
9. **Deploy Worker** to production
10. **Deploy Web** to Cloudflare Pages
11. **Smoke test** via scripts/smoke-test.sh
12. **Notify** on success/failure via GitHub Actions summary and optional Slack webhook

### Automated Tests Before Deploy

The CI pipeline enforces:

- pnpm lint � ESLint passes with no errors
- pnpm format:check � Prettier formatting is consistent
- pnpm typecheck � TypeScript compiles with no errors
- pnpm test � All unit and integration tests pass
- pnpm build � Production build succeeds

If any step fails, the deployment is blocked and the PR cannot merge.

### Rollback Procedure

**Code rollback:**

1. Identify the previous successful deployment commit.
2. Create a revert commit or redeploy the previous tag:
   \\\ash
   git revert <failed-commit>
   git push origin main
   \\\
   Or redeploy the previous working tag:
   \\\ash
   git checkout v1.0.0
   pnpm deploy
   \\\

**Database rollback:**

- Never assume code rollback automatically means database rollback is safe.
- Migrations must be backwards-compatible.
- To rollback a migration:
  1. Create a reverse migration file.
  2. Apply it in a maintenance window.
  3. Verify data integrity after rollback.

**Queue/job recovery:**

- Check publishing_jobs table for failed jobs.
- Retry failed jobs after fixing the root cause.
- Jobs are idempotent; retries are safe.

**Communication:**

- Notify the team via Telegram or Slack.
- Document the incident in the runbook.

## Monitoring After Deploy

### Health Checks

Monitor these endpoints after every deployment:

\\\ash

# Worker health

curl -s -o /dev/null -w "%{http_code}" https://worker.example.com/health

# Sitemap

curl -s -o /dev/null -w "%{http_code}" https://example.com/sitemap.xml

# RSS feed

curl -s -o /dev/null -w "%{http_code}" https://example.com/rss.xml

# Homepage

curl -s -o /dev/null -w "%{http_code}" https://example.com/

# Article page

curl -s -o /dev/null -w "%{http_code}" https://example.com/articles/some-slug/
\\\

### Log Verification

**Cloudflare Workers:**

- Go to Cloudflare Dashboard > Workers > Logs > Worker logs.
- Filter by @request for HTTP requests and @error for errors.
- Check for 5xx errors, slow responses (>1s), and unhandled exceptions.

**Cloudflare Pages:**

- Go to Cloudflare Dashboard > Pages > Deployments.
- Review build logs for warnings or failures.
- Check for 404s in the browser console.

**Application logs:**

- Set LOG_LEVEL=info (or debug during troubleshooting).
- Logs should include correlation IDs for job tracing.
- Avoid logging secrets or sensitive payloads.

### Performance Monitoring

- Enable Cloudflare Analytics for traffic and performance metrics.
- Monitor Core Web Vitals (LCP, CLS, FID) via PageSpeed Insights.
- Track API response times via Worker logs.
- Set up alerts for:
  - Error rate > 1%
  - p95 latency > 2s
  - D1 query latency > 500ms
  - R2 read/write failures

### Cost Monitoring

- Review Cloudflare Workers compute usage monthly.
- Monitor D1 read/write units.
- Monitor R2 storage and egress.
- Track AI API usage via OpenRouter dashboard.
- Set budget alerts in Cloudflare if available.

## Troubleshooting

### Common Deployment Issues

#### Worker fails to deploy

**Symptoms:** wrangler deploy returns an error.
**Causes and solutions:**

- Invalid wrangler.jsonc configuration: validate JSON syntax and binding names.
- Missing environment variables: check that all required secrets are set.
- Code syntax error: run pnpm typecheck and pnpm build locally first.
- D1/R2 binding mismatch: verify database ID and bucket name in wrangler.jsonc.

#### D1 database not found

**Symptoms:** Queries return D1_DATABASE_ID not found or binding error.
**Solutions:**

- Verify D1_DATABASE_ID matches the UUID from wrangler d1 create.
- Confirm the database name in wrangler.jsonc matches the actual database.
- Run wrangler d1 list to see all databases.

#### R2 bucket not accessible

**Symptoms:** R2 operations return 403 or 404.
**Solutions:**

- Verify bucket name matches R2_BUCKET and wrangler.jsonc.
- Check API token has R2 permissions.
- Confirm the bucket exists: wrangler r2 ls.

#### Web build fails

**Symptoms:** stro build fails or Pages deployment fails.
**Solutions:**

- Check Astro config for missing integrations.
- Verify outDir matches the Pages build output setting.
- Review build logs in Cloudflare Dashboard.

#### Environment variables not injected

**Symptoms:** Application reads undefined for expected variables.
**Solutions:**

- Confirm the variable is set in GitHub Actions secrets.
- Check wrangler.jsonc ars section for Worker-specific vars.
- For Pages, set variables in the Pages project settings.

#### Telegram webhook errors

**Symptoms:** Bot does not respond to messages.
**Solutions:**

- Verify webhook URL is publicly accessible.
- Check TELEGRAM_WEBHOOK_SECRET matches between setWebhook and Worker.
- Run getWebhookInfo to see the current state.

### Error Codes and Solutions

| Error | Meaning               | Solution                              |
| ----- | --------------------- | ------------------------------------- |
| 401   | Unauthorized          | Check API token and permissions       |
| 403   | Forbidden             | Verify scoped token permissions       |
| 404   | Not Found             | Check URL path and resource existence |
| 429   | Rate Limited          | Implement exponential backoff         |
| 500   | Internal Server Error | Check Worker logs for stack traces    |
| 502   | Bad Gateway           | Check upstream service availability   |
| 503   | Service Unavailable   | Check Cloudflare status page          |

### Contact Support

For deployment issues:

1. Check the troubleshooting guide above.
2. Review Cloudflare status at https://status.cloudflare.com.
3. Check GitHub Actions logs for the failed workflow run.
4. Gather relevant logs and error messages.
5. Contact the SEMBURAT team via the Telegram bot or email.

Include in your report:

- Cloudflare account ID
- Worker/Pages project name
- Error messages and timestamps
- Steps to reproduce
- Environment (staging/production)

## Rollback Procedure

### Code Rollback

1. Identify the previous successful deployment commit.
2. Create a revert commit:
   \\\ash
   git revert <failed-commit>
   git push origin main
   \\\
3. Or redeploy a previous tag:
   \\\ash
   git checkout v1.0.0
   pnpm deploy
   \\\

### Database Rollback

- Never assume code rollback automatically means database rollback is safe.
- Migrations must be backwards-compatible.
- To rollback a migration:
  1. Create a reverse migration file.
  2. Apply it in a maintenance window.
  3. Verify data integrity after rollback.

### Queue/Job Recovery

- Check publishing_jobs table for failed jobs.
- Retry failed jobs after fixing the root cause.
- Jobs are idempotent; retries are safe.

### Communication

- Notify the team via Telegram or Slack.
- Document the incident in the runbook.

## Cost Control

- Enable caching where possible.
- Deduplicate content and assets before processing.
- Use bounded polling and batched operations.
- Prefer smaller models for routine tasks.
- Require human approval before expensive media generation.
- Track AI and media generation usage monthly.
- Set budget alerts in Cloudflare.

## Production Checklist

Before declaring a deployment complete:

- [ ] Domain configured and DNS verified
- [ ] Workers deployed and health endpoint returns 200
- [ ] D1 database connected and migrations applied
- [ ] R2 bucket connected and accessible
- [ ] Secrets configured in deployment environment
- [ ] No debug credentials committed
- [ ] Scheduled jobs enabled and running
- [ ] Monitoring and alerts configured
- [ ] Backups/recovery tested
- [ ] Publishing credentials verified
- [ ] Telegram webhook registered
- [ ] Sitemap and RSS feed accessible
- [ ] Article pages return 200
- [ ] Smoke tests pass
- [ ] Documentation updated
