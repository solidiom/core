import { mkdirSync, mkdtempSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"

/** Create a process-unique directory with OS-guaranteed exclusive creation. */
export function createTempDir(prefix: string): string {
  return mkdtempSync(join(tmpdir(), `${prefix}-`))
}

/** Create a secure temp root plus a nested working directory beneath it. */
export function createNestedTempDir(
  prefix: string,
  ...segments: string[]
): { root: string; cwd: string } {
  const root = createTempDir(prefix)
  const cwd = join(root, ...segments)
  mkdirSync(cwd, { recursive: true })
  return { root, cwd }
}

/** Create an exclusive temp-style directory beneath a required parent path. */
export function createNestedTempDirIn(
  parent: string,
  prefix: string,
  ...segments: string[]
): { root: string; cwd: string } {
  const root = mkdtempSync(join(parent, `${prefix}-`))
  const cwd = join(root, ...segments)
  mkdirSync(cwd, { recursive: true })
  return { root, cwd }
}
