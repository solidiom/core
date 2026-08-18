---
id: releasing
title: "Releasing Packages and the Website"
sidebar_label: Releasing
description: How to publish @solidiom/* packages to npm and deploy the documentation site, both manually and via CI.
doc_type: how-to
audience: "Solidiom maintainers"
tags: [release, publishing, ci, deployment, guide]
lifecycle: current
---

> **Purpose:** For Solidiom maintainers, documents every release path — from publishing a single hotfix package to running a full beta release with site deployment. Covers manual (local) and CI (GitHub Actions) workflows.

## Overview

The release system supports four levels of granularity:

| Level              | Scope                                | Command                                     | Use when                              |
| ------------------ | ------------------------------------ | ------------------------------------------- | ------------------------------------- |
| **Single package** | One `@solidiom/*` package            | `mise run release:package -- @solidiom/pkg` | Hotfix, new package, adapter release  |
| **Packages only**  | All packages with pending changesets | `mise run release:packages-only`            | Library-only release, no site changes |
| **Quick release**  | Packages only + lightweight gate     | `mise run release:quick`                    | Confident release with minimal checks |
| **Full release**   | Packages + site + full gate suite    | `mise run release:publish`                  | Milestone release, first beta, GA     |

## Prerequisites

All release paths require:

- Node >= 24, pnpm >= 10 (`mise install`)
- `NPM_TOKEN` — set in `.env` or exported (get from npmjs.com → Access Tokens)
- Clean git working tree (`git status` shows no changes)
- On the `main` branch (warning issued if not, but not blocked)

Site deployment additionally requires:

- `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` in `.env` or exported
- `wrangler` available (installed via npx)

## Single-Package Publish

The fastest path. Builds, typechecks, and tests only the target package (plus its dependency graph), then publishes directly to npm.

### Usage

```bash
# Dry run (no publish)
mise run release:package:dry-run -- @solidiom/astrojs-solid-next

# Publish with beta tag (default)
mise run release:package -- @solidiom/astrojs-solid-next

# Publish with a specific tag
./scripts/release-package.sh @solidiom/button --tag latest

# Bump version before publishing
./scripts/release-package.sh @solidiom/runtime --bump patch
./scripts/release-package.sh @solidiom/runtime --bump prerelease --preid rc

# Skip tests (use with caution)
./scripts/release-package.sh @solidiom/button --skip-tests
```

### What it does

1. **Preflight** — validates npm auth, checks if package is private, warns about linked-package constraints
2. **Build** — `pnpm nx build @solidiom/pkg` (builds the target + all upstream dependencies via the nx graph)
3. **Typecheck** — `pnpm nx typecheck @solidiom/pkg`
4. **Test** — `pnpm nx test @solidiom/pkg`
5. **Publish** — `pnpm --filter @solidiom/pkg publish --tag <tag> --access public`

### What it skips

- Full workspace build (only builds the target's dependency graph)
- Phase gates (0/1/2/3)
- Registry signing
- Changeset versioning and changelog generation
- Site build and deploy

### When to use

- Publishing a new package for the first time (e.g. `@solidiom/astrojs-solid-next`)
- Hotfixing a single package without touching anything else
- Adapter or integration releases that are independent of primitives
- Testing a pre-release before committing to a full release

### Linked packages warning

If the target is in a linked group (defined in `.changeset/config.json`), the script warns you. Currently linked:

- `@solidiom/runtime`, `@solidiom/dialog`, `@solidiom/select`, `@solidiom/calendar`, `@solidiom/carousel`

These should normally be published together via the full release path. The single-package script lets you override this for emergencies.

## Packages-Only Release (Changeset Flow)

Publishes all packages that have pending changesets. Skips the site entirely.

### Usage

```bash
# Full gate suite, no site
mise run release:packages-only

# Quick gate (phase0 only), no site
mise run release:quick

# Dry run
mise run release:packages-only:dry-run
```

### What it does

1. **Install** — `pnpm install --frozen-lockfile`
2. **Tests and gates** — format, typecheck, build, unit tests, browser tests, tools tests, then gate:
   - Full mode: `gate:phase3` (includes phases 0, 1, 2 — most thorough)
   - Quick mode (`--quick-gate`): `gate:phase0` only (structural checks, no browser tests)
3. **Registry build** — generates and verifies registry manifests (unsigned locally)
4. **Version** — `pnpm changeset version` (bumps versions, generates changelogs)
5. **Rebuild** — rebuilds with final version strings
6. **Publish** — `pnpm changeset publish --tag beta` (all packages with version bumps)
7. **Artifacts** — generates `beta-catalog.json` and `beta-pointer.json`
8. **Commit** — commits version bumps, changelogs, and artifacts

### Creating changesets

Before running a packages-only release, you need pending changesets:

```bash
# Interactive changeset creation
pnpm changeset

# Check what's pending
pnpm changeset status
```

Each changeset is a markdown file in `.changeset/` describing what changed and at what semver level (patch/minor/major). The `changeset version` command consumes them all at once.

### No changesets? No problem

If there are no pending changesets, the release script warns and skips the version step. Packages are still published at their current versions (useful for re-publishing after a failed previous attempt).

## Full Release (Packages + Site)

The complete release pipeline. Publishes packages and deploys the site to Cloudflare Pages.

### Usage

```bash
# Full release
mise run release:publish

# Dry run (runs all tests, no publish or deploy)
mise run release:publish:dry-run

# Skip tests (publish + deploy only — use when tests already passed)
./scripts/release.sh --skip-tests
```

### What it does

Everything in "Packages-Only" plus:

6. **Site build** — builds templates, builds site with `build:deploy`, generates Pagefind search index
7. **Site deploy** — deploys `apps/site/dist` to Cloudflare Pages via wrangler

### Flags reference

| Flag           | Effect                                                       |
| -------------- | ------------------------------------------------------------ |
| `--dry-run`    | Run all checks, don't publish or deploy                      |
| `--skip-tests` | Skip step 2 entirely (dangerous)                             |
| `--no-site`    | Skip site build and deploy (same as `release:packages-only`) |
| `--quick-gate` | Use phase0 instead of phase3 in the test step                |
| `--site-only`  | Build and deploy site only, no package publish               |

Flags combine: `./scripts/release.sh --no-site --quick-gate --dry-run`

## Site-Only Deploy

Builds and deploys the documentation site without touching packages.

### Usage

```bash
mise run release:site
```

### What it does

1. Builds all templates (`@solidiom/template-*`)
2. Builds the site with `build:deploy` (skips i18n validation)
3. Generates Pagefind search index
4. Deploys to Cloudflare Pages

### When to use

- Documentation-only changes
- Template updates
- Registry route updates
- After a packages-only release, to update the site separately

## CI Workflows (GitHub Actions)

Three workflows are available, all manually dispatched from the Actions tab or via `gh workflow run`:

### `release-packages.yml` — Package Publish

Publishes packages with registry signing (CI has the `REGISTRY_SIGN_KEY` secret).

```bash
# Trigger with full gate
gh workflow run release-packages.yml

# Trigger with quick gate
gh workflow run release-packages.yml -f quick_gate=true
```

**Jobs:**

1. **gate** — installs, builds all packages (excluding site), runs phase3 or phase0 gate
2. **publish** — builds, signs registry (Ed25519), applies changeset versions, rebuilds with final versions, publishes to npm with beta tag, generates and verifies artifacts, commits back to main

**Differences from local:**

- Registry is **signed** (local publishes are unsigned)
- Uses OIDC `id-token: write` for npm trusted publishing
- Commits version bumps automatically via github-actions bot

### `release-site.yml` — Site Deploy

Deploys the documentation site to Cloudflare Pages.

```bash
# Manual trigger
gh workflow run release-site.yml
```

**Also triggers automatically** on pushes to `main` that change:

- `apps/site/**`
- `templates/**`
- `registry/**`
- `packages/*/docs/**`
- `docs/**`

**Jobs:**

1. **deploy** — installs, builds packages, builds templates, validates site structure (boundaries + route parity), builds site, generates search index, deploys to Cloudflare

### `release.yml` — Combined (Legacy)

The original combined workflow. Runs full gate then publishes packages + site in one pipeline. Retained for milestone releases where you want everything in one atomic operation.

```bash
gh workflow run release.yml
```

### `ci.yml` — CI Pipeline

Not a release workflow, but supports incremental builds:

```bash
# Full CI
gh workflow run ci.yml

# Affected-only (faster, only tests changed packages)
gh workflow run ci.yml -f affected_only=true
```

## Incremental Builds (nx affected)

For local development, use affected-only commands to skip unchanged packages:

```bash
# Build only what changed
mise run affected:build

# Test only what changed
mise run affected:test

# Typecheck only what changed
mise run affected:typecheck

# All three (fast local CI substitute)
mise run affected:all
```

These compare against `HEAD~1` by default. Nx uses its dependency graph to include downstream packages — if you change `@solidiom/runtime`, all packages that depend on it are also built/tested.

## Decision Guide

```
Need to publish one package quickly?
  → mise run release:package -- @solidiom/pkg

Need to release all pending changes without touching the site?
  → mise run release:packages-only

Confident in the code, want the fastest full release?
  → mise run release:quick

Milestone release, want maximum confidence?
  → mise run release:publish

Only docs/site changed?
  → mise run release:site

Want CI to handle signing and publishing?
  → gh workflow run release-packages.yml

Want the site auto-deployed on merge?
  → It already does (release-site.yml triggers on path changes to main)
```

## Troubleshooting

### "No unreleased changesets found"

`@changesets/cli@3.0.0` exits with code 1 when no changesets exist. The release script handles this gracefully — it checks for pending changesets before calling `changeset version` and skips the step if none are found.

If you see this error, it means you forgot to create a changeset:

```bash
pnpm changeset
```

### "Working tree is not clean"

The release script requires a clean git state. Commit or stash your changes first.

### "NPM_TOKEN is invalid"

Your token expired or was revoked. Generate a new one at npmjs.com → Access Tokens → Generate New Token (Classic, Publish).

### Linked package warning

If `release:package` warns about linked packages, consider whether the change truly needs to be published alone. If you changed `@solidiom/runtime`'s API, its consumers (`dialog`, `select`, etc.) likely need a coordinated release.

### Registry signing fails in CI

The `REGISTRY_SIGN_KEY` secret must be set in the repository's GitHub Actions secrets. It's a 64-character hex string (Ed25519 private key). Local releases are always unsigned — signing only happens in CI.

### Site build fails with i18n validation

The release script uses `build:deploy` which skips `i18n:validate`. If you need to run the full i18n check:

```bash
mise run i18n:validate
```

This is a GA gate — beta releases are not expected to have fully reviewed translations.

## File Reference

| File                                     | Purpose                                                     |
| ---------------------------------------- | ----------------------------------------------------------- |
| `scripts/release.sh`                     | Main release script (all flags)                             |
| `scripts/release-package.sh`             | Single-package publish script                               |
| `.github/workflows/release-packages.yml` | CI: package-only publish with signing                       |
| `.github/workflows/release-site.yml`     | CI: site deploy (auto + manual)                             |
| `.github/workflows/release.yml`          | CI: combined release (legacy)                               |
| `.changeset/config.json`                 | Changeset configuration (linked packages, ignored packages) |
| `tools/registry-build.ts`                | Registry manifest generator                                 |
| `tools/generate-beta-artifacts.ts`       | Beta catalog and pointer generator                          |
| `tools/verify-beta-signing.ts`           | Ed25519 signature verifier                                  |
