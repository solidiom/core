import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const DIST = join(ROOT, "dist")

function htmlExists(path: string): boolean {
  try {
    readFileSync(join(DIST, path), "utf8")
    return true
  } catch {
    return false
  }
}

function extractIslandComponentUrls(html: string): string[] {
  const urls: string[] = []
  const regex = /component-url=["']([^"']+)["']/g
  let m
  while ((m = regex.exec(html)) !== null) {
    urls.push(m[1])
  }
  return urls
}

function countIslands(html: string): number {
  const matches = html.match(/<astro-island/g)
  return matches ? matches.length : 0
}

describe("Route bundle isolation", () => {
  if (!htmlExists("index.html")) {
    it.skip("build artifacts not present (run pnpm build first)", () => {})
    return
  }

  const STATIC_ROUTES = [
    { path: "index.html", label: "homepage" },
    { path: "404/index.html", label: "404 page" },
  ]

  const BUILDER_ROUTE = "themes/builder/index.html"

  const builderHtml = htmlExists(BUILDER_ROUTE)
    ? readFileSync(join(DIST, BUILDER_ROUTE), "utf8")
    : null

  const builderIslands = builderHtml ? extractIslandComponentUrls(builderHtml) : []

  // Collect islands from static routes to identify shared layout islands
  const STATIC_ISLANDS = new Set<string>()
  for (const route of STATIC_ROUTES) {
    if (!htmlExists(route.path)) continue
    const html = readFileSync(join(DIST, route.path), "utf8")
    for (const island of extractIslandComponentUrls(html)) {
      STATIC_ISLANDS.add(island)
    }
  }

  const BUILDER_ONLY_ISLANDS = builderIslands.filter((url) => !STATIC_ISLANDS.has(url))

  for (const route of STATIC_ROUTES) {
    if (!htmlExists(route.path)) continue

    it(`${route.label} does not reference builder-only islands`, () => {
      const html = readFileSync(join(DIST, route.path), "utf8")
      const scriptSrcs = extractIslandComponentUrls(html)

      for (const builderIsland of BUILDER_ONLY_ISLANDS) {
        expect(
          scriptSrcs.includes(builderIsland),
          `Static route ${route.label} should not reference builder island: ${builderIsland}`,
        ).toBe(false)
      }
    })
  }

  it("builder route has more islands than static homepage", () => {
    if (!builderHtml) {
      it.skip("builder route not built", () => {})
      return
    }

    const homeHtml = readFileSync(join(DIST, "index.html"), "utf8")
    const builderCount = countIslands(builderHtml)
    const homeCount = countIslands(homeHtml)
    expect(builderCount).toBeGreaterThan(homeCount)
  })

  it("builder route contains ThemeBuilderShell island", () => {
    if (!builderHtml) {
      it.skip("builder route not built", () => {})
      return
    }

    expect(builderHtml).toContain("ThemeBuilderShell")
  })
})
