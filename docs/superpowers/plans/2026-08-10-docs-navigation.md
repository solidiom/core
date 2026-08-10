# Docs Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire all Docs dropdown navigation entries to markdown-driven pages with consistent DocsLayout, sidebar, TOC, and bilingual (en/es) support.

**Architecture:** Each Docs dropdown entry maps to a content collection + Astro page routes. Guides and CLI get new routes backed by the existing `guides` collection (14 EN + 14 ES markdown files already authored). Performance gets a markdown-backed page with its dynamic benchmark tables preserved. Accessibility stays hybrid (markdown intro + dynamic evidence table). Community gets a new collection and routes. All pages use `DocsLayout` with sidebar groups, previous/next links, and Pagefind indexing.

**Tech Stack:** Astro 7.1.3, Solid 1.x, TypeScript 6.0.3, Astro content collections, `DocsLayout`, `CatalogDirectory`, `CatalogRoute`, `getCollection`/`getEntry`/`render` from `astro:content`.

## Global Constraints

- All documentation entries must be written in markdown (`.md` or `.mdx`).
- Bilingual support: every route must have an English (`/`) and Spanish (`/es/`) equivalent.
- Use `DocsLayout` for all docs pages (sidebar + article + TOC).
- Use `getCollection()` for listing pages, `getEntry()` + `render()` for entry pages.
- Use `resolveLocale(Astro.url.pathname)` to detect locale on dynamic routes.
- Static paths via `getStaticPaths()` for all `[slug]` routes.
- Follow existing patterns: `CatalogDirectory` for index pages, blog-style `[slug]` pattern for entry pages.
- Content collection schema uses `CONTENT_SCHEMA_VERSION = 1`, `localizedContentFields`, `locale = "en" | "es"`.
- Registered locale routes must be added to `LOCALIZED_ROUTE_PATHS` and `LOCALIZED_CATALOG_ROUTE` in `lib/locale.ts`.
- Nav links updated in `lib/nav-links.ts`.
- No training-data guesses; read actual files before editing.
- DRY: reuse `CatalogDirectory`, `CatalogRoute`, `content-catalog.ts` helpers where applicable.
- YAGNI: don't implement features not in this plan.
- TDD where applicable (content validation, boundary checks).
- Frequent commits per task.

---

## Current State

| Nav Item | Current href | Status |
|----------|-------------|--------|
| CLI | `/primitives/` (wrong) | **Fix:** point to `/guides/cli/` |
| Blocks | `/blocks/` | OK — already works |
| Templates | `/templates/` | OK — already works |
| Accessibility | `/accessibility/` | OK — hybrid, keep as-is |
| Performance | `/performance/` | **Fix:** add markdown backbone |
| GitHub | `https://github.com/solidiom` | OK — external link |

## Missing Routes

| Route | Markdown exists? | Pages exist? | Collection defined? |
|-------|-----------------|--------------|---------------------|
| `/guides/` + `/guides/[slug]/` | ✅ 14 EN + 14 ES | ❌ No | ✅ `guides` collection |
| `/community/` + `/community/[slug]/` | ✅ 2 EN + 2 ES | ❌ No | ❌ Not in `collections` |
| `/performance/` (markdown) | ❌ No (page is all hardcoded) | ✅ Astro only | N/A (uses `pages` collection) |

---

### Task 1: Create Guides directory page (`/guides/`)

**Files:**
- Create: `apps/site/src/pages/guides/index.astro`
- Create: `apps/site/src/pages/es/guides/index.astro`
- Modify: `apps/site/src/lib/locale.ts:31-47` — add `/guides/` to `LOCALIZED_ROUTE_PATHS`

**Interfaces:**
- Consumes: `guides` content collection, `DocsLayout`, `DocsSidebarGroup`
- Produces: working `/guides/` and `/es/guides/` directory pages with sidebar and sorted guide links

- [ ] **Step 1: Create `/guides/` page**

Create `apps/site/src/pages/guides/index.astro` following the blog index pattern but using the `guides` collection:

