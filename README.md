# Dumb Parent

**Plain-English guides for parents setting up devices and apps safely for their kids.**

A statically-generated [Astro](https://astro.build) site where every guide is a single MDX file. No database, no CMS — just files you can edit in any text editor or via a GitHub pull request.

---

## Getting started (development)

```bash
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) in your browser.

---

## Writing a guide

All guides live in `src/content/guides/`. Each guide is one `.mdx` file.

### 1. Copy the template

```bash
cp src/content/guides/TEMPLATE.mdx src/content/guides/your-device-your-app.mdx
```

**Naming convention:** `[device]-[app].mdx` — all lowercase, words separated by hyphens.

Examples:
- `ipad-roblox.mdx`
- `android-tablet-youtube-kids.mdx`
- `nintendo-switch-device-setup.mdx`

The filename becomes the URL: `/guides/ipad-roblox`

### 2. Fill in the frontmatter

Open your new file and fill in the fields at the top between the `---` markers.
Every field is documented with a comment in `TEMPLATE.mdx`. The required fields are:

| Field | What it is |
|---|---|
| `title` | Short headline for the guide |
| `description` | One or two sentence summary |
| `ageGroups` | Which age groups this applies to |
| `device` | Device slug (e.g. `ipad`) |
| `deviceLabel` | Human-readable device name (e.g. `iPad`) |
| `app` | App slug (e.g. `roblox`) — use `device-setup` for general device guides |
| `appLabel` | Human-readable app name (e.g. `Roblox`) |
| `riskLevel` | `low`, `medium`, or `high` |
| `lastUpdated` | Date you last checked the instructions are accurate (`YYYY-MM-DD`) |

### 3. Write the guide body

Below the second `---`, import the components you need and write your guide
using Markdown and components.

#### Available components

| Component | Purpose | Example |
|---|---|---|
| `<Steps>` + `<Step>` | Numbered setup steps | See existing guides |
| `<Callout type="tip">` | Green hint box | A helpful shortcut |
| `<Callout type="info">` | Blue note box | Neutral information |
| `<Callout type="warning">` | Amber warning box | Something to be careful about |
| `<Callout type="danger">` | Red danger box | A known side-door or risk |
| `<WhatToExpect>` + `<CanDo>` + `<CannotDo>` | Access summary table | What the child can/cannot do |

Each component file in `src/components/` has a JSDoc comment at the top
explaining how to use it.

### 4. Add images (optional)

Save screenshots to `public/images/guides/` and reference them in your MDX:

```md
![Alt text describing the screenshot](/images/guides/your-image.jpg)
```

Images render responsively and get a rounded border automatically.

---

## Project structure

```
src/
├── content/
│   ├── config.ts          — Content collection schema (field definitions)
│   └── guides/            — One .mdx file per guide
│       ├── TEMPLATE.mdx   — Copy this to start a new guide
│       └── ...
├── components/
│   ├── Steps.astro        — Wrapper for numbered steps
│   ├── Step.astro         — A single numbered step
│   ├── Callout.astro      — Tip / info / warning / danger boxes
│   ├── WhatToExpect.astro — "What can my child access?" section
│   ├── CanDo.astro        — Green checkmark row in WhatToExpect
│   ├── CannotDo.astro     — Red X row in WhatToExpect
│   ├── GuideCard.astro    — Summary card shown on browse pages
│   ├── RiskBadge.astro    — Coloured risk level badge
│   ├── DifficultyBadge.astro — Easy / Medium / Advanced badge
│   ├── AgeTag.astro       — Age group pill tag
│   └── CompanionBox.astro — "You'll need a companion device" notice
├── layouts/
│   ├── BaseLayout.astro   — Site shell (nav + footer)
│   └── GuideLayout.astro  — Individual guide page layout
├── pages/
│   ├── index.astro        — Homepage
│   ├── devices.astro      — Browse all devices
│   ├── apps.astro         — Browse all apps
│   ├── age/[age].astro    — Guides by age group
│   ├── device/[device].astro — Guides by device
│   ├── app/[app].astro    — Guides by app
│   └── guides/[...slug].astro — Individual guide page
├── utils/
│   └── guides.ts          — Helper functions for querying guides
└── styles/
    └── global.css         — Tailwind imports + global styles
public/
└── images/
    └── guides/            — Put guide screenshots here
```

---

## Tech stack

- **[Astro](https://astro.build)** — static site generator
- **[MDX](https://mdxjs.com)** — Markdown with component support for guide content
- **[Tailwind CSS](https://tailwindcss.com)** — utility-first styling
- **[@tailwindcss/typography](https://tailwindcss.com/docs/typography-plugin)** — styles for MDX prose content
- **TypeScript** — type safety for content schemas and components

---

## Contributing

1. Fork the repo and create a branch: `git checkout -b add-guide-ipad-roblox`
2. Copy `TEMPLATE.mdx`, fill it in, and write your guide
3. Run `npm run dev` and check it looks right
4. Open a pull request — the title should be `Add guide: [Device] + [App]`

Please keep guides factual, calm in tone, and up to date. If instructions
change (apps update frequently), open a PR to fix them.
