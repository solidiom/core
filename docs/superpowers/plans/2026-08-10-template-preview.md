# Template Preview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an iframe-based preview of each template's built output to the `/templates/{name}/` overview page.

**Architecture:** A build-time script copies `templates/*/dist/` into `apps/site/public/templates/*/` so the template's static assets resolve at their root-relative paths. A new `TemplatePreview.astro` component renders a bordered iframe pointing to the copied files. The component is wired into `CatalogRoute.astro`'s overview section for the `templates` layer.

**Tech Stack:** Astro, TypeScript, Node.js `fs`/`path`, CSS scoped classes

## Global Constraints

- All CSS classes scoped under `.template-preview__` to avoid leaking into docs layout
- Sync script must be idempotent (skip unchanged files by mtime) and run both at build time and dev time
- Follow existing patterns: `ThemePreview.astro` for component structure, `theme-preview.css` for styling conventions
- No new npm dependencies
- Content collection schema for templates is in `apps/site/src/content.config.ts` — do not modify
- Template names come from the content collection entry, not from filesystem scanning in the component
- The sync script reads from the workspace root `templates/` directory, writing to `apps/site/public/templates/`

---

### Task 1: Sync script — `sync-template-previews.ts`

**Files:**
- Create: `apps/site/tools/sync-template-previews.ts`
- Modify: `apps/site/package.json` (add `templates:sync` script)

**Interfaces:**
- Consumes: none
- Produces: a Node.js script exportable via `tsx` and invocable via `pnpm templates:sync`

- [ ] **Step 1: Write the sync script**

Create `apps/site/tools/sync-template-previews.ts`:

```ts
import { existsSync, readdirSync, statSync, copyFileSync, mkdirSync } from "node:fs"
import { resolve, join } from "node:path"

const workspaceRoot = resolve(process.cwd(), "..", "..")
const templatesDir = resolve(workspaceRoot, "templates")
const publicDir = resolve(process.cwd(), "public", "templates")

mkdirSync(publicDir, { recursive: true })

const templateNames = readdirSync(templatesDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)

let copied = 0
let skipped = 0

for (const name of templateNames) {
  const srcDist = join(templatesDir, name, "dist")
  if (!existsSync(srcDist) || !statSync(srcDist).isDirectory()) {
    continue
  }

  const destBase = join(publicDir, name)
  mkdirSync(destBase, { recursive: true })

  const entries = readdirSync(srcDist, { withFileTypes: true })
  for (const entry of entries) {
    const src = join(srcDist, entry.name)
    const dest = join(destBase, entry.name)

    if (entry.isDirectory()) {
      mkdirSync(dest, { recursive: true })
    } else {
      const srcStat = statSync(src)
      if (existsSync(dest)) {
        const destStat = statSync(dest)
        if (
          srcStat.mtimeMs === destStat.mtimeMs &&
          srcStat.size === destStat.size
        ) {
          skipped++
          continue
        }
      }
      copyFileSync(src, dest)
      copied++
    }
  }
}

console.log(`Synced template previews: ${copied} copied, ${skipped} skipped`)
```

- [ ] **Step 2: Add script to `package.json`**

In `apps/site/package.json`, add to the `scripts` object:

```json
"templates:sync": "tsx ./tools/sync-template-previews.ts"
```

- [ ] **Step 3: Run the sync and verify**

Run:
```bash
pnpm --dir apps/site templates:sync
```

Expected output: `Synced template previews: X copied, 0 skipped` where X > 0.

Verify:
```bash
ls apps/site/public/templates/workflow-automation/
```

Expected: `index.html` and `assets/` directory present.

- [ ] **Step 4: Run sync again to verify idempotency**

Run:
```bash
pnpm --dir apps/site templates:sync
```

Expected output: `Synced template previews: 0 copied, X skipped` where X > 0.

- [ ] **Step 5: Commit**

```bash
git add apps/site/tools/sync-template-previews.ts apps/site/package.json
git commit -m "feat: add sync-template-previews script for template iframe previews"
```

---

### Task 2: Wire sync into dev and build scripts

**Files:**
- Modify: `apps/site/package.json`

**Interfaces:**
- Consumes: `templates:sync` script from Task 1
- Produces: dev and build scripts that run sync before starting Astro

- [ ] **Step 1: Add sync to dev script**

In `apps/site/package.json`, change:

```json
"dev": "pnpm run templates:sync && astro dev"
```

- [ ] **Step 2: Add sync to build script**

In `apps/site/package.json`, change:

```json
"build": "pnpm run templates:sync && pnpm run i18n:validate && pnpm run boundaries && astro build"
```

- [ ] **Step 3: Commit**

```bash
git add apps/site/package.json
git commit -m "feat: wire template preview sync into dev and build scripts"
```

---

### Task 3: TemplatePreview component — `TemplatePreview.astro`

