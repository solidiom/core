import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { mkdirSync, existsSync, readFileSync, rmSync } from "node:fs"
import { join } from "node:path"
import { tmpdir } from "node:os"
import { runInit } from "./init"

describe("runInit", () => {
  let cwd: string

  beforeEach(() => {
    cwd = join(tmpdir(), `solidiom-init-${Date.now()}`)
    mkdirSync(cwd, { recursive: true })
  })

  afterEach(() => {
    rmSync(cwd, { recursive: true, force: true })
  })

  it("creates .solidiom/config.json", () => {
    const result = runInit({ cwd })
    expect(result.created).toBe(true)
    expect(existsSync(result.configPath)).toBe(true)
  })

  it("writes valid JSON config with defaults", () => {
    const result = runInit({ cwd })
    const content = JSON.parse(readFileSync(result.configPath, "utf8"))
    expect(content.defaultMode).toBe("package")
    expect(content.positioningAdapter).toBe("@solidiom/adapter-positioning-floating-ui")
  })

  it("does not overwrite existing config without force", () => {
    runInit({ cwd })
    const result = runInit({ cwd })
    expect(result.created).toBe(false)
  })

  it("overwrites with force", () => {
    runInit({ cwd })
    const result = runInit({ cwd, force: true })
    expect(result.created).toBe(true)
  })
})
