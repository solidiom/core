/**
 * tools/audit-primitives — baseline audit for all layer:primitive packages.
 *
 * Checks each primitive for:
 *   1. JSX import source (solid-js | @solidjs/web | none)
 *   2. JSDoc header on the entry file (source/index.tsx or source/index.ts)
 *   3. Presence of browser test files (*.browser.test.* in src/)
 *   4. Semantic attributes usage (applySemanticAttrs)
 *   5. class prop acceptance
 *   6. createPresence usage (overlay/disclosure primitives only)
 *
 * Outputs:
 *   - Markdown table to stdout
 *   - JSON report to docs/assets/primitives-baseline.json
 *
 * Usage: pnpm exec tsx tools/audit-primitives.ts
 */

import { readdirSync, readFileSync, existsSync, statSync, mkdirSync, writeFileSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT = join(__dirname, "..")
const PACKAGES_DIR = join(ROOT, "packages")
const OUTPUT_DIR = join(ROOT, "docs", "assets")
const OUTPUT_FILE = join(OUTPUT_DIR, "primitives-baseline.json")

/** Overlay/disclosure primitives that must use createPresence for exit animations. */
const OVERLAY_PRIMITIVES = new Set([
  "dialog",
  "popover",
  "menu",
  "tooltip",
  "accordion",
  "drawer",
  "collapsible",
])

// ─── Types ───────────────────────────────────────────────────────────────────

type JsxSource = "solid-js" | "@solidjs/web" | "none"

interface AuditResult {
  name: string
  jsxSource: JsxSource
  hasJsDocHeader: boolean
  hasBrowserTest: boolean
  hasSemanticAttrs: boolean
  hasClassProp: boolean
  /** Only relevant for overlay/disclosure primitives. */
  hasPresenceExport: boolean | "n/a"
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Check if a package dir is a primitive (has "layer:primitive" tag). */
function isPrimitive(pkgDir: string): boolean {
  const pkgPath = join(pkgDir, "package.json")
  if (!existsSync(pkgPath)) return false

  try {
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8")) as Record<string, unknown>
    const nx = pkg["nx"] as Record<string, unknown> | undefined
    const tags = nx?.["tags"] as string[] | undefined
    return tags?.includes("layer:primitive") ?? false
  } catch {
    return false
  }
}

/** Find the entry file path (src/index.tsx preferred, then src/index.ts). */
function findEntryFile(pkgDir: string): string | null {
  const tsx = join(pkgDir, "src", "index.tsx")
  if (existsSync(tsx)) return tsx
  const ts = join(pkgDir, "src", "index.ts")
  if (existsSync(ts)) return ts
  return null
}

/** Check if line 1 of a file starts with a JSDoc block opener. */
function hasJsDocHeader(filePath: string): boolean {
  if (!existsSync(filePath)) return false
  const content = readFileSync(filePath, "utf8")
  return content.startsWith("/**")
}

/**
 * Scan all .tsx files in src/ for `type JSX` imports.
 * Returns the import source: 'solid-js', '@solidjs/web', or 'none'.
 */
function detectJsxSource(pkgDir: string): JsxSource {
  const sourceDir = join(pkgDir, "src")
  if (!existsSync(sourceDir)) return "none"

  const jsxImportPattern = /import\s+{[^}]*\btype\s+JSX\b[^}]*}\s+from\s+["']([^"']+)["']/

  function walk(dir: string): JsxSource | null {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry)
      if (statSync(full).isDirectory()) {
        const result = walk(full)
        if (result) return result
      } else if (entry.endsWith(".tsx")) {
        const content = readFileSync(full, "utf8")
        const match = content.match(jsxImportPattern)
        if (match) {
          const source = match[1]!
          if (source === "@solidjs/web") return "@solidjs/web"
          if (source === "solid-js") return "solid-js"
        }
      }
    }
    return null
  }

  return walk(sourceDir) ?? "none"
}

/** Check if any browser test file (*.browser.test.*) exists in src/ recursively. */
function hasBrowserTest(pkgDir: string): boolean {
  const srcDir = join(pkgDir, "src")
  if (!existsSync(srcDir)) return false

  function walk(dir: string): boolean {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry)
      if (statSync(full).isDirectory()) {
        if (walk(full)) return true
      } else if (/\.browser\.test\./.test(entry)) {
        return true
      }
    }
    return false
  }

  return walk(srcDir)
}

