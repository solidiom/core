import { describe, it, expect } from "vitest"
import { applySemanticAttrs } from "@solidiom/runtime"

describe("Accordion", () => {
  it("emits correct semantic attributes for root", () => {
    const attrs = applySemanticAttrs({ scope: "accordion", part: "root" })
    expect(attrs["data-scope"]).toBe("accordion")
    expect(attrs["data-part"]).toBe("root")
  })

  it("emits correct semantic attributes for each part", () => {
    const parts = ["item", "trigger", "content"] as const
    for (const part of parts) {
      const attrs = applySemanticAttrs({ scope: "accordion", part })
      expect(attrs["data-scope"]).toBe("accordion")
      expect(attrs["data-part"]).toBe(part)
    }
  })

  it("includes state and disabled flags when provided", () => {
    const attrs = applySemanticAttrs({
      scope: "accordion",
      part: "trigger",
      state: "open",
      disabled: true,
    })
    expect(attrs["data-state"]).toBe("open")
    expect(attrs["data-disabled"]).toBe("")
    expect(attrs["data-highlighted"]).toBeUndefined()
  })
})
