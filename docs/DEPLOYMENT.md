# SEMBURAT Deployment

## Preferred architecture

- Astro / Cloudflare Pages for web
- Cloudflare Workers for API/edge logic
- Cloudflare D1 for database
- Cloudflare R2 for media
- GitHub Actions for scheduled/background processing
- OpenRouter for hosted AI
- Ollama as optional local AI
- Telegram Bot for control
- Google Sheets for operational data where required

## Environment categories

### Public

Safe browser-visible configuration.

### Server secrets

Examples:

- AI API keys
- Telegram token
- provider credentials
- webhook secrets

Never expose server secrets to frontend bundles.

## Development

Required local tooling should be documented in the repository.

Typical flow:

```bash
install
dev
test
lint
typecheck
build
```

Exact commands should match the actual package manager/project.

## Database migrations

Never manually alter production schema without a migration.

Migration process:

1. create migration
2. test locally
3. validate backwards compatibility where needed
4. apply
5. verify

## R2/media

Use deterministic storage keys.

Example:

```text
assets/{asset_id}/{variant}.{ext}
```

Do not store large binary data in D1.

## GitHub Actions

Use scheduled jobs for:

- trend discovery
- research queue
- analytics aggregation
- maintenance

Jobs must be:

- idempotent
- retryable
- timeout-bounded

## Deployment safety

Before deployment:

- tests pass
- typecheck passes
- build passes
- migrations reviewed
- environment variables checked
- secrets present in deployment environment
- no debug credentials committed

## Rollback

Maintain:

- previous deployment version
- migration rollback/forward strategy
- queue/job recovery instructions

Do not assume code rollback automatically means database rollback is safe.

## Cost control

Prefer:

- caching
- deduplication
- bounded polling
- batched operations
- smaller models for routine tasks
- human approval before expensive media generation

Track AI and media generation usage.

## Production checklist

- [ ] domain configured
- [ ] DNS verified
- [ ] Workers deployed
- [ ] D1 connected
- [ ] R2 connected if needed
- [ ] secrets configured
- [ ] scheduled jobs enabled
- [ ] monitoring/alerts configured
- [ ] backups/recovery tested
- [ ] publishing credentials verified
