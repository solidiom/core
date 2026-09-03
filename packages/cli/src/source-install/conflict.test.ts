import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { mkdirSync, writeFileSync, rmSync } from "node:fs"
import { join } from "node:path"
import { createTempDir } from "../test-utils/temp-dir"
import { classifyConflicts, renderUnifiedDiff } from "./conflict"
import { computeDigest, type LockFile } from "./lock"

function createTmpDir(): string {
  return createTempDir("solidiom-conflict-test")
}

function emptyLock(): LockFile {
  return { version: 1, installed: {} }
}

describe("classifyConflicts", () => {
  let cwd: string

  beforeEach(() => {
    cwd = createTmpDir()
  })

  afterEach(() => {
    rmSync(cwd, { recursive: true, force: true })
  })

  it("classifies a path with no on-disk file and no lock entry as 'create'", () => {
    const plannedFiles = new Map([
      ["src/ui/components/button/index.tsx", "export function Button() {}"],
    ])
    const report = classifyConflicts({ cwd, plannedFiles, lock: emptyLock() })

    expect(report.entries).toHaveLength(1)
    expect(report.entries[0]!.classification).toBe("create")
    expect(report.hasBlockingConflicts).toBe(false)
  })

  it("classifies a path whose on-disk content matches both the lock digest and the planned content as 'unchanged'", () => {
    const relPath = "src/ui/components/button/index.tsx"
    const content = "export function Button() {}"
    const fullPath = join(cwd, relPath)
    mkdirSync(join(cwd, "src/ui/components/button"), { recursive: true })
    writeFileSync(fullPath, content)

    const lock: LockFile = {
      version: 1,
      installed: {
        [relPath]: {
          path: relPath,
          digest: computeDigest(content),
          primitive: "button",
          version: "0.0.1",
          manifestFilesHash: "abc",
          verifiedAt: "2025-01-01T00:00:00.000Z",
          provenance: "verified",
        },
      },
    }

    const plannedFiles = new Map([[relPath, content]])
    const report = classifyConflicts({ cwd, plannedFiles, lock })

    expect(report.entries[0]!.classification).toBe("unchanged")
    expect(report.hasBlockingConflicts).toBe(false)
  })

  it("classifies a path whose on-disk digest differs from the lock digest as 'modified-by-user'", () => {
    const relPath = "src/ui/components/button/index.tsx"
    const originalContent = "export function Button() {}"
    const userEditedContent = "export function Button() { /* user edit */ }"
    const newUpstreamContent = "export function Button() { /* upstream v2 */ }"
    const fullPath = join(cwd, relPath)
    mkdirSync(join(cwd, "src/ui/components/button"), { recursive: true })
    writeFileSync(fullPath, userEditedContent)

    const lock: LockFile = {
      version: 1,
      installed: {
        [relPath]: {
          path: relPath,
          digest: computeDigest(originalContent),
          primitive: "button",
          version: "0.0.1",
          manifestFilesHash: "abc",
          verifiedAt: "2025-01-01T00:00:00.000Z",
          provenance: "verified",
        },
      },
    }

    const plannedFiles = new Map([[relPath, newUpstreamContent]])
    const report = classifyConflicts({ cwd, plannedFiles, lock })

    expect(report.entries[0]!.classification).toBe("modified-by-user")
    expect(report.hasBlockingConflicts).toBe(true)
    expect(report.entries[0]!.diff).toBeDefined()
  })

  it("classifies a path whose on-disk digest matches the lock digest but planned content differs as 'overwrite'", () => {
    const relPath = "src/ui/components/button/index.tsx"
    const originalContent = "export function Button() {}"
    const newUpstreamContent = "export function Button() { /* upstream v2 */ }"
    const fullPath = join(cwd, relPath)
    mkdirSync(join(cwd, "src/ui/components/button"), { recursive: true })
    writeFileSync(fullPath, originalContent)

    const lock: LockFile = {
      version: 1,
      installed: {
        [relPath]: {
          path: relPath,
          digest: computeDigest(originalContent),
          primitive: "button",
          version: "0.0.1",
          manifestFilesHash: "abc",
          verifiedAt: "2025-01-01T00:00:00.000Z",
          provenance: "verified",
        },
      },
    }

    const plannedFiles = new Map([[relPath, newUpstreamContent]])
    const report = classifyConflicts({ cwd, plannedFiles, lock })

    expect(report.entries[0]!.classification).toBe("overwrite")
    expect(report.hasBlockingConflicts).toBe(false)
    expect(report.entries[0]!.diff).toBeDefined()
  })

  it("classifies a path with NO lock entry that exists on disk with different content as 'modified-by-user' (conservative, no provenance)", () => {
    const relPath = "src/ui/components/button/index.tsx"
    const handAuthoredContent = "export function Button() { /* hand authored, pre-lockfile */ }"
    const plannedContent = "export function Button() { /* upstream */ }"
    const fullPath = join(cwd, relPath)
    mkdirSync(join(cwd, "src/ui/components/button"), { recursive: true })
    writeFileSync(fullPath, handAuthoredContent)

    const plannedFiles = new Map([[relPath, plannedContent]])
    const report = classifyConflicts({ cwd, plannedFiles, lock: emptyLock() })

    expect(report.entries[0]!.classification).toBe("modified-by-user")
    expect(report.hasBlockingConflicts).toBe(true)
  })

  it("classifies a path with NO lock entry that exists on disk with IDENTICAL content as 'unchanged'", () => {
    const relPath = "src/ui/components/button/index.tsx"
    const content = "export function Button() {}"
    const fullPath = join(cwd, relPath)
    mkdirSync(join(cwd, "src/ui/components/button"), { recursive: true })
    writeFileSync(fullPath, content)

    const plannedFiles = new Map([[relPath, content]])
    const report = classifyConflicts({ cwd, plannedFiles, lock: emptyLock() })

    expect(report.entries[0]!.classification).toBe("unchanged")
    expect(report.hasBlockingConflicts).toBe(false)
  })

  it("does not block modified-by-user conflicts when force is true", () => {
    const relPath = "src/ui/components/button/index.tsx"
    const originalContent = "export function Button() {}"
    const userEditedContent = "export function Button() { /* user edit */ }"
    const newUpstreamContent = "export function Button() { /* upstream v2 */ }"
    const fullPath = join(cwd, relPath)
    mkdirSync(join(cwd, "src/ui/components/button"), { recursive: true })
    writeFileSync(fullPath, userEditedContent)

    const lock: LockFile = {
      version: 1,
      installed: {
        [relPath]: {
          path: relPath,
          digest: computeDigest(originalContent),
          primitive: "button",
          version: "0.0.1",
          manifestFilesHash: "abc",
          verifiedAt: "2025-01-01T00:00:00.000Z",
          provenance: "verified",
        },
      },
    }

    const plannedFiles = new Map([[relPath, newUpstreamContent]])
    const report = classifyConflicts({ cwd, plannedFiles, lock, force: true })

    expect(report.entries[0]!.classification).toBe("modified-by-user")
    expect(report.hasBlockingConflicts).toBe(false)
  })
})

describe("renderUnifiedDiff", () => {
  it("returns a no-differences marker when content is identical", () => {
    const result = renderUnifiedDiff("same\ncontent", "same\ncontent", "test.ts")
    expect(result).toContain("no differences")
  })

  it("renders +/- markers and both old/new distinguishing lines", () => {
    const oldContent = "line1\nline2\nline3\n"
    const newContent = "line1\nCHANGED\nline3\n"
    const result = renderUnifiedDiff(oldContent, newContent, "test.ts")

    expect(result).toContain("--- test.ts")
    expect(result).toContain("+++ test.ts")
    expect(result).toContain("-line2")
    expect(result).toContain("+CHANGED")
    // Context lines should be present unmarked
    expect(result).toContain(" line1")
    expect(result).toContain(" line3")
  })

  it("handles content with no shared lines at all", () => {
    const result = renderUnifiedDiff("aaa\nbbb", "ccc\nddd", "test.ts")
    expect(result).toContain("-aaa")
    expect(result).toContain("-bbb")
    expect(result).toContain("+ccc")
    expect(result).toContain("+ddd")
  })
})
