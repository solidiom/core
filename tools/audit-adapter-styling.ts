/**
 * tools/audit-adapter-styling — verifies adapters do not emit class or style attributes.
 *
 * Inspects every adapter package's source for `class` or `style` attribute
 * assignments on DOM elements. Adapters must NEVER set styling attributes —
 * only primitives (via applySemanticAttrs) and consumers own visual styling.
 *
 * Writes results to docs/adapter-styling-audit.md.
 *
 * Usage: pnpm exec tsx tools/audit-adapter-styling.ts
 */

import { readdirSync, readFileSync, existsSync, statSync, mkdirSync, writeFileSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT = join(__dirname, "..")
const PACKAGES_DIR = join(ROOT, "packages")
const OUTPUT_DIR = join(ROOT, "docs", "evidence")
const OUTPUT_FILE = join(OUTPUT_DIR, "adapter-styling-audit.md")

interface Violation {
  adapter: string
  file: string
  line: number
  content: string
  reason: string
}

/** Check if a package is an adapter (name starts with "adapter-"). */
function isAdapter(name: string): boolean {
  return name.startsWith("adapter-")
}

/** Patterns that indicate styling being set by adapter code. */
const VIOLATION_PATTERNS = [
  { pattern: /\bclass\s*[=:]\s*["'`]/, reason: "Sets class attribute" },
  { pattern: /\bclassName\s*[=:]\s*["'`]/, reason: "Sets className" },
  { pattern: /\bstyle\s*[=:]\s*[{"'`]/, reason: "Sets style attribute" },
  { pattern: /\.classList\.add\(/, reason: "Modifies classList" },
  { pattern: /\.setAttribute\(\s*["']class["']/, reason: "Sets class via setAttribute" },
  { pattern: /\.setAttribute\(\s*["']style["']/, reason: "Sets style via setAttribute" },
]

function scanFile(filePath: string, adapterName: string): Violation[] {
  const violations: Violation[] = []
  const content = readFileSync(filePath, "utf8")
  const lines = content.split("\n")

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!
    // Skip type definitions and imports
    if (line.trim().startsWith("//") || line.trim().startsWith("*") || line.includes("import"))
      continue
    // Skip interface/type definitions
    if (/^\s*(export\s+)?(interface|type)\s/.test(line)) continue
    // Skip prop type declarations (class?: string)
    if (/class\??\s*:\s*(string|JSX)/.test(line)) continue

    for (const { pattern, reason } of VIOLATION_PATTERNS) {
      if (pattern.test(line)) {
        violations.push({
          adapter: adapterName,
          file: filePath.replace(ROOT + "/", ""),
          line: i + 1,
          content: line.trim().slice(0, 80),
          reason,
        })
        break
      }
    }
  }

  return violations
}

function scanAdapter(dir: string, name: string): Violation[] {
  const violations: Violation[] = []
  const srcDir = join(dir, "src")
  if (!existsSync(srcDir)) return violations

  function walk(d: string) {
    for (const entry of readdirSync(d, { withFileTypes: true })) {
      const full = join(d, entry.name)
      if (entry.isDirectory()) walk(full)
      else if (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) {
        violations.push(...scanFile(full, name))
      }
    }
  }

  walk(srcDir)
  return violations
}

function main() {
  console.log("Adapter Styling Audit\n")

  const adapters = readdirSync(PACKAGES_DIR)
    .filter(isAdapter)
    .filter((name) => statSync(join(PACKAGES_DIR, name)).isDirectory())
    .sort()

  const allViolations: Violation[] = []
  for (const adapter of adapters) {
    const violations = scanAdapter(join(PACKAGES_DIR, adapter), adapter)
    allViolations.push(...violations)
  }

  // Write report
  mkdirSync(OUTPUT_DIR, { recursive: true })
  const lines = [
    "# Adapter Styling Audit",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    `Scanned ${adapters.length} adapter package(s): ${adapters.join(", ")}`,
    "",
    "## Summary",
    "",
    allViolations.length === 0
      ? "✓ No adapter sets class or style attributes on DOM elements."
      : `✗ Found ${allViolations.length} violation(s):`,
    "",
  ]

  if (allViolations.length > 0) {
    lines.push("| Adapter | File | Line | Reason |")
    lines.push("|---------|------|------|--------|")
    for (const v of allViolations) {
      lines.push(`| ${v.adapter} | ${v.file} | ${v.line} | ${v.reason} |`)
    }
  } else {
    lines.push("All adapters are styling-free. They return capability snapshots and")
    lines.push("positioning/virtualization data only — no visual output.")
  }

  writeFileSync(OUTPUT_FILE, lines.join("\n") + "\n")
  console.log(`${allViolations.length} violations found`)
  console.log(`Scanned: ${adapters.join(", ")}`)
  console.log(`Report: ${OUTPUT_FILE}`)
}

main()
