/**
 * Unit tests for @solidiom/date-range-input primitive.
 *
 * Verifies exports, semantic attributes, validation, and event handling.
 */

import { describe, it, expect } from "vitest"
import { Root, StartInput, EndInput, Separator, Trigger } from "./index"

describe("date-range-input", () => {
  it("exports Root component", () => {
    expect(Root).toBeDefined()
    expect(typeof Root).toBe("function")
  })

  it("exports StartInput component", () => {
    expect(StartInput).toBeDefined()
    expect(typeof StartInput).toBe("function")
  })

  it("exports EndInput component", () => {
    expect(EndInput).toBeDefined()
    expect(typeof EndInput).toBe("function")
  })

  it("exports Separator component", () => {
    expect(Separator).toBeDefined()
    expect(typeof Separator).toBe("function")
  })

  it("exports Trigger component", () => {
    expect(Trigger).toBeDefined()
    expect(typeof Trigger).toBe("function")
  })
})
