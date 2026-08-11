import { REFERENCE_THEMES } from "../../../../tools/theme-contract-definitions"
import {
  resolveTokenValue,
  categoryOf,
  type ThemeDefinition,
  type ThemeMode,
} from "../../../../tools/theme-contract-schema"

/**
 * Looks up a theme's ThemeDefinition by slug at build time.
 * Returns undefined if the slug is not recognized.
 */
export function getThemeDefinition(slug: string): ThemeDefinition | undefined {
  return REFERENCE_THEMES[slug]
}

/** Returns all available theme slugs. */
export function getAvailableThemeSlugs(): string[] {
  return Object.keys(REFERENCE_THEMES).sort()
}

/**
 * Resolves all token values for a theme mode into a flat record of
 * CSS variable name → resolved literal value.
 * Variables use the `--sio-` prefix matching the site's recipe namespace.
 */
export function themeToCssVars(
  definition: ThemeDefinition,
  mode: ThemeMode,
): Record<string, string> {
  const variables: Record<string, string> = {}
  const tokens = definition.modes[mode]
  if (!tokens) return variables

  for (const [tokenId, value] of Object.entries(tokens)) {
    const resolved =
      typeof value === "string" ? value : resolveTokenValue(definition, mode, tokenId)
    if (resolved === undefined) continue
    const variableName = `--sio-${tokenId}`
    variables[variableName] = resolved
  }
  return variables
}

/**
 * Groups color tokens by their semantic category for swatch rendering.
 * Only includes tokens whose resolved value is a valid color string.
 */
export interface TokenSwatchGroup {
  category: string
  tokens: Array<{ id: string; value: string; variable: string }>
}

export function getTokenSwatchGroups(
  definition: ThemeDefinition,
  mode: ThemeMode,
): TokenSwatchGroup[] {
  const groups: TokenSwatchGroup[] = []
  const seen = new Set<string>()

  const tokens = definition.modes[mode]
  if (!tokens) return groups

  const sortedEntries = Object.entries(tokens).sort((a, b) => a[0].localeCompare(b[0]))

  for (const [tokenId, value] of sortedEntries) {
    const resolved =
      typeof value === "string" ? value : resolveTokenValue(definition, mode, tokenId)
    if (resolved === undefined) continue
    if (!isValidColor(resolved)) continue

    const category = categoryOf(tokenId)
    if (!category) continue

    if (!seen.has(category)) {
      seen.add(category)
      groups.push({ category, tokens: [] })
    }
    groups[groups.length - 1].tokens.push({
      id: tokenId,
      value: resolved,
      variable: `--sio-${tokenId}`,
    })
  }
  return groups
}

/** Checks if a string looks like a valid CSS color. */
function isValidColor(value: string): boolean {
  return /^#|[0-9]+rem|[0-9]+px/.test(value.trim()) && !value.includes(" ")
}
