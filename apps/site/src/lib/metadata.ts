/**
 * Page metadata helpers (SITE-004 + SITE-010).
 *
 * Provides:
 *   - Title template and default description.
 *   - Canonical URL resolution from pathname and origin.
 *   - Social/Open Graph metadata defaults.
 *   - Helpers for building hreflang alternate URLs.
 *
 * Sitemap generation is handled by @astrojs/sitemap via astro.config.ts.
 * Robots is an API endpoint at /robots.txt.
 */

import { DEFAULT_LOCALE, LOCALES, localePrefix, type Locale } from "./locale"

export const SITE_NAME = "Solidiom"
export const CANONICAL_ORIGIN = "https://solidiom.org"
export const DEFAULT_DESCRIPTION =
  "Solidiom is an accessible, source-owned component ecosystem for Solid."

// ---------------------------------------------------------------------------
// Page metadata
// ---------------------------------------------------------------------------

export interface PageMetadataInput {
  /** Page-specific title. Combined with the site name via a fixed template. */
  title?: string
  /** Page-specific description. Falls back to DEFAULT_DESCRIPTION. */
  description?: string
  /** Absolute pathname of the current route, e.g. "/" or "/es/getting-started/". */
  pathname: string
  locale: Locale
}

export interface PageMetadata {
  title: string
  description: string
  canonicalUrl: string
}

export function resolvePageMetadata(input: PageMetadataInput): PageMetadata {
  const title = input.title ? `${input.title} — ${SITE_NAME}` : SITE_NAME
  const description = input.description ?? DEFAULT_DESCRIPTION
  const canonicalUrl = resolveCanonicalUrl(input.pathname)

  return { title, description, canonicalUrl }
}

// ---------------------------------------------------------------------------
// Canonical URL helper
// ---------------------------------------------------------------------------

/**
 * Resolves the full canonical URL for a given pathname.
 * Always uses the production origin regardless of the current environment.
 */
export function resolveCanonicalUrl(pathname: string): string {
  const resolved = new URL(pathname, CANONICAL_ORIGIN)
  // Canonicals must always identify the production route, not a preview host,
  // query variant, fragment, or externally supplied absolute origin.
  const canonical = new URL(resolved.pathname, CANONICAL_ORIGIN)
  canonical.search = ""
  canonical.hash = ""
  return canonical.toString()
}

// ---------------------------------------------------------------------------
// Alternate/hreflang helpers
// ---------------------------------------------------------------------------

/**
 * Computes the equivalent pathname for a different locale.
 * English is unprefixed (canonical); Spanish is under /es/.
 */
export function resolveAlternatePathname(
  pathname: string,
  fromLocale: Locale,
  toLocale: Locale,
): string {
  if (fromLocale === toLocale) return pathname

  // Strip current locale prefix to get the base path.
  const prefix = localePrefix(fromLocale)
  const basePath = prefix && pathname.startsWith(prefix)
    ? pathname.slice(prefix.length) || "/"
    : pathname

  // Apply target locale prefix.
  const targetPrefix = localePrefix(toLocale)
  return targetPrefix ? `${targetPrefix}${basePath}` : basePath
}

/**
 * Generates the full set of hreflang alternate URLs for a page.
 * Includes x-default pointing to the English (unprefixed) variant.
 */
export function resolveHreflangAlternates(
  pathname: string,
  currentLocale: Locale,
): Array<{ hreflang: string; href: string }> {
  const alternates: Array<{ hreflang: string; href: string }> = []

  for (const locale of LOCALES) {
    const altPathname = resolveAlternatePathname(pathname, currentLocale, locale)
    alternates.push({
      hreflang: locale,
      href: resolveCanonicalUrl(altPathname),
    })
  }

  // x-default points to the default (English) version.
  const defaultPathname = resolveAlternatePathname(pathname, currentLocale, DEFAULT_LOCALE)
  alternates.push({
    hreflang: "x-default",
    href: resolveCanonicalUrl(defaultPathname),
  })

  return alternates
}

// ---------------------------------------------------------------------------
// Social / Open Graph metadata helper
// ---------------------------------------------------------------------------

export interface SocialMetadataInput {
  title: string
  description: string
  canonicalUrl: string
  /** Path to the social card image, relative to the site root. */
  image?: string
  /** Image alt text. */
  imageAlt?: string
  /** Open Graph type. Defaults to "website". */
  type?: string
  /** Article publish date (ISO 8601) for og:article:published_time. */
  publishedTime?: string
}

export interface SocialMetadata {
  "og:type": string
  "og:site_name": string
  "og:title": string
  "og:description": string
  "og:url": string
  "og:image"?: string
  "og:image:alt"?: string
  "article:published_time"?: string
  "twitter:card": string
  "twitter:title": string
  "twitter:description": string
  "twitter:image"?: string
  "twitter:image:alt"?: string
}

/**
 * Builds the full set of Open Graph and Twitter Card meta tag values.
 * Returns a flat record that can be iterated to produce <meta> tags.
 */
export function resolveSocialMetadata(input: SocialMetadataInput): SocialMetadata {
  const imageUrl = input.image ? resolveCanonicalUrl(input.image) : undefined

  const meta: SocialMetadata = {
    "og:type": input.type ?? "website",
    "og:site_name": SITE_NAME,
    "og:title": input.title,
    "og:description": input.description,
    "og:url": input.canonicalUrl,
    "twitter:card": imageUrl ? "summary_large_image" : "summary",
    "twitter:title": input.title,
    "twitter:description": input.description,
  }

  if (imageUrl) {
    meta["og:image"] = imageUrl
    meta["twitter:image"] = imageUrl
    if (input.imageAlt) {
      meta["og:image:alt"] = input.imageAlt
      meta["twitter:image:alt"] = input.imageAlt
    }
  }

  if (input.publishedTime) {
    meta["article:published_time"] = input.publishedTime
  }

  return meta
}
