/**
 * Minimal locale resolution for the base layout.
 *
 * Scope note: this is intentionally small. It only derives the correct
 * `lang`/`dir` attributes for the *current* static route from its URL, per
 * the canonical strategy (English unprefixed and canonical, Spanish under
 * `/es/`, no automatic redirect). It does not provide routing, a locale
 * context, or a language switcher — that is I18N-001/I18N-002, which is a
 * separate, deeper task tracked independently of SITE-004.
 */

export type Locale = "en" | "es"

export const DEFAULT_LOCALE: Locale = "en"
export const LOCALES: readonly Locale[] = ["en", "es"]

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

export function localePrefix(locale: Locale): string {
  return LOCALE_PREFIXES[locale]
}
