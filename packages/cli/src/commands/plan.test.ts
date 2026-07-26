import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { mkdirSync, writeFileSync, rmSync } from "node:fs"
import { join } from "node:path"
import { tmpdir } from "node:os"
import { runPlan } from "./plan"

describe("runPlan", () => {
  let cwd: string

  beforeEach(() => {
    cwd = join(tmpdir(), `solidiom-test-${Date.now()}`)
    mkdirSync(cwd, { recursive: true })
  })

  afterEach(() => {
    rmSync(cwd, { recursive: true, force: true })
  })

  it("resolves dialog plan (no adapters)", () => {
    const plan = runPlan({ primitive: "dialog", cwd })
    expect(plan.primitive).toBe("dialog")
    expect(plan.entries).toHaveLength(2)
    expect(plan.entries[0]!.package).toBe("@solidiom/dialog")
    expect(plan.entries[1]!.package).toBe("@solidiom/runtime")
    expect(plan.violations).toHaveLength(0)
  })

  it("resolves select plan (includes positioning adapter)", () => {
    const plan = runPlan({ primitive: "select", cwd })
    expect(plan.entries).toHaveLength(3)
    const adapter = plan.entries.find((e) => e.isAdapter)
    expect(adapter?.package).toBe("@solidiom/adapter-positioning-floating-ui")
  })

  it("returns violation for unknown primitive", () => {
    const plan = runPlan({ primitive: "nonexistent", cwd })
    expect(plan.violations).toHaveLength(1)
    expect(plan.violations[0]).toContain("Unknown primitive")
  })

  it("checks policy violations", () => {
    mkdirSync(join(cwd, ".solidiom"), { recursive: true })
    writeFileSync(
      join(cwd, ".solidiom", "policy.json"),
      JSON.stringify({ allowedPrimitiveVersions: { "@solidiom/dialog": "^1.0.0" } }),
    )
    const plan = runPlan({ primitive: "dialog", cwd })
    expect(plan.violations.length).toBeGreaterThan(0)
    expect(plan.violations[0]).toContain("not allowed by policy")
  })

  it("reads mode from config", () => {
    mkdirSync(join(cwd, ".solidiom"), { recursive: true })
    writeFileSync(join(cwd, ".solidiom", "config.json"), JSON.stringify({ defaultMode: "source" }))
    const plan = runPlan({ primitive: "dialog", cwd })
    expect(plan.mode).toBe("source")
  })

  it("respects mode override", () => {
    const plan = runPlan({ primitive: "dialog", cwd, mode: "source" })
    expect(plan.mode).toBe("source")
  })
})
