import { afterEach, describe, expect, it } from "vitest"
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { emitPackageSource, checkAllPackageSource } from "./emit-package-source"
import { auditSourceParity } from "./audit-package-source-parity"

const temporaryRoots: string[] = []

function createWorkspace(files: Record<string, string>): string {
  const root = mkdtempSync(join(tmpdir(), "solidiom-emit-source-"))
  temporaryRoots.push(root)
  for (const [relativePath, content] of Object.entries(files)) {
    const destination = join(root, relativePath)
    mkdirSync(join(destination, ".."), { recursive: true })
    writeFileSync(destination, content, "utf8")
  }
  return root
}

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true })
  }
})

describe("emitPackageSource", () => {
  it("creates source/ from src/ when source/ does not exist", () => {
    const root = createWorkspace({
      "packages/fixture/src/index.ts": "export const x = 1\n",
    })
    const result = emitPackageSource("fixture", root)
    expect(result.emitted).toBe(true)
    expect(readFileSync(join(root, "packages/fixture/source/index.ts"), "utf8")).toBe(
      "export const x = 1\n",
    )
  })

  it("overwrites stale content in source/", () => {
    const root = createWorkspace({
      "packages/fixture/src/index.ts": "export const x = 1\n",
      "packages/fixture/source/index.ts": "export const x = 999\n",
    })
    emitPackageSource("fixture", root)
    expect(readFileSync(join(root, "packages/fixture/source/index.ts"), "utf8")).toBe(
      "export const x = 1\n",
    )
  })

  it("removes orphaned files from source/ that no longer exist in src/", () => {
    const root = createWorkspace({
      "packages/fixture/src/index.ts": "export const x = 1\n",
      "packages/fixture/source/index.ts": "export const x = 1\n",
      "packages/fixture/source/stale.ts": "export const z = 3\n",
    })
    emitPackageSource("fixture", root)
    expect(existsSync(join(root, "packages/fixture/source/stale.ts"))).toBe(false)
  })

  it("excludes .test.ts and .spec.ts files from the emission", () => {
    const root = createWorkspace({
      "packages/fixture/src/index.ts": "export const x = 1\n",
      "packages/fixture/src/index.test.ts": "it.todo('x')\n",
    })
    emitPackageSource("fixture", root)
    expect(existsSync(join(root, "packages/fixture/source/index.test.ts"))).toBe(false)
    expect(existsSync(join(root, "packages/fixture/source/index.ts"))).toBe(true)
  })

  it("preserves nested directory structure", () => {
    const root = createWorkspace({
      "packages/fixture/src/index.ts": "export const x = 1\n",
      "packages/fixture/src/commands/add.ts": "export const add = 1\n",
    })
    emitPackageSource("fixture", root)
    expect(readFileSync(join(root, "packages/fixture/source/commands/add.ts"), "utf8")).toBe(
      "export const add = 1\n",
    )
  })

  it("skips packages with no src/ directory", () => {
    const root = createWorkspace({})
    const result = emitPackageSource("fixture", root)
    expect(result.emitted).toBe(false)
  })

  it("produces output that passes auditSourceParity", () => {
    const root = createWorkspace({
      "packages/fixture/src/index.ts": "export const x = 1\n",
      "packages/fixture/src/nested/deep.ts": "export const y = 2\n",
      "packages/fixture/src/index.test.ts": "it.todo('x')\n",
    })
    emitPackageSource("fixture", root)
    expect(auditSourceParity("fixture", join(root, "packages/fixture"))).toEqual([])
  })
})

describe("checkAllPackageSource", () => {
  it("does not write any files", () => {
    const root = createWorkspace({
      "packages/cli/src/index.ts": "export const x = 1\n",
    })
    checkAllPackageSource(root)
    expect(existsSync(join(root, "packages/cli/source"))).toBe(false)
  })
})
