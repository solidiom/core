# Registry Schema v2 — Design Document

> REG-001 · Status: Draft  
> Implements: docs/website-imp.md §5.2

## 1. Overview

Registry schema v2 extends the existing per-entry and index manifests to support product-layer
deliverables, accessibility evidence, documentation maturity, styling metadata, search indexing,
and integrity verification. v2 is a **strict superset** of v1—all existing fields are preserved
and all 52 primitives + 6 adapters regenerate without data loss.

---

## 2. Migration Principles

| # | Principle |
|---|-----------|
| 1 | v2 is a strict superset of v1. No field is removed or renamed. |
| 2 | All 52 primitives and 6 adapters must regenerate identically for v1-mapped fields. |
| 3 | New fields start as **optional** during migration and become required at GA. |
| 4 | `index.json` version changes from `1` to `2`. |
| 5 | Migration is automated in `tools/registry-build.ts`—no manual editing. |
| 6 | Existing consumers of `registry/*.json` must not break; new fields are additive. |

---

## 3. Per-Entry Manifest Schema (v2)

```typescript
interface RegistryManifestV2 {
  // ─── Preserved from v1 (unchanged semantics) ─────────────────────────────

  /** Kebab-case primitive name (e.g. "alert-dialog"). */
  name: string

  /** Semver version string. */
  version: string

  /** Scoped npm package name (e.g. "@solidiom/alert-dialog"). */
  package: string

  /** Port-based capability requirements with default adapter info. */
  capabilities: Capability[]

  /** Workspace @solidiom/* dependencies. */
  dependencies: string[]

  /** Source file listing. */
  source: {
    entry: string
    files: string[]
  }

  /** Runtime module subpaths consumed from @solidiom/runtime. */
  runtime: string[]

  // ─── New in v2 ────────────────────────────────────────────────────────────

  /** JSON Schema version URI for tooling validation. */
  $schema: string

  /** Human-readable display name (e.g. "Alert Dialog"). */
  label: string

  /** One-line description of the primitive's purpose. */
  description: string

  /** Primitive category (e.g. "overlay", "input", "layout"). */
  category: string

  /** Maturity status. */
  status: 'experimental' | 'preview' | 'stable' | 'deprecated'

  /** Product-layer availability. */
  deliverables: {
    /** Always true for primitives. */
    primitive: boolean
    /** Styled component layer available. */
    component?: boolean
    /** Composed block layer available. */
    block?: boolean
    /** Page template layer available. */
    template?: boolean
    /** Theme preset available. */
    theme?: boolean
  }

  /** CLI integration metadata. */
  cli: {
    /** Full add command (e.g. "solidiom add dialog"). */
    addCommand: string
    /** npm packages required as peer/runtime dependencies. */
    installDeps: string[]
  }

  /** Accessibility review status and evidence. */
  accessibility: {
    /** Current review tier. */
    reviewStatus: 'none' | 'automated' | 'manual' | 'complete'
    /** References to axe/test artifact identifiers. */
    evidenceIds: string[]
    /** ISO 8601 date of last accessibility review. */
    lastReviewed?: string
  }

  /** Documentation maturity and translation freshness. */
  documentation: {
    /** Overall documentation status. */
    status: 'stub' | 'draft' | 'review' | 'complete'
    /** Per-locale freshness tracking. */
    locales: Record<string, {
      status: 'missing' | 'draft' | 'stale' | 'reviewed'
      /** SHA-256 hash of the English source at time of translation. */
      sourceHash?: string
      /** ISO 8601 date of last locale update. */
      lastUpdated?: string
    }>
  }

  /** Styling output formats and theme compatibility. */
  styling: {
    /** Which CSS output targets are available. */
    outputs: ('css' | 'tailwind' | 'unocss')[]
    /** Compatible theme preset names. */
    themeCompatible: string[]
  }

  /** Search and discovery metadata. */
  search: {
    /** Keywords for registry search/filter. */
    keywords: string[]
  }

  /** Integrity and provenance. */
  integrity: {
    /** Deterministic SHA-256 hash of all source files (sorted, concatenated). */
    filesHash: string
    /** Optional detached signature over the manifest JSON. */
    manifestSignature?: string
    /** ISO 8601 timestamp of last manifest generation. */
    lastGenerated: string
  }

  /** ISO 8601 date of last meaningful change to the primitive. */
  lastUpdated: string
}

interface Capability {
  name: string
  version: number
  default: string
}
```

---

## 4. Index Manifest Schema (v2)

