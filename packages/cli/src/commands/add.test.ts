import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { mkdirSync, rmSync } from "node:fs"
import { join } from "node:path"
import { tmpdir } from "node:os"
import { runAdd } from "./add"

describe("runAdd", () => {
  let cwd: string

  beforeEach(() => {
    cwd = join(tmpdir(), `solidiom-add-test-${Date.now()}-${Math.random().toString(36).slice(2)}`)
    mkdirSync(cwd, { recursive: true })
  })

  afterEach(() => {
    rmSync(cwd, { recursive: true, force: true })
  })

  it("resolves a package-mode install command for a known primitive", async () => {
    const result = await runAdd({ primitive: "dialog", cwd })
    expect(result.blocked).toBe(false)
    expect(result.installCommand).toContain("@solidiom/dialog")
    expect(result.installCommand).toContain("@solidiom/runtime")
  })

  it("blocks on an unknown primitive", async () => {
    const result = await runAdd({ primitive: "nonexistent", cwd })
    expect(result.blocked).toBe(true)
    expect(result.installCommand).toBeNull()
    expect(result.plan.violations[0]).toContain("Unknown primitive")
  })

  it("resolves to an install command using the ambient/detected package manager", async () => {
    // Full package-manager detection precedence (flag > user agent > lockfile
    // > packageManager field > npm default) is unit-tested directly in
    // package-manager/detect.test.ts with an injected env; this only checks
    // that add.ts actually threads the detected manager into the command
    // rather than hardcoding one.
    const result = await runAdd({ primitive: "dialog", cwd })
    expect(result.installCommand).toMatch(/^(npm|pnpm|yarn|bun) add /)
  })

  it("respects an explicit --package-manager override", async () => {
    const result = await runAdd({ primitive: "dialog", cwd, packageManager: "pnpm" })
    expect(result.installCommand).toMatch(/^pnpm add /)
  })

  it("rejects an unknown --package-manager override", async () => {
    await expect(runAdd({ primitive: "dialog", cwd, packageManager: "cargo" as never })).rejects.toThrow(
      /Unknown package manager/,
    )
  })

  it("does not execute the install command unless --install is set", async () => {
    const result = await runAdd({ primitive: "dialog", cwd })
    expect(result.installRun).toBeUndefined()
  })

  describe("deliverable and styling flags (CLI-002)", () => {
    it("blocks when the offline fallback cannot confirm the requested deliverable", async () => {
      const result = await runAdd({ primitive: "dialog", cwd, deliverable: "component" })
      expect(result.blocked).toBe(true)
      expect(result.installCommand).toBeNull()
      expect(result.plan.violations[0]).toContain('does not declare the "component" deliverable')
    })

    it("blocks when the offline fallback cannot confirm the requested styling profile", async () => {
      const result = await runAdd({ primitive: "dialog", cwd, styling: "css" })
      expect(result.blocked).toBe(true)
      expect(result.plan.violations[0]).toContain('has no "css" styling output')
    })

    it("does not block when no deliverable/styling is requested", async () => {
      const result = await runAdd({ primitive: "dialog", cwd })
      expect(result.blocked).toBe(false)
    })
  })

  describe("deliverable and styling flags against the real registry (CLI-002)", () => {
    // Mirrors plan.test.ts's convention: cwd must sit exactly two levels
    // under the actual repo root for loadRegistry's monorepo-relative
    // candidate (join(cwd, "..", "..", "registry", "index.json")) to resolve.
    const REPO_ROOT = join(import.meta.dirname, "..", "..", "..", "..")
    let repoNestedCwd: string

    beforeEach(() => {
      repoNestedCwd = join(
        REPO_ROOT,
        `tmp-add-registry-test-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        "app",
      )
      mkdirSync(repoNestedCwd, { recursive: true })
    })

    afterEach(() => {
      rmSync(join(repoNestedCwd, ".."), { recursive: true, force: true })
    })

    it("succeeds and returns an install command when the requested deliverable/styling match the real manifest", async () => {
      // button declares nx.metadata.registry.deliverables: ["component"] and
      // has a css recipe (see packages/button/package.json).
      const result = await runAdd({
        primitive: "button",
        cwd: repoNestedCwd,
        deliverable: "component",
        styling: "css",
      })
      expect(result.blocked).toBe(false)
      expect(result.installCommand).toContain("@solidiom/button")
    })

    it("blocks when the requested deliverable is not declared by the real manifest", async () => {
      const result = await runAdd({ primitive: "button", cwd: repoNestedCwd, deliverable: "theme" })
      expect(result.blocked).toBe(true)
      expect(result.installCommand).toBeNull()
      expect(result.plan.violations[0]).toContain('does not declare the "theme" deliverable')
    })

    it("blocks source-mode install when the requested deliverable is not declared, without writing files", async () => {
      const result = await runAdd({
        primitive: "button",
        cwd: repoNestedCwd,
        mode: "source",
        deliverable: "theme",
      })
      expect(result.blocked).toBe(true)
      expect(result.sourceResult).toBeUndefined()
    })
  })
})
