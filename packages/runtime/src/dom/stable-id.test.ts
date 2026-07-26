import { describe, it, expect, beforeEach } from "vitest"
import { createStableId, resetIdCounter } from "./stable-id"

describe("createStableId", () => {
  beforeEach(() => {
    resetIdCounter()
  })

  it("returns a prefixed string", () => {
    const id = createStableId()
    expect(id).toMatch(/^solidiom-\d+$/)
  })

  it("uses custom prefix", () => {
    const id = createStableId("dialog")
    expect(id).toMatch(/^dialog-\d+$/)
  })

  it("generates unique IDs across calls", () => {
    const id1 = createStableId()
    const id2 = createStableId()
    expect(id1).not.toBe(id2)
  })

  it("produces deterministic sequence after reset", () => {
    const first = createStableId()
    const second = createStableId()
    resetIdCounter()
    expect(createStableId()).toBe(first)
    expect(createStableId()).toBe(second)
  })
})
