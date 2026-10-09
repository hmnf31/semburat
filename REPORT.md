# SEMBURAT — Project Report

## 1. Executive Summary

SEMBURAT is an Indonesian automated media/content intelligence platform. The repository contains a complete implementation spanning 15 phases (0-14) and 115 tasks. All tasks are marked complete in TASKS.md. The project uses pnpm workspace with Turbo, Cloudflare Workers/D1/R2, Astro+Tailwind for the web frontend, OpenRouter for AI abstraction, and Telegram for operational control.

## 2. Architecture

- Domain: 9 entities, 4 value objects, 13 ports, 7 domain services — fully provider-agnostic
- Infrastructure: 13 D1 repositories, 16 adapters, 18 application services
- Web: 12 static Astro pages with SEO, structured data, sitemap, RSS
- Tests: 280 tests across 41 files
- CI/CD: 4 GitHub Actions workflows
- Docs: 15 documentation files

## 2.5 Companion Kit (deduplicated)

The former `semburat-kit/` directory was a byte-identical copy of material that already lives at the repository root. It has been removed to avoid maintaining two copies of the same files. Canonical locations:

- `docs/` — 8 roadmap/checklist docs (01–08): local test checklist, staging deploy checklist, release checklist, soft-launch playbook, go/no-go gates, revenue simulation, 14-day plan, PRD analysis findings; plus `docs/templates/` (test logs, article review, daily/weekly logs, incident, correction) and `docs/templates/trend-discovery.workflow.yml` (safe scheduled-job pattern to copy)
- `docs/pages/` — 8 policy page drafts: about, editorial policy, correction policy, source policy, AI policy, privacy, terms, contact
- `packages/brand/` — brand tokens (`tokens.json` → `tokens.css`) plus `brand.config.json` and `build_tokens.py`
- `.kilo/skills/semburat-design/` — design skill with HTML templates (`og-hero`, `x-post`, `fact-card`, `story-cover`, `carousel`), render script, validator, evals, and `semburat-design.skill`
- `tests/` — 40 unit tests (PRD rules, design validation, render smoke), run by the `python-tests` job in `.github/workflows/ci.yml`
- `tools/revenue_simulator.py` — 24-month revenue simulation across 3 scenarios with editable assumptions
- `remotion/` — video props example (`props.example.json`) and notes
- `config/` — model routing example (`model-routing.example.json`)
- **Usage phases:** A = local tests (`python -m unittest discover -s tests -v`), B = staging deploy on Cloudflare, C = release checklist (publish the `docs/pages/` drafts), D = soft launch (daily rhythm with `docs/templates/`), E = design templates and the design skill, followed by go/no-go decision gates (`docs/05-go-no-go.md`).
- **Key entry point:** `docs/00-SEMBURAT_ROADMAP_TEST_REVENUE.md` — read it first, then `docs/08-temuan-analisis-prd.md` for PRD decisions to make.

## 3. Phases Completed

- Phase 0: Repository Foundation (pnpm workspace, Turbo, lint/format/test/CI)
- Phase 1: Domain Model & Database (D1 schema, entities, migrations)
- Phase 2: Editorial Core (application services, repositories, mock providers)
- Phase 3: Web Platform (Astro + Tailwind, SEO, responsive)
- Phase 4: Trend Discovery (normalization, deduplication, scoring, ranking)
- Phase 5: Research & Source Intelligence
- Phase 6: Fact Verification
- Phase 7: Editorial AI
- Phase 8: Quality & Safety Gate
- Phase 9: Asset Intelligence
- Phase 10: Content Repurposing
- Phase 11: Remotion Media Pipeline
- Phase 12: Distribution
- Phase 13: Analytics
- Phase 14: Monetization
- Research ingestion uses live Google News RSS feeds; set `RESEARCH_MODE=offline` to disable network access (used by tests)
- The web app reads published articles/trends from the worker API at build time (`PUBLIC_API_BASE_URL`), falling back to bundled fixtures when the API is unreachable

## 4. Test Results

- 411 tests passed across 55 files
- Domain: 166 tests (18 files)
- Infra: 222 tests (34 files)
- Worker: 23 tests (3 files)
- Companion kit: 40 unit tests in `tests/` (PRD rules, design validation, render smoke)

