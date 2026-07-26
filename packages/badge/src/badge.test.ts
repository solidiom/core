import { describe, it, expect } from "vitest"
import { applySemanticAttrs } from "@solidiom/runtime"

describe("Badge", () => {
  it("emits correct semantic attributes for root", () => {
    const attrs = applySemanticAttrs({ scope: "badge", part: "root" })
    expect(attrs["data-scope"]).toBe("badge")
    expect(attrs["data-part"]).toBe("root")
  })

  it("does not emit state or boolean flags when not provided", () => {
    const attrs = applySemanticAttrs({ scope: "badge", part: "root" })
    expect(attrs["data-state"]).toBeUndefined()
    expect(attrs["data-disabled"]).toBeUndefined()
  })

  it("only has data-scope and data-part when no flags set", () => {
    const attrs = applySemanticAttrs({ scope: "badge", part: "root" })
    const keys = Object.keys(attrs).filter((k) => attrs[k] !== undefined)
    expect(keys).toEqual(["data-scope", "data-part"])
  })
})
