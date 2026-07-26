import { describe, it, expect } from "vitest"
import { applySemanticAttrs } from "@solidiom/runtime"
import { usePopoverContext } from "./popover-context"

describe("Popover", () => {
  it("emits correct semantic attributes for root, trigger, and content", () => {
    const root = applySemanticAttrs({ scope: "popover", part: "root" })
    expect(root["data-scope"]).toBe("popover")
    expect(root["data-part"]).toBe("root")

    const trigger = applySemanticAttrs({ scope: "popover", part: "trigger" })
    expect(trigger["data-part"]).toBe("trigger")

    const content = applySemanticAttrs({ scope: "popover", part: "content", state: "open" })
    expect(content["data-scope"]).toBe("popover")
    expect(content["data-part"]).toBe("content")
    expect(content["data-state"]).toBe("open")
  })

  it("emits close and anchor parts correctly", () => {
    const close = applySemanticAttrs({ scope: "popover", part: "close" })
    expect(close["data-part"]).toBe("close")
    expect(close["data-state"]).toBeUndefined()

    const anchor = applySemanticAttrs({ scope: "popover", part: "anchor" })
    expect(anchor["data-part"]).toBe("anchor")
  })

  it("throws when usePopoverContext is called outside a reactive root", () => {
    expect(() => usePopoverContext()).toThrow()
  })
})
