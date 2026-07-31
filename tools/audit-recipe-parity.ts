/**
 * tools/audit-recipe-parity — cross-profile coverage and exception audit (RECIPE-005).
 *
 * `tools/audit-recipe-dual-emission.ts` compares each profile's CSS to its own TSX —
 * it never checks the canonical definition, and it never compares profiles to each
 * other. This audit is driven by `REFERENCE_DEFINITIONS` (the single source of truth)
 * and asserts three things `audit-recipe-dual-emission.ts` cannot:
 *
 * 1. Coverage — every slot/part a definition declares actually appears in each
 *    profile's stylesheet, and every profile ships the same set of scopes/parts. A
 *    slot deleted from a stylesheet without touching the TSX passes the dual-emission
 *    audit today; it does not pass this one.
 * 2. Class-string form — a `.variants.ts` module exists if and only if the scope
 *    declares a `variants` axis (only badge/button qualify today), consistently
 *    across all three profiles.
 * 3. States and exceptions — every `data-state` value a definition declares is
 *    actually styled in each profile, consistently across profiles; every declared
 *    `adapter` ownership exception is genuinely honored (its
 *    `adapterOwnedProperties` are absent from the recipe's own ruleset) rather than
 *    merely tolerated. `consumer` ownership needs no equivalent check — those slots
 *    are styled but not rendered by the TSX wrapper (contract §5), so rule 1 still
 *    requires their CSS coverage.
 *
 * Utility stylesheets (`prose`, `typeset`, `theme`) have no canonical definition and
 * are out of scope for all three checks — same exclusion `audit-recipe-dual-emission.ts`
 * and the emitters already apply.
 *
 * Usage: pnpm run audit:recipe-parity
 */
import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { REFERENCE_DEFINITIONS } from "./recipe-contract-definitions"
import { type RecipeDefinition } from "./recipe-contract-schema"

const ROOT = join(import.meta.dirname ?? __dirname, "..")

export const PROFILES = ["recipes-css", "recipes-tailwind", "recipes-unocss"] as const
export type ProfileName = (typeof PROFILES)[number]

export interface RecipeParityError {
  profile: ProfileName | "all"
  scope: string
  message: string
}

function profileDirs(root: string): Record<ProfileName, string> {
  return {
    "recipes-css": join(root, "packages/recipes-css/src"),
    "recipes-tailwind": join(root, "packages/recipes-tailwind/src"),
    "recipes-unocss": join(root, "packages/recipes-unocss/src"),
  }
}

function readStylesheet(profileDir: string, scope: string): string | undefined {
  const path = join(profileDir, "styles", `${scope}.css`)
  return existsSync(path) ? readFileSync(path, "utf8") : undefined
}

function readVariantsModule(profileDir: string, scope: string): string | undefined {
  const path = join(profileDir, "recipes", `${scope}.variants.ts`)
  return existsSync(path) ? readFileSync(path, "utf8") : undefined
}

function hasDataPart(cssContent: string, part: string): boolean {
  return new RegExp(`\\[data-part="${escapeRegExp(part)}"\\]`).test(cssContent)
}

