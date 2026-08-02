import { createSignal } from "solid-js"
import type { ThemeDefinition, ThemeMode } from "../../../../../tools/theme-contract-schema"
import { SOLIDIOM_DEFAULT_THEME } from "../../../../../tools/theme-contract-definitions"

export function createThemeState(initial?: ThemeDefinition) {
  const base = initial ?? SOLIDIOM_DEFAULT_THEME
  const [theme, setTheme] = createSignal<ThemeDefinition>({ ...base })
  const [previewMode, setPreviewMode] = createSignal<ThemeMode>("light")
  return { theme, setTheme, previewMode, setPreviewMode }
}
