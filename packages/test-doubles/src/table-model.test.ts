import { describe, it, expect } from "vitest"
import { createTableModelDouble, type TableModelCapability } from "./table-model"

describe("createTableModelDouble", () => {
  const double = createTableModelDouble()
  const columns = [
    { id: "name", header: "Name", accessorKey: "name" },
    { id: "age", header: "Age", accessorKey: "age" },
  ]
  const data = [
    { name: "Charlie", age: 30 },
    { name: "Alice", age: 25 },
    { name: "Bob", age: 35 },
  ]

  it("satisfies TableModelCapability shape", () => {
    const cap: TableModelCapability = double
    expect(cap.compute).toBeTypeOf("function")
    expect(cap.destroy).toBeTypeOf("function")
  })

  it("passes data through as rows", () => {
    const result = double.compute(data, columns)
    expect(result.rows).toHaveLength(3)
    expect(result.rows[0]!.values).toEqual({ name: "Charlie", age: 30 })
  })

  it("sorts ascending by column", () => {
    const result = double.compute(data, columns, { columnId: "name", direction: "asc" })
    expect(result.rows.map((r) => r.values.name)).toEqual(["Alice", "Bob", "Charlie"])
  })

  it("sorts descending by column", () => {
    const result = double.compute(data, columns, { columnId: "name", direction: "desc" })
    expect(result.rows.map((r) => r.values.name)).toEqual(["Charlie", "Bob", "Alice"])
  })

  it("includes sort state in result", () => {
    const sort = { columnId: "age", direction: "asc" as const }
    const result = double.compute(data, columns, sort)
    expect(result.sortState).toEqual(sort)
  })

  it("produces identical output for identical input", () => {
    const sort = { columnId: "name", direction: "asc" as const }
    expect(double.compute(data, columns, sort)).toEqual(double.compute(data, columns, sort))
  })
})
