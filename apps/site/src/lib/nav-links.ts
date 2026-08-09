/**
 * Primary navigation link config for SiteHeader.
 *
 * Option D layout: top-level links for the user journey (Primitives →
 * Components → Templates → Themes) plus a "Docs" dropdown for reference
 * material (CLI, Blocks, Recipes, Guides, etc.).
 */

import type { NavLink } from "../components/SiteHeader"
import { localePrefix, type Locale } from "./locale"

const HOME_LABEL: Record<Locale, string> = { en: "Home", es: "Inicio" }
const PRIMITIVES_LABEL: Record<Locale, string> = { en: "Primitives", es: "Primitivas" }
const COMPONENTS_LABEL: Record<Locale, string> = { en: "Components", es: "Componentes" }
const TEMPLATES_LABEL: Record<Locale, string> = { en: "Templates", es: "Plantillas" }
const THEMES_LABEL: Record<Locale, string> = { en: "Themes", es: "Temas" }

export const DOCS_DROPDOWN_LABEL: Record<Locale, string> = { en: "Docs", es: "Docs" }

export function getPrimaryLinks(locale: Locale): NavLink[] {
  const prefix = localePrefix(locale)
  return [
    { label: HOME_LABEL[locale], href: `${prefix}/` },
    { label: PRIMITIVES_LABEL[locale], href: `${prefix}/primitives/` },
    { label: COMPONENTS_LABEL[locale], href: `${prefix}/components/` },
    { label: TEMPLATES_LABEL[locale], href: `${prefix}/templates/` },
    { label: THEMES_LABEL[locale], href: `${prefix}/themes/` },
  ]
}

export function getDocsLinks(locale: Locale): NavLink[] {
  const prefix = localePrefix(locale)
  return [
    { label: "CLI", href: `${prefix}/primitives/` },
    { label: locale === "es" ? "Bloques" : "Blocks", href: `${prefix}/blocks/` },
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

