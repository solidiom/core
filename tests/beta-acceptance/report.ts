#!/usr/bin/env tsx
/**
 * BETA-002: Static build acceptance report.
 *
 * Reads the dist/ directory and verifies:
 * - All expected routes exist
 * - Locale parity (English/Spanish pairs)
 * - Basic HTML structure (lang attr, canonical, hreflang)
 * - Pagefind search index presence
 *
 * Outputs a JSON report to stdout and a summary to stderr.
 * Exits 0 if all gates pass, 1 if any fail.
 */

import { existsSync, readFileSync, readdirSync } from "node:fs"
import { join, relative } from "node:path"
import {
  EXPECTED_STATIC_ROUTES,
  LOCALE_PAIRS,
} from "./matrix.js"

const SITE_ROOT = join(import.meta.dirname, "../../apps/site")
const DIST_ROOT = join(SITE_ROOT, "dist")

interface CheckResult {
  route: string
  check: string
  passed: boolean
  detail?: string
}

interface AreaResult {
  area: string
  checks: CheckResult[]
  passed: number
  failed: number
}

interface Report {
  timestamp: string
  distExists: boolean
  areas: AreaResult[]
  totalPassed: number
  totalFailed: number
  gatePassed: boolean
}

function resolveDistPath(route: string): string {
  if (route.endsWith(".html") || route.endsWith(".txt") || route.endsWith(".xml")) {
    return join(DIST_ROOT, route)
  }
  if (route === "/") {
    return join(DIST_ROOT, "index.html")
  }
  return join(DIST_ROOT, route, "index.html")
}

function routeExists(route: string): { passed: boolean; detail?: string } {
  const path = resolveDistPath(route)
  if (existsSync(path)) return { passed: true }
  return { passed: false, detail: `File not found: ${path}` }
}

function renderHtml(route: string): { passed: boolean; detail?: string } {
  const path = resolveDistPath(route)
  if (!existsSync(path)) return { passed: false, detail: "Route file does not exist" }
  const html = readFileSync(path, "utf8")
  const hasHtmlRoot = /<html[\s>]/i.test(html)
  if (!hasHtmlRoot) return { passed: false, detail: "No <html> root element found" }
  return { passed: true }
}

function hasLocaleAttr(route: string): { passed: boolean; detail?: string } {
  const path = resolveDistPath(route)
  if (!existsSync(path)) return { passed: false, detail: "Route file does not exist" }
  const html = readFileSync(path, "utf8")

  const isSpanish = route.startsWith("/es/") || route === "/es/"
  const expectedLang = isSpanish ? "es" : "en"

  const langMatch = html.match(/<html[^>]*\sdata-i18n="([^"]*)"/)
  const langFromData = langMatch ? langMatch[1] : null
  const langFromAttr = html.match(/<html[^>]*\slang="([^"]*)"/)
  const langFromAttrValue = langFromAttr ? langFromAttr[1] : null

  const detectedLang = langFromData || langFromAttrValue
  if (detectedLang !== expectedLang) {
    return {
      passed: false,
      detail: `Expected lang="${expectedLang}" but found "${detectedLang || "none"}"`,
    }
  }
  return { passed: true }
}

function hasHreflang(route: string): { passed: boolean; detail?: string } {
  const path = resolveDistPath(route)
  if (!existsSync(path)) return { passed: false, detail: "Route file does not exist" }
  const html = readFileSync(path, "utf8")

  const hasHreflang = /<link[^>]*\brel="alternate"[^>]*\bhreflang=/i.test(html) ||
    /<link[^>]*\bhreflang=[^>]*\brel="alternate"/i.test(html)
  if (!hasHreflang) return { passed: false, detail: "No hreflang alternate links found" }

  if (route !== "/") {
    const isSpanish = route.startsWith("/es/")
    const expectedAlt = isSpanish ? 'hreflang="en"' : 'hreflang="es"'
    const hasAlt = html.includes(expectedAlt)
    if (!hasAlt) return { passed: false, detail: `Missing alternate hreflang for ${isSpanish ? "en" : "es"}` }
  }
  return { passed: true }
}

function hasCanonical(route: string): { passed: boolean; detail?: string } {
  const path = resolveDistPath(route)
  if (!existsSync(path)) return { passed: false, detail: "Route file does not exist" }
  const html = readFileSync(path, "utf8")
  const hasCanonical = /<link[^>]*\brel="canonical"/i.test(html)
  if (!hasCanonical) return { passed: false, detail: "No canonical link found" }
  return { passed: true }
}

function runRouteChecks(
  route: string,
  checkIds: string[],
): CheckResult[] {
  const checkers: Record<string, () => { passed: boolean; detail?: string }> = {
    route_exists: () => routeExists(route),
    renders_html: () => renderHtml(route),
    has_locale_attr: () => hasLocaleAttr(route),
    has_hreflang: () => hasHreflang(route),
    has_canonical: () => hasCanonical(route),
  }

  return checkIds.map((id) => {
    const checker = checkers[id]
    if (!checker) {
      return { route, check: id, passed: false, detail: `Unknown check: ${id}` }
    }
    const result = checker()
    return { route, check: id, ...result }
  })
}

