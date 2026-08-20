/**
 * tools/theme-contract-migrate — versioned migration for stored/shared theme documents.
 *
 * THEME-001d. `recipe-contract-schema.ts` states a migration "can be written as a data
 * transform" because definitions are JSON-representable, but no migration function
 * exists anywhere in this repo yet (the former `tools/phase2-gate.ts` explicitly descoped it as
 * "no migration source exists"). This is that first implementation, and it is written
 * for THEME-001's actual consumers:
 *
 *   - BUILDER-005's URL-encoded share links, which persist a theme document indefinitely
 *     — a link created against schema version 1 must still open after version 2 ships.
 *   - BUILDER-004's JSON export/import, which round-trips a file a user may keep for a
 *     long time before re-importing it.
 *   - A future CLI `theme add`/`theme update` flow (CLI-004) installing a theme whose
 *     JSON predates the running schema version.
 *
 * DESIGN
 *
 * Each migration is a pure function from one schema version to the next (`N` → `N+1`).
 * `migrateThemeDocument` walks the chain from the document's declared version up to
 * `THEME_SCHEMA_VERSION`, applying each step in order. There is currently exactly one
 * version, so `MIGRATIONS` is empty and the chain is a no-op identity check — this file
 * exists so the *pattern* is established before a second version is needed, not because
 * a migration is due today.
 *
 * A migration step receives and returns `unknown`, not `ThemeDefinition`, because a
 * document produced by an older schema version is by definition not a well-formed
 * `ThemeDefinition` of the *current* shape — that is precisely what makes it need
 * migrating. Each step is responsible for producing a document that the *next* step (or
 * the final validator) can consume.
 */
import { THEME_SCHEMA_VERSION, type ThemeDefinition } from "./theme-contract-schema"

/** A single version-to-version data transform. `from` is the version it accepts. */
export interface ThemeMigrationStep {
  from: number
  to: number
  migrate: (document: unknown) => unknown
}

/**
 * Registered migrations, ordered by `from`. Empty today — `THEME_SCHEMA_VERSION` is 1
 * and no prior version ever shipped. Add a step here, and bump `THEME_SCHEMA_VERSION`
 * in theme-contract-schema.ts in the same change, whenever a shape change would break
 * an already-persisted theme document.
 */
export const MIGRATIONS: readonly ThemeMigrationStep[] = []

export class UnmigratableThemeDocumentError extends Error {
  constructor(
    public readonly documentVersion: number,
    public readonly targetVersion: number,
  ) {
    super(
      `no migration path from schemaVersion ${documentVersion} to ${targetVersion} — ` +
        `either the document is newer than this build understands, or a migration step is missing`,
    )
    this.name = "UnmigratableThemeDocumentError"
  }
}

function readSchemaVersion(document: unknown): number {
  if (
    typeof document === "object" &&
    document !== null &&
    "schemaVersion" in document &&
    typeof (document as { schemaVersion: unknown }).schemaVersion === "number"
  ) {
    return (document as { schemaVersion: number }).schemaVersion
  }
  throw new Error("document has no numeric schemaVersion field — cannot determine migration path")
}

/**
 * Migrates an arbitrary stored/shared document up to `THEME_SCHEMA_VERSION`.
 *
 * Returns the document unchanged (only re-typed) when it is already current. Throws
 * `UnmigratableThemeDocumentError` when:
 *   - the document's version is *newer* than this build's `THEME_SCHEMA_VERSION`
 *     (an older client opened a link/file created by a newer one), or
 *   - the version is older but no registered step starts at it (a gap in the chain).
 *
 * This does not validate the result — callers must still run
 * `validateThemeDefinition()` on the returned document, matching the recipe contract's
 * separation between migration (shape) and validation (rules).
 */
export function migrateThemeDocument(document: unknown): ThemeDefinition {
  let version = readSchemaVersion(document)
  let current = document

  if (version > THEME_SCHEMA_VERSION) {
    throw new UnmigratableThemeDocumentError(version, THEME_SCHEMA_VERSION)
  }

  while (version < THEME_SCHEMA_VERSION) {
    const step = MIGRATIONS.find((candidate) => candidate.from === version)
    if (!step) {
      throw new UnmigratableThemeDocumentError(version, THEME_SCHEMA_VERSION)
    }
    current = step.migrate(current)
    version = step.to
  }

  return current as ThemeDefinition
}

/** True when a document's declared version can reach `THEME_SCHEMA_VERSION` via registered steps. */
export function isMigratable(document: unknown): boolean {
  try {
    migrateThemeDocument(document)
    return true
  } catch {
    return false
  }
}
