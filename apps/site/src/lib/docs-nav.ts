/**
 * Shape of the documentation sidebar/TOC data consumed by DocsLayout.
 *
 * STATUS: shell-only (SITE-007). There is no generated sidebar yet — that
 * is DOCS-003 ("Generate sidebar groups, active state, mobile navigation,
 * previous/next links, and right-side TOC from metadata/headings"), which
 * depends on DOCS-001, which depends on REG-003 + CONTENT-001, none of
 * which have landed. The shapes below are deliberately generic (label/href
 * pairs, optional nesting for groups, depth for headings) so DOCS-003 can
 * populate them from real registry/content data later without changing
 * DocsLayout's prop contract.
 */

/** A single link in the sidebar, optionally marked active by the caller. */
export interface DocsSidebarLink {
  label: string
  href: string
}

/** A labeled group of sidebar links (e.g. "Primitives", "Guides"). */
export interface DocsSidebarGroup {
  label: string
  links: DocsSidebarLink[]
}

/** A single heading entry for the right-side "on this page" table of contents. */
export interface DocsTocEntry {
  id: string
  text: string
  /** Heading depth (2 for h2, 3 for h3, ...), used to indent nested entries. */
  depth: number
}

/** Previous/next article links rendered at the bottom of the article column. */
export interface DocsAdjacentLink {
  label: string
  href: string
}
