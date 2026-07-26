/**
 * tools/audit-recipe-contract — verifies recipe CSS targets only semantic selectors.
 *
 * Greps recipe CSS/TSX for selectors that reference anything other than:
 *   - [data-scope=…][data-part=…] attribute selectors
 *   - :hover, :focus, :focus-visible, :active, :disabled state pseudos
 *   - [data-state=…], [data-disabled], [data-loading] etc. variants
 *
 * Fails on any raw class selector (e.g. `.my-class`) or ID selector (`#id`).
 * Writes results to docs/recipe-contract-audit.md.
 *
 * Usage: pnpm exec tsx tools/audit-recipe-contract.ts
 */

import { readdirSync, readFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT = join(__dirname, "..")
const RECIPES_DIRS = [
  join(ROOT, "packages/recipes-css/src"),
  join(ROOT, "packages/recipes-tailwind/src"),
  join(ROOT, "packages/recipes-unocss/src"),
]
const OUTPUT_DIR = join(ROOT, "docs")
const OUTPUT_FILE = join(OUTPUT_DIR, "recipe-contract-audit.md")

interface Violation {
  file: string
  line: number
  selector: string
  reason: string
}

/** Allowed selector patterns in recipe files. */
const ALLOWED_PATTERNS = [
  /\[data-scope/, // data-scope attribute selector
  /\[data-part/, // data-part attribute selector
  /\[data-state/, // data-state variant
  /\[data-disabled/, // boolean flag
  /\[data-loading/, // boolean flag
  /\[data-readonly/, // boolean flag
  /\[data-invalid/, // boolean flag
  /\[data-required/, // boolean flag
  /\[data-highlighted/, // boolean flag
  /\[data-selected/, // boolean flag
  /\[data-placeholder/, // boolean flag
  /\[data-orientation/, // orientation attr
  /\[data-side/, // side attr
  /\[data-value/, // value attr
  /:hover/, // pseudo state
  /:focus/, // pseudo state
  /:focus-visible/, // pseudo state
  /:focus-within/, // pseudo state
  /:active/, // pseudo state
  /:disabled/, // pseudo state
  /:first-child/, // structural pseudo
  /:last-child/, // structural pseudo
  /::before/, // pseudo element
  /::after/, // pseudo element
]

/** Check if a CSS selector line is allowed. */
function isAllowed(line: string): boolean {
  // Skip empty lines, imports, comments
  if (
    !line.trim() ||
    line.trim().startsWith("//") ||
    line.trim().startsWith("/*") ||
    line.trim().startsWith("*")
  )
    return true
  // Skip lines that are clearly not selectors (properties, values)
  if (
    line.includes(":") &&
    !line.includes("{") &&
    !line.startsWith("[") &&
    !line.startsWith(".") &&
    !line.startsWith("#")
  )
    return true
  // Check for raw class selectors
  if (/^\s*\.[a-zA-Z]/.test(line) && !line.includes("[data-")) return false
  // Check for ID selectors
  if (/^\s*#[a-zA-Z]/.test(line)) return false
  return true
}

function scanFile(filePath: string): Violation[] {
  const violations: Violation[] = []
  if (!filePath.endsWith(".css")) return violations

  const content = readFileSync(filePath, "utf8")
  const lines = content.split("\n")

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!
    if (!isAllowed(line)) {
      violations.push({
        file: filePath.replace(ROOT + "/", ""),
        line: i + 1,
        selector: line.trim(),
        reason: line.trim().startsWith("#")
          ? "ID selector"
          : "Class selector without data-* qualifier",
      })
    }
  }

  return violations
}

function scanDir(dir: string): Violation[] {
  const violations: Violation[] = []
  if (!existsSync(dir)) return violations

  function walk(d: string) {
    for (const entry of readdirSync(d, { withFileTypes: true })) {
      const full = join(d, entry.name)
      if (entry.isDirectory()) walk(full)
      else if (entry.name.endsWith(".css")) violations.push(...scanFile(full))
    }
  }

  walk(dir)
  return violations
}

function main() {
  console.log("Recipe Contract Audit\n")

  const allViolations: Violation[] = []
  for (const dir of RECIPES_DIRS) {
    allViolations.push(...scanDir(dir))
  }

  // Write report
  mkdirSync(OUTPUT_DIR, { recursive: true })
  const lines = [
    "# Recipe Contract Audit",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "## Summary",
    "",
    allViolations.length === 0
      ? "✓ All recipe CSS uses semantic attribute selectors only."
      : `✗ Found ${allViolations.length} violation(s):`,
    "",
  ]

  if (allViolations.length > 0) {
    lines.push("| File | Line | Selector | Reason |")
    lines.push("|------|------|----------|--------|")
    for (const v of allViolations) {
      lines.push(`| ${v.file} | ${v.line} | \`${v.selector}\` | ${v.reason} |`)
    }
  } else {
    lines.push("All recipe stylesheets target `[data-scope][data-part]` selectors,")
    lines.push("state pseudo-classes, and `[data-state]` variants only.")
  }

  writeFileSync(OUTPUT_FILE, lines.join("\n") + "\n")
  console.log(`${allViolations.length} violations found`)
  console.log(`Report: ${OUTPUT_FILE}`)

  if (allViolations.length > 0) process.exit(1)
}

main()
