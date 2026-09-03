import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from "node:fs"
import { join } from "node:path"
import { createNestedTempDir } from "../test-utils/temp-dir"
import { runUpdate } from "./update"
import { computeDigest, writeLock } from "../source-install/lock"

describe("runUpdate", () => {
  let cwd: string

  beforeEach(() => {
    cwd = createNestedTempDir("solidiom-update", "consumer", "app").cwd
    mkdirSync(join(cwd, ".solidiom"), { recursive: true })
    mkdirSync(join(cwd, ".solidiom", "runtime"), { recursive: true })
    writeFileSync(join(cwd, ".solidiom", "config.json"), JSON.stringify({}))
  })

  afterEach(() => {
    rmSync(join(cwd, "..", ".."), { recursive: true, force: true })
  })

  const createFixture = (
    primitive: string,
    fileName: string,
    content: string,
    opts: { detached?: boolean } = {},
  ) => {
    const relPath = join(`.solidiom`, "runtime", primitive, fileName)
    const fullPath = join(cwd, relPath)
    mkdirSync(dirname(fullPath), { recursive: true })
    writeFileSync(fullPath, content)
    const lockPath = join(cwd, ".solidiom", "lock.json")
    const lock = existsSync(lockPath)
      ? JSON.parse(readFileSync(lockPath, "utf8"))
      : { version: 1, installed: {} }
    lock.installed[relPath] = {
      path: relPath,
      digest: computeDigest(content),
      primitive,
      version: "1.0.0",
      manifestFilesHash: "abc",
      verifiedAt: new Date().toISOString(),
      provenance: "verified",
      ...opts,
    }
    writeLock(cwd, lock)
    return { relPath, fullPath }
  }

  const createUpstream = (primitive: string, fileName: string, content: string) => {
    const upstreamDir = join(cwd, "..", "..", "packages", primitive, "source")
    mkdirSync(upstreamDir, { recursive: true })
    writeFileSync(join(upstreamDir, fileName), content)
    return join(upstreamDir, fileName)
  }

  it("returns empty result when no upstream source exists", () => {
    createFixture("dialog", "dialog.css", ".dialog { }")
    const result = runUpdate({ cwd, primitive: "dialog" })
    expect(result.entries).toEqual([])
  })

  it("skips detached files", () => {
    const { relPath } = createFixture("dialog", "dialog.css", ".dialog { }", { detached: true })
    createUpstream("dialog", "dialog.css", ".dialog { new }")
    const result = runUpdate({ cwd, primitive: "dialog" })
    expect(result.entries).toEqual([{ path: relPath, status: "skipped-detached" }])
  })

  it("skips deleted files", () => {
    const { relPath, fullPath } = createFixture("dialog", "dialog.css", ".dialog { }")
    rmSync(fullPath)
    createUpstream("dialog", "dialog.css", ".dialog { new }")
    const result = runUpdate({ cwd, primitive: "dialog" })
    expect(result.entries).toEqual([{ path: relPath, status: "skipped-deleted" }])
  })

  it("skips unchanged when upstream matches lock digest", () => {
    const content = ".dialog { }"
    const { relPath } = createFixture("dialog", "dialog.css", content)
    createUpstream("dialog", "dialog.css", content)
    const result = runUpdate({ cwd, primitive: "dialog" })
    expect(result.entries).toEqual([{ path: relPath, status: "skipped-unchanged" }])
  })

  it("safe updates when local unchanged and upstream changed", () => {
    const original = ".dialog { }"
    const updated = ".dialog { new }"
    const { relPath, fullPath } = createFixture("dialog", "dialog.css", original)
    createUpstream("dialog", "dialog.css", updated)
    const result = runUpdate({ cwd, primitive: "dialog" })
    expect(result.entries).toEqual([{ path: relPath, status: "updated" }])
    expect(result.updated).toBe(1)
    expect(readFileSync(fullPath, "utf8")).toBe(updated)
  })

  it("dry run prevents writes", () => {
    const original = ".dialog { }"
    const updated = ".dialog { new }"
    const { fullPath } = createFixture("dialog", "dialog.css", original)
    createUpstream("dialog", "dialog.css", updated)
    const lockBefore = readFileSync(join(cwd, ".solidiom", "lock.json"), "utf8")
    runUpdate({ cwd, primitive: "dialog", dryRun: true })
    expect(readFileSync(fullPath, "utf8")).toBe(original)
    expect(readFileSync(join(cwd, ".solidiom", "lock.json"), "utf8")).toBe(lockBefore)
  })

  it("produces merged result when both local and upstream changed", () => {
    const original = "line1\nline2\nline3"
    const localChanged = "line1-mod\nline2\nline3"
    const upstreamChanged = "line1\nline2-new\nline3-up"
    const { relPath, fullPath } = createFixture("dialog", "dialog.css", original)
    writeFileSync(fullPath, localChanged)
    createUpstream("dialog", "dialog.css", upstreamChanged)
    const result = runUpdate({ cwd, primitive: "dialog" })
    expect(result.entries).toEqual([{ path: relPath, status: "merged" }])
    expect(result.merged).toBe(1)
  })

  it("does not update lock file in dry-run mode", () => {
    const original = ".dialog { }"
    const updated = ".dialog { new }"
    createFixture("dialog", "dialog.css", original)
    createUpstream("dialog", "dialog.css", updated)
    const lockBefore = JSON.parse(readFileSync(join(cwd, ".solidiom", "lock.json"), "utf8"))
    runUpdate({ cwd, primitive: "dialog", dryRun: true })
    const lockAfter = JSON.parse(readFileSync(join(cwd, ".solidiom", "lock.json"), "utf8"))
    expect(lockAfter.installed).toEqual(lockBefore.installed)
  })
})

function dirname(p: string) {
  const idx = p.lastIndexOf("/")
  return idx === -1 ? "." : p.slice(0, idx)
}
