# SEMBURAT API Specification

## Principles

- REST/JSON for initial public/internal API.
- Authentication required for administrative operations.
- Stable version prefix.
- Validate request payloads.
- Return structured errors.
- Use idempotency keys for retryable creation/publish operations.

## Suggested endpoints

### Health

`GET /api/health`

Returns service health and version.

### Trends

`GET /api/trends`

Query:

- topic
- status
- min_score
- limit
- cursor

`POST /api/trends`

Create/import a trend candidate.

### Research

`POST /api/research/jobs`

Start research job.

`GET /api/research/jobs/:id`

Get status.

### Articles

`GET /api/articles/:slug`

Public article.

`POST /api/articles`

Create draft.

`PATCH /api/articles/:id`

Update editorial data.

### Verification

`POST /api/articles/:id/verify`

Run verification.

`GET /api/articles/:id/facts`

List claims and evidence.

### Assets

`POST /api/assets`

Register asset.

`GET /api/assets/:id`

Get provenance.

### Variants

`POST /api/articles/:id/variants`

Generate platform variants.

`GET /api/articles/:id/variants`

List variants.

### Publishing

`POST /api/publishing/jobs`

Queue publishing.

`GET /api/publishing/jobs/:id`

Status.

### Analytics

`POST /api/analytics/events`

Ingest event.

## Error shape

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request",
    "details": []
  }
}
```

Never expose:

- API keys
- internal stack traces
- provider secrets
- private source credentials

## Authentication

Use an explicit authentication middleware.

Do not put authorization logic inside individual handlers when it can be centralized.

## Webhooks

Verify signatures before processing provider webhooks.

Persist webhook event IDs for idempotency.

## Versioning

Prefer additive changes.

Breaking changes require a version bump and migration plan.
