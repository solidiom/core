#!/usr/bin/env tsx
/**
 * CLI-003: Assert no "unverified" provenance entries in .solidiom/lock.json files.
 *
 * Scans all `.solidiom/lock.json` files under the given root directory and
 * fails if any `LockEntry` has `provenance: "unverified"`. This catches
 * developers who used `--allow-unverified` and committed the resulting lock.
 *
 * Usage: tsx tools/assert-no-unverified.ts [rootDir]
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import { dirname, join, resolve, relative } from "node:path"
import { fileURLToPath } from "node:url"

const DEFAULT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..")

export interface UnverifiedEntry {
  /** Project-relative path to the lock file. */
  lockFile: string
  /** Path of the installed file within the lock entry. */
  path: string
  /** Source primitive. */
  primitive: string
  /** Version at time of install. */
  version: string
  /** When the unverified install occurred. */
  verifiedAt: string
}

function isDirectory(path: string): boolean {
  try {
    return statSync(path).isDirectory()
  } catch {
    return false
  }
}

/** Recursively find all .solidiom/lock.json files under root. */
export function findLockFiles(root: string): string[] {
  const results: string[] = []
  function walk(dir: string): void {
    if (!isDirectory(dir)) return
    for (const entry of readdirSync(dir)) {
      const fullPath = join(dir, entry)
      if (entry === "node_modules" || entry === ".git") continue
      if (entry === "lock.json" && dirname(fullPath).endsWith(".solidiom")) {
        results.push(fullPath)
      } else if (isDirectory(fullPath)) {
        walk(fullPath)
      }
    }
  }
  walk(root)
  return results
}

/** Check a single lock file for unverified entries. */
export function checkLockFile(lockPath: string, root: string): UnverifiedEntry[] {
  if (!existsSync(lockPath)) return []
  const raw = readFileSync(lockPath, "utf8")
  const data = JSON.parse(raw)
  if (!data.installed || typeof data.installed !== "object") return []

  const violations: UnverifiedEntry[] = []
  for (const [key, entry] of Object.entries(data.installed)) {
    if (
      entry &&
      typeof entry === "object" &&
      (entry as { provenance?: string }).provenance === "unverified"
    ) {
      const e = entry as {
        path?: string
        primitive?: string
        version?: string
        verifiedAt?: string
      }
      violations.push({
        lockFile: relative(root, lockPath),
        path: e.path ?? key,
        primitive: e.primitive ?? "*",
        version: e.version ?? "*",
        verifiedAt: e.verifiedAt ?? "*",
      })
    }
  }
  return violations
}

/** Check all lock files under root. Returns all unverified entries. */
export function checkAll(root: string): UnverifiedEntry[] {
  const allViolations: UnverifiedEntry[] = []
  for (const lockFile of findLockFiles(root)) {
    allViolations.push(...checkLockFile(lockFile, root))
  }
  return allViolations
}

function main(): void {
  const root = process.argv[2] ?? DEFAULT_ROOT
  console.log("CLI-003: Unverified provenance assertion")
  console.log("=".repeat(50))

  const lockFiles = findLockFiles(root)
  if (lockFiles.length === 0) {
    console.log("No .solidiom/lock.json files found — nothing to check.")
    return
  }

  const violations = checkAll(root)

  for (const lockFile of lockFiles) {
    const relPath = relative(root, lockFile)
    const fileViolations = checkLockFile(lockFile, root)
    if (fileViolations.length === 0) {
      console.log(`  ✓ ${relPath}: all entries verified`)
    } else {
      console.log(`  ✗ ${relPath}: ${fileViolations.length} unverified entr(y/ies)`)
      for (const v of fileViolations) {
        console.log(
          `      - ${v.path} (${v.primitive}@${v.version}) — installed at ${v.verifiedAt}`,
        )
      }
    }
  }

  console.log()
  if (violations.length > 0) {
    console.error(
      `CLI-003: ${violations.length} unverified provenance entr(y/ies) found across ${new Set(violations.map((v) => v.lockFile)).size} lock file(s).`,
    )
    console.error("These were installed with --allow-unverified and should not be committed.")
    console.error("Reinstall with verified source, or update the registry signature policy.")
    process.exitCode = 1
    return
  }

  console.log("All lock entries have verified provenance.")
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}
