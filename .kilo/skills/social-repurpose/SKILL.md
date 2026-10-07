---
name: social-repurpose
description: Repurpose an approved SEMBURAT article into platform-specific social content while preserving factual consistency and brand voice.
---

# Social Repurpose Skill

## Goal

Generate platform-native variants from the canonical article.

## Supported variants

- Instagram feed
- Instagram story
- Instagram carousel
- Facebook
- X
- Threads
- Telegram
- Reel
- Short

## Workflow

1. Read approved article.
2. Identify key message.
3. Select platform format.
4. Adapt length and tone.
5. Attach approved assets.
6. Preserve source context.
7. Run factual consistency check.
8. Return variant with approval state.

## Rules

- Canonical article remains source of truth.
- Never add unsupported claims.
- Do not fabricate engagement bait as fact.
- Respect platform-specific limits through configurable adapters.
- Track content variant IDs.

## Output

- variant_id
- article_id
- platform
- format
- text/script
- asset_ids
- CTA
- source_reference
- approval_state
