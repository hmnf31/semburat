---
name: asset-intelligence
description: Manage image and media assets with provenance, license state, credits, deduplication, and safe reuse rules.
---

# Asset Intelligence Skill

## Goal

Ensure every published visual has traceable origin and usage status.

## Workflow

1. Identify asset.
2. Determine origin.
3. Record source URL if applicable.
4. Determine license/permission.
5. Record creator/owner.
6. Compute deduplication hash where possible.
7. Generate alt text.
8. Store credit requirements.
9. Validate publishing eligibility.

## Rules

- Official website does not automatically mean free-to-use.
- Unknown license is not an approval.
- Do not remove provenance during transformation.
- Generated assets must record generator/model metadata where useful.
- Preserve original source references.
- Block restricted assets from public publishing.

## Output

Asset record should include:

- asset_id
- type
- origin
- source_url
- creator
- license_state
- credit_text
- storage_key
- hash
- alt_text
- transformation_history
