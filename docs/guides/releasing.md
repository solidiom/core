---
id: releasing
title: "Releasing Packages and the Website"
sidebar_label: Releasing
description: How Solidiom maintainers publish packages and deploy the documentation site through GitHub Actions.
doc_type: how-to
audience: "Solidiom maintainers"
tags: [release, publishing, ci, deployment, guide]
lifecycle: current
---

> **Release policy:** the GitHub Actions workflow is the production release path for tagged releases and manual workflow dispatches. `scripts/release.sh` runs the same package/site pipeline locally by default; pass `--dispatch` to trigger `release.yml` instead. Local execution can publish packages or deploy the site when the required credentials are present.

## Release paths

| Need                                   | Command                              | Result                                                             |
| -------------------------------------- | ------------------------------------ | ------------------------------------------------------------------ |
| Publish one independent public package | `pnpm release:package @solidiom/pkg` | Builds, typechecks, tests, then directly publishes that package    |
| Publish packages from Changesets       | `pnpm release -- --target packages`  | Runs the package release pipeline locally; use `--dispatch` for CI |
| Deploy site only                       | `pnpm release -- --target site`      | Runs the site deployment pipeline locally; use `--dispatch` for CI |
| Publish packages and deploy site       | `pnpm release -- --target all`       | Runs both pipelines locally; use `--dispatch` for CI               |
| Use full release validation            | Append `--gate full`                 | Uses the full durable release gate before package publishing       |

## Prerequisites

- Node >= 24 and pnpm >= 10 (`mise install`)
- GitHub CLI installed and authenticated: `gh auth login`
- A branch/ref containing the intended changes (normally `main`)
- A Changeset for every package change that needs versioning: `pnpm changeset`

The GitHub repository must have `NPM_TOKEN`, `REGISTRY_SIGN_KEY`, `CLOUDFLARE_API_TOKEN`, and `CLOUDFLARE_ACCOUNT_ID` configured as Actions secrets. Preview deployment also uses the Cloudflare Access service-token secrets.

## Unified release workflow

`.github/workflows/release.yml` is the only production release workflow.

### Manual dispatch

The wrapper runs `scripts/release.sh` locally by default. Add `--dispatch` to trigger `.github/workflows/release.yml` through GitHub CLI instead:

```bash
# Local package/site pipeline, quick gate (default)
pnpm release

# Dispatch the same target to GitHub Actions instead of running locally
pnpm release -- --dispatch --target packages

# Local dry run: build, gate, and verify without publishing/deploying
pnpm release -- --dry-run --target all
```

Equivalent GitHub CLI commands are:

```bash
gh workflow run release.yml -f target=packages -f gate=quick
gh workflow run release.yml -f target=site -f gate=quick
gh workflow run release.yml -f target=all -f gate=full
```

`target` accepts `packages`, `site`, or `all`; `gate` accepts `quick` or `full`. Site-only releases skip the package gate because no package artifact is being published.

### Tag-triggered publish

`release.yml` publishes automatically when a `v*` tag is pushed. Versioning is deliberately kept out of this workflow: it runs git read-only, does not run `changeset version`, and does not commit anything back. Instead the release is a two-step, PR-reviewed model:

1. **Version PR** — dispatch `.github/workflows/version.yml`. It applies pending Changesets and opens one reviewable `release/version-*` PR containing all the release churn (package.json version bumps, CHANGELOGs, the regenerated/re-signed `registry/index.json`, and `pnpm-lock.yaml` updates).
2. **Merge → tag → publish** — when you merge that PR, `.github/workflows/tag-on-version-merge.yml` creates and pushes the matching `v<version>` tag, which triggers `release.yml` to publish exactly what was merged.

A `workflow_dispatch` on `release.yml` is the manual escape hatch: it publishes packages and/or deploys the site (`target` = `packages`, `site`, or `all`) from the dispatched ref without going through the Version PR.

### What CI does

For a package release (tag push or dispatch), `release.yml`:

1. Builds packages and runs the selected gate.
2. Signs and verifies the registry index with `REGISTRY_SIGN_KEY`.
3. Publishes to npm with the `beta` tag. Versions are already committed at the tagged tree (from the merged Version PR) — this workflow does not run `changeset version` and does not commit anything back.
4. Generates and verifies beta artifacts, then verifies beta signing.

For a site deployment, CI builds packages and templates, checks site boundaries and routes, runs `build:deploy`, creates the Pagefind index, and deploys `apps/site/dist` to Cloudflare Pages.

## Single-package release

Use this only for an independent public package. Packages in a Changesets linked group must be released through the unified workflow unless an emergency explicitly justifies `--allow-linked`.

