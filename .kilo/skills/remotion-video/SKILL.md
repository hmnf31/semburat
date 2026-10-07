---
name: remotion-video
description: Convert approved SEMBURAT articles into reusable Remotion video compositions with structured scenes, assets, voiceover, SFX, and render metadata.
---

# Remotion Video Skill

## Goal

Create repeatable editorial video formats from canonical articles.

## Supported template concepts

- breaking news
- explainer
- top 5
- comparison
- gaming update
- tech update
- quote card
- timeline
- data story

## Workflow

1. Select template.
2. Create concise script from approved article.
3. Map facts to scenes.
4. Resolve approved assets.
5. Generate/request voiceover.
6. Generate/request SFX.
7. Build timeline.
8. Render preview.
9. Run visual/text/audio QC.
10. Render final.
11. Register media provenance.

## Rules

- Video must not introduce facts absent from approved source content.
- Keep text readable on mobile.
- Maintain safe margins.
- Track every asset used.
- Failed rendering must not publish.
- Provider-specific media APIs belong behind adapters.

## Metadata

Track:

- article_id
- template_id
- render_id
- asset_ids
- voice_provider
- voice_model
- audio_assets
- duration
- resolution
- fps
- created_at
