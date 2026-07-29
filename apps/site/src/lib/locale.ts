/**
 * Locale resolution and routing utilities.
 *
 * I18N-001: Implements locale configuration:
 *   - English is unprefixed and canonical (e.g. /primitives/dialog/)
 *   - Spanish lives under /es/ (e.g. /es/primitives/dialog/)
 *   - No automatic redirect based on Accept-Language or geolocation
 *   - Explicit locale context available to all components
 *
 * The strategy uses Astro's built-in i18n routing (configured in
 * astro.config.ts) with `prefixDefaultLocale: false` so English routes
 * have no /en/ prefix.
 */

export type Locale = "en" | "es"

export const DEFAULT_LOCALE: Locale = "en"
export const LOCALES: readonly Locale[] = ["en", "es"] as const

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  es: "Espanol",
}

const LOCALE_PREFIXES: Record<Locale, string> = {
  en: "",
  es: "/es",
}

/**
 * Resolves the active locale from an Astro-provided pathname.
 * English is unprefixed and canonical; Spanish routes live under `/es/`.
 */
export function resolveLocale(pathname: string): Locale {
  return pathname.startsWith("/es/") || pathname === "/es" ? "es" : DEFAULT_LOCALE
}

/** All locales currently read left-to-right; kept explicit for future RTL locales. */
export function localeDirection(_locale: Locale): "ltr" | "rtl" {
  return "ltr"
}

/** Returns the URL prefix for a given locale (empty string for English). */
export function localePrefix(locale: Locale): string {
  return LOCALE_PREFIXES[locale]
}

/**
 * Given a pathname in one locale, returns the equivalent path in the target locale.
 * Strips the source locale prefix (if any) and prepends the target prefix.
 */
export function switchLocalePath(pathname: string, targetLocale: Locale): string {
  // Strip existing locale prefix
  const stripped = pathname.startsWith("/es/")
    ? pathname.slice(3) // remove "/es"
    : pathname === "/es"
      ? "/"
      : pathname

  const prefix = LOCALE_PREFIXES[targetLocale]
  return `${prefix}${stripped}`
}

/**
 * Returns the "other" locale (for a two-locale system).
 */
export function alternateLocale(current: Locale): Locale {
  return current === "en" ? "es" : "en"
}
