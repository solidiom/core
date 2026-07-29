# SITE-014: apps/docs Demo and Component Migration Audit

**Status:** complete
**Audited from:** `apps/docs/src/`
**Target:** `apps/site/` (Astro static site with Solid islands)
**Date:** 2026-07-29
**Dependency:** MIG-001 (route-level migration inventory covers the full apps/docs surface; this audit covers reusable code only)

---

## 1. Audit criteria

Each reusable demo or component was assessed against:

1. **Behavior correctness** — Does it demonstrate the primitive's current API accurately?
2. **Accessibility** — Does it include proper ARIA, keyboard, focus management, and semantic markup?
3. **Architecture fit** — Is it compatible with the Astro static + Solid island model in `apps/site`?
4. **Styling approach** — Does it use the semantic token system consistently?
5. **Code quality** — Inline code string accuracy, composability, no dead/unused code.

### Decision categories

| Decision | Meaning |
|----------|---------|
| **Migrate** | Reuse in `apps/site` with minimal adaptation (rename imports, adjust to Astro island boundary). Requires a11y and behavior review before use. |
| **Rewrite** | The concept is needed but the implementation must be rebuilt for the new architecture, improved a11y, or updated API usage. |
| **Retire** | Not needed in the new site, or superseded by a purpose-built `apps/site` implementation. |

### Constraint (per task definition)

> No direct copy without current behavior and accessibility review.

Every item marked "Migrate" still requires the review gate defined in CONTENT-005 and VS-001..004 before it ships in the new site.

---

## 2. Infrastructure components

| Component | Path | Decision | Rationale |
|-----------|------|----------|-----------|
| `Layout` | `components/layout.tsx` | **Retire** | Replaced by `apps/site/src/layouts/` (Astro layouts). SITE-004 complete. |
| `Header` | `components/header.tsx` | **Retire** | Replaced by `apps/site/src/components/SiteHeader.astro` + `.tsx`. SITE-005 complete. |
| `Sidebar` | `components/sidebar.tsx` | **Retire** | Replaced by generated sidebar (DOCS-003). Pattern is useful reference but SolidJS Router coupling makes direct reuse impractical. |
| `MobileSidebar` | `components/mobile-sidebar.tsx` | **Retire** | Replaced by `apps/site/src/components/DocsMobileNav.astro` + `.tsx`. SITE-007 complete. |
| `ThemeToggle` | `components/theme-toggle.tsx` | **Retire** | Replaced by `apps/site/src/components/ThemeToggle.tsx`. SITE-009 complete. |
| `Icons` | `components/icons.tsx` | **Rewrite** | SVG icons needed in new site but should use a shared icon approach (inline SVG in Astro or a small icon component library). Current file has limited icons; new site already has its own. |
| `ComponentPreview` | `components/component-preview.tsx` | **Rewrite** | Core concept needed for catalog routes (VS-001..004). New implementation must: (a) work as an Astro component with optional Solid island for tab switching, (b) use server-side Shiki instead of client-side, (c) add proper a11y (tabpanel semantics, keyboard support). |
| `CodeBlock` | `components/code-block.tsx` | **Retire** | `apps/site` uses server-side Shiki via Astro's built-in markdown/MDX pipeline with the copy-button transformer (SITE-008 complete). Client-side highlighting is not needed. |

---

## 3. Library utilities

| Utility | Path | Decision | Rationale |
|---------|------|----------|-----------|
| `primitives` registry | `lib/primitives.ts` | **Rewrite** | Concept needed (REG-002/REG-003) but the new site sources from registry v2 schema, not the legacy `@solidiom/registry` package directly. Data model expands significantly. |
| `loadReport` | `lib/load-report.ts` | **Migrate** | Bench report loading is reusable. Adapt from client-side fetch to Astro content collection or build-time data loading. Minor changes only. |
| `loadA11yReport` | `lib/load-a11y-report.ts` | **Rewrite** | Concept needed (A11Y-001..003) but evidence schema changes substantially. Sample data is outdated. New implementation must source from generated per-primitive evidence artifacts, not a monolithic JSON. |

---

## 4. Primitive demos (51 total)

### 4.1 Assessment summary

All 51 primitive demos share the same pattern:
- A single exported function rendering the primitive with inline Tailwind + `hsl(var(--token))` styling.
- A companion `*DemoCode` string showing a simplified version.
- No accessibility annotations beyond what the primitive provides by default.
- No keyboard interaction guidance or ARIA description in the demo itself.
- Static data (no async, no routing dependencies).

**Common issues across all demos:**
1. **Styling is presentation-only** — Uses raw Tailwind utility classes without recipe integration. The new site examples should demonstrate canonical recipes (CSS/Tailwind/UnoCSS).
2. **Code strings diverge from rendered code** — The simplified `*DemoCode` strings often omit styling/structure present in the actual rendered component, making them pedagogically incomplete.
3. **No a11y narrative** — Demos don't explain what the primitive provides (focus trap, announcements, keyboard model) or what the consumer must supply.
4. **No variant coverage** — Most demos show a single happy-path usage rather than states (disabled, loading, error, empty).

