/**
 * Base metadata defaults for the site shell.
 *
 * Scope note: this provides the defaults a base layout needs on every route
 * (title template, default description, canonical origin, basic social
 * tags). Sitemap/robots/manifest generation and the full canonical +
 * hreflang helper matrix are SITE-010 / I18N-003 and are out of scope here.
 */

import type { Locale } from "./locale"

export const SITE_NAME = "Solidiom"
export const CANONICAL_ORIGIN = "https://solidiom.org"
export const DEFAULT_DESCRIPTION =
  "Solidiom is an accessible, source-owned component ecosystem for Solid."

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
  const canonicalUrl = new URL(input.pathname, CANONICAL_ORIGIN).toString()

  return { title, description, canonicalUrl }
}
