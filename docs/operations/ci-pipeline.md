# CI Pipeline

> Architecture and local reproduction guide for the three-workflow CI/release strategy.

## Overview

Solidiom uses tiered validation to keep pull-request feedback fast while retaining broad compatibility and release coverage:

- **Pull requests:** format, typecheck, package build, Node tests on Node 24, Chromium browser tests, quick gate, and protected previews for internal PRs.
- **Pushes to `main` and manual CI:** the PR checks plus Node 26, accessibility evidence, site build/E2E/visual/Lighthouse, offline CLI smoke tests, catalog gates, and the full gate.
- **Nightly:** Solid version matrix, Chromium/Firefox/WebKit component tests, dependency freshness, and optional visual-baseline regeneration.

## Workflows

| File          | Trigger                                          | Purpose                                                      |
| ------------- | ------------------------------------------------ | ------------------------------------------------------------ |
| `ci.yml`      | Pull requests; pushes to `main`; manual dispatch | Tiered validation and internal PR preview deployments        |
| `release.yml` | Site-path pushes to `main`; manual dispatch      | Unified production package release, site deployment, or both |
| `nightly.yml` | Daily 04:00 UTC; manual dispatch                 | Full compatibility and environment-sensitive coverage        |

`release.yml` receives `target` (`packages`, `site`, `all`) and `gate` (`quick`, `full`) inputs. Its automatic `main` trigger is site-only and is limited to site, template, registry, package-doc, and documentation paths.

## CI job graph

### Pull request tier

```text
install
├── format
├── typecheck
├── build
│   ├── test-node (Node 24)
│   └── test-browser (Chromium)
└── preview-deploy (internal PRs only)

gate ← typecheck + build + test-node + test-browser
```

### Main/manual tier

```text
install
├── format
├── typecheck
├── build
│   ├── test-node (Node 24 and 26)
│   ├── test-browser (Chromium)
│   ├── a11y-axe-scan
│   ├── cli-smoke-create-prep → cli-smoke-create (npm, pnpm, yarn, bun)
│   └── catalog-gates
├── site-check → site-build → site-e2e + site-visual + site-lighthouse
└── vertical-slice-gate

gate ← typecheck + build + test-node + test-browser + a11y-axe-scan + site-e2e + catalog-gates
```

The `gate:quick` command runs Phase 0. `gate:full` runs Phase 3, which invokes Phases 0–2 before its own checks. The older `gate:phase0` through `gate:phase3` aliases remain available for targeted local investigation.

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

- Fork PRs never receive deployment secrets; preview deployment is limited to PRs from this repository.
- Release signing uses `REGISTRY_SIGN_KEY` only inside `release.yml`.
- npm publishing occurs only in CI for Changeset releases.
- Releases commit only targeted version, changelog, lockfile, Changeset, and registry paths.
- Every install is frozen except compatibility-matrix installs that intentionally override Solid versions.

## Manual operations

```bash
# Manual CI; defaults to the full tier
gh workflow run ci.yml

# Run CI against only affected packages
gh workflow run ci.yml -f affected_only=true

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
