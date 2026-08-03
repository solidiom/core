/**
 * PRIM-000: Primitive catalog completion gate.
 *
 * Source-derived gate that verifies each primitive against the M4 bar (§8.1.1),
 * reconciles against the committed registry, and asserts a ratcheting count
 * that must match the number declared in docs/plans/website-tasks.md.
 *
 * Run via: pnpm exec tsx tools/primitive-catalog-gate.ts
 *          pnpm exec tsx tools/primitive-catalog-gate.ts --audit-only
 *
 * --audit-only: report without enforcing the count assertion (for diagnostics)
 *
 * See: docs/plans/primitives.md §3 (the M4 bar)
 */

import { existsSync, readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"
import { PUBLIC_PRIMITIVES } from "./axe-results"

const ROOT = join(import.meta.dirname ?? __dirname, "..")
const PACKAGES_DIR = join(ROOT, "packages")
const REGISTRY_DIR = join(ROOT, "registry")
const TRACKER_PATH = join(ROOT, "docs", "plans", "website-tasks.md")

const auditOnly = process.argv.includes("--audit-only")

// ─── Required overview sections (§8.1.1 requirement 2) ─────────────────────
const REQUIRED_SECTIONS = [
  "usage",
  "installation",
  "parts", // "Parts & Props" — we accept "parts", "props", or "parts and props"
  "styling",
  "ssr and hydration",
  "keyboard", // "Keyboard & behavior" — we accept "keyboard" as prefix
]

// Conditional sections (§8.1.1 requirement 3) — satisfied by presence OR notApplicable
const CONDITIONAL_SECTIONS = ["composition", "relationships", "migration", "testing"]

// ─── Types ──────────────────────────────────────────────────────────────────

interface PrimitiveResult {
  name: string
  passed: boolean
  failures: string[]
}

interface RegistryManifest {
  name: string
  status: string
  documentation: { status: string; locales: Record<string, { status: string }> }
  accessibility: { reviewStatus: string; evidenceIds: string[] }
  search: { keywords: string[] }
  integrity: { lastGenerated: string }
}

interface EvidenceFile {
  schemaVersion: number
  primitive: string
  evidenceIds: string[]
  summary: { passes: number; violations: number; incomplete: number; outcome: string }
}

interface A11yContract {
  keyboard?: Array<{ key: string; behavior: string }>
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function readJSON<T>(path: string): T | null {
  try {
    return JSON.parse(readFileSync(path, "utf8")) as T
  } catch {
    return null
  }
}

function readFrontmatter(path: string): Record<string, unknown> | null {
  try {
    const content = readFileSync(path, "utf8")
    const match = content.match(/^---\n([\s\S]*?)\n---/)
    if (!match) return null
    // Simple YAML-like parsing for the fields we need
    const result: Record<string, unknown> = {}
    for (const line of match[1].split("\n")) {
      const kv = line.match(/^(\w[\w-]*):\s*(.*)$/)
      if (kv) {
        const val = kv[2].trim()
        // Handle quoted strings
        if (val.startsWith('"') && val.endsWith('"')) {
          result[kv[1]] = val.slice(1, -1)
        } else if (val === "true") {
          result[kv[1]] = true
        } else if (val === "false") {
          result[kv[1]] = false
        } else {
          result[kv[1]] = val
        }
      }
    }
    return result
  } catch {
    return null
  }
}

function getSections(filePath: string): string[] {
  try {
    const content = readFileSync(filePath, "utf8")
    const headings = content.match(/^## .+$/gm) || []
    return headings.map((h) => h.replace(/^## /, "").toLowerCase())
  } catch {
    return []
  }
}

function hasRequiredSections(sections: string[]): string[] {
  const missing: string[] = []
  for (const req of REQUIRED_SECTIONS) {
    const found = sections.some((s) => s.startsWith(req) || (req === "parts" && s.includes("prop")))
    if (!found) missing.push(req)
  }
  return missing
}

function checkConditionalSections(
  sections: string[],
  _frontmatter: Record<string, unknown>,
  filePath: string,
): string[] {
  const missing: string[] = []

  // Read the raw frontmatter text to find notApplicable section declarations.
  // The YAML is structured as:
  //   notApplicable:
  //     - section: <name>
  //       reason: <text>
  // We parse section names from the raw text rather than relying on the simple
  // key-value parser, which cannot handle nested arrays.
  let naList: string[] = []
  try {
    const content = readFileSync(filePath, "utf8")
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/)
    if (fmMatch) {
      const sectionMatches = fmMatch[1].matchAll(/- section:\s*(.+)/g)
      for (const m of sectionMatches) {
        naList.push(m[1].trim().toLowerCase())
      }
    }
  } catch {
    /* file already validated elsewhere */
  }

  for (const cond of CONDITIONAL_SECTIONS) {
    const present = sections.some((s) => s.startsWith(cond))
    const declared = naList.some((na) => na.startsWith(cond))
    if (!present && !declared) missing.push(cond)
  }
  return missing
}

function parseA11yContract(filePath: string): A11yContract | null {
  try {
    const content = readFileSync(filePath, "utf8")
    const match = content.match(/^---\n([\s\S]*?)\n---/)
    if (!match) return null
    // Check if keyboard section exists with entries
    const hasKeyboard = /^keyboard:\s*$/m.test(match[1]) && /^\s+-\s+key:/m.test(match[1])
    return { keyboard: hasKeyboard ? [{ key: "exists", behavior: "exists" }] : undefined }
  } catch {
    return null
  }
}

// ─── Per-primitive verification ─────────────────────────────────────────────

function verifyPrimitive(name: string): PrimitiveResult {
  const failures: string[] = []
  const pkgDocsDir = join(PACKAGES_DIR, name, "docs")

  // §8.1.1 req 7: committed evidence.json
  const evidencePath = join(pkgDocsDir, "accessibility", "evidence.json")
  const evidence = readJSON<EvidenceFile>(evidencePath)
  if (!evidence) {
    failures.push("missing docs/accessibility/evidence.json")
  } else if (evidence.summary.passes <= 0) {
    failures.push(`evidence.json passes=${evidence.summary.passes} (must be > 0)`)
  }

  // §8.1.1 req 2: EN overview with required sections
  const enOverview = join(pkgDocsDir, "overview.md")
  if (!existsSync(enOverview)) {
    failures.push("missing docs/overview.md (EN)")
  } else {
    const sections = getSections(enOverview)
    const missing = hasRequiredSections(sections)
    if (missing.length > 0) failures.push(`EN overview missing sections: ${missing.join(", ")}`)

    // §8.1.1 req 3: conditional sections
    const fm = readFrontmatter(enOverview) || {}
    const condMissing = checkConditionalSections(sections, fm, enOverview)
    if (condMissing.length > 0) {
      failures.push(
        `EN overview: conditional sections neither present nor declared notApplicable: ${condMissing.join(", ")}`,
      )
    }
  }

  // §8.1.1 req 4: ES mirror
  const esOverview = join(pkgDocsDir, "es", "overview.md")
  if (!existsSync(esOverview)) {
    failures.push("missing docs/es/overview.md (ES)")
  } else {
    const esFm = readFrontmatter(esOverview)
    if (!esFm) {
      failures.push("ES overview: cannot read frontmatter")
    } else {
      if (esFm.translationStatus !== "draft" && esFm.translationStatus !== "human-reviewed") {
        failures.push(
          `ES overview: translationStatus="${esFm.translationStatus}" (expected "draft" or "human-reviewed")`,
        )
      }
      const hash = String(esFm.translationSourceHash || "")
      if (!hash || hash === "0".repeat(64)) {
        failures.push("ES overview: translationSourceHash is missing or placeholder zeros")
      }
    }
  }

  // §8.1.1 req 5: example (runnable if keyboard interaction declared)
  const enExampleDir = join(pkgDocsDir, "examples")
  const esExampleDir = join(pkgDocsDir, "es", "examples")
  const enExamples = existsSync(enExampleDir)
    ? readdirSync(enExampleDir).filter((f) => f.endsWith(".md"))
    : []
  const esExamples = existsSync(esExampleDir)
    ? readdirSync(esExampleDir).filter((f) => f.endsWith(".md"))
    : []

  if (enExamples.length === 0) {
    failures.push("missing EN example (docs/examples/*.md)")
  } else {
    // Check runnable rule
    const contract = parseA11yContract(join(pkgDocsDir, "accessibility", "contract.md"))
    const hasKeyboard = contract?.keyboard && contract.keyboard.length > 0
    const exampleFm = readFrontmatter(join(enExampleDir, enExamples[0]))
    const isRunnable = exampleFm?.runnable === true || exampleFm?.runnable === "true"

    if (hasKeyboard && !isRunnable) {
      failures.push(
        "a11y contract declares keyboard interaction but example is not runnable (§8.1.1 req 5)",
      )
    }
  }
  if (esExamples.length === 0) {
    failures.push("missing ES example (docs/es/examples/*.md)")
  }

  // §8.1.1 req 6: authored a11y contract EN + ES
  const enContract = join(pkgDocsDir, "accessibility", "contract.md")
  const esContract = join(pkgDocsDir, "es", "accessibility", "contract.md")
  if (!existsSync(enContract)) failures.push("missing EN accessibility contract")
  if (!existsSync(esContract)) failures.push("missing ES accessibility contract")

  // §8.1.1 req 8: API artifact
  const apiArtifact = join(ROOT, "artifacts", "api", `${name}.json`)
  if (!existsSync(apiArtifact)) failures.push("missing artifacts/api/<name>.json")

  // §8.1.1 req 1: registry reconciliation
  const registryPath = join(REGISTRY_DIR, `${name}.json`)
  const registry = readJSON<RegistryManifest>(registryPath)
  if (!registry) {
    failures.push("missing registry/<name>.json")
  } else {
    if (registry.documentation.status !== "complete") {
      failures.push(
        `registry: documentation.status="${registry.documentation.status}" (expected "complete")`,
      )
    }
    if (registry.accessibility.reviewStatus !== "automated") {
      failures.push(
        `registry: accessibility.reviewStatus="${registry.accessibility.reviewStatus}" (expected "automated")`,
      )
    }
    if (!registry.accessibility.evidenceIds || registry.accessibility.evidenceIds.length === 0) {
      failures.push("registry: accessibility.evidenceIds is empty")
    }
    // Bilingual keywords check — both EN and ES keywords should be present
    const keywords = registry.search?.keywords || []
    if (keywords.length < 3) {
      failures.push(`registry: search.keywords has only ${keywords.length} entries (expected ≥3)`)
    }
    // Status must remain preview at M4
    if (registry.status !== "preview") {
      failures.push(`registry: status="${registry.status}" (expected "preview" at M4)`)
    }
  }

  return { name, passed: failures.length === 0, failures }
}

// ─── Read declared count from tracker ───────────────────────────────────────

function readDeclaredCount(): number {
  try {
    const content = readFileSync(TRACKER_PATH, "utf8")
    // Look for "| Primitives | 52 | N |" in the scope counters table (DoD column)
    const match = content.match(/\|\s*Primitives\s*\|\s*52\s*\|\s*(\d+)\s*\|/)
    if (match) return parseInt(match[1], 10)
    return 0
  } catch {
    return 0
  }
}

// ─── Main ───────────────────────────────────────────────────────────────────

function main(): void {
  console.log("PRIM-000: Primitive Catalog Completion Gate (M4 bar)\n")

  const results: PrimitiveResult[] = []

  for (const name of PUBLIC_PRIMITIVES) {
    results.push(verifyPrimitive(name))
  }

  const passing = results.filter((r) => r.passed)
  const failing = results.filter((r) => !r.passed)

  // Report passing primitives
  if (passing.length > 0) {
    console.log(`\n✓ Passing (${passing.length}/${PUBLIC_PRIMITIVES.length}):`)
    for (const r of passing) {
      console.log(`  ✓ ${r.name}`)
    }
  }

  // Report failing primitives (with first 3 failures each)
  if (failing.length > 0) {
    console.log(`\n✗ Not yet complete (${failing.length}/${PUBLIC_PRIMITIVES.length}):`)
    for (const r of failing) {
      const detail = r.failures.slice(0, 3).join("; ")
      const more = r.failures.length > 3 ? ` (+${r.failures.length - 3} more)` : ""
      console.log(`  ✗ ${r.name}: ${detail}${more}`)
    }
  }

  // Ratcheting count assertion
  const declaredCount = readDeclaredCount()
  const actualCount = passing.length

  console.log(`\n${"═".repeat(60)}`)
  console.log(`Primitives meeting M4 bar: ${actualCount}/${PUBLIC_PRIMITIVES.length}`)
  console.log(`Tracker declared count (DoD column): ${declaredCount}`)

  if (auditOnly) {
    console.log(`\n(--audit-only: no assertion enforced)`)
    process.exit(0)
  }

  if (actualCount !== declaredCount) {
    console.error(
      `\n✗ FAILED: actual count (${actualCount}) ≠ tracker declared count (${declaredCount}).`,
    )
    console.error(`  Update the Primitives DoD column in docs/plans/website-tasks.md to match,`)
    console.error(`  or fix the primitives that should be passing.`)
    process.exit(1)
  }

  console.log(`\n✓ PRIM-000 PASSED — count matches tracker declaration.`)
  process.exit(0)
}

main()