function collectDistFiles(): string[] {
  if (!existsSync(DIST_ROOT)) return []
  const files: string[] = []

  const walk = (dir: string, base: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const fullPath = join(dir, entry.name)
      const relPath = join(base, entry.name)
      if (entry.isDirectory()) {
        walk(fullPath, relPath)
      } else {
        files.push(relPath)
      }
    }
  }

  walk(DIST_ROOT, "")
  return files
}

function checkPagefindIndex(): CheckResult {
  const pagefindDir = join(DIST_ROOT, "pagefind")
  if (existsSync(pagefindDir)) {
    return { route: "/pagefind/", check: "search_index_exists", passed: true }
  }
  return {
    route: "/pagefind/",
    check: "search_index_exists",
    passed: false,
    detail: "Pagefind index directory not found in dist/",
  }
}

function main(): void {
  const distExists = existsSync(DIST_ROOT)

  const report: Report = {
    timestamp: new Date().toISOString(),
    distExists,
    areas: [],
    totalPassed: 0,
    totalFailed: 0,
    gatePassed: true,
  }

  if (!distExists) {
    report.gatePassed = false
    report.totalFailed = 1
    console.error("FAIL: dist/ directory does not exist. Run pnpm --filter @solidiom/site build")
    process.stdout.write(JSON.stringify(report, null, 2))
    process.exit(1)
  }

  // Area 1: Route existence
  const routeResults: CheckResult[] = []
  for (const route of EXPECTED_STATIC_ROUTES) {
    routeResults.push({
      route,
      check: "route_exists",
      ...routeExists(route),
    })
  }

  report.areas.push({
    area: "route_existence",
    checks: routeResults,
    passed: routeResults.filter((r) => r.passed).length,
    failed: routeResults.filter((r) => !r.passed).length,
  })

  // Area 2: Locale parity
  const localeChecks: CheckResult[] = []
  for (const pair of LOCALE_PAIRS) {
    const enPath = resolveDistPath(pair.en)
    const esPath = resolveDistPath(pair.es)
    const enExists = existsSync(enPath)
    const esExists = existsSync(esPath)

    if (!enExists || !esExists) {
      localeChecks.push({
        route: `${pair.en} <-> ${pair.es}`,
        check: "locale_parity",
        passed: false,
        detail: !enExists ? `English route missing: ${pair.en}` : `Spanish route missing: ${pair.es}`,
      })
    } else {
      localeChecks.push({
        route: `${pair.en} <-> ${pair.es}`,
        check: "locale_parity",
        passed: true,
      })
    }

    // Check HTML structure on both routes
    const enChecks = runRouteChecks(pair.en, ["renders_html", "has_locale_attr", "has_hreflang", "has_canonical"])
    const esChecks = runRouteChecks(pair.es, ["renders_html", "has_locale_attr", "has_hreflang", "has_canonical"])
    localeChecks.push(...enChecks, ...esChecks)
  }

  report.areas.push({
    area: "locale_parity",
    checks: localeChecks,
    passed: localeChecks.filter((r) => r.passed).length,
    failed: localeChecks.filter((r) => !r.passed).length,
  })

  // Area 3: Search index
  const pagefindResult = checkPagefindIndex()
  report.areas.push({
    area: "search_index",
    checks: [pagefindResult],
    passed: pagefindResult.passed ? 1 : 0,
    failed: pagefindResult.passed ? 0 : 1,
  })

  // Compute totals
  for (const area of report.areas) {
    report.totalPassed += area.passed
    report.totalFailed += area.failed
  }
  report.gatePassed = report.totalFailed === 0

  // Output
  process.stdout.write(JSON.stringify(report, null, 2))

  // Summary to stderr
  console.error("")
  console.error("=".repeat(60))
  console.error("BETA-002: Beta Acceptance Report — Static Build")
  console.error("=".repeat(60))

  for (const area of report.areas) {
    const status = area.failed === 0 ? "PASS" : "FAIL"
    console.error(`  [${status}] ${area.area}: ${area.passed}/${area.passed + area.failed} passed`)
    for (const check of area.checks) {
      if (!check.passed) {
        console.error(`    ✗ ${check.route} — ${check.check}: ${check.detail}`)
      }
    }
  }

  console.error("-".repeat(60))
  console.error(
    `Total: ${report.totalPassed} passed, ${report.totalFailed} failed — ${report.gatePassed ? "GATE PASSED" : "GATE FAILED"}`,
  )
  console.error("=".repeat(60))

  if (!report.gatePassed) {
    process.exit(1)
  }
}

main()