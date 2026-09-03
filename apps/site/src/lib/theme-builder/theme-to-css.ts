import {
  resolveTokenValue,
  type ThemeDefinition,
  type ThemeMode,
} from "../../../../../tools/theme-contract-schema"

export function themeToCssVariables(
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
