#!/usr/bin/env tsx
/**
 * I18N-003 route-parity validation.
 *
 * Scans src/pages/ for all English (.astro) routes and verifies each has a
 * corresponding /es/ counterpart. Reports mismatches and exits with code 1
 * if any mandatory route is missing its locale pair.
 *
 * Routes that are intentionally locale-agnostic (error pages, API endpoints,
 * sitemap artifacts) are excluded from parity checks.
 */
import { existsSync, readdirSync } from "node:fs"
import { dirname, extname, join, relative, resolve, sep } from "node:path"
import { fileURLToPath } from "node:url"

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const pagesRoot = join(projectRoot, "src", "pages")
const esPagesRoot = join(pagesRoot, "es")

/** Routes excluded from parity checks (locale-agnostic). */
const EXCLUDED_ROUTES = new Set([
  "404.astro",
  "500.astro",
  "robots.txt.ts",
])

/** File extensions considered as page routes. */
const ROUTE_EXTENSIONS = new Set([".astro", ".md", ".mdx"])

/**
 * Recursively collects all route files from a directory.
 * Returns paths relative to the given root.
 */
function collectRoutes(dir: string, root: string): string[] {
  const results: string[] = []

  if (!existsSync(dir)) return results

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...collectRoutes(fullPath, root))
    } else if (ROUTE_EXTENSIONS.has(extname(entry.name))) {
      results.push(relative(root, fullPath).split(sep).join("/"))
    }
  }

  return results.sort()
}

/**
 * Collects English (unprefixed) routes, excluding the /es/ subtree and
 * locale-agnostic files.
 */
function collectEnglishRoutes(): string[] {
  const allRoutes = collectRoutes(pagesRoot, pagesRoot)
  return allRoutes.filter((route) => {
    // Exclude the /es/ subtree (those are Spanish routes)
    if (route.startsWith("es/")) return false
    // Exclude locale-agnostic routes
    if (EXCLUDED_ROUTES.has(route)) return false
    return true
  })
}

/**
 * Collects Spanish routes (under /es/), returned relative to the es/ root.
 */
function collectSpanishRoutes(): string[] {
  return collectRoutes(esPagesRoot, esPagesRoot)
}

interface ParityResult {
  route: string
  status: "ok" | "missing"
}

function validateParity(): ParityResult[] {
  const enRoutes = collectEnglishRoutes()
  const esRoutes = new Set(collectSpanishRoutes())

  return enRoutes.map((route) => ({
    route,
    status: esRoutes.has(route) ? "ok" : "missing",
  }))
}

// ---------------------------------------------------------------------------
// CLI execution
// ---------------------------------------------------------------------------

const results = validateParity()
const missing = results.filter((r) => r.status === "missing")
const ok = results.filter((r) => r.status === "ok")

console.log("I18N-003 Route Parity Report")
console.log("=".repeat(50))
console.log()

if (ok.length > 0) {
  console.log(`Matched (${ok.length}):`)
  for (const r of ok) {
    console.log(`  ✓ ${r.route}`)
  }
  console.log()
}

if (missing.length > 0) {
  console.log(`Missing Spanish routes (${missing.length}):`)
  for (const r of missing) {
    console.log(`  ✗ es/${r.route}`)
  }
  console.log()
  console.log(
    `${missing.length} English route(s) have no Spanish counterpart.`,
  )
  process.exit(1)
}

console.log(
  `All ${results.length} English route(s) have matching Spanish routes.`,
)
