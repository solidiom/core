/**
 * Primary navigation link config for SiteHeader.
 *
 * Placeholder route set: only "/" exists as a real route today (SITE-007
 * docs shell, DOCS-001 catalog routes, and MKT-* marketing pages have not
 * landed). Kept as a single small source of truth so header links can be
 * updated in one place as real routes are added, rather than hardcoded
 * inside the component.
 */

import type { NavLink } from "../components/SiteHeader"

export const primaryLinks: NavLink[] = [{ label: "Home", href: "/" }]

export const resourceLinks: NavLink[] = [{ label: "GitHub", href: "https://github.com/solidiom" }]
