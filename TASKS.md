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
- [ ] TASK-215 Fill `site-config.ts` with operator identity, emails and policy dates (owner task)
- [ ] TASK-216 Affiliate and sponsored-content labels
- [ ] TASK-217 Enable R2 and re-deploy production worker
- [x] TASK-218 Centralize operator data in `apps/web/src/data/site-config.ts` (values to be filled by owner)
- [x] TASK-219 Add `/categories` index page and fix header nav link

## Kilo execution rule

Kilo should normally work on one coherent task or small dependency group at a time.

Before coding a task:

1. Read its related PRD section.
2. Inspect existing implementation.
3. State files/modules affected.
4. Implement.
5. Test.
6. Update this file.
