/**
 * Explicit locale context and registered bilingual routing.
 *
 * English is unprefixed, Spanish is prefixed with `/es`, and the URL is the
 * only authority for the active locale. A stored preference is intentionally
 * presentation state only: it is exposed to client code but never redirects a
 * direct visit or overrides a route.
 */

export type Locale = "en" | "es"

export const DEFAULT_LOCALE: Locale = "en"
export const LOCALES: readonly Locale[] = ["en", "es"] as const
export const LOCALE_STORAGE_KEY = "solidiom-locale-preference"

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  es: "Español",
}

const LOCALE_PREFIXES: Record<Locale, string> = {
  en: "",
  es: "/es",
}

/**
 * The canonical inventory of public routes that have equivalent localized
 * pages. Add a base pathname here with its paired page routes in `src/pages`.
 * This is the single source for language switching and alternate metadata.
 */
export const LOCALIZED_ROUTE_PATHS = [
  "/",
  "/privacy/",
  "/trademark/",
  "/dco/",
  "/security/",
  "/changelog/",
  "/primitives/",
  "/themes/builder/",
  "/components/",
  "/blocks/",
  "/templates/",
  "/themes/",
  "/accessibility/",
  "/performance/",
  "/blog/",
  "/guides/",
] as const

/** Registry-generated primitive routes have a locale counterpart for every entry. */
const LOCALIZED_PRIMITIVE_ROUTE = /^\/primitives\/[^/]+\/(?:api\/|examples\/|accessibility\/)?$/

/** Content-collection layer routes have a locale counterpart for every entry. */
const LOCALIZED_CATALOG_ROUTE =
  /^\/(components|blocks|templates|themes)\/[^/]+\/(?:api\/|examples\/|accessibility\/)?$/

/** Changelog entry routes have a locale counterpart for every published entry. */
const LOCALIZED_CHANGELOG_ROUTE = /^\/changelog\/[^/]+\/$/

/** Article entry routes have a locale counterpart for every published article. */
const LOCALIZED_ARTICLE_ROUTE = /^\/blog\/[^/]+\/$/

/** Guide entry routes have a locale counterpart for every published guide. */
const LOCALIZED_GUIDE_ROUTE = /^\/guides\/[^/]+\/$/

export function isLocalizedRoute(pathname: string): boolean {
  return (
    LOCALIZED_ROUTE_PATHS.includes(pathname as (typeof LOCALIZED_ROUTE_PATHS)[number]) ||
    LOCALIZED_PRIMITIVE_ROUTE.test(pathname) ||
    LOCALIZED_CATALOG_ROUTE.test(pathname) ||
    LOCALIZED_CHANGELOG_ROUTE.test(pathname) ||
    LOCALIZED_ARTICLE_ROUTE.test(pathname) ||
    LOCALIZED_GUIDE_ROUTE.test(pathname)
  )
}

export function normalizePathname(pathname: string): string {
  const path = pathname.split(/[?#]/, 1)[0] || "/"
  if (path === "/") return "/"
  return `${path.replace(/\/+$/, "")}/`
}

/** Resolves the active locale from a pathname; no browser-language detection is used. */
export function resolveLocale(pathname: string): Locale {
  const normalized = normalizePathname(pathname)
  return normalized === "/es/" || normalized.startsWith("/es/") ? "es" : DEFAULT_LOCALE
}

/** All current locales are left-to-right; explicit for future RTL support. */
export function localeDirection(_locale: Locale): "ltr" | "rtl" {
  return "ltr"
}

/** Returns the URL prefix for a given locale (empty for canonical English). */
export function localePrefix(locale: Locale): string {
  return LOCALE_PREFIXES[locale]
}

/** Removes a recognized locale prefix to obtain the registered base pathname. */
export function localeAgnosticPathname(pathname: string): string {
  const normalized = normalizePathname(pathname)
  return normalized === "/es/"
    ? "/"
    : normalized.startsWith("/es/")
      ? normalizePathname(normalized.slice(3))
      : normalized
}

/** Returns the registered equivalent path, or undefined when no equivalent exists. */
export function resolveEquivalentLocalePath(
  pathname: string,
  targetLocale: Locale,
): string | undefined {
  const basePathname = localeAgnosticPathname(pathname)
  if (!isLocalizedRoute(basePathname)) {
    return undefined
  }

  return normalizePathname(`${localePrefix(targetLocale)}${basePathname}`)
}

/** Returns the other locale in the current two-locale configuration. */
export function alternateLocale(current: Locale): Locale {
  return current === "en" ? "es" : "en"
}

/**
 * Reads the explicit locale preference before paint without changing the URL.
 * The data attribute lets hydrated controls observe persisted intent while
 * preserving a direct visitor's requested locale and preventing auto-redirects.
 */
export function bootstrapLocalePreferenceScript(): string {
  return `
(function () {
  try {
    var stored = localStorage.getItem(${JSON.stringify(LOCALE_STORAGE_KEY)});
    if (stored === "en" || stored === "es") {
      document.documentElement.setAttribute("data-locale-preference", stored);
    }
  } catch (e) {
    // Storage may be unavailable in privacy-restricted environments.
  }
})();
`.trim()
}
