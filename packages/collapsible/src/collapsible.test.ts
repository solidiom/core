import { describe, it, expect } from "vitest"
import { applySemanticAttrs } from "@solidiom/runtime"

describe("Collapsible", () => {
  it("emits correct semantic attributes for root", () => {
    const attrs = applySemanticAttrs({ scope: "collapsible", part: "root" })
    expect(attrs["data-scope"]).toBe("collapsible")
    expect(attrs["data-part"]).toBe("root")
  })

  it("emits correct semantic attributes for each part", () => {
    const parts = ["root", "trigger", "content"] as const
    for (const part of parts) {
      const attrs = applySemanticAttrs({ scope: "collapsible", part })
      expect(attrs["data-scope"]).toBe("collapsible")
      expect(attrs["data-part"]).toBe(part)
    }
  })

  it("emits state and disabled flags correctly", () => {
    const openAttrs = applySemanticAttrs({
      scope: "collapsible",
      part: "root",
      state: "open",
      disabled: false,
    })
    expect(openAttrs["data-state"]).toBe("open")
    expect(openAttrs["data-disabled"]).toBeUndefined()

    const closedAttrs = applySemanticAttrs({
      scope: "collapsible",
      part: "trigger",
      state: "closed",
      disabled: true,
    })
    expect(closedAttrs["data-state"]).toBe("closed")
    expect(closedAttrs["data-disabled"]).toBe("")
  })
})
