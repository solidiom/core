import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from "node:fs"
import { join } from "node:path"
import { tmpdir } from "node:os"
import { createHash } from "node:crypto"
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

/**
 * Write a minimal registry (index.json + <primitive>.json manifest) at
 * <cwd>/../../registry that verifies cleanly against the given source file
 * contents, so installSource's pre-write verification (CLI-003) passes.
 * Mirrors the monorepo-relative candidate path installSource/verifySourceIntegrity
 * resolve (join(cwd, "..", "..", "registry")).
 */
function writeMatchingRegistry(
  cwd: string,
  primitive: string,
  files: Record<string, string>,
  options: { deliverables?: string[] } = {},
): void {
  const registryDir = join(cwd, "..", "..", "registry")
  mkdirSync(registryDir, { recursive: true })

  const fileDigests: Record<string, string> = {}
  for (const [relPath, content] of Object.entries(files)) {
    fileDigests[relPath] = computeDigest(content)
  }
  const sortedDigests = Object.entries(fileDigests).sort(([a], [b]) => a.localeCompare(b))
  const filesHash = createHash("sha256")
    .update(sortedDigests.map(([, digest]: [string, string]) => digest).join(""))
    .digest("hex")

  const manifest = {
    $schema: "https://solidiom.dev/schemas/registry-manifest/v2.json",
    name: primitive,
    version: "0.0.1-next.0",
    package: `@solidiom/${primitive}`,
    label: primitive,
    description: primitive,
    category: "input",
    status: "preview" as const,
    deliverables: options.deliverables ?? ["primitive"],
    capabilities: [],
    cli: { addCommand: `solidiom add ${primitive}`, installDeps: [] },
    accessibility: { reviewStatus: "none" as const, evidenceIds: [] },
    documentation: { status: "stub" as const, locales: {} },
    styling: { outputs: [], themeCompatible: [] },
    search: { keywords: [primitive] },
    source: { entry: "index.tsx", files: Object.keys(files) },
    dependencies: ["@solidiom/runtime"],
    runtime: [],
    integrity: {
      algorithm: "sha256" as const,
      filesHash,
      fileDigests,
      lastGenerated: "2025-01-01T00:00:00.000Z",
    },
    provenance: {
      repository: "https://github.com/solidiom/core",
      directory: `packages/${primitive}`,
    },
    lastUpdated: "2025-01-01T00:00:00.000Z",
  }
  writeFileSync(join(registryDir, `${primitive}.json`), JSON.stringify(manifest))

  const entriesHash = createHash("sha256").update("").digest("hex")
  const index = {
    $schema: "https://solidiom.dev/schemas/registry-index/v3.json",
    version: 3,
    generatedAt: "2025-01-01T00:00:00.000Z",
    integrity: { algorithm: "sha256" as const, entriesHash },
    primitives: [],
    adapters: [],
    components: [],
    blocks: [],
    templates: [],
    themes: [],
  }
  writeFileSync(join(registryDir, "index.json"), JSON.stringify(index))
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
      const dialogContent = `import { x } from "@solidiom/runtime"\nexport function Dialog() {}`
      writeFileSync(join(primitiveSource, "index.tsx"), dialogContent)
      writeMatchingRegistry(cwd, "dialog", { "index.tsx": dialogContent })

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
        stylingOutputs: [],
        violations: [],
      }

      const result = installSource({ primitive: "dialog", cwd, plan, dryRun: true })
      expect(result.filesWritten.length).toBeGreaterThan(0)
      expect(result.lockUpdated).toBe(false)
      expect(result.verified).toBe(true)
      // Files should NOT be written in dry-run
      expect(existsSync(join(cwd, "src/ui/primitives/dialog/index.tsx"))).toBe(false)
    })

    it("writes source files and lockfile", () => {
      const primitiveSource = join(cwd, "..", "..", "packages", "dialog", "source")
      mkdirSync(primitiveSource, { recursive: true })
      const dialogContent = `import { x } from "@solidiom/runtime"\nexport function Dialog() {}`
      writeFileSync(join(primitiveSource, "index.tsx"), dialogContent)
      writeMatchingRegistry(cwd, "dialog", { "index.tsx": dialogContent })

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
        stylingOutputs: [],
        violations: [],
      }

      const result = installSource({ primitive: "dialog", cwd, plan, dryRun: false })
      expect(result.filesWritten.length).toBeGreaterThan(0)
      expect(result.lockUpdated).toBe(true)
      expect(result.verified).toBe(true)
      expect(result.violations).toEqual([])

      // Source file should be written with rewritten imports
      const written = readFileSync(join(cwd, "src/ui/primitives/dialog/index.tsx"), "utf8")
      expect(written).not.toContain("@solidiom/runtime")
      expect(written).toContain("_runtime")

      // Lockfile should exist
      const lock = readLock(cwd)
      expect(lock.version).toBe(1)
      expect(Object.keys(lock.installed).length).toBeGreaterThan(0)
      const dialogEntry = lock.installed["src/ui/primitives/dialog/index.tsx"]!
      expect(dialogEntry.provenance).toBe("verified")
      expect(dialogEntry.manifestFilesHash).toBeTruthy()
      expect(dialogEntry.verifiedAt).toBeTruthy()
    })
  })

  describe("installSource — verification gating (CLI-003)", () => {
    function makePlan(): Plan {
      return {
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
        stylingOutputs: [],
        violations: [],
      }
    }

    it("writes nothing when the source file is tampered relative to the manifest and requireVerifiedSource is true (default)", () => {
      const primitiveSource = join(cwd, "..", "..", "packages", "dialog", "source")
      mkdirSync(primitiveSource, { recursive: true })
      const originalContent = `import { x } from "@solidiom/runtime"\nexport function Dialog() {}`
      // Manifest records digests for the ORIGINAL content...
      writeMatchingRegistry(cwd, "dialog", { "index.tsx": originalContent })
      // ...but the actual file on disk has been tampered with.
      writeFileSync(join(primitiveSource, "index.tsx"), `${originalContent}\n// tampered`)

      const beforeLockExists = existsSync(join(cwd, ".solidiom", "lock.json"))
      const beforeLockContent = beforeLockExists
        ? readFileSync(join(cwd, ".solidiom", "lock.json"), "utf8")
        : null

      const result = installSource({ primitive: "dialog", cwd, plan: makePlan(), dryRun: false })

      expect(result.verified).toBe(false)
      expect(result.violations.length).toBeGreaterThan(0)
      expect(result.filesWritten).toEqual([])
      expect(result.lockUpdated).toBe(false)

      // No partial file was written anywhere under sourceDir.
      expect(existsSync(join(cwd, "src/ui/primitives/dialog/index.tsx"))).toBe(false)
      expect(existsSync(join(cwd, "src/ui/primitives/dialog"))).toBe(false)

      // Lockfile is byte-identical to its pre-attempt state (or still absent).
      const afterLockExists = existsSync(join(cwd, ".solidiom", "lock.json"))
      expect(afterLockExists).toBe(beforeLockExists)
      if (afterLockExists) {
        expect(readFileSync(join(cwd, ".solidiom", "lock.json"), "utf8")).toBe(beforeLockContent)
      }
    })

    it("proceeds with a tampered install when allowUnverified is true, recording provenance 'unverified'", () => {
      const primitiveSource = join(cwd, "..", "..", "packages", "dialog", "source")
      mkdirSync(primitiveSource, { recursive: true })
      const originalContent = `import { x } from "@solidiom/runtime"\nexport function Dialog() {}`
      writeMatchingRegistry(cwd, "dialog", { "index.tsx": originalContent })
      writeFileSync(join(primitiveSource, "index.tsx"), `${originalContent}\n// tampered`)

      const result = installSource({
        primitive: "dialog",
        cwd,
        plan: makePlan(),
        dryRun: false,
        allowUnverified: true,
      })

      expect(result.verified).toBe(false)
      expect(result.violations.length).toBeGreaterThan(0)
      expect(result.filesWritten.length).toBeGreaterThan(0)
      expect(result.lockUpdated).toBe(true)
      expect(existsSync(join(cwd, "src/ui/primitives/dialog/index.tsx"))).toBe(true)

      const lock = readLock(cwd)
      const entry = lock.installed["src/ui/primitives/dialog/index.tsx"]!
      expect(entry.provenance).toBe("unverified")
    })

    it("blocks by default (no policy.json) when verification fails — requireVerifiedSource defaults to true", () => {
      const primitiveSource = join(cwd, "..", "..", "packages", "dialog", "source")
      mkdirSync(primitiveSource, { recursive: true })
      writeFileSync(
        join(primitiveSource, "index.tsx"),
        `import { x } from "@solidiom/runtime"\nexport function Dialog() {}`,
      )
      // Deliberately do not write any registry — verification will fail with "no manifest found".

      const result = installSource({ primitive: "dialog", cwd, plan: makePlan(), dryRun: false })

      expect(result.verified).toBe(false)
      expect(result.filesWritten).toEqual([])
      expect(result.lockUpdated).toBe(false)
      expect(existsSync(join(cwd, "src/ui/primitives/dialog/index.tsx"))).toBe(false)
    })

    it("installs normally and records provenance 'verified' when the manifest matches (happy path)", () => {
      const primitiveSource = join(cwd, "..", "..", "packages", "dialog", "source")
      mkdirSync(primitiveSource, { recursive: true })
      const content = `import { x } from "@solidiom/runtime"\nexport function Dialog() {}`
      writeFileSync(join(primitiveSource, "index.tsx"), content)
      writeMatchingRegistry(cwd, "dialog", { "index.tsx": content })

      const result = installSource({ primitive: "dialog", cwd, plan: makePlan(), dryRun: false })

      expect(result.verified).toBe(true)
      expect(result.violations).toEqual([])
      expect(result.filesWritten.length).toBeGreaterThan(0)

      const lock = readLock(cwd)
      const entry = lock.installed["src/ui/primitives/dialog/index.tsx"]!
      expect(entry.provenance).toBe("verified")
    })
  })

  describe("installSource — deliverable-aware destinations (CLI-004)", () => {
    function makePlan(overrides: Partial<Plan> = {}): Plan {
      return {
        primitive: "button",
        mode: "source",
        entries: [
          {
            package: "@solidiom/button",
            version: "0.0.1-next.0",
            isAdapter: false,
            reason: "requested",
          },
        ],
        stylingOutputs: [],
        violations: [],
        ...overrides,
      }
    }

    function setUpButtonSource(content: string): void {
      const primitiveSource = join(cwd, "..", "..", "packages", "button", "source")
      mkdirSync(primitiveSource, { recursive: true })
      writeFileSync(join(primitiveSource, "index.tsx"), content)
      writeMatchingRegistry(
        cwd,
        "button",
        { "index.tsx": content },
        { deliverables: ["component"] },
      )
    }

    function setUpRecipeSource(content: string): void {
      const recipeDir = join(cwd, "..", "..", "packages", "recipes-css", "src", "recipes")
      mkdirSync(recipeDir, { recursive: true })
      writeFileSync(join(recipeDir, "button.tsx"), content)
      writeMatchingRegistry(
        cwd,
        "button",
        { "button.tsx": content },
        { deliverables: ["component"] },
      )
    }

    function setUpBlockSource(content: string): void {
      const blockSource = join(cwd, "..", "..", "packages", "blocks", "button", "source")
      mkdirSync(blockSource, { recursive: true })
      writeFileSync(join(blockSource, "index.tsx"), content)
      writeMatchingRegistry(cwd, "button", { "index.tsx": content }, { deliverables: ["block"] })
    }

    function setUpThemeSource(content: string): void {
      const themeSource = join(cwd, "..", "..", "packages", "themes", "button", "source")
      mkdirSync(themeSource, { recursive: true })
      writeFileSync(join(themeSource, "index.tsx"), content)
      writeMatchingRegistry(cwd, "button", { "index.tsx": content }, { deliverables: ["theme"] })
    }

    it("installs a 'component' deliverable under config.componentDir, not sourceDir", () => {
      const content = `export function Button() {}`
      setUpRecipeSource(content)

      const result = installSource({
        primitive: "button",
        cwd,
        plan: makePlan({ deliverable: "component", stylingProfile: "css" }),
        dryRun: false,
      })

      expect(result.verified).toBe(true)
      expect(existsSync(join(cwd, "src/ui/components/button/button.tsx"))).toBe(true)
      expect(existsSync(join(cwd, "src/ui/primitives/button/index.tsx"))).toBe(false)
    })

    it("installs a 'block' deliverable under config.blockDir, not sourceDir", () => {
      const content = `export function Button() {}`
      setUpBlockSource(content)

      const result = installSource({
        primitive: "button",
        cwd,
        plan: makePlan({ deliverable: "block" }),
        dryRun: false,
      })

      expect(result.verified).toBe(true)
      expect(existsSync(join(cwd, "src/ui/blocks/button/index.tsx"))).toBe(true)
      expect(existsSync(join(cwd, "src/ui/primitives/button/index.tsx"))).toBe(false)
    })

    it("installs a 'theme' deliverable under config.themeDir, not sourceDir", () => {
      const content = `export function Button() {}`
      setUpThemeSource(content)

      const result = installSource({
        primitive: "button",
        cwd,
        plan: makePlan({ deliverable: "theme" }),
        dryRun: false,
      })

      expect(result.verified).toBe(true)
      expect(existsSync(join(cwd, "src/ui/themes/button/index.tsx"))).toBe(true)
      expect(existsSync(join(cwd, "src/ui/primitives/button/index.tsx"))).toBe(false)
    })

    it("defaults to 'primitive'/sourceDir when plan.deliverable is absent (backward compatibility)", () => {
      const content = `export function Button() {}`
      setUpButtonSource(content)

      const result = installSource({ primitive: "button", cwd, plan: makePlan(), dryRun: false })

      expect(result.verified).toBe(true)
      expect(existsSync(join(cwd, "src/ui/primitives/button/index.tsx"))).toBe(true)
    })
  })

  describe("installSource — pre-install conflict detection (CLI-004)", () => {
    function makePlan(overrides: Partial<Plan> = {}): Plan {
      return {
        primitive: "button",
        mode: "source",
        entries: [
          {
            package: "@solidiom/button",
            version: "0.0.1-next.0",
            isAdapter: false,
            reason: "requested",
          },
        ],
        stylingOutputs: [],
        violations: [],
        deliverable: "primitive",
        ...overrides,
      }
    }

    function setUpButtonSource(content: string): void {
      const primitiveSource = join(cwd, "..", "..", "packages", "button", "source")
      mkdirSync(primitiveSource, { recursive: true })
      writeFileSync(join(primitiveSource, "index.tsx"), content)
      writeMatchingRegistry(
        cwd,
        "button",
        { "index.tsx": content },
        { deliverables: ["primitive"] },
      )
    }

    it("blocks the install and returns a ConflictReport when a user-modified file would be overwritten, writing nothing", () => {
      const originalContent = `export function Button() {}`
      const upstreamContent = `export function Button() { /* v2 */ }`

      // First install (establishes the lock entry).
      setUpButtonSource(originalContent)
      const first = installSource({ primitive: "button", cwd, plan: makePlan(), dryRun: false })
      expect(first.verified).toBe(true)
      expect(first.filesWritten.length).toBeGreaterThan(0)

      // User hand-edits the installed file.
      const installedPath = join(cwd, "src/ui/primitives/button/index.tsx")
      writeFileSync(installedPath, "export function Button() { /* user hand-edit */ }")

      // Snapshot the full tree + lock before the second (conflicting) install attempt.
      const treeBefore = readFileSync(installedPath, "utf8")
      const lockBefore = readFileSync(join(cwd, ".solidiom", "lock.json"), "utf8")

      // Upstream changes; re-running install should now conflict.
      const primitiveSource = join(cwd, "..", "..", "packages", "button", "source")
      writeFileSync(join(primitiveSource, "index.tsx"), upstreamContent)
      writeMatchingRegistry(
        cwd,
        "button",
        { "index.tsx": upstreamContent },
        { deliverables: ["primitive"] },
      )

      const second = installSource({ primitive: "button", cwd, plan: makePlan(), dryRun: false })

      expect(second.conflicts).toBeDefined()
      expect(second.conflicts!.hasBlockingConflicts).toBe(true)
      expect(second.filesWritten).toEqual([])
      expect(second.lockUpdated).toBe(false)

      // Byte-identical tree: nothing was written.
      expect(readFileSync(installedPath, "utf8")).toBe(treeBefore)
      expect(readFileSync(join(cwd, ".solidiom", "lock.json"), "utf8")).toBe(lockBefore)
    })

    it("--force overwrites a user-modified file", () => {
      const originalContent = `export function Button() {}`
      const upstreamContent = `export function Button() { /* v2 */ }`

      setUpButtonSource(originalContent)
      installSource({ primitive: "button", cwd, plan: makePlan(), dryRun: false })

      const installedPath = join(cwd, "src/ui/primitives/button/index.tsx")
      writeFileSync(installedPath, "export function Button() { /* user hand-edit */ }")

      const primitiveSource = join(cwd, "..", "..", "packages", "button", "source")
      writeFileSync(join(primitiveSource, "index.tsx"), upstreamContent)
      writeMatchingRegistry(
        cwd,
        "button",
        { "index.tsx": upstreamContent },
        { deliverables: ["primitive"] },
      )

      const result = installSource({
        primitive: "button",
        cwd,
        plan: makePlan(),
        dryRun: false,
        force: true,
      })

      expect(result.filesWritten.length).toBeGreaterThan(0)
      expect(result.lockUpdated).toBe(true)
      expect(readFileSync(installedPath, "utf8")).toContain("v2")
      expect(readFileSync(installedPath, "utf8")).not.toContain("user hand-edit")
    })

    it("--diff returns a ConflictReport with diff content matching the real would-be write, without writing anything", () => {
      const originalContent = `export function Button() {}`
      const upstreamContent = `export function Button() { /* v2 upstream */ }`

      setUpButtonSource(originalContent)
      installSource({ primitive: "button", cwd, plan: makePlan(), dryRun: false })

      const installedPath = join(cwd, "src/ui/primitives/button/index.tsx")
      const treeBefore = readFileSync(installedPath, "utf8")
      const lockBefore = readFileSync(join(cwd, ".solidiom", "lock.json"), "utf8")

      const primitiveSource = join(cwd, "..", "..", "packages", "button", "source")
      writeFileSync(join(primitiveSource, "index.tsx"), upstreamContent)
      writeMatchingRegistry(
        cwd,
        "button",
        { "index.tsx": upstreamContent },
        { deliverables: ["primitive"] },
      )

      const result = installSource({
        primitive: "button",
        cwd,
        plan: makePlan(),
        dryRun: false,
        diff: true,
      })

      expect(result.filesWritten).toEqual([])
      expect(result.lockUpdated).toBe(false)
      expect(result.conflicts).toBeDefined()

      const entry = result.conflicts!.entries.find(
        (e) => e.path === "src/ui/primitives/button/index.tsx",
      )
      expect(entry).toBeDefined()
      expect(entry!.classification).toBe("overwrite")
      expect(entry!.diff).toBeDefined()
      // The diff's "+" lines should reflect the rewritten upstream content
      // that would ACTUALLY be written (imports rewritten to _runtime), not
      // the raw upstream source.
      expect(entry!.diff).toContain("v2 upstream")

      // Nothing was actually written.
      expect(readFileSync(installedPath, "utf8")).toBe(treeBefore)
      expect(readFileSync(join(cwd, ".solidiom", "lock.json"), "utf8")).toBe(lockBefore)
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
