import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { mkdirSync, writeFileSync, rmSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { tmpdir } from "node:os"
import { runDetach } from "./detach"

const lockEntry = (path: string, primitive: string, detached = false) => ({
  path,
  digest: "abc123",
  primitive,
  version: "1.0.0",
  detached,
  manifestFilesHash: "hash1",
  verifiedAt: "2024-01-01T00:00:00Z",
  provenance: "verified",
})

describe("runDetach", () => {
  let cwd: string

  beforeEach(() => {
    cwd = join(tmpdir(), `solidiom-detach-${Date.now()}-${Math.random().toString(36).slice(2)}`)
    mkdirSync(cwd, { recursive: true })
    mkdirSync(join(cwd, ".solidiom"), { recursive: true })
  })

  afterEach(() => {
    rmSync(cwd, { recursive: true, force: true })
  })

  it("detach marks installed files as detached", () => {
    writeFileSync(join(cwd, ".solidiom", "lock.json"), JSON.stringify({
      version: 1,
      installed: {
        "src/ui/primitives/dialog.tsx": lockEntry("src/ui/primitives/dialog.tsx", "dialog"),
        "src/ui/primitives/dialog.css": lockEntry("src/ui/primitives/dialog.css", "dialog"),
      },
    }))
    const result = runDetach({ cwd, primitive: "dialog" })
    expect(result.detached).toHaveLength(2)
    expect(result.alreadyDetached).toHaveLength(0)
  })

  it("lock file is updated with detached: true", () => {
    writeFileSync(join(cwd, ".solidiom", "lock.json"), JSON.stringify({
      version: 1,
      installed: {
        "src/ui/primitives/dialog.tsx": lockEntry("src/ui/primitives/dialog.tsx", "dialog"),
      },
    }))
    runDetach({ cwd, primitive: "dialog" })
    const lock = JSON.parse(readFileSync(join(cwd, ".solidiom", "lock.json"), "utf8"))
    expect(lock.installed["src/ui/primitives/dialog.tsx"].detached).toBe(true)
  })

  it("already detached files are reported separately", () => {
    writeFileSync(join(cwd, ".solidiom", "lock.json"), JSON.stringify({
      version: 1,
      installed: {
        "src/ui/primitives/dialog.tsx": lockEntry("src/ui/primitives/dialog.tsx", "dialog", true),
      },
    }))
    const result = runDetach({ cwd, primitive: "dialog" })
    expect(result.detached).toHaveLength(0)
    expect(result.alreadyDetached).toEqual(["src/ui/primitives/dialog.tsx"])
  })

  it("nonexistent primitive produces empty arrays", () => {
    writeFileSync(join(cwd, ".solidiom", "lock.json"), JSON.stringify({
      version: 1,
      installed: {
        "src/ui/primitives/dialog.tsx": lockEntry("src/ui/primitives/dialog.tsx", "dialog"),
      },
    }))
    const result = runDetach({ cwd, primitive: "tooltip" })
    expect(result.detached).toHaveLength(0)
    expect(result.alreadyDetached).toHaveLength(0)
  })

  it("only target primitive is detached", () => {
    writeFileSync(join(cwd, ".solidiom", "lock.json"), JSON.stringify({
      version: 1,
      installed: {
        "src/ui/primitives/dialog.tsx": lockEntry("src/ui/primitives/dialog.tsx", "dialog"),
        "src/ui/primitives/tooltip.tsx": lockEntry("src/ui/primitives/tooltip.tsx", "tooltip"),
      },
    }))
    const result = runDetach({ cwd, primitive: "dialog" })
    expect(result.detached).toEqual(["src/ui/primitives/dialog.tsx"])
    const lock = JSON.parse(readFileSync(join(cwd, ".solidiom", "lock.json"), "utf8"))
    expect(lock.installed["src/ui/primitives/tooltip.tsx"].detached).toBeFalsy()
  })

  it("lock is not rewritten when all files already detached", () => {
    const lockData = {
      version: 1,
      installed: {
        "src/ui/primitives/dialog.tsx": lockEntry("src/ui/primitives/dialog.tsx", "dialog", true),
      },
    }
    writeFileSync(join(cwd, ".solidiom", "lock.json"), JSON.stringify(lockData))
    const before = readFileSync(join(cwd, ".solidiom", "lock.json"), "utf8")
    runDetach({ cwd, primitive: "dialog" })
    const after = readFileSync(join(cwd, ".solidiom", "lock.json"), "utf8")
    expect(before).toBe(after)
  })

  it("mixed state: some already detached, some new", () => {
    writeFileSync(join(cwd, ".solidiom", "lock.json"), JSON.stringify({
      version: 1,
      installed: {
        "src/ui/primitives/dialog.tsx": lockEntry("src/ui/primitives/dialog.tsx", "dialog", true),
        "src/ui/primitives/dialog.css": lockEntry("src/ui/primitives/dialog.css", "dialog"),
      },
    }))
    const result = runDetach({ cwd, primitive: "dialog" })
    expect(result.detached).toEqual(["src/ui/primitives/dialog.css"])
    expect(result.alreadyDetached).toEqual(["src/ui/primitives/dialog.tsx"])
  })
})