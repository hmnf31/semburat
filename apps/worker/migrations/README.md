# D1 Migrations

This directory contains SQL migration files for the SEMBURAT Worker's Cloudflare D1 database.

## Migration Strategy

Migrations are versioned SQL files stored in this directory. Each file follows the naming
convention:

```
<number>_<description>.sql
```

Example:

```
001_create_articles_table.sql
002_add_source_metadata_columns.sql
```

Files are applied in lexical order (the leading number ensures correct ordering).

## Applying Migrations

### Local Development

Apply migrations to a local D1 database (Miniflare) or a remote D1 instance:

```bash
# Local D1 (used by `wrangler dev`)
cd apps/worker
wrangler d1 execute semburat-db --local --file=migrations/001_create_articles_table.sql

# Remote D1
wrangler d1 execute semburat-db --remote --file=migrations/001_create_articles_table.sql
```

Apply all pending migrations at once:

```bash
for f in migrations/*.sql; do
  wrangler d1 execute semburat-db --remote --file="$f"
done
```

### CI/CD

The `deploy.yml` GitHub Actions workflow runs migrations before deploying to staging or
production. The D1 database ID for each environment is injected via a Cloudflare Worker
secret (`db-id-prod` for production, `db-id-staging` for staging), resolved from the
`@cf/db-id-*` references in `wrangler.jsonc`.

## Environment Databases

| Environment | Database Name       | Secret Reference    |
| ----------- | ------------------- | ------------------- |
| Development | semburat-db         | `@cf/db-id`         |
| Staging     | semburat-db-staging | `@cf/db-id-staging` |
| Production  | semburat-db         | `@cf/db-id-prod`    |

## Best Practices

- Keep migrations small and focused on a single concern.
- Write reversible migrations when possible; include rollback statements in
  comments.
- Back up the database before running destructive migrations in production.
- Never modify a migration file that has already been applied to a shared
  environment.
- Review migration files in code review before merging.
