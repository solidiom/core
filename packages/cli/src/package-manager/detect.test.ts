import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { mkdirSync, writeFileSync, rmSync } from "node:fs"
import { join } from "node:path"
import { tmpdir } from "node:os"
import { detectPackageManager, isPackageManagerName } from "./detect"

describe("isPackageManagerName", () => {
  it("accepts the four known managers", () => {
    expect(isPackageManagerName("npm")).toBe(true)
    expect(isPackageManagerName("pnpm")).toBe(true)
    expect(isPackageManagerName("yarn")).toBe(true)
    expect(isPackageManagerName("bun")).toBe(true)
  })

  it("rejects anything else", () => {
    expect(isPackageManagerName("cargo")).toBe(false)
    expect(isPackageManagerName("")).toBe(false)
  })
})

describe("detectPackageManager", () => {
  let cwd: string

  beforeEach(() => {
    cwd = join(
      tmpdir(),
      `solidiom-detect-test-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    )
    mkdirSync(cwd, { recursive: true })
  })

  afterEach(() => {
    rmSync(cwd, { recursive: true, force: true })
  })

  describe("precedence", () => {
    it("prefers an explicit override over every other signal", () => {
      writeFileSync(join(cwd, "pnpm-lock.yaml"), "")
      const result = detectPackageManager({
        cwd,
        override: "yarn",
        env: { npm_config_user_agent: "npm/10.0.0 node/v20 darwin x64" },
      })
      expect(result).toEqual({ name: "yarn", source: "flag" })
    })

    it("throws on an unrecognized override rather than silently falling through", () => {
      expect(() => detectPackageManager({ cwd, override: "cargo" })).toThrow(
        /Unknown package manager "cargo"/,
      )
    })

    it("prefers npm_config_user_agent over a lockfile when there is no override", () => {
      writeFileSync(join(cwd, "yarn.lock"), "")
      const result = detectPackageManager({
        cwd,
        env: { npm_config_user_agent: "pnpm/9.1.0 npm/? node/v20.11.0 darwin x64" },
      })
      expect(result).toEqual({ name: "pnpm", majorVersion: 9, source: "npm_config_user_agent" })
    })

    it("falls through an unparseable user agent to the lockfile", () => {
      writeFileSync(join(cwd, "yarn.lock"), "")
      const result = detectPackageManager({
        cwd,
        env: { npm_config_user_agent: "not-a-pm-string" },
      })
      expect(result).toEqual({ name: "yarn", source: "lockfile" })
    })

    it("prefers a lockfile over the packageManager field", () => {
      writeFileSync(join(cwd, "bun.lockb"), "")
      writeFileSync(join(cwd, "package.json"), JSON.stringify({ packageManager: "yarn@3.6.4" }))
      const result = detectPackageManager({ cwd, env: {} })
      expect(result).toEqual({ name: "bun", source: "lockfile" })
    })

    it("prefers the packageManager field over the npm default", () => {
      writeFileSync(join(cwd, "package.json"), JSON.stringify({ packageManager: "yarn@3.6.4" }))
      const result = detectPackageManager({ cwd, env: {} })
      expect(result).toEqual({ name: "yarn", majorVersion: 3, source: "packageManager-field" })
    })

    it("defaults to npm when no signal is present at all", () => {
      const result = detectPackageManager({ cwd, env: {} })
      expect(result).toEqual({ name: "npm", source: "default" })
    })
  })

  describe("lockfile detection", () => {
    it.each([
      ["pnpm-lock.yaml", "pnpm"],
      ["package-lock.json", "npm"],
      ["yarn.lock", "yarn"],
      ["bun.lockb", "bun"],
      ["bun.lock", "bun"],
    ] as const)("recognizes %s as %s", (file, expectedManager) => {
      writeFileSync(join(cwd, file), "")
      const result = detectPackageManager({ cwd, env: {} })
      expect(result).toEqual({ name: expectedManager, source: "lockfile" })
    })

    it("finds a lockfile in a parent directory when cwd is nested", () => {
      writeFileSync(join(cwd, "pnpm-lock.yaml"), "")
      const nested = join(cwd, "packages", "app")
      mkdirSync(nested, { recursive: true })
      const result = detectPackageManager({ cwd: nested, env: {} })
      expect(result).toEqual({ name: "pnpm", source: "lockfile" })
    })
  })

  describe("packageManager field detection", () => {
    it("parses name and major version from a Corepack-style field", () => {
      writeFileSync(
        join(cwd, "package.json"),
        JSON.stringify({ packageManager: "pnpm@9.1.0+sha256.abcdef" }),
      )
      const result = detectPackageManager({ cwd, env: {} })
      expect(result).toEqual({ name: "pnpm", majorVersion: 9, source: "packageManager-field" })
    })

    it("ignores a malformed packageManager field and falls through to default", () => {
      writeFileSync(join(cwd, "package.json"), JSON.stringify({ packageManager: "not-valid" }))
      const result = detectPackageManager({ cwd, env: {} })
      expect(result).toEqual({ name: "npm", source: "default" })
    })

    it("ignores an unparseable package.json rather than throwing", () => {
      writeFileSync(join(cwd, "package.json"), "{ this is not json")
      expect(() => detectPackageManager({ cwd, env: {} })).not.toThrow()
      expect(detectPackageManager({ cwd, env: {} }).source).toBe("default")
    })
  })
})
