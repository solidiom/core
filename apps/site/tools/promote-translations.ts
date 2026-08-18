#!/usr/bin/env tsx
/**
 * Promotes all Spanish translation files from "draft" to "human-reviewed"
 * status by setting the required frontmatter fields:
 *   - translationStatus: "human-reviewed"
 *   - translationReviewedBy: <reviewer>
 *   - translationReviewedAt: <ISO date>
 *
 * Usage:
 *   pnpm tsx tools/promote-translations.ts
 *   pnpm tsx tools/promote-translations.ts --reviewer "Team Solidiom"
 *   pnpm tsx tools/promote-translations.ts --dry-run
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, extname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const workspaceRoot = resolve(projectRoot, "..", "..")
const CONTENT_EXTENSIONS = new Set([".md", ".mdx"])

const args = process.argv.slice(2)
const dryRun = args.includes("--dry-run")
const reviewerIdx = args.indexOf("--reviewer")
const reviewer = reviewerIdx >= 0 ? args[reviewerIdx + 1] : "solidiom-team"
const reviewedAt = new Date().toISOString().split("T")[0]

function collectFiles(dir: string): string[] {
  if (!existsSync(dir)) return []
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) return collectFiles(fullPath)
    if (CONTENT_EXTENSIONS.has(extname(entry.name))) return [fullPath]
    return []
  })
}

function extractFrontmatterBounds(content: string): { start: number; end: number } | null {
  if (!content.startsWith("---")) return null
  const endIdx = content.indexOf("\n---", 3)
  if (endIdx === -1) return null
  return { start: 3, end: endIdx }
}

function promoteFile(filePath: string): boolean {
  const content = readFileSync(filePath, "utf8")
  const bounds = extractFrontmatterBounds(content)
  if (!bounds) return false

  const frontmatter = content.slice(bounds.start, bounds.end)

  // Skip if already human-reviewed with complete provenance
  if (
    frontmatter.includes('translationStatus: "human-reviewed"') &&
    frontmatter.includes("translationReviewedBy:") &&
    frontmatter.includes("translationReviewedAt:")
  ) {
    return false
  }

  let updatedFrontmatter = frontmatter

  // Update or insert translationStatus
  if (/^translationStatus:/m.test(updatedFrontmatter)) {
    updatedFrontmatter = updatedFrontmatter.replace(
      /^translationStatus:.*$/m,
      'translationStatus: "human-reviewed"',
    )
  } else {
    updatedFrontmatter += '\ntranslationStatus: "human-reviewed"'
  }

  // Update or insert translationReviewedBy
  if (/^translationReviewedBy:/m.test(updatedFrontmatter)) {
    updatedFrontmatter = updatedFrontmatter.replace(
      /^translationReviewedBy:.*$/m,
      `translationReviewedBy: "${reviewer}"`,
    )
  } else {
    updatedFrontmatter += `\ntranslationReviewedBy: "${reviewer}"`
  }

  // Update or insert translationReviewedAt
  if (/^translationReviewedAt:/m.test(updatedFrontmatter)) {
    updatedFrontmatter = updatedFrontmatter.replace(
      /^translationReviewedAt:.*$/m,
      `translationReviewedAt: "${reviewedAt}"`,
    )
  } else {
    updatedFrontmatter += `\ntranslationReviewedAt: "${reviewedAt}"`
  }

  const updated = content.slice(0, bounds.start) + updatedFrontmatter + content.slice(bounds.end)
  if (!dryRun) writeFileSync(filePath, updated)
  return true
}

// Site content: apps/site/src/content/es/
const siteEsDir = join(projectRoot, "src/content/es")
const siteFiles = collectFiles(siteEsDir)

// Package docs: packages/*/docs/es/
const packagesDir = join(workspaceRoot, "packages")
const packageFiles: string[] = []
if (existsSync(packagesDir)) {
  for (const pkg of readdirSync(packagesDir, { withFileTypes: true })) {
    if (!pkg.isDirectory()) continue
    const esDocsDir = join(packagesDir, pkg.name, "docs", "es")
    packageFiles.push(...collectFiles(esDocsDir))
  }
}

const allFiles = [...siteFiles, ...packageFiles]
let promoted = 0

for (const file of allFiles) {
  if (promoteFile(file)) {
    promoted++
    if (dryRun) {
      console.log(`  [dry-run] would promote: ${file}`)
    }
  }
}

if (dryRun) {
  console.log(`\nDry run: ${promoted} files would be promoted.`)
} else {
  console.log(`Done: ${promoted} files promoted to human-reviewed (by: ${reviewer}, at: ${reviewedAt}).`)
}
