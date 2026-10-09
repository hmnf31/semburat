# SEMBURAT Task Board

Status:

- [ ] belum dikerjakan
- [-] sedang dikerjakan
- [x] selesai
- [!] blocked/review

## Foundation

- [x] TASK-001 Bootstrap repository
- [x] TASK-002 Configure package/workspace structure
- [x] TASK-003 Add environment configuration
- [x] TASK-004 Add lint/format/typecheck/test
- [x] TASK-005 Add CI
- [x] TASK-006 Add structured logging

## Database

- [x] TASK-010 Create initial D1 schema
- [x] TASK-011 Add migration system
- [x] TASK-012 Implement source model
- [x] TASK-013 Implement trend model
- [x] TASK-014 Implement article model
- [x] TASK-015 Implement fact/evidence model
- [x] TASK-016 Implement asset/license model
- [x] TASK-017 Implement publishing model
- [x] TASK-018 Implement analytics/audit model

## Editorial

- [x] TASK-020 Create domain entities
- [x] TASK-021 Create provider interfaces
- [x] TASK-022 Implement research pipeline
- [x] TASK-023 Implement fact extraction
- [x] TASK-024 Implement verification
- [x] TASK-025 Implement editorial generation
- [x] TASK-026 Implement quality gate
- [x] TASK-027 Implement human review queue

## Web

- [x] TASK-030 Bootstrap Astro
- [x] TASK-031 Build homepage
- [x] TASK-032 Build topic pages
- [x] TASK-033 Build article page
- [x] TASK-034 Add SEO metadata
- [x] TASK-035 Add sitemap/RSS
- [x] TASK-036 Add structured data
- [x] TASK-037 Integrate policy pages from semburat-kit

## Trend intelligence

- [x] TASK-040 Source adapters
- [x] TASK-041 Normalize trend candidates
- [x] TASK-042 Deduplicate trends
- [x] TASK-043 Trend scoring
- [x] TASK-044 Trend ranking
- [x] TASK-045 Trend dashboard

## Asset intelligence

- [x] TASK-050 Asset registry
- [x] TASK-051 License/provenance validation
- [x] TASK-052 Asset deduplication
- [x] TASK-053 Image transformation pipeline
- [x] TASK-054 Generated image adapter

## Repurposing

- [x] TASK-060 Variant model
- [x] TASK-061 Social copy generation
- [x] TASK-062 Carousel/story generation
- [x] TASK-063 Telegram variant
- [x] TASK-064 Short/reel script generation

## Media

- [x] TASK-070 Remotion project
- [x] TASK-071 Template system
- [x] TASK-072 Asset-to-timeline pipeline
- [x] TASK-073 MiniMax voice adapter
- [x] TASK-074 SFX adapter
- [x] TASK-075 Render queue
- [x] TASK-076 Media QC

## Distribution

- [x] TASK-080 Publishing queue
- [x] TASK-081 Telegram publisher
- [x] TASK-082 Web publisher
- [x] TASK-083 Social adapter interface
- [x] TASK-084 Approval workflow

## Analytics

- [x] TASK-090 Event ingestion
- [x] TASK-091 Content performance metrics
- [x] TASK-092 Topic performance
- [x] TASK-093 Revenue attribution

## Monetization

- [x] TASK-100 Affiliate metadata
- [x] TASK-101 Sponsored content metadata
- [x] TASK-102 Newsletter sponsorship
- [x] TASK-103 Lead generation
- [x] TASK-104 Revenue dashboard

## Operational

- [x] TASK-110 Secrets management
- [x] TASK-111 Error alerting
- [x] TASK-112 Backup/recovery procedure
- [x] TASK-113 Deployment documentation
- [x] TASK-114 Production runbook

- [x] TASK-114 Production runbook

## Delivery sprint

