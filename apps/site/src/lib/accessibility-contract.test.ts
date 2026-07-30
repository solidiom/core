import { describe, expect, it } from "vitest"
import {
  ACCESSIBILITY_CONTRACT_SCHEMA_VERSION,
  accessibilityContractSchema,
  validateAccessibilityContractCoverage,
} from "./accessibility-contract"

function validContract() {
  return accessibilityContractSchema.parse({
    accessibilityContractSchemaVersion: ACCESSIBILITY_CONTRACT_SCHEMA_VERSION,
    keyboard: [{ key: "Enter", behavior: "Activates the trigger." }],
    focus: ["Moves focus to content after opening."],
    semantics: ["Content has dialog semantics."],
    aria: ["The trigger exposes its expanded state."],
    consumerDuties: ["Provide a concise accessible name."],
    nonApplicableCriteria: [],
    reviewStatus: "reviewed",
    reviewedBy: "Accessibility reviewer",
    reviewedAt: "2026-07-29T00:00:00.000Z",
  })
}

describe("accessibility contract schema", () => {
  it("accepts a fully covered reviewed contract", () => {
    expect(validateAccessibilityContractCoverage(validContract())).toEqual([])
  })

  it("requires a structured rationale when a criterion has no statements", () => {
    const contract = validContract()
    contract.keyboard = []
    expect(validateAccessibilityContractCoverage(contract)).toContain(
      "keyboard requires a statement or a non-applicable rationale",
    )

    contract.nonApplicableCriteria = [
      { criterion: "keyboard", rationale: "The primitive is not interactive." },
    ]
    expect(validateAccessibilityContractCoverage(contract)).toEqual([])
  })

  it("requires review provenance once a contract is reviewed", () => {
    const contract = validContract()
    contract.reviewedBy = undefined
    expect(validateAccessibilityContractCoverage(contract)).toContain(
      "reviewed and complete contracts require reviewedBy and reviewedAt",
    )
  })
})
