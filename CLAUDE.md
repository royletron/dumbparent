# CLAUDE.md — AI Assistant Guide for Dumbparent

## Project Overview

**Dumbparent** is a static site providing plain-English guides for parents setting up devices and apps safely for kids. It is built with Astro, MDX, and Tailwind CSS, and deployed to Cloudflare Pages.

There is no database, no server-side rendering, and no authentication. All content lives as MDX files in `src/content/guides/`.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Astro ^5.0.0 (static output) |
| Content | MDX via `@astrojs/mdx` |
| Styling | Tailwind CSS ^3.4.0 + `@tailwindcss/typography` |
| Language | TypeScript (strict mode via `astro/tsconfigs/strict`) |
| Deployment | Cloudflare Pages via `wrangler.toml` |

---

## Development Commands

```bash
npm run dev       # Start dev server (http://localhost:4321)
npm run build     # Build static output to ./dist
npm run preview   # Serve the built ./dist locally
```

There is no test suite and no lint/format scripts configured.

---

## Project Structure

```
src/
├── components/        # Reusable Astro UI components
├── content/
│   ├── config.ts      # Zod content schema — source of truth for frontmatter
│   └── guides/        # MDX guide files (one file = one guide)
├── layouts/
│   ├── BaseLayout.astro   # Site shell: header, nav, footer
│   └── GuideLayout.astro  # Guide-specific layout with metadata header
├── pages/
│   ├── index.astro        # Homepage
│   ├── apps.astro         # All apps listing
│   ├── devices.astro      # All devices listing
│   ├── age/[age].astro    # Guides filtered by age group
│   ├── app/[app].astro    # Guides filtered by app
│   ├── device/[device].astro  # Guides filtered by device
│   └── guides/[...slug].astro # Individual guide pages
├── styles/
│   └── global.css         # Tailwind directives + global base/component layers
└── utils/
    └── guides.ts          # Query helpers for filtering/aggregating guides
public/
└── images/guides/         # Guide screenshots (referenced in frontmatter coverImage)
```

---

## Adding or Editing Guides

### File naming convention

Guide files live in `src/content/guides/` and follow `{device}-{app}.mdx`:

```
iphone-screen-time.mdx
ipad-youtube-kids.mdx
amazon-fire-device-setup.mdx
```

### Required frontmatter

All guides must satisfy the Zod schema in `src/content/config.ts`. Required fields:

```yaml
---
title: "Descriptive title"
description: "One-sentence summary"
ageGroups: ['under-5', '5-7']   # one or more of: under-5, 5-7, 8-10, 11-13, 14+
device: "iphone"                # URL-safe slug
deviceLabel: "iPhone"           # Human-readable label
app: "screen-time"              # URL-safe slug
appLabel: "Screen Time"         # Human-readable label
lastUpdated: 2024-01-15         # ISO date
---
```

Optional fields with defaults:

```yaml
timeRequired: "15 minutes"      # default
difficulty: "easy"              # easy | medium | hard (default: easy)
riskLevel: "medium"             # low | medium | high (default: medium)
riskSummary: "..."              # shown in callout if provided
companionRequired: false        # default
companionDevices: []
companionApps: []
coverImage: "/images/guides/..."
tags: []
```

Use `src/content/guides/TEMPLATE.mdx` as the starting point for any new guide.

### Available MDX components

Import from the relative path within the guide body:

```mdx
import Steps from '@components/Steps.astro';
import Step from '@components/Step.astro';
import Callout from '@components/Callout.astro';
import WhatToExpect from '@components/WhatToExpect.astro';
import CanDo from '@components/CanDo.astro';
import CannotDo from '@components/CannotDo.astro';
import CompanionBox from '@components/CompanionBox.astro';
```

**Steps / Step** — numbered sequence:
```mdx
<Steps>
  <Step>First action</Step>
  <Step>Second action</Step>
</Steps>
```

**Callout** — highlighted notice (type: `tip` | `info` | `warning` | `danger`):
```mdx
<Callout type="warning">Important caveat here.</Callout>
```

**WhatToExpect / CanDo / CannotDo** — access summary table:
```mdx
<WhatToExpect>
  <CanDo>Watch age-appropriate content</CanDo>
  <CannotDo>Access settings or purchase content</CannotDo>
</WhatToExpect>
```

**CompanionBox** — note about required companion device/app:
```mdx
<CompanionBox devices={['iphone']} apps={['family-link']} />
```

---

## Routing & Static Generation

All pages use `getStaticPaths()` — Astro pre-renders every route at build time. When adding a new guide, its routes in `age/`, `device/`, and `app/` are automatically included because those pages query all guides via the utils.

No new page files are needed when adding guides. Routes are data-driven.

---

## Styling Conventions

- Use **Tailwind utility classes** directly in templates. Avoid writing custom CSS unless strictly necessary.
- Custom global classes (`.card`, `.card-link`, `.skip-link`) are defined in `src/styles/global.css` under `@layer components`.
- The **custom colour palette** is defined in `tailwind.config.mjs`:
  - `brand-{50..900}` — blue scale used for primary UI
  - `risk.low` (green), `risk.medium` (amber), `risk.high` (red) — used in `RiskBadge.astro`
- **Typography** for guide body content uses the `prose` classes from `@tailwindcss/typography`.
- Component-scoped `<style>` blocks are acceptable for styles that cannot be expressed with utilities (e.g. CSS counters in `Steps.astro`).

---

## TypeScript Conventions

- The codebase uses **Astro strict TypeScript** (`astro/tsconfigs/strict`).
- Use `CollectionEntry<'guides'>` from `astro:content` when typing guide data.
- Path aliases are configured in `tsconfig.json`:
  - `@components/*` → `src/components/*`
  - `@layouts/*` → `src/layouts/*`
  - `@content/*` → `src/content/*`
  - `@utils/*` → `src/utils/*`

---

## Component Conventions

- Component files are **PascalCase** (`GuideCard.astro`, `RiskBadge.astro`).
- Every component should have a JSDoc comment at the top explaining its purpose and props.
- Components receive all data via **props** — no global state or stores.
- SVG icons are inlined directly in component files.

---

## Content & Data Conventions

- Guide **device** and **app** fields are lowercase kebab-case slugs used in URLs (e.g. `iphone`, `screen-time`).
- `getAllDevices()` and `getAllApps()` in `src/utils/guides.ts` deduplicate slugs across guides to build navigation.
- The `app` slug `"device-setup"` is excluded from the apps listing (it's a device-level guide, not an app).
- Guides are sorted newest-first by `lastUpdated` everywhere.

---

## Deployment

The site builds to `./dist` and is deployed to **Cloudflare Pages** using `wrangler`. The `wrangler.toml` sets the assets directory to `./dist`. No environment variables are required.

---

## What Not To Do

- Do not add a backend, database, or server-side routes — the site is intentionally fully static.
- Do not add a test framework unless the project explicitly needs one.
- Do not install additional dependencies without a clear requirement.
- Do not use `getStaticPaths()` logic that relies on external APIs or runtime data.
- Do not add `output: 'server'` or `output: 'hybrid'` to `astro.config.mjs`.