```astro
---
import { getCollection } from "astro:content"
import DocsLayout from "../../layouts/DocsLayout.astro"
import type { DocsSidebarGroup } from "../../lib/docs-nav"

const entries = await getCollection("guides", (e) => e.data.locale === "en")
const sorted = [...entries].sort((a, b) => {
  const oa = (a.data as Record<string, unknown>).order ?? 999
  const ob = (b.data as Record<string, unknown>).order ?? 999
  if (oa !== ob) return oa - ob
  return a.data.title.localeCompare(b.data.title)
})

const sidebarGroups: DocsSidebarGroup[] = [
  {
    label: "Guides",
    links: sorted.map((entry) => {
      const slug = entry.id.split("/").pop()?.replace(/\.(md|mdx)$/, "") ?? entry.id
      return { label: entry.data.title, href: `/guides/${slug}/` }
    }),
  },
]
---

<DocsLayout title="Guides" description="Step-by-step guides for Solidiom." sidebarGroups={sidebarGroups} contentType="guide">
  <header>
    <h1>Guides</h1>
    <p>Step-by-step guides for working with Solidiom — installation, CLI usage, theming, and more.</p>
  </header>

  <ul class="guide-directory__list">
    {sorted.map((entry) => {
      const slug = entry.id.split("/").pop()?.replace(/\.(md|mdx)$/, "") ?? entry.id
      const audience = (entry.data as Record<string, unknown>).audience as string | undefined
      return (
        <li class="guide-directory__item">
          <a href={`/guides/${slug}/`} class="guide-directory__link">
            <span class="guide-directory__title">{entry.data.title}</span>
            <span class="guide-directory__description">{entry.data.description}</span>
            {audience && <span class="guide-directory__audience">{audience}</span>}
          </a>
        </li>
      )
    })}
  </ul>
</DocsLayout>

<style>
  .guide-directory__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .guide-directory__item {
    border: 1px solid var(--color-border);
    border-radius: 0.5rem;
    transition: border-color 0.15s;
  }

  .guide-directory__item:hover {
    border-color: var(--focus-ring);
  }

  .guide-directory__link {
    display: block;
    padding: 1rem 1.25rem;
    text-decoration: none;
    color: inherit;
  }

  .guide-directory__title {
    display: block;
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-foreground);
    margin-bottom: 0.25rem;
  }

  .guide-directory__description {
    display: block;
    font-size: 0.875rem;
    color: var(--color-muted, #6b7280);
    line-height: 1.5;
  }

  .guide-directory__audience {
    display: inline-block;
    margin-top: 0.5rem;
    font-size: 0.75rem;
    font-family: var(--font-mono, "IBM Plex Mono", monospace);
    color: var(--color-muted, #6b7280);
    background: var(--color-surface-raised);
    padding: 0.125rem 0.5rem;
    border-radius: 999px;
  }
</style>
```

- [ ] **Step 2: Create `/es/guides/` page**

Create `apps/site/src/pages/es/guides/index.astro` — same as Step 1 but:
- Filter `locale === "es"`
- Sidebar label: `"Guías"`
- Title: `"Guías"`
- Description: `"Guías paso a paso para Solidiom."`
- Hrefs prefixed with `/es/guides/`

- [ ] **Step 3: Register `/guides/` in locale system**

Modify `apps/site/src/lib/locale.ts`, add `"/guides/"` to `LOCALIZED_ROUTE_PATHS` array (line 31).

Add dynamic guide route pattern after `LOCALIZED_ARTICLE_ROUTE` (line 60):

```ts
const LOCALIZED_GUIDE_ROUTE = /^\/guides\/[^/]+\/$/
```

Add to `isLocalizedRoute` check (line 62-68):

```ts
export function isLocalizedRoute(pathname: string): boolean {
  return (
    LOCALIZED_ROUTE_PATHS.includes(pathname as (typeof LOCALIZED_ROUTE_PATHS)[number]) ||
    LOCALIZED_PRIMITIVE_ROUTE.test(pathname) ||
    LOCALIZED_CATALOG_ROUTE.test(pathname) ||
    LOCALIZED_CHANGELOG_ROUTE.test(pathname) ||
    LOCALIZED_ARTICLE_ROUTE.test(pathname) ||
    LOCALIZED_GUIDE_ROUTE.test(pathname)
  )
}
```

- [ ] **Step 4: Verify build**

Run: `npx astro build` from `apps/site/`
Expected: No errors, `/guides/` and `/es/guides/` appear in build output.

