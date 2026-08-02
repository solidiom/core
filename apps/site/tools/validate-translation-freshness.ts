#!/usr/bin/env tsx
/**
 * I18N-004 / CONTENT-004 translation freshness and terminology validation.
 *
 * Translation metadata records the English source hash, lifecycle status, and
 * reviewer provenance. GA content fails closed unless its translation is both
 * fresh and human-reviewed; beta/draft content remains report-only until its
 * release maturity is raised.
 *
 * Covers two content graphs:
 *   1. Site-wide content: apps/site/src/content/{en,es}/** (guides, articles,
 *      changelog, pages, components, blocks, templates, themes), gated by the
 *      authored `maturity` frontmatter field (draft/beta/ga).
 *   2. Package-colocated content: packages/*\/docs/** (primitive overview,
 *      accessibility contracts, examples), gated by the primitive's registry
 *      `status` (a primitive at registry status "stable" is GA — CONTENT-004).
 */
import { existsSync, readdirSync, readFileSync } from "node:fs"
import { dirname, extname, join, relative, resolve, sep } from "node:path"
import { fileURLToPath } from "node:url"
import {
  computeSourceHash,
  TERMINOLOGY_GLOSSARY,
  type TranslationStatus,
} from "../src/lib/translation"

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const workspaceRoot = resolve(projectRoot, "..", "..")
const CONTENT_EXTENSIONS = new Set([".md", ".mdx"])
type Maturity = "draft" | "beta" | "ga"

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

function contentBody(content: string): string {
  return content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "")
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function includesTerm(content: string, term: string): boolean {
  return new RegExp(`\\b${escapeRegExp(term)}\\b`, "i").test(content)
}

function includesPreferredTranslation(content: string, term: string): boolean {
  return new RegExp(`\\b${escapeRegExp(term)}(?:s|es)?\\b`, "i").test(content)
}

function glossaryIssues(english: string, spanish: string): string[] {
  const englishProse = contentBody(english).replace(/```[\s\S]*?```|`[^`]+`/g, "")
  const spanishProse = contentBody(spanish).replace(/```[\s\S]*?```|`[^`]+`/g, "")
  const issues: string[] = []

  for (const entry of Object.values(TERMINOLOGY_GLOSSARY)) {
    if (!includesTerm(englishProse, entry.en)) continue
    if (entry.doNotTranslate && !spanish.includes(entry.es)) {
      issues.push(`protected term \"${entry.en}\" is missing`)
    }
    if (!entry.doNotTranslate && !includesPreferredTranslation(spanishProse, entry.es)) {
      issues.push(`preferred translation \"${entry.es}\" is missing for \"${entry.en}\"`)
    }
  }

  const protectedInlineCode =
    contentBody(english)
      .replace(/```[\s\S]*?```/g, "")
      .match(/`([^`\n]+)`/g)
      ?.map((literal) => literal.slice(1, -1)) ?? []

  for (const literal of new Set(protectedInlineCode)) {
    if (
      /[/:@]|--|\b(?:npm|pnpm|TypeScript|Astro|Solid|Solidiom)\b/.test(literal) &&
      !spanish.includes(literal)
    ) {
      issues.push(`protected technical literal \`${literal}\` is missing`)
    }
  }

  return issues
}

interface FileStatus {
  file: string
  maturity: Maturity
  status: TranslationStatus
  detail: string[]
}

function resolveMaturity(value: string | undefined): Maturity {
  return value === "ga" || value === "draft" ? value : "beta"
}

function resolveFileStatus(
  contentEnRoot: string,
  contentEsRoot: string,
  relativePath: string,
  maturityOf: (frontmatter: Record<string, string>) => Maturity,
): FileStatus {
  const enPath = join(contentEnRoot, relativePath)
  const esPath = join(contentEsRoot, relativePath)
  const english = readFileSync(enPath, "utf8")
  const maturity = maturityOf(extractFrontmatter(english))

  if (!existsSync(esPath)) {
    return { file: relativePath, maturity, status: "missing", detail: ["no Spanish counterpart"] }
  }

  const spanish = readFileSync(esPath, "utf8")
  const frontmatter = extractFrontmatter(spanish)
  const detail = glossaryIssues(english, spanish)
  const recordedHash = frontmatter.translationSourceHash

  if (!recordedHash) {
    return {
      file: relativePath,
      maturity,
      status: "stale",
      detail: ["no translationSourceHash", ...detail],
    }
  }
  if (recordedHash !== computeSourceHash(english)) {
    return {
      file: relativePath,
      maturity,
      status: "stale",
      detail: ["source content has changed", ...detail],
    }
  }
  if (frontmatter.translationStatus === "human-reviewed") {
    if (!frontmatter.translationReviewedBy || !frontmatter.translationReviewedAt) {
      return {
        file: relativePath,
        maturity,
        status: "draft",
        detail: ["human review provenance is incomplete", ...detail],
      }
    }
    return { file: relativePath, maturity, status: "human-reviewed", detail }
  }
  if (frontmatter.translationStatus === "stale") {
    return {
      file: relativePath,
      maturity,
      status: "stale",
      detail: ["translation is explicitly marked stale", ...detail],
    }
  }
  return {
    file: relativePath,
    maturity,
    status: "draft",
    detail: ["awaiting human review", ...detail],
  }
}