## 5. Validation

- pnpm typecheck: PASS
- pnpm test: PASS (411 tests)
- pnpm lint: PASS (0 errors)
- pnpm format:check: PASS
- pnpm build: PASS (24 pages)
- companion kit tests: PASS (`python -m unittest discover -s tests -v`, run by the CI `python-tests` job)

## 6. What's NOT Done

- Web tests (TODO placeholder) — the static site builds against the worker API with fixture fallback, but has no unit tests yet
- Policy pages (privacy, terms, editorial, correction) still contain `[TANGGAL]` / `[NAMA/BADAN]` placeholders that require the publisher's legal details
- Actual Cloudflare deployment — covered by kit Phase B (`docs/02-checklist-deploy-staging.md`)
- AI provider integration (OpenRouter, MiniMax) — adapters exist, keys not configured
- Telegram bot wiring is implemented; live bot requires `TELEGRAM_BOT_TOKEN`
- Remotion video templates — kit provides example props only (`remotion/`)
- Actual video rendering
- Production monitoring setup — kit includes a `health-check.yml` workflow pattern
- Kit-external verification (requires your accounts/network): deploy to Cloudflare, GitHub workflow runs, Telegram bot, OpenRouter calls, real SEO/monetization results; free-tier limits and monetization terms must be checked with official sources

## 7. Cloudflare Deployment

- Staging worker: https://semburat-worker-staging.theahuda.workers.dev (D1 `semburat-db-staging`)
- Production worker: https://semburat-worker-production.theahuda.workers.dev (D1 `semburat-db`)
- Web (Cloudflare Pages): https://semburat-web.pages.dev (production + preview)
- Migrations `0001`/`0002` applied to both D1 databases
- Public endpoints live: `/`, `/api/health`, `/api/articles`, `/api/trends`
- Pipeline endpoints require `TELEGRAM_WEBHOOK_SECRET`; `OPENROUTER_API_KEY` unset so `aiMode=mock`
- R2 not enabled on the account yet; the `ASSETS` binding is commented out until it is
- Web build takes `PUBLIC_SITE_URL` and `PUBLIC_API_BASE_URL` at build time
- Source repo: https://github.com/hmnf31/semburat

### Tahap C — kesiapan rilis (Seo teknis)

- `robots.txt`, `favicon.svg`, `og-image.svg` ditambahkan
- URL situs dipusatkan di `src/lib/site.ts` (dari `PUBLIC_SITE_URL`)
- Structured data `WebSite` + `Organization` (semua halaman) dan `Article` + `BreadcrumbList` (artikel)
- Label "Diperbarui" tampil bila `updated_at` berbeda; pernyataan transparansi AI di footer
- Sisa: label afiliasi dan konten sponsor (TASK-216, TASK-217)

### Tahap D — soft launch (awal)

