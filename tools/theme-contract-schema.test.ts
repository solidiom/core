import { describe, expect, it } from "vitest"
import {
  THEME_MODES,
  THEME_SCHEMA_VERSION,
  allDeclaredTokens,
  categoryOf,
  isTokenReference,
  resolveTokenValue,
  tokensInMode,
  type ThemeDefinition,
} from "./theme-contract-schema"

function fixture(overrides: Partial<ThemeDefinition["modes"]> = {}): ThemeDefinition {
  return {
    schemaVersion: THEME_SCHEMA_VERSION,
    meta: { name: "Fixture", slug: "fixture", description: "A fixture theme.", kind: "custom" },
    modes: {
      light: { primary: "#111111", "primary-hover": { ref: "primary" } },
      dark: { primary: "#eeeeee" },
      ...overrides,
    },
  }
}

describe("THEME_MODES", () => {
  it("is exactly light and dark", () => {
    expect(THEME_MODES).toEqual(["light", "dark"])
  })
})

describe("tokensInMode / allDeclaredTokens", () => {
  it("lists a mode's declared identities, sorted", () => {
    expect(tokensInMode(fixture(), "light")).toEqual(["primary", "primary-hover"])
    expect(tokensInMode(fixture(), "dark")).toEqual(["primary"])
  })

  it("returns an empty array for a mode with no declarations", () => {
    expect(tokensInMode(fixture({ dark: {} }), "dark")).toEqual([])
  })

  it("unions and deduplicates identities across both modes", () => {
    expect(allDeclaredTokens(fixture())).toEqual(["primary", "primary-hover"])
  })
})

describe("resolveTokenValue", () => {
  it("returns a literal value directly", () => {
    expect(resolveTokenValue(fixture(), "light", "primary")).toBe("#111111")
  })

  it("follows a reference to its literal value in the same mode", () => {
    expect(resolveTokenValue(fixture(), "light", "primary-hover")).toBe("#111111")
  })

  it("returns undefined for an undeclared token", () => {
    expect(resolveTokenValue(fixture(), "dark", "primary-hover")).toBeUndefined()
  })

  it("throws on a reference cycle instead of recursing forever", () => {
    const cyclic = fixture({
      light: { a: { ref: "b" }, b: { ref: "a" } },
    })
    expect(() => resolveTokenValue(cyclic, "light", "a")).toThrow(/reference cycle/)
  })
})

describe("isTokenReference", () => {
  it("distinguishes a literal from a reference", () => {
    expect(isTokenReference("#111111")).toBe(false)
    expect(isTokenReference({ ref: "primary" })).toBe(true)
  })
})

describe("categoryOf", () => {
  it("resolves the canonical category for a known identity", () => {
    expect(categoryOf("primary")).toBe("intent")
    expect(categoryOf("radius-sm")).toBe("radius")
  })

  it("returns undefined for an identity outside the canonical set", () => {
    expect(categoryOf("not-a-real-token")).toBeUndefined()
  })
})
