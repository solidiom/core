#!/usr/bin/env tsx
/**
 * REG-007 registry → route invariant.
 *
 * Every registry primitive (a public deliverable) must generate exactly one
 * overview route and exactly one route per catalog view (`api`, `examples`,
 * `accessibility`) in each supported locale — no missing route, no duplicate
 * output file, and no orphan generated route that has no backing registry
 * entry. This check runs against the built static output in `dist/` so it
 * verifies what Astro actually emitted, not just what the loader intended to
 * emit.
 *
 * Also validates content-collection-based layers: components, blocks,
 * templates, and themes — ensuring every entry in the Astro content
 * collections generates routes in both locales.
 *
 * Usage: tsx ./tools/validate-registry-route-invariant.ts [--dist <path>]
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const workspaceRoot = resolve(projectRoot, "..", "..")

const distArgIndex = process.argv.indexOf("--dist")
const distDir =
  distArgIndex !== -1 && process.argv[distArgIndex + 1]
    ? resolve(process.argv[distArgIndex + 1]!)
    : join(projectRoot, "dist")

const REGISTRY_INDEX_PATH = join(workspaceRoot, "registry", "index.json")
const VIEWS = ["api", "examples", "accessibility"] as const
const LOCALE_PREFIXES = { en: "", es: "/es" } as const

// ─── Types ──────────────────────────────────────────────────────────────────

interface RegistryIndex {
  version: number
  primitives: Array<{ name: string; deliverables: string[] }>
  components?: Array<{ name: string; deliverables: string[] }>
  blocks?: Array<{ name: string; deliverables: string[] }>
  templates?: Array<{ name: string; deliverables: string[] }>
  themes?: Array<{ name: string; deliverables: string[] }>
}

type CatalogLayer = "components" | "blocks" | "templates" | "themes"

// ─── Helpers ────────────────────────────────────────────────────────────────

function readRegistry(): RegistryIndex {
  if (!existsSync(REGISTRY_INDEX_PATH)) {
    console.error(`✗ registry/index.json not found at ${REGISTRY_INDEX_PATH}`)
    process.exit(1)
  }
  return JSON.parse(readFileSync(REGISTRY_INDEX_PATH, "utf8")) as RegistryIndex
}

/** Collects every directory under `dist` that contains an index.html, as a route pathname set. */
function collectBuiltRoutePaths(dir: string, base = ""): string[] {
  if (!existsSync(dir)) return []
  const routes: string[] = []
  const entries = readdirSync(dir, { withFileTypes: true })

  if (entries.some((e) => e.isFile() && e.name === "index.html")) {
    routes.push(base === "" ? "/" : `${base}/`)
  }

  for (const entry of entries) {
    if (entry.isDirectory()) {
      routes.push(...collectBuiltRoutePaths(join(dir, entry.name), `${base}/${entry.name}`))
    }
  }
  return routes
}

function checkExactlyOne(
  path: string,
  label: string,
  builtRoutes: Set<string>,
  failures: string[],
  routeUsage: Map<string, number>,
): void {
  routeUsage.set(path, (routeUsage.get(path) ?? 0) + 1)
  if ((routeUsage.get(path) ?? 0) > 1) {
    failures.push(`Duplicate route registration for ${label}: ${path}`)
    return
  }
  if (!builtRoutes.has(path)) {
    failures.push(`Missing built route for ${label}: expected ${path}`)
  }
}

// ─── Primitive checks ───────────────────────────────────────────────────────