**Files:**
- Create: `apps/site/src/components/TemplatePreview.astro`
- Create: `apps/site/src/assets/template-preview.css`

**Interfaces:**
- Consumes: `name: string` (template slug), `locale: Locale` from parent
- Produces: a component matching the `ThemePreview` pattern with iframe-based preview

- [ ] **Step 1: Write the CSS**

Create `apps/site/src/assets/template-preview.css`:

```css
.template-preview {
  margin: 1.5rem 0;
}

.template-preview__frame {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border);
  border-radius: var(--sol-radius, 12px);
  overflow: hidden;
}

.template-preview__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  font-size: 0.8125rem;
  font-weight: 600;
  border-bottom: 1px solid var(--color-border);
  background: var(--sol-surface-raised, #ffffff);
  color: var(--sol-foreground, #111827);
}

.template-preview__status {
  font-size: 0.6875rem;
  font-weight: 500;
  padding: 0.125rem 0.5rem;
  border-radius: 999px;
  background: var(--sol-badge-success-bg, #dcfce7);
  color: var(--sol-badge-success-fg, #166534);
}

.template-preview__iframe {
  width: 100%;
  height: 500px;
  border: none;
  background: #ffffff;
}

.template-preview__fallback {
  padding: 2rem 1rem;
  text-align: center;
  color: var(--sol-foreground-muted, #6b7280);
  font-size: 0.875rem;
  background: var(--sol-surface-lowered, #f9fafb);
}
```

- [ ] **Step 2: Write the component**

Create `apps/site/src/components/TemplatePreview.astro`:

```astro
---
import "../assets/template-preview.css"

interface Props {
  name: string
  locale: "en" | "es"
}

const { name, locale } = Astro.props

const copy = {
  previewLabel: locale === "es" ? "Vista previa" : "Preview",
  fallback:
    locale === "es"
      ? "La vista previa no está disponible para esta plantilla."
      : "Preview not available for this template.",
}

const iframeSrc = `/templates/${name}/index.html`
---

<div class="template-preview">
  <div class="template-preview__frame">
    <div class="template-preview__header">
      <span>{copy.previewLabel} — {name}</span>
      <span class="template-preview__status">live</span>
    </div>
    <iframe
      class="template-preview__iframe"
      src={iframeSrc}
      title={`${copy.previewLabel}: ${name}`}
      loading="lazy"
      sandbox="allow-scripts allow-same-origin"
    />
  </div>
</div>
```

- [ ] **Step 3: Commit**

```bash
git add apps/site/src/components/TemplatePreview.astro apps/site/src/assets/template-preview.css
git commit -m "feat: add TemplatePreview component with iframe and scoped CSS"
```

---

### Task 4: Wire TemplatePreview into CatalogRoute

**Files:**
- Modify: `apps/site/src/components/CatalogRoute.astro`

**Interfaces:**
- Consumes: `TemplatePreview` component from Task 3, `name` and `locale` props already passed to `CatalogRoute`
- Produces: templates layer now shows a preview in the overview section

- [ ] **Step 1: Import TemplatePreview**

In `CatalogRoute.astro`, add to the import section after `ThemePreview`:

```ts
import TemplatePreview from "./TemplatePreview.astro"
```

- [ ] **Step 2: Add preview branch for templates layer**

In the overview section (around line 117-119), after the `layer === "themes"` block, add:

```astro
{layer === "templates" && (
  <TemplatePreview name={name} locale={locale} />
)}
```

- [ ] **Step 3: Verify locally**

Run:
```bash
pnpm --dir apps/site dev
```

Navigate to `http://localhost:4321/templates/workflow-automation/` and verify:
- The "Preview" heading renders
- Below it, an iframe showing the workflow-automation template
- The iframe has a header bar with "Preview — workflow-automation" and a "live" badge
- The template content loads inside the iframe (may show a spinner initially, then hydrates)

- [ ] **Step 4: Commit**

```bash
git add apps/site/src/components/CatalogRoute.astro
git commit -m "feat: wire TemplatePreview into CatalogRoute for templates layer"
```

---

### Task 5: Verify full build

**Files:**
- No file changes

**Interfaces:**
- Consumes: all prior tasks
- Produces: a passing production build with previews embedded

- [ ] **Step 1: Run full build**

```bash
pnpm --dir apps/site build
```

Expected: Build completes without errors. The sync script runs first and copies all 31 template dists.

- [ ] **Step 2: Verify dist output**

```bash
ls apps/site/dist/templates/workflow-automation/index.html
```

Expected: File exists.

- [ ] **Step 3: Run preview server**

```bash
pnpm --dir apps/site preview
```

Navigate to `http://localhost:4321/templates/workflow-automation/` and verify the preview iframe loads.

- [ ] **Step 4: Commit (if any fixes were needed)**

If any changes were made in Step 1-3:
```bash
git add -A
git commit -m "fix: resolve template preview build issues"
```

If no changes needed, skip this step and proceed to final verification.
