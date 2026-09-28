# shadcn/ui Behavior + Visual Parity Harness — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a side-by-side harness that verifies every shadcn-mapped Solidiom component behaves and looks like shadcn (interaction/keyboard/focus/ARIA + color/spacing/radius/border/typography/dark-mode), via a live Chrome DevTools discovery pass (Phase A), a durable two-context Playwright suite (Phase B), and a per-failure fix loop (Phase C).

**Architecture:** Three pieces. (1) A mapping file `tests/shadcn-parity/mapping.json` is the single source of truth for the comparison set (shadcn component → Solidiom slug → parts → tokens → interactions → states → themes → tolerances → accepted divergences). (2) An isolated Vite+React reference app `tools/shadcn-reference/` hosts _real_ shadcn components (own lockfile, excluded from the `nx` graph and release gates). (3) A Playwright parity suite `tests/shadcn-parity/` (+ `apps/site/playwright.shadcn.config.ts`) opens two isolated contexts — reference app vs. the Solidiom site's `/components/<slug>/examples` live island — drives an identical interaction script into both, captures computed styles / behavior snapshots / pixel crops, and emits a findings report per component to `artifacts/shadcn-parity/<id>.md`. Phase A does the same comparison _live_ through **Playwright two isolated contexts** (no Chrome binary in this environment, so the `chrome-devtools_*` MCP tools are unavailable) and proves out the token/interaction lists that Phase B then encodes.

**Tech Stack:** Node 26, pnpm 10 (reference app uses its own lockfile; `npm` is acceptable inside `tools/shadcn-reference/` to keep it out of the workspace catalog), Vite 6 + React 19 for the reference app, the `shadcn` CLI (pinned to `shadcn@3.8.5` — the last release whose `init -b neutral` command surface matches; 4.x redefined `-b`) to install real components, `@playwright/test` (already a site dep) for the parity suite AND for the live Phase A discovery pass (Playwright two-context, since no Chrome binary is available for the `chrome-devtools_*` MCP tools), existing Playwright visual-config idioms as the template.

## Global Constraints

Copied verbatim from the approved spec `docs/superpowers/specs/2026-09-25-shadcn-parity-harness-design.md`. Every task's requirements implicitly include this section.

- **Behavior + visual parity only. NO shadcn API/identity parity.** No changes to any Solidiom package's public API, props, component names, or registry entries. Fixes touch recipe CSS/TSX and/or primitive _behavior or look_ only (spec §1, §7).
- **Reference app is isolated.** `tools/shadcn-reference/` has its own `package.json` + lockfile and is NOT part of the pnpm workspace; it must be excluded from the `nx` dependency graph and from `vertical-slice-gate` / `release-gate` (spec §2b, §5).
- **shadcn versions pinned.** The reference app's lockfile pins shadcn registry component versions; no auto-update. Every findings report header records the shadcn version used (spec §5).
- **Source of truth = `tests/shadcn-parity/mapping.json`.** The Playwright suite generates specs _from_ this file; hand-written per-component specs that drift from the mapping are a plan violation (spec §2a).
- **Comparison surface for Solidiom = the site's live examples island.** Route `/components/<slug>/examples` mounts a hydrated `*Example.tsx` (e.g. `ButtonExample`) for every slug in `apps/site/src/components/CatalogRoute.astro`'s `COMPONENTS_WITH_EXAMPLES` set (48 slugs). A slug not in that set cannot be visually/behaviorally compared and is marked `gap`/`na` in the mapping (spec §3 Step 1, §5).
- **Theme application idiom.** Solidiom side: set `document.documentElement.dataset.theme` (matches `apps/site/tests/visual/visual-baseline.spec.ts:setTheme`). Reference (shadcn) side: add/remove the `dark` class on `<html>`. Wait ~100ms after a theme flip for transitions to settle (spec §3 Step 2).
- **Primary "look" signal = computed-style token assertions; pixel diff is corroboration.** A component's look verdict is driven by declared per-part `getComputedStyle` assertions; the bounding-box pixel diff is a secondary signal with `tolerance.pixelMaxPercent` (spec §2a, §5).
- **Animations disabled in captures** (existing Playwright idiom `animations: "disabled"`) (spec §5).
- **Verdict vocabulary is fixed:** ✅ parity / 🟡 accepted divergence / ❌ gap. A component is _done_ only when no declared signal is an unresolved ❌ (spec §1).
- **Batching + review gate.** Work proceeds in Batches 0–5. **After Batch 1 the user reviews the findings reports and the settled `mapping.json` token/interaction definitions before Batches 2–5 scale them** (spec §4). Do not start Batch 2 until that gate passes.
- **Node/pnpm on PATH are v26.7.0 / v10.34.5.** The `shadcn` CLI is invoked as `npx shadcn@3.8.5` (the last release whose `init -b neutral` command surface matches; `shadcn@latest`/4.x redefined `-b` to component-library and rejects `neutral`) (verified + resolved during Task 1).
- **No Chrome binary in this environment.** The `chrome-devtools_*` MCP tools cannot launch a browser. All browser work (Phase A live comparison, the reference-app verify, the parity suite) uses **Playwright's bundled chromium**. Phase A drives the live side-by-side via Playwright two isolated contexts — the same mechanism Phase B's suite uses.

---

## File Structure

| Path                                              | Responsibility                                                                                                                                      |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tools/shadcn-reference/package.json`, `lockfile` | Isolated React+Vite reference app. Own deps, own lockfile. Not a workspace member.                                                                  |
| `tools/shadcn-reference/vite.config.ts`           | Vite + React. Serves on a fixed port (4333).                                                                                                        |
| `tools/shadcn-reference/src/pages/<id>.tsx`       | One route per mapped shadcn component, rendering the real shadcn component in a neutral token-matched shell.                                        |
| `tools/shadcn-reference/src/App.tsx`              | Router: `/<id>` → the component's page; `/` → index listing.                                                                                        |
| `tests/shadcn-parity/mapping.json`                | **Source of truth.** The comparison set. Produced incrementally (Task 3 seeds it; Tasks in each batch fill/confirm entries).                        |
| `tests/shadcn-parity/lib/interaction-scripts.ts`  | Deterministic, ordered interaction scripts keyed by name (e.g. `open`, `close-esc`, `select-item`), shared by Phase A (manual) and Phase B (suite). |
| `tests/shadcn-parity/lib/verify.ts`               | Core verify function: given a spec + two pages, runs the per-(state × theme) loop, captures the 3 signals, returns a structured verdict.            |
| `tests/shadcn-parity/lib/report.ts`               | Renders the `artifacts/shadcn-parity/<id>.md` findings report + copies side-by-side/delta PNGs.                                                     |
| `tests/shadcn-parity/generate-specs.ts`           | Reads `mapping.json`, emits one Playwright spec file per `status === "mapped"` entry into `tests/shadcn-parity/specs/`.                             |
| `tests/shadcn-parity/specs/<id>.spec.ts`          | Generated per-component Playwright specs (output of `generate-specs.ts`).                                                                           |
| `apps/site/playwright.shadcn.config.ts`           | Playwright config for the parity suite (chromium-only, sibling of `playwright.visual.config.ts`).                                                   |
| `artifacts/shadcn-parity/<id>.md` (+ PNGs)        | Findings reports (Phase A & B output).                                                                                                              |

**Decomposition note:** The reference app (Tasks 1–2) is a self-contained, independently runnable deliverable. The parity harness (Tasks 3–6) is the second deliverable. The per-batch comparison work (Tasks 7–12) consumes both. Phase C fixes are _per-batch follow-up tasks_ spawned by ❌ findings, not pre-enumerated here (they depend on what Batch A actually discovers — YAGNI).

---

## Task 1: Scaffold the isolated shadcn reference app

**Files:**

- Create: `tools/shadcn-reference/package.json`
- Create: `tools/shadcn-reference/tsconfig.json`
- Create: `tools/shadcn-reference/vite.config.ts`
- Create: `tools/shadcn-reference/index.html`
- Create: `tools/shadcn-reference/src/main.tsx`
- Create: `tools/shadcn-reference/src/App.tsx`
- Create: `tools/shadcn-reference/src/pages/button.tsx` (first real component page)
- Create: `tools/shadcn-reference/src/index.css` (shadcn tokens, light + dark)
- Test: verify by building + serving + loading in a browser (manual, not automated — it's a fixture)

**Interfaces:**

- Produces: a served app at `http://127.0.0.1:4333/<id>` for any mapped `<id>`. Task 2 (and all batch tasks) navigate to this URL as the `ref` frame.

