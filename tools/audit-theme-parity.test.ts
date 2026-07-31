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
  it("passes for every required pair, including primary/primary-foreground (fixed: BRAND-002's light-mode primary moved from #6D66F1 to #6961F1)", () => {
    // Regression guard for the finding tracked in docs/contracts/theme-contract.md §5.1
    // (now resolved): #6D66F1 against white text resolved to ~4.36:1, below the 4.5:1
    // WCAG AA body-text minimum. The fix darkened the light-mode primary by ~1 point of
    // HSL lightness (same hue/saturation) to #6961F1, which clears the minimum with
    // margin. If this test starts failing, either the fix regressed or a new pair needs
    // the same treatment — do not silence it by narrowing the assertion.
    expect(auditContrastMatrix()).toEqual([])
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
