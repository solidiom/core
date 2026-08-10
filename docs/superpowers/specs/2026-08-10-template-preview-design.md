# Template Preview — `/templates/{name}/`

**Date:** 2026-08-10
**Status:** Approved

## Problem

The overview page at `/templates/{name}/` renders an `<h2>Preview</h2>` header (via `CatalogRoute.astro` line 111) but displays no content beneath it. The component has preview branches for `components` (live Solid islands) and `themes` (color swatches), but not for `templates`.

## Goal

Show an iframe-embedded preview of each template's built output on its overview page, in both dev and production builds.

## Approach

### 1. Build-time sync script

**File:** `apps/site/tools/sync-template-previews.ts`

- Copies `templates/*/dist/` → `apps/site/public/templates/*/`
- Runs before `astro build` and at `astro dev` startup
- Skips templates with no `dist/` directory
- Idempotent: compares mtime before copying

### 2. TemplatePreview component

**File:** `apps/site/src/components/TemplatePreview.astro`

- Props: `name` (template slug), `locale`
- Renders a bordered iframe pointing to `/templates/{name}/index.html`
- Label bar above iframe shows template name and status
- Fixed max-height (~500px) with internal scrolling
- Fallback: "Preview not available" notice when no `dist/` exists

### 3. Wire into CatalogRoute

**File:** `apps/site/src/components/CatalogRoute.astro`

Add a third preview branch in the overview section (lines 112-119):

```astro
{layer === "templates" && (
  <TemplatePreview name={name} locale={locale} />
)}
```

## Data flow

```
Build/Dev start
  → sync-template-previews.ts
    → templates/workflow-automation/dist/*
      → apps/site/public/templates/workflow-automation/*

Site serves static files from public/
  → /templates/workflow-automation/index.html resolves
  → /assets/*.js and /assets/*.css resolve

CatalogRoute (view=overview, layer=templates)
  → TemplatePreview name="workflow-automation"
    → <iframe src="/templates/workflow-automation/index.html" />
```

## Styling

Follow the `ThemePreview` pattern:
- Labeled pane with top bar (template name + status badge)
- Rounded corners, bordered
- iframe fills remaining height, max-height 500px, overflow scroll
- Scoped CSS classes under `.template-preview__`

## Error handling

| Case | Behavior |
|------|----------|
| No `dist/` for template | "Preview not available for this template yet." |
| iframe fails to load | Same fallback notice |
| Dev mode with no sync | Graceful notice linking to build docs |

## Files changed

| File | Action |
|------|--------|
| `apps/site/tools/sync-template-previews.ts` | Create |
| `apps/site/src/components/TemplatePreview.astro` | Create |
| `apps/site/src/assets/template-preview.css` | Create |
| `apps/site/src/components/CatalogRoute.astro` | Modify — add templates preview branch |
| `apps/site/package.json` | Modify — add sync script to build/dev |
