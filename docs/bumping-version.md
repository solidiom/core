# Bumping Package Versions

> **For releasing to npm, see [RELEASING.md](./RELEASING.md).** That is the
> authoritative guide for the two-step release flow (Version PR → immutable
> exact-SHA marker → explicit package/site dispatch), the integrated local
> `release.sh --prepare-version` flow, and single-package releases. In normal
> hosted operation you do **not** bump versions by hand — the **Version PR**
> workflow runs `changeset version` and regenerates the registry for you. The
> integrated local mode performs those same preparation steps and records the
> release commit before it publishes.
>
> This document remains as a reference for the underlying mechanics and for the
> rare manual bump (e.g. bootstrapping or a local experiment).

This document describes the process and all the places that need updating when bumping the version across all `@solidiom/*` packages.

## Automated (preferred)

The whole step sequence below is driven by a single mise target:

```bash
mise run version:bump -- 0.7.0            # bump → regenerate registry → verify, no commit
mise run version:bump -- 0.7.0 --commit   # also create `chore: bump all packages to 0.7.0`
mise run version:bump -- 0.7.0 --dry-run  # show the bump, write nothing
```

It calls `scripts/bump-version.mjs` for the version rewrite (one job: set the
`version` field on every **publishable** package — non-`private` and not in the
changeset `ignore` list — idempotently, so re-running with the same version is a
no-op), then regenerates the registry and re-runs the registry build test and
the tools suite. The steps below remain the manual reference for what the
target does and for one-offs it does not cover (e.g. granular per-package
changesets).

## Quick Reference

When bumping versions across all packages, these are the files/locations that need updating:

| Location                       | What to update                                      |
| ------------------------------ | --------------------------------------------------- |
| `packages/*/package.json`      | The `"version"` field in every package              |
| `registry/*.json`              | Per-primitive manifests (contain `"version"` field) |
| `registry/index.json`          | Catalog index (lists version per primitive)         |
| `registry/components/*.json`   | Per-component manifests                             |
| `tools/registry-build.test.ts` | Structural assertions on the registry index         |

## Step-by-Step Process

### 1. Bump `package.json` versions

Use the idempotent script (the same one `version:bump` calls):

```bash
node scripts/bump-version.mjs 0.2.0          # rewrite publishable packages
node scripts/bump-version.mjs --dry-run 0.2.0  # preview without writing
```

It sets `version` on every **publishable** package — non-`private` and not in
the changeset `ignore` list — and leaves tooling, probe (`0.0.0`), and private
packages untouched. Running it again with the same version reports
`already at 0.2.0` and writes nothing.

 <details>
 <summary>Raw fallback (bumps every package.json, including tooling)</summary>

```bash
grep -rl '"version"' packages/*/package.json | grep -v node_modules | \
  xargs -I{} sed -i '' 's/"version": "[^"]*"/"version": "0.2.0"/' "{}"
```

Verify:

```bash
grep -r '"version"' packages/*/package.json | grep -v node_modules | grep -v "0.2.0"
# Should return nothing
```

 </details>

### 2. Regenerate the registry

The registry manifests read versions from `package.json` files. After bumping, regenerate them:

```bash
pnpm exec tsx tools/registry-build.ts
```

This updates:

- `registry/<primitive>.json` — each primitive manifest's `version` field
- `registry/components/<component>.json` — each component manifest's `version` field
- `registry/index.json` — the catalog with version info for all entries

### 3. Re-check the registry build test

`tools/registry-build.test.ts` rebuilds the registry and asserts the index's
structure and integrity (schema version, `sha256` entries hash, non-empty
collections). It has no external `.snap` file to update, so just re-run it to
confirm the regenerated `registry/index.json` still passes:

```bash
pnpm exec vitest run tools/registry-build.test.ts
```

### 4. Verify all tests pass

```bash
pnpm run test:tools
```

All 35 test files (382+ tests) should pass.

### 5. Commit

The `version:bump` target does this with `--commit`; manually:

```bash
git add -A
git commit -m "chore: bump all packages to <version>"
```

## Using Changesets (Recommended for Production)

For granular, per-package version bumps with changelog generation, use the changesets workflow:

```bash
# Create a changeset describing what changed
pnpm changeset

# Apply version bumps based on pending changesets
pnpm changeset version

# Regenerate registry after version bump
pnpm exec tsx tools/registry-build.ts

# Re-check the registry build test
pnpm exec vitest run tools/registry-build.test.ts
```

Changesets will:

- Bump only the packages that changed
- Generate `CHANGELOG.md` entries
- Respect semver (patch/minor/major based on changeset type)

## Notes

- Releases no longer run `changeset version` inside the publish job. The
  **Version PR** workflow (`version.yml`) applies Changesets and regenerates the
  registry in a reviewable PR. Merging it creates a unique marker tied to the
  merge SHA and explicitly dispatches the fail-closed package/site release. See
  [RELEASING.md](./RELEASING.md).
- The registry regeneration in the test suite rebuilds manifests, so stale registry files will cause snapshot mismatches.
- Registry generation is timestamp-free: identical source inputs produce byte-identical manifests, indexes, signatures, and hashes.
- Private packages (`"private": true`) and probe packages (version `0.0.0`) are excluded from npm publishing but still appear in the registry.
