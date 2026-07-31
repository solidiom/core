/**
 * Pre-install conflict detection (CLI-004).
 *
 * install.ts's CLI-003 verification checks the *upstream* source bytes
 * against the registry manifest before anything is written. This module adds
 * a distinct, earlier check: given the set of files an install is *about* to
 * write, does writing them clobber content the user already has on disk that
 * this tool didn't put there (or has since modified)?
 *
 * This is a different moment than commands/update.ts's three-way merge:
 * update.ts re-syncs files that were already installed by this tool against
 * a newer upstream. classifyConflicts runs before any file from *this*
 * install exists, so there is no "installed version" to three-way-merge
 * against yet for files being written for the first time — only "what's on
 * disk right now" vs "what the lock says was last installed" vs "what we're
 * about to write".
 *
 * classifyConflicts intentionally does NOT reuse threeWayMerge — there is no
 * merge to perform pre-install, only a classification of whether a write is
 * safe. renderUnifiedDiff (for `--diff`) is a distinct, minimal line-based
 * diff renderer reused for showing *what* would change, not merging it.
 */

import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { readLock, computeDigest, type LockFile } from "./lock"

/** How a single planned file compares against what's on disk / in the lockfile. */
export type ConflictClassification = "create" | "unchanged" | "modified-by-user" | "overwrite"

export interface ConflictEntry {
  /** Path relative to cwd. */
  path: string
  classification: ConflictClassification
  /** Rendered unified diff of on-disk content vs planned content, when they differ. */
  diff?: string
}

export interface ConflictReport {
  entries: ConflictEntry[]
  /** True when any entry is "modified-by-user" and the caller has not requested --force. */
  hasBlockingConflicts: boolean
}

export interface ClassifyConflictsOptions {
  cwd: string
  /** Relative path (from cwd) -> new content that would be written. */
  plannedFiles: Map<string, string>
  /** When true, "modified-by-user" entries no longer make hasBlockingConflicts true (caller intends to overwrite). */
  force?: boolean
  /** Injectable for testing; defaults to reading the real lockfile via readLock(cwd). */
  lock?: LockFile
}

/**
 * Classifies every planned file as create/unchanged/modified-by-user/overwrite
 * by comparing on-disk content, the lockfile's recorded install digest, and
 * the new content this install would write. See ConflictClassification for
 * the exact rules; this function is PURE — it only reads from disk, never writes.
 */
export function classifyConflicts(options: ClassifyConflictsOptions): ConflictReport {
  const { cwd, plannedFiles, force = false } = options
  const lock = options.lock ?? readLock(cwd)

  const entries: ConflictEntry[] = []
  let hasBlockingConflicts = false

  for (const [relPath, newContent] of plannedFiles) {
    const fullPath = join(cwd, relPath)
    const lockEntry = lock.installed[relPath]
    const existsOnDisk = existsSync(fullPath)

    if (!existsOnDisk) {
      // No file on disk at all: this is a straightforward create, regardless
      // of whether a (now-stale/deleted-file) lock entry exists.
      entries.push({ path: relPath, classification: "create" })
      continue
    }

    const onDiskContent = readFileSync(fullPath, "utf8")
    const onDiskDigest = computeDigest(onDiskContent)
    const plannedDigest = computeDigest(newContent)
    const contentIdentical = onDiskDigest === plannedDigest

    if (contentIdentical) {
      // Re-installing byte-identical content — never a conflict, regardless
      // of lock state.
      entries.push({ path: relPath, classification: "unchanged" })
      continue
    }

    if (!lockEntry) {
      // No provenance recorded for this path, but something already exists
      // on disk with DIFFERENT content than what we're about to write. We
      // don't know if this file was hand-authored by the user or installed
      // by a tool version that predates the lockfile — treat conservatively
      // as user-owned and refuse by default.
      const classification: ConflictClassification = "modified-by-user"
      const diff = renderUnifiedDiff(onDiskContent, newContent, relPath)
      entries.push({ path: relPath, classification, diff })
      if (!force) hasBlockingConflicts = true
      continue
    }

    if (onDiskDigest === lockEntry.digest) {
      // On-disk content matches exactly what was last installed — the user
      // hasn't touched it, so a differing planned content is a clean
      // upstream-driven overwrite (e.g. re-running install after a manifest bump).
      const diff = renderUnifiedDiff(onDiskContent, newContent, relPath)
      entries.push({ path: relPath, classification: "overwrite", diff })
      continue
    }

    // On-disk content differs from BOTH the lock's recorded digest AND the
    // planned content — the user edited this file since it was installed.
    const diff = renderUnifiedDiff(onDiskContent, newContent, relPath)
    entries.push({ path: relPath, classification: "modified-by-user", diff })
    if (!force) hasBlockingConflicts = true
  }

  return { entries, hasBlockingConflicts }
}

