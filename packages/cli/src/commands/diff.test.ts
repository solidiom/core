import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { mkdirSync, writeFileSync, rmSync } from "node:fs"
import { join } from "node:path"
import { createTempDir } from "../test-utils/temp-dir"
import { runDiff } from "./diff"
import { computeDigest } from "../source-install/lock"

describe("runDiff", () => {
  let cwd: string

  beforeEach(() => {
    cwd = createTempDir("solidiom-diff")
    mkdirSync(join(cwd, ".solidiom"), { recursive: true })
  })

  afterEach(() => {
    rmSync(cwd, { recursive: true, force: true })
  })

  it("empty lockfile produces no entries, no changes", () => {
    writeFileSync(
      join(cwd, ".solidiom", "lock.json"),
      JSON.stringify({ version: 1, installed: {} }),
    )
    const result = runDiff({ cwd })
    expect(result.entries).toHaveLength(0)
    expect(result.hasChanges).toBe(false)
  })

  it("single unchanged file produces unchanged entry", () => {
    const content = "console.log('hello')"
    const digest = computeDigest(content)
    const filePath = "src/ui/primitives/dialog.tsx"
    writeFileSync(
      join(cwd, ".solidiom", "lock.json"),
      JSON.stringify({
        version: 1,
        installed: {
          [filePath]: {
            path: filePath,
            digest,
            primitive: "dialog",
            version: "1.0.0",
            manifestFilesHash: "abc",
            verifiedAt: "2024-01-01T00:00:00Z",
            provenance: "verified",
          },
        },
      }),
    )
    mkdirSync(join(cwd, "src", "ui", "primitives"), { recursive: true })
    writeFileSync(join(cwd, filePath), content)
    const result = runDiff({ cwd })
    expect(result.entries).toEqual([{ path: filePath, primitive: "dialog", status: "unchanged" }])
  })

  it("modified file produces modified entry", () => {
    const original = "console.log('hello')"
    const digest = computeDigest(original)
    const filePath = "src/ui/primitives/dialog.tsx"
    writeFileSync(
      join(cwd, ".solidiom", "lock.json"),
      JSON.stringify({
        version: 1,
        installed: {
          [filePath]: {
            path: filePath,
            digest,
            primitive: "dialog",
            version: "1.0.0",
            manifestFilesHash: "abc",
            verifiedAt: "2024-01-01T00:00:00Z",
            provenance: "verified",
          },
        },
      }),
    )
    mkdirSync(join(cwd, "src", "ui", "primitives"), { recursive: true })
    writeFileSync(join(cwd, filePath), "console.log('modified')")
    const result = runDiff({ cwd })
    expect(result.entries).toEqual([{ path: filePath, primitive: "dialog", status: "modified" }])
  })

  it("deleted file produces deleted entry", () => {
    const content = "console.log('hello')"
    const digest = computeDigest(content)
    const filePath = "src/ui/primitives/dialog.tsx"
    writeFileSync(
      join(cwd, ".solidiom", "lock.json"),
      JSON.stringify({
        version: 1,
        installed: {
          [filePath]: {
            path: filePath,
            digest,
            primitive: "dialog",
            version: "1.0.0",
            manifestFilesHash: "abc",
            verifiedAt: "2024-01-01T00:00:00Z",
            provenance: "verified",
          },
        },
      }),
    )
    const result = runDiff({ cwd })
    expect(result.entries).toEqual([{ path: filePath, primitive: "dialog", status: "deleted" }])
  })

  it("hasChanges is false when all entries unchanged", () => {
    const content = "const x = 1"
    const digest = computeDigest(content)
    const filePath = "src/ui/primitives/dialog.tsx"
    writeFileSync(
      join(cwd, ".solidiom", "lock.json"),
      JSON.stringify({
        version: 1,
        installed: {
          [filePath]: {
            path: filePath,
            digest,
            primitive: "dialog",
            version: "1.0.0",
            manifestFilesHash: "abc",
            verifiedAt: "2024-01-01T00:00:00Z",
            provenance: "verified",
          },
        },
      }),
    )
    mkdirSync(join(cwd, "src", "ui", "primitives"), { recursive: true })
    writeFileSync(join(cwd, filePath), content)
    const result = runDiff({ cwd })
    expect(result.hasChanges).toBe(false)
  })

  it("hasChanges is true when any entry is modified", () => {
    const content = "const x = 1"
    const digest = computeDigest(content)
    const filePath = "src/ui/primitives/dialog.tsx"
    writeFileSync(
      join(cwd, ".solidiom", "lock.json"),
      JSON.stringify({
        version: 1,
        installed: {
          [filePath]: {
            path: filePath,
            digest,
            primitive: "dialog",
            version: "1.0.0",
            manifestFilesHash: "abc",
            verifiedAt: "2024-01-01T00:00:00Z",
            provenance: "verified",
          },
        },
      }),
    )
    mkdirSync(join(cwd, "src", "ui", "primitives"), { recursive: true })
    writeFileSync(join(cwd, filePath), "const x = 2")
    const result = runDiff({ cwd })
    expect(result.hasChanges).toBe(true)
  })

  it("primitive filter excludes non-matching primitives", () => {
    const content = "const x = 1"
    const digest = computeDigest(content)
    const dialogPath = "src/ui/primitives/dialog.tsx"
    const tooltipPath = "src/ui/primitives/tooltip.tsx"
    writeFileSync(
      join(cwd, ".solidiom", "lock.json"),
      JSON.stringify({
        version: 1,
        installed: {
          [dialogPath]: {
            path: dialogPath,
            digest,
            primitive: "dialog",
            version: "1.0.0",
            manifestFilesHash: "abc",
            verifiedAt: "2024-01-01T00:00:00Z",
            provenance: "verified",
          },
          [tooltipPath]: {
            path: tooltipPath,
            digest,
            primitive: "tooltip",
            version: "1.0.0",
            manifestFilesHash: "def",
            verifiedAt: "2024-01-01T00:00:00Z",
            provenance: "verified",
          },
        },
      }),
    )
    mkdirSync(join(cwd, "src", "ui", "primitives"), { recursive: true })
    writeFileSync(join(cwd, dialogPath), content)
    writeFileSync(join(cwd, tooltipPath), content)
    const result = runDiff({ cwd, primitive: "dialog" })
    expect(result.entries).toHaveLength(1)
    expect(result.entries[0]!.primitive).toBe("dialog")
  })

  it("multiple primitives with mixed statuses", () => {
    const contentA = "const a = 1"
    const digestA = computeDigest(contentA)
    const contentB = "const b = 2"
    const digestB = computeDigest(contentB)
    const dialogPath = "src/ui/primitives/dialog.tsx"
    const tooltipPath = "src/ui/primitives/tooltip.tsx"
    writeFileSync(
      join(cwd, ".solidiom", "lock.json"),
      JSON.stringify({
        version: 1,
        installed: {
          [dialogPath]: {
            path: dialogPath,
            digest: digestA,
            primitive: "dialog",
            version: "1.0.0",
            manifestFilesHash: "abc",
            verifiedAt: "2024-01-01T00:00:00Z",
            provenance: "verified",
          },
          [tooltipPath]: {
            path: tooltipPath,
            digest: digestB,
            primitive: "tooltip",
            version: "1.0.0",
            manifestFilesHash: "def",
            verifiedAt: "2024-01-01T00:00:00Z",
            provenance: "verified",
          },
        },
      }),
    )
    mkdirSync(join(cwd, "src", "ui", "primitives"), { recursive: true })
    writeFileSync(join(cwd, dialogPath), contentA)
    const result = runDiff({ cwd })
    expect(result.entries).toEqual(
      expect.arrayContaining([
        { path: dialogPath, primitive: "dialog", status: "unchanged" },
        { path: tooltipPath, primitive: "tooltip", status: "deleted" },
      ]),
    )
    expect(result.hasChanges).toBe(true)
  })
})
