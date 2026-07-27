# Solidiom

Solid 2-native UI primitive system. Behavior-first, runtime-first, zero mandatory styling dependencies.

```
primitives own behavior · adapters provide algorithms · recipes provide styling
```

## Philosophy

Solidiom is built strictly for the **Solid 2.0 compiler**, diverging from React/Radix patterns to embrace:

- **Zero runtime overhead:** No Virtual DOM diffing, no `cloneElement`, no `forceMount` workarounds.
- **Pure static HTML elements:** We reject `<Dynamic>` and `asChild` polymorphism. Primitives render predictable, statically analyzable DOM nodes.
- **Strict typings:** No bloated generic overhead for arbitrary component wrapping.
- **CSS composition over polymorphism:** Instead of passing elements into primitives, consumers compose primitives by applying semantic attribute getters (`applySemanticAttrs`) and CSS recipes directly to their own native tags (like `<a>` or Next/Solid Router links).

## Quick start

```sh
# Install dependencies
pnpm install

# Start the docs dev server
mise run dev          # or: pnpm --filter @solidiom/docs dev

# Build everything
mise run build        # or: pnpm nx run-many -t build

# Run tests
mise run test         # or: pnpm nx run-many -t test
```

Requires Node >= 20 and pnpm 10. If you use [mise](https://mise.jdx.dev), tool versions are pinned in `.mise.toml`.

## Workspace layout

```
apps/
  docs/             Vite + Solid 2 documentation SPA (see apps/docs/README.md)

packages/
  runtime/          Shared runtime utilities (semantic attrs, overlay stack, ports)
  primitives/       Umbrella re-export of all primitives

  # Primitives (behavior-only, unstyled)
  accordion/        button/          calendar/        carousel/
  checkbox/         collapsible/     combobox/        command-palette/
  data-table/       date-picker/     dialog/          drawer/
  listbox/          menu/            popover/         resizable-panels/
  select/           slider/          switch/          tabs/
  toast/            tooltip/         tree/            virtual-list/

  # Adapters (framework-neutral algorithm engines)
  adapter-carousel-embla/
  adapter-date-internationalized/
  adapter-positioning-floating-ui/
  adapter-positioning-minimal/
  adapter-table-tanstack/
  adapter-virtualization-tanstack/

  # Recipes (pre-styled wrappers + raw stylesheets, dual-emission)
  recipes-css/          Plain CSS targeting data-* semantic attributes
  recipes-tailwind/     Tailwind @apply + utility classes
  recipes-unocss/       UnoCSS preset

  # Tooling
  cli/                  solidiom CLI (install, inspect, migrate)
  eslint-plugin-solidiom/   ESLint rules
  vite-plugin-solidiom/     Vite integration
  unocss-preset/        UnoCSS atomic preset

  # Internal / dev
  bench/              Performance benchmarks
  probe-primitive/    Probe harness for primitive testing
  probe-runtime/      Probe harness for runtime testing
  release-tools/      Changeset + publish helpers
  test-doubles/       Shared test utilities

registry/           Generated discovery manifests (via tools/registry-build.ts)
tools/              Build scripts, gate checks, acceptance criteria
tests/              Workspace-level E2E and integration tests
docs/               Architecture and design documentation
```

## Documentation app

The interactive docs live in `apps/docs/`. See [`apps/docs/README.md`](apps/docs/README.md) for architecture decisions, development workflow, and route structure.

## Common tasks (mise)

All tasks are defined in `.mise.toml`. Run `mise tasks` to list them.

| Task                                     | Description                               |
| ---------------------------------------- | ----------------------------------------- |
| `mise run build`                         | Build all packages (nx dependency graph)  |
| `mise run build:package -- @solidiom/button` | Build a single package                    |
| `mise run build:recipes`                 | Build CSS + Tailwind recipe packages      |
| `mise run build:docs`                    | Build the docs app                        |
| `mise run build:registry`                | Generate registry manifests               |
| `mise run dev`                           | Start docs dev server                     |
| `mise run test`                          | Run all unit tests                        |
| `mise run test:browser`                  | Browser-mode component tests (Playwright) |
| `mise run test:e2e`                      | End-to-end tests                          |
| `mise run typecheck`                     | Type-check all packages                   |
| `mise run lint`                          | Lint all packages                         |
| `mise run format`                        | Format with Prettier                      |
| `mise run changeset`                     | Create a changeset                        |
| `mise run version`                       | Bump versions from changesets             |
| `mise run release`                       | Build + publish to npm                    |
| `mise run clean`                         | Remove all dist/ directories              |
| `mise run graph`                         | Open nx dependency graph                  |

## Testing GitHub Actions locally

CI (`.github/workflows/ci.yml`, `.github/workflows/release.yml`) can be run locally with [`act`](https://github.com/nektos/act) before pushing, using a clean-checkout build/typecheck rather than relying on cached local state.

### Why this matters

Local `nx` runs reuse the nx cache and an already-hoisted `node_modules`, which can mask real failures — a stale `pnpm-lock.yaml`, a missing `@types/node` dependency, or a workspace link that only exists because it was created by a previous install. These failures only surface on a genuinely clean checkout, which is what hosted CI does on every run. Running `act` locally reproduces that clean-checkout behavior without needing to push a commit and wait on hosted CI to find out.

### Setup

```sh
brew install act
```

`act` needs a container runtime. This workspace uses [Podman](https://podman.io) instead of Docker Desktop:

```sh
brew install podman
podman machine init
podman machine start
```

Point `act` (and any Docker-API-speaking tool) at the Podman socket:

```sh
export DOCKER_HOST="unix://$(podman machine inspect podman-machine-default --format '{{.ConnectionInfo.PodmanSocket.Path}}')"
```

Add this `export` to your shell profile so it persists across sessions.

### Running a workflow or job

```sh
# List all jobs in a workflow without running them
act push -W .github/workflows/ci.yml -l

# Run a single job (fast iteration)
act push -W .github/workflows/ci.yml -j build
act push -W .github/workflows/ci.yml -j typecheck
act push -W .github/workflows/ci.yml -j phase1-gate

# Run the full workflow graph
act push -W .github/workflows/ci.yml
```

Use a fuller runner image than act's default — the default image is a slimmed-down subset that can miss tools the real `ubuntu-latest` runner has:

```sh
act push -W .github/workflows/ci.yml -j build \
  -P ubuntu-latest=catthehacker/ubuntu:act-22.04
```

### Apple Silicon caveat

GitHub-hosted runners are `amd64`. On Apple Silicon, `act` must emulate that architecture via qemu:

```sh
act push -W .github/workflows/ci.yml -j build \
  -P ubuntu-latest=catthehacker/ubuntu:act-22.04 \
  --container-architecture linux/amd64
```

This emulation is not fully reliable for tasks that invoke native binaries. `vite build` (via esbuild/rolldown) has been observed to segfault under qemu emulation (`qemu: uncaught target signal 11`) for `@solidiom/docs`, `@solidiom/docs-astro-poc`, and `@solidiom/probe-primitive` even though each builds successfully both natively (`pnpm --filter <pkg> build`) and on real hosted CI. Pure `tsup`/`tsc` build tasks (no native binary invocation) do not exhibit this issue and are reliable signal under local `act` runs. If a `vite build` task fails only under local `act` with a segfault, treat it as an emulation artifact and confirm with a native `pnpm --filter <pkg> build` before treating it as a real regression.

**Workaround:** for local iteration, omit `--container-architecture linux/amd64` and let `act` run job containers natively as `arm64`:

```sh
act push -W .github/workflows/ci.yml -j build \
  -P ubuntu-latest=catthehacker/ubuntu:act-22.04
```

This avoids the qemu segfaults entirely, at the cost of no longer testing the exact `amd64` architecture the real GitHub runners use. That tradeoff is acceptable for catching logic, config, and dependency-resolution bugs (which is what this pipeline has caught so far) but would miss an `amd64`-specific native-binary bug. Re-add `--container-architecture linux/amd64` only when you specifically need to validate `amd64` behavior.

### Known caveats

- `actions/cache/restore` and `actions/cache/save` have no real backend under `act` and typically no-op; this is not a problem in practice since it forces every local run to be a genuine clean build.
- Secrets referenced by workflows (none currently active — `release.yml`'s publish step is commented out) need to be supplied with `-s KEY=value` or a `.secrets` file.
- Full-workflow runs (`test-solid-matrix`'s 6-way matrix, Playwright browser installs) are slow under emulation; prefer targeting individual jobs with `-j` while iterating.

## Key technologies

| Layer           | Stack                                            |
| --------------- | ------------------------------------------------ |
| Reactivity      | solid-js 2.0.0-beta                              |
| DOM runtime     | @solidjs/web 2.0.0-beta                          |
| Build           | tsup (ESM, preserved JSX) + tsc (declarations)   |
| Orchestration   | nx (caching, task graph, affected)               |
| Test            | vitest (node + browser modes) + Playwright (E2E) |
| Package manager | pnpm 10 (workspaces, catalog, strict peer deps)  |
| Release         | changesets                                       |
| Formatting      | prettier                                         |
| Linting         | eslint (flat config)                             |
| TypeScript      | ~6.0.x (pinned — see note below)                 |

### TypeScript version constraint

TypeScript is pinned to `~6.0.x` because `@typescript-eslint` (used by our ESLint plugin and linting infrastructure) requires `typescript >=4.8.4 <6.1.0`. Upgrading to TypeScript 7+ will break all lint and typecheck workflows until `@typescript-eslint` releases a version with TS 7 peer support. Do not upgrade TypeScript without first verifying `@typescript-eslint` compatibility.

## Dual-emission recipe builds

Recipe packages (`recipes-css`, `recipes-tailwind`) produce two outputs from a single source:

1. **TSX wrapper components** (`dist/index.js`) — pre-composed primitive + styling, importable as Solid components.
2. **Raw stylesheets** (`dist/styles/*.css`) — standalone CSS targeting `data-scope`/`data-part` semantic attributes.

Consumers choose their integration style:

```ts
// Option A: import the pre-styled component
import { StyledDialog } from "@solidiom/recipes-css"

// Option B: use the primitive directly + import the stylesheet
import * as Dialog from "@solidiom/dialog"
import "@solidiom/recipes-css/styles/dialog.css"
```

### Tailwind v4 integration

The `recipes-tailwind` stylesheets use `@apply` with theme-aware utility classes (`bg-primary`, `text-muted-foreground`, etc.). In Tailwind v4, these must be imported **within** the consumer's established Tailwind context — after `@import "tailwindcss"` and the `@theme` block that registers the custom color tokens:

```css
/* app's styles.css */
@import "tailwindcss";
@import "@solidiom/recipes-tailwind/styles";

@theme {
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  /* ... other theme color registrations */
}
```

The recipe CSS files do **not** include `@reference "tailwindcss"` — they rely on the consumer's context to resolve utilities. This is intentional for portability across different theme configurations.

## License

MIT
