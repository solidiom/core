---
id: adding-a-primitive
title: "Adding a New Primitive"
sidebar_label: Add Primitive
description: Step-by-step guide to scaffold, implement, style, test, and register an Solidiom primitive.
doc_type: how-to
audience: "Solidiom contributors"
tags: [primitives, contributing, guide]
lifecycle: current
---

> **Purpose:** For Solidiom contributors, shows how to add a new headless primitive from scratch — following the exact conventions every existing primitive uses and verified by the automated completion gate.

## Prerequisites

- Node ≥ 20, pnpm ≥ 10 installed (`mise install` handles this)
- Workspace dependencies installed (`pnpm install`)
- Familiarity with Solid 2 beta patterns (see `docs/architecture/solid2-migration-notes.md`)

## Overview

A primitive in Solidiom has these parts:

```
packages/<name>/              ← headless component (no styles)
packages/recipes-tailwind/    ← Tailwind recipe (if recipe-classified)
packages/recipes-css/         ← Plain CSS recipe (if recipe-classified)
packages/recipes-unocss/      ← UnoCSS supportedPrimitives entry (if recipe-classified)
packages/primitives/          ← umbrella re-export
apps/docs/                    ← demo + docs dependency
registry/<name>.json          ← auto-generated manifest
tools/primitive-completion-policy.json ← recipe vs headless-only classification
```

The primitive owns **semantics and accessibility**. Recipes own **appearance**. Not all primitives require recipes — structural primitives (e.g. `separator`, `visually-hidden`, `field`) are classified as `headlessOnly` in the policy.

## Solid 2 Philosophy — Do's and Don'ts

Solidiom targets Solid 2 beta exclusively. These rules are **enforced by the primitive completion gate** (`pnpm primitive:gate`). Violations fail CI.

### Do

| Pattern                                      | Example                                               |
| -------------------------------------------- | ----------------------------------------------------- |
| Import JSX types from `@solidjs/web`         | `import { type JSX } from "@solidjs/web"`             |
| Use `onSettled` for post-mount DOM work      | `onSettled(() => { observer.observe(ref!) })`         |
| Use async computations for data              | `const data = createMemo(() => fetchItems(query()))`  |
| Use `merge` for default props                | `const props = merge({ size: "md" }, rawProps)`       |
| Use `omit` to forward remaining props        | `const rest = omit(props, "label", "error")`          |
| Render Context directly as the provider      | `<MyContext value={ctx}>{props.children}</MyContext>` |
| Use `"true"` / `undefined` for ARIA booleans | `aria-expanded={open() ? "true" : undefined}`         |
| Use `loading` for loading states             | `loading?: boolean`                                   |
| Compose styles externally via recipes        | User applies recipe + `applySemanticAttrs` getter     |
| Access props via `props.x` (keep reactivity) | `<div class={props.class}>`                           |

### Don't

| Anti-pattern                             | Why                                                       | Replacement                              |
| ---------------------------------------- | --------------------------------------------------------- | ---------------------------------------- |
| `import { type JSX } from "solid-js"`    | Wrong module in Solid 2; DOM types live in `@solidjs/web` | `@solidjs/web`                           |
| `onMount(() => { ... })`                 | Removed in Solid 2                                        | `onSettled`                              |
| `createResource(fetcher)`                | Removed in Solid 2                                        | Async computations + `Loading`           |
| `mergeProps(defaults, props)`            | Renamed in Solid 2                                        | `merge(defaults, props)`                 |
| `splitProps(props, [...])`               | Renamed in Solid 2                                        | `omit(props, ...)`                       |
| `<MyContext.Provider value={v}>`         | Context IS the provider in Solid 2                        | `<MyContext value={v}>`                  |
| `asChild?: boolean` prop                 | Breaks static analysis, adds TS overhead                  | Composition via recipes + semantic attrs |
| `isLoading?: boolean` prop               | Non-standard; Solidiom uses `loading`                     | `loading?: boolean`                      |
| Destructuring props                      | Breaks fine-grained reactivity tracking                   | `props.x` access                         |
| `true`/`false` for aria attributes       | Solid 2 strict JSX typing                                 | `"true"` / `undefined`                   |
| `<Index>` component                      | Removed in Solid 2                                        | `<For keyed={false}>`                    |
| Mutating stores directly outside setters | Breaks reactive tracking                                  | Use store setters with draft functions   |

