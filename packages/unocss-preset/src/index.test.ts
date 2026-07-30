import { describe, expect, it } from "vitest"
import { getSolidiomVariantRules, getSolidiomVariants, presetSolidiom } from "./index"

describe("getSolidiomVariants", () => {
  const variants = getSolidiomVariants()

  it("generates a flag variant for every semantic flag", () => {
    expect(variants.some((v) => v.name === "uiDisabled" && v.selector === "[data-disabled]")).toBe(
      true,
    )
    expect(variants.some((v) => v.name === "uiLoading")).toBe(true)
  })

  it("namespaces a state that collides with a flag name", () => {
    // "selected" is both a state (date-picker, data-table, tree) and a flag.
    expect(variants.some((v) => v.name === "uiStateSelected")).toBe(true)
  })

  it("respects a custom prefix", () => {
    const custom = getSolidiomVariants({ prefix: "sol" })
    expect(custom.some((v) => v.name === "solDisabled")).toBe(true)
    expect(custom.some((v) => v.name.startsWith("ui"))).toBe(false)
  })
})

describe("getSolidiomVariantRules", () => {
  const rules = getSolidiomVariantRules()

  it("includes a rule for every button and badge variant class", () => {
    const names = rules.map(([name]) => name)
    expect(names).toContain("solidiom-btn--destructive")
    expect(names).toContain("solidiom-badge--secondary")
  })

  it("includes a rule for a compound variant class", () => {
    const names = rules.map(([name]) => name)
    expect(names).toContain("solidiom-btn--ghost-icon")
    expect(names).toContain("solidiom-btn--link-md")
  })

  it("resolves token declarations through the unocss namespace (var(--ui-*, fallback))", () => {
    const [, declarations] = rules.find(([name]) => name === "solidiom-btn--destructive")!
    expect(declarations["background-color"]).toBe("var(--ui-destructive, hsl(0 84% 60%))")
  })

  it("has no duplicate class names", () => {
    const names = rules.map(([name]) => name)
    expect(new Set(names).size).toBe(names.length)
  })
})

describe("presetSolidiom", () => {
  it("returns a preset object with variants and generated rules", () => {
    const preset = presetSolidiom()
    expect(preset.name).toBe("@solidiom/unocss-preset")
    expect(Array.isArray(preset.variants)).toBe(true)
    expect(preset.variants.length).toBeGreaterThan(0)
    expect(preset.rules).toBe(getSolidiomVariantRules())
  })

  it("a variant's match function only activates for its own prefix", () => {
    const preset = presetSolidiom()
    const disabled = preset.variants.find((v) => v.name === "uiDisabled")!
    expect(disabled.match("uiDisabled:opacity-50")).toEqual({
      matcher: "opacity-50",
      selector: expect.any(Function),
    })
    expect(disabled.match("uiLoading:opacity-70")).toBeUndefined()
  })
})