```typescript
interface IndexManifestV2 {
  /** JSON Schema version URI. */
  $schema: string

  /** Schema version — always 2. */
  version: 2

  /** ISO 8601 generation timestamp. */
  generatedAt: string

  /** Integrity over the full index. */
  integrity: {
    /** SHA-256 hash of all per-entry filesHash values (sorted, concatenated). */
    entriesHash: string
    /** Optional detached signature over the index JSON. */
    signature?: string
  }

  /** Catalog of all public primitives. */
  primitives: Array<{
    name: string
    version: string
    package: string
    /** Human-readable display name (required in v2). */
    label: string
    /** One-line description (required in v2). */
    description: string
    /** Primitive category (required in v2). */
    category: string
    /** Maturity status. */
    status: string
    /** List of available product layers (e.g. ["primitive", "component"]). */
    deliverables: string[]
    /** Whether the entry has any accessibility evidence on file. */
    hasAccessibilityEvidence: boolean
    /** Overall documentation status. */
    documentationStatus: string
  }>

  /** Catalog of all adapters. */
  adapters: Array<{
    name: string
    package: string
    capability: string
    /** Adapter version (new in v2). */
    version: string
  }>
}
```

---

## 5. Migration Rules (v1 → v2)

Each rule describes how an existing v1 field or a new v2 field is populated during automated
migration in `registry-build.ts`.

### 5.1 Direct mappings (no transformation)

| v1 field | v2 field | Notes |
|----------|----------|-------|
| `name` | `name` | Unchanged |
| `version` | `version` | Unchanged |
| `package` | `package` | Unchanged |
| `capabilities` | `capabilities` | Unchanged |
| `dependencies` | `dependencies` | Unchanged |
| `source` | `source` | Unchanged |
| `runtime` | `runtime` | Unchanged |

### 5.2 Promoted from IndexManifest / nx.metadata

| Source | v2 per-entry field | Notes |
|--------|-------------------|-------|
| `nx.metadata.label` | `label` | Already read during index generation |
| `nx.metadata.description` | `description` | Already read during index generation |
| `nx.metadata.category` | `category` | Already read during index generation |

### 5.3 New fields — default values during migration

| Field | Default | Rationale |
|-------|---------|-----------|
| `$schema` | `"https://solidiom.dev/schemas/registry-manifest/v2.json"` | Fixed URI |
| `status` | `'preview'` | All current entries are pre-1.0 |
| `deliverables.primitive` | `true` | All entries are primitives |
| `deliverables.component` | `undefined` | No component layer exists yet |
| `deliverables.block` | `undefined` | No block layer exists yet |
| `deliverables.template` | `undefined` | No template layer exists yet |
| `deliverables.theme` | `undefined` | No theme layer exists yet |
| `cli.addCommand` | `"solidiom add <name>"` | Derived from entry name |
| `cli.installDeps` | Dependencies from `capabilities[].default` | Adapter packages |
| `accessibility.reviewStatus` | `'none'` | No evidence exists yet |
| `accessibility.evidenceIds` | `[]` | Empty until reviews run |
| `documentation.status` | `'stub'` if no `docs/` dir, else `'draft'` | Heuristic |
| `documentation.locales` | `{ "en": { status: "stub" } }` | English only |
| `styling.outputs` | `[]` | No styling outputs configured yet |
| `styling.themeCompatible` | `[]` | No theme presets exist yet |
| `search.keywords` | Derived from `label + description + category` | Tokenized, lowercased, deduplicated |
| `integrity.filesHash` | SHA-256 of sorted source file contents | Computed at build time |
| `integrity.manifestSignature` | `undefined` | Optional; populated by CI signing step |
| `integrity.lastGenerated` | Current ISO timestamp | Generation time |
| `lastUpdated` | Current ISO timestamp | Set to generation time during initial migration; future builds preserve if files unchanged |

### 5.4 Index-level migration

| Change | Details |
|--------|---------|
| `version` | `1` → `2` |
| `$schema` | Added: `"https://solidiom.dev/schemas/registry-index/v2.json"` |
| `integrity` | Added: `{ entriesHash, signature? }` |
| `primitives[].label` | Now required (was optional in v1) |
| `primitives[].description` | Now required (was optional in v1) |
| `primitives[].category` | Now required (was optional in v1) |
| `primitives[].status` | Added |
| `primitives[].deliverables` | Added as string array |
| `primitives[].hasAccessibilityEvidence` | Added (false during migration) |
| `primitives[].documentationStatus` | Added |
| `adapters[].version` | Added: read from adapter package.json |

---