### 4.2 Per-demo decisions

| # | Demo | Decision | Notes |
|---|------|----------|-------|
| 1 | `accordion-demo` | Rewrite | Needs multi-panel state, disabled, keyboard demo |
| 2 | `alert-demo` | Rewrite | Needs variants (info/warning/error/success), icon usage, dismissible |
| 3 | `alert-dialog-demo` | Rewrite | Needs focus trap verification, async confirm pattern |
| 4 | `avatar-demo` | Rewrite | Needs fallback states, loading, image error handling |
| 5 | `badge-demo` | Migrate | Simple, static — adapt styling to recipe. Review a11y (color-only meaning). |
| 6 | `breadcrumb-demo` | Migrate | Simple nav structure. Verify aria-current and separator semantics. |
| 7 | `button-demo` | Rewrite | Needs loading state, icon buttons, link-as-button, full variant matrix |
| 8 | `calendar-demo` | Rewrite | Complex. Needs date library integration, locale, disabled dates, range demo split. Inline icons should use shared approach. |
| 9 | `card-demo` | Migrate | Static layout. Verify heading semantics and interactive card patterns. |
| 10 | `carousel-demo` | Rewrite | Needs a11y (live region, reduced-motion), touch, autoplay control |
| 11 | `checkbox-demo` | Rewrite | Needs indeterminate, form integration, error state, group |
| 12 | `collapsible-demo` | Migrate | Simple. Verify animated expand/collapse and reduced-motion. |
| 13 | `combobox-demo` | Rewrite | Complex. Needs async loading, multi-select, custom rendering, a11y testing |
| 14 | `command-palette-demo` | Rewrite | Complex. Needs keyboard model verification, sections, recent/suggested |
| 15 | `context-menu-demo` | Rewrite | Needs keyboard trigger, nested menus, disabled items |
| 16 | `data-table-demo` | Rewrite | Complex. Needs sorting, pagination, selection, responsive, empty state |
| 17 | `date-picker-demo` | Rewrite | Complex. Combines input + calendar. Needs locale, validation, range |
| 18 | `dialog-demo` | Rewrite | VS-001 reference. Needs focus trap audit, nested dialog, scroll lock, responsive |
| 19 | `drawer-demo` | Rewrite | Needs swipe gesture, snap points, a11y announcement on open |
| 20 | `empty-state-demo` | Migrate | Static presentational. Verify icon + message + action pattern. |
| 21 | `field-demo` | Rewrite | Needs error, hint, required, disabled, composition with Input/Select |
| 22 | `hover-card-demo` | Rewrite | Needs delay control, touch fallback, focus trigger, dismissal |
| 23 | `input-demo` | Rewrite | Needs types, validation states, prefix/suffix, clearable, a11y labels |
| 24 | `input-otp-demo` | Rewrite | Complex. Needs paste, backspace, a11y verification, auto-advance |
| 25 | `kbd-demo` | Migrate | Static. Verify semantic markup and screen reader behavior. |
| 26 | `label-demo` | Migrate | Simple. Verify htmlFor association and required indicator. |
| 27 | `listbox-demo` | Rewrite | Complex. Needs multi-select, keyboard model, grouped, virtualized |
| 28 | `menu-demo` | Rewrite | Needs submenus, disabled items, keyboard model, checkbox/radio items |
| 29 | `meter-demo` | Migrate | Verify ARIA meter role, thresholds, visual indicator matches value. |
| 30 | `navigation-menu-demo` | Rewrite | Complex. Needs responsive collapse, active state, keyboard, mega-menu |
| 31 | `pagination-demo` | Rewrite | Needs edge states (1 page, many pages), aria-current, keyboard |
| 32 | `popover-demo` | Rewrite | Needs positioning verification, focus management, nesting |
| 33 | `progress-demo` | Migrate | Verify ARIA progressbar, indeterminate state, label. |
| 34 | `radio-group-demo` | Rewrite | Needs disabled individual, error, horizontal/vertical, card variant |
| 35 | `range-calendar-demo` | Rewrite | Complex. Needs locale, min/max, disabled ranges, keyboard |
| 36 | `resizable-panels-demo` | Rewrite | Complex. Needs keyboard resize, min/max, persist, collapse |
| 37 | `scroll-area-demo` | Migrate | Verify custom scrollbar a11y, keyboard scrollability, focus. |
| 38 | `select-demo` | Rewrite | Needs groups, disabled items, typeahead, custom rendering, form integration |
| 39 | `separator-demo` | Migrate | Static. Verify semantic hr vs decorative. |
| 40 | `sheet-demo` | Rewrite | Needs directional variants, focus trap, close-on-outside, responsive |
| 41 | `skeleton-demo` | Migrate | Static. Verify reduced-motion, aria-busy. |
| 42 | `slider-demo` | Rewrite | Needs range, step, marks, vertical, keyboard, aria-valuetext |
| 43 | `spinner-demo` | Migrate | Verify role="status", aria-label, reduced-motion. |
| 44 | `switch-demo` | Rewrite | Needs form integration, disabled, label association, loading |
| 45 | `tabs-demo` | Rewrite | Needs vertical, disabled tab, lazy panel, keyboard model |
| 46 | `toast-demo` | Rewrite | Needs variants, action buttons, promise integration, queue behavior |
| 47 | `toggle-demo` | Migrate | Verify aria-pressed, disabled state. |
| 48 | `toggle-group-demo` | Rewrite | Needs single/multi, disabled individual, orientation |
| 49 | `toolbar-demo` | Rewrite | Needs keyboard roving tabindex, overflow, separator groups |
| 50 | `tooltip-demo` | Migrate | Verify delay, keyboard trigger, touch, positioning. Review before use. |
| 51 | `tree-demo` | Rewrite | Complex. Needs keyboard model, selection, async loading, drag |
| — | `virtual-list-demo` | Rewrite | Complex. Needs variable height, horizontal, keyboard focus management |
| — | `visually-hidden-demo` | Migrate | Static utility. Verify implementation matches spec. |