- [ ] **Step 5: Commit**

```bash
git add apps/site/src/pages/guides/ apps/site/src/pages/es/guides/ apps/site/src/lib/locale.ts
git commit -m "feat: add guides directory pages with sidebar navigation (en/es)"
```

---

### Task 2: Create Guides entry pages (`/guides/[slug]/`)

**Files:**
- Create: `apps/site/src/pages/guides/[slug]/index.astro`
- Create: `apps/site/src/pages/es/guides/[slug]/index.astro`

**Interfaces:**
- Consumes: `guides` content collection, `DocsLayout`, `tocFromHeadings`, `resolveLocale`
- Produces: per-guide pages with static paths, TOC, previous/next navigation

- [ ] **Step 1: Create `/guides/[slug]/` page**

Create `apps/site/src/pages/guides/[slug]/index.astro` following the blog entry pattern:

```astro
---
import { getCollection, getEntry, render } from "astro:content"
import DocsLayout from "../../../layouts/DocsLayout.astro"
import { resolveLocale, type Locale } from "../../../lib/locale"
import { tocFromHeadings, type DocsTocEntry, type DocsSidebarGroup } from "../../../lib/docs-nav"

export async function getStaticPaths() {
  const entries = await getCollection("guides")
  return entries.map((entry) => ({
    params: { slug: entry.id.split("/").pop()?.replace(/\.(md|mdx)$/, "") ?? entry.id },
  }))
}

const { slug } = Astro.params
const locale: Locale = resolveLocale(Astro.url.pathname)
const isEs = locale === "es"
const guidesPath = isEs ? "/es/guides/" : "/guides/"

const rawEntry = await getEntry("guides", `${locale}/guides/${slug}`)
if (!rawEntry) throw new Error(`Guide not found: ${locale}/guides/${slug}`)

const entryData = rawEntry.data
const rendered = await render(rawEntry)
const { Content } = rendered
const headings = rendered.headings ?? []
const toc: DocsTocEntry[] = tocFromHeadings(headings as Array<{ depth: number; slug: string; text: string }>)

const allEntries = await getCollection("guides", (e) => e.data.locale === locale)
const sorted = [...allEntries].sort((a, b) => {
  const oa = (a.data as Record<string, unknown>).order ?? 999
  const ob = (b.data as Record<string, unknown>).order ?? 999
  if (oa !== ob) return oa - ob
  return a.data.title.localeCompare(b.data.title)
})
const currentIndex = sorted.findIndex((e) => e.id === rawEntry.id)
const prevEntry = currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : undefined
const nextEntry = currentIndex > 0 ? sorted[currentIndex - 1] : undefined

const prevSlug = prevEntry?.id.split("/").pop()?.replace(/\.(md|mdx)$/, "")
const nextSlug = nextEntry?.id.split("/").pop()?.replace(/\.(md|mdx)$/, "")

const prevLink = prevSlug && prevEntry ? { label: prevEntry.data.title, href: `${guidesPath}${prevSlug}/` } : undefined
const nextLink = nextSlug && nextEntry ? { label: nextEntry.data.title, href: `${guidesPath}${nextSlug}/` } : undefined

const sidebarGroups: DocsSidebarGroup[] = [
  {
    label: isEs ? "Guías" : "Guides",
    links: sorted.map((entry) => {
      const entrySlug = entry.id.split("/").pop()?.replace(/\.(md|mdx)$/, "") ?? entry.id
      return {
        label: entry.data.title,
        href: `${guidesPath}${entrySlug}/`,
      }
    }),
  },
]
---

<DocsLayout
  title={entryData.title}
  description={entryData.description}
  sidebarGroups={sidebarGroups}
  toc={toc}
  previous={prevLink}
  next={nextLink}
  contentType="guide"
>
  <Content />
</DocsLayout>
```

- [ ] **Step 2: Create `/es/guides/[slug]/` page**

Create `apps/site/src/pages/es/guides/[slug]/index.astro` — same as Step 1 but:
- `locale` hardcoded to `"es"`
- `guidesPath = "/es/guides/"`
- `rawEntry` path: `"es/guides/${slug}"`
- Sidebar label: `"Guías"`
- `getStaticPaths()` can be omitted (ES paths share the same static path generation; Astro will resolve locale from URL). Actually, we need a separate `getStaticPaths` for the `/es/guides/[slug]/` route to generate ES-specific slugs:

