# Research Sources Expansion

Status: implemented. Related tasks: TASK-233, TASK-234, TASK-235.

This document records how SEMBURAT discovers trend signals and candidate
visuals beyond a plain Google Search, and the licensing rules that govern
automatic fetching.

## Trend discovery providers

`EnhancedResearchAdapter` fans a query out to several `ResearchProvider`
implementations and merges/deduplicates the results:

| Provider              | Source                                                                                            | Provenance          | Notes                                                                                    |
| --------------------- | ------------------------------------------------------------------------------------------------- | ------------------- | ---------------------------------------------------------------------------------------- |
| `NewsAdapter`         | Google News RSS search (`news.google.com/rss/search`)                                             | `ESTABLISHED_MEDIA` | Reads `<source url>` to recover the real publisher domain                                |
| `RSSAdapter`          | Curated feeds (Google News headlines, Steam news, IGN, Eurogamer, Dexerto) + `RSS_FEEDS` override | `ESTABLISHED_MEDIA` | Feed items are filtered by query terms                                                   |
| `GoogleTrendsAdapter` | Derived n-gram clusters from headline feeds                                                       | `ESTABLISHED_MEDIA` | Google discontinued the public daily-trends RSS                                          |
| `RedditTrendAdapter`  | `old.reddit.com/r/<sub>/hot.json`                                                                 | `COMMUNITY`         | Public JSON only; default subs: `indonesia, gaming, GTA6, MobileLegendsGame, technology` |

Notes:

- Google News article links all share the `news.google.com` host, so the
  pipeline previously collapsed source diversity. `parseFeed` now extracts the
  publisher from `<source url="...">` and `trackSource` stores that domain
  instead of `news.google.com`.
- Reddit requires a descriptive `User-Agent`; `old.reddit.com` is used because
  `www.reddit.com/...json` returns `403` for non-browser clients.
- TikTok and Instagram do **not** expose a free, ToS-compliant trends API, so
  they are intentionally not scraped. X/Twitter and YouTube would require
  paid/registered API access.

### Configuration

Worker vars (`wrangler.jsonc` / `.dev.vars`):

- `TREND_QUERIES` — comma-separated default discovery queries
  (default: `MLBB MPL,gta 6,viral indonesia,teknologi indonesia`).
- `REDDIT_SUBREDDITS` — comma-separated subreddit names (without `r/`).
- `RSS_FEEDS` — overrides the curated feed list entirely.
- `RESEARCH_MODE=offline` disables all network research providers.

## Image sourcing

`ImageSourcingService` searches one or more `ImageSourceProvider` adapters,
deduplicates by image URL, and annotates every candidate with
`publishable` and `attributionRequired` flags derived from
`LicenseValidationService`.

| Adapter                  | Source                | License mapping                                                | Publishable |
| ------------------------ | --------------------- | -------------------------------------------------------------- | ----------- |
| `OpenverseImageAdapter`  | `api.openverse.org`   | `cc0`/`pdm` → `public_domain`; `by*` → `licensed`              | yes         |
| `WikimediaImageAdapter`  | Wikimedia Commons API | `Public domain`/`CC0` → `public_domain`; `CC BY*` → `licensed` | yes         |
| `DeviantArtImageAdapter` | DeviantArt public RSS | always `restricted` (`fan-art`)                                | **no**      |

### Fan art policy

Fan art is the copyright of the individual artist. Per PRD §20–22 the
DeviantArt adapter fetches candidates automatically (enabled via
`ENABLE_FANART=true`, the default in `wrangler.jsonc`) but marks every result
`restricted` with a `perlu izin pembuat` credit. Restricted assets are
surfaced for human review only: `Asset.canBePublished()` and the quality gate
block them until explicit permission is recorded. The design validator also
treats `fan_art`/`needs_permission` as credit-required image types.

Fan-art fetching can be disabled by setting `ENABLE_FANART=false`; doing so
removes the DeviantArt provider entirely (only Openverse/Wikimedia remain).

## API

`POST /api/pipeline/images` (Bearer auth, same secret as other pipeline routes):

```jsonc
{
  "query": "mobile legends",
  "limit": 6, // 1..24
  "includeUnpublishable": true, // include restricted fan art for review
  "providers": ["wikimedia"], // optional allow-list by adapter name
}
```

Response `data.images[]` items include `provider`, `url`, `sourceUrl`,
`creator`, `licenseState`, `creditText`, `publishable` and
`attributionRequired`.

## Limitations

- Asset bytes are stored in Cloudflare **KV** (R2 needs a payment method), served
  via `GET /media/*`. Sourced images are still returned as candidates; a
  download/watermark step that writes them into the asset registry is not wired
  yet (KV also caps a single value at 25 MiB).
- Reddit and DeviantArt may block datacenter egress (Cloudflare). Failures are
  swallowed and the other providers continue.
- Wikimedia/Openverse results are not yet re-encoded or watermarked; that
  remains part of the asset pipeline.
