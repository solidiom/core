import { describe, it, expect } from "vitest"
import { Root, useDirectionContext } from "./index"

describe("direction", () => {
  it("exports Root as a function", () => {
    expect(Root).toBeDefined()
    expect(typeof Root).toBe("function")
  })

  it("exports useDirectionContext as a function", () => {
    expect(useDirectionContext).toBeDefined()
    expect(typeof useDirectionContext).toBe("function")
  })
})