/** Check if applySemanticAttrs is imported or used in src/ */
function hasApplySemanticAttrs(pkgDir: string): boolean {
  const sourceDir = join(pkgDir, "src")
  if (!existsSync(sourceDir)) return false

  function walk(dir: string): boolean {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry)
      if (statSync(full).isDirectory()) {
        if (walk(full)) return true
      } else if (entry.endsWith(".tsx") || entry.endsWith(".ts")) {
        const content = readFileSync(full, "utf8")
        if (content.includes("applySemanticAttrs")) return true
      }
    }
    return false
  }

  return walk(sourceDir)
}

/** Check if primitive props accept class?: string */
function hasClassProp(pkgDir: string): boolean {
  const sourceDir = join(pkgDir, "src")
  if (!existsSync(sourceDir)) return false

  function walk(dir: string): boolean {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry)
      if (statSync(full).isDirectory()) {
        if (walk(full)) return true
      } else if (entry.endsWith(".tsx") || entry.endsWith(".ts")) {
        const content = readFileSync(full, "utf8")
        if (/class\s*\?:\s*string/.test(content) || /class\s*:\s*string/.test(content)) return true
      }
    }
    return false
  }

  return walk(sourceDir)
}

/** Check if createPresence is imported or used in src/ (for overlay primitives). */
function hasPresenceUsage(pkgDir: string): boolean {
  const sourceDir = join(pkgDir, "src")
  if (!existsSync(sourceDir)) return false

  function walk(dir: string): boolean {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry)
      if (statSync(full).isDirectory()) {
        if (walk(full)) return true
      } else if (entry.endsWith(".tsx") || entry.endsWith(".ts")) {
        const content = readFileSync(full, "utf8")
        if (content.includes("createPresence")) return true
      }
    }
    return false
  }

  return walk(sourceDir)
}

// ─── Main ────────────────────────────────────────────────────────────────────

function main(): void {
  const packageDirs = readdirSync(PACKAGES_DIR)
    .map((name) => ({ name, path: join(PACKAGES_DIR, name) }))
    .filter((d) => statSync(d.path).isDirectory())
    .filter((d) => isPrimitive(d.path))
    .sort((a, b) => a.name.localeCompare(b.name))

  const results: AuditResult[] = []

  for (const { name, path: pkgDir } of packageDirs) {
    const entryFile = findEntryFile(pkgDir)
    const isOverlay = OVERLAY_PRIMITIVES.has(name)

    results.push({
      name,
      jsxSource: detectJsxSource(pkgDir),
      hasJsDocHeader: entryFile ? hasJsDocHeader(entryFile) : false,
      hasBrowserTest: hasBrowserTest(pkgDir),
      hasSemanticAttrs: hasApplySemanticAttrs(pkgDir),
      hasClassProp: hasClassProp(pkgDir),
      hasPresenceExport: isOverlay ? hasPresenceUsage(pkgDir) : "n/a",
    })
  }

  // Print markdown table
  console.log("")
  console.log("| Primitive | JSX Source | JSDoc | Browser Test | Semantics | class | Presence |")
  console.log("|-----------|------------|-------|--------------|-----------|-------|----------|")
  for (const r of results) {
    const jsx = r.jsxSource === "none" ? "—" : r.jsxSource
    const jsdoc = r.hasJsDocHeader ? "✓" : "✗"
    const browser = r.hasBrowserTest ? "✓" : "✗"
    const sem = r.hasSemanticAttrs ? "✓" : "✗"
    const cls = r.hasClassProp ? "✓" : "✗"
    const pres = r.hasPresenceExport === "n/a" ? "—" : r.hasPresenceExport ? "✓" : "✗"
    console.log(`| ${r.name} | ${jsx} | ${jsdoc} | ${browser} | ${sem} | ${cls} | ${pres} |`)
  }
  console.log("")

  // Summary — pass requires: JSDoc + BrowserTest + Semantics + class + (Presence if overlay)
  const passCount = results.filter((r) => {
    const base = r.hasJsDocHeader && r.hasBrowserTest && r.hasSemanticAttrs && r.hasClassProp
    if (r.hasPresenceExport === "n/a") return base
    return base && r.hasPresenceExport
  }).length
  const fixCount = results.length - passCount
  console.log(`${passCount} pass, ${fixCount} need fix`)

  // Write JSON
  mkdirSync(OUTPUT_DIR, { recursive: true })
  const report = {
    generatedAt: new Date().toISOString(),
    total: results.length,
    pass: passCount,
    needFix: fixCount,
    results,
  }
  writeFileSync(OUTPUT_FILE, JSON.stringify(report, null, 2) + "\n")
  console.log(`wrote ${OUTPUT_FILE}`)
}

main()