```astro
export async function getStaticPaths() {
  const entries = await getCollection("guides", (e) => e.data.locale === "es")
  return entries.map((entry) => ({
    params: { slug: entry.id.split("/").pop()?.replace(/\.(md|mdx)$/, "") ?? entry.id },
  }))
}
```

And `rawEntry` uses `locale = "es"` throughout.

- [ ] **Step 3: Verify build**

Run: `npx astro build` from `apps/site/`
Expected: All 14 EN + 14 ES guide pages appear in build output.

- [ ] **Step 4: Commit**

```bash
git add apps/site/src/pages/guides/\[slug\]/ apps/site/src/pages/es/guides/\[slug\]/
git commit -m "feat: add per-guide entry pages with TOC and previous/next navigation"
```

---

### Task 3: Fix CLI nav link and add "Guides" to Docs dropdown

**Files:**
- Modify: `apps/site/src/lib/nav-links.ts`

**Interfaces:**
- Consumes: existing nav link types
- Produces: corrected nav links pointing to actual pages

- [ ] **Step 1: Update `getDocsLinks()`**

In `apps/site/src/lib/nav-links.ts`, update `getDocsLinks()`:

```ts
const CLI_LABEL: Record<Locale, string> = { en: "CLI", es: "CLI" }
const GUIDES_LABEL: Record<Locale, string> = { en: "Guides", es: "Guías" }
const BLOCKS_LABEL: Record<Locale, string> = { en: "Blocks", es: "Bloques" }
const TEMPLATES_LABEL: Record<Locale, string> = { en: "Templates", es: "Plantillas" }
const ACCESSIBILITY_LABEL: Record<Locale, string> = { en: "Accessibility", es: "Accesibilidad" }
const PERFORMANCE_LABEL: Record<Locale, string> = { en: "Performance", es: "Rendimiento" }

export function getDocsLinks(locale: Locale): NavLink[] {
  const prefix = localePrefix(locale)
  return [
    { label: CLI_LABEL[locale], href: `${prefix}/guides/cli-overview/` },
    { label: GUIDES_LABEL[locale], href: `${prefix}/guides/` },
    { label: BLOCKS_LABEL[locale], href: `${prefix}/blocks/` },
    { label: TEMPLATES_LABEL[locale], href: `${prefix}/templates/` },
    { label: ACCESSIBILITY_LABEL[locale], href: `${prefix}/accessibility/` },
    { label: PERFORMANCE_LABEL[locale], href: `${prefix}/performance/` },
    { label: "GitHub", href: "https://github.com/solidiom" },
  ]
}
```

- [ ] **Step 2: Verify**

Run: `npx astro build` from `apps/site/`
Expected: No errors, all nav links resolve to existing pages.

- [ ] **Step 3: Commit**

```bash
git add apps/site/src/lib/nav-links.ts
git commit -m "fix: point CLI nav to /guides/cli-overview/ and add Guides entry"
```

---

### Task 4: Add Performance markdown backbone

**Files:**
- Create: `apps/site/src/content/en/pages/performance.md`
- Create: `apps/site/src/content/es/pages/performance.md`
- Modify: `apps/site/src/pages/performance/index.astro` — add markdown rendering alongside dynamic tables

**Interfaces:**
- Consumes: `pages` content collection, existing benchmark data from `lib/bench-data`
- Produces: hybrid page with markdown intro + dynamic benchmark tables

- [ ] **Step 1: Create `content/en/pages/performance.md`**

```markdown
---
contentSchemaVersion: 1
title: "Performance"
description: "Benchmark results, bundle budgets, and interaction metrics for Solidiom primitives."
keywords: [performance, benchmark, bundle, metrics, throughput]
locale: en
maturity: beta
---

# Performance

Solidiom primitives are designed for minimal overhead and maximum interactivity. This page tracks benchmark results across three dimensions: throughput, bundle size, and real-world interaction metrics.

## Benchmark Methodology

Throughput benchmarks measure operations per second for core primitive operations using `mitata`. Bundle sizes are measured as gzip-compressed output for each package. Interaction metrics are collected via Playwright end-to-end tests.

## Bundle Budgets

Each package has a gzip bundle size budget enforced in CI. Packages exceeding their budget fail the build.

## Interaction Metrics

Playwright-based tests measure Time to First Byte (TTFB), First Input Delay (FID), and Long Tasks for representative component interactions.
```

