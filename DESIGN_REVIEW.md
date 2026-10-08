# SEMBURAT Frontend Design Review

**Date:** 8 October 2026  
**Scope:** `apps/web/` — Astro + Tailwind CSS frontend  
**Status:** Draft  
**References:** `SEMBURAT_PRD.md`, `docs/ARCHITECTURE.md`, `packages/brand/tokens.json`, `.kilo/skills/semburat-design/SKILL.md`

---

## 1. Current Design

### 1.1 Tech Stack

| Layer      | Technology                                                   | File                        |
| ---------- | ------------------------------------------------------------ | --------------------------- |
| Framework  | Astro 4.x                                                    | `apps/web/astro.config.mjs` |
| Styling    | Tailwind CSS v4 (`@tailwindcss/vite`)                        | `apps/web/astro.config.mjs` |
| CSS        | Tailwind v4 `@import tailwindcss` + custom `@theme`          | `src/styles/global.css`     |
| Output     | Static (`adapter: undefined`)                                | `astro.config.mjs:6-7`      |
| Fonts      | None loaded (system fonts only)                              | —                           |
| Deployment | Static output intended for Cloudflare Pages (but no adapter) | `astro.config.mjs`          |

### 1.2 Component Inventory

| Component         | Path                                       | Purpose                                                            |
| ----------------- | ------------------------------------------ | ------------------------------------------------------------------ |
| BaseLayout        | `src/layouts/BaseLayout.astro:1`           | Root HTML, `<html lang="id">`, body classes, Header/Footer include |
| ArticleLayout     | `src/layouts/ArticleLayout.astro:1`        | Article wrapper with schema + breadcrumbs                          |
| Header            | `src/components/Header.astro:1`            | Sticky nav, logo, desktop nav links, mobile hamburger              |
| Footer            | `src/components/Footer.astro:1`            | Copyright + footer nav links                                       |
| ArticleCard       | `src/components/ArticleCard.astro:1`       | Article preview card (category, date, dek, read time)              |
| SEO               | `src/components/SEO.astro:1`               | Meta tags, Open Graph, Twitter Card                                |
| ArticleSchema     | `src/components/ArticleSchema.astro:1`     | JSON-LD structured data (Article + BreadcrumbList)                 |
| SourceAttribution | `src/components/SourceAttribution.astro:1` | Sources section with links                                         |
| CreditVisual      | `src/components/CreditVisual.astro:1`      | Visual credit/license metadata                                     |

### 1.3 Page Inventory

| Page              | Route                          | Status                                           |
| ----------------- | ------------------------------ | ------------------------------------------------ |
| Home              | `/` (`index.astro`)            | Hero + latest articles grid + trending topics    |
| Trending          | `/trending` (`trending.astro`) | Placeholder topic list                           |
| Article           | `/articles/[slug].astro`       | Article body, hero image, sources, related cards |
| Category          | `/categories/[slug].astro`     | Category listing with placeholder articles       |
| About             | `/about.astro`                 | Brand description, editorial process             |
| Editorial Policy  | `/editorial-policy.astro`      | Editorial principles                             |
| AI Policy         | `/ai-policy.astro`             | AI usage disclosure                              |
| Contact           | `/contact.astro`               | Contact email table                              |
| Correction Policy | `/correction-policy.astro`     | Error correction process                         |
| Source Policy     | `/source-policy.astro`         | Source & credit policy                           |
| Privacy           | `/privacy.astro`               | Privacy policy draft                             |
| Terms             | `/terms.astro`                 | Terms of use draft                               |
| Sitemap           | `/sitemap.xml.ts`              | Static + category + article URLs                 |
| RSS               | `/rss.xml.ts`                  | RSS 2.0 feed                                     |

### 1.4 Data Model

- **Primary**: `src/data/soft-launch-articles.ts` — 6 articles (Viral, Teknologi, Gaming, Explainer) with fields: title, dek, body, summary, sources (with `accessedAt`), assets, keyPoints, FAQ, riskLevel, qualityScore.
- **Secondary**: `src/data/articles.ts` — 2 minimal articles with placeholder body paragraphs, sources, and credit.
- **Categories**: `src/data/categories.ts` — only `berita` and `teknologi`.
- **Brand tokens copy**: `src/data/brand-tokens.json` (duplicate of `packages/brand/tokens.json`).

### 1.5 Current Styling Approach

`global.css` defines a custom Tailwind v4 `@theme` block with color tokens that do **not** match SEMBURAT brand tokens:

```css
@theme {
  --color-primary: #0f172a; /* slate-900 — NOT a brand token */
  --color-secondary: #334155; /* slate-700 — NOT a brand token */
  --color-accent: #0ea5e7; /* cyan-500 — NOT a brand token */
  --color-accent-hover: #0284c7; /* cyan-600 — NOT a brand token */
  --color-background: #ffffff; /* white — NOT brand cream (#FFF7EC) */
  --color-surface: #f8fafc; /* slate-50 — NOT a brand token */
  --color-text: #1e293b; /* slate-800 — NOT brand ink */
  --color-text-muted: #64748b; /* slate-400 — NOT brand muted (#B9BCD6) */
  --color-border: #e2e8f0; /* slate-200 — NOT a brand token */
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
}
```

Components reference these via utility classes: `bg-background`, `text-primary`, `text-accent`, `border-border`, `hover:text-accent-hover`, `bg-accent/10`, etc.

### 1.6 Brand Identity

