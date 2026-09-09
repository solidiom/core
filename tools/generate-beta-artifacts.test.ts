import { describe, expect, it } from "vitest"
import { mkdtempSync, readFileSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { generateBetaArtifacts } from "./generate-beta-artifacts"

describe("generate-beta-artifacts determinism", () => {
  it("produces byte-identical catalogs, pointers, and hashes from identical inputs", () => {
    const root = mkdtempSync(join(tmpdir(), "solidiom-beta-artifacts-"))
    const firstDirectory = join(root, "first")
    const secondDirectory = join(root, "second")

    try {
      const first = generateBetaArtifacts({
        outputDirectory: firstDirectory,
        releaseId: "release-test-001",
        verify: true,
      })
      const second = generateBetaArtifacts({
        outputDirectory: secondDirectory,
        releaseId: "release-test-001",
        verify: true,
      })

      expect(readFileSync(first.catalogPath)).toEqual(readFileSync(second.catalogPath))
      expect(readFileSync(first.pointerPath)).toEqual(readFileSync(second.pointerPath))
      expect(first.catalogSha256).toBe(second.catalogSha256)
      expect(first.registryIndexSha256).toBe(second.registryIndexSha256)
      expect(first.catalog).not.toHaveProperty("generatedAt")
      expect(first.pointer).not.toHaveProperty("generatedAt")
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })
})
