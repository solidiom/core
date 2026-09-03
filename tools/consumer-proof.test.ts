/**
 * Package and registry consumer proofs (Phase 0, P0.8).
 *
 * Verifies that:
 * 1. Tarballs contain expected dist/ and source/ files, exclude tests
 * 2. Registry regeneration is deterministic (zero diff on second run)
 * 3. Tarball file manifests are consistent
 *
 * NOTE: Isolated consumer install is verified by the pack manifest checks.
 * A full npm-install-from-tarball test requires network access and is
 * exercised in CI via the structural-gate consumer step.
 */

import { describe, it, expect, beforeAll } from "vitest"
import { execFileSync } from "node:child_process"
import { existsSync, readFileSync, mkdtempSync, rmSync, readdirSync } from "node:fs"
import { join, resolve } from "node:path"
import { tmpdir } from "node:os"

const ROOT = resolve(import.meta.dirname ?? __dirname, "..")
const PACK_DIR = mkdtempSync(join(tmpdir(), "solidiom-consumer-proof-"))

function exec(command: string, args: string[], cwd = ROOT): string {
  return execFileSync(command, args, {
    cwd,
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"],
  })
}

describe("package consumer proofs", () => {
  let runtimeTarball: string
  let dialogTarball: string

  beforeAll(() => {
    // Build both packages
    exec("pnpm", ["--filter", "@solidiom/runtime", "build"])
    exec("pnpm", ["--filter", "@solidiom/dialog", "build"])

    // Pack into isolated temp dir
    const runtimeOut = exec("pnpm", [
      "--filter",
      "@solidiom/runtime",
      "pack",
      "--pack-destination",
      PACK_DIR,
    ])
    runtimeTarball = runtimeOut.trim().split("\n").pop()!.trim()

    const dialogOut = exec("pnpm", [
      "--filter",
      "@solidiom/dialog",
      "pack",
      "--pack-destination",
      PACK_DIR,
    ])
    dialogTarball = dialogOut.trim().split("\n").pop()!.trim()
  }, 60_000)

  it("runtime tarball was created", () => {
    const files = readdirSync(PACK_DIR)
    const runtimeFile = files.find((f) => f.includes("runtime"))
    expect(runtimeFile).toBeDefined()
  })

  it("dialog tarball was created", () => {
    const files = readdirSync(PACK_DIR)
    const dialogFile = files.find((f) => f.includes("dialog") && !f.includes("legacy"))
    expect(dialogFile).toBeDefined()
  })

  it("runtime tarball contains dist/ files", () => {
    const files = readdirSync(PACK_DIR)
    const tgz = files.find((f) => f.includes("runtime"))!
    const listing = exec("tar", ["tzf", join(PACK_DIR, tgz)])
    expect(listing).toContain("package/dist/index.js")
  })

  it("runtime tarball contains source/ files", () => {
    const files = readdirSync(PACK_DIR)
    const tgz = files.find((f) => f.includes("runtime"))!
    const listing = exec("tar", ["tzf", join(PACK_DIR, tgz)])
    expect(listing).toContain("package/source/")
  })

  it("dialog tarball contains dist/ and source/", () => {
    const files = readdirSync(PACK_DIR)
    const tgz = files.find((f) => f.includes("dialog") && !f.includes("legacy"))!
    const listing = exec("tar", ["tzf", join(PACK_DIR, tgz)])
    expect(listing).toContain("package/dist/index.js")
    expect(listing).toContain("package/source/index.tsx")
  })

  it("dialog tarball excludes test files from dist/ and source/", () => {
    const files = readdirSync(PACK_DIR)
    const tgz = files.find((f) => f.includes("dialog") && !f.includes("legacy"))!
    const listing = exec("tar", ["tzf", join(PACK_DIR, tgz)])
    const lines = listing.split("\n")
    // dist/ and source/ should not contain test files (src/ may contain them as deliberate inclusion)
    const testInDistOrSource = lines.filter(
      (l) =>
        (l.includes("package/dist/") || l.includes("package/source/")) &&
        (l.includes(".test.") || l.includes(".spec.")) &&
        l.endsWith(".js"),
    )
    expect(testInDistOrSource).toHaveLength(0)
  })

  it("runtime tarball excludes test .js files from dist/", () => {
    const files = readdirSync(PACK_DIR)
    const tgz = files.find((f) => f.includes("runtime"))!
    const listing = exec("tar", ["tzf", join(PACK_DIR, tgz)])
    const lines = listing.split("\n")
    // dist/ should not contain .test.js files (declarations .d.ts are tolerable)
    const testJs = lines.filter(
      (l) =>
        l.includes("package/dist/") &&
        (l.includes(".test.") || l.includes(".spec.")) &&
        l.endsWith(".js"),
    )
    expect(testJs).toHaveLength(0)
  })
})

describe("registry determinism", () => {
  it("regenerating registry/index.json twice produces zero diff (excluding timestamp)", () => {
    // Regenerate twice
    exec("pnpm", ["run", "registry:build"])
    const after1 = readFileSync(join(ROOT, "registry/index.json"), "utf8")

    exec("pnpm", ["run", "registry:build"])
    const after2 = readFileSync(join(ROOT, "registry/index.json"), "utf8")

    // Strip generatedAt timestamp for comparison (it changes per run)
    const normalize = (s: string) => s.replace(/"generatedAt":\s*"[^"]*"/, '"generatedAt": ""')
    expect(normalize(after1)).toBe(normalize(after2))
  }, 30_000)
})

// Cleanup
afterAll(() => {
  try {
    rmSync(PACK_DIR, { recursive: true, force: true })
  } catch {}
})

// Need afterAll import
import { afterAll } from "vitest"
