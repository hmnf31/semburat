# D1 Migrations

Canonical SQL migrations for the SEMBURAT Cloudflare D1 database.

`apps/worker/wrangler.jsonc` points every environment at this directory via
`migrations_dir`, so there is exactly one copy of the schema.

## Files

| File                   | Contents                                                                                                                                                                                                |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `0001_initial.sql`     | All tables and indexes (topics, trends, sources, research, articles, facts, fact_evidence, assets, asset_licenses, content_variants, publishing_jobs, publishing_targets, analytics_events, audit_logs) |
| `0002_add_indexes.sql` | Additional query indexes                                                                                                                                                                                |

Files are applied in lexical order by Wrangler and tracked in the `d1_migrations` table.

## Applying migrations

```bash
cd apps/worker

# Local database used by `wrangler dev`
wrangler d1 migrations apply semburat-db --local

# Staging / production (remote)
wrangler d1 migrations apply semburat-db-staging --env staging
wrangler d1 migrations apply semburat-db --env production
```

The `deploy.yml` workflow runs `wrangler d1 migrations apply` for the target
environment before `wrangler deploy`.

## Rules

- Never edit a migration that has already been applied to a shared environment; add a new file instead.
- Keep each migration focused on one concern and include rollback statements as SQL comments.
- Back up with `scripts/backup-d1.sh` before destructive production migrations.
- The TypeScript string copies under `packages/db/src/schema/` are for reference/tests only and are not applied by Wrangler.
