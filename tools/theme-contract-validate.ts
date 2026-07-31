/**
 * tools/theme-contract-validate — validates theme definitions against the contract.
 *
 * THEME-001c/001e. Rules:
 *   envelope        → correct schemaVersion, complete metadata, both modes present
 *   §1 known tokens  → every declared identity exists in recipe-contract-tokens.ts
 *   §2 baseline set  → every required-baseline token is declared in both modes
 *   §3 references    → `{ ref }` resolves within the same mode with no cycle
 *   §4 independence  → light and dark are not byte-identical (BRAND-002's "independently
 *                       authored, not an inversion" requirement — a theme that ships the
 *                       same values for both modes has not authored a dark mode at all)
 *   §5 legible pairs → the mandatory foreground/surface and on-primary pairs meet a WCAG
 *                       AA floor (3:1) in each mode this validator can verify; THEME-005
 *                       owns the exhaustive, precise 4.5:1/3:1 audit across every pair
 */
import { isSemanticToken } from "./recipe-contract-tokens"
import { contrastBetween } from "./theme-contract-contrast"
import {
  THEME_MODES,
  THEME_SCHEMA_VERSION,
  resolveTokenValue,
  type ThemeDefinition,
  type ThemeMode,
} from "./theme-contract-schema"

export interface ThemeContractViolation {
  /** Dotted path into the definition, for actionable messages. */
  path: string
  rule: string
  message: string
}

/**
 * The minimum token set every theme must declare in both modes.
 *
 * This is deliberately a small, structural baseline — not "all 48 canonical
 * identities." Many identities have no `site` namespace spelling yet (BRAND-002's
 * documented gap; see recipe-contract-tokens.ts), so requiring every identity here
 * would make every theme fail until that gap closes. The baseline is the set a
 * theme cannot omit without breaking the minimum visual contract: a legible surface,
 * a legible primary action, and a working focus indicator.
 */
export const REQUIRED_BASELINE_TOKENS: readonly string[] = [
  "surface",
  "surface-raised",
  "foreground",
  "foreground-muted",
  "border",
  "primary",
  "primary-foreground",
  "primary-hover",
  "focus-ring",
  "destructive",
]

/**
 * Pairs checked for a WCAG AA floor. `3` is the AA large-text/UI-component minimum
 * (WCAG 2.2 §1.4.11 non-text contrast and §1.4.3 large text), used here as a floor
 * that a theme's *required* pairs must clear in every mode. THEME-005 additionally
 * enforces the 4.5:1 body-text minimum on the specific pairs that render body copy.
 */
const MINIMUM_CONTRAST = 3
const LEGIBLE_PAIRS: ReadonlyArray<readonly [foreground: string, background: string]> = [
  ["foreground", "surface"],
  ["foreground", "surface-raised"],
  ["primary-foreground", "primary"],
]

