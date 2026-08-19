#!/usr/bin/env tsx
/**
 * SITE-013 route bundle and hydration reporting tool.
 *
 * Analyzes the production build output (`dist/`) to report per-route:
 * - Static HTML size
 * - JavaScript bundle sizes (framework + island hydration scripts)
 * - CSS asset sizes
 * - Hydration island count and total island JS cost
 * - Total transfer size estimate (gzip)
 *
 * Outputs a JSON report to `dist/budget-report.json` and a human-readable
 * summary to stdout. Optionally enforces budget thresholds when a budget
 * configuration file exists at `tools/route-budgets.json`.
 *
 * Usage:
 *   pnpm run budget-report            # generate report
 *   pnpm run budget-report --enforce   # fail if budgets exceeded
 *   pnpm run budget-report --json      # output JSON only (for CI artifacts)
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, extname, join, relative, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { gzipSync } from "node:zlib"

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const distRoot = join(projectRoot, "dist")
const budgetConfigPath = join(projectRoot, "tools", "route-budgets.json")
const reportOutputPath = join(distRoot, "budget-report.json")

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RouteReport {
  /** Route path (e.g. "/", "/404/") */
  route: string
  /** Raw HTML file size in bytes */
  htmlSize: number
  /** Gzipped HTML size in bytes */
  htmlGzipSize: number
  /** Number of hydration islands detected in the HTML */
  islandCount: number
  /** JS files referenced by this route (relative paths) */
  scripts: ScriptEntry[]
  /** Total raw JS bytes for this route */
  totalJsSize: number
  /** Total gzipped JS bytes for this route */
  totalJsGzipSize: number
  /** CSS files referenced by this route (relative paths) */
  stylesheets: StylesheetEntry[]
  /** Total raw CSS bytes for this route */
  totalCssSize: number
  /** Total gzipped CSS bytes for this route */
  totalCssGzipSize: number
  /** Total transfer size estimate (HTML + JS + CSS, all gzipped) */
  totalTransferSize: number
}

interface ScriptEntry {
  path: string
  size: number
  gzipSize: number
}

interface StylesheetEntry {
  path: string
  size: number
  gzipSize: number
}

interface BudgetReport {
  generatedAt: string
  buildDirectory: string
  routes: RouteReport[]
  summary: BudgetSummary
}

interface BudgetSummary {
  totalRoutes: number
  totalHtmlSize: number
  totalJsSize: number
  totalCssSize: number
  totalIslands: number
  /** Unique JS assets across all routes */
  uniqueJsAssets: number
  /** Unique CSS assets across all routes */
  uniqueCssAssets: number
}

interface BudgetThresholds {
  /** Per-route budgets by route category */
  categories: {
    content: RouteBudget
    catalog: RouteBudget
    tool: RouteBudget
  }
  /** Global limits */
  global: {
    /** Max unique JS assets across all routes */
    maxUniqueJsAssets: number
    /** Max total JS size (all unique assets combined, gzipped) */
    maxTotalJsGzipSize: number
  }
}

interface RouteBudget {
  /** Max gzipped HTML size per route in bytes */
  maxHtmlGzipSize: number
  /** Max total gzipped JS per route in bytes */
  maxJsGzipSize: number
  /** Max hydration islands per route */
  maxIslands: number
  /** Max total transfer size (gzipped HTML + JS + CSS) */
  maxTransferSize: number
}

interface BudgetViolation {
  route: string
  category: string
  field: string
  actual: number
  budget: number
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function gzipSize(content: Buffer | string): number {
  const buffer = typeof content === "string" ? Buffer.from(content) : content
  return gzipSync(buffer, { level: 9 }).length
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} kB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function walkHtmlFiles(directory: string, base = directory): string[] {
  const files: string[] = []
  if (!existsSync(directory)) return files

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const fullPath = join(directory, entry.name)
    if (entry.isDirectory()) {
      // Skip pagefind index directory
      if (entry.name === "pagefind") continue
      files.push(...walkHtmlFiles(fullPath, base))
    } else if (entry.isFile() && extname(entry.name) === ".html") {
      files.push(fullPath)
    }
  }
  return files.sort()
}

