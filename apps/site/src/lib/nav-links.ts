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
    { label: BLOCKS_LABEL[locale], href: `${prefix}/blocks/` },
    { label: TEMPLATES_LABEL[locale], href: `${prefix}/templates/` },
    { label: THEMES_LABEL[locale], href: `${prefix}/themes/` },
    { label: BLOG_LABEL[locale], href: `${prefix}/blog/` },
  ]
}

const CLI_LABEL: Record<Locale, string> = { en: "CLI", es: "CLI" }
const GUIDES_LABEL: Record<Locale, string> = { en: "Guides", es: "Guías" }
const BLOCKS_LABEL: Record<Locale, string> = { en: "Blocks", es: "Bloques" }
const TEMPLATES_LABEL: Record<Locale, string> = { en: "Templates", es: "Plantillas" }
const ACCESSIBILITY_LABEL: Record<Locale, string> = { en: "Accessibility", es: "Accesibilidad" }
const PERFORMANCE_LABEL: Record<Locale, string> = { en: "Performance", es: "Rendimiento" }

export function getDocsLinks(locale: Locale): NavLink[] {
  const prefix = localePrefix(locale)
  return [
    { label: CLI_LABEL[locale], href: `${prefix}/guides/cli-overview/` },
    { label: GUIDES_LABEL[locale], href: `${prefix}/guides/` },
    { label: ACCESSIBILITY_LABEL[locale], href: `${prefix}/accessibility/` },
    { label: PERFORMANCE_LABEL[locale], href: `${prefix}/performance/` },
    { label: "GitHub", href: "https://github.com/solidiom" },
  ]
}

/** @deprecated Use getDocsLinks instead */
export const resourceLinks: NavLink[] = [
  { label: "GitHub", href: "https://github.com/solidiom" },
  { label: "Accessibility", href: "/accessibility/" },
  { label: "Performance", href: "/performance/" },
]
