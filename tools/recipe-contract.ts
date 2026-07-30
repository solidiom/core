/**
 * tools/recipe-contract — validates every recipe definition against the canonical contract.
 *
 * RECIPE-001f/001h. Wired into `gate:phase1` so the contract's rules are enforced rather
 * than agreed. Emitters (RECIPE-002/003/004) consume the same definitions this validates.
 *
 * Usage: pnpm run recipe:contract
 */
import { REFERENCE_DEFINITIONS } from "./recipe-contract-definitions"
import { referencedTokens, styledStates } from "./recipe-contract-schema"
import { formatViolations, validateRecipeDefinition } from "./recipe-contract-validate"
import { tokenSpelling, type TokenNamespace } from "./recipe-contract-tokens"

const NAMESPACES: readonly TokenNamespace[] = ["css", "tailwind", "unocss", "site"]

function main(): void {
  console.log("Recipe contract validation\n")

  let failed = 0
  for (const [scope, definition] of Object.entries(REFERENCE_DEFINITIONS)) {
    const violations = validateRecipeDefinition(definition)
    const tokens = referencedTokens(definition)
    const states = styledStates(definition)

    if (violations.length === 0) {
      console.log(
        `  ✓ ${scope} — ${definition.slots.length} slot(s), ${definition.variants?.length ?? 0} axis/axes, ${states.length} state(s), ${tokens.length} token(s)`,
      )
      // Surface tokens a namespace cannot express: not a failure, but the emitter for
      // that profile must add the token or record an exception.
      for (const namespace of NAMESPACES) {
        const unmapped = tokens.filter((token) => !tokenSpelling(token, namespace))
        if (unmapped.length > 0) {
          console.log(`      ⧗ ${namespace} cannot express: ${unmapped.join(", ")}`)
        }
      }
      continue
    }

    failed += violations.length
    console.error(`  ✗ ${scope} — ${violations.length} violation(s):`)
    console.error(formatViolations(scope, violations))
  }

  console.log("")
  if (failed === 0) {
    console.log("✓ Recipe contract validation PASSED")
    return
  }
  console.error(`✗ Recipe contract validation FAILED — ${failed} violation(s)`)
  process.exitCode = 1
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  main()
}
