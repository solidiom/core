import { randomBytes } from "node:crypto"
import {
  closeSync,
  constants,
  fsyncSync,
  linkSync,
  mkdirSync,
  openSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import { basename, dirname, join } from "node:path"

function isErrno(error: unknown, code: string): boolean {
  return error instanceof Error && "code" in error && error.code === code
}

function siblingTempPath(path: string): string {
  const suffix = randomBytes(12).toString("hex")
  return join(dirname(path), `.${basename(path)}.${process.pid}.${suffix}.tmp`)
}

function writeDurableTemp(path: string, content: string | Buffer, mode: number): string {
  mkdirSync(dirname(path), { recursive: true })
  const tempPath = siblingTempPath(path)
  const fd = openSync(tempPath, constants.O_CREAT | constants.O_EXCL | constants.O_WRONLY, mode)
  try {
    writeFileSync(fd, content)
    fsyncSync(fd)
  } catch (error) {
    closeSync(fd)
    rmSync(tempPath, { force: true })
    throw error
  }
  closeSync(fd)
  return tempPath
}

/** Replace a file atomically without following a final-component symlink. */
export function atomicWriteFileSync(path: string, content: string | Buffer, mode = 0o666): void {
  const tempPath = writeDurableTemp(path, content, mode)
  try {
    renameSync(tempPath, path)
  } catch (error) {
    rmSync(tempPath, { force: true })
    throw error
  }
}

/**
 * Publish a complete file only when the destination does not exist.
 * The hard link makes publication atomic and fails safely for existing files
 * and symlinks while keeping partially-written content invisible.
 */
export function createFileExclusiveSync(
  path: string,
  content: string | Buffer,
  mode = 0o666,
): boolean {
  const tempPath = writeDurableTemp(path, content, mode)
  try {
    linkSync(tempPath, path)
    return true
  } catch (error) {
    if (isErrno(error, "EEXIST")) return false
    throw error
  } finally {
    rmSync(tempPath, { force: true })
  }
}

/** Read a UTF-8 file without a separate existence check. */
export function readTextFileIfExists(path: string): string | null {
  try {
    return readFileSync(path, "utf8")
  } catch (error) {
    if (isErrno(error, "ENOENT")) return null
    throw error
  }
}
