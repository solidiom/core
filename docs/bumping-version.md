# Bumping Package Versions

> **For releasing to npm, see [RELEASING.md](./RELEASING.md).** That is the
> authoritative guide for the two-step release flow (Version PR → tag →
> publish) and single-package releases. In normal operation you do **not** bump
> versions by hand — the **Version PR** workflow runs `changeset version` and
> regenerates the registry for you.
>
> This document remains as a reference for the underlying mechanics and for the
> rare manual bump (e.g. bootstrapping or a local experiment).

This document describes the process and all the places that need updating when bumping the version across all `@solidiom/*` packages.

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

Update the `"version"` field in every package under `packages/`:

```bash
# Bump all packages to a specific version (e.g., 0.2.0)
grep -rl '"version"' packages/*/package.json | grep -v node_modules | \
  xargs -I{} sed -i '' 's/"version": "[^"]*"/"version": "0.2.0"/' "{}"
```

Verify:

```bash
grep -r '"version"' packages/*/package.json | grep -v node_modules | grep -v "0.2.0"
# Should return nothing
```

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
  **Version PR** workflow (`version.yml`) applies changesets and regenerates the
  registry in a reviewable PR; the tag-triggered `release.yml` only publishes.
  See [RELEASING.md](./RELEASING.md).
- The registry regeneration in the test suite rebuilds manifests, so stale registry files will cause snapshot mismatches.
- The `REGISTRY_TIMESTAMP` environment variable can pin the generation timestamp for deterministic builds (used in tests).
- Private packages (`"private": true`) and probe packages (version `0.0.0`) are excluded from npm publishing but still appear in the registry.
