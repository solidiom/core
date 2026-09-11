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

> **Release policy:** the GitHub Actions workflow is the production release path for trusted Version PR merge dispatches and manual escape hatches. `scripts/release.sh` runs the same package/site pipeline locally by default; pass `--prepare-version` to consume committed Changesets, create the version/artifact commit, and continue through local publication in one invocation, or pass `--dispatch` to invoke `release.yml` manually instead.

## Release paths

| Need                                                   | Command                              | Result                                                                      |
| ------------------------------------------------------ | ------------------------------------ | --------------------------------------------------------------------------- |
| Prepare and publish pending Changesets locally         | `mise run release:local:packages`    | Versions, signs, commits, full-gates, and publishes packages under `latest` |
| Publish one independent public package                 | `pnpm release:package @solidiom/pkg` | Builds, typechecks, tests, then directly publishes that package             |
| Publish already-committed package versions             | `pnpm release -- --target packages`  | Runs the package release pipeline locally; use `--dispatch` for CI          |
| Deploy site only                                       | `pnpm release -- --target site`      | Runs the site deployment pipeline locally; use `--dispatch` for CI          |
| Publish committed packages and deploy site             | `pnpm release -- --target all`       | Runs both pipelines locally; use `--dispatch` for CI                        |
| Build, publish, and deploy an already-versioned commit | `mise run release:all`               | Builds all package/site artifacts before publishing either destination      |
| Use full release validation                            | Append `--gate full`                 | Uses the full durable release gate before package publishing                |

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
# Publish an already-versioned commit and deploy its website; all builds run first
mise run release:all

# Apply pending Changesets, commit versions, and publish packages only
mise run release:local:packages

# Local package/site pipeline for versions that are already committed
pnpm release

# Dispatch the same target to GitHub Actions instead of running locally
pnpm release -- --dispatch --target packages

# Local dry run for already-committed versions
pnpm release -- --dry-run --target all
```

`release:local:packages` requires a clean attached Git branch, committed pending
Changesets, `NPM_TOKEN`, and `REGISTRY_SIGN_KEY`. It enforces the pinned pnpm,
installs from the frozen lockfile, applies `changeset version`, regenerates the
signed registry and package `source/` mirrors, validates npm candidates, and
creates a normal hook-checked release commit before its package gate and publish.

`release:all` expects those version changes to already be committed and requires
`NPM_TOKEN`, both Cloudflare credentials, and at least one unpublished package
candidate. Package artifacts, release/signing artifacts, templates, site
validation, the deploy build, and the search index must all pass before
`changeset publish`; Cloudflare receives the prebuilt site only after npm
publication succeeds. Neither path pushes or tags. `--prepare-version` cannot be
combined with `--dry-run`, `--dispatch`, or a site-only target.

Equivalent GitHub CLI commands are:

```bash
gh workflow run release.yml -f target=packages -f gate=quick
gh workflow run release.yml -f target=site -f gate=quick
gh workflow run release.yml -f target=all -f gate=full
```

`target` accepts `packages`, `site`, or `all`; `gate` accepts `quick` or `full`. Site-only releases skip the package gate because no package artifact is being published.

### Version PR merge release

Versioning stays out of `release.yml`: publishing runs git read-only, never runs
`changeset version`, and never commits back. The reviewed flow is:

1. **Version PR** — dispatch `.github/workflows/version.yml`. It applies pending Changesets and opens a `release/version-<run-id>` PR containing package version bumps, changelogs, the regenerated/re-signed registry, and lockfile updates.
2. **Merge → immutable marker → explicit dispatch** — merging that PR creates `release-pr-<PR>-<SHA12>` at the merge commit and explicitly dispatches `.github/workflows/release.yml` on that ref with the full expected SHA, `target=all`, and the npm channel derived from changed versions.
3. **Fail-closed release** — `release.yml` verifies the ref resolves to the expected SHA and requires at least one package version absent from npm before running the gate. After publication succeeds, it deploys the website.

A plain tag push does not release anything. This is deliberate: package versions
are independent, so a global `v<version>` tag is ambiguous, and tag pushes made
with `GITHUB_TOKEN` are not a reliable downstream workflow trigger.

A manual `workflow_dispatch` remains the escape hatch for package, site, or
combined releases from a selected ref. Package targets still fail if every
committed version already exists on npm.

### What CI does

For an automated Version PR merge release, `release.yml`:

1. Verifies the immutable release marker resolves to the full expected merge SHA.
2. Validates npm/Cloudflare credentials and requires at least one unpublished package version.
3. Builds packages and runs the selected gate.
4. Signs and verifies the registry, then publishes committed versions to npm. A Changesets no-op is treated as failure.
5. Generates release artifacts and verifies signing.
6. Builds and deploys `apps/site/dist` plus its Pagefind index to Cloudflare Pages.

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
| `tag-on-version-merge.yml` | Version PR merged into `main`              | Creates an immutable exact-SHA marker and explicitly dispatches a combined release                  |
| `release.yml`              | Manual or trusted post-merge dispatch      | Verifies candidates/SHA, publishes packages, and optionally deploys the site                        |
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

Set `REGISTRY_SIGN_KEY` in the shell or project `.env` for integrated local
preparation, or configure the repository Actions secret for hosted releases.
`--prepare-version` refuses to create a release commit without it.

### Site deployment fails

Check the `release.yml` run for site boundary, route-parity, build, or Cloudflare errors. `build:deploy` intentionally skips `i18n:validate`; the stricter site validation remains part of CI.

## File reference

| File                                         | Purpose                                                                                         |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `scripts/release.sh`                         | Local package/site pipeline; `--prepare-version` adds versioning + commit, `--dispatch` uses CI |
| `scripts/release-package.mjs`                | Independent single-package publisher                                                            |
| `.github/workflows/version.yml`              | Opens the reviewable Version PR (applies Changesets); release step 1                            |
| `.github/workflows/tag-on-version-merge.yml` | Creates an immutable marker and dispatches the exact-SHA combined release                       |
| `.github/workflows/release.yml`              | Fail-closed package/site production release; release step 2                                     |
| `tools/release-candidates.mjs`               | Requires at least one committed package version not already published on npm                    |
| `.github/workflows/release-package.yml`      | Manual single-package publish between full releases                                             |
| `.github/workflows/ci-packages.yml`          | Package build, tests, and quality gates                                                         |
| `.github/workflows/ci-site.yml`              | Site check, build, E2E, visual, and Lighthouse                                                  |
| `.github/workflows/nightly.yml`              | Manual-dispatch compatibility, browser, and visual checks                                       |
| `.changeset/config.json`                     | Changeset and linked-package configuration                                                      |
