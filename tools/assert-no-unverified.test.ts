import { describe, it, expect, beforeEach, afterAll } from "vitest"
import { mkdirSync, writeFileSync, rmSync, existsSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { findLockFiles, checkLockFile, checkAll } from "./assert-no-unverified"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const TMP = join(ROOT, ".tmp", "assert-no-unverified-tests")

function setup(...paths: string[]): string {
  const dir = join(TMP, ...paths)
  mkdirSync(dir, { recursive: true })
  return dir
}

describe("assert-no-unverified", () => {
  beforeEach(() => {
    if (existsSync(TMP)) rmSync(TMP, { recursive: true })
  })

  afterAll(() => {
    if (existsSync(TMP)) rmSync(TMP, { recursive: true })
  })

  it("finds no lock files in an empty directory", () => {
    const dir = setup("empty")
    const files = findLockFiles(dir)
    expect(files).toHaveLength(0)
  })

  it("finds a single lock file", () => {
    const solidiom = setup("proj1", ".solidiom")
    writeFileSync(join(solidiom, "lock.json"), JSON.stringify({ version: 1, installed: {} }))
    const files = findLockFiles(join(TMP, "proj1"))
    expect(files).toHaveLength(1)
    expect(files[0]).toMatch(/\.solidiom\/lock\.json$/)
  })

  it("skips lock.json files outside .solidiom directory", () => {
    const dir = setup("proj2")
    writeFileSync(join(dir, "lock.json"), JSON.stringify({ version: 1, installed: {} }))
    const files = findLockFiles(dir)
    expect(files).toHaveLength(0)
  })

  it("skips node_modules and .git", () => {
    const solidiom1 = setup("proj3", "node_modules", "@some", "pkg", ".solidiom")
    writeFileSync(join(solidiom1, "lock.json"), JSON.stringify({ version: 1, installed: {} }))
    const solidiom2 = setup("proj3", ".git", ".solidiom")
    writeFileSync(join(solidiom2, "lock.json"), JSON.stringify({ version: 1, installed: {} }))
    const files = findLockFiles(join(TMP, "proj3"))
    expect(files).toHaveLength(0)
  })

  it("passes when all entries are verified", () => {
    const solidiom = setup("proj4", ".solidiom")
    const lockPath = join(solidiom, "lock.json")
    writeFileSync(
      lockPath,
      JSON.stringify({
        version: 1,
        installed: {
          "src/components/Dialog.tsx": {
            path: "src/components/Dialog.tsx",
            primitive: "dialog",
            version: "0.1.0",
            provenance: "verified",
            verifiedAt: "2026-01-01T00:00:00Z",
            manifestFilesHash: "abc",
            digest: "def",
          },
        },
      }),
    )
    const violations = checkLockFile(lockPath, join(TMP, "proj4"))
    expect(violations).toHaveLength(0)
  })

  it("catches unverified entries", () => {
    const solidiom = setup("proj5", ".solidiom")
    const lockPath = join(solidiom, "lock.json")
    writeFileSync(
      lockPath,
      JSON.stringify({
        version: 1,
        installed: {
          "src/components/Dialog.tsx": {
            path: "src/components/Dialog.tsx",
            primitive: "dialog",
            version: "0.1.0",
            provenance: "unverified",
            verifiedAt: "2026-01-01T00:00:00Z",
            manifestFilesHash: "abc",
            digest: "def",
          },
        },
      }),
    )
    const violations = checkLockFile(lockPath, join(TMP, "proj5"))
    expect(violations).toHaveLength(1)
    expect(violations[0].primitive).toBe("dialog")
    expect(violations[0].version).toBe("0.1.0")
    expect(violations[0].path).toBe("src/components/Dialog.tsx")
  })

  it("handles empty installed object", () => {
    const solidiom = setup("proj6", ".solidiom")
    const lockPath = join(solidiom, "lock.json")
    writeFileSync(lockPath, JSON.stringify({ version: 1, installed: {} }))
    const violations = checkLockFile(lockPath, join(TMP, "proj6"))
    expect(violations).toHaveLength(0)
  })

  it("handles missing lock file", () => {
    const violations = checkLockFile("/nonexistent/path/lock.json", ROOT)
    expect(violations).toHaveLength(0)
  })

  it("handles malformed lock data", () => {
    const solidiom = setup("proj7", ".solidiom")
    const lockPath = join(solidiom, "lock.json")
    writeFileSync(lockPath, JSON.stringify({ foo: "bar" }))
    const violations = checkLockFile(lockPath, join(TMP, "proj7"))
    expect(violations).toHaveLength(0)
  })

  it("finds multiple unverified entries across projects", () => {
    const solidiom1 = setup("ws", "projA", ".solidiom")
    const lockPath1 = join(solidiom1, "lock.json")
    writeFileSync(
      lockPath1,
      JSON.stringify({
        version: 1,
        installed: {
          "src/Button.tsx": {
            path: "src/Button.tsx",
            primitive: "button",
            version: "0.1.0",
            provenance: "unverified",
            verifiedAt: "2026-01-01T00:00:00Z",
            manifestFilesHash: "x",
            digest: "y",
          },
        },
      }),
    )

    const solidiom2 = setup("ws", "projB", ".solidiom")
    const lockPath2 = join(solidiom2, "lock.json")
    writeFileSync(
      lockPath2,
      JSON.stringify({
        version: 1,
        installed: {
          "src/Dialog.tsx": {
            path: "src/Dialog.tsx",
            primitive: "dialog",
            version: "0.2.0",
            provenance: "unverified",
            verifiedAt: "2026-02-01T00:00:00Z",
            manifestFilesHash: "a",
            digest: "b",
          },
          "src/DialogContext.ts": {
            path: "src/DialogContext.ts",
            primitive: "dialog",
            version: "0.2.0",
            provenance: "verified",
            verifiedAt: "2026-02-01T00:00:00Z",
            manifestFilesHash: "a",
            digest: "c",
          },
        },
      }),
    )

    const violations = checkAll(join(TMP, "ws"))
    expect(violations).toHaveLength(2)
    const primitives = violations.map((v) => v.primitive).sort()
    expect(primitives).toEqual(["button", "dialog"])
  })

  it("uses key as fallback when entry has no path field", () => {
    const solidiom = setup("proj8", ".solidiom")
    const lockPath = join(solidiom, "lock.json")
    writeFileSync(
      lockPath,
      JSON.stringify({
        version: 1,
        installed: {
          "some/weird/path.tsx": {
            primitive: "accordion",
            version: "0.3.0",
            provenance: "unverified",
            verifiedAt: "2026-03-01T00:00:00Z",
            manifestFilesHash: "z",
            digest: "w",
          },
        },
      }),
    )
    const violations = checkLockFile(lockPath, join(TMP, "proj8"))
    expect(violations).toHaveLength(1)
    expect(violations[0].path).toBe("some/weird/path.tsx")
  })
})
