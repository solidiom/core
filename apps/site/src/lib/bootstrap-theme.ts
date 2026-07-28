/**
 * No-flash theme bootstrap.
 *
 * Sets `data-theme` on the root <html> element before first paint so the
 * page never flashes the wrong color scheme. Source code lives here as the
 * canonical, typechecked version; BaseLayout.astro inlines its *compiled*
 * output into a blocking, synchronous <script> tag in <head> (before any
 * stylesheet or body content) so it can run ahead of paint.
 *
 * Resolution order:
 *   1. Explicit persisted choice ("light" | "dark") in localStorage.
 *   2. `prefers-color-scheme` media query.
 *   3. Falls back to light if neither is available (e.g. no matchMedia).
 *
 * This only sets the attribute; it never removes a persisted choice and
 * never overrides an explicit choice with the system preference. Full
 * toggle UI and persistence-on-change behavior belongs to SITE-009.
 */

export const THEME_STORAGE_KEY = "solidiom-theme"

export function bootstrapThemeScript(): string {
  return `
(function () {
  try {
    var key = ${JSON.stringify(THEME_STORAGE_KEY)};
    var stored = localStorage.getItem(key);
    var theme = stored === "light" || stored === "dark"
      ? stored
      : (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "light");
  }
})();
`.trim()
}
