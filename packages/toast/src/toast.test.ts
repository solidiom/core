import { describe, it, expect } from "vitest"
import { applySemanticAttrs } from "@solidiom/runtime"
import { useToastContext } from "./toast-context"

describe("Toast", () => {
  it("emits correct semantic attributes for region", () => {
    const attrs = applySemanticAttrs({ scope: "toast", part: "region" })
    expect(attrs["data-scope"]).toBe("toast")
    expect(attrs["data-part"]).toBe("region")
    expect(attrs["data-state"]).toBeUndefined()
  })

  it("emits correct semantic attributes for all parts", () => {
    const root = applySemanticAttrs({ scope: "toast", part: "root" })
    expect(root["data-scope"]).toBe("toast")
    expect(root["data-part"]).toBe("root")

    const title = applySemanticAttrs({ scope: "toast", part: "title" })
    expect(title["data-part"]).toBe("title")

    const close = applySemanticAttrs({ scope: "toast", part: "close" })
    expect(close["data-part"]).toBe("close")
  })

  it("throws when useToastContext is called outside a reactive root", () => {
    expect(() => useToastContext()).toThrow()
  })
})
