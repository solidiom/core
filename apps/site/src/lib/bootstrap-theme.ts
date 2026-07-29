/**
 * No-flash theme bootstrap (SITE-004 + SITE-009).
 *
 * Sets `data-theme` on the root <html> element before first paint so the
 * page never flashes the wrong color scheme. Source code lives here as the
 * canonical, typechecked version; BaseLayout.astro inlines its *compiled*
 * output into a blocking, synchronous <script> tag in <head> (before any
 * stylesheet or body content) so it can run ahead of paint.
 *
 * Three-state user preference (SITE-009):
 *   - "system" — follow prefers-color-scheme (default when nothing stored).
 *   - "light"  — explicit light override.
 *   - "dark"   — explicit dark override.
 *
 * Resolution order:
 *   1. Read stored preference ("system" | "light" | "dark") from localStorage.
 *   2. If "system" (or absent/invalid), resolve via prefers-color-scheme.
 *   3. Falls back to "light" if matchMedia is unavailable.
 *
 * The resolved effective theme ("light" | "dark") is written to
 * `data-theme` on <html>. The stored *preference* (which may be "system")
 * is written to `data-theme-preference` so the toggle UI can read it
 * without a hydration mismatch — the attribute is available synchronously
 * on DOM-ready and matches what the toggle island will initialize from.
 */

/** Possible user preferences stored in localStorage. */
export type ThemePreference = "system" | "light" | "dark"

/** Resolved effective themes applied via data-theme. */
export type EffectiveTheme = "light" | "dark"

export const THEME_STORAGE_KEY = "solidiom-theme"
export const THEME_PREFERENCES: readonly ThemePreference[] = ["system", "light", "dark"]

/**
 * Resolve effective theme from a preference value.
 * Used both in the inline bootstrap and in the client-side toggle.
 */
export function resolveEffectiveTheme(
  preference: ThemePreference,
  systemIsDark: boolean,
): EffectiveTheme {
  if (preference === "light" || preference === "dark") return preference
  return systemIsDark ? "dark" : "light"
}

export function bootstrapThemeScript(): string {
  return `
(function () {
  try {
    var key = ${JSON.stringify(THEME_STORAGE_KEY)};
    var stored = localStorage.getItem(key);
    var preference = (stored === "light" || stored === "dark" || stored === "system")
      ? stored
      : "system";
    var systemDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    var theme = preference === "light" || preference === "dark"
      ? preference
      : (systemDark ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-theme-preference", preference);
    document.documentElement.style.colorScheme = theme;
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "light");
    document.documentElement.setAttribute("data-theme-preference", "system");
    document.documentElement.style.colorScheme = "light";
  }
})();
`.trim()
}