function htmlPathToRoute(htmlPath: string, root: string): string {
  const rel = relative(root, htmlPath)
  // index.html → /
  // 404/index.html → /404/
  // primitives/dialog/index.html → /primitives/dialog/
  if (rel === "index.html") return "/"
  const dir = dirname(rel)
  const base =
    rel.endsWith("/index.html") || rel.endsWith("index.html") ? dir : rel.replace(/\.html$/, "")
  return `/${base}/`.replace(/\/+/g, "/")
}

/**
 * Extract script src attributes from HTML content.
 * Astro emits `<script type="module" src="...">` for island hydration.
 */
function extractScripts(html: string): string[] {
  const pattern = /<script[^>]+src=["']([^"']+)["'][^>]*>/gi
  const sources: string[] = []
  let match: RegExpExecArray | null
  while ((match = pattern.exec(html)) !== null) {
    sources.push(match[1])
  }
  return sources
}

/**
 * Extract stylesheet link hrefs from HTML content.
 */
function extractStylesheets(html: string): string[] {
  const pattern = /<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["'][^>]*>/gi
  const altPattern = /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']stylesheet["'][^>]*>/gi
  const sources: string[] = []
  let match: RegExpExecArray | null
  while ((match = pattern.exec(html)) !== null) {
    sources.push(match[1])
  }
  while ((match = altPattern.exec(html)) !== null) {
    if (!sources.includes(match[1])) sources.push(match[1])
  }
  return sources
}

/**
 * Count Astro hydration islands. Astro marks islands with `astro-island` custom elements.
 */
function countIslands(html: string): number {
  const pattern = /<astro-island[\s>]/gi
  let count = 0
  while (pattern.exec(html) !== null) count++
  return count
}

/**
 * Resolve a script/stylesheet path relative to the dist directory.
 * Handles absolute paths (starting with /) and relative paths.
 */
function resolveAssetPath(src: string, root: string): string | undefined {
  // Strip leading slash for filesystem resolution
  const cleaned = src.startsWith("/") ? src.slice(1) : src
  const fullPath = join(root, cleaned)
  if (existsSync(fullPath)) return fullPath
  return undefined
}

/**
 * Determine the budget category for a route.
 */
function categorizeRoute(route: string): "content" | "catalog" | "tool" {
  if (route.startsWith("/playground/") || route.startsWith("/themes/builder/")) {
    return "tool"
  }
  if (
    route.startsWith("/primitives/") ||
    route.startsWith("/components/") ||
    route.startsWith("/blocks/") ||
    route.startsWith("/templates/")
  ) {
    return "catalog"
  }
  return "content"
}

// ---------------------------------------------------------------------------
// Analysis
// ---------------------------------------------------------------------------

