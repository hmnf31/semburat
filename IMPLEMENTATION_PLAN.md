# SEMBURAT Implementation Plan

## Tujuan

Dokumen ini menerjemahkan PRD menjadi urutan implementasi teknis yang dapat dikerjakan Kilo secara bertahap.

PRD menjawab **apa dan mengapa**.
Implementation plan menjawab **bagaimana dan urutannya**.

## Aturan implementasi

- Jangan membangun semua modul sekaligus.
- Setiap fase harus menghasilkan increment yang dapat diuji.
- Core domain harus tetap provider-agnostic.
- Otomasi publikasi penuh dilakukan setelah quality gate dan provenance stabil.
- Integrasi berisiko dibuat melalui adapter.
- Gunakan mock/fake provider untuk test.

---

# Phase 0 — Repository Foundation

### Output

- repository structure
- package/workspace setup
- environment configuration
- linting
- formatting
- testing
- CI baseline
- logging baseline

### Acceptance

- project dapat di-install dari clean checkout
- test suite dapat dijalankan
- build utama berhasil
- secret tidak berada di repository

---

# Phase 1 — Domain Model & Database

Implement:

- articles
- article_versions
- sources
- source_snapshots/metadata
- facts
- fact_evidence
- topics
- trends
- trend_scores
- assets
- asset_licenses
- content_variants
- publishing_jobs
- publishing_targets
- analytics_events
- audit_logs

### Acceptance

- migrations repeatable
- indexes untuk query utama
- timestamps konsisten
- status transitions tervalidasi

---

# Phase 2 — Editorial Core

Implement domain services:

`Trend -> Research -> Facts -> Verification -> Editorial -> Quality`

Pisahkan:

- domain
- application services
- infrastructure adapters

### Acceptance

Satu artikel dapat diproses melalui pipeline menggunakan mock providers tanpa internet.

---

# Phase 3 — Web Platform

Stack:

- Astro
- Tailwind
- Cloudflare Pages/Workers deployment model
- SEO metadata
- canonical URLs
- sitemap
- RSS
- structured data

### Acceptance

- homepage
- topic page
- article page
- author/source attribution
- responsive layout
- semantic HTML
- metadata valid

---

# Phase 4 — Trend Discovery

Sources dapat berkembang melalui adapters:

- search/news feeds
- RSS
- public trend signals
- approved APIs
- manually submitted leads

Pipeline:

`collect -> normalize -> deduplicate -> score -> rank`

### Acceptance

Sistem menghasilkan ranked trend candidates dengan evidence metadata.

---

# Phase 5 — Research & Source Intelligence

Implement:

- source collection
- source normalization
- extraction
- timestamps
- source reliability metadata
- duplicate detection
- evidence linking

### Acceptance

Setiap material claim memiliki evidence reference atau ditandai unsupported.

---

# Phase 6 — Fact Verification

Implement:

- claim extraction
- evidence matching
- conflict detection
- confidence score
- verification status
- human review queue

Statuses minimal:

- unverified
- partially_verified
- verified
- contradicted
- needs_review

### Acceptance

Sistem menolak publish ketika required facts gagal quality gate.

---

# Phase 7 — Editorial AI

Implement structured generation untuk:

- headline
- dek
- body
- summary
- key points
- FAQ
- social variants

AI output harus menerima source evidence sebagai context.

### Acceptance

Tidak ada publishable article tanpa source/evidence metadata.

---

# Phase 8 — Quality & Safety Gate

Quality dimensions:

- factual support
- source completeness
- editorial clarity
- duplication
- SEO
- language
- risk

High-risk content diarahkan ke human review.

---

# Phase 9 — Asset Intelligence

Implement:

- asset registry
- source URL
- creator/owner
- license
- credit
- usage restrictions
- hash/deduplication
- transformation history

### Acceptance

Tidak ada asset publik tanpa provenance state.

---

# Phase 10 — Content Repurposing

Satu Article ID dapat menghasilkan:

- WEB
- IG Feed
- IG Story
- IG Carousel
- Facebook
- X
- Threads
- Telegram
- Reel
- Short

Setiap variant memiliki:

- content ID
- platform
- format
- generation metadata
- approval state

---

# Phase 11 — Remotion Media Pipeline

Template awal:

- breaking news
- explainer
- top 5
- comparison
- gaming update
- tech update
- quote card
- timeline
- data story

Pipeline:

`article -> script -> assets -> timeline -> render -> QC -> publish`

Gunakan provider interface untuk voice/SFX.

---

# Phase 12 — Distribution

Mulai dari manual approval + queue.

Kemudian:

- Telegram
- supported social APIs
- web publishing

Platform-specific API integration harus berupa adapter.

Jangan hardcode provider logic di domain.

---

# Phase 13 — Analytics

Collect:

- impressions
- clicks
- engagement
- watch time
- CTR
- source performance
- topic performance
- article performance
- revenue attribution

North Star:

**Revenue per 1,000 qualified visitors**

---

# Phase 14 — Monetization

Prioritas:

1. affiliate
2. ads
3. sponsored content
4. newsletter sponsorship
5. lead generation
6. digital products
7. future B2B trend intelligence/API

---

# Phase 15 — Optimization

Setelah data nyata tersedia:

- topic ranking
- headline optimization
- distribution timing
- content format selection
- recommendation
- newsletter personalization
- monetization optimization

---

# Deployment strategy

Preferred low-cost stack:

- Cloudflare Workers
- Cloudflare D1
- Cloudflare R2
- Cloudflare Pages
- GitHub Actions
- OpenRouter
- optional Ollama
- Telegram
- Google Sheets where operationally required

Infrastructure should be replaceable through adapters.

## Milestone rule

Jangan melompat ke Phase 10+ jika Phase 2–9 belum memiliki data/provenance/quality foundation yang cukup.

## Final milestone

SEMBURAT dianggap production-capable ketika:

- editorial pipeline stabil
- source/evidence traceable
- asset provenance enforced
- website SEO-ready
- publishing queue reliable
- observability tersedia
- tests pass
- deployment repeatable
- human review tersedia untuk high-risk cases