From `.kilo/skills/semburat-design/SKILL.md` (line 10):

> Nada visual: modern, jelas, tidak sensasional.  
> **Latar biru malam, aksen gradien "fajar" (amber → ember → rose).**

---

## 2. Brand Tokens Comparison

### 2.1 Color Palette

| Brand Token (source: `packages/brand/tokens.json`) | Brand Value | Current Implementation (global.css) | Match?                                                  |
| -------------------------------------------------- | ----------- | ----------------------------------- | ------------------------------------------------------- |
| `ink-900`                                          | `#0E1020`   | `--color-primary: #0f172a`          | No — off by `#0f172a` vs `#0e1020`                      |
| `ink-800`                                          | `#171A33`   | _(not mapped)_                      | No                                                      |
| `ink-700`                                          | `#232748`   | `--color-secondary: #334155`        | No — unrelated gray                                     |
| `cream`                                            | `#FFF7EC`   | `--color-background: #ffffff`       | No — brand uses warm cream, impl uses pure white        |
| `muted`                                            | `#B9BCD6`   | `--color-text-muted: #64748b`       | No — brand muted is purple-tinged, impl is cool gray    |
| `sun-400`                                          | `#FFB547`   | _(not mapped)_                      | No                                                      |
| `ember-500`                                        | `#FF6A3D`   | _(not mapped)_                      | No                                                      |
| `rose-500`                                         | `#E8457C`   | _(not mapped)_                      | No                                                      |
| `accent` (impl)                                    | `#0ea5e7`   | `--color-accent: #0ea5e7`           | No — brand has NO cyan; completely different hue family |
| `accent-hover` (impl)                              | `#0284c7`   | `--color-accent-hover: #0284c7`     | No — brand dawn gradient ends at rose-500               |
| `border` (impl)                                    | `#e2e8f0`   | `--color-border: #e2e8f0`           | No — not a brand token                                  |
| `surface` (impl)                                   | `#f8fafc`   | `--color-surface: #f8fafc`          | No — not a brand token                                  |

**Finding:** The entire color system diverges from SEMBURAT brand identity. The implementation uses a generic Tailwind slate + cyan palette instead of the brand's night-blue + dawn-gradient (amber to ember to rose) palette.

### 2.2 Gradients

| Brand Token  | Value                                                            | In Use?                       |
| ------------ | ---------------------------------------------------------------- | ----------------------------- |
| `grad-dawn`  | `linear-gradient(135deg, #FFB547 0%, #FF6A3D 55%, #E8457C 100%)` | Not used anywhere in frontend |
| `grad-night` | `linear-gradient(160deg, #0E1020 0%, #171A33 60%, #232748 100%)` | Not used anywhere in frontend |

**Finding:** Both brand gradients are defined in `packages/brand/tokens.json` and `apps/web/src/styles/tokens.css` but never referenced in any component or page.

### 2.3 Typography

| Brand Token    | Value               | In Use?                                                                                       |
| -------------- | ------------------- | --------------------------------------------------------------------------------------------- |
| Heading font   | `Plus Jakarta Sans` | Not loaded as web font; referenced only in `tokens.css` (which is not imported by any layout) |
| Body font      | `Inter`             | Available as system font in `global.css` `--font-sans`, but Plus Jakarta Sans is never loaded |
| `font-display` | Not applicable      | No `font-display: swap` anywhere                                                              |

**Finding:** `Plus Jakarta Sans` (brand heading font) is specified in `packages/brand/tokens.json` but never imported as a web font. `Inter` falls back to system font only. No font optimization is in place.

### 2.4 Semantic Tokens (status colors)

| Brand Token | Value     | In Use?  |
| ----------- | --------- | -------- |
| `ok`        | `#3DDC97` | Not used |
| `warn`      | `#FFC857` | Not used |
| `danger`    | `#FF5C5C` | Not used |

**Finding:** Status colors for risk levels (low/medium/high) defined in brand tokens are not applied. Articles have `riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'` in the data model but no visual indicator renders.

### 2.5 Brand Rules

| Rule                    | Value | Enforced?                                   |
| ----------------------- | ----- | ------------------------------------------- |
| `title_min_chars`       | 10    | Not enforced                                |
| `title_max_chars`       | 110   | Not enforced                                |
| `slide_body_warn_words` | 15    | N/A (social repurpose is separate pipeline) |
| `slide_body_max_words`  | 20    | N/A                                         |
| `max_sources_on_slide`  | 6     | N/A                                         |

**Finding:** Brand title length rules are not enforced at the frontend level.

---

## 3. Gaps

### 3.1 Critical Gaps