## 6. Validation Rules

These constraints are enforced by `registry-build.ts` at generation time and by CI on every PR.

### 6.1 Required field constraints

- Every entry **must** have non-empty: `name`, `version`, `package`, `label`, `description`, `category`.
- `status` **must** be one of: `experimental`, `preview`, `stable`, `deprecated`.
- `deliverables.primitive` **must** be `true` for all entries tagged `layer:primitive`.

### 6.2 Integrity constraints

- `integrity.filesHash` must match a freshly recomputed value (deterministic: sorted file paths, SHA-256 of each file content, final hash of concatenated hashes).
- If `integrity.manifestSignature` is present, it must verify against the project's public key.
- `integrity.entriesHash` in `index.json` must equal the SHA-256 of all per-entry `filesHash` values sorted alphabetically by entry name.

### 6.3 Routing constraint

- A new registry entry **must** produce exactly one valid documentation route (`/primitives/<name>`) or fail CI. This ensures no phantom entries exist in the catalog.

### 6.4 Adapter constraints

- Every adapter must reference a valid capability string matching `<name>@<version>`.
- Adapter `version` must be a valid semver string.

---

## 7. filesHash Algorithm

To ensure determinism across platforms:

```
1. List all files in source.files, sorted lexicographically.
2. For each file, compute SHA-256 of its raw content (UTF-8, no BOM normalization).
3. Concatenate hex-encoded hashes as a single string (no separator).
4. Compute SHA-256 of the concatenated string.
5. Output the final hex-encoded hash as filesHash.
```

The `entriesHash` in `index.json` follows the same pattern over per-entry `filesHash` values
(sorted by entry name).

---

## 8. Implementation Notes

| Concern | Detail |
|---------|--------|
| **Code location** | All changes to `tools/registry-build.ts` |
| **Task boundary** | REG-002 implements the code; this document is the design |
| **Backward compat** | Existing consumers read known fields; unknown fields are ignored per JSON convention |
| **Output files** | `registry/<name>.json` (per-entry) and `registry/index.json` (catalog) |
| **Schema files** | Publish JSON Schema at `$schema` URIs for external validation |
| **CI integration** | `registry-build` runs in CI; validation failures block merge |
| **Signing** | `integrity.manifestSignature` / `integrity.signature` populated by an optional post-build signing step (out of scope for REG-002) |

---

## 9. Example: Migrated Entry (dialog)

```json
{
  "$schema": "https://solidiom.dev/schemas/registry-manifest/v2.json",
  "name": "dialog",
  "version": "0.0.1-next.0",
  "package": "@solidiom/dialog",
  "capabilities": [
    { "name": "positioning", "version": 1, "default": "@solidiom/adapter-positioning-floating-ui" }
  ],
  "dependencies": ["@solidiom/runtime"],
  "source": {
    "entry": "src/index.tsx",
    "files": ["src/index.tsx", "src/dialog.tsx", "src/dialog-content.tsx"]
  },
  "runtime": ["overlay/dismissable-layer", "overlay/focus-scope", "overlay/layer-stack", "presence/presence"],
  "label": "Dialog",
  "description": "Modal or non-modal overlay window.",
  "category": "overlay",
  "status": "preview",
  "deliverables": {
    "primitive": true
  },
  "cli": {
    "addCommand": "solidiom add dialog",
    "installDeps": ["@solidiom/adapter-positioning-floating-ui"]
  },
  "accessibility": {
    "reviewStatus": "none",
    "evidenceIds": []
  },
  "documentation": {
    "status": "stub",
    "locales": {
      "en": { "status": "stub" }
    }
  },
  "styling": {
    "outputs": [],
    "themeCompatible": []
  },
  "search": {
    "keywords": ["dialog", "modal", "non-modal", "overlay", "window"]
  },
  "integrity": {
    "filesHash": "a1b2c3d4e5f6...",
    "lastGenerated": "2026-07-27T00:00:00.000Z"
  },
  "lastUpdated": "2026-07-27T00:00:00.000Z"
}
```

---

## 10. Open Questions

| # | Question | Resolution |
|---|----------|------------|
| 1 | Should `search.keywords` be manually curated or fully automated? | Start automated; allow manual override via `nx.metadata.keywords`. |
| 2 | When does `lastUpdated` get a real value vs generation timestamp? | After initial migration, compare `filesHash` to previous build. If unchanged, preserve previous `lastUpdated`. |
| 3 | Should adapter entries get the full v2 treatment? | Deferred to REG-003. Adapters keep minimal schema for now. |
