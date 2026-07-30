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

import { DEFAULT_LOCALE, LOCALES, resolveEquivalentLocalePath, type Locale } from "./locale"

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
  /** Page-specific description. Required for translated routes. */
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

/**
 * Resolves metadata and rejects a translated route that would silently fall
 * back to English metadata. English retains its site-wide defaults only.
 */
export function resolvePageMetadata(input: PageMetadataInput): PageMetadata {
  if (input.locale !== DEFAULT_LOCALE && (!input.title || !input.description)) {
    throw new Error(
      `I18N-003: ${input.pathname} requires localized title and description metadata.`,
    )
  }

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
 * Returns a registered equivalent locale pathname. Undefined means the route
 * is intentionally unpaired and must not be advertised as an alternate.
 */
export function resolveAlternatePathname(
  pathname: string,
  _fromLocale: Locale,
  toLocale: Locale,
): string | undefined {
  return resolveEquivalentLocalePath(pathname, toLocale)
}

/**
 * Generates alternates only for registered, rendered locale counterparts.
 * `x-default` points to the canonical unprefixed English route.
 */
export function resolveHreflangAlternates(
  pathname: string,
  currentLocale: Locale,
): Array<{ hreflang: string; href: string }> {
  const alternates: Array<{ hreflang: string; href: string }> = LOCALES.flatMap((locale) => {
    const altPathname = resolveAlternatePathname(pathname, currentLocale, locale)
    return altPathname ? [{ hreflang: locale, href: resolveCanonicalUrl(altPathname) }] : []
  })

  const defaultPathname = resolveAlternatePathname(pathname, currentLocale, DEFAULT_LOCALE)
  if (defaultPathname) {
    alternates.push({
      hreflang: "x-default",
      href: resolveCanonicalUrl(defaultPathname),
    })
  }

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

// ---------------------------------------------------------------------------
// Catalog structured data (DOCS-006)
// ---------------------------------------------------------------------------

export type JsonLdValue = string | number | boolean | null | JsonLd | JsonLdValue[]

export interface JsonLd {
  "@context"?: "https://schema.org"
  "@type": string
  [property: string]: JsonLdValue | undefined
}

export interface CatalogBreadcrumbItem {
  name: string
  pathname: string
}

export interface CatalogStructuredDataItem {
  name: string
  pathname: string
}

interface CatalogSeoCopy {
  home: string
  breadcrumbs: string
}

const CATALOG_SEO_COPY: Record<Locale, CatalogSeoCopy> = {
  en: { home: "Home", breadcrumbs: "Breadcrumb" },
  es: { home: "Inicio", breadcrumbs: "Ruta de navegación" },
}

/** Returns localized labels shared by visible catalog breadcrumbs and JSON-LD. */
export function getCatalogSeoCopy(locale: Locale): CatalogSeoCopy {
  return CATALOG_SEO_COPY[locale]
}

/** Serializes JSON-LD safely for an inline application/ld+json script element. */
export function serializeJsonLd(data: JsonLd): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029")
}

export function catalogBreadcrumbStructuredData(items: CatalogBreadcrumbItem[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: resolveCanonicalUrl(item.pathname),
    })),
  }
}

export interface CatalogPageStructuredDataInput {
  title: string
  description: string
  pathname: string
  locale: Locale
  breadcrumbs: CatalogBreadcrumbItem[]
}

/** Returns structured data for a localized primitive overview or tab page. */
export function catalogPageStructuredData(input: CatalogPageStructuredDataInput): JsonLd[] {
  return [
    catalogBreadcrumbStructuredData(input.breadcrumbs),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: input.title,
      description: input.description,
      url: resolveCanonicalUrl(input.pathname),
      inLanguage: input.locale,
      isPartOf: {
        "@type": "WebSite",
        name: SITE_NAME,
        url: resolveCanonicalUrl("/"),
      },
    },
  ]
}

export interface CatalogDirectoryStructuredDataInput extends CatalogPageStructuredDataInput {
  items: CatalogStructuredDataItem[]
}

/** Returns structured data for a localized primitive collection page. */
export function catalogDirectoryStructuredData(
  input: CatalogDirectoryStructuredDataInput,
): JsonLd[] {
  return [
    catalogBreadcrumbStructuredData(input.breadcrumbs),
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: input.title,
      description: input.description,
      url: resolveCanonicalUrl(input.pathname),
      inLanguage: input.locale,
      isPartOf: {
        "@type": "WebSite",
        name: SITE_NAME,
        url: resolveCanonicalUrl("/"),
      },
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: input.items.length,
        itemListElement: input.items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          url: resolveCanonicalUrl(item.pathname),
        })),
      },
    },
  ]
}
