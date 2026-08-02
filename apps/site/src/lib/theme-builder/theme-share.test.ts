import { describe, expect, it } from "vitest"
import { SOLIDIOM_DEFAULT_THEME } from "../../../../../tools/theme-contract-definitions"
import { decodeTheme, encodeTheme, hashToTheme, themeToHash } from "./theme-share"

describe("encode/decode roundtrip", () => {
  it("preserves theme through encode/decode", () => {
    const encoded = encodeTheme(SOLIDIOM_DEFAULT_THEME)
    const result = decodeTheme(encoded)
    expect(result.error).toBeUndefined()
    expect(result.theme).toEqual(SOLIDIOM_DEFAULT_THEME)
  })

  it("produces a string without standard base64 padding issues", () => {
    const encoded = encodeTheme(SOLIDIOM_DEFAULT_THEME)
    expect(typeof encoded).toBe("string")
    expect(encoded.length).toBeGreaterThan(0)
    expect(encoded).not.toContain("=")
    expect(encoded).not.toContain("+")
    expect(encoded).not.toContain("/")
  })
})

describe("decodeTheme error handling", () => {
  it("returns error for empty input", () => {
    const result = decodeTheme("")
    expect(result.error).toBeDefined()
  })

  it("returns error for malformed base64", () => {
    const result = decodeTheme("not-valid-base64!!!")
    expect(result.error).toBeDefined()
  })

  it("returns error for non-JSON payload", () => {
    const encoded = btoa("this is not json").replace(/\+/g, "-").replace(/\//g, "_")
    const result = decodeTheme(encoded)
    expect(result.error).toBeDefined()
  })

  it("returns error for payload missing version", () => {
    const json = JSON.stringify({ t: SOLIDIOM_DEFAULT_THEME })
    const encoded = btoa(json).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
    const result = decodeTheme(encoded)
    expect(result.error).toBeDefined()
  })

  it("returns error for unsupported version", () => {
    const json = JSON.stringify({ v: 99, t: SOLIDIOM_DEFAULT_THEME })
    const encoded = btoa(json).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
    const result = decodeTheme(encoded)
    expect(result.error).toBeDefined()
    expect(result.error).toContain("unsupported version")
  })

  it("returns error for invalid theme validation", () => {
    const invalidTheme = {
      schemaVersion: 1,
      meta: { name: "Test", slug: "test", description: "x", kind: "custom" },
      modes: { light: {}, dark: {} },
    }
    const json = JSON.stringify({ v: 1, t: invalidTheme })
    const encoded = btoa(json).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
    const result = decodeTheme(encoded)
    expect(result.error).toBeDefined()
    expect(result.theme).toBeUndefined()
  })
})

describe("hashToTheme", () => {
  it("roundtrips through themeToHash and hashToTheme", () => {
    const hash = themeToHash(SOLIDIOM_DEFAULT_THEME)
    expect(typeof hash).toBe("string")
    expect(hash).toContain("#t=")

    const result = hashToTheme(hash)
    expect(result.error).toBeUndefined()
    expect(result.theme).toEqual(SOLIDIOM_DEFAULT_THEME)
  })

  it("handles hash without leading #", () => {
    const hash = themeToHash(SOLIDIOM_DEFAULT_THEME)
    const withoutHash = hash.slice(1)
    const result = hashToTheme(withoutHash)
    expect(result.error).toBeUndefined()
    expect(result.theme).toEqual(SOLIDIOM_DEFAULT_THEME)
  })

  it("returns empty object for empty hash", () => {
    const result = hashToTheme("")
    expect(result).toEqual({})
  })

  it("returns empty object for hash without t= prefix", () => {
    const result = hashToTheme("#something-else")
    expect(result).toEqual({})
  })
})

describe("themeToHash", () => {
  it("produces a hash starting with #t=", () => {
    const hash = themeToHash(SOLIDIOM_DEFAULT_THEME)
    expect(hash.startsWith("#t=")).toBe(true)
  })
})