/**
 * Minimal line-based unified diff renderer (no external dependency).
 *
 * Not a full Myers-diff/LCS implementation — it walks both files line by
 * line and, for the first index where they diverge, emits a unified-diff-
 * style hunk with a few lines of leading/trailing context. This is
 * sufficient for `--diff` and conflict reporting to show *what* would
 * change; it does not need to produce a minimal edit script.
 */
export function renderUnifiedDiff(oldContent: string, newContent: string, label: string): string {
  const oldLines = oldContent.split("\n")
  const newLines = newContent.split("\n")
  const contextSize = 3

  if (oldContent === newContent) {
    return `--- ${label}\n+++ ${label}\n(no differences)\n`
  }

  // Find the first and last differing line indices between the two files.
  const maxLen = Math.max(oldLines.length, newLines.length)
  let firstDiff = 0
  while (
    firstDiff < maxLen &&
    oldLines[firstDiff] !== undefined &&
    newLines[firstDiff] !== undefined &&
    oldLines[firstDiff] === newLines[firstDiff]
  ) {
    firstDiff++
  }

  let oldEnd = oldLines.length - 1
  let newEnd = newLines.length - 1
  while (
    oldEnd > firstDiff - 1 &&
    newEnd > firstDiff - 1 &&
    oldLines[oldEnd] !== undefined &&
    newLines[newEnd] !== undefined &&
    oldLines[oldEnd] === newLines[newEnd]
  ) {
    oldEnd--
    newEnd--
  }

  const contextStart = Math.max(0, firstDiff - contextSize)
  const oldHunkEnd = Math.min(oldLines.length - 1, oldEnd + contextSize)
  const newHunkEnd = Math.min(newLines.length - 1, newEnd + contextSize)

  const oldHunkLen = oldHunkEnd - contextStart + 1
  const newHunkLen = newHunkEnd - contextStart + 1

  const lines: string[] = [`--- ${label}`, `+++ ${label}`]
  lines.push(
    `@@ -${contextStart + 1},${Math.max(oldHunkLen, 0)} +${contextStart + 1},${Math.max(newHunkLen, 0)} @@`,
  )

  // Leading context (lines identical in both, before the first divergence).
  for (let i = contextStart; i < firstDiff; i++) {
    lines.push(` ${oldLines[i] ?? ""}`)
  }

  // Removed lines (old-only span within the divergent region).
  for (let i = firstDiff; i <= oldEnd; i++) {
    lines.push(`-${oldLines[i]}`)
  }

  // Added lines (new-only span within the divergent region).
  for (let i = firstDiff; i <= newEnd; i++) {
    lines.push(`+${newLines[i]}`)
  }

  // Trailing context (lines identical in both, after the last divergence).
  for (let i = oldEnd + 1; i <= oldHunkEnd; i++) {
    lines.push(` ${oldLines[i] ?? ""}`)
  }

  return lines.join("\n") + "\n"
}
