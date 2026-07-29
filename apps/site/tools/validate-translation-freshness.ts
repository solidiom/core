#!/usr/bin/env tsx
/**
 * I18N-004 translation freshness validator.
 *
 * Scans content/en/ and content/es/ directories, comparing each English
 * source file to its Spanish counterpart. Reports translation status:
 *   - missing: no Spanish file exists
 *   - stale: source changed since translation (hash mismatch in frontmatter)
 *   - draft: Spanish file exists but marked as draft in frontmatter
 *   - human-reviewed: Spanish file exists and marked as reviewed
 *
 * Frontmatter convention for translated files:
 *   ---
 *   translationSourceHash: "<sha256 of English source at time of translation>"
 *   translationStatus: "draft" | "human-reviewed"
 *   ---
 *
 * If no translationStatus is present, defaults to "draft".
 * If no translationSourceHash is present, status is "stale" (cannot verify).
 */
import { existsSync, readdirSync, readFileSync } from "node:fs"
import { extname, join, relative, resolve, sep } from "node:path"
import { dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { computeSourceHash, type TranslationStatus } from "../src/lib/translation"

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const contentEnRoot = join(projectRoot, "src", "content", "en")
const contentEsRoot = join(projectRoot, "src", "content", "es")

const CONTENT_EXTENSIONS = new Set([".md", ".mdx"])

// ---------------------------------------------------------------------------
// File collection
// ---------------------------------------------------------------------------

function collectContentFiles(dir: string, root: string): string[] {
  const results: string[] = []

  if (!existsSync(dir)) return results

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...collectContentFiles(fullPath, root))
    } else if (CONTENT_EXTENSIONS.has(extname(entry.name))) {
      results.push(relative(root, fullPath).split(sep).join("/"))
    }
  }

  return results.sort()
}

// ---------------------------------------------------------------------------
// Frontmatter parsing (lightweight, no external deps)
// ---------------------------------------------------------------------------

function extractFrontmatter(content: string): Record<string, string> {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return {}

  const block = match[1]
  const fields: Record<string, string> = {}

  for (const line of block.split("\n")) {
    const colonIndex = line.indexOf(":")
    if (colonIndex === -1) continue
    const key = line.slice(0, colonIndex).trim()
    let value = line.slice(colonIndex + 1).trim()
    // Strip surrounding quotes
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    fields[key] = value
  }

  return fields
}

// ---------------------------------------------------------------------------
// Status resolution
// ---------------------------------------------------------------------------

interface FileStatus {
  file: string
  status: TranslationStatus
  detail?: string
}

function resolveFileStatus(relativePath: string): FileStatus {
  const enPath = join(contentEnRoot, relativePath)
  const esPath = join(contentEsRoot, relativePath)

  if (!existsSync(esPath)) {
    return { file: relativePath, status: "missing" }
  }

  const enContent = readFileSync(enPath, "utf8")
  const esContent = readFileSync(esPath, "utf8")
  const esFrontmatter = extractFrontmatter(esContent)

  const currentSourceHash = computeSourceHash(enContent)
  const recordedHash = esFrontmatter.translationSourceHash

  // If no recorded hash, we cannot verify freshness — mark as stale.
  if (!recordedHash) {
    return {
      file: relativePath,
      status: "stale",
      detail: "no translationSourceHash in frontmatter",
    }
  }

  // If hashes don't match, source changed since translation.
  if (recordedHash !== currentSourceHash) {
    return {
      file: relativePath,
      status: "stale",
      detail: "source content has changed since translation",
    }
  }

  // Hash matches — use the declared status.
  const declaredStatus = esFrontmatter.translationStatus
  if (declaredStatus === "human-reviewed") {
    return { file: relativePath, status: "human-reviewed" }
  }

  return { file: relativePath, status: "draft" }
}

// ---------------------------------------------------------------------------
// CLI execution
// ---------------------------------------------------------------------------

const enFiles = collectContentFiles(contentEnRoot, contentEnRoot)

if (enFiles.length === 0) {
  console.log("No English content files found in src/content/en/.")
  console.log("Nothing to validate.")
  process.exit(0)
}

const results = enFiles.map(resolveFileStatus)

// Summary table
console.log("I18N-004 Translation Freshness Report")
console.log("=".repeat(60))
console.log()
console.log(
  `${"File".padEnd(40)} ${"Status".padEnd(16)} Detail`,
)
console.log(`${"-".repeat(40)} ${"-".repeat(16)} ${"-".repeat(30)}`)

for (const r of results) {
  const statusIcon =
    r.status === "human-reviewed" ? "✓" :
    r.status === "draft" ? "◐" :
    r.status === "stale" ? "⚠" :
    "✗"
  console.log(
    `${statusIcon} ${r.file.padEnd(38)} ${r.status.padEnd(16)} ${r.detail ?? ""}`,
  )
}

console.log()
console.log("Summary:")

const counts: Record<TranslationStatus, number> = {
  "human-reviewed": 0,
  draft: 0,
  stale: 0,
  missing: 0,
}

for (const r of results) {
  counts[r.status]++
}

console.log(`  human-reviewed: ${counts["human-reviewed"]}`)
console.log(`  draft:          ${counts.draft}`)
console.log(`  stale:          ${counts.stale}`)
console.log(`  missing:        ${counts.missing}`)
console.log(`  total:          ${results.length}`)
