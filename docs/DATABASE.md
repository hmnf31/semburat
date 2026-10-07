# SEMBURAT Database Design

Database target: Cloudflare D1 / SQLite-compatible schema.

## Core entities

### topics

Represents editorial categories.

Fields:

- id
- slug
- name
- description
- status
- created_at
- updated_at

### trends

Represents a candidate emerging topic.

Fields:

- id
- topic_id
- title
- normalized_key
- score
- velocity
- relevance
- freshness
- source_count
- status
- detected_at
- created_at
- updated_at

### sources

Represents source records.

Fields:

- id
- url
- domain
- title
- publisher
- published_at
- accessed_at
- source_type
- reliability_state
- license_state
- created_at

### facts

Represents extracted claims.

Fields:

- id
- article_id
- statement
- normalized_statement
- verification_status
- confidence
- created_at
- updated_at

### fact_evidence

Links claims to evidence.

Fields:

- fact_id
- source_id
- evidence_text
- evidence_location
- support_type
- confidence

### articles

Fields:

- id
- slug
- title
- dek
- summary
- body
- status
- risk_level
- quality_score
- published_at
- created_at
- updated_at

### article_versions

Immutable or append-only editorial versions.

Track:

- article_id
- version
- content
- author_type
- model
- provider
- created_at

### assets

Fields:

- id
- article_id
- type
- storage_key
- source_url
- hash
- creator
- license_state
- credit_text
- alt_text
- metadata_json
- created_at

### asset_licenses

Detailed license/provenance record.

### content_variants

Fields:

- id
- article_id
- platform
- format
- content
- asset_ids
- approval_state
- generation_metadata
- created_at

### publishing_jobs

Fields:

- id
- content_variant_id
- target
- scheduled_at
- status
- attempts
- last_error
- published_at

### analytics_events

Fields:

- id
- content_id
- event_type
- value
- metadata_json
- occurred_at

### audit_logs

Track important state transitions and operator actions.

## Data rules

- Use UTC timestamps internally.
- Use stable IDs.
- Normalize URLs.
- Index lookup keys.
- Do not delete provenance records just because content is unpublished.
- Keep audit trails for important editorial changes.

## State machines

Prefer explicit states over boolean flags.

Example article states:

`draft -> researching -> verified -> editorial_review -> approved -> published -> archived`

A rejected item can return to an earlier state only through an explicit transition.
