# SEMBURAT Frontend Framework Checklist

> Comprehensive review, redesign, and rebuild reference for the SEMBURAT web frontend.
> Generated from the actual codebase at pps/web/.

---

## Table of Contents

1. [Technology Stack](#1-technology-stack)
2. [Directory Structure](#2-directory-structure)
3. [Layout System](#3-layout-system)
4. [Component Library](#4-component-library)
5. [Page Inventory](#5-page-inventory)
6. [Data Layer](#6-data-layer)
7. [Design System](#7-design-system)
8. [SEO Architecture](#8-seo-architecture)
9. [Routing](#9-routing)
10. [State Management](#10-state-management)
11. [Responsive Design](#11-responsive-design)
12. [Accessibility](#12-accessibility)
13. [Performance](#13-performance)
14. [Internationalization](#14-internationalization)
15. [Redesign Checklist](#15-redesign-checklist)

---

---

## 1. Technology Stack

### Current implementation

| Layer                  | Choice                                       | Version  | File                           |
| ---------------------- | -------------------------------------------- | -------- | ------------------------------ |
| Framework              | Astro                                        | ^4.16.19 | pps/web/package.json:20        |
| Component model        | Astro components (.astro)                    | —        | pps/web/src/components/*.astro |
| Styling                | Tailwind CSS v4 (via @tailwindcss/vite)      | ^4.3.3   | pps/web/package.json:22        |
| UI library integration | @astrojs/react (React 18)                    | ^3.6.3   | pps/web/package.json:17        |
| TypeScript             | TypeScript 5.4                               | ^5.4.0   | pps/web/package.json:36        |
| Linting                | ESLint 9 (flat config) + eslint-plugin-astro | ^9.0.0   | pps/web/eslint.config.js       |
| Formatting             | Prettier 3.2                                 | ^3.2.0   | pps/web/package.json:34        |
| Testing                | Vitest 1.3 (configured, zero tests written)  | ^1.3.0   | pps/web/package.json:37        |
| Build output           | Static (Astro output: 'static')              | —        | pps/web/astro.config.mjs:6     |
| Hosting target         | Cloudflare Pages (static dist)               | —        | pps/web/astro.config.mjs:7     |
| Alias                  | @semburat/web → /src                         | —        | pps/web/astro.config.mjs:13    |

### Astro configuration (pps/web/astro.config.mjs)

- output: 'static' — pre-rendered at build time, no server runtime.
- dapter: undefined — relies on Cloudflare Pages static hosting (no Astro adapter like Node or Cloudflare).
- integrations: [react()] — enables React component support (@astrojs/react).
- ite.plugins: [tailwind()] — Tailwind v4 via the Vite plugin (not the old PostCSS plugin).
- ite.resolve.alias — @semburat/web mapped to /src.

### Dependencies

**Runtime:**

- stro ^4.16.19
-

eact ^18.3.1
-

eact-dom ^18.3.1

- @astrojs/react ^3.6.3
- @astrojs/tailwind ^5.1.5
- @tailwindcss/vite ^4.3.3
- ailwindcss ^4.3.3

**Dev:**

- ypescript ^5.4.0
- eslint ^9.0.0
- @typescript-eslint/eslint-plugin ^8.71.1
- eslint-plugin-astro ^1.0.0
- prettier ^3.2.0
- itest ^1.3.0
- @vitest/coverage-v8 ^1.3.0
-

imraf ^5.0.0

### Known limitations

1. **No server-side rendering.** Static output means every page is pre-rendered. Dynamic per-user personalization is impossible without a server adapter.
2. **React is imported but barely used.** Only @astrojs/react is wired; no React components exist in src/. The dependency adds bundle weight without benefit.
3. **Tailwind v4 is new.** The @theme block in global.css uses Tailwind v4 syntax. Ensure the Tailwind version in
   ode_modules matches the config or utility classes will break.
4. **No monorepo package linking visible.** The pps/web/package.json does not declare workspace dependencies on packages/* (domain, shared, db). If those packages exist, they are not wired into the web build.
5. **No .env handling.** env.d.ts exists but there is no .env example or documented environment variable contract.

### Redesign notes

- **Drop React entirely** if no React components are needed. Remove @astrojs/react,
  eact,
  eact-dom to reduce bundle size.
- **Consider a hybrid render mode** (output: 'hybrid' with dapter: '@astrojs/cloudflare') if per-user or per-request logic is required later.
- **Pin Tailwind v4** and document the migration from v3 (the @theme block and @import 'tailwindcss' are v4 idioms).
- **Add an .env.example** and a typed config module (e.g., src/config.ts) for environment variables.

---
