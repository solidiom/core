import { describe, it, expect } from "vitest"
import * as Link from "./index"

describe("link", () => {
  it("exports Root as a function", () => {
    expect(Link.Root).toBeDefined()
    expect(typeof Link.Root).toBe("function")
  })
})
