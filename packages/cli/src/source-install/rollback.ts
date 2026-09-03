/**
 * Content rollback journal for source installs (CLI-004).
 *
 * Parity with commands/create.ts's createCleanupJournal() naming convention
 * (CLI-006), but this journals file *content* rather than directories:
 * before install.ts overwrites/creates a path, it records that path's
 * pre-write content (or `null` if the path didn't exist yet). If the install
 * fails partway through — whether from a thrown error or an explicit
 * failure return — calling `apply()` restores every journaled path to its
 * pre-install state: previously-existing files get their original content
 * back, and previously-absent files are deleted again. Paths are restored in
 * reverse (most-recently-recorded-first) order, mirroring the cleanup
 * journal's unwind order.
 */

import { rmSync } from "node:fs"
import { atomicWriteFileSync, readTextFileIfExists } from "../fs/safe-write"

export interface RollbackJournal {
  /** Records a path's current on-disk content (or absence) before it is written. Call this BEFORE writing. */
  recordBeforeWrite(path: string): void
  /** Records a path that this operation created atomically after exclusive publication. */
  recordCreated(path: string): void
  /** Returns a snapshot of recorded paths, in recording order (for inspection/testing). */
  entries(): string[]
  /** Restores every recorded path to its pre-write state, in reverse order, then clears the journal. */
  apply(): void
}

/**
 * Creates a rollback journal that content-snapshots paths before they are
 * written, so a mid-install failure can be undone leaving the tree
 * byte-identical to before the install started.
 */
export function createRollbackJournal(): RollbackJournal {
  const recorded: string[] = []
  // Keyed by path; value is the previous file content, or null if the path
  // did not exist before this journal recorded it. A Map (not a plain
  // object) avoids prototype-pollution footguns from arbitrary path strings.
  const previous = new Map<string, string | null>()

  return {
    recordBeforeWrite(path: string): void {
      // Only the FIRST recording for a given path matters — subsequent
      // writes to the same path within one install must still roll back to
      // the ORIGINAL pre-install state, not an intermediate one.
      if (previous.has(path)) return
      previous.set(path, readTextFileIfExists(path))
      recorded.push(path)
    },

    recordCreated(path: string): void {
      if (previous.has(path)) return
      previous.set(path, null)
      recorded.push(path)
    },

    entries(): string[] {
      return [...recorded]
    },

    apply(): void {
      for (let i = recorded.length - 1; i >= 0; i--) {
        const path = recorded[i]!
        const content = previous.get(path) ?? null
        if (content === null) {
          rmSync(path, { force: true })
        } else {
          atomicWriteFileSync(path, content)
        }
      }
      recorded.length = 0
      previous.clear()
    },
  }
}
