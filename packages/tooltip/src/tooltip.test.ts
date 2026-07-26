import { describe, it, expect } from "vitest"
import { applySemanticAttrs } from "@solidiom/runtime"
import { useTooltipContext } from "./tooltip-context"

describe("Tooltip", () => {
  it("emits correct semantic attributes for trigger", () => {
    const attrs = applySemanticAttrs({
      scope: "tooltip",
      part: "trigger",
      state: "closed",
    })
    expect(attrs["data-scope"]).toBe("tooltip")
    expect(attrs["data-part"]).toBe("trigger")
    expect(attrs["data-state"]).toBe("closed")
  })

  it("emits correct semantic attributes for content open/closed", () => {
    const open = applySemanticAttrs({ scope: "tooltip", part: "content", state: "open" })
    expect(open["data-scope"]).toBe("tooltip")
    expect(open["data-part"]).toBe("content")
    expect(open["data-state"]).toBe("open")

    const closed = applySemanticAttrs({ scope: "tooltip", part: "content", state: "closed" })
    expect(closed["data-state"]).toBe("closed")
  })

  it("throws when useTooltipContext is called outside a reactive root", () => {
    expect(() => useTooltipContext()).toThrow()
  })
})
