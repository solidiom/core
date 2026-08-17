import { describe, it, expect } from "vitest"
import { Root, Item } from "./index"

describe("grid", () => {
  it("exports a Root component", () => {
    expect(Root).toBeDefined()
    expect(typeof Root).toBe("function")
  })

  it("exports an Item component", () => {
    expect(Item).toBeDefined()
    expect(typeof Item).toBe("function")
  })
})
