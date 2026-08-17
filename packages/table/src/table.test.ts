import { describe, it, expect } from "vitest"
import * as Table from "./index"

describe("table", () => {
  it("exports Root as a function", () => {
    expect(Table.Root).toBeDefined()
    expect(typeof Table.Root).toBe("function")
  })

  it("exports Header as a function", () => {
    expect(Table.Header).toBeDefined()
    expect(typeof Table.Header).toBe("function")
  })

  it("exports HeaderRow as a function", () => {
    expect(Table.HeaderRow).toBeDefined()
    expect(typeof Table.HeaderRow).toBe("function")
  })

  it("exports HeaderCell as a function", () => {
    expect(Table.HeaderCell).toBeDefined()
    expect(typeof Table.HeaderCell).toBe("function")
  })

  it("exports Body as a function", () => {
    expect(Table.Body).toBeDefined()
    expect(typeof Table.Body).toBe("function")
  })

  it("exports Row as a function", () => {
    expect(Table.Row).toBeDefined()
    expect(typeof Table.Row).toBe("function")
  })

  it("exports Cell as a function", () => {
    expect(Table.Cell).toBeDefined()
    expect(typeof Table.Cell).toBe("function")
  })

  it("exports Caption as a function", () => {
    expect(Table.Caption).toBeDefined()
    expect(typeof Table.Caption).toBe("function")
  })
})