- [ ] **Step 1: Confirm `tools/shadcn-reference/` is NOT swept into the workspace**

Run: `grep -n "packages\*\|tools/\*\|\"workspaces\"\|packages/" pnpm-workspace.yaml nx.json 2>/dev/null`
Expected: The pnpm workspace globs are `packages/*` (and similar) — `tools/shadcn-reference/` has its own `package.json` so pnpm would NOT auto-include it unless `tools/*` is a workspace glob. If `tools/*` IS a workspace glob, add `tools/shadcn-reference` to the pnpm-workspace `ignorePackages` (or equivalent exclusion) in the same task and note it. Record the outcome (this is a load-bearing fact for the "isolated" constraint).

- [ ] **Step 2: Create the app manifest**

Create `tools/shadcn-reference/package.json`:

```json
{
  "name": "shadcn-reference",
  "private": true,
  "type": "module",
  "version": "0.0.0",
  "scripts": {
    "dev": "vite --port 4333 --strictPort",
    "build": "vite build",
    "preview": "vite preview --port 4333 --strictPort"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.0.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.0",
    "lucide-react": "^0.469.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "typescript": "~5.6.0",
    "vite": "^6.0.0"
  }
}
```

Note: the reference app intentionally uses **Tailwind v3 + a classic (JS) `tailwind.config`** so the shadcn CLI (which targets v3-style `components.json` + CSS-vars) installs cleanly and predictably. This is a fixture, not a product — Solidiom's own Tailwind v4 recipe path is _not_ what we are testing here.

- [ ] **Step 3: Create the config files**

Create `tools/shadcn-reference/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "noEmit": true,
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["src"]
}
```

Create `tools/shadcn-reference/vite.config.ts`:

```ts
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "node:path"

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  server: { port: 4333, strictPort: true, host: "127.0.0.1" },
})
```

Create `tools/shadcn-reference/index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>shadcn reference</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Create `tools/shadcn-reference/tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
}
```

Create `tools/shadcn-reference/postcss.config.js`:

```js
export default { plugins: { tailwindcss: {}, autoprefixer: {} } }
```

Create `tools/shadcn-reference/src/index.css` (shadcn's canonical token set, light + dark):

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

- [ ] **Step 4: Create the app entry + router**

Create `tools/shadcn-reference/src/main.tsx`:

```tsx
import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route, Link, useParams, Navigate } from "react-router-dom"
import "./index.css"
import Button from "./pages/button"

const pages: Record<string, React.ComponentType> = { button: Button }

function ComponentPage() {
  const { id } = useParams<{ id: string }>()
  const Page = pages[id ?? ""]
  if (!Page) return <p className="p-4 text-destructive">No reference page for “{id}”.</p>
  return (
    <div className="min-h-screen p-6">
      <div className="mb-4 flex items-center gap-3">
        <Link to="/" className="text-sm text-muted-foreground hover:underline">
          index
        </Link>
        <span className="text-sm font-mono">/{id}</span>
        <button
          className="ml-auto rounded-md border px-2 py-1 text-xs"
          onClick={() => document.documentElement.classList.toggle("dark")}
        >
          toggle dark
        </button>
      </div>
      <Page />
    </div>
  )
}

