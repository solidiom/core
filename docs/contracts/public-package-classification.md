---
id: C11-public-package-classification
title: "Public-package classification — every publishable-but-untracked package resolved"
doc_type: contract
tags: [packages, classification, C11]
lifecycle: current
---

# Public-package classification

**Invariant:** No publishable package sits outside the public catalog or an explicit non-public set.

## Categories

| Category           | Meaning                                                                        | Changesets                  |
| ------------------ | ------------------------------------------------------------------------------ | --------------------------- |
| `public-catalog`   | Tracked in registry, published to npm as part of the core product              | versioned and released      |
| `public-tooling`   | Published to npm but not a registry-listed component; developer-facing tooling | versioned and released      |
| `private-internal` | Not published; internal development infrastructure                             | in Changesets `ignore` list |
| `private-legacy`   | Deprecated, frozen, marked for removal                                         | in Changesets `ignore` list |

## Complete package inventory

### Primitives (layer:primitive) — `public-catalog`

| Package                      | Name                  | Category       | Notes                                               |
| ---------------------------- | --------------------- | -------------- | --------------------------------------------------- |
| `@solidiom/accordion`        | Accordion             | public-catalog | Core component                                      |
| `@solidiom/alert`            | Alert                 | public-catalog | Core component                                      |
| `@solidiom/alert-dialog`     | Alert dialog          | public-catalog | Core component                                      |
| `@solidiom/avatar`           | Avatar                | public-catalog | Core component                                      |
| `@solidiom/badge`            | Badge                 | public-catalog | Core component                                      |
| `@solidiom/breadcrumb`       | Breadcrumb            | public-catalog | Core component                                      |
| `@solidiom/button`           | Button                | public-catalog | Core component                                      |
| `@solidiom/calendar`         | Calendar              | public-catalog | Linked release group                                |
| `@solidiom/card`             | Card                  | public-catalog | Core component                                      |
| `@solidiom/carousel`         | Carousel              | public-catalog | Linked release group                                |
| `@solidiom/checkbox`         | Checkbox              | public-catalog | Core component                                      |
| `@solidiom/collapsible`      | Collapsible           | public-catalog | Core component                                      |
| `@solidiom/combobox`         | Combobox              | public-catalog | Core component                                      |
| `@solidiom/command-palette`  | Command palette       | public-catalog | Core component                                      |
| `@solidiom/context-menu`     | Context menu          | public-catalog | Core component                                      |
| `@solidiom/data-table`       | Data table            | public-catalog | Core component                                      |
| `@solidiom/date-picker`      | Date picker           | public-catalog | Core component                                      |
| `@solidiom/dialog`           | Dialog                | public-catalog | Linked release group                                |
| `@solidiom/drawer`           | Drawer                | public-catalog | Core component                                      |
| `@solidiom/empty-state`      | Empty state           | public-catalog | Core component                                      |
| `@solidiom/field`            | Field                 | public-catalog | Core component                                      |
| `@solidiom/hover-card`       | Hover card            | public-catalog | Core component                                      |
| `@solidiom/input`            | Input                 | public-catalog | Core component                                      |
| `@solidiom/input-otp`        | Input OTP             | public-catalog | Core component                                      |
| `@solidiom/kbd`              | Kbd                   | public-catalog | Core component                                      |
| `@solidiom/label`            | Label                 | public-catalog | Core component                                      |
| `@solidiom/listbox`          | Listbox               | public-catalog | Core component                                      |
| `@solidiom/menu`             | Menu                  | public-catalog | Core component                                      |
| `@solidiom/meter`            | Meter                 | public-catalog | Core component                                      |
| `@solidiom/navigation-menu`  | Navigation menu       | public-catalog | Core component                                      |
| `@solidiom/pagination`       | Pagination            | public-catalog | Core component                                      |
| `@solidiom/popover`          | Popover               | public-catalog | Core component                                      |
| `@solidiom/primitives`       | Primitives (umbrella) | public-catalog | Re-exports all primitives. Publishable deliverable. |
| `@solidiom/progress`         | Progress              | public-catalog | Core component                                      |
| `@solidiom/radio-group`      | Radio group           | public-catalog | Core component                                      |
| `@solidiom/resizable-panels` | Resizable panels      | public-catalog | Core component                                      |
| `@solidiom/scroll-area`      | Scroll area           | public-catalog | Core component                                      |
| `@solidiom/select`           | Select                | public-catalog | Linked release group                                |
| `@solidiom/separator`        | Separator             | public-catalog | Core component                                      |
| `@solidiom/sheet`            | Sheet                 | public-catalog | Core component                                      |
| `@solidiom/skeleton`         | Skeleton              | public-catalog | Core component                                      |
| `@solidiom/slider`           | Slider                | public-catalog | Core component                                      |
| `@solidiom/spinner`          | Spinner               | public-catalog | Core component                                      |
| `@solidiom/switch`           | Switch                | public-catalog | Core component                                      |
| `@solidiom/tabs`             | Tabs                  | public-catalog | Core component                                      |
| `@solidiom/toast`            | Toast                 | public-catalog | Core component                                      |
| `@solidiom/toggle`           | Toggle                | public-catalog | Core component                                      |
| `@solidiom/toggle-group`     | Toggle group          | public-catalog | Core component                                      |
| `@solidiom/toolbar`          | Toolbar               | public-catalog | Core component                                      |
| `@solidiom/tooltip`          | Tooltip               | public-catalog | Core component                                      |
| `@solidiom/tree`             | Tree                  | public-catalog | Core component                                      |
| `@solidiom/virtual-list`     | Virtual list          | public-catalog | Core component                                      |
| `@solidiom/visually-hidden`  | Visually hidden       | public-catalog | Core component                                      |