function analyzeRoute(htmlPath: string, root: string): RouteReport {
  const html = readFileSync(htmlPath, "utf8")
  const htmlBuffer = Buffer.from(html)
  const route = htmlPathToRoute(htmlPath, root)

  const scriptSrcs = extractScripts(html)
  const stylesheetHrefs = extractStylesheets(html)
  const islandCount = countIslands(html)

  const scripts: ScriptEntry[] = []
  for (const src of scriptSrcs) {
    const assetPath = resolveAssetPath(src, root)
    if (assetPath) {
      const content = readFileSync(assetPath)
      scripts.push({
        path: src,
        size: content.length,
        gzipSize: gzipSize(content),
      })
    } else {
      // External script — record path but no size
      scripts.push({ path: src, size: 0, gzipSize: 0 })
    }
  }

  const stylesheets: StylesheetEntry[] = []
  for (const href of stylesheetHrefs) {
    const assetPath = resolveAssetPath(href, root)
    if (assetPath) {
      const content = readFileSync(assetPath)
      stylesheets.push({
        path: href,
        size: content.length,
        gzipSize: gzipSize(content),
      })
    } else {
      stylesheets.push({ path: href, size: 0, gzipSize: 0 })
    }
  }

  const totalJsSize = scripts.reduce((sum, s) => sum + s.size, 0)
  const totalJsGzipSize = scripts.reduce((sum, s) => sum + s.gzipSize, 0)
  const totalCssSize = stylesheets.reduce((sum, s) => sum + s.size, 0)
  const totalCssGzipSize = stylesheets.reduce((sum, s) => sum + s.gzipSize, 0)
  const htmlGzipSize = gzipSize(htmlBuffer)

  return {
    route,
    htmlSize: htmlBuffer.length,
    htmlGzipSize,
    islandCount,
    scripts,
    totalJsSize,
    totalJsGzipSize,
    stylesheets,
    totalCssSize,
    totalCssGzipSize,
    totalTransferSize: htmlGzipSize + totalJsGzipSize + totalCssGzipSize,
  }
}

function generateReport(): BudgetReport {
  if (!existsSync(distRoot)) {
    console.error(`Build directory not found: ${distRoot}`)
    console.error("Run 'pnpm run build' first to generate the production output.")
    process.exit(1)
  }

  const htmlFiles = walkHtmlFiles(distRoot)
  if (htmlFiles.length === 0) {
    console.error("No HTML files found in the build output.")
    process.exit(1)
  }

  const routes = htmlFiles.map((file) => analyzeRoute(file, distRoot))

  // Compute summary
  const allJsAssets = new Set<string>()
  const allCssAssets = new Set<string>()
  for (const route of routes) {
    for (const script of route.scripts) allJsAssets.add(script.path)
    for (const stylesheet of route.stylesheets) allCssAssets.add(stylesheet.path)
  }

  const summary: BudgetSummary = {
    totalRoutes: routes.length,
    totalHtmlSize: routes.reduce((sum, r) => sum + r.htmlSize, 0),
    totalJsSize: routes.reduce((sum, r) => sum + r.totalJsSize, 0),
    totalCssSize: routes.reduce((sum, r) => sum + r.totalCssSize, 0),
    totalIslands: routes.reduce((sum, r) => sum + r.islandCount, 0),
    uniqueJsAssets: allJsAssets.size,
    uniqueCssAssets: allCssAssets.size,
  }

  return {
    generatedAt: new Date().toISOString(),
    buildDirectory: relative(projectRoot, distRoot),
    routes,
    summary,
  }
}

// ---------------------------------------------------------------------------
// Budget enforcement
// ---------------------------------------------------------------------------

function loadBudgets(): BudgetThresholds | undefined {
  if (!existsSync(budgetConfigPath)) return undefined
  try {
    return JSON.parse(readFileSync(budgetConfigPath, "utf8")) as BudgetThresholds
  } catch (error) {
    console.error(`Failed to parse budget configuration: ${budgetConfigPath}`)
    console.error(error)
    process.exit(1)
  }
}

