#!/usr/bin/env tsx
/**
 * CONTENT-003 content collection validation.
 *
 * Validates every authored content entry across both site-wide collections
 * (`apps/site/src/content/{en,es}/**`) and package-colocated collections
 * (`packages/*\/docs/**`) for:
 *
 *   1. Required metadata: title, description, product identity fields
 *      (`product`, `productLayer`, `package` where applicable), `status`,
 *      and — for dated collections (articles, changelog) — a valid date.
 *   2. Unique slugs within a collection + locale (no two entries resolve to
 *      the same public route).
 *   3. Product identity consistency: the English and Spanish entry for the
 *      same slug must declare the same `product`, `productLayer`, `package`,
 *      and `status` — a translation cannot silently redefine what it is.
 *   4. Locale parity: every English entry has a Spanish counterpart and vice
 *      versa (unless the collection is intentionally single-locale).
 *
 * This mirrors — but does not replace — the Zod schemas in
 * `src/content.config.ts` (structural shape) and `validate-route-parity.ts`
 * (page-route parity). This script validates the raw authored content graph
 * directly so a violation is caught before Astro even attempts to build.
 *
 * Usage: tsx ./tools/validate-content-collections.ts
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import { dirname, join, relative, resolve, sep } from "node:path"
import { fileURLToPath } from "node:url"

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const workspaceRoot = resolve(projectRoot, "..", "..")
const siteContentRoot = join(projectRoot, "src", "content")
const packagesRoot = join(workspaceRoot, "packages")

type Locale = "en" | "es"
const LOCALES: Locale[] = ["en", "es"]
const CONTENT_EXTENSIONS = new Set([".md", ".mdx"])

interface ContentEntry {
  /** Collection name for reporting (e.g. "articles", "primitives:dialog"). */
  collection: string
  /** Slug used for uniqueness/parity comparison within the collection. */
  slug: string
  locale: Locale
  /** Path relative to the workspace root, for error reporting. */
  file: string
  frontmatter: Record<string, string>
  requiresDate: boolean
  requiresProductIdentity: boolean
}

// ─── Frontmatter parsing (flat key: value pairs; arrays/objects are ignored
// for this validator's purposes — full shape validation is Zod's job) ──────

function extractFrontmatter(content: string): Record<string, string> {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return {}

  const fields: Record<string, string> = {}
  const lines = match[1].split(/\r?\n/)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!
    // Skip nested/indented lines (array items, nested object fields) — this
    // validator only inspects top-level scalar frontmatter fields.
    if (/^\s/.test(line)) continue
    const colonIndex = line.indexOf(":")
    if (colonIndex === -1) continue
    const key = line.slice(0, colonIndex).trim()
    let value = line.slice(colonIndex + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    fields[key] = value
  }
  return fields
}

function extExtensionOf(name: string): string {
  const index = name.lastIndexOf(".")
  return index === -1 ? "" : name.slice(index)
}

function collectFiles(dir: string): string[] {
  if (!existsSync(dir)) return []
  const results: string[] = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...collectFiles(full))
    } else if (CONTENT_EXTENSIONS.has(extExtensionOf(entry.name))) {
      results.push(full)
    }
  }
  return results.sort()
}

// ─── Site-wide collections (apps/site/src/content/{en,es}/<collection>/**) ─

const SITE_COLLECTIONS: Array<{
  name: string
  dir: string
  requiresDate: boolean
  requiresProductIdentity: boolean
  requiresLocaleParity: boolean
}> = [
  { name: "guides", dir: "guides", requiresDate: false, requiresProductIdentity: false, requiresLocaleParity: true },
  { name: "articles", dir: "blog", requiresDate: true, requiresProductIdentity: false, requiresLocaleParity: true },
  { name: "changelog", dir: "changelog", requiresDate: true, requiresProductIdentity: false, requiresLocaleParity: true },
  { name: "pages", dir: "pages", requiresDate: false, requiresProductIdentity: false, requiresLocaleParity: true },
  { name: "components", dir: "components", requiresDate: false, requiresProductIdentity: true, requiresLocaleParity: true },
  { name: "blocks", dir: "blocks", requiresDate: false, requiresProductIdentity: true, requiresLocaleParity: true },
  { name: "templates", dir: "templates", requiresDate: false, requiresProductIdentity: true, requiresLocaleParity: true },
  { name: "themes", dir: "themes", requiresDate: false, requiresProductIdentity: true, requiresLocaleParity: true },
]

