import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { existsSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { createTempDir } from "../test-utils/temp-dir"
import { atomicWriteFileSync, createFileExclusiveSync, readTextFileIfExists } from "./safe-write"

describe("safe filesystem writes", () => {
  let root: string

  beforeEach(() => {
    root = createTempDir("solidiom-safe-write")
  })

  afterEach(() => {
    rmSync(root, { recursive: true, force: true })
  })

  it("atomically replaces an existing file", () => {
    const path = join(root, "config.json")
    writeFileSync(path, "old")
    atomicWriteFileSync(path, "new")
    expect(readFileSync(path, "utf8")).toBe("new")
    expect(readdirSync(root).filter((name) => name.endsWith(".tmp"))).toEqual([])
  })

  it("publishes a complete file only when the destination is absent", () => {
    const path = join(root, "config.json")
    expect(createFileExclusiveSync(path, "first")).toBe(true)
    expect(createFileExclusiveSync(path, "second")).toBe(false)
    expect(readFileSync(path, "utf8")).toBe("first")
  })

  it("does not follow an existing destination symlink", () => {
    const target = join(root, "target.txt")
    const link = join(root, "link.txt")
    writeFileSync(target, "target")
    symlinkSync(target, link)

    expect(createFileExclusiveSync(link, "attacker")).toBe(false)
    expect(readFileSync(target, "utf8")).toBe("target")

    atomicWriteFileSync(link, "replacement")
    expect(readFileSync(link, "utf8")).toBe("replacement")
    expect(readFileSync(target, "utf8")).toBe("target")
  })

  it("returns null only for an absent optional file", () => {
    const path = join(root, "optional.json")
    expect(readTextFileIfExists(path)).toBeNull()
    expect(existsSync(path)).toBe(false)
  })
})
