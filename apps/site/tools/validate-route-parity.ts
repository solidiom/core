#!/usr/bin/env tsx
/**
 * I18N-003 route and metadata parity validation.
 *
 * Verifies both directions of the English/Spanish route inventory, requires
 * every public pair to be registered in the canonical locale route set, and
 * rejects translated route files that omit title or description metadata.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs"
import { dirname, extname, join, relative, resolve, sep } from "node:path"
import { fileURLToPath } from "node:url"
import { isLocalizedRoute, LOCALIZED_ROUTE_PATHS, normalizePathname } from "../src/lib/locale"

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const pagesRoot = join(projectRoot, "src", "pages")
const esPagesRoot = join(pagesRoot, "es")
const EXCLUDED_ROUTES = new Set(["404.astro", "500.astro", "robots.txt.ts"])
const ROUTE_EXTENSIONS = new Set([".astro", ".md", ".mdx"])

function collectRoutes(dir: string, root: string): string[] {
  if (!existsSync(dir)) return []

  return readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) => {
      const fullPath = join(dir, entry.name)
      return entry.isDirectory()
        ? collectRoutes(fullPath, root)
        : ROUTE_EXTENSIONS.has(extname(entry.name))
          ? [relative(root, fullPath).split(sep).join("/")]
          : []
    })
    .sort()
}

function publicRouteFiles(root: string, excludeSpanishTree = false): string[] {
  return collectRoutes(root, root).filter(
    (route) => !EXCLUDED_ROUTES.has(route) && !(excludeSpanishTree && route.startsWith("es/")),
  )
}

function routePathname(routeFile: string): string {
  const withoutExtension = routeFile.slice(0, -extname(routeFile).length)
  const segments = withoutExtension.split("/")
  if (segments.at(-1) === "index") segments.pop()
  return normalizePathname(`/${segments.join("/")}`)
}

function sourceMap(root: string, excludeSpanishTree = false): Map<string, string> {
  return new Map(
    publicRouteFiles(root, excludeSpanishTree).map((route) => [routePathname(route), route]),
  )
}

function missingValues(expected: Iterable<string>, actual: Map<string, string>): string[] {
  return [...expected].filter((pathname) => !actual.has(pathname)).sort()
}

const enRoutes = sourceMap(pagesRoot, true)
const esRoutes = sourceMap(esPagesRoot)
const registeredRoutes = new Set<string>(LOCALIZED_ROUTE_PATHS)
const allRoutes = new Set([...enRoutes.keys(), ...esRoutes.keys()])
const missingSpanish = missingValues(enRoutes.keys(), esRoutes)
const missingEnglish = missingValues(esRoutes.keys(), enRoutes)
const generatedRouteTemplate = /^\/primitives\/\[name\]\/\[view\]\/$/
const unregisteredRoutes = [...allRoutes]
  .filter((route) => !isLocalizedRoute(route) && !generatedRouteTemplate.test(route))
  .sort()
const unimplementedRegistryRoutes = [...registeredRoutes]
  .filter((route) => !enRoutes.has(route) || !esRoutes.has(route))
  .sort()

const translatedMetadataErrors = [...esRoutes.entries()].flatMap(([pathname, routeFile]) => {
  const source = readFileSync(join(esPagesRoot, routeFile), "utf8")
  const layoutInvocation = source.match(/<BaseLayout\b[\s\S]*?>/)
  const generatedCatalogRoute =
    /<(PrimitiveRoute|PrimitiveDirectory)\b[\s\S]*?locale=["']es["']/.test(source)
  if (generatedCatalogRoute) return []
  if (!layoutInvocation) {
    return [`${pathname}: does not render BaseLayout or a localized catalog layout`]
  }

  const missing = ["title", "description"].filter(
    (attribute) => !new RegExp(`\\b${attribute}=`).test(layoutInvocation[0]),
  )
  return missing.map((attribute) => `${pathname}: missing localized ${attribute} metadata`)
})

console.log("I18N-003 Route Parity Report")
console.log("=".repeat(50))
console.log()
console.log(
  `Matched localized routes (${[...enRoutes.keys()].filter((route) => esRoutes.has(route)).length}):`,
)
for (const route of [...enRoutes.keys()].filter((route) => esRoutes.has(route)).sort()) {
  console.log(`  ✓ ${route}`)
}

const failures = [
  ...missingSpanish.map((route) => `Missing Spanish route: /es${route === "/" ? "/" : route}`),
  ...missingEnglish.map((route) => `Missing English route: ${route}`),
  ...unregisteredRoutes.map((route) => `Unregistered localized route: ${route}`),
  ...unimplementedRegistryRoutes.map((route) => `Route registry has no complete pair: ${route}`),
  ...translatedMetadataErrors,
]

if (failures.length > 0) {
  console.log()
  console.log(`Failures (${failures.length}):`)
  for (const failure of failures) console.log(`  ✗ ${failure}`)
  process.exitCode = 1
} else {
  console.log()
  console.log(
    `All ${registeredRoutes.size} registered routes have bidirectional parity and localized metadata.`,
  )
}
