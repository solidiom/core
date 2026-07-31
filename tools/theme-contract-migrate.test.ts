import { describe, expect, it } from "vitest"
import {
  MIGRATIONS,
  UnmigratableThemeDocumentError,
  isMigratable,
  migrateThemeDocument,
} from "./theme-contract-migrate"
import { THEME_SCHEMA_VERSION } from "./theme-contract-schema"
import { SOLIDIOM_DEFAULT_THEME } from "./theme-contract-definitions"

describe("MIGRATIONS", () => {
  it("is empty because only one schema version has ever shipped", () => {
    // This assertion is meant to fail loudly the day a second version ships without a
    // registered step: bump THEME_SCHEMA_VERSION and add a ThemeMigrationStep together.
    expect(MIGRATIONS).toEqual([])
  })
})

describe("migrateThemeDocument", () => {
  it("passes a current-version document through unchanged", () => {
    expect(migrateThemeDocument(SOLIDIOM_DEFAULT_THEME)).toEqual(SOLIDIOM_DEFAULT_THEME)
  })

  it("throws when the document has no numeric schemaVersion", () => {
    expect(() => migrateThemeDocument({})).toThrow(/schemaVersion/)
    expect(() => migrateThemeDocument({ schemaVersion: "1" })).toThrow(/schemaVersion/)
  })

  it("throws UnmigratableThemeDocumentError when the document is newer than this build", () => {
    const fromTheFuture = { ...SOLIDIOM_DEFAULT_THEME, schemaVersion: THEME_SCHEMA_VERSION + 1 }
    expect(() => migrateThemeDocument(fromTheFuture)).toThrow(UnmigratableThemeDocumentError)
  })

  it("throws UnmigratableThemeDocumentError when no registered step bridges an older version", () => {
    const fromThePast = { ...SOLIDIOM_DEFAULT_THEME, schemaVersion: 0 }
    expect(() => migrateThemeDocument(fromThePast)).toThrow(UnmigratableThemeDocumentError)
  })

  it("reports both versions on the error for diagnostics", () => {
    try {
      migrateThemeDocument({ ...SOLIDIOM_DEFAULT_THEME, schemaVersion: 0 })
      expect.fail("expected a throw")
    } catch (error) {
      expect(error).toBeInstanceOf(UnmigratableThemeDocumentError)
      expect((error as UnmigratableThemeDocumentError).documentVersion).toBe(0)
      expect((error as UnmigratableThemeDocumentError).targetVersion).toBe(THEME_SCHEMA_VERSION)
    }
  })
})

describe("isMigratable", () => {
  it("is true for a current-version document", () => {
    expect(isMigratable(SOLIDIOM_DEFAULT_THEME)).toBe(true)
  })

  it("is false for a document with no migration path", () => {
    expect(isMigratable({ ...SOLIDIOM_DEFAULT_THEME, schemaVersion: 0 })).toBe(false)
    expect(
      isMigratable({ ...SOLIDIOM_DEFAULT_THEME, schemaVersion: THEME_SCHEMA_VERSION + 1 }),
    ).toBe(false)
  })
})