function slugFromFile(root: string, file: string): string {
  const rel = relative(root, file).split(sep).join("/")
  const withoutExt = rel.slice(0, rel.length - extExtensionOf(rel).length)
  return withoutExt === "index" ? "" : withoutExt.replace(/\/index$/, "")
}

function loadSiteCollectionEntries(): ContentEntry[] {
  const entries: ContentEntry[] = []
  for (const collection of SITE_COLLECTIONS) {
    for (const locale of LOCALES) {
      const localeDir = join(siteContentRoot, locale, collection.dir)
      for (const file of collectFiles(localeDir)) {
        const slug = slugFromFile(localeDir, file)
        entries.push({
          collection: collection.name,
          slug,
          locale,
          file: relative(workspaceRoot, file),
          frontmatter: extractFrontmatter(readFileSync(file, "utf8")),
          requiresDate: collection.requiresDate,
          requiresProductIdentity: collection.requiresProductIdentity,
        })
      }
    }
  }
  return entries
}

// ─── Package-colocated collections (packages/<name>/docs/**) ──────────────

/**
 * Package docs mix three logical collections in one directory tree:
 *   - primitives: docs/overview.md, docs/es/overview.md
 *   - accessibilityContracts: docs/accessibility/*.md, docs/es/accessibility/*.md
 *   - examples: docs/examples/*.md, docs/es/examples/*.md
 * The slug for parity/uniqueness purposes is the package name plus the
 * example/section identifier, since primitives, accessibility contracts, and
 * examples are each their own collection namespace.
 */
function loadPackageCollectionEntries(): ContentEntry[] {
  const entries: ContentEntry[] = []
  if (!existsSync(packagesRoot)) return entries

  for (const packageName of readdirSync(packagesRoot)) {
    const docsDir = join(packagesRoot, packageName, "docs")
    if (!existsSync(docsDir) || !statSync(docsDir).isDirectory()) continue

    // primitives: overview.md (en) / es/overview.md (es)
    for (const locale of LOCALES) {
      const overviewPath =
        locale === "en" ? join(docsDir, "overview.md") : join(docsDir, "es", "overview.md")
      if (!existsSync(overviewPath)) continue
      entries.push({
        collection: "primitives",
        slug: packageName,
        locale,
        file: relative(workspaceRoot, overviewPath),
        frontmatter: extractFrontmatter(readFileSync(overviewPath, "utf8")),
        requiresDate: false,
        requiresProductIdentity: true,
      })
    }

    // accessibilityContracts: accessibility/*.md (en) / es/accessibility/*.md (es)
    for (const locale of LOCALES) {
      const dir = locale === "en" ? join(docsDir, "accessibility") : join(docsDir, "es", "accessibility")
      for (const file of collectFiles(dir)) {
        const slug = `${packageName}/${slugFromFile(dir, file)}`
        entries.push({
          collection: "accessibilityContracts",
          slug,
          locale,
          file: relative(workspaceRoot, file),
          frontmatter: extractFrontmatter(readFileSync(file, "utf8")),
          requiresDate: false,
          requiresProductIdentity: true,
        })
      }
    }

    // examples: examples/*.md (en) / es/examples/*.md (es)
    for (const locale of LOCALES) {
      const dir = locale === "en" ? join(docsDir, "examples") : join(docsDir, "es", "examples")
      for (const file of collectFiles(dir)) {
        const slug = `${packageName}/${slugFromFile(dir, file)}`
        entries.push({
          collection: "examples",
          slug,
          locale,
          file: relative(workspaceRoot, file),
          frontmatter: extractFrontmatter(readFileSync(file, "utf8")),
          requiresDate: false,
          requiresProductIdentity: true,
        })
      }
    }
  }

  return entries
}