export function validateThemeDefinition(definition: ThemeDefinition): ThemeContractViolation[] {
  const violations: ThemeContractViolation[] = []
  const fail = (path: string, rule: string, message: string): void => {
    violations.push({ path, rule, message })
  }

  // ── Envelope ───────────────────────────────────────────────────────────────
  if (definition.schemaVersion !== THEME_SCHEMA_VERSION) {
    fail(
      "schemaVersion",
      "envelope",
      `expected schemaVersion ${THEME_SCHEMA_VERSION}, received ${String(definition.schemaVersion)}`,
    )
  }
  if (!definition.meta?.name?.trim()) {
    fail("meta.name", "envelope", "a theme needs a human-readable name")
  }
  if (!definition.meta?.slug?.trim()) {
    fail("meta.slug", "envelope", "a theme needs a stable slug for routes and CLI install targets")
  } else if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(definition.meta.slug)) {
    fail("meta.slug", "envelope", `slug "${definition.meta.slug}" must be lowercase kebab-case`)
  }
  if (!definition.meta?.description?.trim()) {
    fail("meta.description", "envelope", "a theme needs a one-sentence description for docs")
  }
  if (definition.meta && !["preset", "custom"].includes(definition.meta.kind)) {
    fail("meta.kind", "envelope", `meta.kind must be "preset" or "custom"`)
  }

  for (const mode of THEME_MODES) {
    if (!definition.modes?.[mode] || Object.keys(definition.modes[mode]).length === 0) {
      fail(
        `modes.${mode}`,
        "envelope",
        `mode "${mode}" is mandatory and must declare at least one token`,
      )
    }
  }
  if (!definition.modes) return violations // nothing further is checkable

  // ── §1 known tokens / §3 references ────────────────────────────────────────
  for (const mode of THEME_MODES) {
    const tokens = definition.modes[mode] ?? {}
    for (const [id, value] of Object.entries(tokens)) {
      const at = `modes.${mode}.${id}`

      if (!isSemanticToken(id)) {
        fail(
          at,
          "§1 known tokens",
          `"${id}" is not a canonical token identity — add it to recipe-contract-tokens.ts under a RECIPE-001 decision, or reference an existing identity`,
        )
      }

      if (typeof value === "string") {
        if (!value.trim()) {
          fail(at, "envelope", "a token value must be a non-empty string")
        }
        continue
      }

      if (!value?.ref?.trim()) {
        fail(at, "envelope", "a token reference must name another token identity")
        continue
      }
      if (!(value.ref in tokens)) {
        fail(
          at,
          "§3 references",
          `references "${value.ref}", which mode "${mode}" does not declare — a reference cannot cross modes or forward-reference an undeclared token`,
        )
        continue
      }
      try {
        resolveTokenValue(definition, mode, id)
      } catch (error) {
        fail(at, "§3 references", error instanceof Error ? error.message : String(error))
      }
    }
  }

  // ── §2 baseline completeness ────────────────────────────────────────────────
  for (const mode of THEME_MODES) {
    const tokens = definition.modes[mode] ?? {}
    const missing = REQUIRED_BASELINE_TOKENS.filter((id) => !(id in tokens))
    if (missing.length > 0) {
      fail(
        `modes.${mode}`,
        "§2 baseline set",
        `mode "${mode}" is missing required baseline token(s): ${missing.join(", ")}`,
      )
    }
  }

  // ── §4 mode independence ─────────────────────────────────────────────────────
  if (definition.modes.light && definition.modes.dark) {
    // Radius and shadow tokens legitimately share values across modes (BRAND-002 keeps
    // corner radii identical light/dark); only colour-bearing categories are checked.
    const sharedColorTokens = Object.keys(definition.modes.light).filter(
      (id) => id in definition.modes.dark && !/^(radius|shadow)/.test(id),
    )
    const identical = sharedColorTokens.filter((id) => {
      try {
        const lightValue = resolveTokenValue(definition, "light", id)
        const darkValue = resolveTokenValue(definition, "dark", id)
        return lightValue !== undefined && lightValue === darkValue
      } catch {
        return false // already reported by §3
      }
    })
    if (sharedColorTokens.length > 0 && identical.length === sharedColorTokens.length) {
      fail(
        "modes",
        "§4 independence",
        `every shared colour token (${identical.join(", ")}) has an identical value in light and dark — BRAND-002 requires independently authored surface hierarchies, not an inversion; dark mode must author at least one different colour value`,
      )
    }
  }

  // ── §5 legible pairs ─────────────────────────────────────────────────────────
  for (const mode of THEME_MODES) {
    for (const [foreground, background] of LEGIBLE_PAIRS) {
      let fgValue: string | undefined
      let bgValue: string | undefined
      try {
        fgValue = resolveTokenValue(definition, mode, foreground)
        bgValue = resolveTokenValue(definition, mode, background)
      } catch {
        continue // already reported by §3
      }
      if (fgValue === undefined || bgValue === undefined) continue // already reported by §2

      const ratio = contrastBetween(fgValue, bgValue)
      if (ratio === undefined) continue // unsupported colour form; cannot verify here
      if (ratio < MINIMUM_CONTRAST) {
        fail(
          `modes.${mode}`,
          "§5 legible pairs",
          `"${foreground}" (${fgValue}) on "${background}" (${bgValue}) has a contrast ratio of ${ratio.toFixed(2)}:1, below the ${MINIMUM_CONTRAST}:1 floor`,
        )
      }
    }
  }

  return violations
}

/** Formats violations for terminal output. */
export function formatThemeViolations(slug: string, violations: ThemeContractViolation[]): string {
  return violations
    .map(
      (violation) => `  [${slug}] ${violation.path}\n      ${violation.rule}: ${violation.message}`,
    )
    .join("\n")
}
