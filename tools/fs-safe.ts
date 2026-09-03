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

function writeTemp(path: string, content: string | Buffer): string {
  mkdirSync(dirname(path), { recursive: true })
  const temp = join(
    dirname(path),
    `.${basename(path)}.${process.pid}.${randomBytes(12).toString("hex")}.tmp`,
  )
  const fd = openSync(temp, constants.O_CREAT | constants.O_EXCL | constants.O_WRONLY, 0o666)
  try {
    writeFileSync(fd, content)
    fsyncSync(fd)
  } catch (error) {
    closeSync(fd)
    rmSync(temp, { force: true })
    throw error
  }
  closeSync(fd)
  return temp
}

export function atomicWriteFileSync(path: string, content: string | Buffer): void {
  const temp = writeTemp(path, content)
  try {
    renameSync(temp, path)
  } catch (error) {
    rmSync(temp, { force: true })
    throw error
  }
}

export function createFileExclusiveSync(path: string, content: string | Buffer): boolean {
  const temp = writeTemp(path, content)
  try {
    linkSync(temp, path)
    return true
  } catch (error) {
    if (isErrno(error, "EEXIST")) return false
    throw error
  } finally {
    rmSync(temp, { force: true })
  }
}

export function readTextFileIfExists(path: string): string | null {
  try {
    return readFileSync(path, "utf8")
  } catch (error) {
    if (isErrno(error, "ENOENT")) return null
    throw error
  }
}

export function readBufferIfExists(path: string): Buffer | null {
  try {
    return readFileSync(path)
  } catch (error) {
    if (isErrno(error, "ENOENT")) return null
    throw error
  }
}
