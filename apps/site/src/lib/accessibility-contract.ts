import { z } from "astro/zod"

export const ACCESSIBILITY_CONTRACT_SCHEMA_VERSION = 1 as const

const contractCriterionSchema = z.enum(["keyboard", "focus", "semantics", "aria", "portalling"])
export const ACCESSIBILITY_CONTRACT_CRITERIA = ["keyboard", "focus", "semantics", "aria"] as const

const keyboardInteractionSchema = z.object({
  key: z.string().min(1),
  behavior: z.string().min(1),
})

const nonApplicableCriterionSchema = z.object({
  criterion: contractCriterionSchema,
  rationale: z.string().min(1),
})

/**
 * Fields owned by authored accessibility contracts. Generic content and product
 * metadata remain in `content.config.ts`; this schema is reusable by renderers
 * and validation tooling without duplicating the a11y contract vocabulary.
 */
export const accessibilityContractFields = {
  accessibilityContractSchemaVersion: z.literal(ACCESSIBILITY_CONTRACT_SCHEMA_VERSION),
  keyboard: z.array(keyboardInteractionSchema),
  focus: z.array(z.string().min(1)),
  semantics: z.array(z.string().min(1)),
  aria: z.array(z.string().min(1)),
  consumerDuties: z.array(z.string().min(1)).min(1),
  nonApplicableCriteria: z.array(nonApplicableCriterionSchema),
  reviewStatus: z.enum(["draft", "reviewed", "complete"]),
  reviewedBy: z.string().min(1).optional(),
  reviewedAt: z.coerce.date().optional(),
}

export const accessibilityContractSchema = z.object(accessibilityContractFields)
export type AccessibilityContract = z.infer<typeof accessibilityContractSchema>

/**
 * Each behavioral criterion must have an affirmative contract statement or a
 * structured, reviewable reason why it does not apply. Reviewed contracts also
 * identify their review provenance.
 */
export function validateAccessibilityContractCoverage(contract: AccessibilityContract): string[] {
  const errors: string[] = []

  for (const criterion of ACCESSIBILITY_CONTRACT_CRITERIA) {
    const hasStatements = contract[criterion].length > 0
    const hasNonApplicableRationale = contract.nonApplicableCriteria.some(
      (entry) => entry.criterion === criterion,
    )
    if (!hasStatements && !hasNonApplicableRationale) {
      errors.push(`${criterion} requires a statement or a non-applicable rationale`)
    }
    if (hasStatements && hasNonApplicableRationale) {
      errors.push(`${criterion} cannot be both documented and non-applicable`)
    }
  }

  if (contract.reviewStatus !== "draft" && (!contract.reviewedBy || !contract.reviewedAt)) {
    errors.push("reviewed and complete contracts require reviewedBy and reviewedAt")
  }

  return errors
}
