# CI Pipeline

> Architecture, job graph, and local reproduction guide for `.github/workflows/ci.yml`.

---

## Overview

The CI pipeline validates every aspect of the Solidiom monorepo: formatting, types, builds, tests (unit, browser, accessibility, E2E, visual), catalog integrity, and phase gates. It runs on `workflow_dispatch` (manual trigger via GitHub Actions UI or `gh workflow run ci.yml`).

A separate **Solid compatibility matrix** (`solid-compat.yml`) runs nightly to test against multiple SolidJS beta versions without blocking PRs.

---

## Job Dependency Graph

```
install
├── format
├── typecheck
├── build ─────────────────────────────────────────────┐
│   ├── test-node (matrix: Node 24, 26)                │
│   ├── test-browser                                   │
│   ├── a11y-axe-scan                                  │
│   ├── catalog-gates                                  │
│   ├── vertical-slice-gate (also needs site-check)    │
│   └── cli-smoke-create-prep → cli-smoke-create (×4)  │
├── site-check                                         │
│   └── site-build                                     │
│       ├── site-e2e                                   │
│       ├── site-visual (container)                    │
│       ├── site-lighthouse (advisory)                 │
│       ├── beta-acceptance-report                     │
│       └── beta-acceptance-e2e                        │
└── gates (needs: typecheck, build, test-node,         │
           test-browser, a11y-axe-scan,                │
           site-e2e, catalog-gates)                    │
```

---

## Key Design Decisions

### 1. Build Once, Download Everywhere

The `build` job uploads all `packages/*/dist` and `apps/*/dist` (excluding the site) as an artifact. Every downstream job downloads these instead of rebuilding, eliminating ~9 redundant `pnpm build` invocations.

### 2. Playwright Browser Caching

Jobs that need Playwright browsers use `actions/cache` keyed on the lockfile hash. On cache hit, only system dependencies are installed (`npx playwright install-deps`), not the browsers themselves (~400MB–1.2GB savings per job).

### 3. Consolidated Gate Jobs

The four phase gates (phase1, phase2, phase0, phase3) run sequentially in a single `gates` job rather than as separate jobs. Each gate script is lightweight — the expensive work (build, test) has already passed in upstream jobs.

### 4. Solid Matrix Separation

The 6-job Solid compatibility matrix (3 tiers × 2 Node versions) runs in a separate `solid-compat.yml` workflow on a nightly schedule + manual dispatch, keeping ~30 minutes off the PR critical path.

### 5. Composite Setup Action

`.github/actions/setup/action.yml` encapsulates the repeated pnpm/node/cache-restore/install boilerplate. Every job calls:

```yaml
- uses: actions/checkout@v5
- uses: ./.github/actions/setup
```

### 6. Site Build Exclusion

The site (`@solidiom/site`) is excluded from the library `build` job because it has its own dedicated `site-build` job with independent validation steps.

---

## Workflows

| File                   | Trigger                                 | Purpose                                 |
| ---------------------- | --------------------------------------- | --------------------------------------- |
| `ci.yml`               | `workflow_dispatch`                     | Full CI pipeline (19 jobs)              |
| `solid-compat.yml`     | Nightly 04:00 UTC + `workflow_dispatch` | Solid version compatibility matrix      |
| `release.yml`          | `workflow_dispatch`                     | Build → sign → publish → commit back    |
| `preview-deploy.yml`   | `workflow_dispatch`                     | Deploy preview site to Cloudflare Pages |
| `visual-baselines.yml` | `workflow_dispatch`                     | Regenerate visual regression baselines  |

---

## Jobs Reference

| Job                      | Depends On                                                                        | What It Does                                                             |
| ------------------------ | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `install`                | —                                                                                 | `pnpm install --frozen-lockfile`, cache node_modules                     |
| `format`                 | install                                                                           | `prettier --check .`                                                     |
| `typecheck`              | install                                                                           | `nx run-many -t typecheck`                                               |
| `build`                  | install                                                                           | Build all packages, run 8 integrity/parity audits, upload dist artifacts |
| `test-node`              | build                                                                             | Unit + tools tests (Node 24/26 matrix), downloads build artifacts        |
| `test-browser`           | build                                                                             | Browser component tests + RECIPE-005 parity                              |
| `a11y-axe-scan`          | build                                                                             | Axe accessibility scans, evidence generation, coverage gate              |
| `site-check`             | install                                                                           | Astro check, import boundaries, i18n validation                          |
| `site-build`             | site-check                                                                        | Astro build, Pagefind index, REG-007 route check                         |
| `site-e2e`               | site-build                                                                        | Playwright E2E against built site                                        |
| `site-visual`            | site-build                                                                        | Visual regression in pinned Playwright container                         |
| `site-lighthouse`        | site-build                                                                        | Lighthouse budgets (advisory, continue-on-error)                         |
| `cli-smoke-create-prep`  | build                                                                             | Warm Verdaccio offline registry snapshot                                 |
| `cli-smoke-create`       | build, prep                                                                       | Offline create/install/build/test (npm, pnpm, yarn, bun)                 |
| `beta-acceptance-report` | site-build                                                                        | BETA-002 static-build acceptance (60 checks)                             |
| `beta-acceptance-e2e`    | site-build                                                                        | BETA-002 cross-browser acceptance (111 checks)                           |
| `catalog-gates`          | build                                                                             | Component + block catalog verification                                   |
| `vertical-slice-gate`    | build, site-check                                                                 | VS-004 gate (G2 exit checklist)                                          |
| `gates`                  | typecheck, build, test-node, test-browser, a11y-axe-scan, site-e2e, catalog-gates | Phase 1→2→0→3 gates sequentially                                         |

