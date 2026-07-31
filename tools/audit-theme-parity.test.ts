import { describe, expect, it } from "vitest"
import {
  auditContrastMatrix,
  auditCrossOutputParity,
  auditGeneratedFreshness,
  auditRoundTrip,
} from "./audit-theme-parity"

describe("auditGeneratedFreshness", () => {
  it("passes against the committed generated output", async () => {
    expect(await auditGeneratedFreshness()).toEqual([])
  })
})

describe("auditCrossOutputParity", () => {
  it("passes for the shipped reference theme (css and unocss agree)", async () => {
    expect(await auditCrossOutputParity()).toEqual([])
  })
})

describe("auditContrastMatrix", () => {
  it("flags the reference theme's known light-mode primary/primary-foreground shortfall", () => {
    // solidiom-default's light primary (#6D66F1) against white text resolves to
    // ~4.36:1, below the 4.5:1 WCAG AA body-text minimum. This is a real, tracked
    // finding (docs/contracts/theme-contract.md §7) — this test documents that the
    // audit surfaces it rather than silently passing, and must be updated (not
    // deleted) if BRAND-002's primary colour is ever adjusted to close the gap.
    const violations = auditContrastMatrix()
    expect(violations.some((v) => v.message.includes("text on primary fills"))).toBe(true)
  })

  it("does not flag borders, which are an intentionally low-contrast decorative choice", () => {
    const violations = auditContrastMatrix()
    expect(violations.some((v) => v.message.includes("borders"))).toBe(false)
  })
})

describe("auditRoundTrip", () => {
  it("passes for every reference theme", () => {
    expect(auditRoundTrip()).toEqual([])
  })
})