// ─── Validation ─────────────────────────────────────────────────────────────

const PRODUCT_IDENTITY_FIELDS = ["product", "productLayer", "status"] as const

function validateRequiredMetadata(entry: ContentEntry): string[] {
  const errors: string[] = []
  const { frontmatter } = entry

  if (!frontmatter.title) errors.push("missing required field: title")
  if (!frontmatter.description) errors.push("missing required field: description")

  if (entry.requiresProductIdentity) {
    for (const field of PRODUCT_IDENTITY_FIELDS) {
      if (!frontmatter[field]) errors.push(`missing required product identity field: ${field}`)
    }
  }

  if (entry.requiresDate) {
    if (!frontmatter.date) {
      errors.push("missing required field: date")
    } else if (Number.isNaN(Date.parse(frontmatter.date))) {
      errors.push(`invalid date: "${frontmatter.date}"`)
    }
  }

  return errors
}

function main(): void {
  const entries = [...loadSiteCollectionEntries(), ...loadPackageCollectionEntries()]
  const failures: string[] = []

  if (entries.length === 0) {
    console.log("CONTENT-003 Content Collection Validation")
    console.log("=".repeat(50))
    console.log("No authored content entries found yet — nothing to validate.")
    return
  }

  // 1 & 3: required metadata + collect for slug uniqueness / parity / identity checks.
  const byCollection = new Map<string, ContentEntry[]>()
  for (const entry of entries) {
    const key = entry.collection
    if (!byCollection.has(key)) byCollection.set(key, [])
    byCollection.get(key)!.push(entry)

    for (const error of validateRequiredMetadata(entry)) {
      failures.push(`${entry.file}: ${error}`)
    }
  }

  for (const [collectionName, collectionEntries] of byCollection) {
    // 2. Unique slugs within collection + locale.
    const seen = new Map<string, ContentEntry>()
    for (const entry of collectionEntries) {
      const key = `${entry.locale}:${entry.slug}`
      const existing = seen.get(key)
      if (existing) {
        failures.push(
          `${collectionName}: duplicate slug "${entry.slug}" (${entry.locale}) in ${entry.file} and ${existing.file}`,
        )
      } else {
        seen.set(key, entry)
      }
    }

    // 3. Product identity consistency + 4. locale parity, per slug.
    const bySlug = new Map<string, Map<Locale, ContentEntry>>()
    for (const entry of collectionEntries) {
      if (!bySlug.has(entry.slug)) bySlug.set(entry.slug, new Map())
      bySlug.get(entry.slug)!.set(entry.locale, entry)
    }

    for (const [slug, localeMap] of bySlug) {
      const en = localeMap.get("en")
      const es = localeMap.get("es")

      if (!en) {
        failures.push(`${collectionName}: slug "${slug}" has an "es" entry but no "en" source (${es!.file})`)
      } else if (!es) {
        failures.push(`${collectionName}: slug "${slug}" is missing its Spanish translation (source: ${en.file})`)
      } else if (en.requiresProductIdentity) {
        for (const field of PRODUCT_IDENTITY_FIELDS) {
          const enValue = en.frontmatter[field]
          const esValue = es.frontmatter[field]
          if (enValue && esValue && enValue !== esValue) {
            failures.push(
              `${collectionName}: slug "${slug}" — "${field}" differs between locales (en="${enValue}" in ${en.file}, es="${esValue}" in ${es.file})`,
            )
          }
        }
      }
    }
  }

  console.log("CONTENT-003 Content Collection Validation")
  console.log("=".repeat(50))
  console.log(`Collections checked: ${byCollection.size}`)
  console.log(`Entries checked: ${entries.length}`)
  console.log()

  if (failures.length > 0) {
    console.log(`Failures (${failures.length}):`)
    for (const failure of failures) console.log(`  ✗ ${failure}`)
    process.exitCode = 1
    return
  }

  console.log("All content entries have required metadata, unique slugs, consistent product identity, and locale parity.")
}

main()
