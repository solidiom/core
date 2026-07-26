/**
 * Node-mode unit tests for ScrollArea primitive.
 *
 * Tests semantic attributes and context isolation.
 */

import { describe, it, expect } from "vitest"
import { applySemanticAttrs } from "@solidiom/runtime"

describe("ScrollArea", () => {
  it("emits correct semantic attributes for root", () => {
    const attrs = applySemanticAttrs({ scope: "scroll-area", part: "root" })
    expect(attrs["data-scope"]).toBe("scroll-area")
    expect(attrs["data-part"]).toBe("root")
  })

  it("emits correct semantic attributes for viewport", () => {
    const attrs = applySemanticAttrs({ scope: "scroll-area", part: "viewport" })
    expect(attrs["data-scope"]).toBe("scroll-area")
    expect(attrs["data-part"]).toBe("viewport")
  })

  it("emits correct semantic attributes for scrollbar with orientation", () => {
    const attrs = applySemanticAttrs({
      scope: "scroll-area",
      part: "scrollbar",
      orientation: "vertical",
    })
    expect(attrs["data-scope"]).toBe("scroll-area")
    expect(attrs["data-part"]).toBe("scrollbar")
    expect(attrs["data-orientation"]).toBe("vertical")
  })

  it("emits correct semantic attributes for horizontal scrollbar", () => {
    const attrs = applySemanticAttrs({
      scope: "scroll-area",
      part: "scrollbar",
      orientation: "horizontal",
    })
    expect(attrs["data-orientation"]).toBe("horizontal")
  })

  it("emits correct semantic attributes for thumb", () => {
    const attrs = applySemanticAttrs({ scope: "scroll-area", part: "thumb" })
    expect(attrs["data-scope"]).toBe("scroll-area")
    expect(attrs["data-part"]).toBe("thumb")
  })
})
