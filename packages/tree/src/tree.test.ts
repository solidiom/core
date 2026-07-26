import { describe, it, expect } from "vitest"
import { applySemanticAttrs } from "@solidiom/runtime"
import { useTreeContext } from "./tree-context"

describe("Tree", () => {
  it("emits correct semantic attributes for root and item", () => {
    const root = applySemanticAttrs({ scope: "tree", part: "root" })
    expect(root["data-scope"]).toBe("tree")
    expect(root["data-part"]).toBe("root")

    const item = applySemanticAttrs({
      scope: "tree",
      part: "item",
      state: "selected",
      disabled: true,
    })
    expect(item["data-scope"]).toBe("tree")
    expect(item["data-part"]).toBe("item")
    expect(item["data-state"]).toBe("selected")
    expect(item["data-disabled"]).toBe("")
  })

  it("emits correct semantic attributes for branch and item-indicator", () => {
    const branch = applySemanticAttrs({ scope: "tree", part: "branch" })
    expect(branch["data-scope"]).toBe("tree")
    expect(branch["data-part"]).toBe("branch")
    expect(branch["data-state"]).toBeUndefined()

    const indicator = applySemanticAttrs({
      scope: "tree",
      part: "item-indicator",
      state: "open",
    })
    expect(indicator["data-part"]).toBe("item-indicator")
    expect(indicator["data-state"]).toBe("open")
  })

  it("throws when useTreeContext is called outside a reactive root", () => {
    expect(() => useTreeContext()).toThrow()
  })
})
