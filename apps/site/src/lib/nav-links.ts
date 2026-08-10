/**
 * Primary navigation link config for SiteHeader.
 *
 * Layout: top-level links for the main product layers plus a "Docs"
 * dropdown for reference material (CLI, Blocks, Guides, etc.).
 */

import type { NavLink } from "../components/SiteHeader"
import { localePrefix, type Locale } from "./locale"

const DOCS_LABEL: Record<Locale, string> = { en: "Docs", es: "Docs" }
const PRIMITIVES_LABEL: Record<Locale, string> = { en: "Primitives", es: "Primitivas" }
const COMPONENTS_LABEL: Record<Locale, string> = { en: "Components", es: "Componentes" }
const THEMES_LABEL: Record<Locale, string> = { en: "Themes", es: "Temas" }
const BLOG_LABEL: Record<Locale, string> = { en: "Blog", es: "Blog" }

export const DOCS_DROPDOWN_LABEL: Record<Locale, string> = { en: "Docs", es: "Docs" }

export function getPrimaryLinks(locale: Locale): NavLink[] {
  const prefix = localePrefix(locale)
  return [
    { label: PRIMITIVES_LABEL[locale], href: `${prefix}/primitives/` },
    { label: COMPONENTS_LABEL[locale], href: `${prefix}/components/` },
    { label: THEMES_LABEL[locale], href: `${prefix}/themes/` },
    { label: BLOG_LABEL[locale], href: `${prefix}/blog/` },
  ]
}

export function getDocsLinks(locale: Locale): NavLink[] {
  const prefix = localePrefix(locale)
  return [
    { label: "CLI", href: `${prefix}/primitives/` },
    { label: locale === "es" ? "Bloques" : "Blocks", href: `${prefix}/blocks/` },
    { label: locale === "es" ? "Plantillas" : "Templates", href: `${prefix}/templates/` },
    { label: locale === "es" ? "Accesibilidad" : "Accessibility", href: `${prefix}/accessibility/` },
    { label: locale === "es" ? "Rendimiento" : "Performance", href: `${prefix}/performance/` },
    { label: "GitHub", href: "https://github.com/solidiom" },
  ]
}

/** @deprecated Use getDocsLinks instead */
export const resourceLinks: NavLink[] = [
  { label: "GitHub", href: "https://github.com/solidiom" },
  { label: "Accessibility", href: "/accessibility/" },
  { label: "Performance", href: "/performance/" },
]

