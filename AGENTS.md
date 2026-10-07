# SEMBURAT — Kilo AI Coding Instructions

## 1. Project identity

SEMBURAT is an Indonesian automated media/content intelligence platform.

Positioning:

> Yang sedang muncul, kami rangkai menjadi cerita.

The product is an editorial system, not a generic AI content farm and not a simple scraper/paraphraser.

Primary language: Bahasa Indonesia.

## 2. Source of truth

Before making significant implementation decisions:

1. Read `SEMBURAT_PRD.md`.
2. Read the relevant documents in `docs/`.
3. Read applicable `.kilo/rules/*.md`.
4. Read the relevant `.kilo/skills/*/SKILL.md`.
5. Inspect the existing repository before modifying it.

If the PRD and implementation details conflict, preserve the product intent and ask for approval before making a major architecture change.

Never silently replace a documented architectural decision with a different stack.

## 3. Core architecture

Preferred architecture:

- Web frontend: Astro + Tailwind CSS.
- Edge/backend: Cloudflare Workers.
- Database: Cloudflare D1.
- Object/media storage: Cloudflare R2.
- Background jobs: GitHub Actions + Python where appropriate.
- AI provider abstraction: OpenRouter first, optional Ollama/local models.
- Editorial/control interface: Telegram Bot.
- Operational spreadsheet integration: Google Sheets where explicitly required.
- Video rendering: Remotion.
- Voice-over/SFX: MiniMax API through a provider abstraction.

Keep provider-specific integrations behind interfaces/adapters.

Do not couple core business logic directly to one AI, storage, social, or media provider.

## 4. Editorial principles

SEMBURAT must prioritize:

- factual accuracy
- source provenance
- transparency
- useful context
- original editorial value
- Indonesian readability
- responsible automation

Do not implement a pipeline equivalent to:
`scrape -> paraphrase -> publish`.

AI-generated claims must be traceable to source evidence.

Every article should have source metadata and asset provenance.

Official-site images are not automatically free to reuse. Track license/usage status and credit requirements.

## 5. Sensitive and high-risk content

Topics involving serious allegations, crime, public safety, health, politics, financial claims, or other high-risk subjects must receive stricter verification and human review according to the editorial rules.

Do not invent facts, quotes, sources, statistics, or citations.

When evidence is insufficient, the system should say so instead of filling gaps with generated text.

## 6. Engineering rules

- Prefer small, composable modules.
- Use typed interfaces where the language supports them.
- Keep domain logic independent from infrastructure.
- Validate external inputs.
- Never hardcode API keys or credentials.
- Use environment variables/secrets.
- Log useful structured events without exposing secrets.
- Make jobs idempotent where possible.
- Design retries with bounded backoff.
- Avoid uncontrolled concurrency.
- Add tests for critical business logic.
- Run lint/typecheck/tests/build after meaningful changes.
- Keep migrations versioned.
- Preserve backward compatibility for public APIs unless explicitly approved.

## 7. Data and provenance

Store enough metadata to answer:

- Where did this claim come from?
- When was the source accessed?
- Which article/fact used it?
- Who/what generated the content?
- Which model/provider generated it?
- Which asset license applies?
- Which transformations were performed?

Do not discard source URLs, source timestamps, asset credits, or generation metadata when they are relevant.

## 8. AI behavior

AI is an assistant inside an editorial workflow, not an unquestioned authority.

Use structured outputs whenever possible.

Prefer:
`discover -> collect -> extract -> verify -> editorial -> quality gate -> publish`

over direct free-form generation.

Create provider adapters so models can be changed without rewriting editorial logic.

## 9. Coding workflow for Kilo

For a new feature:

1. Inspect repository.
2. Identify relevant PRD requirements.
3. Identify affected modules.
4. Make or update a short implementation plan.
5. Implement the smallest coherent increment.
6. Add/update tests.
7. Run validation.
8. Summarize files changed, behavior added, tests run, and known limitations.

For architecture changes, stop and present the proposed change before implementing if it materially changes the approved architecture.

## 10. Git discipline

- Use focused commits.
- Do not commit secrets.
- Do not commit generated caches or large temporary media.
- Do not rewrite unrelated files.
- Keep migrations and code changes logically aligned.

## 11. Definition of done

A feature is not done merely because the code exists.

It should have, as applicable:

- implementation
- configuration
- tests
- error handling
- observability
- documentation
- migration
- deployment notes

Update `TASKS.md` when a tracked task is completed.

## 12. Conflict resolution

Priority:

1. Explicit user instruction in the current task.
2. Product/architecture decisions approved by the user.
3. `SEMBURAT_PRD.md`.
4. `IMPLEMENTATION_PLAN.md`.
5. `docs/`.
6. `.kilo/rules/`.
7. `.kilo/skills/`.

When a lower-priority instruction conflicts with a higher-priority one, follow the higher-priority instruction and document the conflict if it affects implementation.

<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->
