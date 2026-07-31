import { afterEach, describe, expect, it } from "vitest"
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { auditSourceParity, auditExportCompleteness } from "./audit-recipe-source-parity"

const temporaryRoots: string[] = []

function createPackage(files: Record<string, string>): string {
  const root = mkdtempSync(join(tmpdir(), "solidiom-source-parity-"))
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

describe("auditSourceParity", () => {
  it("passes when source/ mirrors src/ byte-for-byte", () => {
    const pkgDir = createPackage({
      "src/index.ts": "export const x = 1\n",
      "source/index.ts": "export const x = 1\n",
    })
    expect(auditSourceParity("fixture", pkgDir)).toEqual([])
  })

  it("rejects a package with no src/ directory", () => {
    const pkgDir = createPackage({ "source/index.ts": "export const x = 1\n" })
    expect(auditSourceParity("fixture", pkgDir)).toContainEqual(
      expect.objectContaining({ message: expect.stringContaining("no src/ directory") }),
    )
  })

  it("rejects a package with no source/ directory", () => {
    const pkgDir = createPackage({ "src/index.ts": "export const x = 1\n" })
    expect(auditSourceParity("fixture", pkgDir)).toContainEqual(
      expect.objectContaining({ message: expect.stringContaining("no source/ directory") }),
    )
  })

  it("rejects a file present in src/ but missing from source/", () => {
    const pkgDir = createPackage({
      "src/index.ts": "export const x = 1\n",
      "src/extra.ts": "export const y = 2\n",
      "source/index.ts": "export const x = 1\n",
    })
    expect(auditSourceParity("fixture", pkgDir)).toContainEqual(
      expect.objectContaining({
        file: "source/extra.ts",
        message: expect.stringContaining("missing from source/"),
      }),
    )
  })

  it("rejects content drift between src/ and source/", () => {
    const pkgDir = createPackage({
      "src/index.ts": "export const x = 1\n",
      "source/index.ts": "export const x = 2\n",
    })
    expect(auditSourceParity("fixture", pkgDir)).toContainEqual(
      expect.objectContaining({
        file: "source/index.ts",
        message: expect.stringContaining("content differs"),
      }),
    )
  })

  it("rejects an orphaned file in source/ removed from src/", () => {
    const pkgDir = createPackage({
      "src/index.ts": "export const x = 1\n",
      "source/index.ts": "export const x = 1\n",
      "source/stale.ts": "export const z = 3\n",
    })
    expect(auditSourceParity("fixture", pkgDir)).toContainEqual(
      expect.objectContaining({
        file: "source/stale.ts",
        message: expect.stringContaining("orphaned"),
      }),
    )
  })

  it("does not require .test.ts/.spec.ts files to be copied", () => {
    const pkgDir = createPackage({
      "src/index.ts": "export const x = 1\n",
      "src/index.test.ts": "it.todo('x')\n",
      "source/index.ts": "export const x = 1\n",
    })
    expect(auditSourceParity("fixture", pkgDir)).toEqual([])
  })
})

describe("auditExportCompleteness", () => {
  it("passes when every stylesheet has a matching export and the root export is complete", () => {
    const pkgDir = createPackage({
      "src/styles/button.css": "[data-scope='button'] {}",
      "package.json": JSON.stringify({
        exports: {
          ".": { solid: "./source/index.ts", import: "./dist/index.js", types: "./dist/index.d.ts" },
          "./styles/button.css": "./dist/styles/button.css",
        },
      }),
    })
    expect(auditExportCompleteness("fixture", pkgDir)).toEqual([])
  })

  it("rejects a stylesheet with no export entry", () => {
    const pkgDir = createPackage({
      "src/styles/button.css": "[data-scope='button'] {}",
      "package.json": JSON.stringify({
        exports: {
          ".": { solid: "./source/index.ts", import: "./dist/index.js", types: "./dist/index.d.ts" },
        },
      }),
    })
    expect(auditExportCompleteness("fixture", pkgDir)).toContainEqual(
      expect.objectContaining({ message: expect.stringContaining('"./styles/button.css"') }),
    )
  })

  it("rejects an export entry pointing at a stylesheet that no longer exists", () => {
    const pkgDir = createPackage({
      "src/styles/button.css": "[data-scope='button'] {}",
      "package.json": JSON.stringify({
        exports: {
          ".": { solid: "./source/index.ts", import: "./dist/index.js", types: "./dist/index.d.ts" },
          "./styles/button.css": "./dist/styles/button.css",
          "./styles/removed.css": "./dist/styles/removed.css",
        },
      }),
    })
    expect(auditExportCompleteness("fixture", pkgDir)).toContainEqual(
      expect.objectContaining({ message: expect.stringContaining("removed.css does not exist") }),
    )
  })

  it("rejects a missing root export", () => {
    const pkgDir = createPackage({
      "src/styles/button.css": "[data-scope='button'] {}",
      "package.json": JSON.stringify({ exports: { "./styles/button.css": "./dist/styles/button.css" } }),
    })
    expect(auditExportCompleteness("fixture", pkgDir)).toContainEqual(
      expect.objectContaining({ message: expect.stringContaining('missing the "." root entry') }),
    )
  })

  it("rejects a root export missing the solid condition", () => {
    const pkgDir = createPackage({
      "src/styles/button.css": "[data-scope='button'] {}",
      "package.json": JSON.stringify({
        exports: {
          ".": { import: "./dist/index.js", types: "./dist/index.d.ts" },
          "./styles/button.css": "./dist/styles/button.css",
        },
      }),
    })
    expect(auditExportCompleteness("fixture", pkgDir)).toContainEqual(
      expect.objectContaining({ message: expect.stringContaining('"solid" condition') }),
    )
  })
})
