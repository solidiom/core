import { describe, it, expect } from "vitest"
import * as StatusDot from "./index"

describe("status-dot", () => {
  it("exports Root as a function", () => {
    expect(StatusDot.Root).toBeDefined()
    expect(typeof StatusDot.Root).toBe("function")
  })
})