### Runtime (layer:runtime) — `public-tooling`

| Package             | Name    | Category       | Notes                                                                                                   |
| ------------------- | ------- | -------------- | ------------------------------------------------------------------------------------------------------- |
| `@solidiom/runtime` | Runtime | public-tooling | Core runtime. In linked release group with dialog, select, calendar, carousel. Publishable deliverable. |

### Themes (layer:theme) — `public-catalog`

| Package            | Name   | Category       | Notes                                   |
| ------------------ | ------ | -------------- | --------------------------------------- |
| `@solidiom/themes` | Themes | public-catalog | Theme package. Publishable deliverable. |

### Recipes (layer:recipe) — `public-catalog`

| Package                      | Name                    | Category       | Notes                                                                                         |
| ---------------------------- | ----------------------- | -------------- | --------------------------------------------------------------------------------------------- |
| `@solidiom/recipes-css`      | CSS recipe emitter      | public-catalog | Base recipe emitter. Only recipe currently in registry.                                       |
| `@solidiom/recipes-tailwind` | Tailwind recipe emitter | public-catalog | Sibling emitter to recipes-css.                                                               |
| `@solidiom/recipes-unocss`   | UnoCSS recipe emitter   | public-catalog | Sibling emitter to recipes-css.                                                               |
| `@solidiom/unocss-preset`    | UnoCSS preset           | public-tooling | UnoCSS preset. Published to npm but not a registry-listed component. Publishable deliverable. |

### Adapters (layer:adapter) — `public-catalog`

| Package                                     | Name                            | Category       | Notes                               |
| ------------------------------------------- | ------------------------------- | -------------- | ----------------------------------- |
| `@solidiom/adapter-positioning-floating-ui` | Floating UI positioning adapter | public-catalog | Adapter for @floating-ui/dom        |
| `@solidiom/adapter-positioning-minimal`     | Minimal positioning adapter     | public-catalog | Lightweight positioning adapter     |
| `@solidiom/adapter-carousel-embla`          | Embla carousel adapter          | public-catalog | Adapter for embla-carousel          |
| `@solidiom/adapter-date-internationalized`  | Internationalized date adapter  | public-catalog | Adapter for @internationalized/date |
| `@solidiom/adapter-table-tanstack`          | TanStack table adapter          | public-catalog | Adapter for @tanstack/table-core    |
| `@solidiom/adapter-virtualization-tanstack` | TanStack virtualization adapter | public-catalog | Adapter for @tanstack/virtual-core  |

### Tooling (layer:tooling) — `public-tooling` / `private-internal`

| Package                            | Name          | Category         | Notes                                                                                      |
| ---------------------------------- | ------------- | ---------------- | ------------------------------------------------------------------------------------------ |
| `@solidiom/cli`                    | CLI           | public-tooling   | The Solidiom CLI tool. Publishable deliverable.                                            |
| `@solidiom/vite-plugin`            | Vite plugin   | public-tooling   | Vite plugin for Solidiom. Publishable deliverable.                                         |
| `@solidiom/adapter-kit`            | Adapter kit   | private-internal | Internal adapter authoring kit. Not a product deliverable. **Added to Changesets ignore.** |
| `@solidiom/release-tools`          | Release tools | private-internal | CI-only signing pipeline. Never bundled. **Added to Changesets ignore.**                   |
| `@solidiom/test-doubles`           | Test doubles  | private-internal | Testing infrastructure. Internal use only. **Added to Changesets ignore.**                 |
| `@solidiom/bench`                  | Benchmarks    | private-internal | Benchmark harness. Already in Changesets ignore.                                           |
| `@solidiom/eslint-plugin-solidiom` | ESLint plugin | private-internal | Internal ESLint rules. Already in Changesets ignore.                                       |