function checkBudgets(report: BudgetReport, budgets: BudgetThresholds): BudgetViolation[] {
  const violations: BudgetViolation[] = []

  for (const route of report.routes) {
    const category = categorizeRoute(route.route)
    const limits = budgets.categories[category]

    if (route.htmlGzipSize > limits.maxHtmlGzipSize) {
      violations.push({
        route: route.route,
        category,
        field: "htmlGzipSize",
        actual: route.htmlGzipSize,
        budget: limits.maxHtmlGzipSize,
      })
    }
    if (route.totalJsGzipSize > limits.maxJsGzipSize) {
      violations.push({
        route: route.route,
        category,
        field: "totalJsGzipSize",
        actual: route.totalJsGzipSize,
        budget: limits.maxJsGzipSize,
      })
    }
    if (route.islandCount > limits.maxIslands) {
      violations.push({
        route: route.route,
        category,
        field: "islandCount",
        actual: route.islandCount,
        budget: limits.maxIslands,
      })
    }
    if (route.totalTransferSize > limits.maxTransferSize) {
      violations.push({
        route: route.route,
        category,
        field: "totalTransferSize",
        actual: route.totalTransferSize,
        budget: limits.maxTransferSize,
      })
    }
  }

  // Global checks
  if (report.summary.uniqueJsAssets > budgets.global.maxUniqueJsAssets) {
    violations.push({
      route: "(global)",
      category: "global",
      field: "uniqueJsAssets",
      actual: report.summary.uniqueJsAssets,
      budget: budgets.global.maxUniqueJsAssets,
    })
  }

  return violations
}

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------

function printSummary(report: BudgetReport): void {
  console.log("\n━━━ SITE-013 Route Bundle & Hydration Report ━━━\n")
  console.log(`Generated: ${report.generatedAt}`)
  console.log(`Routes analyzed: ${report.summary.totalRoutes}`)
  console.log(`Unique JS assets: ${report.summary.uniqueJsAssets}`)
  console.log(`Unique CSS assets: ${report.summary.uniqueCssAssets}`)
  console.log("")

  // Per-route table
  const header = `${"Route".padEnd(40)} ${"HTML (gz)".padStart(10)} ${"JS (gz)".padStart(10)} ${"CSS (gz)".padStart(10)} ${"Islands".padStart(8)} ${"Transfer".padStart(10)}`
  console.log(header)
  console.log("─".repeat(header.length))

  for (const route of report.routes) {
    const line = `${route.route.padEnd(40)} ${formatBytes(route.htmlGzipSize).padStart(10)} ${formatBytes(route.totalJsGzipSize).padStart(10)} ${formatBytes(route.totalCssGzipSize).padStart(10)} ${String(route.islandCount).padStart(8)} ${formatBytes(route.totalTransferSize).padStart(10)}`
    console.log(line)
  }

  console.log("")
  console.log(`Total HTML: ${formatBytes(report.summary.totalHtmlSize)} raw`)
  console.log(`Total JS:   ${formatBytes(report.summary.totalJsSize)} raw`)
  console.log(`Total CSS:  ${formatBytes(report.summary.totalCssSize)} raw`)
  console.log(`Islands:    ${report.summary.totalIslands} across all routes`)
  console.log("")
}

function printViolations(violations: BudgetViolation[]): void {
  if (violations.length === 0) {
    console.log("All routes within budget thresholds.\n")
    return
  }

  console.error(`\n${violations.length} budget violation(s) found:\n`)
  for (const v of violations) {
    console.error(
      `  OVER BUDGET: ${v.route} [${v.category}] ${v.field}: ${formatBytes(v.actual)} exceeds ${formatBytes(v.budget)}`,
    )
  }
  console.error("")
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const args = process.argv.slice(2)
const jsonOnly = args.includes("--json")
const enforce = args.includes("--enforce")

const report = generateReport()

// Write report file
writeFileSync(reportOutputPath, JSON.stringify(report, null, 2))

if (jsonOnly) {
  console.log(JSON.stringify(report, null, 2))
} else {
  printSummary(report)
  console.log(`Report saved to: ${relative(projectRoot, reportOutputPath)}`)
}

// Budget enforcement
if (enforce) {
  const budgets = loadBudgets()
  if (!budgets) {
    console.log(
      "\nNo budget configuration found at tools/route-budgets.json — skipping enforcement.",
    )
    console.log("Create the file to enable CI budget checks.\n")
  } else {
    const violations = checkBudgets(report, budgets)
    printViolations(violations)
    if (violations.length > 0) {
      process.exit(1)
    }
  }
}
