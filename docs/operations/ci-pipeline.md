# CI Pipeline

> Architecture and local reproduction guide for the split-target CI/release strategy.

## Overview

Automatic per-PR and per-push validation runs through **`ci-required.yml` (`CI (Required)`)** — the single required status check on `main`. It path-scopes work into package and site lanes and enforces an aggregate `CI / required` gate. The older split **`ci-packages.yml`** / **`ci-site.yml`** workflows still exist but are currently **`workflow_dispatch` (manual) only** — their `push`/`pull_request` triggers are commented out. They are retained for on-demand deep runs (full matrix, catalog gates, E2E/visual/Lighthouse) and are described below; re-enabling their triggers is a deliberate future step, not the current default.

### `ci-required.yml` — the active automatic gate

- **Trigger:** every `pull_request` and every `push` to `main`. Runs on `ubuntu-latest`, Node 24.0.0, pnpm 10.34.5.
- **`changes`:** classifies changed paths into `packages` and `site` lanes (via `git diff`), so irrelevant lanes are skipped.
- **`package-quality`** (when the packages lane applies): `format:check`, production dependency audit (`pnpm audit --prod --audit-level high --ignore-registry-errors`), nx-affected `lint` / `typecheck` / `test` / `build` (excluding `@solidiom/site`), and generated-artifact emit checks (`source:emit:check`, recipe and theme `*:emit:*:check`).
- **`site-quality`** (when the site lane applies): builds workspace packages (`nx run-many -t build --exclude=@solidiom/site`), then site `lint`, `check`, `boundaries`, `i18n:validate`, and `build`.
- **`workflow-policy`:** `node tools/ci/validate-workflows.mjs` (immutable-Actions and runner policy).
- **`secret-scan`:** TruffleHog 3.97.4 over the introduced commit range (`--results=verified,unknown`).
- **`required` (`CI / required`):** aggregate gate — fails if any applicable lane, the workflow policy, or the secret scan failed.

### Manual deep-run workflows (`ci-packages.yml` / `ci-site.yml`)

These split package and site validation into two independent manual workflows, each with a fast and a full tier. They run on the `self-hosted-dfw-flex` runner and are dispatched by hand:

- **`ci-packages.yml` (fast tier, `full_matrix=false`):** format, typecheck, package build, Node tests on Node 24, Chromium browser tests, and the quick gate.
- **`ci-packages.yml` (full tier, `full_matrix=true`):** the fast checks plus the Node 24/26 matrix, accessibility evidence, offline CLI smoke tests, catalog gates, and the full gate.
- **`ci-site.yml` (fast tier, `full_matrix=false`):** site check and site build only.
- **`ci-site.yml` (full tier, `full_matrix=true`):** the site check/build plus E2E, visual, Lighthouse, and the vertical-slice gate.
- **`nightly.yml`:** Solid version matrix, Chromium/Firefox/WebKit component tests, dependency freshness, and optional visual-baseline regeneration.

> **Triggers:** `ci-packages.yml` and `ci-site.yml` are currently `workflow_dispatch` (manual) only. Their `push`/`pull_request` triggers and `paths` filters are present but commented out in each workflow; re-enable them to activate automatic per-PR and per-push runs. These two workflows' jobs run on the `self-hosted-dfw-flex` runner; `ci-required.yml` runs on `ubuntu-latest`.

## Workflows

| File              | Trigger                                     | Purpose                                                                                                                        |
| ----------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `ci-required.yml` | Every push to `main` and every pull request | **Required** automatic gate: path-scoped package + site quality lanes, workflow policy, secret scan, aggregate `CI / required` |
| `ci-packages.yml` | Manual dispatch (push/PR triggers dormant)  | Package build, tests, accessibility, CLI smoke, catalog + quality gates                                                        |
| `ci-site.yml`     | Manual dispatch (push/PR triggers dormant)  | Site check, build, E2E, visual, Lighthouse, vertical-slice gate                                                                |
| `release.yml`     | Pushed `v*` tag (packages); manual dispatch | Unified production package release, site deployment, or both                                                                   |
| `nightly.yml`     | Daily 04:00 UTC; manual dispatch            | Full compatibility and environment-sensitive coverage                                                                          |

`ci-required.yml` runs no tier inputs — it always runs the applicable lanes and gates on `CI / required`. `ci-packages.yml` accepts `affected_only` (run only nx-affected packages) and `full_matrix` (run the comprehensive tier) inputs. `ci-site.yml` accepts `full_matrix`. `release.yml` receives `target` (`packages`, `site`, `all`), `gate` (`quick`, `full`), and `dist_tag` (`beta`, `latest`) inputs. A `v*` tag push publishes packages only (the plan sets `deploy_site=false`); site deployment happens through a `workflow_dispatch` run with `target` set to `site` or `all`.

## CI job graph

### `ci-packages.yml`

Fast tier (`full_matrix=false`) runs the unshaded jobs; full tier (`full_matrix=true`) adds the jobs marked _(full only)_.

```text
install
├── format
├── typecheck
└── build
    ├── test-node (Node 24; matrix [24, 26] on full)
    ├── test-browser (Chromium) + recipe parity
    ├── a11y-axe-scan                          (full only)
    ├── cli-smoke-create-prep → cli-smoke-create (npm, pnpm, yarn, bun)  (full only)
    └── catalog-gates (component + block)      (full only)

gate ← typecheck + build + test-node + test-browser
       (+ a11y-axe-scan + catalog-gates on full)
```

