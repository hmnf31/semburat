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

## 4. Test Results

- 280 tests passed across 41 files
- Domain: 166 tests (18 files)
- Infra: 114 tests (23 files)
- Companion kit: 40 unit tests in `tests/` (PRD rules, design validation, render smoke)

## 5. Validation

- pnpm typecheck: PASS
- pnpm test: PASS (280 tests)
- pnpm lint: PASS (0 errors)
- pnpm format:check: PASS
- pnpm build: PASS (12 pages)
- companion kit tests: PASS (`python -m unittest discover -s tests -v`, run by the CI `python-tests` job)

## 6. What's NOT Done

- Web tests (TODO placeholder)
- Worker tests
- Actual Cloudflare deployment — covered by kit Phase B (`docs/02-checklist-deploy-staging.md`)
- Real API integration (OpenRouter, Telegram, MiniMax)
- Remotion video templates — kit provides example props only (`remotion/`)
- Actual video rendering
- Production monitoring setup — kit includes a `health-check.yml` workflow pattern
- Kit-external verification (requires your accounts/network): deploy to Cloudflare, GitHub workflow runs, Telegram bot, OpenRouter calls, real SEO/monetization results; free-tier limits and monetization terms must be checked with official sources

## 7. Next Steps

1. Follow the roadmap starting at `docs/00-SEMBURAT_ROADMAP_TEST_REVENUE.md`
2. Phase A: run local tests (`python -m unittest discover -s tests -v`) and the `docs/01` checklist
3. Phase B: deploy staging on Cloudflare per `docs/02`; copy `docs/templates/trend-discovery.workflow.yml` as the pattern for other scheduled workflows
4. Phase C: complete the release checklist (`docs/03`) and publish the 8 policy pages from `docs/pages/`
5. Phase D: run the soft launch playbook (`docs/04`) with the daily templates
6. Phase E: customize brand tokens, then render design templates with the `semburat-design` skill
7. Pass the go/no-go gates in `docs/05-go-no-go.md` before scaling; keep auto-publish off until Gate 3
8. Add web component tests, worker tests, real API keys, Remotion templates, production monitoring, and end-to-end tests

## 8. How to Run Locally

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
