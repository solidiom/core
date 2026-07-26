import { describe, it, expect } from "vitest"
import { applySemanticAttrs } from "@solidiom/runtime"
import { useTabsContext } from "./tabs-context"

describe("Tabs", () => {
  it("emits correct semantic attributes for root", () => {
    const attrs = applySemanticAttrs({ scope: "tabs", part: "root", orientation: "horizontal" })
    expect(attrs["data-scope"]).toBe("tabs")
    expect(attrs["data-part"]).toBe("root")
    expect(attrs["data-orientation"]).toBe("horizontal")
  })

  it("emits correct semantic attributes for trigger with state", () => {
    const active = applySemanticAttrs({ scope: "tabs", part: "trigger", state: "active" })
    expect(active["data-scope"]).toBe("tabs")
    expect(active["data-part"]).toBe("trigger")
    expect(active["data-state"]).toBe("active")

    const inactive = applySemanticAttrs({
      scope: "tabs",
      part: "trigger",
      state: "inactive",
      disabled: true,
    })
    expect(inactive["data-state"]).toBe("inactive")
    expect(inactive["data-disabled"]).toBe("")
  })

  it("throws when useTabsContext is called outside a reactive root", () => {
    expect(() => useTabsContext()).toThrow()
  })
})