The `gate` job runs `gate:quick` on the fast tier and `gate:full` on the full tier.

### `ci-site.yml`

Rebuilds the workspace packages itself (the site resolves built primitives), so it is independent of `ci-packages.yml`.

```text
site-check
└── site-build
    ├── site-e2e (Chromium/Firefox/WebKit)  (full only)
    ├── site-visual (pinned Playwright container)  (full only)
    └── site-lighthouse (advisory)          (full only)

vertical-slice-gate ← site-check            (full only)
preview-deploy ← (dormant; pull_request-gated, never runs under manual dispatch)

gate ← site-check + site-build
       (+ site-e2e + site-visual + vertical-slice-gate on full)
```

The site workflow self-gates on its own job results; the aggregate `gate:quick`/`gate:full` scripts remain owned by `ci-packages.yml`.

The `gate:quick` command runs the structural gate (fast, version-agnostic foundation invariants). `gate:full` runs the full durable release gate, which runs the structural gate once and then the complete quality suite (primitives, recipes, ESLint, a11y, enterprise governance, catalog gates, and the §23 acceptance criteria).

## Design decisions

### Build artifacts

The package build uploads `packages/*/dist` and non-site `apps/*/dist` once. Downstream tests download those artifacts instead of rebuilding where practical.

### Shared setup

`.github/actions/setup/action.yml` centralizes Node/pnpm setup, module-cache restore, dependency installation, and optional Playwright browser setup:

```yaml
- uses: actions/checkout@v5
- uses: ./.github/actions/setup
  with:
    playwright: chromium
```

### Browser coverage

CI uses Chromium for rapid feedback. `nightly.yml` adds Firefox and WebKit to catch browser-specific regressions without making each PR expensive. The pinned `mcr.microsoft.com/playwright:v1.62.1-noble` container is used for visual snapshots and their regeneration.

### Compatibility coverage

The nightly Solid matrix tests the `low`, `mid`, and `high` configured Solid versions under Node 24 and Node 26. It uses a non-frozen install only after the matrix script updates the workspace overrides.

### Security controls

- Fork PRs never receive deployment secrets; the `preview-deploy` job in `ci-site.yml` is limited to PRs from this repository (and is currently dormant under manual-dispatch triggering).
- Release signing uses `REGISTRY_SIGN_KEY` only inside `release.yml`.
- npm publishing occurs only in CI for Changeset releases.
- Releases commit only targeted version, changelog, lockfile, Changeset, and registry paths.
- Every install is frozen except compatibility-matrix installs that intentionally override Solid versions.

## Manual operations

```bash
# Manual package CI; defaults to the full tier (full_matrix=true)
gh workflow run ci-packages.yml

# Package CI, fast tier only
gh workflow run ci-packages.yml -f full_matrix=false

# Package CI against only affected packages
gh workflow run ci-packages.yml -f affected_only=true

# Manual site CI; defaults to the full site suite
gh workflow run ci-site.yml

# Site CI, fast tier (check + build only)
gh workflow run ci-site.yml -f full_matrix=false

# Package release after creating Changesets
pnpm release -- --target packages

# Site-only deployment
pnpm release -- --target site

# Full release with comprehensive release validation
pnpm release -- --target all --gate full

# Regenerate visual baselines in the CI container
gh workflow run nightly.yml -f regenerate_baselines=true -f baseline_reason="intentional visual update"
```

## Local equivalents

```bash
pnpm run format:check
pnpm typecheck
pnpm nx run-many -t build --exclude=@solidiom/site
pnpm test
pnpm run test:tools
pnpm run test:browser
pnpm run gate:quick
pnpm run gate:full
```

For visual snapshots, prefer `pnpm run visual:container` or `pnpm run visual:update:container`; macOS rendering is not comparable to the Linux CI baseline.

## Caching

| Cache                     | Purpose                                                     |
| ------------------------- | ----------------------------------------------------------- |
| pnpm store                | Reuses downloaded package archives                          |
| module cache              | Restores workspace `node_modules` keyed by `pnpm-lock.yaml` |
| Playwright browser cache  | Reuses requested browser binaries by lockfile hash          |
| offline registry snapshot | Reuses the prepared CLI smoke-test registry                 |
| build/site artifacts      | Shares output among jobs within a workflow run              |

## Troubleshooting

### Stale generated artifacts

The package build rejects stale registry, source-emission, or accessibility artifacts. Regenerate and commit them:

```bash
pnpm build
pnpm run report:a11y-evidence
pnpm run registry:build
git add registry/ packages/*/source/ packages/*/docs/accessibility/evidence.json
```

### CLI smoke tests fail on a cache miss

The `cli-smoke-create` matrix needs its `cli-smoke-create-prep` job to warm the offline snapshot first. CI enforces this dependency; locally, run `pnpm run smoke:create:prep` before the smoke test.

### Visual differences on macOS

Screenshot baselines are Linux-specific. Do not update them with a host Playwright invocation; use the container script or the explicit nightly baseline-dispatch input.
