---
id: adding-an-integration
title: "Adding an Adapter or Integration Package"
sidebar_label: Add Adapter/Integration
description: Step-by-step guide to add a new adapter or framework integration package to the Solidiom workspace.
doc_type: how-to
audience: "Solidiom contributors"
tags: [adapters, integrations, contributing, guide]
lifecycle: current
---

> **Purpose:** For Solidiom contributors, shows how to add a new adapter or integration package — a package that bridges Solidiom primitives with an external library or framework (e.g. Astro, TanStack, Floating UI).

## Terminology

| Term            | Tag                 | Purpose                                                          | Examples                                                    |
| --------------- | ------------------- | ---------------------------------------------------------------- | ----------------------------------------------------------- |
| **Adapter**     | `layer:adapter`     | Bridges a Solidiom primitive with an external library dependency | `adapter-positioning-floating-ui`, `adapter-table-tanstack` |
| **Integration** | `layer:integration` | Framework-level plugin that enables Solidiom in a host framework | `astrojs-solid-next`                                        |
| **Tooling**     | `layer:tooling`     | Internal build/dev tools not published as adapters               | `adapter-kit`, `vite-plugin-solidiom`                       |

The key difference from primitives: adapters and integrations do **not** appear in the umbrella package (`@solidiom/primitives`), are **not** included in registry manifests (unless they have `layer:adapter` tag), and do **not** need recipes or accessibility evidence.

## Prerequisites

- Node >= 24, pnpm >= 10 installed (`mise install`)
- Workspace dependencies installed (`pnpm install`)
- Familiarity with the external library you're bridging

## Step 1 — Create the package directory

```
packages/<name>/
  package.json
  tsconfig.json
  tsup.config.ts
  src/
    index.ts (or index.tsx if JSX is needed)
```

## Step 2 — `package.json`

```json
{
  "name": "@solidiom/<name>",
  "version": "0.2.0",
  "type": "module",
  "description": "<One-line description of what this adapter/integration does.>",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": ["dist"],
  "sideEffects": false,
  "scripts": {
    "build": "tsup && tsc --emitDeclarationOnly --outDir dist",
    "test": "vitest run --passWithNoTests",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "<external-library>": "^x.y.z"
  },
  "peerDependencies": {
    "solid-js": ">=2.0.0-beta.32 <3.0.0"
  },
  "devDependencies": {
    "solid-js": "^2.0.0-rc.0",
    "typescript": "~6.0.3"
  },
  "engines": {
    "node": ">=24.0.0"
  },
  "nx": {
    "tags": ["layer:adapter"]
  }
}
```

### Choosing the `nx.tags` value

| Use case                                             | Tag                 |
| ---------------------------------------------------- | ------------------- |
| Wraps an external library for use in primitives      | `layer:adapter`     |
| Framework plugin (Astro, Vite, Webpack integrations) | `layer:integration` |
| Internal-only build tool (not published externally)  | `layer:tooling`     |

**`layer:adapter`** packages are automatically discovered by the registry builder and included in `registry/index.json` under the `adapters` array. Other tags are not included in the registry.

### Peer dependencies vs dependencies