- Bot Telegram `@SemburatId_bot` aktif: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_WEBHOOK_SECRET`, `TELEGRAM_ALLOWED_USER_IDS` terpasang di production dan staging; webhook terdaftar di production worker
- 10 artikel pertama terbit, menggantikan seluruh fixture contoh: 2 viral, 3 teknologi, 3 gaming, 2 explainer
- Struktur konten dipisah per artikel di `apps/web/src/data/articles/`, dikomposisikan lewat `apps/web/src/data/soft-launch-articles.ts`
- Setiap artikel memakai sumber nyata yang dapat dicek (BI, JDIH BPK, CISA, Apple/Google, Science/MIT, dsb.) dan visual SEMBURAT sendiri, tanpa klaim/angka rekaan
- Deploy Pages production harus memakai `--branch main` (cabang produksi proyek `semburat-web`), staging memakai `--branch staging`
- Gambar artikel: 9 dari 10 artikel memakai foto/diagram asli berlisensi bebas dari Wikimedia Commons (PD, CC BY, CC BY-SA) dengan kredit + tautan sumber di "Kredit Visual" dan watermark SEMBURAT di pojok kanan bawah; artikel PSE tetap memakai ilustrasi SEMBURAT karena tidak ada gambar bebas yang relevan
- Kartu artikel (beranda, kategori, terkait) kini menampilkan thumbnail dari gambar sumber atau ilustrasi kategori, juga diberi watermark

### Tahap E — template desain & OG

- Identitas brand diselaraskan dengan situs tayang ("Warm Editorial Minimalism"): latar kertas hangat, aksen terakota, judul serif Newsreader, isi Plus Jakarta Sans
- `packages/brand/tokens.json` diperbarui; `build_tokens.py` kini menulis ke `.kilo/skills/semburat-design/assets/` dan menyalin `tokens.json` apa adanya; ditambah set logo (`packages/brand/logo/{icon,icon-inverse,wordmark,wordmark-inverse}.svg`)
- Skill `semburat-design` di-recolor ke tema terang editorial (`_base.css` + 7 template); `SKILL.md` dan `references/` diperbarui; validator lolos untuk og-hero, fact-card, carousel
- Render PNG terverifikasi dengan Playwright/Chromium; dibuat 10 OG hero 1200x630 (foto sumber + identitas editorial) di `apps/web/public/og/` dan dipasang sebagai `og:image`/`twitter:image` + gambar JSON-LD per artikel

### Uji alur konten generator (dry-run lokal)

- Dijalankan lokal via `wrangler dev` + D1 lokal (migrasi diterapkan), autentikasi `/api/pipeline/*` dengan `TELEGRAM_WEBHOOK_SECRET` dari `apps/worker/.dev.vars` (kini masuk `.gitignore`); `aiMode=mock`
- `POST /api/pipeline/discover` menghasilkan 12 tren dari Google News RSS + Trends nyata (tanpa kredensial AI)
- `POST /api/pipeline/process-batch` menjalankan alur penuh: riset → ekstraksi fakta → verifikasi → editorial → quality gate; kedua artikel berakhir `needs_research`, skor 70 (gate benar menolak: sumber < 3 dan body < 500 karakter)
- Bug nyata ditemukan & diperbaiki saat dry-run ini: (1) bind `undefined` ke D1 pada tanggal (`toISO`), (2) `MockAIProvider` tidak menghasilkan keluaran sesuai skema pipeline, (3) `fact_evidence.source_id` melanggar FK karena id sumber dari AI tidak diresolusi (TASK-227), (4) artikel draft gagal tidak pernah di-retry (TASK-228)
- Perbaikan provenance (TASK-227): `FactExtractionService` meresolusi referensi sumber dari AI ke `sources.id` nyata (berdasarkan id, URL persis, atau domain); bukti yang tak dapat diresolusi dibuang, bukan dipaksakan ke FK
- Perbaikan retry (TASK-228): `processTrend` hanya mengembalikan artikel berstatus settled dan memproses ulang artikel `draft`/`researching` sisa run gagal, membersihkan fakta & bukti lama terlebih dahulu
- Dry-run ulang end-to-end lolos tanpa error FK; kedua artikel kembali berakhir `needs_research` (skor 70) sesuai ekspektasi mode mock

## 8. Next Steps

1. Follow the roadmap starting at `docs/00-SEMBURAT_ROADMAP_TEST_REVENUE.md`
2. Phase A: run local tests (`python -m unittest discover -s tests -v`) and the `docs/01` checklist
3. Phase B: deploy staging on Cloudflare per `docs/02`; copy `docs/templates/trend-discovery.workflow.yml` as the pattern for other scheduled workflows
4. Phase C: complete the release checklist (`docs/03`) and publish the 8 policy pages from `docs/pages/`
5. Phase D: run the soft launch playbook (`docs/04`) with the daily templates
6. Phase E: brand tokens & templates selaras (TASK-223/224); sisa: paket sosial otomatis (x-post, carousel, fact-card, story) per artikel
7. Pass the go/no-go gates in `docs/05-go-no-go.md` before scaling; keep auto-publish off until Gate 3
8. Add web component tests, worker tests, real API keys, Remotion templates, production monitoring, and end-to-end tests

## 9. How to Run Locally

```bash
pnpm install
cd apps/web && pnpm dev --host --port 4321
pnpm test
pnpm build
```

Companion kit content (zero-rupiah test/deploy/launch path) lives at the repository root:

```bash
python -m unittest discover -s tests -v
python tools/revenue_simulator.py
```
