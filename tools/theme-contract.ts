/**
 * tools/theme-contract — validates every reference theme definition against the
 * canonical theme contract.
 *
 * THEME-001g. Mirrors `tools/recipe-contract.ts`'s role for recipes: this is the check
 * that makes THEME-001's schema rules enforced rather than agreed. THEME-002/003/004's
 * generators, BUILDER-004's import/export, and BUILDER-005's share-link decoder all
 * consume the same `ThemeDefinition` shape this validates.
 *
 * Usage: pnpm run theme:contract
 */
import { REFERENCE_THEMES } from "./theme-contract-definitions"
import { allDeclaredTokens } from "./theme-contract-schema"
import { formatThemeViolations, validateThemeDefinition } from "./theme-contract-validate"

function main(): void {
  console.log("Theme contract validation\n")

  let failed = 0
  for (const [slug, definition] of Object.entries(REFERENCE_THEMES)) {
    const violations = validateThemeDefinition(definition)
    const tokens = allDeclaredTokens(definition)

    if (violations.length === 0) {
      console.log(`  ✓ ${slug} — ${tokens.length} token(s) across light/dark`)
      continue
    }

    failed += violations.length
    console.error(`  ✗ ${slug} — ${violations.length} violation(s):`)
    console.error(formatThemeViolations(slug, violations))
  }

  console.log("")
  if (failed === 0) {
    console.log("✓ Theme contract validation PASSED")
    return
  }
  console.error(`✗ Theme contract validation FAILED — ${failed} violation(s)`)
  process.exitCode = 1
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  main()
}
