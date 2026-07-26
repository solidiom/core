import { describe, it, expect } from "vitest"
import { applySemanticAttrs } from "@solidiom/runtime"
import { useCommandPaletteContext } from "./command-palette-context"

describe("CommandPalette", () => {
  it("emits correct semantic attributes for root", () => {
    const attrs = applySemanticAttrs({ scope: "command-palette", part: "root" })
    expect(attrs["data-scope"]).toBe("command-palette")
    expect(attrs["data-part"]).toBe("root")
  })

  it("emits correct semantic attributes for input, list, and item parts", () => {
    const input = applySemanticAttrs({ scope: "command-palette", part: "input" })
    expect(input["data-scope"]).toBe("command-palette")
    expect(input["data-part"]).toBe("input")

    const list = applySemanticAttrs({ scope: "command-palette", part: "list" })
    expect(list["data-part"]).toBe("list")

    const item = applySemanticAttrs({ scope: "command-palette", part: "item", highlighted: true })
    expect(item["data-part"]).toBe("item")
    expect(item["data-highlighted"]).toBe("")
  })

  it("throws when useCommandPaletteContext is called outside a reactive root", () => {
    expect(() => useCommandPaletteContext()).toThrow()
  })
})
