/**
 * FOUND-005: Block catalog completion gate.
 *
 * Source-derived gate that verifies each block against the M4 bar (§8.3.1),
 * reconciles against the committed registry, and asserts a ratcheting count
 * that must match the number declared in docs/plans/website-tasks.md §11
 * scope counters.
 *
 * Run via: pnpm exec tsx tools/block-catalog-gate.ts
 *          pnpm exec tsx tools/block-catalog-gate.ts --audit-only
 *
 * --audit-only: report without enforcing the count assertion (for diagnostics)
 *
 * Checks enforceable from manifest (§8.3.1):
 *   1 — Named, not reserved (block has real name in manifest)
 *   2 — Dependencies resolve by name (COMP-NNN resolves to approved component
 *       and the name in .md matches §9.2)
 *   3 — No unresolved proposals (proposedComponents empty)
 *   4 — Structured states (requiredStates present, complete, cardinality match)
 *   7 — Registry (registry/blocks/<name>.json exists)
 *
 * Skipped (CI-enforced, not gate-enforced):
 *   5 — States implemented in source
 *   6 — Both previews exist
 *   8 — Source install (resolved by FOUND-003)
 *   9 — Bilingual docs
 *  10 — Routes render
 *
 * The key innovation: dependencies resolve **by name**, not by ID range.
 * The gate parses component names from block-catalog-manifest.md, matches them
 * to COMP-NNN IDs, and verifies the .json IDs resolve to the same components
 * in §9.2.
 *
 * See: docs/plans/website-tasks.md §8.3.1 (the M4 bar)
 */

import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"

const ROOT = join(import.meta.dirname ?? __dirname, "..")
const REGISTRY_DIR = join(ROOT, "registry")
const TRACKER_PATH = join(ROOT, "docs", "plans", "website-tasks.md")
const MANIFEST_JSON = join(ROOT, "docs", "contracts", "block-catalog-manifest.json")
const MANIFEST_MD = join(ROOT, "docs", "contracts", "block-catalog-manifest.md")

const auditOnly = process.argv.includes("--audit-only")

// ─── Types ──────────────────────────────────────────────────────────────────

interface BlockManifest {
  id: string
  category: string
  name: string
  outcome: string
  states: string[]
  requiredStates?: string[]
  componentDependencies: string[]
  dataBoundary: string
  proposedComponents: string[]
}

interface BlockResult {
  id: string
  name: string
  passed: boolean
  failures: string[]
}

// ─── Required state categories (§8.3.1 req 4, D4) ──────────────────────────

const REQUIRED_STATE_CATEGORIES = ["loading", "empty", "error", "restricted"]

// ─── Helpers ────────────────────────────────────────────────────────────────

function readJSON<T>(path: string): T | null {
  try {
    return JSON.parse(readFileSync(path, "utf8")) as T
  } catch {
    return null
  }
}

// ─── Parse component names from block-catalog-manifest.md ───────────────────
// Each block has a "- **COMP-***: COMP-001 (Button), COMP-002 (Input), ..." line.
// Returns a map of COMP-NNN -> componentName.

function parseManifestMDComponentNames(): Map<string, string> {
  const content = readFileSync(MANIFEST_MD, "utf8")
  const map = new Map<string, string>()

  for (const line of content.split("\n")) {
    const trimmed = line.trim()
    if (trimmed.startsWith("- **COMP-***:") || trimmed.startsWith("- **COMP-*:**")) {
      const compRegex = /COMP-(\d{3})\s+\(([^)]+)\)/g
      let m
      while ((m = compRegex.exec(trimmed)) !== null) {
        const id = `COMP-${m[1]}`
        const name = m[2].trim()
        map.set(id, name)
      }
    }
  }
  return map
}

// ─── Parse §9.2 component queue from website-tasks.md ──────────────────────
// Table rows: "| [ ]    | COMP-001 | Button | ..."
// Returns a map of COMP-NNN -> componentName.