/** True if `cssContent` has a `[data-part="part"][data-state="state"]` rule (in either attribute order). */
function hasDataState(cssContent: string, part: string, state: string): boolean {
  const partAttr = `\\[data-part="${escapeRegExp(part)}"\\]`
  const stateAttr = `\\[data-state="${escapeRegExp(state)}"\\]`
  return (
    new RegExp(`${partAttr}[^{]*${stateAttr}`).test(cssContent) ||
    new RegExp(`${stateAttr}[^{]*${partAttr}`).test(cssContent)
  )
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/**
 * Rule 1 — per profile, every slot's part appears in the stylesheet (including
 * `consumer`-owned slots, which are styled but not rendered by the TSX wrapper — see
 * contract §5), and every declared state appears too. This is the check
 * `audit-recipe-dual-emission.ts` does not do: that audit only verifies parts the CSS
 * *does* contain are rendered by the TSX; it never verifies the CSS contains
 * everything the definition declares.
 */
function auditProfileCoverage(
  profile: ProfileName,
  profileDir: string,
  scope: string,
  definition: RecipeDefinition,
): RecipeParityError[] {
  const errors: RecipeParityError[] = []
  const css = readStylesheet(profileDir, scope)

  if (!css) {
    errors.push({ profile, scope, message: `no styles/${scope}.css — scope is undeclared in this profile` })
    return errors
  }

  for (const slot of definition.slots) {
    if (!hasDataPart(css, slot.part)) {
      errors.push({
        profile,
        scope,
        message: `slot "${slot.part}" is declared in the canonical definition but styles/${scope}.css has no [data-part="${slot.part}"] rule`,
      })
    }
    for (const state of Object.keys(slot.states ?? {})) {
      if (!hasDataState(css, slot.part, state)) {
        errors.push({
          profile,
          scope,
          message: `slot "${slot.part}" declares state "${state}" but styles/${scope}.css has no [data-state="${state}"] rule for it`,
        })
      }
    }  }

  return errors
}

/**
 * Rule 2 — a `.variants.ts` class-string module exists if and only if the scope
 * declares a `variants` axis. Contract §6 says "each profile ships a stylesheet form
 * and a class-string form" for every recipe; in reality only scopes with variant axes
 * (badge, button) get a class-string form — `tools/recipe-emit-css.ts`'s
 * `renderVariantsModule` returns `null` otherwise. This audit checks the actual,
 * conditional rule, consistently across all three profiles.
 */
function auditVariantsModule(
  profile: ProfileName,
  profileDir: string,
  scope: string,
  definition: RecipeDefinition,
): RecipeParityError[] {
  const shouldHaveVariants = (definition.variants ?? []).length > 0
  const hasVariantsModule = !!readVariantsModule(profileDir, scope)

  if (shouldHaveVariants && !hasVariantsModule) {
    return [
      {
        profile,
        scope,
        message: `scope declares a variants axis but recipes/${scope}.variants.ts does not exist`,
      },
    ]
  }
  if (!shouldHaveVariants && hasVariantsModule) {
    return [
      {
        profile,
        scope,
        message: `recipes/${scope}.variants.ts exists but the canonical definition declares no variants axis`,
      },
    ]
  }
  return []
}

/**
 * Rule 3 — every declared `adapter` exception is genuinely honored: none of its
 * `adapterOwnedProperties` are declared in the recipe's own ruleset for that part.
 *
 * `consumer` ownership needs no equivalent check here — per contract §5, a
 * `consumer`-owned slot is "styled but not rendered by the recipe wrapper" (repeatable
 * items, optional titles). The recipe is expected to style it; the exception only
 * excuses the TSX wrapper from rendering it, which `audit-recipe-dual-emission.ts`'s
 * `isDocumentedException` already covers. Rule 1 (`auditProfileCoverage`) therefore
 * treats `consumer` slots the same as `recipe` slots for CSS coverage purposes —
 * excluding only `adapter` slots, whose adapter-owned properties are genuinely absent
 * from the recipe by design.
 */
function auditExceptionsHonored(
  profile: ProfileName,
  profileDir: string,
  scope: string,
  definition: RecipeDefinition,
): RecipeParityError[] {
  const errors: RecipeParityError[] = []
  const css = readStylesheet(profileDir, scope)
  if (!css) return errors

  for (const slot of definition.slots) {
    if (slot.ownership !== "adapter") continue

    const ruleMatch = css.match(
      new RegExp(`\\[data-part="${escapeRegExp(slot.part)}"\\][^{]*\\{([^}]*)\\}`, "g"),
    )
    if (!ruleMatch) continue
    const ownedProperties = slot.adapterOwnedProperties ?? []
    for (const property of ownedProperties) {
      const declared = ruleMatch.some((rule) =>
        new RegExp(`(^|[\\s{;])${escapeRegExp(property)}\\s*:`).test(rule),
      )
      if (declared) {
        errors.push({
          profile,
          scope,
          message: `slot "${slot.part}" declares "${property}" as adapter-owned, but styles/${scope}.css sets "${property}" on [data-part="${slot.part}"] — adapter-owned properties must be exempt from the recipe`,
        })
      }
    }
  }

  return errors
}

/**
 * Rule 4 — cross-profile parity: every profile must cover the same scope/part/state
 * set. A profile silently dropping a scope, part, or state (rather than declaring an
 * exception in the canonical definition) is otherwise invisible, since each profile is
 * audited independently by every other tool in tools/.
 */
function auditCrossProfileParity(
  scope: string,
  definition: RecipeDefinition,
  dirs: Record<ProfileName, string>,
): RecipeParityError[] {
  const errors: RecipeParityError[] = []
  const parts = definition.slots.map((slot) => slot.part)
  // "part::state" keys, not scope-wide state names — two slots in the same scope can
  // declare the same state name (dialog's backdrop and content both have open/closed)
  // and must be tracked independently.
  const partStates = definition.slots.flatMap((slot) =>
    Object.keys(slot.states ?? {}).map((state) => ({ part: slot.part, state })),
  )

  const presence: Record<ProfileName, { parts: Set<string>; states: Set<string> }> = {
    "recipes-css": { parts: new Set(), states: new Set() },
    "recipes-tailwind": { parts: new Set(), states: new Set() },
    "recipes-unocss": { parts: new Set(), states: new Set() },
  }

  for (const profile of PROFILES) {
    const css = readStylesheet(dirs[profile], scope)
    if (!css) continue
    for (const part of parts) if (hasDataPart(css, part)) presence[profile].parts.add(part)
    for (const { part, state } of partStates) {
      if (hasDataState(css, part, state)) presence[profile].states.add(`${part}::${state}`)
    }
  }

  for (const part of parts) {
    const coveringProfiles = PROFILES.filter((profile) => presence[profile].parts.has(part))
    if (coveringProfiles.length > 0 && coveringProfiles.length < PROFILES.length) {
      const missing = PROFILES.filter((profile) => !coveringProfiles.includes(profile))
      errors.push({
        profile: "all",
        scope,
        message: `slot "${part}" is styled in [${coveringProfiles.join(", ")}] but missing from [${missing.join(", ")}] — profiles must cover the same slots`,
      })
    }
  }

  for (const { part, state } of partStates) {
    const key = `${part}::${state}`
    const coveringProfiles = PROFILES.filter((profile) => presence[profile].states.has(key))
    if (coveringProfiles.length > 0 && coveringProfiles.length < PROFILES.length) {
      const missing = PROFILES.filter((profile) => !coveringProfiles.includes(profile))
      errors.push({
        profile: "all",
        scope,
        message: `slot "${part}" state "${state}" is styled in [${coveringProfiles.join(", ")}] but missing from [${missing.join(", ")}] — profiles must cover the same states`,
      })
    }
  }

  return errors
}

export function auditRecipeParity(root = ROOT): RecipeParityError[] {
  const dirs = profileDirs(root)
  const errors: RecipeParityError[] = []

  for (const [scope, definition] of Object.entries(REFERENCE_DEFINITIONS)) {
    for (const profile of PROFILES) {
      const profileDir = dirs[profile]
      if (!existsSync(profileDir)) continue
      errors.push(...auditProfileCoverage(profile, profileDir, scope, definition))
      errors.push(...auditVariantsModule(profile, profileDir, scope, definition))
      errors.push(...auditExceptionsHonored(profile, profileDir, scope, definition))
    }
    errors.push(...auditCrossProfileParity(scope, definition, dirs))
  }

  return errors
}

function main(): void {
  console.log("Recipe cross-profile coverage, states, and exception audit\n")
  const errors = auditRecipeParity()

  if (errors.length === 0) {
    console.log("✓ Recipe parity check PASSED")
    console.log("  All profiles cover the same slots/states and every documented exception is honored.")
    return
  }

  console.error(`✗ Recipe parity check FAILED — ${errors.length} issue(s):\n`)
  for (const error of errors) {
    console.error(`  [${error.profile}] ${error.scope}: ${error.message}`)
  }
  process.exitCode = 1
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  main()
}
