# BASE-002: Solid 2 Version Reconciliation

**Status:** Complete
**Date:** 2026-07-29

---

## 1. Current State

### Workspace-level (pnpm-workspace.yaml)

| Package | Catalog spec | Override (resolved) |
|---------|-------------|---------------------|
| `solid-js` | `^2.0.0-beta.23` | `2.0.0-beta.24` |
| `@solidjs/web` | `^2.0.0-beta.23` | `2.0.0-beta.24` |
| `babel-preset-solid` | `^2.0.0-beta.23` | `2.0.0-beta.24` |

### apps/docs (legacy)

| Package | Declared version | Resolved version |
|---------|-----------------|-----------------|
| `solid-js` | `2.0.0-beta.21` | `2.0.0-beta.24` (override wins) |
| `@solidjs/web` | `2.0.0-beta.21` | `2.0.0-beta.24` (override wins) |
| `@solidjs/router` | `0.17.0-next.5` | `0.17.0-next.5` (no override) |

### apps/site (target)

| Package | Declared version | Resolved version |
|---------|-----------------|-----------------|
| `solid-js` | `catalog:` | `2.0.0-beta.24` |
| `@solidjs/web` | `catalog:` | `2.0.0-beta.24` |

### Root devDependencies

| Package | Declared version |
|---------|-----------------|
| `solid-js` | `2.0.0-beta.26` |

---

## 2. Version Drift Analysis

| Gap | From → To | Breaking changes? | Impact |
|-----|-----------|-------------------|--------|
| apps/docs declared vs. override | beta.21 → beta.24 | Minor API additions only | **No breakage** — overrides force resolution to beta.24 anyway |
| Root devDeps vs. override | beta.26 vs. beta.24 | Unknown — beta.26 may have breaking API | **Potential issue** — root devDependencies should match override |
| Catalog spec vs. override | `^beta.23` → `beta.24` | No — satisfies range | Clean |

---

## 3. Migration Constraints

1. **Do not change the POC baseline.** `apps/docs-astro-poc` must remain at its
   validated versions per BASE-001. The POC doesn't use `catalog:` — it uses
   `workspace:*` for the integration package, so it's unaffected by overrides.

2. **apps/docs uses hardcoded beta.21 but gets beta.24 at runtime** due to
   pnpm overrides. This means:
   - The declared version is cosmetically outdated but functionally irrelevant.
   - All demos actually run against beta.24 APIs.
   - TypeScript may report type errors if beta.24 changed any public API shapes.

3. **apps/site uses `catalog:`** which correctly resolves through the override
   chain. No version management needed per-app.

4. **Root devDependencies beta.26 discrepancy:** The root `package.json` lists
   `solid-js: 2.0.0-beta.26` in devDependencies, but the override forces
   `2.0.0-beta.24`. The override wins for all workspace packages. The root
   devDependency exists only for editor tooling (LSP type inference) and should
   be aligned to the override for consistency.

---

## 4. Recommendations

| Action | Priority | Blocked by |
|--------|----------|-----------|
| Update `apps/docs/package.json` declared versions to match override (beta.24) | Low | None — cosmetic only |
| Update root `devDependencies` solid-js to match override (beta.24) | Medium | None |
| Upgrade workspace to beta.26 when ready | Deferred | Requires testing all 52 primitives against new API |
| Freeze `apps/docs` at current behavior (MIG-002) | Now | MIG-001 (this document) |

---

## 5. Decision

**No changes to the POC baseline or workspace override are made.**

The version drift is documented. The practical impact is zero because pnpm
overrides ensure all packages resolve to `2.0.0-beta.24` regardless of
declared versions. The root devDependency discrepancy (beta.26) is a minor
housekeeping item that does not affect builds or tests.

When the workspace upgrades to a newer Solid beta, it should be done as a
dedicated task with full primitive test coverage, not as part of the site
migration.