## Step 1 — Scaffold the package

Create `packages/<name>/` with four files:

### `package.json`

```json
{
  "name": "@solidiom/<name>",
  "version": "0.0.1-next.0",
  "private": false,
  "license": "MIT",
  "type": "module",
  "exports": {
    ".": {
      "solid": "./source/index.tsx",
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": ["dist", "source", "src", "!src/**/*.test.*"],
  "scripts": {
    "build": "tsup && tsc --emitDeclarationOnly --outDir dist",
    "test": "vitest run --passWithNoTests",
    "typecheck": "tsc --noEmit"
  },
  "peerDependencies": {
    "@solidjs/web": ">=2.0.0-beta",
    "solid-js": "catalog:"
  },
  "dependencies": {
    "@solidiom/runtime": "workspace:*"
  },
  "nx": {
    "tags": ["layer:primitive"],
    "metadata": {
      "label": "<Display Name>",
      "description": "<One-line description ending with a period.>",
      "category": "<overlay|input|layout|feedback|navigation|a11y>"
    }
  }
}
```

The `nx.metadata` block is **required** — it drives registry generation, docs sidebar routing, and the completion gate. Valid categories: `overlay`, `input`, `layout`, `feedback`, `navigation`, `a11y`.

### `tsconfig.json`

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "jsx": "preserve",
    "jsxImportSource": "@solidjs/web",
    "paths": {}
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", "source"]
}
```

### `tsup.config.ts`

```ts
import { createTsupConfig } from "../../tools/build/tsup.config.base"
export default createTsupConfig({ entry: ["src/index.tsx"] })
```

### `src/index.tsx`

```tsx
/**
 * @solidiom/<name> — <one-line description>.
 *
 * Parts: Root.
 */

import { type JSX } from "@solidjs/web"
import { applySemanticAttrs } from "@solidiom/runtime"

export interface <Name>RootProps {
  children?: JSX.Element
  class?: string
}

export function Root(props: <Name>RootProps) {
  return (
    <span
      class={props.class}
      {...applySemanticAttrs({ scope: "<name>", part: "root" })}
    >
      {props.children}
    </span>
  )
}
```

**Structural rules:**

- JSDoc block at line 1, listing all exported Parts.
- `type JSX` from `@solidjs/web` (never `solid-js`).
- Every part accepts `class?: string` at minimum.
- Every part calls `applySemanticAttrs` with the primitive scope and part name.
- ARIA booleans use the string form: `aria-disabled={cond ? "true" : undefined}`.
- Array indexed access uses `!` only when guarded by a length check.
- Props are accessed via `props.x` — never destructured.

## Step 2 — Classify in the completion policy

Edit `tools/primitive-completion-policy.json`:

```json
{
  "recipe": ["...", "<name>"],
  "headlessOnly": ["..."]
}
```

Choose `recipe` if the primitive benefits from styled wrappers (buttons, dialogs, menus). Choose `headlessOnly` if it's purely structural or utility (separator, visually-hidden, field).

## Step 3 — Install dependencies

```bash
pnpm install
```

The workspace glob `packages/*` picks up your new package automatically.

## Step 4 — Verify the primitive builds

```bash
pnpm --filter @solidiom/<name> typecheck
pnpm --filter @solidiom/<name> build
```

Both must exit 0. `source/` is regenerated by the build — never edit it directly.

## Step 5 — Write tests

Create `packages/<name>/src/<name>.browser.test.tsx` (browser) or `<name>.test.ts` (unit):

```tsx
import { describe, it, expect } from "vitest"
import { render } from "@solidjs/testing-library"
import { Root } from "./index"

describe("<Name>", () => {
  it("renders with semantic attributes", () => {
    const { container } = render(() => <Root>Content</Root>)
    const el = container.firstElementChild!
    expect(el.getAttribute("data-scope")).toBe("<name>")
    expect(el.getAttribute("data-part")).toBe("root")
  })

  it("accepts and applies class prop", () => {
    const { container } = render(() => <Root class="custom">Content</Root>)
    expect(container.firstElementChild!.classList.contains("custom")).toBe(true)
  })

  it("renders children", () => {
    const { getByText } = render(() => <Root>Hello</Root>)
    expect(getByText("Hello")).toBeTruthy()
  })
})
```

Minimum three tests: renders correctly, primary interaction, edge case/accessibility.

```bash
pnpm --filter @solidiom/<name> test
```

## Step 6 — Add recipes (recipe-classified primitives only)

Skip this step if your primitive is `headlessOnly` in the policy.

### Tailwind recipe

**`packages/recipes-tailwind/src/styles/<name>.css`**

```css
@layer components {
  [data-scope="<name>"][data-part="root"] {
    @apply /* base styles */;
  }
}
```

**`packages/recipes-tailwind/src/recipes/<name>.tsx`**

```tsx
import { type JSX } from "@solidjs/web"
import * as <Name> from "@solidiom/<name>"
import { cva, type VariantProps } from "class-variance-authority"

