/**
 * Documentation sidebar/TOC generation (DOCS-003).
 *
 * Shapes are deliberately generic (label/href pairs, optional nesting for
 * groups, depth for headings) so any docs route can populate DocsLayout's
 * props without changing its contract. The generation helpers below build
 * those shapes from real registry/content data:
 *   - `primitiveSidebarGroups`: every primitive grouped by registry
 *     `category`, for the persistent left-hand/mobile navigation.
 *   - `tocFromHeadings`: adapts Astro's rendered-content heading metadata
 *     (`{ depth, slug, text }`) into `DocsTocEntry[]`, limited to h2/h3 so
 *     the "on this page" list stays a page-level outline rather than a
 *     full heading dump.
 *   - `adjacentPrimitiveLinks`: previous/next links to the alphabetically
 *     adjacent primitive within the same view, matching the sort order
 *     `getRegistryPrimitives()` already uses for the directory itself.
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

/** Minimal shape `tocFromHeadings` needs; matches Astro's MarkdownHeading. */
export interface RenderedHeading {
  depth: number
  slug: string
  text: string
}

/** Localized UI copy shared by the static layout and its mobile Solid island. */
export interface DocsNavigationCopy {
  title: string
  openNavigation: string
  closeNavigation: string
  browseSections: string
  navigationLabel: string
  noSections: string
  previous: string
  next: string
  adjacentPages: string
  onThisPage: string
}

const DOCS_NAVIGATION_COPY: Record<"en" | "es", DocsNavigationCopy> = {
  en: {
    title: "Documentation",
    openNavigation: "Open documentation navigation",
    closeNavigation: "Close documentation navigation",
    browseSections: "Browse documentation sections",
    navigationLabel: "Documentation",
    noSections: "No documentation sections yet.",
    previous: "Previous",
    next: "Next",
    adjacentPages: "Adjacent pages",
    onThisPage: "On this page",
  },
  es: {
    title: "Documentación",
    openNavigation: "Abrir la navegación de documentación",
    closeNavigation: "Cerrar la navegación de documentación",
    browseSections: "Explorar secciones de documentación",
    navigationLabel: "Documentación",
    noSections: "Aún no hay secciones de documentación.",
    previous: "Anterior",
    next: "Siguiente",
    adjacentPages: "Páginas adyacentes",
    onThisPage: "En esta página",
  },
}

export function getDocsNavigationCopy(locale: "en" | "es"): DocsNavigationCopy {
  return DOCS_NAVIGATION_COPY[locale]
}

const CATEGORY_LABELS: Record<string, Record<"en" | "es", string>> = {
  display: { en: "Display", es: "Visualización" },
  feedback: { en: "Feedback", es: "Retroalimentación" },
  input: { en: "Input", es: "Entrada" },
  layout: { en: "Layout", es: "Diseño" },
  navigation: { en: "Navigation", es: "Navegación" },
  overlay: { en: "Overlay", es: "Superposición" },
}

export function categoryLabel(category: string, locale: "en" | "es"): string {
  return CATEGORY_LABELS[category]?.[locale] ?? category
}

/** Builds the persistent sidebar: every primitive grouped by category. */
export function primitiveSidebarGroups(
  primitives: Array<{ name: string; label: string; category: string }>,
  locale: "en" | "es",
  primitiveHref: (name: string, locale: "en" | "es") => string,
): DocsSidebarGroup[] {
  const byCategory = new Map<string, DocsSidebarLink[]>()
  for (const primitive of primitives) {
    const links = byCategory.get(primitive.category) ?? []
    links.push({ label: primitive.label, href: primitiveHref(primitive.name, locale) })
    byCategory.set(primitive.category, links)
  }

  return [...byCategory.entries()]
    .sort(([a], [b]) => categoryLabel(a, locale).localeCompare(categoryLabel(b, locale)))
    .map(([category, links]) => ({ label: categoryLabel(category, locale), links }))
}

/** Adapts Astro's rendered-content heading metadata into a page-level TOC. */
export function tocFromHeadings(headings: RenderedHeading[]): DocsTocEntry[] {
  return headings
    .filter((heading) => heading.depth >= 2 && heading.depth <= 3)
    .map((heading) => ({ id: heading.slug, text: heading.text, depth: heading.depth }))
}

/** Previous/next links to the alphabetically adjacent primitive, same view. */
export function adjacentPrimitiveLinks(
  primitives: Array<{ name: string; label: string }>,
  currentName: string,
  hrefFor: (name: string) => string,
): { previous?: DocsAdjacentLink; next?: DocsAdjacentLink } {
  const orderedPrimitives = [...primitives].sort((a, b) => a.name.localeCompare(b.name))
  const index = orderedPrimitives.findIndex((primitive) => primitive.name === currentName)
  if (index === -1) return {}

  const previousPrimitive = orderedPrimitives[index - 1]
  const nextPrimitive = orderedPrimitives[index + 1]
  return {
    previous: previousPrimitive
      ? { label: previousPrimitive.label, href: hrefFor(previousPrimitive.name) }
      : undefined,
    next: nextPrimitive
      ? { label: nextPrimitive.label, href: hrefFor(nextPrimitive.name) }
      : undefined,
  }
}
