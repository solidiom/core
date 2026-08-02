import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { mkdirSync, writeFileSync, rmSync } from "node:fs"
import { join } from "node:path"
import { tmpdir } from "node:os"
import { runAudit } from "./audit"

describe("runAudit", () => {
  let cwd: string

  beforeEach(() => {
    cwd = join(tmpdir(), `solidiom-audit-${Date.now()}`, "consumer", "app")
    mkdirSync(cwd, { recursive: true })
  })

  afterEach(() => {
    rmSync(join(tmpdir(), `solidiom-audit-${Date.now()}`), { recursive: true, force: true })
  })

  const createMonorepoPkg = (name: string, version: string, license: string) => {
    const pkgDir = join(cwd, "..", "..", "packages", name)
    mkdirSync(pkgDir, { recursive: true })
    writeFileSync(
      join(pkgDir, "package.json"),
      JSON.stringify({ name: `@solidiom/${name}`, version, license }),
    )
  }

  const createNodeModule = (
    scope: string | null,
    name: string,
    version: string,
    license: string,
  ) => {
    const nmDir = scope ? join(cwd, "node_modules", scope, name) : join(cwd, "node_modules", name)
    mkdirSync(nmDir, { recursive: true })
    const pkgName = scope ? `${scope}/${name}` : name
    writeFileSync(join(nmDir, "package.json"), JSON.stringify({ name: pkgName, version, license }))
  }

  it("returns empty components when no packages exist", () => {
    const result = runAudit(cwd)
    expect(result.components).toEqual([])
  })

  it("scans monorepo packages and includes them", () => {
    createMonorepoPkg("button", "1.0.0", "MIT")
    createMonorepoPkg("dialog", "2.0.0", "Apache-2.0")
    const result = runAudit(cwd)
    expect(result.components).toHaveLength(2)
    const names = result.components.map((c) => c.name)
    expect(names).toContain("@solidiom/button")
    expect(names).toContain("@solidiom/dialog")
  })

  it("components have correct CycloneDX structure", () => {
    createMonorepoPkg("button", "1.0.0", "MIT")
    const result = runAudit(cwd)
    const comp = result.components[0]!
    expect(comp).toHaveProperty("bom-ref")
    expect(comp.type).toBe("library")
    expect(comp).toHaveProperty("name")
    expect(comp).toHaveProperty("version")
    expect(comp).toHaveProperty("purl")
    expect(comp).toHaveProperty("licenses")
  })

  it("sets bomFormat to CycloneDX and specVersion to 1.5", () => {
    const result = runAudit(cwd)
    expect(result.bomFormat).toBe("CycloneDX")
    expect(result.specVersion).toBe("1.5")
  })

  it("generates correct purl format", () => {
    createMonorepoPkg("button", "1.0.0", "MIT")
    createMonorepoPkg("dialog", "2.0.0", "MIT")
    const result = runAudit(cwd)
    const button = result.components.find((c) => c.name === "@solidiom/button")
    expect(button?.purl).toBe("pkg:npm/%40solidiom%2Fbutton@1.0.0")
  })

  it("resolves licenses from various package.json forms", () => {
    const monoDir = join(cwd, "..", "..", "packages")
    mkdirSync(monoDir, { recursive: true })
    const pkgWithArray = join(monoDir, "dual")
    mkdirSync(pkgWithArray)
    writeFileSync(
      join(pkgWithArray, "package.json"),
      JSON.stringify({
        name: "@solidiom/dual",
        version: "1.0.0",
        licenses: [{ type: "MIT" }, { type: "Apache-2.0" }],
      }),
    )
    const result = runAudit(cwd)
    const comp = result.components.find((c) => c.name === "@solidiom/dual")
    expect(comp?.licenses[0]?.license.name).toBe("MIT OR Apache-2.0")
  })

  it("deduplicates components across scans", () => {
    createMonorepoPkg("button", "1.0.0", "MIT")
    createNodeModule("@solidiom", "button", "1.0.0", "MIT")
    const result = runAudit(cwd)
    const buttons = result.components.filter((c) => c.name === "@solidiom/button")
    expect(buttons).toHaveLength(1)
  })

  it("has valid timestamp and serialNumber", () => {
    const result = runAudit(cwd)
    expect(result.serialNumber).toMatch(/^urn:uuid:/)
    expect(() => new Date(result.metadata.timestamp)).not.toThrow()
    expect(result.metadata.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
  })
})
