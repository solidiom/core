/**
 * Registry of all Solidiom primitives for documentation routing and metadata.
 *
 * Auto-generated from registry/index.json — run `pnpm registry:build` to update.
 * Metadata (label, description, category) is sourced from each primitive's
 * package.json `nx.metadata` field.
 */

import registryData from "@solidiom/registry"

export interface PrimitiveEntry {
  /** Package name without scope (e.g. "dialog") */
  name: string
  /** Human-readable display label */
  label: string
  /** Short description */
  description: string
  /** npm package name */
  packageName: string
  /** Category for grouping in the sidebar */
  category: "overlay" | "input" | "layout" | "feedback" | "navigation"
}

type Category = PrimitiveEntry["category"]

const VALID_CATEGORIES: Set<string> = new Set([
  "overlay",
  "input",
  "layout",
  "feedback",
  "navigation",
])

/**
 * All primitives with complete metadata (label, description, category).
 * Primitives without metadata (umbrella re-exports, test fixtures) are excluded.
 */
export const primitives: PrimitiveEntry[] = registryData.primitives
  .filter(
    (p): p is typeof p & { label: string; description: string; category: string } =>
      !!p.label && !!p.description && !!p.category && VALID_CATEGORIES.has(p.category),
  )
  .map((p) => ({
    name: p.name,
    label: p.label,
    description: p.description,
    packageName: p.package,
    category: p.category as Category,
  }))

export function getPrimitive(name: string): PrimitiveEntry | undefined {
  return primitives.find((p) => p.name === name)
}

export function getPrimitivesByCategory(category: Category): PrimitiveEntry[] {
  return primitives.filter((p) => p.category === category)
}