function parseSection92Components(): Map<string, string> {
  const content = readFileSync(TRACKER_PATH, "utf8")
  const map = new Map<string, string>()

  // Extract the §9.2 section — from heading to the next ### 9.3
  const sectionMatch = content.match(/### 9\.2 Component queue[\s\S]*?(?=### 9\.3|$)/)
  if (!sectionMatch) return map

  const section = sectionMatch[0]
  const compRegex = /\|\s*\[[ x]\]\s*\|\s*COMP-(\d{3})\s*\|\s*([^|]+)\|/g
  let m
  while ((m = compRegex.exec(section)) !== null) {
    const id = `COMP-${m[1]}`
    const name = m[2].trim()
    map.set(id, name)
  }
  return map
}

// ─── Read declared count from §11 scope counters ────────────────────────────

function readDeclaredCount(): number {
  try {
    const content = readFileSync(TRACKER_PATH, "utf8")
    // Match "| Blocks                        |     ≥ 36 |   0 |      0 |"
    // DoD column is the third pipe-delimited value
    const match = content.match(/\|\s*Blocks\s*\|\s*[≥\d ]+\s*\|\s*(\d+)\s*\|/)
    if (match) return parseInt(match[1], 10)
    return 0
  } catch {
    return 0
  }
}

// ─── States validation (§8.3.1 req 4, D4) ──────────────────────────────────
// requiredStates must exist and contain all four categories.
// Cardinality: each required state must map to at least one prose state.

function checkStates(block: BlockManifest): string[] {
  const failures: string[] = []

  const requiredStates = block.requiredStates
  if (!requiredStates || !Array.isArray(requiredStates)) {
    failures.push("missing requiredStates field")
    return failures
  }

  // Check all four required categories are present
  const requiredSet = new Set(requiredStates.map((s) => s.toLowerCase()))
  for (const cat of REQUIRED_STATE_CATEGORIES) {
    if (!requiredSet.has(cat)) {
      failures.push(`requiredStates missing "${cat}"`)
    }
  }

  // Cardinality: each required state must map to at least one prose state
  const unmatched: string[] = []
  for (const req of requiredStates) {
    const reqLower = req.toLowerCase()
    const matched = block.states.some((state) => {
      const stateLower = state.toLowerCase()
      return stateLower.startsWith(reqLower) || stateLower.includes(reqLower)
    })
    if (!matched) {
      unmatched.push(req)
    }
  }
  if (unmatched.length > 0) {
    failures.push(`requiredStates not covered by prose states: [${unmatched.join(", ")}]`)
  }

  return failures
}

// ─── Per-block verification ─────────────────────────────────────────────────

function verifyBlock(
  block: BlockManifest,
  mdComponentNames: Map<string, string>,
  s92Components: Map<string, string>,
): BlockResult {
  const failures: string[] = []

  // §8.3.1 req 1: Named, not reserved
  if (!block.name || block.name.trim() === "") {
    failures.push(`no name defined for ${block.id}`)
  }

  // §8.3.1 req 2: Dependencies resolve by name
  for (const compId of block.componentDependencies) {
    // Check the ID resolves to an approved component in §9.2
    const s92Name = s92Components.get(compId)
    if (!s92Name) {
      failures.push(`${compId} does not resolve to an approved component in §9.2`)
      continue
    }

    // Check the .md names the same component for this ID
    const mdName = mdComponentNames.get(compId)
    if (!mdName) {
      failures.push(`${compId} has no name in block-catalog-manifest.md (block ${block.id})`)
      continue
    }

    // Assert the .md name matches §9.2 name — this is the name-resolution
    // invariant that FOUND-005 exists to enforce
    if (mdName !== s92Name) {
      failures.push(
        `${compId}: block-catalog-manifest.md says "${mdName}" but §9.2 says "${s92Name}"`,
      )
    }
  }

  // §8.3.1 req 3: No unresolved proposals
  if (block.proposedComponents.length > 0) {
    failures.push(`proposedComponents not empty: [${block.proposedComponents.join(", ")}]`)
  }

  // §8.3.1 req 4: Structured states
  const stateFailures = checkStates(block)
  if (stateFailures.length > 0) {
    failures.push(`states: ${stateFailures.join("; ")}`)
  }

  // §8.3.1 req 7: Registry entry
  const blockNameSlug = block.name.toLowerCase().replace(/\s+/g, "-")
  const registryPath = join(REGISTRY_DIR, "blocks", `${blockNameSlug}.json`)
  if (!existsSync(registryPath)) {
    failures.push(`missing registry/blocks/${blockNameSlug}.json`)
  }

  return {
    id: block.id,
    name: block.name,
    passed: failures.length === 0,
    failures,
  }
}

// ─── Main ───────────────────────────────────────────────────────────────────

function main(): void {
  console.log("FOUND-005: Block Catalog Completion Gate (M4 bar)\n")

  // Load manifest
  const manifest = readJSON<{ blocks: BlockManifest[] }>(MANIFEST_JSON)
  if (!manifest || !Array.isArray(manifest.blocks)) {
    console.error("Cannot load or parse block-catalog-manifest.json")
    process.exit(1)
  }

  const blocks = manifest.blocks

  // Parse component names from .md and §9.2
  const mdComponentNames = parseManifestMDComponentNames()
  const s92Components = parseSection92Components()

  console.log(`Loaded ${blocks.length} blocks from manifest`)
  console.log(`Parsed ${mdComponentNames.size} component names from .md`)
  console.log(`Parsed ${s92Components.size} components from §9.2\n`)

  const results: BlockResult[] = []

  for (const block of blocks) {
    results.push(verifyBlock(block, mdComponentNames, s92Components))
  }

  const passing = results.filter((r) => r.passed)
  const failing = results.filter((r) => !r.passed)

  // Report passing blocks
  if (passing.length > 0) {
    console.log(`✓ Passing (${passing.length}/${blocks.length}):`)
    for (const r of passing) {
      console.log(`  ✓ ${r.id} — ${r.name}`)
    }
  }

  // Report failing blocks
  if (failing.length > 0) {
    console.log(`\n✗ Not yet complete (${failing.length}/${blocks.length}):`)
    for (const r of failing) {
      const detail = r.failures.slice(0, 3).join("; ")
      const more = r.failures.length > 3 ? ` (+${r.failures.length - 3} more)` : ""
      console.log(`  ✗ ${r.id} (${r.name}): ${detail}${more}`)
    }
  }

  // Ratcheting count assertion
  const declaredCount = readDeclaredCount()
  const actualCount = passing.length

  console.log(`\n${"═".repeat(60)}`)
  console.log(`Blocks meeting M4 bar: ${actualCount}/${blocks.length}`)
  console.log(`Tracker declared count (DoD column): ${declaredCount}`)

  if (auditOnly) {
    console.log(`\n(--audit-only: no assertion enforced)`)
    process.exit(0)
  }

  if (actualCount !== declaredCount) {
    console.error(
      `\n✗ FAILED: actual count (${actualCount}) ≠ tracker declared count (${declaredCount}).`,
    )
    console.error(`  Update the Blocks DoD column in docs/plans/website-tasks.md to match,`)
    console.error(`  or fix the blocks that should be passing.`)
    process.exit(1)
  }

  console.log(`\n✓ FOUND-005 PASSED — count matches tracker declaration.`)
  process.exit(0)
}

main()
