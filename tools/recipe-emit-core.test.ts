import { describe, expect, it } from "vitest"
import { CONTRACT_VERSION, type RecipeDefinition } from "./recipe-contract-schema"
import { buildSelector, resolveRules, resolveValue, UnmappedTokenError } from "./recipe-emit-core"

describe("resolveValue", () => {
  it("passes through a literal string unchanged", () => {
    expect(resolveValue("2.5rem", "css", "test")).toBe("2.5rem")
  })

  it("spells a css token as var(--custom-property, fallback) using the token's recorded fallback", () => {
    expect(resolveValue({ token: "primary" }, "css", "test")).toBe(
      "var(--ui-primary, hsl(222 47% 11%))",
    )
  })

  it("spells a tailwind token as its theme name, not a var()", () => {
    expect(resolveValue({ token: "primary" }, "tailwind", "test")).toBe("primary")
  })

  it("spells a unocss token the same way as css (shared --ui-* namespace)", () => {
    expect(resolveValue({ token: "primary" }, "unocss", "test")).toBe(
      "var(--ui-primary, hsl(222 47% 11%))",
    )
  })

  it("uses an explicit declaration fallback over the token's own recorded fallback", () => {
    expect(resolveValue({ token: "primary", fallback: "red" }, "css", "test")).toBe(
      "var(--ui-primary, red)",
    )
  })

  it("throws UnmappedTokenError for a namespace with no spelling and no fallback", () => {
    expect(() => resolveValue({ token: "surface-sunken" }, "css", "test")).toThrow(
      UnmappedTokenError,
    )
  })

  it("falls back rather than throwing when the declaration supplies one and the namespace has no spelling", () => {
    expect(resolveValue({ token: "surface-sunken", fallback: "#eee" }, "css", "test")).toBe("#eee")
  })

  it("emits a bare var() with no fallback when a token has a spelling but no recorded default", () => {
    expect(resolveValue({ token: "border-active" }, "site", "test")).toBe("--sol-border-active")
  })
})

const SWITCH_LIKE: RecipeDefinition = {
  contractVersion: CONTRACT_VERSION,
  scope: "switch",
  description: "test fixture",
  slots: [
    {
      part: "root",
      element: "button",
      ownership: "recipe",
      base: { display: "inline-flex" },
      states: { on: { "background-color": { token: "primary" } } },
      flags: { disabled: { opacity: "0.5" } },
      pseudos: { ":focus-visible": { outline: "2px solid" } },
    },
  ],
  variants: [
    {
      name: "size",
      values: {
        sm: { root: { height: "1rem" } },
        lg: { root: { height: "2rem" } },
      },
    },
  ],
  defaultVariants: { size: "sm" },
  compoundVariants: [
    {
      when: { size: "lg" },
      declarations: { root: { width: "3rem" } },
    },
  ],
}

describe("resolveRules — cascade order", () => {
  const rules = resolveRules(SWITCH_LIKE, "css")

  it("emits base, then states, then flags, then pseudos, then variants, then compounds — in that order", () => {
    expect(rules.map((rule) => rule.condition.kind)).toEqual([
      "base",
      "state",
      "flag",
      "pseudo",
      "variant",
      "variant",
      "compound",
    ])
  })

  it("preserves variant value declaration order within an axis", () => {
    const variantRules = rules.filter((rule) => rule.condition.kind === "variant")
    expect(variantRules.map((rule) => (rule.condition as { value: string }).value)).toEqual([
      "sm",
      "lg",
    ])
  })

  it("resolves state and flag declarations with the requested namespace", () => {
    const stateRule = rules.find((rule) => rule.condition.kind === "state")!
    expect(stateRule.declarations["background-color"]).toBe("var(--ui-primary, hsl(222 47% 11%))")
  })
})

describe("resolveRules — compound variants come after single-axis variants", () => {
  it("places every compoundVariants entry after all variants entries, matching declaration order", () => {
    const rules = resolveRules(SWITCH_LIKE, "css")
    const lastVariantIndex = rules.findLastIndex((rule) => rule.condition.kind === "variant")
    const firstCompoundIndex = rules.findIndex((rule) => rule.condition.kind === "compound")
    expect(firstCompoundIndex).toBeGreaterThan(lastVariantIndex)
  })
})

describe("buildSelector", () => {
  it("builds a base selector with no ancestor combinator", () => {
    const rules = resolveRules(SWITCH_LIKE, "css")
    const base = rules.find((rule) => rule.condition.kind === "base")!
    expect(buildSelector("switch", base)).toBe('[data-scope="switch"][data-part="root"]')
  })

  it("qualifies a state selector with data-state", () => {
    const rules = resolveRules(SWITCH_LIKE, "css")
    const state = rules.find((rule) => rule.condition.kind === "state")!
    expect(buildSelector("switch", state)).toBe(
      '[data-scope="switch"][data-part="root"][data-state="on"]',
    )
  })

  it("appends a data-qualified variant class when a prefix is given", () => {
    const rules = resolveRules(SWITCH_LIKE, "css")
    const variant = rules.find((rule) => rule.condition.kind === "variant")!
    expect(buildSelector("switch", variant, { variantClassPrefix: "solidiom-switch" })).toBe(
      '[data-scope="switch"][data-part="root"].solidiom-switch--sm',
    )
  })

  it("qualifies a compound selector with one dedicated class, not two combined classes", () => {
    const rules = resolveRules(SWITCH_LIKE, "css")
    const compound = rules.find((rule) => rule.condition.kind === "compound")!
    expect(buildSelector("switch", compound, { variantClassPrefix: "solidiom-switch" })).toBe(
      '[data-scope="switch"][data-part="root"].solidiom-switch--lg',
    )
  })

  it("rejects a part name containing selector characters", () => {
    const badRule = {
      part: "root .child",
      condition: { kind: "base" as const },
      declarations: {},
    }
    expect(() => buildSelector("switch", badRule)).toThrow()
  })
})
