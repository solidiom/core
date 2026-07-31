/**
 * tools/theme-contract-schema — the canonical semantic theme definition (THEME-001a/001b).
 *
 * One JSON document per theme. `THEME-002/003/004` each consume this shape to generate a
 * profile's CSS variables, Tailwind mapping, and UnoCSS preset/configuration, so a theme's
 * token values are stated exactly once and every output profile derives from it.
 *
 * DESIGN DECISIONS ENCODED HERE
 *
 * 1. A theme assigns *values* to the canonical token *identities* declared in
 *    `tools/recipe-contract-tokens.ts` (RECIPE-001). This file does not invent new
 *    identities — a theme that needs one is a RECIPE-001 change, not a THEME-001 change.
 *
 * 2. Light and dark are both mandatory and independently authored, matching BRAND-002's
 *    documented architecture (`apps/site/src/assets/tokens.css`): dark mode is not
 *    derived by inverting light values, so both modes are required top-level keys with
 *    their own complete value maps rather than a single map plus a "dark overrides" delta.
 *
 * 3. A value is either a literal (colour, length, timing) or a reference to another
 *    token identity in the *same* mode, so a theme can define `primary-hover` as "the
 *    same value as `primary`" without repeating the literal. References cannot cross
 *    modes — light cannot reference a dark value or vice versa — because that would
 *    make one mode's correctness depend on the other's, defeating decision 2.
 *
 * 4. Every token in a theme is JSON-representable (string values, string references),
 *    so a theme can be serialised, diffed, shared via URL (BUILDER-005), and migrated
 *    across schema versions as a pure data transform.
 *
 * 5. `requiredTokens` is not hardcoded here as "all 48 canonical identities." A theme may
 *    legitimately omit an identity that has no `site` namespace spelling yet (see
 *    `recipe-contract-tokens.ts`'s `null` entries) — the validator checks completeness
 *    against the identities a theme *declares* plus a minimum baseline (§ validator),
 *    not against every identity that exists in every namespace.
 */
import { semanticToken, type TokenCategory } from "./recipe-contract-tokens"

/** Bumped when the definition shape changes incompatibly. */
export const THEME_SCHEMA_VERSION = 1 as const

/** The two mandatory colour modes. Every theme must author both. */
export const THEME_MODES = ["light", "dark"] as const
export type ThemeMode = (typeof THEME_MODES)[number]

/**
 * A token value within one mode.
 *
 * A bare string is a literal (a colour, a length, a timing value — whatever the
 * token's category expects). `{ ref }` aliases another token identity's value in the
 * *same* mode, so `primary-hover` can be authored as "the same colour as `primary`"
 * without repeating the literal. `ref` must name a token identity declared in this
 * same mode's `tokens` map — it cannot forward-reference across modes.
 */
export type ThemeTokenValue = string | { ref: string }

/** Token identity → value, for one mode. */
export type ThemeModeTokens = Readonly<Record<string, ThemeTokenValue>>

export interface ThemeMetadata {
  /** Human-readable name shown in the theme directory and builder. */
  name: string
  /** Stable slug, unique across the theme catalog. Used for routes and CLI install targets. */
  slug: string
  /** One-sentence summary for generated docs and previews. */
  description: string
  /**
   * `preset` ships in the catalog (PRESET-001..004); `custom` is builder-authored or
   * consumer-authored and is never listed in the shipped preset catalog.
   */
  kind: "preset" | "custom"
  /** Attribution/provenance for a preset theme. Optional for a custom/builder theme. */
  author?: string
}

export interface ThemeDefinition {
  schemaVersion: typeof THEME_SCHEMA_VERSION
  meta: ThemeMetadata
  /**
   * Both modes are mandatory. `THEME_MODES` is the closed set of keys this record may
   * have — light/dark parity is enforced structurally, not just by a validator rule.
   */
  modes: Readonly<Record<ThemeMode, ThemeModeTokens>>
}

// ─── Traversal helpers shared by the validator, generators, and migrations ────

/** Every token identity a theme assigns a value to, in a given mode. */
export function tokensInMode(definition: ThemeDefinition, mode: ThemeMode): string[] {
  return Object.keys(definition.modes[mode] ?? {}).sort()
}

/** Every token identity declared in *either* mode, deduplicated and sorted. */
export function allDeclaredTokens(definition: ThemeDefinition): string[] {
  const ids = new Set<string>()
  for (const mode of THEME_MODES) {
    for (const id of Object.keys(definition.modes[mode] ?? {})) ids.add(id)
  }
  return [...ids].sort()
}

/**
 * Resolves a token's literal value in a mode, following `{ ref }` chains within that
 * same mode. Returns `undefined` if the token is undeclared in the mode, and throws if
 * a reference cycle is detected (the validator reports this as a violation instead of
 * letting a consumer hit infinite recursion at generation time).
 */
export function resolveTokenValue(
  definition: ThemeDefinition,
  mode: ThemeMode,
  tokenId: string,
): string | undefined {
  const seen = new Set<string>()
  let current = tokenId
  for (;;) {
    if (seen.has(current)) {
      throw new Error(
        `reference cycle resolving "${tokenId}" in mode "${mode}": ${[...seen, current].join(" → ")}`,
      )
    }
    seen.add(current)
    const value = definition.modes[mode]?.[current]
    if (value === undefined) return undefined
    if (typeof value === "string") return value
    current = value.ref
  }
}

/** True when a value is a reference rather than a literal. */
export function isTokenReference(value: ThemeTokenValue): value is { ref: string } {
  return typeof value === "object" && value !== null && "ref" in value
}

/** Canonical token category, for validator/generator/editor grouping. Undefined if unknown. */
export function categoryOf(tokenId: string): TokenCategory | undefined {
  // Re-exported indirection point: callers should not need to import
  // recipe-contract-tokens directly just to group a theme by category.
  return semanticToken(tokenId)?.category
}