- [x] TASK-200 Repo cleanup and CI hardening
- [x] TASK-201 Worker composition root, pipeline API and Telegram control plane
- [x] TASK-202 Real research sources (Google News RSS) with offline mode
- [x] TASK-203 Source statistics via SourceRepository.findAll
- [x] TASK-204 Web ↔ API integration with fixture fallback
- [x] TASK-205 Public article list/detail endpoints (published only)
- [x] TASK-206 Env/docs refresh (RESEARCH_MODE, RSS_FEEDS, PUBLIC_API_BASE_URL)
- [x] TASK-210 Deploy staging + production (D1, Worker, Pages) and GitHub remote
- [x] TASK-211 Centralize PUBLIC_SITE_URL (lib/site.ts) across SEO/schema/RSS/sitemap
- [x] TASK-212 Add robots.txt, favicon, default OG image
- [x] TASK-213 Structured data (WebSite, Organization, Article, BreadcrumbList)
- [x] TASK-214 Footer policy links + AI transparency statement
- [x] TASK-215 Fill `site-config.ts` with operator identity, emails and policy dates (owner task)
- [~] TASK-216 Affiliate and sponsored-content labels — ditunda sampai ada konten berbayar/afiliasi pertama (metadata TASK-100/101 dan kebijakan sudah siap; TASK-217 sudah menyediakan label)
- [x] TASK-217 Enable asset storage and re-deploy production worker (Cloudflare R2 requires a payment method, so Cloudflare KV is used instead)
- [x] TASK-218 Centralize operator data in `apps/web/src/data/site-config.ts` (values to be filled by owner)
- [x] TASK-219 Add `/categories` index page and fix header nav link
- [x] TASK-220 Configure Telegram bot secrets, webhook and sender allow-list (production + staging)
- [x] TASK-221 Publish the first 10 real soft-launch articles (researched sources, one module per article)
- [x] TASK-222 Use freely licensed source images for 9 of the 10 articles (Wikimedia Commons, credits recorded) with SEMBURAT watermark, plus thumbnails on article cards
- [x] TASK-223 Align `packages/brand` tokens + `semburat-design` skill with the shipped "Warm Editorial Minimalism" identity (light surface, terracotta accent, Newsreader/Plus Jakarta Sans); regenerate tokens, recolor templates, add logo set
- [x] TASK-224 Render per-article OG hero images (1200x630) from source photos and wire `og:image`/JSON-LD image per article
- [x] TASK-225 Fix D1 date binding: `toISO` returns `null` (not `undefined`) so pipeline/trend/source writes persist
- [x] TASK-226 Make `MockAIProvider` schema-aware so the content pipeline runs end-to-end in offline/mock mode (with unit tests)
- [x] TASK-227 Resolve AI-provided fact-evidence source identifiers to real `sources.id` before insert (by id, URL, or domain); unresolved evidence is dropped instead of violating the FK
- [x] TASK-228 Retry stale articles: `processTrend` only short-circuits on settled statuses and reprocesses leftover `draft`/`researching` articles, clearing their stale facts and evidence first
- [x] TASK-229 Add a generic OpenAI-compatible AI adapter so free LLM providers (Groq, Gemini, Mistral, Cerebras, ...) can be configured via `AI_PROVIDER`/`AI_BASE_URL`/`AI_API_KEY`/`AI_MODEL`, taking precedence over OpenRouter with mock fallback
- [x] TASK-230 Build the per-article social pack pipeline (`tools/export_articles.ts` + `tools/social_pack.py`): derive og-hero, x-post, fact-card, story-cover and carousel content from article data, validate against the design skill rules, render PNGs and write ready-to-post captions
- [x] TASK-231 Add `social:pack`/`articles:export` scripts, `tests/test_social_pack.py`, fix the `test_render_smoke.py` skill path bug, and document the workflow in `docs/SOCIAL_PACK.md`
- [x] TASK-232 Add `tools/telegram_send.py` and `social:send`/`social:review` scripts so each generated social pack can be reviewed in Telegram before distribution
- [x] TASK-233 Expand trend discovery beyond Google Search: parse publisher provenance from Google News `<source>` blocks, add a Reddit public-JSON trend adapter (viral + gaming subreddits), curate gaming/esports RSS feeds and add MLBB/GTA 6 to the default queries
- [x] TASK-234 Add image sourcing adapters (Openverse CC/PD, Wikimedia Commons) plus a restricted fan-art adapter (DeviantArt RSS), an `ImageSourcingService` with license/credit annotation, and `POST /api/pipeline/images`
- [x] TASK-235 Extend the design validation rules with `fan_art`/`needs_permission` image types that always require credit
- [x] TASK-236 Add a `KvStorageProvider` (Cloudflare KV, free without a card, 25 MiB/value) behind the `StorageProvider` interface, wire the `ASSETS` KV binding for staging/production, and serve stored assets publicly at `GET /media/*` via `ASSETS_PUBLIC_BASE_URL`
- [x] TASK-237 Persist sourced images into the asset registry: `ImageIngestionService` downloads publishable candidates, stores the bytes in KV and records them in `assets` with license/credit/source provenance; endpoints `POST /api/pipeline/assets` and `GET /api/assets?articleId=`
- [x] TASK-238 Auto-attach hero asset: `Article.withHeroAsset()`, optional `setAsHero` on `ImageIngestionService.ingest`/`POST /api/pipeline/assets` sets the first ingested asset as `articles.hero_asset_id`

## Kilo execution rule

Kilo should normally work on one coherent task or small dependency group at a time.

Before coding a task:

1. Read its related PRD section.
2. Inspect existing implementation.
3. State files/modules affected.
4. Implement.
5. Test.
6. Update this file.
