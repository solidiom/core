import { describe, it, expect } from "vitest"
import { applySemanticAttrs } from "@solidiom/runtime"

describe("Combobox", () => {
  it("emits correct semantic attributes for root", () => {
    const attrs = applySemanticAttrs({ scope: "combobox", part: "root" })
    expect(attrs["data-scope"]).toBe("combobox")
    expect(attrs["data-part"]).toBe("root")
  })

  it("emits correct semantic attributes for all parts", () => {
    const parts = ["root", "input", "content", "item", "item-text"] as const
    for (const part of parts) {
      const attrs = applySemanticAttrs({ scope: "combobox", part })
      expect(attrs["data-scope"]).toBe("combobox")
      expect(attrs["data-part"]).toBe(part)
    }
  })

  it("emits highlighted and selected flags for item", () => {
    const attrs = applySemanticAttrs({
      scope: "combobox",
      part: "item",
      state: "checked",
      highlighted: true,
      selected: true,
      disabled: false,
    })
    expect(attrs["data-state"]).toBe("checked")
    expect(attrs["data-highlighted"]).toBe("")
    expect(attrs["data-selected"]).toBe("")
    expect(attrs["data-disabled"]).toBeUndefined()
  })
})