---

## Running CI Locally

All CI jobs have equivalent mise tasks. Use the orchestrators for common workflows:

```bash
# Fast check (format + typecheck + build + tests + gates, ~10 min)
mise run ci:quick

# Full pre-push (everything except Node matrix and offline smoke, ~20 min)
mise run ci:prepush

# Complete CI (mirrors ci.yml, ~45 min)
mise run ci:all

# Solid compatibility matrix (mirrors solid-compat.yml, ~30 min)
mise run ci:solid-matrix
```

### Individual Tasks

```bash
mise run ci:install          # Install from frozen lockfile
mise run ci:format           # Prettier check
mise run ci:typecheck        # Type-check all packages
mise run ci:build            # Build + integrity audits
mise run ci:test-node        # Unit + tools tests
mise run ci:test-browser     # Browser component tests
mise run ci:a11y-axe-scan    # Accessibility scans
mise run ci:site-check       # Site boundaries + content validation
mise run ci:site-build       # Astro build + search index
mise run ci:site-e2e         # Site E2E tests
mise run ci:site-visual      # Visual baselines (advisory on macOS)
mise run ci:site-lighthouse  # Lighthouse (advisory)
mise run ci:catalog-gates    # Catalog verification
mise run ci:vertical-slice-gate  # VS-004 gate
mise run ci:gates            # Consolidated phase gates
mise run ci:smoke-create-prep    # Warm offline registry
mise run ci:smoke-create         # Offline smoke matrix
mise run ci:beta-acceptance-report  # BETA-002 report
mise run ci:beta-acceptance-e2e     # BETA-002 E2E
```

---

## Caching Strategy

| Cache                     | Key                                                        | Path                                            | Purpose                                       |
| ------------------------- | ---------------------------------------------------------- | ----------------------------------------------- | --------------------------------------------- |
| Node modules              | `modules-{lockfile hash}`                                  | `node_modules`, `packages/*/node_modules`, etc. | Avoid re-resolving deps                       |
| Playwright browsers       | `playwright-{chromium\|all}-{lockfile hash}`               | `~/.cache/ms-playwright`                        | Avoid re-downloading 400MB–1.2GB              |
| Offline registry snapshot | `offline-registry-snapshot-{OS}-{templates+lockfile hash}` | `tools/offline-fixture/.registry-snapshot`      | Avoid re-warming Verdaccio                    |
| Build artifacts           | Uploaded per-run (retention: 1 day)                        | `packages/*/dist`, `apps/*/dist`                | Eliminate redundant builds                    |
| Site dist                 | Uploaded per-run                                           | `apps/site/dist`                                | Share built site across E2E/visual/lighthouse |

---

## Security Controls

- **Frozen lockfile** in all jobs prevents dependency resolution changes
- **Fork PR guard** on preview-deploy prevents fork PRs from accessing secrets
- **No `${{ }}` in shell `run:` steps** — all user/dispatch inputs go through `env:` blocks
- **Targeted `git add`** in release workflow (no `git add -A`)
- **`id-token: write`** enables npm provenance via OIDC
- **Ed25519 registry signing** in release workflow with signature verification

---

## Troubleshooting

### `ci:build` fails on "stale artifacts"

The BUILD-001 check detected that `pnpm build` produced different output than what's committed. Run locally and commit:

```bash
pnpm build && pnpm run report:a11y-evidence && pnpm run registry:build
git add registry/ packages/*/source/
git commit -m "chore: regenerate build artifacts"
```

### `ci:site-check` or `ci:site-build` pre-existing failures

Two known pre-existing gates that may fail locally:

- **`astro check`** — 148 type errors in Astro pages (tracked separately)
- **`translation:check`** — 235 stale translations awaiting human review

The mise tasks bypass these. The GitHub CI workflow runs the full `pnpm --filter @solidiom/site check` which includes both.

### Playwright on macOS

Visual baselines are rendered on Linux (ubuntu-latest). Running `ci:site-visual` on macOS will show font-rendering diffs on nearly every snapshot. This is expected — only trust the CI job for visual correctness.

### Offline smoke tests need prep

`ci:smoke-create` requires `ci:smoke-create-prep` to have run first (it warms a local Verdaccio registry). The prep step requires network access.

---

## Adding a New CI Job

1. Add the job to `.github/workflows/ci.yml` using the composite action:

   ```yaml
   my-new-job:
     needs: build
     runs-on: ubuntu-latest
     steps:
       - uses: actions/checkout@v5
       - uses: ./.github/actions/setup
       - uses: actions/download-artifact@v4
         with:
           name: build-dist
           path: .
       - run: pnpm run my-check
   ```

2. Add a corresponding mise task to `.mise.toml`:

   ```toml
   [tasks."ci:my-new-job"]
   description = "CI job `my-new-job`: description here"
   run = "pnpm run my-check"
   ```

3. Add it to the appropriate orchestrator(s) (`ci:all`, `ci:prepush`, `ci:quick`).

4. If it needs Playwright, add the cache + conditional install pattern (see `test-node` for reference).