// ─── Source A: site-wide content (apps/site/src/content/{en,es}) ──────────

const siteContentEnRoot = join(projectRoot, "src", "content", "en")
const siteContentEsRoot = join(projectRoot, "src", "content", "es")
const siteMaturityOf = (frontmatter: Record<string, string>): Maturity =>
  resolveMaturity(frontmatter.maturity)

const siteFiles = collectContentFiles(siteContentEnRoot, siteContentEnRoot)
const siteResults = siteFiles.map((file) =>
  resolveFileStatus(siteContentEnRoot, siteContentEsRoot, file, siteMaturityOf),
)

// ─── Source B: package-colocated content (packages/*/docs/**) — CONTENT-004 ─
//
// A package doc's GA-blocking maturity is derived from the primitive's
// registry status (registry/index.json), not a separate frontmatter field:
// a "stable" registry entry is GA and its translations must be fresh and
// human-reviewed; "preview"/"experimental"/"deprecated" remain report-only.

interface RegistryIndexSummary {
  version: number
  primitives: Array<{ name: string; status: string }>
}

function loadPrimitiveStatuses(): Map<string, string> {
  const indexPath = join(workspaceRoot, "registry", "index.json")
  if (!existsSync(indexPath)) return new Map()
  const index = JSON.parse(readFileSync(indexPath, "utf8")) as RegistryIndexSummary
  return new Map(index.primitives.map((p) => [p.name, p.status]))
}

function packageDocMaturityOf(
  primitiveName: string,
  primitiveStatuses: Map<string, string>,
): Maturity {
  const status = primitiveStatuses.get(primitiveName)
  return status === "stable" ? "ga" : "beta"
}

const packagesRoot = join(workspaceRoot, "packages")
const primitiveStatuses = loadPrimitiveStatuses()
const packageResults: FileStatus[] = []

if (existsSync(packagesRoot)) {
  for (const packageName of readdirSync(packagesRoot)) {
    const docsDir = join(packagesRoot, packageName, "docs")
    if (!existsSync(docsDir)) continue

    // Package docs pair english at docs/<rel> with spanish at docs/es/<rel>,
    // for every english-side file except the es/ subtree itself.
    const englishRelativeFiles = collectContentFiles(docsDir, docsDir).filter(
      (file) => !file.startsWith("es/"),
    )
    if (englishRelativeFiles.length === 0) continue

    const maturity = packageDocMaturityOf(packageName, primitiveStatuses)
    for (const relativeFile of englishRelativeFiles) {
      const result = resolveFileStatus(docsDir, join(docsDir, "es"), relativeFile, () => maturity)
      packageResults.push({ ...result, file: `packages/${packageName}/docs/${relativeFile}` })
    }
  }
}

const results = [...siteResults, ...packageResults]
if (results.length === 0) {
  console.log("No content files found to validate.")
  process.exit(0)
}
const counts: Record<TranslationStatus, number> = {
  "human-reviewed": 0,
  draft: 0,
  stale: 0,
  missing: 0,
}
for (const result of results) counts[result.status]++

console.log("I18N-004 Translation Freshness Report")
console.log("=".repeat(72))
console.log()
console.log(`${"File".padEnd(40)} ${"Maturity".padEnd(8)} ${"Status".padEnd(16)} Detail`)
console.log(`${"-".repeat(40)} ${"-".repeat(8)} ${"-".repeat(16)} ${"-".repeat(30)}`)
for (const result of results) {
  const icon =
    result.status === "human-reviewed"
      ? "✓"
      : result.status === "draft"
        ? "◐"
        : result.status === "stale"
          ? "⚠"
          : "✗"
  console.log(
    `${icon} ${result.file.padEnd(38)} ${result.maturity.padEnd(8)} ${result.status.padEnd(16)} ${result.detail.join("; ")}`,
  )
}

const blocking = results.filter(
  (result) => result.maturity === "ga" && result.status !== "human-reviewed",
)
console.log()
console.log("Summary:")
console.log(`  human-reviewed: ${counts["human-reviewed"]}`)
console.log(`  draft:          ${counts.draft}`)
console.log(`  stale:          ${counts.stale}`)
console.log(`  missing:        ${counts.missing}`)
console.log(`  GA blockers:    ${blocking.length}`)

if (blocking.length > 0) {
  console.error("\nGA translations must be fresh and human-reviewed.")
  process.exitCode = 1
}
