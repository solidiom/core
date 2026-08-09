/**
 * Primary navigation link config for SiteHeader.
 *
 * Locale-aware: DOCS-001 added the registry-driven `/primitives/` directory,
 * so navigation now needs a localized label and prefixed href rather than
 * the single unprefixed placeholder link that existed before any catalog
 * route did.
 */

import type { NavLink } from "../components/SiteHeader"
import { localePrefix, type Locale } from "./locale"

const HOME_LABEL: Record<Locale, string> = { en: "Home", es: "Inicio" }
const PRIMITIVES_LABEL: Record<Locale, string> = { en: "Primitives", es: "Primitivas" }

export function getPrimaryLinks(locale: Locale): NavLink[] {
  const prefix = localePrefix(locale)
  return [
    { label: HOME_LABEL[locale], href: `${prefix}/` },
    { label: PRIMITIVES_LABEL[locale], href: `${prefix}/primitives/` },
  ]
}

export const resourceLinks: NavLink[] = [
  { label: "GitHub", href: "https://github.com/solidiom" },
  { label: "Accessibility", href: "/accessibility/" },
  { label: "Performance", href: "/performance/" },
]
