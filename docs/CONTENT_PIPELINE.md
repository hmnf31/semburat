# SEMBURAT Content Pipeline

## Canonical pipeline

```text
1. Discover
2. Collect
3. Normalize
4. Score
5. Research
6. Extract facts
7. Verify
8. Editorial
9. Quality/Safety
10. SEO
11. Approve
12. Publish
13. Repurpose
14. Distribute
15. Analyze
16. Learn
```

## 1. Discover

Find candidate trends from approved sources.

Output:

- trend candidate
- source references
- timestamps
- initial score

## 2. Normalize

Normalize:

- URLs
- titles
- entities
- timestamps
- source domains

Deduplicate candidates.

## 3. Score

Suggested dimensions:

- velocity
- freshness
- relevance
- source diversity
- audience interest
- originality opportunity

Scores should remain explainable.

## 4. Research

Collect enough evidence for an editorial decision.

Do not assume one source is sufficient for important claims.

## 5. Fact extraction

Convert source material into structured claims.

Example:

```json
{
  "claim": "Example factual statement",
  "source_id": "src_123",
  "confidence": 0.91
}
```

## 6. Verification

Each material claim must be:

- supported
- contradicted
- partially supported
- unknown

Unknown claims should not be presented as facts.

## 7. Editorial

Generate:

- headline
- dek
- lead
- body
- context
- key takeaways
- FAQ where useful

Maintain Indonesian naturalness.

## 8. Quality/Safety

Check:

- factual support
- clarity
- duplication
- source coverage
- risk
- copyright/provenance
- SEO

## 9. SEO

Generate metadata from the verified editorial content.

Do not optimize SEO by inserting unsupported claims or keyword stuffing.

## 10. Repurpose

Generate platform-specific variants from the approved canonical article.

The article remains the source of truth.

## 11. Publish

Only approved content enters the publishing queue.

## 12. Analyze

Measure performance by:

- topic
- source
- format
- headline
- platform
- audience
- revenue

## Human-in-the-loop

Mandatory or strongly recommended review for:

- high-risk topics
- allegations
- ambiguous evidence
- sensitive personal information
- copyright uncertainty
- low confidence
- conflicting sources

## Content IDs

One article can have multiple derivative content IDs.

Example:

```text
ART-1001
  WEB-1001
  IG-1001
  STORY-1001
  TG-1001
  REEL-1001
```

Maintain traceability back to the canonical article.
