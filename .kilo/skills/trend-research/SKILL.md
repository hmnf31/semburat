---
name: trend-research
description: Research and rank emerging topics for SEMBURAT using source provenance, evidence quality, freshness, and explainable scoring.
---

# Trend Research Skill

## Goal

Turn external signals into ranked editorial opportunities without confusing popularity with truth.

## Workflow

1. Identify candidate trend.
2. Collect source metadata.
3. Normalize titles/URLs/entities.
4. Deduplicate.
5. Evaluate freshness.
6. Evaluate source diversity.
7. Evaluate relevance to SEMBURAT.
8. Score opportunity.
9. Attach evidence.
10. Produce research recommendation.

## Rules

- Never invent trend evidence.
- Do not use one noisy source as proof of broad popularity.
- Separate "trending" from "verified".
- Preserve access timestamps.
- Preserve source URLs.
- Explain why a trend scored highly.

## Output

Prefer structured output:

- trend_id
- normalized_topic
- source_ids
- freshness_score
- relevance_score
- velocity_score
- source_diversity_score
- opportunity_score
- notes
- recommended_next_action
