import { describe, expect, it } from "vitest"
import { violationReason } from "./audit-recipe-contract"

describe("recipe selector contract", () => {
  it("permits scope and part attribute selectors", () => {
    expect(violationReason('[data-scope="button"][data-part="root"] {')).toBeUndefined()
  })

  it("permits vocabulary state, flag, side, and size attributes", () => {
    expect(violationReason('[data-scope="switch"][data-state="on"] {')).toBeUndefined()
    expect(violationReason('[data-scope="button"][data-disabled] {')).toBeUndefined()
    expect(violationReason('[data-scope="sheet"][data-side="right"] {')).toBeUndefined()
    expect(violationReason('[data-scope="prose"][data-size="lg"] {')).toBeUndefined()
  })

  it("permits element descendant selectors used by composite scopes", () => {
    expect(violationReason('[data-scope="prose"] h1 {')).toBeUndefined()
  })

  it("rejects a raw class selector", () => {
    expect(violationReason(".solidiom-btn--destructive {")).toContain("Class selector")
  })

  it("rejects an ID selector", () => {
    expect(violationReason("#app {")).toContain("ID selector")
  })

  it("rejects an attribute outside the semantic vocabulary", () => {
    // `data-value` was permitted by the previous hand-maintained list even though
    // applySemanticAttrs cannot emit it.
    expect(violationReason('[data-scope="select"][data-value="a"] {')).toContain(
      "outside the semantic vocabulary",
    )
    expect(violationReason("[data-theme] {")).toContain("outside the semantic vocabulary")
  })

  it("ignores declarations, comments, and blank lines", () => {
    expect(violationReason("  color: var(--ui-fg, hsl(0 0% 0%));")).toBeUndefined()
    expect(violationReason("/* @solidiom/recipes-css — Button */")).toBeUndefined()
    expect(violationReason("")).toBeUndefined()
  })
})