export const <name>Variants = cva("s2-<name>", {
  variants: { variant: { default: "s2-<name>--default", secondary: "s2-<name>--secondary" } },
  defaultVariants: { variant: "default" },
})

export type <Name>Variant = VariantProps<typeof <name>Variants>

export function Styled<Name>(props: <Name>Variant & { children?: JSX.Element }) {
  return <<Name>.Root class={<name>Variants({ variant: props.variant })}>{props.children}</<Name>.Root>
}
```

### Plain CSS recipe

**`packages/recipes-css/src/styles/<name>.css`** — same selectors, plain CSS.

**`packages/recipes-css/src/recipes/<name>.tsx`** — same structure as Tailwind.

### Wire into recipe packages

For each recipe package (`recipes-tailwind`, `recipes-css`):

| File                   | Change                                                                                                                         |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `src/index.ts`         | Add `export { Styled<Name>, <name>Variants } from "./recipes/<name>"`                                                          |
| `src/meta.ts`          | Add `"<name>"` to `supportedPrimitives` array                                                                                  |
| `src/styles/index.css` | Add `@import "./<name>.css";`                                                                                                  |
| `package.json`         | Add `"@solidiom/<name>": "workspace:*"` to `dependencies` and `"./styles/<name>.css": "./dist/styles/<name>.css"` to `exports` |
| `tsup.config.ts`       | Add `"@solidiom/<name>"` to `external` array                                                                                   |

For `recipes-unocss`: add `"<name>"` to the `supportedPrimitives` array in `src/index.ts`.

## Step 7 — Register in the umbrella package

**`packages/primitives/src/index.ts`** — add:

```ts
export * as <Name> from "@solidiom/<name>"
```

**`packages/primitives/package.json`** — add `"@solidiom/<name>": "workspace:*"` to `dependencies`.

## Step 8 — Add a demo to the docs app

### `apps/docs/src/demos/<name>-demo.tsx`

```tsx
import * as <Name> from "@solidiom/<name>"

export function <Name>Demo() {
  return (
    <div class="flex flex-wrap items-center gap-3">
      <<Name>.Root class="...">Default</<Name>.Root>
    </div>
  )
}

