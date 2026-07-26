import { describe, it, expect } from "vitest"
import { applySemanticAttrs } from "./semantic-attrs"

describe("applySemanticAttrs", () => {
  it("returns scope and part", () => {
    const attrs = applySemanticAttrs({ scope: "dialog", part: "content" })
    expect(attrs["data-scope"]).toBe("dialog")
    expect(attrs["data-part"]).toBe("content")
  })

  it("includes state when provided", () => {
    const attrs = applySemanticAttrs({ scope: "select", part: "trigger", state: "open" })
    expect(attrs["data-state"]).toBe("open")
  })

  it("omits state when undefined", () => {
    const attrs = applySemanticAttrs({ scope: "dialog", part: "close" })
    expect("data-state" in attrs).toBe(false)
  })

  it("sets boolean flags as empty string", () => {
    const attrs = applySemanticAttrs({
      scope: "checkbox",
      part: "indicator",
      disabled: true,
      selected: true,
    })
    expect(attrs["data-disabled"]).toBe("")
    expect(attrs["data-selected"]).toBe("")
  })

  it("omits false boolean flags", () => {
    const attrs = applySemanticAttrs({
      scope: "dialog",
      part: "content",
      disabled: false,
      invalid: false,
    })
    expect("data-disabled" in attrs).toBe(false)
    expect("data-invalid" in attrs).toBe(false)
  })

  it("includes orientation when provided", () => {
    const attrs = applySemanticAttrs({ scope: "tabs", part: "group", orientation: "horizontal" })
    expect(attrs["data-orientation"]).toBe("horizontal")
  })

  it("handles all flags together", () => {
    const attrs = applySemanticAttrs({
      scope: "field",
      part: "input",
      state: "invalid",
      disabled: true,
      required: true,
      invalid: true,
      readonly: false,
      placeholder: true,
    })
    expect(attrs["data-scope"]).toBe("field")
    expect(attrs["data-state"]).toBe("invalid")
    expect(attrs["data-disabled"]).toBe("")
    expect(attrs["data-required"]).toBe("")
    expect(attrs["data-invalid"]).toBe("")
    expect(attrs["data-placeholder"]).toBe("")
    expect("data-readonly" in attrs).toBe(false)
  })
})
