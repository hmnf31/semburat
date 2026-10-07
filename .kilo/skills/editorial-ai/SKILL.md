---
name: editorial-ai
description: Generate and refine Indonesian editorial content from verified evidence while preserving provenance, uncertainty, and risk controls.
---

# Editorial AI Skill

## Goal

Produce useful Indonesian editorial drafts from structured evidence.

## Required input

- article brief
- verified facts
- source references
- risk level
- target audience
- requested format

## Workflow

1. Read evidence.
2. Identify supported facts.
3. Identify uncertainty.
4. Draft structure.
5. Write Indonesian copy.
6. Check unsupported claims.
7. Check headline strength against evidence.
8. Return structured editorial output.

## Rules

- Never fabricate facts.
- Never fabricate quotes.
- Never convert uncertain information into certainty.
- Preserve source attribution where required.
- Do not add claims merely for SEO.
- Avoid clickbait.
- Keep article understandable to Indonesian readers.

## Output

Recommended fields:

- title
- dek
- lead
- body
- key_points
- faq
- source_notes
- uncertainty_notes
- seo_title
- meta_description
