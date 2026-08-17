import { describe, it, expect } from "vitest"
import { Root } from "./index"

describe("aspect-ratio", () => {
  it("exports a Root component", () => {
    expect(Root).toBeDefined()
    expect(typeof Root).toBe("function")
  })
})
