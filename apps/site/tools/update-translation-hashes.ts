#!/usr/bin/env tsx
/**
 * Updates translationSourceHash in all Spanish translation files to match
 * the current English source content. This moves files from "stale" to
 * "draft" status, indicating the translation exists but needs human review
 * against the updated source.
 *
 * Covers two content graphs:
 *   1. Site content: apps/site/src/content/{en,es}/**
 *   2. Package-colocated docs: packages/{name}/docs/ (es subdirectory)
 */
import { createHash } from "node:crypto"
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, extname, join, relative, resolve, sep } from "node:path"
import { fileURLToPath } from "node:url"

function computeSourceHash(content: string): string {
  return createHash("sha256").update(content, "utf8").digest("hex")
}

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const workspaceRoot = resolve(projectRoot, "..", "..")
const CONTENT_EXTENSIONS = new Set([".md", ".mdx"])

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

function updateHashInFile(esPath: string, newHash: string): boolean {
  const content = readFileSync(esPath, "utf8")
  const frontmatterMatch = content.match(/^(---\r?\n)([\s\S]*?)(\r?\n---)/)
  if (!frontmatterMatch) return false

  const [fullMatch, openFence, body, closeFence] = frontmatterMatch
  const rest = content.slice(fullMatch.length)

  // Check if translationSourceHash already exists
  if (/^translationSourceHash:/m.test(body)) {
    const updatedBody = body.replace(
      /^translationSourceHash:.*$/m,
      `translationSourceHash: "${newHash}"`,
    )
    if (updatedBody === body) return false // hash already correct
    writeFileSync(esPath, `${openFence}${updatedBody}${closeFence}${rest}`, "utf8")
    return true
  }

  // Add translationSourceHash before translationStatus if present, else at end
  let updatedBody: string
  if (/^translationStatus:/m.test(body)) {
    updatedBody = body.replace(
      /^(translationStatus:)/m,
      `translationSourceHash: "${newHash}"\n$1`,
    )
  } else {
    updatedBody = `${body}\ntranslationSourceHash: "${newHash}"\ntranslationStatus: draft`
  }
  writeFileSync(esPath, `${openFence}${updatedBody}${closeFence}${rest}`, "utf8")
  return true
}

let updated = 0
let skipped = 0

// ─── Site content ────────────────────────────────────────────────────────────
const siteEnRoot = join(projectRoot, "src", "content", "en")
const siteEsRoot = join(projectRoot, "src", "content", "es")
const siteFiles = collectContentFiles(siteEnRoot, siteEnRoot)

for (const file of siteFiles) {
  const enPath = join(siteEnRoot, file)
  const esPath = join(siteEsRoot, file)
  if (!existsSync(esPath)) continue

  const english = readFileSync(enPath, "utf8")
  const hash = computeSourceHash(english)
  if (updateHashInFile(esPath, hash)) {
    console.log(`✓ ${file}`)
    updated++
  } else {
    skipped++
  }
}

// ─── Package-colocated docs ──────────────────────────────────────────────────
const packagesRoot = join(workspaceRoot, "packages")
if (existsSync(packagesRoot)) {
  for (const packageName of readdirSync(packagesRoot)) {
    const docsDir = join(packagesRoot, packageName, "docs")
    if (!existsSync(docsDir)) continue

    const englishFiles = collectContentFiles(docsDir, docsDir).filter(
      (f) => !f.startsWith("es/"),
    )
    for (const file of englishFiles) {
      const enPath = join(docsDir, file)
      const esPath = join(docsDir, "es", file)
      if (!existsSync(esPath)) continue

      const english = readFileSync(enPath, "utf8")
      const hash = computeSourceHash(english)
      if (updateHashInFile(esPath, hash)) {
        console.log(`✓ packages/${packageName}/docs/${file}`)
        updated++
      } else {
        skipped++
      }
    }
  }
}

console.log(`\nDone: ${updated} files updated, ${skipped} already current.`)
