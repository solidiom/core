import { describe, it, expect } from "vitest"
import { applySemanticAttrs } from "@solidiom/runtime"
import { useDrawerContext } from "./drawer-context"

describe("Drawer", () => {
  it("emits correct semantic attributes for root, trigger, and content", () => {
    const root = applySemanticAttrs({ scope: "drawer", part: "root" })
    expect(root["data-scope"]).toBe("drawer")
    expect(root["data-part"]).toBe("root")

    const trigger = applySemanticAttrs({ scope: "drawer", part: "trigger" })
    expect(trigger["data-part"]).toBe("trigger")

    const content = applySemanticAttrs({ scope: "drawer", part: "content", state: "open" })
    expect(content["data-scope"]).toBe("drawer")
    expect(content["data-state"]).toBe("open")
  })

  it("emits backdrop and close parts with disabled flag", () => {
    const backdrop = applySemanticAttrs({ scope: "drawer", part: "backdrop" })
    expect(backdrop["data-part"]).toBe("backdrop")

    const close = applySemanticAttrs({ scope: "drawer", part: "close", disabled: true })
    expect(close["data-part"]).toBe("close")
    expect(close["data-disabled"]).toBe("")
  })

  it("throws when useDrawerContext is called outside a reactive root", () => {
    expect(() => useDrawerContext()).toThrow()
  })
})