| ID   | Gap                                                                                                                                                                                                                                                                                                                                                | Impact                                       | Location                          |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- | --------------------------------- |
| G-01 | Brand tokens orphaned — `tokens.css` defines all `sb-*` brand tokens but is never imported in any layout or component. Only `global.css` is imported (`BaseLayout.astro:5`).                                                                                                                                                                       | Brand identity not reflected in UI at all    | `src/styles/tokens.css`           |
| G-02 | Color palette mismatch — `global.css` uses Tailwind default slate/cyan instead of SEMBURAT night-blue + dawn-gradient palette.                                                                                                                                                                                                                     | Complete visual disconnect from brand        | `src/styles/global.css`           |
| G-03 | No dark mode — Brand identity specifies "latar biru malam" (night blue background). There is no `dark:` variant or theme toggle. All pages render light mode only.                                                                                                                                                                                 | Misses brand positioning entirely            | All components                    |
| G-04 | No Cloudflare Pages adapter — `astro.config.mjs:7` sets `adapter: undefined`. PRD Section 10.1 specifies "Cloudflare Pages". Without an adapter, deployment to Cloudflare Pages is not possible.                                                                                                                                                   | Cannot deploy as specified                   | `astro.config.mjs`                |
| G-05 | Article page ignores rich data model — `[slug].astro` uses the minimal `articles.ts` data (plain `body: string[]`), not the richer `soft-launch-articles.ts` (keyPoints, FAQ, assets, riskLevel, qualityScore, summary). PRD Section 19 article structure (Lead, Key Facts, What We Know / What We Don't Know, Timeline, Sources) is not rendered. | Editorial structure from PRD not implemented | `src/pages/articles/[slug].astro` |

### 3.2 High-Priority Gaps

| ID   | Gap                                                                                                                                                                                                       | Impact                                   | Location                          |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | --------------------------------- |
| G-06 | Orphaned `brand-tokens.json` — `src/data/brand-tokens.json` is a copy of tokens but not imported by any component. No design-to-token pipeline connects brand tokens to CSS.                              | Dead code; no token sync                 | `src/data/brand-tokens.json`      |
| G-07 | No web font loading — `Plus Jakarta Sans` (brand heading font) is never loaded via `@font-face` or Google Fonts.                                                                                          | Typography not matching brand            | `global.css`                      |
| G-08 | Footer links are all `#` placeholders — `Footer.astro:4-8` sets all `href: '#'`. The footer has no real navigation.                                                                                       | Users cannot navigate from footer        | `src/components/Footer.astro`     |
| G-09 | Sitemap references nonexistent categories — `sitemap.xml.ts` lists `ekonomi`, `kesehatan`, `kebijaran-publik` but `categories.ts` only defines `berita` and `teknologi`. These will produce broken links. | Broken sitemap, SEO impact               | `sitemap.xml.ts:24-35`            |
| G-10 | No favicon or manifest — No `public/` folder exists. No favicon, no web app manifest, no Apple touch icon.                                                                                                | Poor installability and tab identity     | Project root                      |
| G-11 | Hero image uses wrong colors — `hero-placeholder.svg` fills with `#0f172a` (slate), not brand `ink-900` (`#0e1020`).                                                                                      | Visual inconsistency                     | `src/assets/hero-placeholder.svg` |
| G-12 | Hardcoded SITE_URL — `https://semburat.example.id` is duplicated across `SEO.astro`, `ArticleSchema.astro`, `ArticleLayout.astro`, `sitemap.xml.ts`, and `rss.xml.ts`. Should be centralized config.      | Maintenance burden; easy to miss updates | Multiple files                    |

### 3.3 Medium-Priority Gaps

| ID   | Gap                                                                                                                                                                       | Impact                         |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| G-13 | Header nav incomplete — Only 4 items: Beranda, Trending, Kategori, About. Missing: Explainer, Review sections from PRD IA. "Kategori" links to `/categories/berita` only. | Limited navigation coverage    |
| G-14 | No dark mode toggle — Even if dark mode is implemented, no user-facing toggle exists in the UI.                                                                           | No user control over theme     |
| G-15 | Risk level not visualized — Data model has `riskLevel` but article pages don't render any badge or indicator.                                                             | Editorial transparency missing |
| G-16 | No quality score display — Articles have `qualityScore` but it's not surfaced to readers.                                                                                 | No trust signals               |
| G-17 | No "Diperbarui" (updated) timestamp — PRD Section 41 requires showing update time, but no updated time field or display exists.                                           |
| G-18 | Category page uses hardcoded placeholder articles — `[slug].astro` creates 2 synthetic articles instead of using real data.                                               |
| G-19 | No image lazy-loading — `articles/[slug].astro:64` renders `<img>` without `loading="lazy"` or `decoding="async"`.                                                        |
| G-20 | No responsive images — Hero image is fixed 1200x630 SVG with no `srcset`.                                                                                                 |
| G-21 | Mobile menu has no ESC key handling — `Header.astro:41-50` toggles menu but does not close on Escape or handle focus trapping.                                            |
| G-22 | Inline `<script>` in Header — Mobile menu JS is inline with no module isolation. Acceptable for Astro but could be cleaner.                                               |

### 3.4 Low-Priority Gaps

| ID   | Gap                                                                                                                                                                                                                                            | Impact                |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| G-24 | Title typo: "Kebijikan" — `editorial-policy.astro:6`, `ai-policy.astro:6`, `correction-policy.astro:6`, `source-policy.astro:6`, `contact.astro`, and `privacy.astro` all use `<title>` "Kebijikan" (typo). Correct Indonesian is "Kebijakan". | Minor professionalism |
| G-25 | No skip-link — No "Skip to main content" link for keyboard users.                                                                                                                                                                              |
| G-26 | No `prefers-reduced-motion` handling — CSS transitions do not respect user motion preferences.                                                                                                                                                 |
| G-27 | No custom focus-visible styles — Focus relies on browser default.                                                                                                                                                                              |
| G-28 | No `aria-current` on active nav link — No `aria-current="page"` on current navigation item.                                                                                                                                                    |
| G-29 | Date format does not include WIB timezone — `ArticleCard.astro:22` uses `toLocaleDateString('id-ID')` but PRD Section 41 specifies `Diperbarui 16:00 WIB` style.                                                                               |
| G-30 | Breadcrumb uses text separators — `articles/[slug].astro:44` uses `<span aria-hidden="true"> / </span>` instead of structured breadcrumb nav pattern.                                                                                          |
| G-31 | No sponsorship/affiliate badge — PRD Sections 43-44 require "Konten Bersponsor" / "Mengandung tautan afiliasi" labels but no badge component exists.                                                                                           |
| G-32 | No FAQ structured data — Articles have `faq` in data model but `ArticleSchema.astro` does not generate `FAQPage` schema.                                                                                                                       |

---

## 4. Recommendations

### 4.1 Phase 1: Critical Brand Alignment (P0)

1. **Import and consume `tokens.css`** — Add `import "../styles/tokens.css";` to `BaseLayout.astro:5` or consolidate into `global.css`. Map all `sb-*` tokens to semantic CSS variables.
2. **Rewrite `global.css` theme** to use SEMBURAT tokens:
   - `--color-primary` to `var(--sb-ink-900)`
   - `--color-accent` to `var(--sb-sun-400)` or use `var(--sb-grad-dawn)` for highlights
   - `--color-background` to `var(--sb-cream)`
   - `--color-surface` to `var(--sb-ink-800)` or `var(--sb-ink-700)` for cards
   - `--color-border` to a tint of `--sb-muted`
   - `--color-text` to `var(--sb-ink-700)` (or lighter on dark bg)
3. **Implement dark mode** — Use `grad-night` gradient as the dark background. Add `dark:` variants and a theme toggle button in the Header.
4. **Add Cloudflare Pages adapter** — Install `@astrojs/cloudflare` and configure in `astro.config.mjs`.
5. **Remove orphaned `brand-tokens.json`** — Delete `src/data/brand-tokens.json`; consumers should reference `packages/brand/tokens.json`.

### 4.2 Phase 2: Typography & Article Structure

1. **Load `Plus Jakarta Sans`** as a web font via `@font-face` with `font-display: swap`, or through a font provider.
2. **Migrate article page** to use `softLaunchArticles` data model — keyPoints as a list, FAQ as accordion, assets as hero image.
3. **Implement PRD Section 19 article structure** — Lead, Key Facts, What We Know / What We Don't Know, Timeline, Sources.
4. **Add risk-level badges** using `sb-ok` (green), `sb-warn` (amber), `sb-danger` (red).
5. **Add FAQPage structured data** generation in `ArticleSchema.astro`.

### 4.3 Phase 3: Infrastructure & Polish

1. **Centralize SITE_URL** — Move to `src/config/site.ts` constant imported everywhere.
2. **Wire Footer links** to `/about`, `/editorial-policy`, `/contact`, `/privacy`.
3. **Make sitemap categories dynamic** from `categories.ts`.
4. **Add favicon** and web app manifest in `public/` folder.
5. **Fix hero SVG colors** to use brand `ink-900`/`ink-800`/`ink-700`.
6. **Add image lazy-loading** and a1y improvements to mobile menu.
7. **Fix "Kebijikan" typo** across all policy pages.
8. **Add skip-link** and `:focus-visible` styles.

---

## 5. Component Review

### 5.1 BaseLayout (`src/layouts/BaseLayout.astro:1`)

**Strengths:**

- Clean separation of SEO, Header, main content, Footer.
- `<html lang="id">` correctly sets Indonesian language.

**Issues:**

- Body classes `bg-background font-sans text-text` use theme tokens that do not match brand colors.
- No dark mode class context.
- No theme persistence script.
- `antialiased` applied but no `font-feature` settings.

**Recommendation:** Add `class="dark"` support and theme initialization script. Replace theme tokens with brand `sb-*` tokens.

### 5.2 Header (`src/components/Header.astro:1`)

**Strengths:**

- Sticky header with backdrop blur.
- Responsive: desktop nav hidden on mobile, hamburger shown.
- `aria-label` and `aria-expanded` on mobile button.
- Mobile menu toggles via vanilla JS.

**Issues:**

- Nav only has 4 items — does not cover all PRD Section 31 categories (`teknologi`, `gaming`, `trending`, `entertainment`, `lifestyle`, `bisnis`, `viral`, `explain`, `review`).
- Mobile menu: no ESC key to close, no focus trapping, no `aria-hidden` on menu when closed.
- No active state (`aria-current="page"`) on nav links.
- Logo is plain text "SEMBURAT" — no brand icon or watermark.
- "Kategori" links to `/categories/berita` — too narrow.

**Recommendation:** Add remaining nav items, implement ESC + focus trapping, add `aria-current`, integrate brand gradient on logo.

### 5.3 Footer (`src/components/Footer.astro:1`)

**Strengths:**

- Clean layout with copyright + nav.
- Responsive flex-wrap.

**Issues:**

- All 4 links use `href: '#'` — completely non-functional.
- "Privacy" label should be "Kebijikan Privasi" for consistency.
- No social media links (PRD has `social_accounts` in `brand.config.json`).
- No newsletter signup link.

**Recommendation:** Wire links to actual pages, add social accounts from `brand.config.json`.

### 5.4 ArticleCard (`src/components/ArticleCard.astro:1`)

**Strengths:**

- Compact card with category badge, date, read time.
- Hover shadow effect.
- Semantic `<article>` element.
- Indonesian date formatting.

**Issues:**

- `href={`/articles/${slug}`}` — but the article page reads from `articles.ts`, not `soft-launch-articles.ts`. Slug keys do not match between data sources.
- No risk-level badge.
- No image placeholder.
- `readTime` unit inconsistent: `articles.ts` uses `"5 menit"` while soft-launch cards use `"5"` (bare number).
- No `loading="lazy"` on any image.
- Date rendered as full `MMMM d, yyyy` — verbose.

**Recommendation:** Add risk badge, add image support, unify readTime format, fix data source mismatch.

### 5.5 SEO (`src/components/SEO.astro:1`)

**Strengths:**

- Comprehensive meta tags: OG, Twitter Card.
- `og:locale` set to `id_ID`.
- Title concatenation with ` — SEMBURAT` suffix.

**Issues:**

- No `<script type="application/ld+json">` for Organization schema.
- No `og:image:width` / `og:image:height` meta tags.
- No `article:author` / `article:section` meta for Facebook/LinkedIn.
- `canonicalUrl` defaults to `SITE_URL` when not provided.
- `og:type` for homepage is `website` (default); article type defaults to `article` in ArticleLayout.

**Recommendation:** Add Organization schema, OG image dimensions, Facebook article meta.

### 5.6 ArticleSchema (`src/components/ArticleSchema.astro:1`)

**Strengths:**

- JSON-LD with `@graph` structure (Article + BreadcrumbList).
- Proper `@context` and `@type`.

**Issues:**

- No FAQPage schema when article has FAQ data.
- No `NewsArticle` type (PRD Section 32 suggests `NewsArticle` when applicable).
- `mainEntityOfPage` uses `ogUrl` which defaults to `${SITE_URL}/articles/${title}` — URL-encoded title as path is incorrect.
- No `image` dimension metadata.

**Recommendation:** Add FAQPage, support NewsArticle, fix mainEntityOfPage URL construction.

### 5.7 SourceAttribution (`src/components/SourceAttribution.astro:1`)

**Strengths:**

- Semantic `<section>` with `aria-labelledby`.
- External links with `rel="noopener noreferrer"`.
- Conditionally renders only when sources exist.

**Issues:**

- No `accessedAt` display — PRD Sections 18 and 41 require source access timestamps.
- No source ordering or authority indication.
- Links styled with `text-accent` (cyan) — wrong brand color.

**Recommendation:** Display `accessedAt` timestamp, use brand accent color, add source authority indicators.

### 5.8 CreditVisual (`src/components/CreditVisual.astro:1`)

**Strengths:**

- Proper `<dl>`/`<dt>`/`<dd>` structure.
- Links source URL with `rel="noopener noreferrer"`.

**Issues:**

- `credit: string` prop name shadows the `<dd>` context — potential confusion in code.
- No structured data for image license (ImageObject schema).
- No AI-generated image badge — PRD Section 24 and design skill require "Ilustrasi AI" label.
- Links styled with cyan accent.

**Recommendation:** Add AI image badge, ImageObject schema, use brand colors.

### 5.9 hero-placeholder.svg (`src/assets/hero-placeholder.svg:1`)

**Issues:**

- Fills: `#0f172a` (should be `#0e1020`), `#1e293b` (not a brand token).
- `role="img"` with `aria-label` — good for accessibility.
- No brand gradient or colors.

**Recommendation:** Use brand `ink-900`/`ink-800`/`ink-700` gradient, add `sb-grad-night` equivalent.

---

## 6. Page Review

### 6.1 Home (`index.astro:1`)

**Flow:** Hero -> Latest Articles Grid -> Trending Topics

**Strengths:**

- Hero with tagline (matches PRD positioning line).
- Grid layout: `sm:grid-cols-2 lg:grid-cols-3`.
- Clear typography hierarchy.

**Issues:**

- Hero background `bg-primary` uses `#0f172a` (not brand ink-900).
- Hero text uses `text-slate-300` (hardcoded, line 45) — bypasses theme tokens entirely.
- "Media Intelligence Indonesia" subtitle is plain text.
- Trending topics: only category counts shown, uses `bg-background` and `text-accent` (cyan).
- No hero image — just solid color.
- `bg-accent/10` on category badge uses cyan, not brand sun/ember.

**Recommendation:** Apply brand tokens, add hero visual, add dark mode support.

### 6.2 Trending (`trending.astro:1`)

**Strengths:**

- Clean ordered list with rank badges.
- Descriptive placeholder text.

**Issues:**

- Only shows category counts (not actual trending topics with scores/velocity).
- Rank badge uses `text-accent` (cyan).
- No link to actual trend detail pages.
- No `risk_score` display — PRD Section 11 trend object has `risk_score`.
- No source count, velocity, or freshness indicators.

**Recommendation:** Integrate trend scoring data model, add risk/velocity indicators.

### 6.3 Article (`articles/[slug].astro:1`)

**Strengths:**

- Breadcrumb navigation.
- Hero image with dimensions.
- Source attribution and credit visual.
- Related articles section.

**Issues:**

- Uses `articles.ts` (2-article minimal dataset) instead of `soft-launch-articles.ts` (6-article rich dataset).
- Hero image is hardcoded SVG placeholder — no dynamic asset from article data.
- Body rendered as plain `<p>` paragraphs only — no headings, lists, blockquotes.
- No "Key Facts" section, no FAQ accordion, no risk badge, no quality score.
- No structured sections from PRD Section 19 (What Happened? Context, What We Know, What We Don't Know).
- Body doesn't handle markdown or rich content.
- Hero image `alt` text is generic.
- No table of contents for longer articles.
- Related articles: only 2 items, uses same minimal data format.

**Recommendation:** Migrate to `soft-launch-articles` data model, implement full PRD Section 19 structure.

### 6.4 Category (`categories/[slug].astro:1`)

**Strengths:**

- Dynamic route generation from `categories` data.
- ArticleCard grid.

**Issues:**

- Only 2 hardcoded placeholder articles (lines 19-37).
- `categories.ts` only has 2 entries — sitemap expects 5.
- No category description or hero.
- Breadcrumb doesn't show category name as current page.
- No pagination.

**Recommendation:** Generate articles from real data, expand categories, add pagination.

### 6.5 Policy Pages (about, editorial-policy, ai-policy, contact, correction-policy, source-policy, privacy, terms)

**Strengths:**

- All use consistent layout with breadcrumb nav.
- Breadcrumb pattern is consistent.
- Content follows PRD Section 33 transparency requirements (About, Editorial Policy, AI Policy, Correction Policy, Source Policy).

**Issues:**

- **All have the "Kebijikan" typo** in `<title>` prop (should be "Kebijakan"). Found in: `editorial-policy.astro:6`, `ai-policy.astro:6`, `correction-policy.astro:6`, `source-policy.astro:6`, `contact.astro:6`, `privacy.astro:6`, `terms.astro:6`.
- Footer links in `Footer.astro` use `#` — policy pages are not linked from footer.
- Container width inconsistency: policy pages use `max-w-3xl`, category/trending use `max-w-4xl`, home cards use `max-w-6xl`.
- No dark mode support.
- Placeholder values `[TANGGAL]`, `[EMAIL REDAKSI]`, etc. remain in content.

---

## 7. Responsive Audit

### 7.1 Breakpoints

The site uses Tailwind v4 default responsive prefixes (`sm`, `lg`) without custom breakpoint configuration. No `@theme` breakpoint overrides exist in `global.css`. No `xl:` or `2xl:` variants are used.

### 7.2 Breakpoint Coverage

| Element          | Mobile (<640px)                                   | Tablet (sm: 640px+) | Desktop (lg: 1024px+)  |
| ---------------- | ------------------------------------------------- | ------------------- | ---------------------- |
| Header nav       | Hamburger shown, desktop nav hidden (`md:hidden`) | —                   | Desktop nav shown      |
| Header container | `px-4`                                            | `sm:px-6`           | `max-w-6xl`            |
| Hero section     | `px-4 py-16`                                      | `text-3xl`          | `sm:text-4xl`          |
| Article grid     | Single column                                     | `sm:grid-cols-2`    | `lg:grid-cols-3`       |
| Article body     | `px-4`                                            | `sm:px-6`           | `lg:px-8`, `max-w-3xl` |
| Trending list    | Single column                                     | —                   | Single column          |
| Footer           | Stacked (`flex-col`)                              | `sm:flex-row`       | `sm:flex-row`          |

**Note:** Header uses `md:hidden` (768px breakpoint) for mobile elements but `sm:` (640px) elsewhere — slight breakpoint inconsistency.

### 7.3 Mobile Menu Accessibility Audit

| Checkpoint                                  | Status | Notes                                 |
| ------------------------------------------- | ------ | ------------------------------------- |
| Hamburger button visible on mobile          | Yes    | `md:hidden` class                     |
| Menu opens/closes on click                  | Yes    | Vanilla JS toggle                     |
| ESC key closes menu                         | No     | No keyboard handler                   |
| Focus trapped in menu                       | No     | Tab can escape to page below          |
| Menu hidden from screen readers when closed | No     | Only `hidden` class, no `aria-hidden` |
| `aria-expanded` updated on toggle           | Yes    | `Header.astro:46-47`                  |
| `aria-controls` linked to menu ID           | Yes    | `aria-controls="mobile-menu"`         |
| Focus returns to button on close            | No     |                                       |
| `aria-label` on button                      | Yes    | "Buka menu navigasi"                  |

### 7.4 Responsiveness Issues

| ID   | Issue                                 | Details                                                                                     |
| ---- | ------------------------------------- | ------------------------------------------------------------------------------------------- |
| R-01 | No custom breakpoints                 | Uses Tailwind defaults (640/768/1024). No `xl:` or `2xl:` usage anywhere.                   |
| R-02 | Inconsistent container widths         | Hero text `max-w-2xl`, article `max-w-3xl`, category `max-w-4xl`, cards `max-w-6xl`.        |
| R-03 | Fixed hero image                      | `<img>` at `w-full` but SVG is fixed 1200x630 — no `srcset` or `sizes`.                     |
| R-04 | No granular font scaling              | Jumps from `text-base` to `text-lg` to `text-xl` — no intermediate steps for fluid scaling. |
| R-05 | Missing responsive image optimization | No `loading="lazy"`, no `decoding="async"`, no responsive widths.                           |

---

## 8. Accessibility Audit

### 8.1 Standards Compliance

| Criterion               | Status   | Notes                                                                             |
| ----------------------- | -------- | --------------------------------------------------------------------------------- |
| Language attribute      | Yes      | `<html lang="id">`                                                                |
| Viewport meta           | Yes      | `width=device-width, initial-scale=1.0`                                           |
| Page title              | Yes      | Each page sets `<title>`                                                          |
| Meta description        | Yes      | `SEO.astro` sets description                                                      |
| Headings hierarchy      | Yes      | h1 to h3 maintained within sections                                               |
| Breadcrumbs             | Yes      | `aria-label="Breadcrumb"` on nav                                                  |
| Skip link               | No       | No "Skip to main content" link                                                    |
| Focus indicator         | Partial  | Browser default only; no custom `:focus-visible`                                  |
| ARIA labels             | Yes      | `aria-label="Navigasi utama"` on nav, `aria-label="Breadcrumb"` on breadcrumb nav |
| `aria-expanded`         | Yes      | On mobile menu button                                                             |
| ARIA hidden when closed | No       | Mobile menu not marked `aria-hidden`                                              |
| Alt text                | Partial  | Hero image has alt; SVG placeholder alt is generic                                |
| Color contrast          | Untested | Cyan-on-white may fail WCAG 2.1 AA                                                |
| Reduced motion          | No       | No `prefers-reduced-motion` media query                                           |
| Landmarks               | Partial  | `<main>` present but no `<header>` or `<main>` role attributes                    |
| Forms                   | N/A      | No forms on current pages                                                         |

### 8.2 Specific Accessibility Issues

| ID   | Issue                                     | Severity | Location                   |
| ---- | ----------------------------------------- | -------- | -------------------------- |
| A-01 | No skip-to-content link                   | High     | All pages                  |
| A-02 | Mobile menu not `aria-hidden` when closed | High     | `Header.astro:29`          |
| A-03 | No ESC key handler on mobile menu         | Medium   | `Header.astro:41-50`       |
| A-04 | No focus trapping on mobile menu          | Medium   | `Header.astro:41-50`       |
| A-05 | No custom `:focus-visible` styles         | Medium   | Global                     |
| A-06 | No `prefers-reduced-motion` handling      | Medium   | Global                     |
| A-07 | Footer links are `#` (broken)             | Low      | `Footer.astro:4-8`         |
| A-08 | No visual risk level indication           | High     | No badge component exists  |
| A-09 | Breadcrumb uses text separators " / "     | Low      | `articles/[slug].astro:44` |
| A-10 | No `aria-current="page"` on active nav    | Low      | `Header.astro:14-21`       |

---

## 9. Performance

### 9.1 Current State

| Metric         | Status                                        | Notes                           |
| -------------- | --------------------------------------------- | ------------------------------- |
| Framework      | Astro (static generation, zero JS by default) | Good for SEO                    |
| CSS            | Tailwind v4 with `@import`                    | Purged by default in v4         |
| JS             | Only inline script in Header for mobile menu  | Minimal JS                      |
| Fonts          | System fonts only (no web fonts)              | No font optimization needed yet |
| Images         | Static SVG or `<img>` with fixed dimensions   | No lazy-loading, no `srcset`    |
| Resource hints | None                                          | No preconnect, dns-prefetch     |
| Adapter        | `undefined` (no adapter configured)           | Cannot deploy to edge/CDN       |
| Caching        | Not configured                                | No caching headers              |

### 9.2 Performance Issues

| ID   | Issue                               | Impact                           | Location                   |
| ---- | ----------------------------------- | -------------------------------- | -------------------------- |
| P-01 | No Cloudflare Pages adapter         | Cannot deploy as specified       | `astro.config.mjs:7`       |
| P-02 | No image lazy-loading               | LCP impact on long pages         | `articles/[slug].astro:64` |
| P-03 | No responsive images (`srcset`)     | CLS on mobile                    | `articles/[slug].astro:64` |
| P-04 | No resource hints                   | TTFB on first load               | `BaseLayout.astro`         |
| P-05 | No `font-display: swap`             | FOIT risk (when web fonts added) | Global                     |
| P-06 | No caching headers                  | Repeat visit performance         | Deployment config          |
| P-07 | SVG hero not optimized              | Bundle size                      | `hero-placeholder.svg`     |
| P-08 | React integration loaded but unused | Unnecessary bundle weight        | `astro.config.mjs:3`       |

### 9.3 Astro Build Configuration Note

`astro.config.mjs` imports `@astrojs/react` but no components use React in the current codebase. This adds unnecessary complexity. The integration could be removed if only Astro (server-rendered) components are used, or kept if React is planned for interactive widgets.

---

## 10. Priority Matrix

| Priority | ID(s)                                          | Theme                                    | Estimated Effort |
| -------- | ---------------------------------------------- | ---------------------------------------- | ---------------- |
| **P0**   | G-01, G-02, G-03, G-04                         | Brand alignment & deployability          | 3-5 days         |
| **P1**   | G-05, G-06, G-07, G-08, G-09, G-10, G-11, G-12 | Article structure, fonts, infrastructure | 3-4 days         |
| **P2**   | G-13 through G-22                              | Navigation, dark mode toggle, data model | 2-4 days         |
| **P3**   | G-24 through G-32                              | Typography polish, accessibility, SEO    | 1-3 days         |

### 10.1 P0 Action Plan (Critical)

| #   | Action                                                                                          | Rationale                           | Files Affected                     |
| --- | ----------------------------------------------------------------------------------------------- | ----------------------------------- | ---------------------------------- |
| 1   | Create `src/styles/brand.css` mapping `sb-*` tokens to semantic `--color-*` vars (light + dark) | Single source of truth for colors   | `global.css`, `tokens.css`         |
| 2   | Replace all `bg-primary`, `text-primary`, `bg-accent`, `text-accent` classes with brand tokens  | Brand alignment                     | All components                     |
| 3   | Add `class="dark"` to `<html>` with `bg-sb-grad-night` background, light-accent text            | Implements "biru malam" identity    | `BaseLayout.astro`                 |
| 4   | Add theme toggle button with `localStorage` persistence in Header                               | User preference                     | `Header.astro`                     |
| 5   | Install `@astrojs/cloudflare` adapter                                                           | Enables Cloudflare Pages deployment | `astro.config.mjs`, `package.json` |

### 10.2 P1 Action Plan (High)

| #   | Action                                                                            | Rationale               | Files Affected                            |
| --- | --------------------------------------------------------------------------------- | ----------------------- | ----------------------------------------- |
| 1   | Refactor `articles/[slug].astro` to consume `softLaunchArticles` by slug          | Use complete data model | `[slug].astro`, `soft-launch-articles.ts` |
| 2   | Replace `brand-tokens.json` import with reference to `packages/brand/tokens.json` | Single source of truth  | `src/data/brand-tokens.json` (delete)     |
| 3   | Add `@font-face` for Plus Jakarta Sans with `font-display: swap`                  | Brand typography        | `global.css`, `<head>` in layout          |
| 4   | Wire Footer links to `/about`, `/editorial-policy`, `/contact`, `/privacy`        | Usable navigation       | `Footer.astro`                            |
| 5   | Make sitemap categories dynamic from `categories.ts`                              | Prevent broken links    | `sitemap.xml.ts`                          |

### 10.3 P2 Action Plan (Medium)

| #   | Action                                               | Rationale              |
| --- | ---------------------------------------------------- | ---------------------- |
| 1   | Add remaining nav items (Explainer, Review sections) | Complete IA coverage   |
| 2   | Add dark mode toggle UI                              | User control           |
| 3   | Add risk level badges to ArticleCard                 | Editorial transparency |
| 4   | Add image lazy-loading and `decoding="async"`        | Performance            |
| 5   | Fix mobile menu: ESC, focus trap, `aria-hidden`      | Accessibility          |
| 6   | Centralize SITE_URL in `src/config/site.ts`          | Maintainability        |

### 10.4 P3 Action Plan (Low)

| #   | Action                                    | Rationale           |
| --- | ----------------------------------------- | ------------------- |
| 1   | Fix "Kebijikan" to "Kebijakan" typo       | Professionalism     |
| 2   | Add skip-to-content link                  | Keyboard navigation |
| 3   | Add `:focus-visible` styles               | Focus visibility    |
| 4   | Add `prefers-reduced-motion` support      | Inclusivity         |
| 5   | Add FAQPage structured data               | SEO                 |
| 6   | Add sponsorship/affiliate badge component | PRD compliance      |

---

## 11. Compliance Checklist

| Requirement                          | PRD Section     | Status             | Notes                                                   |
| ------------------------------------ | --------------- | ------------------ | ------------------------------------------------------- |
| Astro + Tailwind                     | Section 10.1    | Yes (tech stack)   | But brand tokens not applied                            |
| Responsive design                    | Section 10.1    | Yes                | Mobile menu has a11y gaps                               |
| Server-rendered / static-first       | Section 10.1    | Yes (Astro static) | But no edge adapter configured                          |
| Cloudflare Pages                     | Section 10.1    | No                 | Adapter is `undefined`                                  |
| Semantic HTML                        | Section 32      | Yes                | Uses article, nav, section, time, etc.                  |
| Open Graph                           | Section 32      | Yes                | `SEO.astro`                                             |
| Structured data                      | Section 32      | Partial            | Article + Breadcrumb only; missing FAQPage, NewsArticle |
| Breadcrumbs                          | Section 32      | Yes                | In ArticleSchema + visible nav                          |
| Editorial transparency               | Section 33      | Yes                | About, Editorial Policy, AI Policy pages exist          |
| AI disclosure                        | Section 33      | Yes                | In About + AI Policy                                    |
| Indonesian language                  | Section 33      | Yes                | All content in Bahasa Indonesia                         |
| Source attribution                   | Sections 20, 41 | Yes                | SourceAttribution component                             |
| Credit & license                     | Sections 20, 41 | Yes                | CreditVisual component                                  |
| Dark mode ("biru malam")             | Design skill    | No                 | Not implemented                                         |
| Brand typography (Plus Jakarta Sans) | Design skill    | No                 | Font not loaded                                         |
| Brand colors (ink/cream/dawn)        | tokens.json     | No                 | Divergent palette in use                                |

---

## 12. Summary

The SEMBURAT frontend is early-stage. The Astro + Tailwind stack is appropriate per PRD, and the component/page structure covers the required IA (home, trending, article, category, policy pages). However, the implementation has a critical disconnect from the defined brand identity: the `tokens.css` file with all brand color/font tokens is orphaned and never imported, while `global.css` uses a generic Tailwind slate/cyan palette that does not match SEMBURAT's night-blue + dawn-gradient brand. The site lacks dark mode entirely, has no Cloudflare Pages adapter, no web font loading, and the article page uses a minimal data model instead of the richer soft-launch dataset. The `tokens.json` source of truth in `packages/brand/` is not consumed by any frontend code.

**Top 3 immediate actions:**

1. Wire up brand tokens — import `tokens.css` and replace the divergent theme palette in `global.css`.
2. Add Cloudflare Pages adapter (`@astrojs/cloudflare`) to match PRD deployment target.
3. Migrate the article page to the full `soft-launch-articles.ts` data model with PRD Section 19 structure (keyPoints, FAQ, risk badge, Key Facts).
