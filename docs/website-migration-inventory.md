# MIG-001: Website Migration Inventory

**Status:** Complete
**Source:** `apps/docs/` (Vite SPA with SolidJS Router)
**Target:** `apps/site/` (Astro static site with Solid islands)
**Date:** 2026-07-29

---

## 1. Application Architecture

| Aspect | `apps/docs` (legacy) | `apps/site` (target) |
|--------|---------------------|---------------------|
| Framework | Vite + SolidJS Router SPA | Astro 7 static site + Solid islands |
| Routing | Client-side (`@solidjs/router`) | File-based static generation |
| Rendering | Full client-side rendering | Static HTML + selective hydration |
| Styling | Tailwind CSS 4 (Vite plugin) | Tailwind CSS 4 (Vite plugin) |
| Search | None | Pagefind (build-time index) |
| Build output | Single bundle (index.html + JS) | Per-route static HTML |

---

## 2. Route Inventory

### 2.1 Top-level routes

| Route | Component | Content | Migration destination |
|-------|-----------|---------|----------------------|
| `/` | `Home` | Primitive directory listing | `/primitives/` (DOCS-001) |
| `/primitives/:name` | `PrimitivePage` | Per-primitive demo + code + API | `/primitives/[name]/` (DOCS-001, VS-001..004) |
| `/recipes` | `RecipesPage` | Recipe demo showcase | `/components/` or guide (RECIPE-005, MKT-002) |
| `/performance` | `PerformancePage` | Benchmark report viewer | Archive to `/docs/performance/` or remove |
| `/accessibility` | `AccessibilityPage` | Axe scan result viewer | `/accessibility/` (MKT-004, A11Y-003) |

### 2.2 Route coverage summary

| Category | Count | Notes |
|----------|------:|-------|
| Static pages | 4 | Home, Recipes, Performance, Accessibility |
| Dynamic pages | 52 | `/primitives/:name` × 52 primitives |
| **Total unique routes** | **56** | |

---

## 3. Component Inventory

### 3.1 Layout and navigation

| Component | File | Reused in apps/site? | Notes |
|-----------|------|---------------------|-------|
| `Layout` | `components/layout.tsx` | No — replaced | Astro layouts (SITE-004) |
| `Header` | `components/header.tsx` | No — replaced | `SiteHeader.astro` (SITE-005) |
| `Sidebar` | `components/sidebar.tsx` | No — replaced | Generated sidebar (DOCS-003) |
| `MobileSidebar` | `components/mobile-sidebar.tsx` | No — replaced | `DocsMobileNav` (SITE-007) |
| `ThemeToggle` | `components/theme-toggle.tsx` | No — replaced | `ThemeToggle.tsx` (SITE-009) |
| `Icons` | `components/icons.tsx` | No — rewrite | Shared icon approach needed |
| `ComponentPreview` | `components/component-preview.tsx` | No — rewrite | Astro + Solid island (VS-001..004) |
| `CodeBlock` | `components/code-block.tsx` | No — replaced | Server-side Shiki (SITE-008) |

### 3.2 Library utilities

| Utility | File | Reused? | Notes |
|---------|------|---------|-------|
| `primitives` | `lib/primitives.ts` | No — rewrite | Registry v2 replaces (REG-002) |
| `loadReport` | `lib/load-report.ts` | Migrate | Adapt to Astro build-time loading |
| `loadA11yReport` | `lib/load-a11y-report.ts` | No — rewrite | New evidence schema (A11Y-001) |

---

## 4. Demo Inventory

### 4.1 Primitive demos (52 files)

All in `apps/docs/src/demos/`:

| # | File | Primitive | Decision (per SITE-014) |
|---|------|-----------|------------------------|
| 1 | `accordion-demo.tsx` | Accordion | Rewrite |
| 2 | `alert-demo.tsx` | Alert | Rewrite |
| 3 | `alert-dialog-demo.tsx` | Alert Dialog | Rewrite |
| 4 | `avatar-demo.tsx` | Avatar | Rewrite |
| 5 | `badge-demo.tsx` | Badge | Migrate |
| 6 | `breadcrumb-demo.tsx` | Breadcrumb | Migrate |
| 7 | `button-demo.tsx` | Button | Rewrite |
| 8 | `calendar-demo.tsx` | Calendar | Rewrite |
| 9 | `card-demo.tsx` | Card | Migrate |
| 10 | `carousel-demo.tsx` | Carousel | Rewrite |
| 11 | `checkbox-demo.tsx` | Checkbox | Rewrite |
| 12 | `collapsible-demo.tsx` | Collapsible | Migrate |
| 13 | `combobox-demo.tsx` | Combobox | Rewrite |
| 14 | `command-palette-demo.tsx` | Command Palette | Rewrite |
| 15 | `context-menu-demo.tsx` | Context Menu | Rewrite |
| 16 | `data-table-demo.tsx` | Data Table | Rewrite |
| 17 | `date-picker-demo.tsx` | Date Picker | Rewrite |
| 18 | `dialog-demo.tsx` | Dialog | Rewrite |
| 19 | `drawer-demo.tsx` | Drawer | Rewrite |
| 20 | `empty-state-demo.tsx` | Empty State | Migrate |
| 21 | `field-demo.tsx` | Field | Rewrite |
| 22 | `hover-card-demo.tsx` | Hover Card | Rewrite |
| 23 | `input-demo.tsx` | Input | Rewrite |
| 24 | `input-otp-demo.tsx` | Input OTP | Rewrite |
| 25 | `kbd-demo.tsx` | Kbd | Migrate |
| 26 | `label-demo.tsx` | Label | Migrate |
| 27 | `listbox-demo.tsx` | Listbox | Rewrite |
| 28 | `menu-demo.tsx` | Menu | Rewrite |
| 29 | `meter-demo.tsx` | Meter | Migrate |
| 30 | `navigation-menu-demo.tsx` | Navigation Menu | Rewrite |
| 31 | `pagination-demo.tsx` | Pagination | Rewrite |
| 32 | `popover-demo.tsx` | Popover | Rewrite |
| 33 | `progress-demo.tsx` | Progress | Migrate |
| 34 | `radio-group-demo.tsx` | Radio Group | Rewrite |
| 35 | `range-calendar-demo.tsx` | Range Calendar | Rewrite |
| 36 | `resizable-panels-demo.tsx` | Resizable Panels | Rewrite |
| 37 | `scroll-area-demo.tsx` | Scroll Area | Migrate |
| 38 | `select-demo.tsx` | Select | Rewrite |
| 39 | `separator-demo.tsx` | Separator | Migrate |
| 40 | `sheet-demo.tsx` | Sheet | Rewrite |
| 41 | `skeleton-demo.tsx` | Skeleton | Migrate |
| 42 | `slider-demo.tsx` | Slider | Rewrite |
| 43 | `spinner-demo.tsx` | Spinner | Migrate |
| 44 | `switch-demo.tsx` | Switch | Rewrite |
| 45 | `tabs-demo.tsx` | Tabs | Rewrite |
| 46 | `toast-demo.tsx` | Toast | Rewrite |
| 47 | `toggle-demo.tsx` | Toggle | Migrate |
| 48 | `toggle-group-demo.tsx` | Toggle Group | Rewrite |
| 49 | `toolbar-demo.tsx` | Toolbar | Rewrite |
| 50 | `tooltip-demo.tsx` | Tooltip | Migrate |
| 51 | `tree-demo.tsx` | Tree | Rewrite |
| 52 | `virtual-list-demo.tsx` | Virtual List | Rewrite |
| 53 | `visually-hidden-demo.tsx` | Visually Hidden | Migrate |