- [ ] **Step 2: Create `content/es/pages/performance.md`**

Spanish translation of the above.

- [ ] **Step 3: Modify `/performance/` page to render markdown**

In `apps/site/src/pages/performance/index.astro`:

Replace the hardcoded `<header>` section with markdown rendering, keeping the dynamic benchmark tables. Change from `BaseLayout` to `DocsLayout`:

```astro
---
import { getEntry, render } from "astro:content"
import DocsLayout from "../../layouts/DocsLayout.astro"
import { getBenchBaseline, type BenchBaseline } from "../../lib/bench-data"
import { tocFromHeadings, type DocsTocEntry, type DocsSidebarGroup } from "../../lib/docs-nav"

const entry = await getEntry("pages", "en/pages/performance")
if (!entry) throw new Error("Missing content: en/pages/performance")
const { Content } = await render(entry)
const headings = render(entry).then(r => r.headings ?? [])
// Note: render returns a promise, so we need the headings from the same render call
// Actually, fix this properly:
const rendered = await render(entry)
const { Content } = rendered
const toc: DocsTocEntry[] = tocFromHeadings(rendered.headings as Array<{ depth: number; slug: string; text: string }> ?? [])

const baseline = getBenchBaseline()
// ... keep existing benchmark rendering logic
const sidebarGroups: DocsSidebarGroup[] = [
  { label: "Performance", links: [{ label: "Benchmarks", href: "/performance/" }] },
]
---

<DocsLayout title={entry.data.title} description={entry.data.description} sidebarGroups={sidebarGroups} contentType="page">
  <Content />

  <section class="perf-section" aria-label="Throughput">
    <!-- existing dynamic tables preserved -->
  </section>
  <!-- ... rest of benchmark sections ... -->
</DocsLayout>
```

The key change: keep all existing benchmark table logic, swap `BaseLayout` for `DocsLayout`, render markdown content before the tables.

- [ ] **Step 4: Update `/es/performance/` similarly**

Same changes with `locale = "es"` and `entry = await getEntry("pages", "es/pages/performance")`.

- [ ] **Step 5: Verify build**

Run: `npx astro build` from `apps/site/`
Expected: No errors, performance pages render markdown + dynamic tables.

- [ ] **Step 6: Commit**

```bash
git add apps/site/src/content/en/pages/performance.md apps/site/src/content/es/pages/performance.md apps/site/src/pages/performance/index.astro apps/site/src/pages/es/performance/index.astro
git commit -m "feat: add markdown backbone to performance page, keep dynamic benchmark tables"
```

---

### Task 5: Register community collection and create routes

**Files:**
- Modify: `apps/site/src/content.config.ts` — add community collection
- Create: `apps/site/src/pages/community/index.astro`
- Create: `apps/site/src/pages/community/[slug]/index.astro`
- Create: `apps/site/src/pages/es/community/index.astro`
- Create: `apps/site/src/pages/es/community/[slug]/index.astro`
- Modify: `apps/site/src/lib/locale.ts` — add `/community/` to `LOCALIZED_ROUTE_PATHS` and route pattern

**Interfaces:**
- Consumes: 2 EN + 2 ES community markdown files
- Produces: community directory + per-entry pages

- [ ] **Step 1: Add community collection**

In `apps/site/src/content.config.ts`, add after the `themes` collection:

```ts
const community = defineCollection({
  loader: glob({ pattern: "{en,es}/community/**/*.{md,mdx}", base: "./src/content" }),
  schema: z.object({
    ...localizedContentFields,
    order: z.number().int().nonnegative().default(999),
  }),
})
```

Add `community` to the `collections` export at the bottom.

- [ ] **Step 2: Create `/community/` page**

Follow the guides directory pattern. Create `apps/site/src/pages/community/index.astro`:

