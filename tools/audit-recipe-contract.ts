/**
 * tools/audit-recipe-contract — verifies recipe CSS targets only semantic selectors.
 *
 * Rejects:
 *   - raw class selectors (`.my-class`) without a `[data-*]` qualifier
 *   - ID selectors (`#id`)
 *   - `data-*` attributes outside the semantic vocabulary exported by @solidiom/runtime
 *
 * Permits `[data-scope]`/`[data-part]` attribute selectors, the vocabulary's state,
 * orientation, side, size, and boolean-flag attributes, state pseudo-classes,
 * structural pseudos, pseudo-elements, and element descendant selectors (used by
 * composite scopes such as `prose`).
 *
 * Writes results to docs/evidence/recipe-contract-audit.md.
 *
 * Usage: pnpm run audit:recipe-contract
 */

import { readdirSync, readFileSync, existsSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { writeReportWithStableStamp } from "./report-stamp"
import {
  SEMANTIC_ATTRIBUTES,
  isSemanticAttribute,
} from "../packages/runtime/src/dom/semantic-vocabulary"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT = join(__dirname, "..")
const RECIPES_DIRS = [
  join(ROOT, "packages/recipes-css/src"),
  join(ROOT, "packages/recipes-tailwind/src"),
  join(ROOT, "packages/recipes-unocss/src"),
]
const OUTPUT_DIR = join(ROOT, "docs", "evidence")
const OUTPUT_FILE = join(OUTPUT_DIR, "recipe-contract-audit.md")

interface Violation {
  file: string
  line: number
  selector: string
  reason: string
}

/**
 * Attributes a recipe selector may target, derived from the semantic vocabulary in
 * `@solidiom/runtime` (RECIPE-001b).
 *
 * This replaces a hand-maintained pattern list that was declared but never referenced
 * by the checker, and which allowed attributes `applySemanticAttrs` cannot emit.
 */
const ALLOWED_ATTRIBUTES: readonly string[] = SEMANTIC_ATTRIBUTES

/** Extracts `data-*` attribute names from a selector line. */
function dataAttributesIn(line: string): string[] {
  return [...line.matchAll(/\[(data-[a-z-]+)/g)].map((match) => match[1]!)
}

/** Check if a CSS selector line is allowed. Returns a reason when it is not. */
export function violationReason(line: string): string | undefined {
  // Skip empty lines, imports, comments
  if (
    !line.trim() ||
    line.trim().startsWith("//") ||
    line.trim().startsWith("/*") ||
    line.trim().startsWith("*")
  )
    return
  // Skip lines that are clearly not selectors (properties, values)
  if (
    line.includes(":") &&
    !line.includes("{") &&
    !line.startsWith("[") &&
    !line.startsWith(".") &&
    !line.startsWith("#")
  )
    return
  // Raw class selectors
  if (/^\s*\.[a-zA-Z]/.test(line) && !line.includes("[data-"))
    return "Class selector without data-* qualifier"
  // ID selectors
  if (/^\s*#[a-zA-Z]/.test(line)) return "ID selector"
  // Attributes outside the semantic vocabulary
  const unknown = dataAttributesIn(line).filter((attribute) => !isSemanticAttribute(attribute))
  if (unknown.length > 0)
    return `Attribute outside the semantic vocabulary: ${unknown.join(", ")} (allowed: ${ALLOWED_ATTRIBUTES.join(", ")})`
  return
}

function scanFile(filePath: string): Violation[] {
  const violations: Violation[] = []
  if (!filePath.endsWith(".css")) return violations

  const content = readFileSync(filePath, "utf8")
  const lines = content.split("\n")

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!
    const reason = violationReason(line)
    if (reason) {
      violations.push({
        file: filePath.replace(ROOT + "/", ""),
        line: i + 1,
        selector: line.trim(),
        reason,
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

  // Write report (the writer creates the directory)
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

  writeReportWithStableStamp(OUTPUT_FILE, lines)
  console.log(`${allViolations.length} violations found`)
  console.log(`Report: ${OUTPUT_FILE}`)

  if (allViolations.length > 0) process.exit(1)
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  main()
}
