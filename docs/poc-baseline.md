---
id: poc-baseline
title: "POC Validation Baseline"
doc_type: reference
audience: "Solidiom platform engineers"
tags: [poc, baseline, astro, validation]
lifecycle: archived
date: 2025-07-18
---

# POC Validation Baseline — `apps/docs-astro-poc`

> Snapshot date: 2025-07-18
> Purpose: Frozen reference of the validated POC state. Not a living document.

---

## 1. Dependency Versions

From `apps/docs-astro-poc/package.json`:

### Runtime dependencies

| Package                        | Version       |
| ------------------------------ | ------------- |
| `@astrojs/check`               | `^0.9.9`      |
| `@pagefind/default-ui`         | `1.5.2`       |
| `@astrojs/mdx`                 | `^7.0.3`      |
| `@solidiom/astrojs-solid-next` | `workspace:*` |
| `@solidiom/button`             | `workspace:*` |
| `@solidjs/web`                 | `catalog:`    |
| `@tailwindcss/vite`            | `^4.1.11`     |
| `astro`                        | `^7.1.0`      |
| `cookie`                       | `2.0.1`       |
| `shiki`                        | `^3.9.2`      |
| `solid-js`                     | `catalog:`    |
| `tailwindcss`                  | `^4.1.11`     |

### Dev dependencies

| Package      | Version  |
| ------------ | -------- |
| `pagefind`   | `^1.5.2` |
| `typescript` | `~6.0.3` |

### Engine constraint

```
"node": ">=24.0.0"
```

---

## 2. Astro Configuration Shape

```ts
// astro.config.ts
import { defineConfig } from "astro/config"
import mdx from "@astrojs/mdx"
import solid from "@solidiom/astrojs-solid-next"
import tailwind from "@tailwindcss/vite"

export default defineConfig({
  integrations: [mdx(), solid()],
  markdown: {
    syntaxHighlight: "shiki",
    shikiConfig: {
      theme: "github-dark",
    },
  },
  trailingSlash: "always",
  vite: {
    plugins: [tailwind()],
  },
})
```

Key decisions:

- **Integrations**: MDX for content authoring, Solid for interactive islands
- **Syntax highlighting**: Shiki with `github-dark` theme (built into Astro's markdown pipeline)
- **Trailing slash**: `always` — consistent URL structure for static hosting
- **Tailwind**: Applied via `@tailwindcss/vite` plugin in the Vite config (CSS 4, no PostCSS step)

---

## 3. Validation Checks (14/14 Pass)

| #   | Check                                  | Result |
| --- | -------------------------------------- | ------ |
| 1   | Integration package resolves           | ✅     |
| 2   | POC app scaffolded in workspace        | ✅     |
| 3   | Dev server starts cleanly              | ✅     |
| 4   | Type checking passes (`astro check`)   | ✅     |
| 5   | Production build succeeds              | ✅     |
| 6   | MDX content renders correctly          | ✅     |
| 7   | Component hydration works              | ✅     |
| 8   | Styling renders (Tailwind)             | ✅     |
| 9   | Code highlighting works (Shiki)        | ✅     |
| 10  | Navigation and heading anchors         | ✅     |
| 11  | Search works (Pagefind)                | ✅     |
| 12  | Accessibility basics pass              | ✅     |
| 13  | Build reproducibility (self-contained) | ✅     |
| 14  | Decision gate evaluated                | ✅     |

Full details with notes are in `apps/docs-astro-poc/FINDINGS.md`.

---

## 4. Compatibility Observations

| Concern                                                | Status                                            |
| ------------------------------------------------------ | ------------------------------------------------- |
| Solid 2 beta.21 with monorepo `pnpm.overrides`         | Works — no peer dependency conflicts              |
| `vite-plugin-solid@3.0.0-next.15` with Vite 8          | Compatible via Environment API                    |
| Node >=20 (relaxed from upstream's >=22.12)            | Validated — no Node 22-specific APIs used         |
| TypeScript 6 (`~6.0.3`)                                | No breaking changes vs. reference TS 5.8          |
| Peer dependency rules (`peerDependencyRules.allowAny`) | Suppresses beta version mismatch warnings cleanly |

---

## 5. Performance Observations

- **Static site generation** — zero-JS HTML by default; only hydrated islands ship client JS.
- **Deferred hydration (`client:visible`)** — island components hydrate on scroll, keeping initial load fast.
- **Pagefind client-side search** — static JSON index built at build time; no server infrastructure.
- **Tailwind CSS 4 via Vite plugin** — fast dev HMR, optimized production output, no separate PostCSS.
- **Minimal build output** — static HTML + small island bundles; no framework runtime on non-interactive pages.

---

## 6. Reproduction Commands

```sh
cd apps/docs-astro-poc
pnpm install
pnpm run check    # astro check — zero type errors
pnpm run build    # astro build + pagefind
pnpm run dev      # dev server boots clean
```

---

## 7. Lineage Note

`apps/site` was created from this validated configuration per SITE-001. The POC
(`apps/docs-astro-poc`) should remain unchanged until `apps/site` passes equivalent
checks (per `docs/website-imp.md` §2.1). Once equivalence is confirmed, the POC
may be removed.
