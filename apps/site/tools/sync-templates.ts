#!/usr/bin/env tsx
/**
 * Syncs template build artifacts into the site's public directory so they
 * can be served statically (e.g. inside iframes on the template preview page).
 *
 * Reads from the workspace root `templates/` directory, copying each
 * template's `dist/` output into `apps/site/public/templates/<name>/`.
 *
 * Idempotent: skips files whose content has not changed (compares mtime and
 * size, copies when source is newer or destination is missing).
 *
 * Run from `apps/site/` as cwd:
 *   npx tsx tools/sync-templates.ts
 */
import {
  copyFile,
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
  statSync,
} from "node:fs"
import { join, resolve } from "node:path"

const SITE_ROOT = resolve(process.cwd())
const WORKSPACE_ROOT = resolve(SITE_ROOT, "..", "..")
const TEMPLATES_DIR = join(WORKSPACE_ROOT, "templates")
const OUTPUT_DIR = join(SITE_ROOT, "public", "templates")

function dirEntries(dir: string): string[] {
  if (!existsSync(dir)) return []
  return readdirSync(dir).filter(
    (name) => statSync(join(dir, name)).isDirectory(),
  )
}

function syncDir(src: string, dst: string): { copied: number; skipped: number; deleted: number } {
  let copied = 0
  let skipped = 0
  let deleted = 0

  const srcEntries = readdirSync(src, { withFileTypes: true })
  const dstNames = new Set<string>()

  if (existsSync(dst)) {
    for (const entry of readdirSync(dst)) dstNames.add(entry)
  }

  const srcNames = new Set<string>()

  for (const entry of srcEntries) {
    srcNames.add(entry.name)
    const srcPath = join(src, entry.name)
    const dstPath = join(dst, entry.name)

    if (entry.isDirectory()) {
      mkdirSync(dstPath, { recursive: true })
      const sub = syncDir(srcPath, dstPath)
      copied += sub.copied
      skipped += sub.skipped
      deleted += sub.deleted
    } else {
      const needsCopy = shouldCopy(srcPath, dstPath)
      if (needsCopy) {
        mkdirSync(dirname(dstPath), { recursive: true })
        copyFileSync(srcPath, dstPath)
        copied++
      } else {
        skipped++
      }
    }
  }

  // Remove stale files from destination that no longer exist in source
  for (const name of dstNames) {
    if (!srcNames.has(name)) {
      const stalePath = join(dst, name)
      if (statSync(stalePath).isDirectory()) {
        rmSync(stalePath, { recursive: true })
      } else {
        rmSync(stalePath)
      }
      deleted++
    }
  }

  return { copied, skipped, deleted }
}

function shouldCopy(srcPath: string, dstPath: string): boolean {
  if (!existsSync(dstPath)) return true

  const srcStat = statSync(srcPath)
  const dstStat = statSync(dstPath)

  // Copy if sizes differ
  if (srcStat.size !== dstStat.size) return true

  // Copy if source is newer
  if (srcStat.mtimeMs > dstStat.mtimeMs) return true

  return false
}

function dirname(path: string): string {
  return path.substring(0, path.lastIndexOf("/"))
}

function copyFileSync(src: string, dst: string): void {
  copyFile(src, dst, () => {})
}

// ─── Main ───

if (!existsSync(TEMPLATES_DIR)) {
  console.log(`[sync-templates] Templates directory not found: ${TEMPLATES_DIR}`)
  process.exit(0)
}

const templateNames = dirEntries(TEMPLATES_DIR)

if (templateNames.length === 0) {
  console.log("[sync-templates] No templates found.")
  process.exit(0)
}

mkdirSync(OUTPUT_DIR, { recursive: true })

let totalCopied = 0
let totalSkipped = 0
let totalDeleted = 0
let synced = 0
let skipped = 0

for (const name of templateNames.sort()) {
  const distDir = join(TEMPLATES_DIR, name, "dist")
  if (!existsSync(distDir)) {
    // Clean up stale output if the dist no longer exists
    const outputSubDir = join(OUTPUT_DIR, name)
    if (existsSync(outputSubDir)) {
      rmSync(outputSubDir, { recursive: true })
      totalDeleted++
    }
    continue
  }

  const outputSubDir = join(OUTPUT_DIR, name)
  mkdirSync(outputSubDir, { recursive: true })

  const result = syncDir(distDir, outputSubDir)
  totalCopied += result.copied
  totalSkipped += result.skipped
  totalDeleted += result.deleted
  synced++
}

const unsynced = templateNames.length - synced

console.log(`[sync-templates] Done — ${synced} synced, ${unsynced} without dist/, ${totalCopied} copied, ${totalSkipped} skipped, ${totalDeleted} deleted.`)