function Index() {
  return (
    <div className="min-h-screen p-6">
      <h1 className="mb-4 text-lg font-semibold">shadcn reference</h1>
      <ul className="grid grid-cols-4 gap-2 text-sm">
        {Object.keys(pages).map((id) => (
          <li key={id}>
            <Link to={`/${id}`} className="text-primary hover:underline">
              {id}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/:id" element={<ComponentPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
```

Note: `pages` is the registry of reference pages. Each new component added in later batches appends one line to `pages` and adds one `src/pages/<id>.tsx`. Keep the import list explicit (no glob) so the router is statically analyzable.

- [ ] **Step 5: Create the first real component page (button) using the shadcn CLI**

Run (from `tools/shadcn-reference/`):

```
cd tools/shadcn-reference && npm install
```

Expected: clean install; a `node_modules/` appears inside the reference app (NOT the workspace `node_modules`).

Run (from `tools/shadcn-reference/`):

```
npx shadcn@latest init -y -b neutral
```

Expected: creates `components.json`, `src/lib/utils.ts` (the `cn` helper), and merges tokens into `index.css`. If it overwrites `src/index.css`, re-apply the canonical token block from Step 3 (keep both).

Run (from `tools/shadcn-reference/`):

```
npx shadcn@latest add button -y
```

Expected: writes `src/components/ui/button.tsx`.

- [ ] **Step 6: Wire the button page**

Create `tools/shadcn-reference/src/pages/button.tsx`:

```tsx
import { Button } from "@/components/ui/button"

export default function ButtonPage() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button disabled>Disabled</Button>
    </div>
  )
}
```

- [ ] **Step 7: Record the pinned shadcn component versions**

Run (from `tools/shadcn-reference/`):

```
npx shadcn@latest info
```

Capture the output. Also note the versions of `react` / `tailwindcss` / the shadcn CLI in `package.json` + lockfile. This is what goes in every findings report header (spec §5). Save a copy to `tools/shadcn-reference/PINNED.md`:

```markdown
# shadcn reference — pinned versions

CLI: <shadcn info CLI version>
react: ^19.x
tailwindcss: ^3.4.x
base theme: neutral (init -b neutral)
Components added (id: version-if-shown):

- button: <version>
```

- [ ] **Step 8: Build + serve + verify in a browser**

Run (from `tools/shadcn-reference/`):

```
npm run build
```

Expected: `dist/` produced, no TS/build errors.

Run (from `tools/shadcn-reference/`, background):

```
npm run preview
```

Open `http://127.0.0.1:4333/button` in a browser. Confirm: the buttons render, look like shadcn (neutral theme, rounded-md, hover/focus states), and `toggle dark` flips to the dark token set. Take a screenshot and save to `artifacts/shadcn-parity/_setup/reference-button.png` (create the dir). NOTE: no Chrome binary is available for the `chrome-devtools_*` MCP tools in this environment — use Playwright's bundled chromium (`chromium.launch()`) to navigate, assert the DOM, and screenshot. (Task 1 implementer already did this; the screenshot exists.)

- [ ] **Step 9: Commit**

```bash
git add tools/shadcn-reference/ artifacts/shadcn-parity/_setup/
git commit -m "feat(parity): scaffold isolated Vite+React shadcn reference app (button)"
```

---

## Task 2: Add the Batch-1 components to the reference app

**Files:**

- Modify: `tools/shadcn-reference/src/main.tsx` (append to `pages` registry)
- Create: `tools/shadcn-reference/src/pages/<id>.tsx` for each Batch-1 slug
- Modify: `tools/shadcn-reference/PINNED.md` (add the new components)

**Interfaces:**

- Consumes: Task 1's app shell + router + `pages` registry + shadcn CLI setup.
- Produces: reference pages at `http://127.0.0.1:4333/<id>` for every Batch-1 slug, so Batch-1 comparison (Task 8) has a `ref` frame for each.

Batch-1 slugs (from spec §4): `button` (done in Task 1), `input`, `label`, `checkbox`, `radio-group`, `switch`, `slider`, `select`, `combobox`, `textarea`, `field`, `input-otp`, `input-group`.

Note on shadcn names vs. slugs: the shadcn CLI component name for `radio-group` is `radio-group`, for `input-otp` is `input-otp`, for `combobox` shadcn uses `combobox` (or the older `command`+`popover` combo — use whatever `npx shadcn@latest add` resolves and record the actual added component in `PINNED.md`). For `field` and `input-group`, if the shadcn registry does not ship those exact names in the pinned version, record them in `PINNED.md` as "shadcn name: <closest> / or: not available in pinned version" and the mapping entry's `status` becomes `gap` (handled in Task 3). Do NOT hand-approximate a missing shadcn component.

- [ ] **Step 1: Add all Batch-1 components via the CLI**

Run (from `tools/shadcn-reference/`), one at a time so failures are isolated:

```
npx shadcn@latest add input label checkbox radio-group switch slider select textarea input-otp combobox -y
```

(If `combobox` or any name errors in the pinned CLI version, split the command and add the resolvable ones; record the unresolvable ones.)
Expected: `src/components/ui/<name>.tsx` files written for each.

- [ ] **Step 2: Create a page for each added component**

For each added `<name>`, create `tools/shadcn-reference/src/pages/<name>.tsx` rendering the real component in its default + key variants/states. Template (input shown; repeat the same shape for each, using the component's own API):

`tools/shadcn-reference/src/pages/input.tsx`:

```tsx
import { Input } from "@/components/ui/input"

export default function InputPage() {
  return (
    <div className="flex max-w-md flex-col gap-3">
      <Input placeholder="Default" />
      <Input placeholder="Disabled" disabled />
      <Input type="email" placeholder="email" />
    </div>
  )
}
```

`tools/shadcn-reference/src/pages/label.tsx`:

```tsx
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

export default function LabelPage() {
  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="ref-name">Name</Label>
      <Input id="ref-name" placeholder="Default" />
      <div className="flex items-center gap-2">
        <Checkbox id="ref-agree" />
        <Label htmlFor="ref-agree">Agree</Label>
      </div>
    </div>
  )
}
```

(Create the analogous `checkbox.tsx`, `radio-group.tsx`, `switch.tsx`, `slider.tsx`, `select.tsx`, `textarea.tsx`, `input-otp.tsx`, `combobox.tsx` pages using each component's real shadcn API — open `src/components/ui/<name>.tsx` to get the exact subcomponent names/props. If a component needs an interactive dependency to be meaningful, include the minimal one, e.g. `select` needs `SelectTrigger`/`SelectContent`/`SelectItem`.)

- [ ] **Step 3: Register all new pages in the router**

Modify `tools/shadcn-reference/src/main.tsx`: add an import per page and a `pages` entry per slug. Example for input:

```tsx
import Input from "./pages/input"
// …
const pages: Record<string, React.ComponentType> = {
  button: Button,
  input: Input,
  // … add the rest
}
```

- [ ] **Step 4: Update PINNED.md**

Append each added component (and its resolved shadcn name) to `tools/shadcn-reference/PINNED.md`.

- [ ] **Step 5: Build + serve + spot-check**

Run (from `tools/shadcn-reference/`): `npm run build` — expected: success.
Run (from `tools/shadcn-reference/`, background): `npm run preview`.
Open `http://127.0.0.1:4333/input`, `/checkbox`, `/select`, `/combobox` in DevTools; confirm each renders like real shadcn. Screenshot one (e.g. `/select`) to `artifacts/shadcn-parity/_setup/reference-select.png`.

- [ ] **Step 6: Commit**

```bash
git add tools/shadcn-reference/ artifacts/shadcn-parity/_setup/
git commit -m "feat(parity): add Batch-1 components to shadcn reference app"
```

---

## Task 3: Seed `mapping.json` (source of truth) with the Batch-1 comparison set

**Files:**

- Create: `tests/shadcn-parity/mapping.json`
- Test: `tests/shadcn-parity/mapping.test.ts` (a vitest spec that validates the file's shape)
- Create: `tests/shadcn-parity/vitest.config.ts` (if none exists for this dir)

**Interfaces:**

- Consumes: Batch-1 slug list; the `COMPONENTS_WITH_EXAMPLES` set (the authoritative Solidiom slugs with live islands); `tools/shadcn-reference/PINNED.md`.
- Produces: a validated `mapping.json` that Task 5's generator and Task 8's verification read. The shape contract here is what all later tasks depend on — see the `ParityMapping` type in Step 2.

- [ ] **Step 1: Write the failing shape test**

Create `tests/shadcn-parity/mapping.test.ts`:

```ts
import { describe, it, expect } from "vitest"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import type { ParityMapping } from "./lib/types"

const raw = readFileSync(join(import.meta.dirname, "mapping.json"), "utf8")
const mapping = JSON.parse(raw) as ParityMapping

const EXAMPLES = new Set([
  "accordion",
  "alert",
  "alert-dialog",
  "avatar",
  "badge",
  "breadcrumb",
  "button",
  "calendar",
  "card",
  "carousel",
  "checkbox",
  "collapsible",
  "combobox",
  "command-palette",
  "context-menu",
  "data-table",
  "date-picker",
  "dialog",
  "drawer",
  "empty-state",
  "field",
  "hover-card",
  "input",
  "input-otp",
  "kbd",
  "label",
  "listbox",
  "menu",
  "meter",
  "navigation-menu",
  "pagination",
  "popover",
  "progress",
  "radio-group",
  "resizable-panels",
  "scroll-area",
  "select",
  "sheet",
  "skeleton",
  "slider",
  "spinner",
  "switch",
  "tabs",
  "toast",
  "toggle",
  "toggle-group",
  "toolbar",
  "tooltip",
  "tree",
  "virtual-list",
])

describe("mapping.json", () => {
  it("has a unique id per entry", () => {
    const ids = mapping.map((m) => m.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
  it("every 'mapped' entry has a solidiom slug that has a live examples island", () => {
    for (const m of mapping.filter((x) => x.status === "mapped")) {
      expect(
        EXAMPLES.has(m.solidiom.siteSlug),
        `${m.id} -> ${m.solidiom.siteSlug} has no live island`,
      ).toBe(true)
      expect(m.solidiom.sitePath).toBe(`/components/${m.solidiom.siteSlug}/examples`)
    }
  })
  it("every 'mapped' entry declares parts, tokens, interactions, states, themes, tolerance", () => {
    for (const m of mapping.filter((x) => x.status === "mapped")) {
      expect(m.parts.length).toBeGreaterThan(0)
      expect(m.tokens).toBeTruthy()
      expect(m.interactions.length).toBeGreaterThanOrEqual(0)
      expect(m.states.length).toBeGreaterThan(0)
      expect(m.themes).toEqual(expect.arrayContaining(["light", "dark"]))
      expect(m.tolerance.pixelMaxPercent).toBeGreaterThan(0)
    }
  })
  it("every entry has a status in {mapped, gap, na}", () => {
    for (const m of mapping) expect(["mapped", "gap", "na"]).toContain(m.status)
  })
})
```

- [ ] **Step 2: Write the shared types**

Create `tests/shadcn-parity/lib/types.ts`:

```ts
export type SignalVerdict = "parity" | "accepted" | "gap"

export interface ParityMapping {
  readonly [id: string]: never
  // placeholder — real type below
}
export interface MappingEntry {
  id: string
  shadcn: { ref: string }
  solidiom: {
    package: string
    siteSlug: string
    sitePath: string
  }
  status: "mapped" | "gap" | "na"
  parts: string[]
  tokens: Record<string, Record<string, string>>
  interactions: string[]
  states: string[]
  themes: ("light" | "dark")[]
  tolerance: { pixelMaxDiff: number; pixelMaxPercent: number }
  acceptedDivergences: { signal: string; reason: string }[]
}
```

(Delete the placeholder `ParityMapping` interface — the authoritative export is `MappingEntry`, and `mapping.json` is `MappingEntry[]`. Fix the test import in Step 1 to `import type { MappingEntry } from "./lib/types"` and type `mapping` as `MappingEntry[]`.)

- [ ] **Step 3: Run the test to verify it fails**

Run (from repo root): `pnpm --filter @solidiom/site exec vitest run --config tests/shadcn-parity/vitest.config.ts mapping.test.ts` — or, if `tests/shadcn-parity` is not a package, run `pnpm exec vitest run tests/shadcn-parity/mapping.test.ts` (add the dir to the root `vitest.workspace.ts` `tests/*/vitest.config.ts` glob, which already matches it).
Expected: FAIL — `mapping.json` does not exist yet.

- [ ] **Step 4: Create the minimal `mapping.json` for Batch 1**

Create `tests/shadcn-parity/mapping.json`. Seed **every Batch-1 slug** with `status` and the Solidiom mapping; `parts`/`tokens`/`interactions`/`states` start as the _discovered_ values for `button` (filled by Task 8's Phase A) and are `[]`/`{}` for the rest until their Phase A pass fills them. This makes the shape test pass while honestly marking what's still to be discovered.

```json
[
  {
    "id": "button",
    "shadcn": { "ref": "button" },
    "solidiom": {
      "package": "@solidiom/button",
      "siteSlug": "button",
      "sitePath": "/components/button/examples"
    },
    "status": "mapped",
    "parts": ["Root"],
    "tokens": { "Root": { "borderRadius": "0.5rem", "minHeight": "2.5rem" } },
    "interactions": ["hover", "focus", "active"],
    "states": ["default", "hover", "focus", "disabled"],
    "themes": ["light", "dark"],
    "tolerance": { "pixelMaxDiff": 2, "pixelMaxPercent": 1.0 },
    "acceptedDivergences": []
  },
  {
    "id": "input",
    "shadcn": { "ref": "input" },
    "solidiom": {
      "package": "@solidiom/input",
      "siteSlug": "input",
      "sitePath": "/components/input/examples"
    },
    "status": "mapped",
    "parts": [],
    "tokens": {},
    "interactions": [],
    "states": ["default"],
    "themes": ["light", "dark"],
    "tolerance": { "pixelMaxDiff": 2, "pixelMaxPercent": 1.0 },
    "acceptedDivergences": []
  }
  // … one entry per Batch-1 slug. Any whose shadcn name is absent in the pinned
  // registry (per PINNED.md) get "status": "gap" and empty parts/tokens.
]
```

Add the remaining Batch-1 entries (`label`, `checkbox`, `radio-group`, `switch`, `slider`, `select`, `combobox`, `textarea`, `field`, `input-otp`, `input-group`) the same way — `mapped` if both a shadcn page (Task 2) and a Solidiom live island (in `COMPONENTS_WITH_EXAMPLES`) exist, else `gap`. `input-group` is **not** in `COMPONENTS_WITH_EXAMPLES`, so it is `gap` (record reason: "no Solidiom live examples island").

- [ ] **Step 5: Run the test to verify it passes**

Run: same vitest command as Step 3.
Expected: PASS — all 4 shape assertions hold.

- [ ] **Step 6: Commit**

```bash
git add tests/shadcn-parity/
git commit -m "feat(parity): seed mapping.json (source of truth) with Batch-1 comparison set"
```

---

## Task 4: Build the shared verify + report libraries (Phase B core)

**Files:**

- Create: `tests/shadcn-parity/lib/interaction-scripts.ts`
- Create: `tests/shadcn-parity/lib/verify.ts`
- Create: `tests/shadcn-parity/lib/report.ts`
- Test: `tests/shadcn-parity/lib/verify.test.ts`
- Test: `tests/shadcn-parity/lib/report.test.ts`

**Interfaces:**

- Consumes: `MappingEntry` (Task 3).
- Produces:
  - `runInteractions(page, scriptName) : Promise<void>` — drives a named deterministic script into one page.
  - `verifyEntry(entry, refPage, solPage, outDir) : Promise<VerdictReport>` — the per-component engine: loops themes × states, captures 3 signals on both frames, diffs, returns a structured report.
  - `writeReport(entry, report, outDir) : Promise<string>` — renders the findings markdown + copies PNGs; returns the md path.
  - `VerdictReport` type (below) — the shape Phase A (manual) and Phase B (suite) both produce.

- [ ] **Step 1: Define the verdict shape**

Append to `tests/shadcn-parity/lib/types.ts`:

```ts
export interface SignalResult {
  signal: string // e.g. "tokens.Root.borderRadius", "behavior.close-esc", "pixels.light.default"
  expected: string
  actual: string
  verdict: SignalVerdict // "parity" | "accepted" | "gap"
}
export interface VerdictReport {
  id: string
  shadcnVersion: string
  solidiomSha: string
  signals: SignalResult[]
  failures: number // count of verdict === "gap"
  accepted: number // count of verdict === "accepted"
}
```

- [ ] **Step 2: Write the failing test for `verify.ts` token assertion**

Create `tests/shadcn-parity/lib/verify.test.ts`:

```ts
import { describe, it, expect } from "vitest"
import { assertToken } from "./verify"

describe("assertToken", () => {
  it("passes an exact match", () => {
    expect(assertToken("0.5rem", "0.5rem")).toEqual({
      pass: true,
      expected: "0.5rem",
      actual: "0.5rem",
    })
  })
  it("passes a relational >= assertion", () => {
    expect(assertToken(">=40", "48")).toEqual({ pass: true, expected: ">=40", actual: "48" })
    expect(assertToken(">=40", "32")).toEqual({ pass: false, expected: ">=40", actual: "32" })
  })
  it("fails a non-matching exact value", () => {
    expect(assertToken("0.5rem", "8px")).toEqual({ pass: false, expected: "0.5rem", actual: "8px" })
  })
})
```

- [ ] **Step 3: Implement `assertToken` (and the token-assertion core of `verify.ts`)**

Create `tests/shadcn-parity/lib/verify.ts`. Start with the pure, testable token assertion:

```ts
export interface TokenAssertResult {
  pass: boolean
  expected: string
  actual: string
}

export function assertToken(expected: string, actual: string): TokenAssertResult {
  if (expected.startsWith(">=")) {
    const threshold = parseFloat(expected.slice(2))
    return { pass: parseFloat(actual) >= threshold, expected, actual }
  }
  if (expected.startsWith("<=")) {
    const threshold = parseFloat(expected.slice(2))
    return { pass: parseFloat(actual) <= threshold, expected, actual }
  }
  // exact, or token-identity compared by resolved value:
  return { pass: expected === actual, expected, actual }
}
```

(Add the `readComputedTokens(page, partSelectors, tokenMap)` and `captureBehavior(page, partSelectors)` and `screenshotPart(page, partSelectors)` async helpers in the same file as subsequent steps; keep `assertToken` pure so it's unit-testable without a browser.)

- [ ] **Step 4: Run the token test to verify it passes**

Run: `pnpm exec vitest run tests/shadcn-parity/lib/verify.test.ts`
Expected: PASS.

- [ ] **Step 5: Write the failing test for `report.ts`**

Create `tests/shadcn-parity/lib/report.test.ts`:

```ts
import { describe, it, expect } from "vitest"
import { renderFindings } from "./report"
import type { VerdictReport } from "./types"

const report: VerdictReport = {
  id: "dialog",
  shadcnVersion: "neutral@1.x",
  solidiomSha: "abc1234",
  signals: [
    {
      signal: "tokens.Trigger.borderRadius",
      expected: "0.5rem",
      actual: "0.625rem",
      verdict: "accepted",
    },
    { signal: "behavior.close-esc", expected: "closed", actual: "still open", verdict: "gap" },
    { signal: "pixels.light.default", expected: "—", actual: "delta 3.1%", verdict: "gap" },
  ],
  failures: 2,
  accepted: 1,
}

describe("renderFindings", () => {
  it("emits the header with status counts and a per-signal table", () => {
    const md = renderFindings(report)
    expect(md).toContain("# dialog — shadcn parity")
    expect(md).toContain("Status: ❌ 2 failures, 1 accepted divergence")
    expect(md).toContain("| tokens.Trigger.borderRadius | 0.5rem | 0.625rem | 🟡 accepted |")
    expect(md).toContain("| behavior.close-esc | closed | still open | ❌ |")
    expect(md).toContain(report.shadcnVersion)
    expect(md).toContain(report.solidiomSha)
  })
})
```

- [ ] **Step 6: Implement `renderFindings`**

Create `tests/shadcn-parity/lib/report.ts`:

```ts
import type { VerdictReport } from "./types"

const GLYPH: Record<string, string> = { parity: "✅", accepted: "🟡", gap: "❌" }

export function renderFindings(r: VerdictReport): string {
  const lines: string[] = []
  lines.push(`# ${r.id} — shadcn parity`)
  lines.push(`Reference: shadcn@${r.shadcnVersion}, solidiom @ ${r.solidiomSha}`)
  lines.push(
    `Status: ${r.failures ? "❌" : "✅"} ${r.failures} failures, ${r.accepted} accepted divergence${r.accepted === 1 ? "" : "s"}`,
  )
  lines.push("")
  lines.push("| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |")
  lines.push("|---|---|---|---|")
  for (const s of r.signals) {
    lines.push(
      `| ${s.signal} | ${s.expected} | ${s.actual} | ${GLYPH[s.verdict]} ${s.verdict === "accepted" ? "accepted" : s.verdict === "gap" ? "" : ""} |`
        .replace("  |", " |")
        .trimEnd(),
    )
  }
  lines.push("")
  lines.push("[side-by-side PNGs + delta heatmaps: see assets/]")
  return lines.join("\n")
}
```

(Fix the row formatting so the accepted row renders exactly `| … | 0.5rem | 0.625rem | 🟡 accepted |` and the gap row `| … | closed | still open | ❌ |` — simplify the `.replace` hack to a clean template literal; the test in Step 5 is the contract.)

- [ ] **Step 7: Run the report test to verify it passes**

Run: `pnpm exec vitest run tests/shadcn-parity/lib/report.test.ts`
Expected: PASS.

- [ ] **Step 8: Implement the interaction scripts**

Create `tests/shadcn-parity/lib/interaction-scripts.ts`. A script is an ordered list of primitive actions, keyed by name, so the _same_ name drives both frames identically:

```ts
import type { Page } from "@playwright/test"

export type Action =
  | { kind: "click"; selector: string }
  | { kind: "press"; selector?: string; key: string }
  | { kind: "fill"; selector: string; value: string }
  | { kind: "hover"; selector: string }
  | { kind: "wait"; selector?: string; ms?: number }

export const scripts: Record<string, Action[]> = {
  // state-advancing scripts used by `states` entries
  open: [{ kind: "click", selector: "[data-part='trigger'], [role='combobox'], button" }],
  "close-esc": [
    { kind: "click", selector: "[data-part='trigger'], button" },
    { kind: "press", key: "Escape" },
  ],
  "close-overlay-click": [
    { kind: "click", selector: "[data-part='trigger'], button" },
    { kind: "click", selector: "body" },
  ],
  focus: [{ kind: "click", selector: "input, [role='slider'], [role='switch']" }],
  hover: [{ kind: "hover", selector: "button, [role='switch'], [role='slider']" }],
  active: [{ kind: "click", selector: "button, [role='switch'], [role='slider']" }],
  "select-item": [
    { kind: "click", selector: "[role='combobox'], [data-part='trigger'], button" },
    { kind: "press", key: "ArrowDown" },
    { kind: "press", key: "Enter" },
  ],
  reset: [{ kind: "wait", ms: 50 }],
}

export async function runInteractions(page: Page, name: string): Promise<void> {
  const steps = scripts[name]
  if (!steps) throw new Error(`Unknown interaction script: ${name}`)
  for (const a of steps) {
    if (a.kind === "click") await page.click(a.selector)
    else if (a.kind === "hover") await page.hover(a.selector)
    else if (a.kind === "fill") await page.fill(a.selector, a.value)
    else if (a.kind === "press")
      await (a.selector ? page.locator(a.selector) : page).keyboard.press(a.key)
    else if (a.kind === "wait")
      await (a.selector ? page.waitForSelector(a.selector) : page.waitForTimeout(a.ms ?? 50))
  }
}
```

Note: selectors are **best-effort generic** (role- + data-part-based). Per-component Phase A passes refine the `selector` values in the mapping (a `selectors` override) so the script targets the real element; the generic defaults keep the file DRY and let simple components work unmodified.

- [ ] **Step 9: Commit**

```bash
git add tests/shadcn-parity/
git commit -m "feat(parity): verify + report libraries and deterministic interaction scripts"
```

---

## Task 5: Build the spec generator + Playwright config (Phase B runner)

**Files:**

- Create: `tests/shadcn-parity/generate-specs.ts`
- Create: `tests/shadcn-parity/specs/` (output dir)
- Create: `apps/site/playwright.shadcn.config.ts`
- Test: `tests/shadcn-parity/generate-specs.test.ts`

**Interfaces:**

- Consumes: `mapping.json` (Task 3), `verifyEntry` (Task 4).
- Produces: one `tests/shadcn-parity/specs/<id>.spec.ts` per `status === "mapped"` entry, and a runnable Playwright config. The generated spec is what `pnpm run test:parity` executes.

- [ ] **Step 1: Write the failing generator test**

Create `tests/shadcn-parity/generate-specs.test.ts`:

```ts
import { describe, it, expect } from "vitest"
import { generateSpecForEntry } from "./generate-specs"
import type { MappingEntry } from "./lib/types"

const entry: MappingEntry = {
  id: "button",
  shadcn: { ref: "button" },
  solidiom: {
    package: "@solidiom/button",
    siteSlug: "button",
    sitePath: "/components/button/examples",
  },
  status: "mapped",
  parts: ["Root"],
  tokens: { Root: { borderRadius: "0.5rem" } },
  interactions: ["hover"],
  states: ["default", "hover"],
  themes: ["light", "dark"],
  tolerance: { pixelMaxDiff: 2, pixelMaxPercent: 1.0 },
  acceptedDivergences: [],
}

describe("generateSpecForEntry", () => {
  it("emits a spec that references both frames and the entry id", () => {
    const code = generateSpecForEntry(entry)
    expect(code).toContain("button")
    expect(code).toContain("REF_BASE")
    expect(code).toContain("SOL_BASE")
    expect(code).toContain("verifyEntry")
    expect(code).toContain("writeReport")
  })
  it("emits nothing for non-mapped entries", () => {
    expect(generateSpecForEntry({ ...entry, status: "gap" })).toBe("")
  })
})
```

- [ ] **Step 2: Implement the generator**

Create `tests/shadcn-parity/generate-specs.ts`:

```ts
import { readFileSync, writeFileSync, mkdirSync } from "node:fs"
import { join } from "node:path"
import type { MappingEntry } from "./lib/types"

// The generated spec embeds the entry as a JSON literal and calls the shared engine.
export function generateSpecForEntry(entry: MappingEntry): string {
  if (entry.status !== "mapped") return ""
  const literal = JSON.stringify(entry, null, 2)
  return `import { test, expect, Page } from "@playwright/test"
import { verifyEntry } from "../lib/verify"
import { writeReport } from "../lib/report"

const ENTRY = ${literal} as import("../lib/types").MappingEntry
const REF_BASE = "http://127.0.0.1:4333"
const SOL_BASE = "http://127.0.0.1:4322"

test("${ENTRY.id} — shadcn parity", async ({ browser }) => {
  const refCtx = await browser.newContext()
  const solCtx = await browser.newContext()
  const refPage: Page = await refCtx.newPage()
  const solPage: Page = await solCtx.newPage()
  await refPage.goto(REF_BASE + "/" + ENTRY.shadcn.ref, { waitUntil: "networkidle" })
  await solPage.goto(SOL_BASE + ENTRY.solidiom.sitePath, { waitUntil: "networkidle" })
  const report = await verifyEntry(ENTRY, refPage, solPage, "artifacts/shadcn-parity")
  const path = await writeReport(ENTRY, report, "artifacts/shadcn-parity")
  // A gap fails the test; accepted/parity pass.
  expect(report.failures, "unresolved gaps in " + ENTRY.id + " (see " + path + ")").toBe(0)
  await refCtx.close(); await solCtx.close()
})
`
}

export function generateAll(): string[] {
  const mapping = JSON.parse(
    readFileSync(join(import.meta.dirname, "mapping.json"), "utf8"),
  ) as MappingEntry[]
  const outDir = join(import.meta.dirname, "specs")
  mkdirSync(outDir, { recursive: true })
  const written: string[] = []
  for (const entry of mapping) {
    const code = generateSpecForEntry(entry)
    if (!code) continue
    const file = join(outDir, `${entry.id}.spec.ts`)
    writeFileSync(file, code)
    written.push(file)
  }
  return written
}
```

- [ ] **Step 3: Run the generator test**

Run: `pnpm exec vitest run tests/shadcn-parity/generate-specs.test.ts`
Expected: PASS.

- [ ] **Step 4: Create the Playwright config**

Create `apps/site/playwright.shadcn.config.ts` (sibling of `playwright.visual.config.ts`):

```ts
import { defineConfig, devices } from "@playwright/test"

/**
 * shadcn parity suite. Chromium-only for pixel-consistent captures.
 * Reference app must be running on :4333 (tools/shadcn-reference) and the site
 * on :4322 (site preview). Run generation first: pnpm run parity:generate.
 * Gated out of CI by default (human-in-loop per spec §4); enable with PARITY_IN_CI=1.
 */
export default defineConfig({
  testDir: "./tests/shadcn-parity/specs",
  outputDir: "../../test-results/site-shadcn-parity",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [["list"]],
  use: {
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
})
```

- [ ] **Step 5: Wire the npm scripts + a mise task**

In `apps/site/package.json`, add to `scripts`:

```json
"parity:generate": "pnpm --filter @solidiom/site exec tsx tests/shadcn-parity/generate-specs.ts",
"test:parity": "pnpm --filter @solidiom/site exec playwright test --config playwright.shadcn.config.ts"
```

In root `.mise.toml`, add a task:

```toml
[tasks.parity:shadcn]
run = "pnpm --filter @solidiom/site run test:parity"
description = "Run the shadcn parity suite (needs reference app :4333 + site :4322 running)"
```

(If `.mise.toml` uses a different schema for tasks, match the existing task style in that file — inspect one existing `[tasks.*]` entry first and copy its shape.)

- [ ] **Step 6: Commit**

```bash
git add tests/shadcn-parity/ apps/site/playwright.shadcn.config.ts apps/site/package.json .mise.toml
git commit -m "feat(parity): spec generator + Playwright config + run scripts"
```

---

## Task 6: End-to-end harness smoke test on `button`

**Files:**

- Modify: `tests/shadcn-parity/mapping.json` (ensure `button` has discovered, non-empty tokens/interactions)
- Test: run the generated `button` spec end-to-end and confirm a real findings report is emitted

**Interfaces:**

- Consumes: Tasks 1–5 (reference app button page, mapping button entry, verify/report libs, generator, config).
- Produces: proof the whole pipeline works for one component before scaling to the batch. If this fails, stop and fix the harness — do not proceed to the batch.

- [ ] **Step 1: Bring up both servers**

Run (reference app, background, from `tools/shadcn-reference/`):

```
npm run preview
```

Run (site, background, from repo root — mirrors the webServer command in
`apps/site/playwright.visual.config.ts`: build + search-index + preview on 4322):

```
pnpm --filter @solidiom/site run build && pnpm --filter @solidiom/site run search-index && pnpm --filter @solidiom/site exec astro preview --host 127.0.0.1 --port 4322
```

Expected: `http://127.0.0.1:4333/button` and `http://127.0.0.1:4322/components/button/examples` both load.

- [ ] **Step 2: Confirm the button mapping entry is complete**

Open `tests/shadcn-parity/mapping.json`; ensure the `button` entry has non-empty `parts`, `tokens`, `interactions`, `states`. (The discovered values are filled during Phase A in Task 8 Step 2; if not yet filled, fill them now from the Phase A pass — this task depends on them being real.)

- [ ] **Step 3: Generate specs and run just button**

Run (from repo root):

```
pnpm --filter @solidiom/site run parity:generate
pnpm --filter @solidiom/site exec playwright test --config playwright.shadcn.config.ts specs/button.spec.ts
```

Expected: the `button — shadcn parity` test runs; it either passes (failures=0) or fails listing concrete ❌ signals. A _crash_ (e.g. verifyEntry throwing, bad selector) is a harness bug — fix the harness, not the recipe.

- [ ] **Step 4: Inspect the emitted findings report**

Run: `cat artifacts/shadcn-parity/button.md`
Expected: a valid findings doc with the header, the per-signal table, and the shadcn version + solidiom sha. Confirm the PNG assets were copied next to it. If the report is malformed, fix `report.ts` (its contract is the Step 5 test from Task 4).

- [ ] **Step 5: Commit (harness smoke proof)**

```bash
git add artifacts/shadcn-parity/button.md artifacts/shadcn-parity/assets/ tests/shadcn-parity/
git commit -m "test(parity): button end-to-end harness smoke passes"
```

---

## Task 7: Phase A — DevTools discovery pass for Batch 1 (the live comparison)

**Files:**

- Modify: `tests/shadcn-parity/mapping.json` (fill discovered `parts`/`tokens`/`interactions`/`states`/`selectors` overrides for each Batch-1 component)
- Create: `artifacts/shadcn-parity/<id>.md` for each Batch-1 component (via the live pass)

**Interfaces:**

- Consumes: reference app (Task 2), the site's live islands, `interaction-scripts.ts` (Task 4) as the _action vocabulary_.
- Produces: the **settled** Batch-1 `mapping.json` (real, discovered tokens/interactions) + first findings reports. **This is the review gate (spec §4): the user reviews these before Task 11 (Batch 2) starts.**

This task is _agent-driven_ (the assistant, this session) using **Playwright with two isolated contexts** — it is the discovery engine. (No Chrome binary is available in this environment, so the `chrome-devtools_*` MCP tools cannot be used; Playwright's bundled chromium is the browser.) The procedure is exactly spec §3 Steps 0–5, performed live per component via a small Playwright script that opens the ref and sol contexts, reads computed styles / `activeElement` / `aria-*` / `data-state`, and screenshots bounding boxes.

- [ ] **Step 1: For each Batch-1 component, run the live side-by-side comparison**

For each `id` in Batch 1 (`button`, `input`, `label`, `checkbox`, `radio-group`, `switch`, `slider`, `select`, `combobox`, `textarea`, `field`, `input-otp`, `input-group`), do the following using a Playwright script (open two contexts — one to `http://127.0.0.1:4333/<ref>`, one to `http://127.0.0.1:4322/components/<slug>/examples`):

1. **Snapshot both** — dump the a11y/DOM tree of each frame (`page.content()` / an `aria` snapshot) and read it; identify the real part selectors (this refines the generic selectors in `interaction-scripts.ts` and fills the per-entry `selectors` override in the mapping).
2. **For light and dark** (toggle theme on each frame per the global-constraint idiom), and **for each state** (default, hover, focus, disabled, open, etc. — the states the component actually has), after driving the state with `page.click`/`page.hover`/`page.keyboard.press`/`page.fill`:
   - **Computed styles**: `page.evaluate` to read `getComputedStyle` on each part for the declared token props → record actual values on both frames.
   - **Behavior**: read `activeElement` role/part, `aria-*`, `data-state`/open-closed flags on both frames (via `page.evaluate`) → record the snapshot pair.
   - **Pixels**: `locator.screenshot()` of the component bounding box on both frames → save side by side.
3. **Diff and verdict** per the fixed vocabulary (✅/🟡/❌), deciding token values and interaction expectations from what shadcn _actually_ does (shadcn is the reference truth for "like shadcn").

- [ ] **Step 2: Write the discovered values into `mapping.json`**

For each component, update its entry with the real `parts`, `tokens` (shadcn's observed values), `interactions`, `states`, and a `selectors` override (real part selectors found in Step 1.1). Where Solidiom's value legitimately differs and the difference is a deliberate design choice, add it to `acceptedDivergences` with a reason. Where it's a real gap, leave it as a ❌ (do NOT paper over it).

- [ ] **Step 3: Emit the live findings report per component**

For each component, write `artifacts/shadcn-parity/<id>.md` in the exact `renderFindings` format (header + status counts + per-signal table + assets), and copy the side-by-side + delta PNGs to `artifacts/shadcn-parity/assets/<id>/`.

- [ ] **Step 4: Re-run the generator + button smoke to confirm the discovered mapping drives the suite cleanly**

Run: `pnpm --filter @solidiom/site run parity:generate` then re-run the `button` spec (Task 6 Step 3). Expected: now uses the discovered tokens/selectors and produces a consistent report.

- [ ] **Step 5: Commit the Batch-1 discovered mapping + findings**

```bash
git add tests/shadcn-parity/mapping.json artifacts/shadcn-parity/
git commit -m "feat(parity): Batch-1 discovered mapping + live findings reports"
```

- [ ] **Step 6: REVIEW GATE — stop and hand to the user**

Present the Batch-1 findings (per component: ✅ / 🟡 / ❌ counts + the ❌ list) and the settled `mapping.json` token/interaction definitions. **Do not proceed to Task 11 (Batch 2) until the user confirms the "like shadcn" definition is right** (spec §4 checkpoint). If the user corrects tokens/interactions/tolerances, update `mapping.json`, re-run Task 7 Step 4, re-commit, and re-present.

---

## Task 8: Phase C — fix Batch-1 ❌ gaps in recipes/primitives

**Files:**

- Modify: `packages/recipes-*/src/**` and/or `packages/<primitive>/src/**` for each confirmed ❌ from Task 7.
- Test: re-run the affected component's parity spec (and the package's own unit/browser tests) to confirm the fix.

**Interfaces:**

- Consumes: the ❌ list from Task 7's findings reports (each names a specific signal: `tokens.X.Y`, `behavior.<interaction>`, `pixels.<theme>.<state>`).
- Produces: Batch-1 components at ✅/🟡 only (no unresolved ❌). Fixes respect the global constraint: **look/behavior only, never API/props/names.**

This task is _per-finding_. Each ❌ becomes one focused fix. The sub-steps repeat per finding:

- [ ] **Step 1: For each ❌, identify the exact source**

A `tokens` ❌ → the recipe CSS (e.g. `packages/recipes-css/src/styles/<slug>.css`) or the recipe variant file. A `behavior` ❌ → the primitive source (e.g. `packages/<primitive>/src/`) or the recipe TSX wrapper. A `pixels` ❌ that is not explained by a `tokens` ❌ → investigate layout/spacing in the recipe.

- [ ] **Step 2: Write/extend the failing test first**

For a behavior fix, add or extend the package's existing browser/interaction test to reproduce the gap (e.g. "Esc closes the dialog"). For a look fix, the parity token assertion _is_ the test — but also add a unit assertion where the package has a test file for that style, so the fix is locked in the package's own suite, not only the parity suite.

- [ ] **Step 3: Apply the minimal fix (look/behavior only)**

Change the recipe/primitive so the declared signal matches shadcn's observed value. Do NOT add shadcn-compatible props/names/API. If the "correct" fix would require an API change, that is a **design conflict** — stop, record it in the findings report as a 🔴 design-conflict (not a fixable ❌), and surface it to the user rather than forcing it.

- [ ] **Step 4: Re-run the component's parity spec + package tests**

Run: `pnpm --filter @solidiom/site exec playwright test --config playwright.shadcn.config.ts specs/<id>.spec.ts` (and `pnpm --filter @solidiom/<package> test`). Expected: the ❌ is now ✅ (or 🟡 if it's an accepted divergence). Confirm no regression in the package's own suite.

- [ ] **Step 5: Re-emit the findings report + commit per component**

Regenerate `artifacts/shadcn-parity/<id>.md` (re-run Task 7 Step 3 for that id) and commit:

```bash
git add packages/ artifacts/shadcn-parity/
git commit -m "fix(parity): <id> — <one-line signal fixed>"
```

- [ ] **Step 6: Batch-1 done**

All Batch-1 components are ✅/🟡. The Batch-1 review gate (Task 7 Step 6) has passed. Proceed to Task 9.

---

## Task 9: Scale the harness to Batch 2 (overlays) — reference app + mapping + discovery

**Files:**

- Modify: `tools/shadcn-reference/src/main.tsx`, `tools/shadcn-reference/src/pages/<id>.tsx` (Batch-2 slugs), `tools/shadcn-reference/PINNED.md`
- Modify: `tests/shadcn-parity/mapping.json` (Batch-2 entries)
- Create: `artifacts/shadcn-parity/<id>.md` (Batch-2)

**Interfaces:**

- Consumes: the now-proven harness from Tasks 1–8 (the Batch-1 gate passed).
- Produces: Batch-2 reference pages + discovered mapping + findings. Batch-2 slugs (spec §4): `dialog`, `alert-dialog`, `sheet`, `drawer`, `popover`, `tooltip`, `hover-card`, `dropdown-menu`, `context-menu`, `menubar`.

This task is the _same shape_ as Tasks 2 + 7, repeated for Batch 2. The overlays are behavior-heavy (focus trap, Esc, portal, positioning), so the Phase A pass (Step 3) is where the real divergences surface.

- [ ] **Step 1: Add Batch-2 components to the reference app**

From `tools/shadcn-reference/`: `npx shadcn@latest add dialog alert-dialog sheet drawer popover tooltip hover-card dropdown-menu context-menu menubar -y`. Create a page for each (real shadcn API, minimal interactive setup — e.g. `dialog` needs `DialogTrigger`/`DialogContent`/`DialogHeader`/`DialogTitle`; `dropdown-menu` needs `DropdownMenuTrigger` + items). Register each in `pages`. Update `PINNED.md`. Build + spot-check one overlay in the browser.

- [ ] **Step 2: Add Batch-2 entries to `mapping.json`**

One entry per Batch-2 slug. Map shadcn name → Solidiom `siteSlug` (use `COMPONENTS_WITH_EXAMPLES` to confirm the slug has a live island; e.g. shadcn `dropdown-menu` → Solidiom `menu`; shadcn `alert-dialog` → Solidiom `alert-dialog`; shadcn `sheet` → Solidiom `sheet`). Slugs with no live island → `gap`. Seed `states`/`themes` (overlays: `["default","open"]`, `["light","dark"]`); leave `parts`/`tokens`/`interactions` to be discovered in Step 3.

- [ ] **Step 3: Phase A discovery pass for Batch 2 (live, per component)**

Same procedure as Task 7 Step 1, per overlay. Overlays need extra care on: focus trap (after open, Tab stays inside; Esc closes; focus returns to trigger on close), portal/target (content rendered into a portal — verify `data-state` on the portal node), and positioning (popover/tooltip/dropdown anchor). Write discovered values into `mapping.json`; emit findings per component.

- [ ] **Step 4: Commit**

```bash
git add tools/shadcn-reference/ tests/shadcn-parity/mapping.json artifacts/shadcn-parity/
git commit -m "feat(parity): Batch-2 (overlays) reference pages + discovered mapping + findings"
```

- [ ] **Step 5: Phase C — fix Batch-2 ❌ gaps**

Repeat Task 8 per confirmed ❌ (look/behavior only; design conflicts → 🔴, surface to user). Commit per component. Batch-2 done when all ✅/🟡.

---

## Task 10: Scale to Batches 3, 4, 5 (navigation/structure, data/feedback, command/composites)

**Files:** as Task 9, per batch.

**Interfaces:**

- Consumes: proven harness.
- Produces: each remaining batch at ✅/🟡. Batches (spec §4):
  - **Batch 3** — navigation & structure: `tabs`, `accordion`, `collapsible`, `breadcrumb`, `navigation-menu`, `sidebar`, `pagination`, `resizable-panels`, `scroll-area`, `separator`, `avatar`, `badge`, `kbd`.
  - **Batch 4** — data & feedback: `table`, `data-table`, `calendar`, `date-picker`, `carousel`, `chart`, `progress`, `skeleton`, `spinner`, `toast`, `empty-state`.
  - **Batch 5** — command & composites: `command-palette`, `tree`, `listbox`, + remaining mapped; close out all `gap`/`na` entries with rationale in `PINNED.md`/mapping.

Note: `sidebar`, `chart`, `table`, `separator`, `avatar`, `badge`, `kbd`, `calendar` — check each against `COMPONENTS_WITH_EXAMPLES`; a slug not in that set (e.g. `sidebar` if it has no live island, or `table`/`chart` if no `*Example.tsx` is mounted) is `gap` (record: "no Solidiom live examples island") — do NOT fabricate a comparison surface.

For each batch, the cycle is **identical** to Task 9: (1) add to reference app + `PINNED.md`, (2) add mapping entries, (3) Phase A live discovery, (4) commit, (5) Phase C fix per ❌, (6) batch done when all ✅/🟡.

- [ ] **Step 1: Batch 3** — run the Task-9 cycle for the Batch-3 slugs. Commit: `feat(parity): Batch-3 (navigation/structure) …`
- [ ] **Step 2: Batch 4** — run the Task-9 cycle for the Batch-4 slugs. Commit: `feat(parity): Batch-4 (data/feedback) …`
- [ ] **Step 3: Batch 5** — run the Task-9 cycle for the Batch-5 slugs; close out every `gap`/`na` with a recorded reason. Commit: `feat(parity): Batch-5 (command/composites) + gap rationale`
- [ ] **Step 4: Full-parity status** — run the whole suite once: `pnpm --filter @solidiom/site run parity:generate && pnpm --filter @solidiom/site run test:parity`. Record the per-component ✅/🟡/❌ rollup. Any residual ❌ that is a **design conflict** (fix requires an API change) is listed explicitly for the user's decision — it is _not_ force-fixed.

---

## Task 11: Finalize — gate the suite into CI + document

**Files:**

- Modify: `.mise.toml` (a `parity:shadcn:ci` task) or a CI workflow, per the existing CI pattern
- Modify: `docs/superpowers/specs/2026-09-25-shadcn-parity-harness-design.md` (add an "As-built" note) or create a short `docs/shadcn-parity.md` how-to

**Interfaces:**

- Consumes: the complete, green (✅/🟡) parity suite.
- Produces: a documented, CI-gated (opt-in) parity run + operator notes.

- [ ] **Step 1: Decide the CI posture**

The parity suite needs both the reference app (:4333) and the site preview (:4322) running, and it is pixel-sensitive (must use the pinned Playwright image, same as the visual suite — `tools/visual-container.sh` pins `v<pinnedPlaywright>-noble`). Per spec §4 the suite is **human-in-loop and gated out of CI by default.** Confirm: leave `test:parity` as a local/mise task only (recommended for a visual-parity suite), OR add an opt-in `PARITY_IN_CI=1` nightly job that uses the pinned container. Record the decision.

- [ ] **Step 2: Add the operator doc**

Create `docs/shadcn-parity.md`: how to (a) bring up the reference app, (b) bring up the site preview, (c) `parity:generate`, (d) `test:parity` (all or one `specs/<id>.spec.ts`), (e) read findings reports, (f) add a new component to the comparison set (add to `mapping.json` + reference app + `pages`), (g) re-baseline shadcn versions (re-run `npx shadcn add`, update `PINNED.md`, re-run full parity). Copy the global-constraint "look/behavior only, never API" warning verbatim.

- [ ] **Step 3: Update the spec with an As-built note**

Append a short "As-built (YYYY-MM-DD)" section to the design doc noting: the exact shadcn version pinned, the component count reached, the ✅/🟡/❌ rollup, and any design conflicts surfaced to the user. Commit.

- [ ] **Step 4: Commit**

```bash
git add docs/ .mise.toml
git commit -m "docs(parity): operator guide + as-built note; finalize CI posture"
```

---

## Self-Review

Run after the plan is written (done here).

**1. Spec coverage.**

- §1 goals/non-goals/governing rule/success criteria → Global Constraints + Task 8 Step 3 (API-change → 🔴 design conflict) + per-component verdict vocabulary throughout. ✅
- §2a mapping file (source of truth, §15.4, gap/na, reviewed pre-Phase-B) → Task 3 (seed + shape test), Task 7 Step 6 (review gate), Task 9 Step 2 (per-batch mapping). ✅
- §2b isolated reference app (own lockfile, excluded from nx graph, pinned) → Task 1 (Step 1 confirms isolation; Steps 2–3 config; Step 7 PINNED.md), Task 2, Task 9. ✅
- §2c parity suite (two contexts, generated from mapping) → Task 4 (verify/report), Task 5 (generator + config). ✅
- §2 DevTools Phase A → Task 7 (explicit agent-driven live pass), Task 9 Step 3, Task 10. ✅
- §3 per-component flow Steps 0–5 → Task 7 Step 1 (live), Task 4 (verify engine encodes it for Phase B), Task 6 (smoke). ✅
- §4 batching 0–5 + review gate after Batch 1 → Tasks 1–2 (Batch 0), 3–8 (Batch 1 + gate at Task 7 Step 6), 9 (Batch 2), 10 (Batches 3–5). ✅
- §5 risks (rot→pin; tokens→resolved-value; pixel brittle→token primary; determinism→wait/reset; sitePath→COMPONENTS_WITH_EXAMPLES gate; scope creep→🔴+constraint; pollution→isolation) → covered in the corresponding tasks. ✅
- §6 deliverables → mapping.json (Task 3), reference app (Task 1–2), config (Task 5), specs (Task 5 gen), findings (Task 7), Phase C fixes (Task 8). ✅
- §7 non-outputs → Global Constraints + Task 8 Step 3. ✅
- **Gap found & fixed:** the plan originally implied Phase A was "manual"; made it explicitly agent-driven (Task 7) with a defined DevTools tool procedure. Also added the "design conflict → 🔴, surface, don't force" rule (Task 8 Step 3) to guard the API non-goal mechanically.

**2. Placeholder scan.** The `button` token/selector values in Task 3 Step 4 are explicitly marked as _seed, filled by Phase A_ (Task 7) — that is an honest data-state, not a TBD, and the shape test only requires non-empty for `mapped` after discovery; Task 6 Step 2 gates on them being real before the smoke run. `input-group` and other slugs without a live island are explicitly `gap` with a recorded reason (not left ambiguous). No "implement later"/"add appropriate error handling". The `verify.ts` browser helpers (`readComputedTokens`/`captureBehavior`/`screenshotPart`) are named and assigned to Task 4 Step 3 as the next implementation step — concrete, not deferred. ✅ (One watch-item: the generated spec in Task 5 uses `ENTRY.shadcn.ref` for the ref URL and `ENTRY.solidiom.sitePath` for the sol URL — both are real mapping fields; consistent.)

**3. Type consistency.** `MappingEntry` (Task 3 Step 2) is the single entry type used by the generator (Task 5), verify (Task 4), and report (Task 4). `VerdictReport`/`SignalResult` (Task 4 Step 1) are produced by `verifyEntry` and consumed by `writeReport`/`renderFindings`. `interaction-scripts.ts` exports `Action`, `scripts`, `runInteractions(page, name)` — the generated spec and verify engine both call `runInteractions` with a script name from `entry.interactions`. Names match across tasks. ✅ (Fix applied: removed the contradictory placeholder `ParityMapping` interface in Task 3 Step 2 so `MappingEntry` is unambiguously the export; the test import was corrected in the same step.)

---

_End of plan._
