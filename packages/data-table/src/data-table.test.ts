import { describe, it, expect } from "vitest"
import { applySemanticAttrs } from "@solidiom/runtime"
import { useDataTableContext } from "./data-table-context"

describe("DataTable", () => {
  it("emits correct semantic attributes for root and header-cell", () => {
    const root = applySemanticAttrs({ scope: "data-table", part: "root" })
    expect(root["data-scope"]).toBe("data-table")
    expect(root["data-part"]).toBe("root")

    const headerCell = applySemanticAttrs({ scope: "data-table", part: "header-cell" })
    expect(headerCell["data-scope"]).toBe("data-table")
    expect(headerCell["data-part"]).toBe("header-cell")
  })

  it("emits state and selected flags on row and cell parts", () => {
    const row = applySemanticAttrs({ scope: "data-table", part: "row", selected: true })
    expect(row["data-part"]).toBe("row")
    expect(row["data-selected"]).toBe("")

    const cell = applySemanticAttrs({ scope: "data-table", part: "cell" })
    expect(cell["data-part"]).toBe("cell")
    expect(cell["data-selected"]).toBeUndefined()
  })

  it("throws when useDataTableContext is called outside a reactive root", () => {
    expect(() => useDataTableContext()).toThrow()
  })
})
