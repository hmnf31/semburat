# SEMBURAT Architecture

## High-level flow

```text
Trend Sources
    |
    v
Trend Discovery
    |
    v
Trend Scoring
    |
    v
Research / Source Collection
    |
    v
Fact Extraction
    |
    v
Verification
    |
    v
Editorial AI
    |
    v
Quality / Safety Gate
    |
    +----> Human Review
    |
    v
Article
    |
    +----> SEO Web
    +----> Social Variants
    +----> Telegram
    +----> Remotion Media
    +----> Newsletter
    |
    v
Analytics
    |
    v
Feedback / Optimization
```

## Infrastructure

```text
Astro Web
   |
Cloudflare
   +-- Workers
   +-- D1
   +-- R2
   +-- Pages
          |
          v
     Core API / Domain

GitHub Actions
   |
Python Workers / scheduled jobs
   |
Provider adapters
   +-- AI
   +-- research
   +-- media
   +-- publishing

Telegram
   |
Control / Approval Interface
```

## Layering

### Domain

Business concepts without Cloudflare/OpenRouter/Telegram-specific code.

### Application

Use cases and workflows.

### Infrastructure

Adapters for:

- D1
- R2
- Workers
- AI providers
- search/source providers
- social APIs
- MiniMax
- Telegram
- Google Sheets

### Presentation

- Astro pages
- API routes
- Telegram commands

## Provider abstraction

Example conceptual interfaces:

```text
AIProvider
ResearchProvider
StorageProvider
ImageProvider
VoiceProvider
SoundEffectProvider
Publisher
AnalyticsProvider
```

Each provider returns normalized domain/application data.

## Reliability

Jobs should be:

- idempotent
- retryable
- observable
- bounded

Every asynchronous job should have a status and correlation ID.

## Security boundaries

Secrets remain in environment/secret storage.

External content is untrusted input.

HTML, URLs, media metadata, and AI output must be validated before use.

## Scalability

Do not prematurely distribute everything.

Start simple:

- Worker API
- D1
- R2
- scheduled GitHub Actions

Introduce queues/workers only when measured workload requires them.
