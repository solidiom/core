/**
 * .solidiom/lock.json read/write + digest helpers for source installs.
 *
 * Extracted out of install.ts (CLI-003) so verify-source.ts and other
 * source-install collaborators can depend on the lock shape without pulling
 * in the full install engine.
 */

import { join } from "node:path"
import { createHash } from "node:crypto"
import { atomicWriteFileSync, readTextFileIfExists } from "../fs/safe-write"

/** An entry in .solidiom/lock.json tracking source installs. */
export interface LockEntry {
  /** Relative path from project root. */
  path: string
  /** SHA-256 digest of original source content. */
  digest: string
  /** Source primitive this file belongs to. */
  primitive: string
  /** Version at time of install. */
  version: string
  /** Whether this file has been detached from updates. */
  detached?: boolean
  /** The registry manifest's recorded filesHash at the time this entry was installed/verified. */
  manifestFilesHash: string
  /** The signing key id that verified the registry index, when the manifest carries a signature. */
  signatureKeyId?: string
  /** ISO-8601 timestamp of when verification (or the unverified install) occurred. */
  verifiedAt: string
  /** Whether this entry's install was verified against the registry manifest or bypassed via --allow-unverified. */
  provenance: "verified" | "unverified"
}

export interface LockFile {
  version: 1
  installed: Record<string, LockEntry>
}

/** Compute SHA-256 digest of content. */
export function computeDigest(content: string): string {
  return createHash("sha256").update(content, "utf8").digest("hex")
}

/** Read existing lockfile, or create fresh. */
export function readLock(cwd: string): LockFile {
  const lockPath = join(cwd, ".solidiom", "lock.json")
  const content = readTextFileIfExists(lockPath)
  return content === null ? { version: 1, installed: {} } : JSON.parse(content)
}

/** Write lockfile via same-directory atomic replacement. */
export function writeLock(cwd: string, lock: LockFile): void {
  const lockPath = join(cwd, ".solidiom", "lock.json")
  atomicWriteFileSync(lockPath, JSON.stringify(lock, null, 2) + "\n", 0o600)
}