### 4.2 Block demos (4 files)

In `apps/docs/src/demos/blocks/`:

| File | Block | Decision (per SITE-014) |
|------|-------|------------------------|
| `app-shell.tsx` | App Shell | Rewrite |
| `aspect-ratio.tsx` | Aspect Ratio | Retire |
| `chat-composer.tsx` | Chat Composer | Rewrite |
| `code-block.tsx` | Code Block | Retire |

### 4.3 Recipe demos (7 files)

In `apps/docs/src/demos/recipes/`:

| File | Recipe | Decision (per SITE-014) |
|------|--------|------------------------|
| `button-recipe-demo.tsx` | Button recipe | Migrate |
| `checkbox-recipe-demo.tsx` | Checkbox recipe | Migrate |
| `dialog-recipe-demo.tsx` | Dialog recipe | Migrate |
| `prose-recipe-demo.tsx` | Prose recipe | Rewrite |
| `switch-recipe-demo.tsx` | Switch recipe | Migrate |
| `tabs-recipe-demo.tsx` | Tabs recipe | Migrate |
| `typeset-recipe-demo.tsx` | Typeset recipe | Rewrite |

---

## 5. Report and Data Artifacts

| Artifact | Location | Migration destination |
|----------|----------|----------------------|
| Benchmark results | `artifacts/bench-results.json` | Archive in `docs/` or integrate into site performance page |
| Axe scan results | `artifacts/axe-results.json` | Per-primitive evidence artifacts (A11Y-001) |
| Axe report | `docs/axe-scan-results.md` | Generated from new evidence pipeline |

---

## 6. Dependency Summary

### 6.1 Runtime dependencies unique to apps/docs

| Package | Version | Needed in apps/site? |
|---------|---------|---------------------|
| `@solidjs/router` | `0.17.0-next.5` | No — Astro file routing |
| `@solidjs/web` | `2.0.0-beta.21` | Yes — via catalog (newer) |
| `solid-js` | `2.0.0-beta.21` | Yes — via catalog (newer) |
| `shiki` | `^1.29.2` | Yes — already upgraded to `3.23.0` |
| All 52 `@solidiom/*` primitives | `workspace:*` | Selectively, for live demos |
| `@solidiom/recipes-tailwind` | `workspace:*` | For recipe demos |

### 6.2 Version drift

| Package | apps/docs | Workspace override | Status |
|---------|-----------|-------------------|--------|
| `solid-js` | `2.0.0-beta.21` | `2.0.0-beta.24` | **3 versions behind** |
| `@solidjs/web` | `2.0.0-beta.21` | `2.0.0-beta.24` | **3 versions behind** |
| `shiki` | `^1.29.2` | N/A (site uses `3.23.0`) | **Major version behind** |

---

## 7. Redirect Requirements

When `apps/docs` is removed (CUT-003), these redirects must be configured:

| Legacy path | Target | Type |
|-------------|--------|------|
| `/` | `https://solidiom.org/primitives/` | 301 |
| `/primitives/:name` | `https://solidiom.org/primitives/:name/` | 301 |
| `/recipes` | `https://solidiom.org/components/` | 301 |
| `/performance` | `https://solidiom.org/docs/performance/` or remove | 301 or 410 |
| `/accessibility` | `https://solidiom.org/accessibility/` | 301 |

---

## 8. Migration Constraints

1. `apps/docs` must remain functional and read-only (MIG-002) until CUT-003.
2. No demo may be copied directly to `apps/site` without behavior/a11y review (SITE-014).
3. Version drift means demos may need API adjustments for beta.24.
4. The SPA routing model (hash-based navigation, client-side transitions) has no equivalent in the static site — all navigation is full-page.
5. The `ComponentPreview` pattern must be redesigned for server-rendered code blocks with optional hydrated interaction.
