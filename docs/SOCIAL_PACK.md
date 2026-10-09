# SEMBURAT Social Pack

Per-article social assets, generated from the same article data that powers the
website. Every asset is validated against the design rules in
`.kilo/skills/semburat-design/` before it is rendered, so nothing is published
without provenance-consistent captions, credits and slide limits.

## Outputs per article

| Asset         | Size      | Notes                                                |
| ------------- | --------- | ---------------------------------------------------- |
| `og-hero`     | 1200x630  | Link preview / Open Graph hero                       |
| `x-post`      | 1600x900  | Single image post for X                              |
| `fact-card`   | 1080x1080 | Only generated when a meaningful number is found     |
| `story-cover` | 1080x1920 | Instagram/Threads story cover                        |
| `carousel-*`  | 1080x1350 | Cover + summary + key points + sources (5-10 slides) |

Captions (`x-post.txt`, `instagram.txt`, `telegram.txt`) and a machine-readable
`pack.json` are written next to the PNGs.

## Pipeline

```text
article data (TypeScript)            tools/export_articles.ts
        │                                     │
        ▼                                     ▼
  social-out/articles.json ──► tools/social_pack.py
                                     │  build content (kicker, title, body, stat, sources, credits)
                                     │  validate with semburat-design rules
                                     ▼
                              render PNGs + captions (social-out/packs/<slug>/)
```

The renderer is the same code path used by the design skill
(`.kilo/skills/semburat-design/scripts/render.py`), now exposed as
`render_template()` so a whole pack can be rendered without shelling out per
template.

## Usage

```bash
# One-shot: export published articles, then build every pack
pnpm social:pack

# Step by step
pnpm articles:export                                   # -> social-out/articles.json
python tools/social_pack.py --articles social-out/articles.json \
  --out social-out/packs --assets-dir apps/web/src/assets/articles

# Validate only (no Chromium, fast, CI-friendly)
python tools/social_pack.py --articles social-out/articles.json --check-only

# Single article, single format
python tools/social_pack.py --articles social-out/articles.json --only apa-itu-qris \
  --formats og-hero,story-cover
```

### Flags

- `--articles` (required): JSON file with an `articles` array.
- `--out`: output root, default `social-out/packs`.
- `--assets-dir`: folder with `<slug>.jpg|png|webp`; when a photo is found the
  image type is inferred from the asset license (CC -> `licensed`, public
  domain -> `public_domain`, own work -> `original`) and the credit is required.
- `--domain`: used for links and CTA, default `semburat-web.pages.dev`.
- `--formats`: comma-separated subset of `og-hero,x-post,fact-card,story-cover,carousel`.
- `--only`: process one slug.
- `--check-only`: validate without rendering.

## Rules enforced

From `.kilo/skills/semburat-design/assets/tokens.json`:

- `title` 10-110 characters.
- Slide body at most 20 words (warns above 15).
- At most 6 sources on a slide.
- Image present requires a known `image_type`; licensed/public-domain/official
  images require a written credit.
- A carousel must start with `cover` and end with `sources`.

The pack builder trims overlong text, derives the fact-card `stat` and its body
from the same key point (so the number always matches the caption), and skips the
fact card entirely when no meaningful number exists.

## Automation

`.github/workflows/social-pack.yml` runs the builder on demand
(`workflow_dispatch`). It installs Chromium, builds the packs with the real
article data and uploads `social-out/` as a workflow artifact. Rendering is not
part of the default CI test run because Chromium is heavy; the unit tests cover
content/validation, and the render smoke test auto-skips when Playwright is
absent.

## Review via Telegram

`tools/telegram_send.py` sends each pack to a Telegram chat so a human can
review every generated asset before it is distributed. Per article it sends
one text message plus two albums (non-carousel images, then the carousel
slides). It needs the bot token, read (in order) from `--token`, the
`TELEGRAM_BOT_TOKEN` environment variable, or `apps/worker/.dev.vars`; the chat
id comes from `--chat-id`, `TELEGRAM_CHAT_ID`, or the first entry of
`TELEGRAM_ALLOWED_USER_IDS`.

```bash
# Preview what would be sent (no token required)
pnpm social:send -- --dry-run

# Send one article, or all of them
pnpm social:send -- --only apa-itu-qris
pnpm social:send

# Build and send in one go
pnpm social:review
```

The sender batches updates per article (`sendMediaGroup`) to stay within
Telegram limits, caps media captions at 1024 characters and backs off on HTTP
429 responses.

## Tests

```bash
pnpm test:py   # python -m unittest discover -s tests
```

`tests/test_social_pack.py` covers content building, rule compliance, captions
and (when Playwright is available) PNG dimensions.