### 4.3 Summary counts

| Decision | Count | Percentage |
|----------|------:|:----------:|
| Migrate | 15 | 29% |
| Rewrite | 36 | 71% |
| Retire | 0 | 0% |

All 51 demos represent primitives that will exist in the new site catalog. None are retired — but 71% require rewrites because the current implementations lack the depth required by the Primitive item DoD (§8.1): multiple states, a11y narrative, recipe integration, and bilingual content.

---

## 5. Block demos (4 total)

| Block | Decision | Rationale |
|-------|----------|-----------|
| `app-shell` | **Rewrite** | Pattern is valid but implementation uses hardcoded zinc colors (not tokens), no dark mode, no responsive mobile behavior, no a11y landmarks. New blocks must satisfy Block DoD (§8.3). |
| `aspect-ratio` | **Retire** | CSS `aspect-ratio` is a one-liner utility, not a block-level pattern. Does not meet the Block DoD requirement for "concrete product outcome." |
| `code-block` | **Retire** | Superseded by SITE-008 (Astro server-side Shiki with copy transformer). The block concept (syntax highlighting) is infrastructure, not a user-facing block product. |
| `chat-composer` | **Rewrite** | Product concept is valid (maps to BLOCK-AI category). Requires proper message rendering, scroll-area integration, input composition, loading states, and a11y audit. |

---

## 6. Recipe demos (7 total)

| Recipe demo | Decision | Rationale |
|-------------|----------|-----------|
| `button-recipe-demo` | **Migrate** | Uses `@solidiom/recipes-tailwind` StyledButton. Verify recipe contract still matches after RECIPE-005. |
| `dialog-recipe-demo` | **Migrate** | Same pattern. Verify after RECIPE-005. |
| `switch-recipe-demo` | **Migrate** | Same pattern. Verify after RECIPE-005. |
| `checkbox-recipe-demo` | **Migrate** | Same pattern. Verify after RECIPE-005. |
| `tabs-recipe-demo` | **Migrate** | Same pattern. Verify after RECIPE-005. |
| `typeset-recipe-demo` | **Rewrite** | Typography recipe needs new site's token system and font stack (Inter Tight/Variable + IBM Plex Mono). |
| `prose-recipe-demo` | **Rewrite** | Similar to typeset — tied to site-specific typography decisions. |

---

## 7. Migration rules and process

### 7.1 For "Migrate" items

1. Do **not** copy files directly into `apps/site`.
2. Each migrated demo must go through the review gate:
   - Verify the primitive API it demonstrates is current (Solid 2 beta).
   - Run axe and keyboard tests on the isolated example.
   - Confirm the styling uses the site's semantic token system.
   - Add bilingual labels/text (required by CONTENT-002).
3. Migrated demos land as part of their respective `PRIM-*` or `VS-*` work packages.
4. The canonical source format is defined by CONTENT-005 (shared source between display and execution).

### 7.2 For "Rewrite" items

1. Use the existing demo as **behavioral reference only** — what the primitive can do.
2. Design the new example from the Primitive/Component/Block DoD requirements.
3. Include: multiple states, error paths, a11y narrative, recipe integration, bilingual text.
4. Each rewrite lands as part of its `PRIM-*` / `COMP-*` / `BLOCK-*` / `VS-*` ticket.

### 7.3 For "Retire" items

1. No action needed in `apps/site`.
2. The legacy code remains in `apps/docs` (read-only per MIG-002) until CUT-003 removes the app.

---

## 8. Dependencies and sequencing

This audit does not block any immediate work. It informs:

- **VS-001** (Dialog vertical slice): dialog-demo is "Rewrite" — build from scratch with full DoD.
- **VS-002** (Combobox): combobox-demo is "Rewrite" — complex state/keyboard model needs fresh implementation.
- **VS-003** (Data Table): data-table-demo is "Rewrite" — needs sorting, selection, responsive.
- **CONTENT-005** (example source extraction): defines the canonical format that replaces the current `*DemoCode` string pattern.
- **RECIPE-005** (recipe contract audits): recipe demos marked "Migrate" depend on this completing first.

No demo or component from `apps/docs` should be copied into `apps/site` before **VS-004** proves the complete vertical-slice pipeline (per §2 first-merge-sequence rule).
