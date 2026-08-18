#!/usr/bin/env tsx
/**
 * Lists translation files that need attention (stale, draft, or missing).
 *
 * Usage:
 *   tsx apps/site/tools/list-translation-status.ts            # all needing work
 *   tsx apps/site/tools/list-translation-status.ts --stale    # only stale (source changed)
 *   tsx apps/site/tools/list-translation-status.ts --missing  # only missing Spanish files
 *   tsx apps/site/tools/list-translation-status.ts --draft    # only draft (needs review)
 *   tsx apps/site/tools/list-translation-status.ts --ga       # only GA-blocking files
 */
import { existsSync, readdirSync, readFileSync } from "node:fs"
import { dirname, extname, join, relative, resolve, sep } from "node:path"
import { fileURLToPath } from "node:url"
import { computeSourceHash } from "../src/lib/translation"

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const workspaceRoot = resolve(projectRoot, "..", "..")
const CONTENT_EXTENSIONS = new Set([".md", ".mdx"])

type Status = "stale" | "draft" | "missing" | "ok"
type Maturity = "draft" | "beta" | "ga"

interface FileEntry {
  file: string
  status: Status
  maturity: Maturity
  reason: string
}

// ─── Args ────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const filterStale = args.includes("--stale")
const filterMissing = args.includes("--missing")
const filterDraft = args.includes("--draft")
const filterGA = args.includes("--ga")
const hasFilter = filterStale || filterMissing || filterDraft || filterGA

// ─── Helpers ─────────────────────────────────────────────────────────────────

function collectContentFiles(dir: string, root: string): string[] {
  if (!existsSync(dir)) return []
  return readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) => {
      const fullPath = join(dir, entry.name)
      return entry.isDirectory()
        ? collectContentFiles(fullPath, root)
        : CONTENT_EXTENSIONS.has(extname(entry.name))
          ? [relative(root, fullPath).split(sep).join("/")]
          : []
    })
    .sort()
}

function extractFrontmatter(content: string): Record<string, string> {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return {}
  return Object.fromEntries(
    match[1].split("\n").flatMap((line) => {
      const colonIndex = line.indexOf(":")
      if (colonIndex === -1) return []
      const key = line.slice(0, colonIndex).trim()
      let value = line.slice(colonIndex + 1).trim()
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }
      return [[key, value]]
    }),
  )
}

function resolveMaturity(value: string | undefined): Maturity {
  return value === "ga" || value === "draft" ? value : "beta"
}

function resolveEntry(
  enRoot: string,
  esRoot: string,
  relativePath: string,
  maturityFn: (fm: Record<string, string>) => Maturity,
): FileEntry {
  const enPath = join(enRoot, relativePath)
  const esPath = join(esRoot, relativePath)
  const english = readFileSync(enPath, "utf8")
  const maturity = maturityFn(extractFrontmatter(english))

  if (!existsSync(esPath)) {
    return { file: relativePath, status: "missing", maturity, reason: "no Spanish file exists" }
  }

  const spanish = readFileSync(esPath, "utf8")
  const fm = extractFrontmatter(spanish)
  const recordedHash = fm.translationSourceHash

  if (!recordedHash || recordedHash !== computeSourceHash(english)) {
    return { file: relativePath, status: "stale", maturity, reason: "English source has changed" }
  }

  if (
    fm.translationStatus === "human-reviewed" &&
    fm.translationReviewedBy &&
    fm.translationReviewedAt
  ) {
    return { file: relativePath, status: "ok", maturity, reason: "" }
  }

  return { file: relativePath, status: "draft", maturity, reason: "translated but not reviewed" }
}

// ─── Collect site content ────────────────────────────────────────────────────

const siteEnRoot = join(projectRoot, "src", "content", "en")
const siteEsRoot = join(projectRoot, "src", "content", "es")
const siteFiles = collectContentFiles(siteEnRoot, siteEnRoot)
const entries: FileEntry[] = siteFiles.map((f) =>
  resolveEntry(siteEnRoot, siteEsRoot, f, (fm) => resolveMaturity(fm.maturity)),
)

// ─── Collect package docs ────────────────────────────────────────────────────

interface RegistryIndex {
  version: number
  primitives: Array<{ name: string; status: string }>
}

function loadPrimitiveStatuses(): Map<string, string> {
  const indexPath = join(workspaceRoot, "registry", "index.json")
  if (!existsSync(indexPath)) return new Map()
  const index = JSON.parse(readFileSync(indexPath, "utf8")) as RegistryIndex
  return new Map(index.primitives.map((p) => [p.name, p.status]))
}

const packagesRoot = join(workspaceRoot, "packages")
const primitiveStatuses = loadPrimitiveStatuses()

if (existsSync(packagesRoot)) {
  for (const pkgName of readdirSync(packagesRoot)) {
    const docsDir = join(packagesRoot, pkgName, "docs")
    if (!existsSync(docsDir)) continue

    const englishFiles = collectContentFiles(docsDir, docsDir).filter((f) => !f.startsWith("es/"))
    if (englishFiles.length === 0) continue

    const maturity: Maturity = primitiveStatuses.get(pkgName) === "stable" ? "ga" : "beta"
    for (const relFile of englishFiles) {
      const entry = resolveEntry(docsDir, join(docsDir, "es"), relFile, () => maturity)
      entries.push({ ...entry, file: `packages/${pkgName}/docs/${relFile}` })
    }
  }
}

// ─── Filter & display ────────────────────────────────────────────────────────

let filtered = entries.filter((e) => e.status !== "ok")

if (hasFilter) {
  filtered = filtered.filter((e) => {
    if (filterGA && e.maturity !== "ga") return false
    if (filterStale && e.status !== "stale") return false
    if (filterMissing && e.status !== "missing") return false
    if (filterDraft && e.status !== "draft") return false
    return true
  })
}

if (filtered.length === 0) {
  console.log("All translations are up to date.")
  process.exit(0)
}

// Group by status
const stale = filtered.filter((e) => e.status === "stale")
const missing = filtered.filter((e) => e.status === "missing")
const draft = filtered.filter((e) => e.status === "draft")

if (stale.length > 0) {
  console.log(`\n── Stale (${stale.length}) — English source changed, translation outdated ──\n`)
  for (const e of stale) {
    const tag = e.maturity === "ga" ? " [GA blocker]" : ""
    console.log(`  ${e.file}${tag}`)
  }
}

if (missing.length > 0) {
  console.log(`\n── Missing (${missing.length}) — no Spanish translation exists ──\n`)
  for (const e of missing) {
    const tag = e.maturity === "ga" ? " [GA blocker]" : ""
    console.log(`  ${e.file}${tag}`)
  }
}

if (draft.length > 0) {
  console.log(`\n── Draft (${draft.length}) — translated but awaiting human review ──\n`)
  for (const e of draft) {
    const tag = e.maturity === "ga" ? " [GA blocker]" : ""
    console.log(`  ${e.file}${tag}`)
  }
}

console.log(`\n── Summary ──\n`)
console.log(`  Stale:   ${stale.length}`)
console.log(`  Missing: ${missing.length}`)
console.log(`  Draft:   ${draft.length}`)
console.log(`  Total:   ${filtered.length}`)

const gaBlockers = filtered.filter((e) => e.maturity === "ga")
if (gaBlockers.length > 0) {
  console.log(`\n  GA blockers: ${gaBlockers.length}`)
}
