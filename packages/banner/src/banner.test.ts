import { describe, it, expect } from "vitest"
import * as Banner from "./index"

describe("banner", () => {
  it("exports Root as a function", () => {
    expect(Banner.Root).toBeDefined()
    expect(typeof Banner.Root).toBe("function")
  })

  it("exports Content as a function", () => {
    expect(Banner.Content).toBeDefined()
    expect(typeof Banner.Content).toBe("function")
  })

  it("exports Close as a function", () => {
    expect(Banner.Close).toBeDefined()
    expect(typeof Banner.Close).toBe("function")
  })
})
