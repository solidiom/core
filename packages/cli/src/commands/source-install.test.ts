import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from "node:fs"
import { join } from "node:path"
import { tmpdir } from "node:os"
import { installSource, readLock, computeDigest, rewriteImports } from "../source-install/install"
import { runDiff } from "../commands/diff"
import { runDetach } from "../commands/detach"
import type { Plan } from "../commands/plan"

function createTmpDir(): string {
  // Nest cwd two levels deep so the production monorepo-resolution heuristic
  // (join(cwd, "..", "..", "packages", ...)) stays inside the writable temp tree
  // rather than escaping to the filesystem root on CI's shallow tmpdir.
  const root = join(tmpdir(), `solidiom-test-${Date.now()}-${Math.random().toString(36).slice(2)}`)
  const dir = join(root, "consumer", "app")
  mkdirSync(dir, { recursive: true })
  return dir
}

describe("source/install", () => {
  let cwd: string

  beforeEach(() => {
    cwd = createTmpDir()
    // Create .solidiom/config.json
    mkdirSync(join(cwd, ".solidiom"), { recursive: true })
    writeFileSync(
      join(cwd, ".solidiom", "config.json"),
      JSON.stringify({
        sourceDir: "src/ui/primitives",
        runtimeDir: "src/ui/_runtime",
        defaultMode: "source",
      }),
    )
  })

  afterEach(() => {
    // Clean up the entire temp root (two levels above cwd)
    const root = join(cwd, "..", "..")
    rmSync(root, { recursive: true, force: true })
  })

  describe("rewriteImports", () => {
    it("rewrites @solidiom/runtime to relative path", () => {
      const content = `import { createSignal } from "@solidiom/runtime"\nimport { collection } from "@solidiom/runtime/collection"`
      const result = rewriteImports(
        content,
        join(cwd, "src/ui/primitives/dialog/index.ts"),
        join(cwd, "src/ui/_runtime"),
      )
      expect(result).toContain("_runtime/index")
      expect(result).toContain("_runtime/collection")
      expect(result).not.toContain("@solidiom/runtime")
    })

    it("handles nested paths correctly", () => {
      const content = `import { X } from "@solidiom/runtime"`
      const result = rewriteImports(
        content,
        join(cwd, "src/ui/primitives/dialog/sub/nested.ts"),
        join(cwd, "src/ui/_runtime"),
      )
      expect(result).toContain("_runtime/index")
      expect(result).not.toContain("@solidiom/runtime")
    })
  })

  describe("computeDigest", () => {
    it("produces consistent hex digest", () => {
      const d1 = computeDigest("hello")
      const d2 = computeDigest("hello")
      expect(d1).toBe(d2)
      expect(d1).toMatch(/^[0-9a-f]{64}$/)
    })

    it("differs for different content", () => {
      expect(computeDigest("a")).not.toBe(computeDigest("b"))
    })
  })

  describe("installSource", () => {
    it("writes source files and lockfile in dry-run mode", () => {
      // Set up a fake primitive source directory
      const primitiveSource = join(cwd, "..", "..", "packages", "dialog", "source")
      mkdirSync(primitiveSource, { recursive: true })
      writeFileSync(
        join(primitiveSource, "index.tsx"),
        `import { x } from "@solidiom/runtime"\nexport function Dialog() {}`,
      )

      const plan: Plan = {
        primitive: "dialog",
        mode: "source",
        entries: [
          {
            package: "@solidiom/dialog",
            version: "0.0.1-next.0",
            isAdapter: false,
            reason: "requested",
          },
        ],
        violations: [],
      }

      const result = installSource({ primitive: "dialog", cwd, plan, dryRun: true })
      expect(result.filesWritten.length).toBeGreaterThan(0)
      expect(result.lockUpdated).toBe(false)
      // Files should NOT be written in dry-run
      expect(existsSync(join(cwd, "src/ui/primitives/dialog/index.tsx"))).toBe(false)
    })

    it("writes source files and lockfile", () => {
      const primitiveSource = join(cwd, "..", "..", "packages", "dialog", "source")
      mkdirSync(primitiveSource, { recursive: true })
      writeFileSync(
        join(primitiveSource, "index.tsx"),
        `import { x } from "@solidiom/runtime"\nexport function Dialog() {}`,
      )

      const plan: Plan = {
        primitive: "dialog",
        mode: "source",
        entries: [
          {
            package: "@solidiom/dialog",
            version: "0.0.1-next.0",
            isAdapter: false,
            reason: "requested",
          },
          {
            package: "@solidiom/runtime",
            version: "0.0.1-next.0",
            isAdapter: false,
            reason: "dependency",
          },
        ],
        violations: [],
      }

      const result = installSource({ primitive: "dialog", cwd, plan, dryRun: false })
      expect(result.filesWritten.length).toBeGreaterThan(0)
      expect(result.lockUpdated).toBe(true)

      // Source file should be written with rewritten imports
      const written = readFileSync(join(cwd, "src/ui/primitives/dialog/index.tsx"), "utf8")
      expect(written).not.toContain("@solidiom/runtime")
      expect(written).toContain("_runtime")

      // Lockfile should exist
      const lock = readLock(cwd)
      expect(lock.version).toBe(1)
      expect(Object.keys(lock.installed).length).toBeGreaterThan(0)
    })
  })

  describe("diff", () => {
    it("reports unchanged when file matches digest", () => {
      mkdirSync(join(cwd, ".solidiom"), { recursive: true })
      const filePath = join(cwd, "src/ui/primitives/dialog/index.tsx")
      mkdirSync(join(cwd, "src/ui/primitives/dialog"), { recursive: true })
      const content = "export function Dialog() {}"
      writeFileSync(filePath, content)

      const lock = {
        version: 1 as const,
        installed: {
          "src/ui/primitives/dialog/index.tsx": {
            path: "src/ui/primitives/dialog/index.tsx",
            digest: computeDigest(content),
            primitive: "dialog",
            version: "0.0.1-next.0",
          },
        },
      }
      writeFileSync(join(cwd, ".solidiom", "lock.json"), JSON.stringify(lock))

      const result = runDiff({ cwd })
      expect(result.hasChanges).toBe(false)
    })

    it("reports modified when file differs from digest", () => {
      mkdirSync(join(cwd, ".solidiom"), { recursive: true })
      const filePath = join(cwd, "src/ui/primitives/dialog/index.tsx")
      mkdirSync(join(cwd, "src/ui/primitives/dialog"), { recursive: true })
      writeFileSync(filePath, "modified content")

      const lock = {
        version: 1 as const,
        installed: {
          "src/ui/primitives/dialog/index.tsx": {
            path: "src/ui/primitives/dialog/index.tsx",
            digest: computeDigest("original content"),
            primitive: "dialog",
            version: "0.0.1-next.0",
          },
        },
      }
      writeFileSync(join(cwd, ".solidiom", "lock.json"), JSON.stringify(lock))

      const result = runDiff({ cwd })
      expect(result.hasChanges).toBe(true)
      expect(result.entries[0]!.status).toBe("modified")
    })
  })

  describe("detach", () => {
    it("marks files as detached in lockfile", () => {
      mkdirSync(join(cwd, ".solidiom"), { recursive: true })
      const lock = {
        version: 1 as const,
        installed: {
          "src/ui/primitives/dialog/index.tsx": {
            path: "src/ui/primitives/dialog/index.tsx",
            digest: "abc123",
            primitive: "dialog",
            version: "0.0.1-next.0",
          },
        },
      }
      writeFileSync(join(cwd, ".solidiom", "lock.json"), JSON.stringify(lock))

      const result = runDetach({ cwd, primitive: "dialog" })
      expect(result.detached).toHaveLength(1)

      // Verify lockfile was updated
      const updated = readLock(cwd)
      expect(updated.installed["src/ui/primitives/dialog/index.tsx"]!.detached).toBe(true)
    })
  })
})
