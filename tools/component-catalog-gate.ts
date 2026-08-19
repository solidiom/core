/**
 * FOUND-004: Component catalog completion gate.
 *
 * Source-derived gate that verifies each **approved** component (§9.2 queue)
 * against the M4 bar (§8.2.1), reconciles against the committed registry,
 * flags untracked registry slugs, and asserts a ratcheting count that must
 * match the number declared in docs/plans/consolidated-plan.md §11 scope counters.
 *
 * Run via: pnpm exec tsx tools/component-catalog-gate.ts
 *          pnpm exec tsx tools/component-catalog-gate.ts --audit-only
 *
 * --audit-only: report without enforcing the count assertion (for diagnostics)
 *
 * CATALOG-001: The gate uses the approved §9.2 queue as its source of truth
 * rather than iterating registry index entries. Untracked slugs in the registry
 * that have no approved COMP-* row are flagged but do not count.
 *
 * See: docs/plans/consolidated-plan.md §8.2.1 (the M4 bar)
 */

import { existsSync, readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"
import { REFERENCE_DEFINITIONS } from "./recipe-contract-definitions"

const ROOT = join(import.meta.dirname ?? __dirname, "..")
const PACKAGES_DIR = join(ROOT, "packages")
const REGISTRY_DIR = join(ROOT, "registry")
const SITE_CONTENT = join(ROOT, "apps", "site", "src", "content")
const TRACKER_PATH = join(ROOT, "docs", "plans", "consolidated-plan.md")

const auditOnly = process.argv.includes("--audit-only")

// ─── Required English doc sections (§8.2.1 requirement 6) ───────────────────
const REQUIRED_SECTIONS = [
  "usage",
  "installation",
  "anatomy",
  "variants", // "Variants & states" — we accept "variants" as prefix
  "styling",
  "ssr and hydration",
  "accessibility",
]

// ─── Types ──────────────────────────────────────────────────────────────────

interface ComponentResult {
  id: string
  name: string
  passed: boolean
  failures: string[]
}

interface ComponentRegistry {
  name: string
  source: Record<string, string[]>
  integrity: { fileDigests: Record<string, Record<string, string>>; lastGenerated: string }
  documentation: { status: string; locales: Record<string, { status: string }> }
}

interface IndexComponent {
  name: string
  status: string
  documentationStatus: string
  stylingOutputs: string[]
}

interface ApprovedComponent {
  id: string
  name: string
  status: string
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
    const result: Record<string, unknown> = {}
    for (const line of match[1].split("\n")) {
      const kv = line.match(/^(\w[\w-]*):\s*(.*)$/)
      if (kv) {
        const val = kv[2].trim()
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
    return headings.map((h: string) => h.replace(/^## /, "").toLowerCase())
  } catch {
    return []
  }
}

function hasRequiredSections(sections: string[]): string[] {
  const missing: string[] = []
  for (const req of REQUIRED_SECTIONS) {
    const found = sections.some((s) => s.startsWith(req))
    if (!found) missing.push(req)
  }
  return missing
}

// ─── Name normalization ─────────────────────────────────────────────────────
// §9.2 uses human-readable names ("Dropdown Menu") that may differ from the
// filesystem/registry slug ("menu"). This map handles those cases.
const NAME_OVERRIDES: Record<string, string> = {
  "dropdown-menu": "menu",
}

function normalizeComponentName(rawName: string): string {
  const kebab = rawName.toLowerCase().replace(/\s+/g, "-")
  return NAME_OVERRIDES[kebab] ?? kebab
}

// ─── Read approved component queue from §9.2 ────────────────────────────────

function readApprovedComponents(): ApprovedComponent[] {
  const content = readFileSync(TRACKER_PATH, "utf8")
  const sectionMatch = content.match(/### 9\.2 Components[^\n]*\n[\s\S]*?(?=### 9\.3|$)/)
  if (!sectionMatch) return []

  const section = sectionMatch[0]
  const components: ApprovedComponent[] = []
  const compRegex = /\|\s*COMP-(\d{3})\s*\|\s*([^|]+)\|\s*\[([ x~!])\]\s*\|/g
  let m
  while ((m = compRegex.exec(section)) !== null) {
    components.push({
      id: `COMP-${m[1]}`,
      name: normalizeComponentName(m[2].trim()),
      status: m[3],
    })
  }
  return components
}

// ─── Read component list from registry index ────────────────────────────────

function readIndexComponents(): IndexComponent[] {
  const indexPath = join(REGISTRY_DIR, "index.json")
  const index = readJSON<{ components?: IndexComponent[] }>(indexPath)
  if (!index || !Array.isArray(index.components)) return []
  return index.components
}

// ─── Read declared count from §11 scope counters ────────────────────────────

function readDeclaredCount(): number {
  try {
    const content = readFileSync(TRACKER_PATH, "utf8")
    const match = content.match(/\|\s*Components\s*\|\s*\d+\s*\|\s*(\d+)\s*\|/)
    if (match) return parseInt(match[1], 10)
    return 0
  } catch {
    return 0
  }
}

// ─── Per-component verification ─────────────────────────────────────────────

function verifyComponent(
  comp: ApprovedComponent,
  indexComponents: IndexComponent[],
): ComponentResult {
  const failures: string[] = []
  const name = comp.name

  // §8.2.1 req 1: Physical form
  const profiles = ["css", "tailwind", "unocss"]
  for (const profile of profiles) {
    const recipePath = join(PACKAGES_DIR, `recipes-${profile}`, "src", "recipes", `${name}.tsx`)
    if (!existsSync(recipePath)) {
      failures.push(`missing recipes-${profile}/src/recipes/${name}.tsx`)
    }
  }
  const primitivePkg = join(PACKAGES_DIR, name)
  if (!existsSync(primitivePkg)) {
    failures.push(`missing primitive package packages/${name}/`)
  }

  // §8.2.1 req 2: Canonical contract
  if (!(name in REFERENCE_DEFINITIONS)) {
    failures.push(`scope "${name}" not declared in recipe-contract-definitions.ts`)
  }

  // §8.2.1 req 4: Registry
  const registryPath = join(REGISTRY_DIR, "components", `${name}.json`)
  const registry = readJSON<ComponentRegistry>(registryPath)
  if (!registry) {
    failures.push("missing registry/components/<name>.json")
  } else {
    const hasSource =
      registry.source && (registry.source.css || registry.source.tailwind || registry.source.unocss)
    if (!hasSource) {
      failures.push("registry: no source files recorded per styling output")
    }
    if (!registry.integrity || !registry.integrity.fileDigests) {
      failures.push("registry: missing integrity digests")
    }
    if (registry.documentation.status !== "complete") {
      failures.push(
        `registry: documentation.status="${registry.documentation.status}" (expected "complete")`,
      )
    }
  }

  // Verify component appears in index's components[]
  const indexEntry = indexComponents.find((c) => c.name === name)
  if (!indexEntry) {
    failures.push("not listed in registry index's components[]")
  } else {
    if (indexEntry.status !== "preview") {
      failures.push(`index: status="${indexEntry.status}" (expected "preview")`)
    }
  }

  // §8.2.1 req 6: English docs with required sections
  const enDocPath = join(SITE_CONTENT, "en", "components", `${name}.md`)
  if (!existsSync(enDocPath)) {
    failures.push("missing English doc")
  } else {
    const sections = getSections(enDocPath)
    const missing = hasRequiredSections(sections)
    if (missing.length > 0) {
      failures.push(`EN doc missing sections: ${missing.join(", ")}`)
    }
  }

  // §8.2.1 req 7: Spanish mirror
  const esDocPath = join(SITE_CONTENT, "es", "components", `${name}.md`)
  if (!existsSync(esDocPath)) {
    failures.push("missing Spanish doc")
  } else {
    const esFm = readFrontmatter(esDocPath)
    if (!esFm) {
      failures.push("ES doc: cannot read frontmatter")
    } else {
      if (esFm.translationStatus !== "draft" && esFm.translationStatus !== "human-reviewed") {
        failures.push(`ES doc: translationStatus="${esFm.translationStatus}" (expected "draft" or "human-reviewed")`)
      }
      const hash = String(esFm.translationSourceHash || "")
      if (!hash || hash === "0".repeat(64)) {
        failures.push("ES doc: translationSourceHash is missing or placeholder zeros")
      }
    }
  }

  // §8.2.1 req 8: At least one example
  const exampleDir = join(SITE_CONTENT, "en", "components", `${name}`, "examples")
  const examples = existsSync(exampleDir)
    ? readdirSync(exampleDir).filter((f: string) => f.endsWith(".md") || f.endsWith(".tsx"))
    : []
  if (examples.length === 0) {
    failures.push("missing examples")
  }

  // §8.2.1 req 9: Accessibility by reference
  if (existsSync(enDocPath)) {
    try {
      const docContent = readFileSync(enDocPath, "utf8")
      const citesEvidence =
        /evidence\.json/.test(docContent) ||
        /accessibility.*contract/.test(docContent) ||
        /a11y.*contract/.test(docContent) ||
        /primitive.*accessibility/.test(docContent)
      if (!citesEvidence) {
        failures.push("EN doc does not cite primitive's accessibility contract or evidence.json")
      }
    } catch {
      /* validated above */
    }
  }

  return { id: comp.id, name, passed: failures.length === 0, failures }
}

// ─── Main ───────────────────────────────────────────────────────────────────

function main(): void {
  console.log("FOUND-004: Component Catalog Completion Gate (M4 bar)\n")
  console.log("Source of truth: docs/plans/consolidated-plan.md §9.2 (approved queue)")
  console.log("─".repeat(60))

  const approvedComponents = readApprovedComponents()
  if (approvedComponents.length === 0) {
    console.error("No approved components found in §9.2 — cannot proceed.")
    process.exit(1)
  }
  console.log(`Approved component queue: ${approvedComponents.length} items`)

  const indexComponents = readIndexComponents()
  console.log(`Registry index components: ${indexComponents.length} items`)

  // Detect untracked slugs
  const approvedNames = new Set(approvedComponents.map((c) => c.name))
  const untrackedSlugs = indexComponents.filter((c) => !approvedNames.has(c.name))
  if (untrackedSlugs.length > 0) {
    console.log(`\n⚠ Untracked registry slugs (not in §9.2 approved queue):`)
    for (const slug of untrackedSlugs) {
      console.log(`  ⚠ "${slug.name}" — in registry but has no COMP-* row`)
    }
    console.log(`  → Must be formally rejected or added to §9.2 before counting.\n`)
  }

  const results: ComponentResult[] = []
  for (const comp of approvedComponents) {
    results.push(verifyComponent(comp, indexComponents))
  }

  const passing = results.filter((r) => r.passed)
  const failing = results.filter((r) => !r.passed)

  if (passing.length > 0) {
    console.log(`\n✓ Passing (${passing.length}/${approvedComponents.length}):`)
    for (const r of passing) {
      console.log(`  ✓ ${r.id} ${r.name}`)
    }
  }

  if (failing.length > 0) {
    console.log(`\n✗ Not yet complete (${failing.length}/${approvedComponents.length}):`)
    for (const r of failing) {
      const detail = r.failures.slice(0, 3).join("; ")
      const more = r.failures.length > 3 ? ` (+${r.failures.length - 3} more)` : ""
      console.log(`  ✗ ${r.id} ${r.name}: ${detail}${more}`)
    }
  }

  const declaredCount = readDeclaredCount()
  const actualCount = passing.length

  console.log(`\n${"═".repeat(60)}`)
  console.log(`Components meeting M4 bar: ${actualCount}/${approvedComponents.length}`)
  console.log(`Tracker declared count (DoD column): ${declaredCount}`)

  if (auditOnly) {
    console.log(`\n(--audit-only: no assertion enforced)`)
    process.exit(0)
  }

  if (actualCount !== declaredCount) {
    console.error(
      `\n✗ FAILED: actual count (${actualCount}) ≠ tracker declared count (${declaredCount}).`,
    )
    console.error(`  Update the Components DoD column in docs/plans/consolidated-plan.md to match,`)
    console.error(`  or fix the components that should be passing.`)
    process.exit(1)
  }

  console.log(`\n✓ FOUND-004 PASSED — count matches tracker declaration.`)
  process.exit(0)
}

main()
