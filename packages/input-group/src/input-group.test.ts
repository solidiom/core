/**
 * Unit tests for @solidiom/input-group primitive.
 *
 * Verifies exported components and type structure.
 */

import { describe, it, expect } from "vitest"
import * as InputGroup from "./index"

describe("input-group", () => {
  it("exports Root component", () => {
    expect(InputGroup.Root).toBeDefined()
    expect(typeof InputGroup.Root).toBe("function")
  })

  it("exports Prefix component", () => {
    expect(InputGroup.Prefix).toBeDefined()
    expect(typeof InputGroup.Prefix).toBe("function")
  })

  it("exports Suffix component", () => {
    expect(InputGroup.Suffix).toBeDefined()
    expect(typeof InputGroup.Suffix).toBe("function")
  })

  it("exports Input component", () => {
    expect(InputGroup.Input).toBeDefined()
    expect(typeof InputGroup.Input).toBe("function")
  })
})