```bash
# Validate without publishing
pnpm release:package @solidiom/astrojs-solid-next --dry-run

# Publish under the default beta tag
NODE_AUTH_TOKEN=... pnpm release:package @solidiom/astrojs-solid-next

# Publish under a specific tag
NODE_AUTH_TOKEN=... pnpm release:package @solidiom/button --tag latest

# Bump, rebuild, and publish
NODE_AUTH_TOKEN=... pnpm release:package @solidiom/button --bump patch
```

The script validates the workspace package, blocks private packages, builds, typechecks, tests (unless `--skip-tests` is supplied), and publishes without modifying `.npmrc`. It accepts `NODE_AUTH_TOKEN` or `NPM_TOKEN`.

The linked package group is:

- `@solidiom/runtime`
- `@solidiom/dialog`
- `@solidiom/select`
- `@solidiom/calendar`
- `@solidiom/carousel`

## CI strategy

The release-relevant workflows are:

| Workflow                   | Trigger                                    | Purpose                                                                                             |
| -------------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| `ci-packages.yml`          | Manual dispatch (push/PR triggers dormant) | Package build, tests, accessibility, CLI smoke, catalog + quality gates                             |
| `ci-site.yml`              | Manual dispatch (push/PR triggers dormant) | Site check, build, E2E, visual, Lighthouse, vertical-slice gate                                     |
| `version.yml`              | Manual dispatch                            | Applies pending Changesets and opens the reviewable Version PR (step 1 of the release model)        |
| `tag-on-version-merge.yml` | Version PR merged into `main`              | Creates and pushes the matching `v<version>` tag, which triggers `release.yml`                      |
| `release.yml`              | Pushed `v*` tag, manual dispatch           | Production package release, site deployment, or both                                                |
| `release-package.yml`      | Manual dispatch                            | Publishes one independent package between full releases (wraps `scripts/release-package.mjs`)       |
| `nightly.yml`              | Manual dispatch                            | Solid compatibility matrix, full browser suite, dependency checks, and visual-baseline regeneration |

`ci-packages.yml` fast tier (`full_matrix=false`) runs format, typecheck, build, a single Node test version, Chromium browser tests, and the quick gate. Its full tier (`full_matrix=true`) adds the Node 24/26 matrix, accessibility, CLI smoke tests, catalog gates, and the full gate. `ci-site.yml` checks and builds the site, and on its full tier adds E2E, visual, Lighthouse, and the vertical-slice gate. Browser compatibility across Chromium, Firefox, and WebKit belongs to the nightly suite. Both CI workflows are currently manual-dispatch only, as is `nightly.yml` (it has no scheduled trigger).

## Visual baselines

Visual screenshots must be captured in the pinned Linux Playwright image. Use a local container runtime when available:

```bash
pnpm run visual:update:container
```

Otherwise dispatch `nightly.yml` with `regenerate_baselines=true` and a descriptive `baseline_reason`, download the `visual-baselines` artifact, review it, and commit the intentional changes.

## Troubleshooting

### No pending Changesets

Create one before a package release:

```bash
pnpm changeset
pnpm changeset status
```

If no Changesets exist, the workflow skips the version bump. It does not create an npm release at an unchanged version.

### Release workflow does not start

Confirm the current GitHub CLI identity can dispatch actions and that the chosen ref exists remotely:

```bash
gh auth status
gh workflow list
```

Use `pnpm release -- --ref main` to dispatch against an explicit branch.

### Registry signing fails

Set the repository `REGISTRY_SIGN_KEY` Actions secret. It must contain the configured Ed25519 private-key material. Signing is deliberately CI-only.

### Site deployment fails

Check the `release.yml` run for site boundary, route-parity, build, or Cloudflare errors. `build:deploy` intentionally skips `i18n:validate`; the stricter site validation remains part of CI.

## File reference

| File                                         | Purpose                                                                 |
| -------------------------------------------- | ----------------------------------------------------------------------- |
| `scripts/release.sh`                         | Local package/site release pipeline; `--dispatch` is the CI alternative |
| `scripts/release-package.mjs`                | Independent single-package publisher                                    |
| `.github/workflows/version.yml`              | Opens the reviewable Version PR (applies Changesets); release step 1    |
| `.github/workflows/tag-on-version-merge.yml` | Tags `v<version>` when the Version PR merges; triggers `release.yml`    |
| `.github/workflows/release.yml`              | Unified package/site production release (tag-triggered or dispatched)   |
| `.github/workflows/release-package.yml`      | Manual single-package publish between full releases                     |
| `.github/workflows/ci-packages.yml`          | Package build, tests, and quality gates                                 |
| `.github/workflows/ci-site.yml`              | Site check, build, E2E, visual, and Lighthouse                          |
| `.github/workflows/nightly.yml`              | Manual-dispatch compatibility, browser, and visual checks               |
| `.changeset/config.json`                     | Changeset and linked-package configuration                              |