function checkPrimitives(
  registry: RegistryIndex,
  builtRoutes: Set<string>,
  failures: string[],
  routeUsage: Map<string, number>,
): void {
  const primitiveNames = registry.primitives
    .filter((p) => p.deliverables.includes("primitive"))
    .map((p) => p.name)
    .sort()

  for (const name of primitiveNames) {
    for (const [locale, prefix] of Object.entries(LOCALE_PREFIXES) as Array<[string, string]>) {
      const overviewPath = `${prefix}/primitives/${name}/`
      checkExactlyOne(
        overviewPath,
        `${name} (${locale} overview)`,
        builtRoutes,
        failures,
        routeUsage,
      )

      for (const view of VIEWS) {
        const viewPath = `${prefix}/primitives/${name}/${view}/`
        checkExactlyOne(
          viewPath,
          `${name} (${locale} ${view})`,
          builtRoutes,
          failures,
          routeUsage,
        )
      }
    }
  }

  // Orphan detection for primitives
  const primitiveRoutePattern = /^(\/es)?\/primitives\/([^/]+)\/(api|examples|accessibility)?\/?$/
  for (const route of builtRoutes) {
    const match = route.match(primitiveRoutePattern)
    if (!match) continue
    const [, , name] = match
    if (name && name !== "" && !primitiveNames.includes(name)) {
      failures.push(`Orphan route ${route} has no matching registry primitive "${name}"`)
    }
  }
}

// ─── Content-collection layer checks ────────────────────────────────────────

function checkCatalogLayer(
  layer: CatalogLayer,
  registry: RegistryIndex,
  builtRoutes: Set<string>,
  failures: string[],
  routeUsage: Map<string, number>,
): void {
  const entries = registry[layer]
  if (!entries || entries.length === 0) {
    return
  }

  const names = entries
    .filter((e) => e.deliverables.includes(layer))
    .map((e) => e.name)
    .sort()

  for (const name of names) {
    for (const [locale, prefix] of Object.entries(LOCALE_PREFIXES) as Array<[string, string]>) {
      const overviewPath = `${prefix}/${layer}/${name}/`
      checkExactlyOne(
        overviewPath,
        `${name} (${locale} ${layer} overview)`,
        builtRoutes,
        failures,
        routeUsage,
      )

      for (const view of VIEWS) {
        const viewPath = `${prefix}/${layer}/${name}/${view}/`
        checkExactlyOne(
          viewPath,
          `${name} (${locale} ${layer} ${view})`,
          builtRoutes,
          failures,
          routeUsage,
        )
      }
    }
  }

  // Note: orphan detection is intentionally NOT applied to content-collection
  // layers. Unlike primitives (registry-driven), these layers can have content
  // entries that exist without a registry manifest. The invariant is one-way:
  // registry entries MUST have routes; extra content-generated routes are valid.
}

// ─── Main ───────────────────────────────────────────────────────────────────

function main(): void {
  if (!existsSync(distDir) || !statSync(distDir).isDirectory()) {
    console.error(
      `✗ Build output not found at ${distDir}. Run \`pnpm --filter @solidiom/site build\` first.`,
    )
    process.exit(1)
  }

  const registry = readRegistry()
  const builtRoutes = new Set(collectBuiltRoutePaths(distDir))

  const failures: string[] = []
  const routeUsage = new Map<string, number>()

  checkPrimitives(registry, builtRoutes, failures, routeUsage)

  for (const layer of ["components", "blocks", "templates", "themes"] as CatalogLayer[]) {
    checkCatalogLayer(layer, registry, builtRoutes, failures, routeUsage)
  }

  console.log("REG-007 Registry → Route Invariant Report")
  console.log("=".repeat(50))
  console.log(`Registry primitives checked: ${registry.primitives.length}`)
  const layers: CatalogLayer[] = ["components", "blocks", "templates", "themes"]
  for (const layer of layers) {
    const count = registry[layer]?.length ?? 0
    console.log(`Registry ${layer} checked: ${count}`)
  }
  console.log(`Routes expected: ${routeUsage.size}`)
  console.log()

  if (failures.length > 0) {
    console.log(`Failures (${failures.length}):`)
    for (const failure of failures) console.log(`  ✗ ${failure}`)
    process.exitCode = 1
    return
  }

  console.log(
    `Every registry deliverable generates exactly one valid route per view/locale, with no duplicates or orphans.`,
  )
}

main()