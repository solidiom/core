import { describe, it, expect } from "vitest"
import { createChangeDetails } from "./change-details"

describe("createChangeDetails", () => {
  it("creates details with reason only", () => {
    const details = createChangeDetails("trigger")
    expect(details).toEqual({ reason: "trigger" })
    expect("originalEvent" in details).toBe(false)
  })

  it("creates details with reason and originalEvent", () => {
    const event = new Event("click")
    const details = createChangeDetails("escape-key", event)
    expect(details).toEqual({ reason: "escape-key", originalEvent: event })
  })

  it("preserves the exact reason type", () => {
    const details = createChangeDetails("pointer-outside")
    expect(details.reason).toBe("pointer-outside")
  })
})