- **External libraries** that the consumer also installs: use `peerDependencies` with a broad range (e.g. `"astro": "^5.0.0 || ^6.0.0 || ^7.0.0"`)
- **External libraries** that are implementation details: use `dependencies` with a pinned range
- **`solid-js`**: always `peerDependencies` with `">=2.0.0-beta.32 <3.0.0"` (unless it's not Solid-specific)
- **Internal workspace packages** (e.g. `@solidiom/runtime`): use `"workspace:*"` in `dependencies`

### Multiple entry points

If your package has multiple entry points (e.g. client/server split for SSR integrations):

```json
{
  "exports": {
    ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js" },
    "./client.js": { "types": "./dist/client.d.ts", "import": "./dist/client.js" },
    "./server.js": { "types": "./dist/server.d.ts", "import": "./dist/server.js" }
  }
}
```

Update `tsup.config.ts` entry array to match.

## Step 3 — `tsconfig.json`

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

Add `"jsx": "preserve"` and `"jsxImportSource": "@solidjs/web"` only if the package contains JSX.

## Step 4 — `tsup.config.ts`

```ts
import { createTsupConfig } from "../../tools/build/tsup.config.base"

export default createTsupConfig({
  entry: ["src/index.ts"],
  external: ["solid-js", "@solidjs/web", "<peer-dependency>"],
})
```

For multiple entry points:

```ts
export default createTsupConfig({
  entry: ["src/index.ts", "src/client.ts", "src/server.ts"],
  external: ["solid-js", "@solidjs/web", "astro", "vite"],
})
```

Always externalize peer dependencies — they should never be bundled.

## Step 5 — Install and verify

```bash
pnpm install
pnpm --filter @solidiom/<name> typecheck
pnpm --filter @solidiom/<name> build
```

All three must succeed.

## Step 6 — Write tests

Create tests in `src/`:

```ts
// src/index.test.ts
import { describe, it, expect } from "vitest"
import { myFunction } from "./index"

describe("@solidiom/<name>", () => {
  it("exports the expected API", () => {
    expect(typeof myFunction).toBe("function")
  })
  // ... functional tests
})
```

```bash
pnpm --filter @solidiom/<name> test
```

## Step 7 — Capability declaration (adapters only)

Adapter packages should declare their capability interface in `src/capability.ts`:

```ts
/**
 * Capability interface for the <name> adapter.
 *
 * Primitives import this type to define what the adapter must provide,
 * without depending on the adapter's implementation.
 */
export interface <Name>Capability {
  // Define the contract the adapter fulfills
}
```

This allows primitives to depend on the adapter interface (via `@solidiom/adapter-kit`) without coupling to the specific implementation.

## Step 8 — Registry inclusion (adapters only)

If your package has `layer:adapter` in `nx.tags`, the registry builder automatically discovers it and includes it in `registry/index.json`. Run:

```bash
pnpm registry:build
```

Verify your adapter appears in the `adapters` array of `registry/index.json`.

Packages with `layer:integration` or `layer:tooling` are **not** included in the registry — this is intentional.

## Step 9 — CI verification

All packages in `packages/*` are automatically included in workspace-wide targets:

- `pnpm nx run-many -t build` — builds your package
- `pnpm nx run-many -t test` — runs your tests
- `pnpm nx run-many -t typecheck` — type-checks your package

No CI configuration changes are needed. The nx project graph discovers your package from `pnpm-workspace.yaml` (which uses `packages/*`).

### Excluding from primitive-specific targets

Primitive-specific nx commands use tag filters like `--projects='tag:layer:primitive'`. Your `layer:adapter` or `layer:integration` tag ensures your package is excluded from these targets:

- `pnpm nx run-many -t test --projects='tag:layer:primitive'` — won't include adapters
- `pnpm typecheck` (root script excludes `tag:layer:template`) — adapters are included

If you need your package excluded from a specific target, ensure the correct tag is set and the target's filter handles it.

## Step 10 — Changeset and versioning

Adapters and integrations follow the same versioning workflow as all other packages:

```bash
pnpm changeset
```

Select your package and describe the change. Changesets are consumed during release to bump versions and generate changelogs.

## What you do NOT need to do

These steps from the "Adding a Primitive" guide do **not** apply:

| Step                                           | Why not                                                 |
| ---------------------------------------------- | ------------------------------------------------------- |
| Add to `packages/primitives/src/index.ts`      | Only primitives go in the umbrella package              |
| Classify in `primitive-completion-policy.json` | Only primitives need classification                     |
| Create recipes (Tailwind/CSS/UnoCSS)           | Adapters don't have styling                             |
| Run `pnpm primitive:gate`                      | Gate is for primitives only                             |
| Add axe accessibility scans                    | Adapters are not rendered UI                            |
| Add to `PUBLIC_PRIMITIVES` in `axe-results.ts` | Only primitives with a11y evidence                      |
| Create demos in `apps/site/`                   | Adapters documented via API docs, not interactive demos |

## Checklist

```
- [ ] `packages/<name>/` created with package.json, tsconfig, tsup.config, src/
- [ ] `nx.tags` set to `["layer:adapter"]` or `["layer:integration"]`
- [ ] Peer dependencies declared with broad version ranges
- [ ] External libs properly externalized in tsup.config.ts
- [ ] `pnpm install` succeeds
- [ ] `pnpm --filter @solidiom/<name> typecheck` passes
- [ ] `pnpm --filter @solidiom/<name> build` passes
- [ ] Tests written and passing
- [ ] `pnpm registry:build` succeeds (adapter shows in registry if `layer:adapter`)
- [ ] Changeset created for the new package
```

## Reference implementations

| Type        | Package                                    | Notes                              |
| ----------- | ------------------------------------------ | ---------------------------------- |
| Adapter     | `packages/adapter-positioning-floating-ui` | Minimal adapter with capability.ts |
| Adapter     | `packages/adapter-table-tanstack`          | Wraps TanStack Table               |
| Integration | `packages/astrojs-solid-next`              | Astro framework integration        |
| Integration | `packages/vite-plugin-solidiom`            | Vite plugin with multiple entries  |