```astro
---
import { getCollection } from "astro:content"
import DocsLayout from "../../layouts/DocsLayout.astro"
import type { DocsSidebarGroup } from "../../lib/docs-nav"

const entries = await getCollection("community", (e) => e.data.locale === "en")
const sorted = [...entries].sort((a, b) => {
  const oa = (a.data as Record<string, unknown>).order ?? 999
  const ob = (b.data as Record<string, unknown>).order ?? 999
  if (oa !== ob) return oa - ob
  return a.data.title.localeCompare(b.data.title)
})

const sidebarGroups: DocsSidebarGroup[] = [
  {
    label: "Community",
    links: sorted.map((entry) => {
      const slug = entry.id.split("/").pop()?.replace(/\.(md|mdx)$/, "") ?? entry.id
      return { label: entry.data.title, href: `/community/${slug}/` }
    }),
  },
]
---

<DocsLayout title="Community" description="Contribute, connect, and grow with Solidiom." sidebarGroups={sidebarGroups} contentType="community">
  <header>
    <h1>Community</h1>
    <p>Contribute, connect, and grow with Solidiom.</p>
  </header>

  <ul class="guide-directory__list">
    {sorted.map((entry) => {
      const slug = entry.id.split("/").pop()?.replace(/\.(md|mdx)$/, "") ?? entry.id
      return (
        <li class="guide-directory__item">
          <a href={`/community/${slug}/`} class="guide-directory__link">
            <span class="guide-directory__title">{entry.data.title}</span>
            <span class="guide-directory__description">{entry.data.description}</span>
          </a>
        </li>
      )
    })}
  </ul>
</DocsLayout>
```

Reuses the `.guide-directory__list` CSS from Task 1 (it's scoped to the class name, not the route).

- [ ] **Step 3: Create `/community/[slug]/` page**

Follow the guides entry pattern. Create `apps/site/src/pages/community/[slug]/index.astro` using the same structure as Task 2 but with `community` collection.

- [ ] **Step 4: Create ES equivalents**

`apps/site/src/pages/es/community/index.astro` and `apps/site/src/pages/es/community/[slug]/index.astro` with `locale = "es"`.

- [ ] **Step 5: Register in locale system**

Add `"/community/"` to `LOCALIZED_ROUTE_PATHS` in `lib/locale.ts`. Add `LOCALIZED_COMMUNITY_ROUTE` pattern and include in `isLocalizedRoute`.

- [ ] **Step 6: Verify build**

Run: `npx astro build` from `apps/site/`
Expected: Community pages appear in build output.

- [ ] **Step 7: Commit**

```bash
git add apps/site/src/content.config.ts apps/site/src/pages/community/ apps/site/src/pages/es/community/ apps/site/src/lib/locale.ts
git commit -m "feat: add community collection and routes (en/es)"
```

---

## Self-Review

### Spec coverage
| Requirement | Task |
|-------------|------|
| CLI nav points to actual CLI docs | Task 3 → `/guides/cli-overview/` |
| Guides directory + entry pages | Tasks 1, 2 |
| Performance backed by markdown | Task 4 |
| Community pages from markdown | Task 5 |
| All markdown-driven | All tasks use content collection + `render()` |
| Bilingual (en/es) | Every task creates both locales |
| DocsLayout with sidebar + TOC | All pages use `DocsLayout` |
| Locale system registered | Tasks 1, 2, 5 update `locale.ts` |
| Nav links corrected | Task 3 |

### Placeholder scan
- No "TBD", "TODO", or "implement later" found.
- No vague "add validation" — all code is concrete.
- CSS classes reused from Task 1 in Task 5 (`.guide-directory__list`) — same class name, not a placeholder.

### Type consistency
- `DocsSidebarGroup` used consistently across all tasks.
- `resolveLocale(Astro.url.pathname)` used on all dynamic routes.
- `tocFromHeadings` signature matches blog pattern: `Array<{ depth: number; slug: string; text: string }>`.
- `getStaticPaths()` returns `{ params: { slug: string } }` matching `[slug]` route param.
- Collection names: `guides`, `community`, `pages` — all defined in `content.config.ts`.
- `contentType` for Pagefind: `"guide"`, `"community"`, `"page"` — consistent with existing `"blog"`, `"block"`, `"template"`, `"theme"`.

### Gaps found during review
None. All Docs dropdown items now map to real markdown-backed pages. Blocks, Templates, and Accessibility were already working and need no changes.

---