export const <name>DemoCode = `import * as <Name> from "@solidiom/<name>"

function <Name>Example() {
  return <<Name>.Root>Content</<Name>.Root>
}
`
```

### Wire into docs

| File                           | Change                                                        |
| ------------------------------ | ------------------------------------------------------------- |
| `apps/docs/src/demos/index.ts` | Import `<Name>Demo` + `<name>DemoCode`, add to `demos` record |
| `apps/docs/package.json`       | Add `"@solidiom/<name>": "workspace:*"` to `dependencies`     |

Note: `apps/docs/src/lib/primitives.ts` reads from `registry/index.json` automatically — no manual edit needed there.

## Step 9 — Generate registry manifest

```bash
pnpm registry:build
```

Confirm `registry/<name>.json` appears with package name, version, capabilities, dependencies, and source files. The registry builder only includes packages with `layer:primitive` tag, `private: false`, and complete `nx.metadata`.

## Step 10 — Run the completion gate

```bash
pnpm primitive:gate -- <name>
```

This checks every contract in one command:

- Package structure (exports, scripts, files, nx tags, metadata)
- Source conventions (JSDoc header, `@solidjs/web` imports, semantic attrs, class prop)
- Solid 2 compliance (no forbidden patterns)
- Test presence and assertions
- Registry manifest consistency
- Umbrella package wiring
- Docs demo and dependency
- Recipe classification and wiring (if recipe-classified)
- Builds, typechecks, and tests pass

Fix all failures before opening a PR. For a quick structural audit without running builds/tests:

```bash
pnpm primitive:audit -- <name>
```

## Step 11 — Full verification

```bash
pnpm --filter @solidiom/<name> typecheck   # types
pnpm --filter @solidiom/<name> build       # dist + source/
pnpm --filter @solidiom/<name> test        # tests
pnpm registry:build                    # registry manifest
pnpm primitive:gate -- <name>          # completion gate (full)
```

## PR checklist

Copy this into your PR description:

```
- [ ] `packages/<name>/` created with package.json, tsconfig, tsup.config, src/index.tsx
- [ ] `nx.metadata` has label, description, and valid category
- [ ] JSDoc header at line 1 of src/index.tsx listing all Parts
- [ ] `type JSX` imported from `@solidjs/web`
- [ ] Every part calls `applySemanticAttrs` and accepts `class`
- [ ] ARIA booleans use `? "true" : undefined` form
- [ ] No Solid 1 patterns (onMount, createResource, mergeProps, splitProps, .Provider)
- [ ] No `asChild` or `isLoading` props
- [ ] Props accessed via `props.x` — never destructured
- [ ] At least 3 tests with real assertions
- [ ] Classified in `tools/primitive-completion-policy.json`
- [ ] Tailwind + CSS recipes wired (if recipe-classified)
- [ ] UnoCSS added to supportedPrimitives (if recipe-classified)
- [ ] Umbrella: `@solidiom/primitives` re-exports and depends on the new primitive
- [ ] Docs: demo file, demos/index.ts entry, apps/docs/package.json dependency
- [ ] `pnpm registry:build` generates `registry/<name>.json`
- [ ] `pnpm primitive:gate -- <name>` passes
```

## Common pitfalls

| Mistake                                          | Fix                                                                         |
| ------------------------------------------------ | --------------------------------------------------------------------------- |
| `import { type JSX } from "solid-js"`            | Use `"@solidjs/web"` — see `docs/architecture/solid2-migration-notes.md`    |
| `aria-disabled={cond \|\| undefined}`            | Use `cond ? "true" : undefined` — Solid 2 strict typing                     |
| Editing `source/` directly                       | Never — it's regenerated by `pnpm build`                                    |
| Forgetting `tsup.config.ts` externals in recipes | Recipe builds will bundle your primitive instead of treating it as external |
| Missing `nx.metadata` in package.json            | Registry builder will skip your primitive entirely                          |
| Missing recipe policy classification             | Completion gate will fail with "must be classified"                         |
| Destructuring props in component body            | Breaks reactivity — always use `props.x`                                    |
| Using `onMount`                                  | Removed in Solid 2 — use `onSettled`                                        |
| Using `<Index>` for non-keyed lists              | Removed in Solid 2 — use `<For keyed={false}>`                              |

## Reference implementation

`packages/badge/` is the canonical minimal primitive. Use it as your starting template:

```bash
cp -r packages/badge packages/<name>
# Then find-and-replace "badge" → "<name>" and "Badge" → "<Name>"
# Update nx.metadata (label, description, category)
# Run: pnpm primitive:gate -- <name>
```
