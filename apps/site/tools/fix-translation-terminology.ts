#!/usr/bin/env tsx
/**
 * Fixes terminology issues in Spanish translations by replacing
 * non-standard translations with the glossary-preferred terms,
 * and inserting missing protected terms/literals.
 *
 * Only modifies prose content (outside code blocks and frontmatter).
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, extname, join, relative, resolve, sep } from "node:path"
import { fileURLToPath } from "node:url"

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const workspaceRoot = resolve(projectRoot, "..", "..")
const CONTENT_EXTENSIONS = new Set([".md", ".mdx"])

// Replacements: alternative Spanish terms -> preferred glossary terms
// These are applied as whole-word replacements in prose (outside code blocks)
const TERM_REPLACEMENTS: Array<{ pattern: RegExp; replacement: string }> = [
  // focus -> foco (not enfoque)
  { pattern: /\benfoque\b/gi, replacement: "foco" },
  { pattern: /\benfoques\b/gi, replacement: "focos" },
  // screen reader -> lector de pantalla (not lector de pantallas)
  { pattern: /\blectores? de pantallas?\b/gi, replacement: "lector de pantalla" },
]

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

function splitFrontmatterAndBody(content: string): { frontmatter: string; body: string } {
  const match = content.match(/^(---\r?\n[\s\S]*?\r?\n---\r?\n?)/)
  if (!match) return { frontmatter: "", body: content }
  return { frontmatter: match[1], body: content.slice(match[1].length) }
}

function applyTermReplacements(body: string): string {
  // Split by code blocks to avoid modifying code
  const parts = body.split(/(```[\s\S]*?```|`[^`\n]+`)/g)
  let changed = false

  const result = parts.map((part, i) => {
    // Odd indices are code blocks/inline code - skip them
    if (i % 2 === 1) return part

    let modified = part
    for (const { pattern, replacement } of TERM_REPLACEMENTS) {
      modified = modified.replace(pattern, (match) => {
        // Preserve capitalization
        if (match[0] === match[0].toUpperCase()) {
          return replacement[0].toUpperCase() + replacement.slice(1)
        }
        return replacement
      })
    }
    if (modified !== part) changed = true
    return modified
  })

  return changed ? result.join("") : body
}

let totalUpdated = 0

function processFile(esPath: string, label: string): void {
  const content = readFileSync(esPath, "utf8")
  const { frontmatter, body } = splitFrontmatterAndBody(content)

  const newBody = applyTermReplacements(body)
  if (newBody !== body) {
    writeFileSync(esPath, frontmatter + newBody, "utf8")
    console.log(`✓ ${label}`)
    totalUpdated++
  }
}

// Site content
const siteEsRoot = join(projectRoot, "src", "content", "es")
const siteEsFiles = collectContentFiles(siteEsRoot, siteEsRoot)
for (const file of siteEsFiles) {
  processFile(join(siteEsRoot, file), file)
}

// Package-colocated docs
const packagesRoot = join(workspaceRoot, "packages")
if (existsSync(packagesRoot)) {
  for (const pkg of readdirSync(packagesRoot)) {
    const esDocsDir = join(packagesRoot, pkg, "docs", "es")
    if (!existsSync(esDocsDir)) continue

    const esFiles = collectContentFiles(esDocsDir, esDocsDir)
    for (const file of esFiles) {
      processFile(join(esDocsDir, file), `packages/${pkg}/docs/es/${file}`)
    }
  }
}

console.log(`\nDone: ${totalUpdated} files updated with terminology fixes.`)
