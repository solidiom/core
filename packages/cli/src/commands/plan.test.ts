import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { mkdirSync, writeFileSync, rmSync } from "node:fs"
import { join } from "node:path"
import { createNestedTempDirIn, createTempDir } from "../test-utils/temp-dir"
import { runPlan, toInstallSpecifier } from "./plan"

describe("toInstallSpecifier (REL-C1)", () => {
  it("widens a plain 0.x version into a caret range", () => {
    expect(toInstallSpecifier("0.3.0")).toBe("^0.3.0")
  })

  it("widens a plain >=1 version into a caret range", () => {
    expect(toInstallSpecifier("1.4.2")).toBe("^1.4.2")
  })

  it("pins pre-release versions exactly", () => {
    expect(toInstallSpecifier("0.0.1-next.0")).toBe("0.0.1-next.0")
    expect(toInstallSpecifier("0.3.0-beta.1")).toBe("0.3.0-beta.1")
  })

  it("passes dist-tags through unchanged", () => {
    expect(toInstallSpecifier("latest")).toBe("latest")
    expect(toInstallSpecifier("next")).toBe("next")
  })

  it("leaves an already-ranged specifier unchanged", () => {
    expect(toInstallSpecifier("^0.3.0")).toBe("^0.3.0")
    expect(toInstallSpecifier("~1.2.0")).toBe("~1.2.0")
    expect(toInstallSpecifier(">=1.0.0")).toBe(">=1.0.0")
    expect(toInstallSpecifier("1.x")).toBe("1.x")
  })

  it("handles empty input without crashing", () => {
    expect(toInstallSpecifier("")).toBe("")
  })
})

describe("runPlan", () => {
  let cwd: string

  beforeEach(() => {
    cwd = createTempDir("solidiom-test")
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

  describe("deliverable and styling awareness (CLI-002)", () => {
    it("BUILTIN_PRIMITIVES fallback never claims styling or product-layer support it hasn't verified", () => {
      // This cwd has no registry and no node_modules, so dialog resolves via
      // BUILTIN_PRIMITIVES. That fallback must never assert deliverables
      // beyond "primitive" or any styling output — those facts are only
      // knowable from the real registry.
      const plan = runPlan({ primitive: "dialog", cwd })
      expect(plan.stylingOutputs).toEqual([])
    })

    it("blocks a deliverable the offline fallback cannot confirm", () => {
      const plan = runPlan({ primitive: "dialog", cwd, deliverable: "component" })
      expect(plan.violations.length).toBeGreaterThan(0)
      expect(plan.violations[0]).toContain('does not declare the "component" deliverable')
      expect(plan.violations[0]).toContain("available: primitive")
    })

    it("blocks a styling profile the offline fallback cannot confirm", () => {
      const plan = runPlan({ primitive: "dialog", cwd, styling: "tailwind" })
      expect(plan.violations.length).toBeGreaterThan(0)
      expect(plan.violations[0]).toContain('has no "tailwind" styling output')
      expect(plan.violations[0]).toContain("available: none")
    })

    it("does not add a violation when no deliverable/styling is requested", () => {
      const plan = runPlan({ primitive: "dialog", cwd })
      expect(plan.violations).toHaveLength(0)
      expect(plan.deliverable).toBeUndefined()
      expect(plan.stylingProfile).toBeUndefined()
    })

    it("echoes the requested deliverable and styling profile on the plan even when it violates", () => {
      const plan = runPlan({ primitive: "dialog", cwd, deliverable: "theme", styling: "unocss" })
      expect(plan.deliverable).toBe("theme")
      expect(plan.stylingProfile).toBe("unocss")
    })
  })

  describe("deliverable and styling awareness against the real registry (CLI-002)", () => {
    // button declares nx.metadata.registry.deliverables: ["component"] and has
    // css/tailwind/unocss recipes, so it is the one real product-layer/styling
    // data point in the committed registry (see packages/button/package.json).
    // loadRegistry's monorepo-relative candidate is join(cwd, "..", "..", "registry",
    // "index.json"), so cwd must sit exactly two levels under the actual repo
    // root — an arbitrary tmpdir does not qualify, so the fixture nests inside
    // the repo checkout itself (mirroring source-install.test.ts's convention).
    const REPO_ROOT = join(import.meta.dirname, "..", "..", "..", "..")
    let repoNestedCwd: string

    beforeEach(() => {
      repoNestedCwd = createNestedTempDirIn(REPO_ROOT, "tmp-plan-registry-test", "app").cwd
    })

    afterEach(() => {
      rmSync(join(repoNestedCwd, ".."), { recursive: true, force: true })
    })

    it("resolves button's real deliverables and styling outputs from the registry", () => {
      const plan = runPlan({ primitive: "button", cwd: repoNestedCwd })
      expect(plan.stylingOutputs).toEqual(["css", "tailwind", "unocss"])
    })

    it("succeeds when --deliverable and --styling match the real manifest", () => {
      const plan = runPlan({
        primitive: "button",
        cwd: repoNestedCwd,
        deliverable: "component",
        styling: "css",
      })
      expect(plan.violations).toHaveLength(0)
      expect(plan.deliverable).toBe("component")
      expect(plan.stylingProfile).toBe("css")
    })

    it("blocks a deliverable the real manifest does not declare", () => {
      const plan = runPlan({ primitive: "button", cwd: repoNestedCwd, deliverable: "theme" })
      expect(plan.violations.length).toBeGreaterThan(0)
      expect(plan.violations[0]).toContain('does not declare the "theme" deliverable')
      expect(plan.violations[0]).toContain("available: component, primitive")
    })
  })
})