### Probe (internal testing infrastructure) — `private-internal`

| Package                     | Name            | Category         | Notes                                                      |
| --------------------------- | --------------- | ---------------- | ---------------------------------------------------------- |
| `@solidiom/probe-primitive` | Probe primitive | private-internal | Internal probe component. `private: true` in package.json. |
| `@solidiom/probe-runtime`   | Probe runtime   | private-internal | Internal probe runtime. `private: true` in package.json.   |

### Astro integration — `private-internal`

| Package                        | Name                    | Category         | Notes                                                        |
| ------------------------------ | ----------------------- | ---------------- | ------------------------------------------------------------ |
| `@solidiom/astrojs-solid-next` | Astro Solid integration | private-internal | Internal Astro integration. `private: true` in package.json. |

### Apps (layer:app) — `private-internal` / `private-legacy`

| Package          | Name | Category         | Notes                                |
| ---------------- | ---- | ---------------- | ------------------------------------ |
| `@solidiom/site` | Site | private-internal | Active website app. `private: true`. |

### Removed at CUT-003

| Package              | Name          | Notes                                |
| -------------------- | ------------- | ------------------------------------ |
| ~~`@solidiom/docs`~~ | Docs (legacy) | Removed. Parity verified at CUT-001. |

### Tests (layer:test) — `private-internal`

| Package                                 | Name                        | Category         | Notes                          |
| --------------------------------------- | --------------------------- | ---------------- | ------------------------------ |
| `@solidiom/tests-recipe-parity`         | Recipe parity tests         | private-internal | Test harness. `private: true`. |
| `@solidiom/tests-package-source-parity` | Package-source parity tests | private-internal | Test harness. `private: true`. |

## Resolution: changes made

### Updated `.changeset/config.json`

Three internal tooling packages were added to the Changesets `ignore` list so they are excluded from versioning and release:

- `@solidiom/adapter-kit` — internal adapter authoring kit
- `@solidiom/release-tools` — CI signing tooling
- `@solidiom/test-doubles` — testing infrastructure

These packages have `private: false` in their package.json but are not product deliverables and should not be published. Adding them to the Changesets ignore list ensures they are skipped during release.

### Classification summary

| Category           | Count | Examples                                                                                                     |
| ------------------ | ----- | ------------------------------------------------------------------------------------------------------------ |
| `public-catalog`   | 52    | Primitives, recipes, adapters, themes, `@solidiom/primitives`                                                |
| `public-tooling`   | 4     | `@solidiom/cli`, `@solidiom/runtime`, `@solidiom/vite-plugin`, `@solidiom/unocss-preset`                     |
| `private-internal` | 11    | Adapter kit, release tools, test doubles, bench, ESLint plugin, site, apps, tests, probes, Astro integration |

### 13 originally untracked packages — resolved

| #   | Package                            | Before                       | After                                |
| --- | ---------------------------------- | ---------------------------- | ------------------------------------ |
| 1   | `@solidiom/adapter-kit`            | publishable, untracked       | private-internal + Changesets ignore |
| 2   | `@solidiom/release-tools`          | publishable, untracked       | private-internal + Changesets ignore |
| 3   | `@solidiom/test-doubles`           | publishable, untracked       | private-internal + Changesets ignore |
| 4   | `@solidiom/recipes-tailwind`       | publishable, untracked       | public-catalog                       |
| 5   | `@solidiom/recipes-unocss`         | publishable, untracked       | public-catalog                       |
| 6   | `@solidiom/cli`                    | publishable, untracked       | public-tooling                       |
| 7   | `@solidiom/runtime`                | publishable, in linked group | public-tooling (confirmed)           |
| 8   | `@solidiom/primitives`             | publishable, untracked       | public-catalog                       |
| 9   | `@solidiom/themes`                 | publishable, untracked       | public-catalog                       |
| 10  | `@solidiom/unocss-preset`          | publishable, untracked       | public-tooling                       |
| 11  | `@solidiom/vite-plugin`            | publishable, untracked       | public-tooling                       |
| 12  | `@solidiom/bench`                  | publishable, already ignored | private-internal (confirmed)         |
| 13  | `@solidiom/eslint-plugin-solidiom` | publishable, already ignored | private-internal (confirmed)         |
