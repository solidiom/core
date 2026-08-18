# Bumping Package Versions

This document describes the process and all the places that need updating when bumping the version across all `@solidiom/*` packages.

## Quick Reference

When bumping versions across all packages, these are the files/locations that need updating:

| Location                                          | What to update                                      |
| ------------------------------------------------- | --------------------------------------------------- |
| `packages/*/package.json`                         | The `"version"` field in every package              |
| `registry/*.json`                                 | Per-primitive manifests (contain `"version"` field) |
| `registry/index.json`                             | Catalog index (lists version per primitive)         |
| `registry/components/*.json`                      | Per-component manifests                             |
| `tools/__snapshots__/registry-build.test.ts.snap` | Test snapshot of the registry index structure       |

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

### 3. Update test snapshots

The registry build test has a snapshot of `registry/index.json` that includes version strings. Update it:

```bash
pnpm exec vitest run tools/registry-build.test.ts --update
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

# Update snapshots
pnpm exec vitest run tools/registry-build.test.ts --update
```

Changesets will:

- Bump only the packages that changed
- Generate `CHANGELOG.md` entries
- Respect semver (patch/minor/major based on changeset type)

## Notes

- The release script (`./scripts/release.sh`) runs `pnpm changeset version` automatically in Step 4 if there are pending changesets.
- The registry regeneration in the test suite rebuilds manifests, so stale registry files will cause snapshot mismatches.
- The `REGISTRY_TIMESTAMP` environment variable can pin the generation timestamp for deterministic builds (used in tests).
- Private packages (`"private": true`) and probe packages (version `0.0.0`) are excluded from npm publishing but still appear in the registry.
