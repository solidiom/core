import { describe, it, expect } from "vitest"
import { applySemanticAttrs } from "@solidiom/runtime"
import { usePanelGroupContext } from "./panels-context"

describe("ResizablePanels", () => {
  it("emits correct semantic attributes for panel-group, panel, and handle", () => {
    const group = applySemanticAttrs({
      scope: "resizable-panels",
      part: "panel-group",
      orientation: "horizontal",
    })
    expect(group["data-scope"]).toBe("resizable-panels")
    expect(group["data-part"]).toBe("panel-group")
    expect(group["data-orientation"]).toBe("horizontal")

    const panel = applySemanticAttrs({ scope: "resizable-panels", part: "panel" })
    expect(panel["data-part"]).toBe("panel")

    const handle = applySemanticAttrs({
      scope: "resizable-panels",
      part: "handle",
      orientation: "vertical",
    })
    expect(handle["data-part"]).toBe("handle")
    expect(handle["data-orientation"]).toBe("vertical")
  })

  it("omits undefined optional attributes", () => {
    const attrs = applySemanticAttrs({ scope: "resizable-panels", part: "panel" })
    expect(attrs["data-state"]).toBeUndefined()
    expect(attrs["data-orientation"]).toBeUndefined()
    expect(attrs["data-disabled"]).toBeUndefined()
  })

  it("throws when usePanelGroupContext is called outside a reactive root", () => {
    expect(() => usePanelGroupContext()).toThrow()
  })
})
