import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { mkdirSync, rmSync, writeFileSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { tmpdir } from "node:os"
import { createHash } from "node:crypto"
import { Cli } from "clipanion"
import { Writable } from "node:stream"
import { runAdd, AddCommand } from "./add"

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
    await expect(
      runAdd({ primitive: "dialog", cwd, packageManager: "cargo" as never }),
    ).rejects.toThrow(/Unknown package manager/)
  })

  it("does not execute the install command unless --install is set", async () => {
    const result = await runAdd({ primitive: "dialog", cwd })
    expect(result.installRun).toBeUndefined()
  })

  describe("source-mode installs and --allow-unverified (CLI-003)", () => {
    // installSource resolves the primitive's source dir via
    // join(cwd, "..", "..", "packages", primitive, "source"), so cwd must be
    // nested two levels deep here (mirrors source-install.test.ts's createTmpDir).
    let nestedCwd: string

    beforeEach(() => {
      const root = join(
        tmpdir(),
        `solidiom-add-source-test-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      )
      nestedCwd = join(root, "consumer", "app")
      mkdirSync(nestedCwd, { recursive: true })

      const primitiveSource = join(nestedCwd, "..", "..", "packages", "dialog", "source")
      mkdirSync(primitiveSource, { recursive: true })
      writeFileSync(join(primitiveSource, "index.tsx"), `export function Dialog() {}`)
      // Deliberately do not write a registry — verification fails with "no manifest found".
    })

    afterEach(() => {
      rmSync(join(nestedCwd, "..", ".."), { recursive: true, force: true })
    })

    it("blocks a source install by default when byte-level verification fails (no registry manifest present)", async () => {
      const result = await runAdd({ primitive: "dialog", cwd: nestedCwd, mode: "source" })
      expect(result.blocked).toBe(false)
      expect(result.sourceResult).toBeDefined()
      expect(result.sourceResult!.verified).toBe(false)
      expect(result.sourceResult!.filesWritten).toEqual([])
    })

    it("proceeds with a source install when --allow-unverified is set, recording provenance 'unverified'", async () => {
      const result = await runAdd({
        primitive: "dialog",
        cwd: nestedCwd,
        mode: "source",
        allowUnverified: true,
      })
      expect(result.sourceResult).toBeDefined()
      expect(result.sourceResult!.verified).toBe(false)
      expect(result.sourceResult!.filesWritten.length).toBeGreaterThan(0)

      const lock = JSON.parse(readFileSync(join(nestedCwd, ".solidiom", "lock.json"), "utf8"))
      const entry = Object.values(lock.installed)[0] as { provenance: string }
      expect(entry.provenance).toBe("unverified")
    })

    it("prints a red warning via the AddCommand CLI when --allow-unverified actually proceeds unverified", async () => {
      const stdoutChunks: Buffer[] = []
      const stderrChunks: Buffer[] = []
      const stdout = new Writable({
        write(chunk, _enc, cb) {
          stdoutChunks.push(Buffer.from(chunk))
          cb()
        },
      })
      const stderr = new Writable({
        write(chunk, _enc, cb) {
          stderrChunks.push(Buffer.from(chunk))
          cb()
        },
      })

      const cli = new Cli({
        binaryLabel: "solidiom",
        binaryName: "solidiom",
        binaryVersion: "test",
      })
      cli.register(AddCommand)

      const originalCwd = process.cwd()
      process.chdir(nestedCwd)
      try {
        await cli.run(["add", "dialog", "--mode", "source", "--allow-unverified"], {
          stdout,
          stderr,
          env: process.env,
        })
      } finally {
        process.chdir(originalCwd)
      }

      const output = Buffer.concat(stdoutChunks).toString("utf8")
      expect(output).toContain("Installed without verification")
      expect(output).toContain("unverified")
    })
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

  describe("--force / --diff flag wiring and conflict remediation hint (CLI-004)", () => {
    let nestedCwd: string

    beforeEach(() => {
      const root = join(
        tmpdir(),
        `solidiom-add-conflict-test-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      )
      nestedCwd = join(root, "consumer", "app")
      mkdirSync(nestedCwd, { recursive: true })
    })

    afterEach(() => {
      rmSync(join(nestedCwd, "..", ".."), { recursive: true, force: true })
    })

    function writeMatchingRegistryFor(cwd: string, primitive: string, content: string): void {
      const registryDir = join(cwd, "..", "..", "registry")
      mkdirSync(registryDir, { recursive: true })
      const digest = createHash("sha256").update(content, "utf8").digest("hex")
      const filesHash = createHash("sha256").update(digest).digest("hex")
      const manifest = {
        $schema: "https://solidiom.dev/schemas/registry-manifest/v2.json",
        name: primitive,
        version: "0.0.1-next.0",
        package: `@solidiom/${primitive}`,
        label: primitive,
        description: primitive,
        category: "input",
        status: "preview",
        deliverables: ["component"],
        capabilities: [],
        cli: { addCommand: `solidiom add ${primitive}`, installDeps: [] },
        accessibility: { reviewStatus: "none", evidenceIds: [] },
        documentation: { status: "stub", locales: {} },
        styling: { outputs: [], themeCompatible: [] },
        search: { keywords: [primitive] },
        source: { entry: "index.tsx", files: ["index.tsx"] },
        dependencies: ["@solidiom/runtime"],
        runtime: [],
        integrity: {
          algorithm: "sha256",
          filesHash,
          fileDigests: { "index.tsx": digest },
          lastGenerated: "2025-01-01T00:00:00.000Z",
        },
        provenance: {
          repository: "https://github.com/solidiom/solidiom",
          directory: `packages/${primitive}`,
        },
        lastUpdated: "2025-01-01T00:00:00.000Z",
      }
      writeFileSync(join(registryDir, `${primitive}.json`), JSON.stringify(manifest))
      // The index must also carry a matching primitive SUMMARY entry with the
      // "component" deliverable — otherwise runPlan's loadRegistry finds an
      // empty `primitives` array, falls through to BUILTIN_PRIMITIVES (which
      // only ever confirms "primitive"), and blocks the --deliverable
      // component request with a policy violation before install ever runs.
      const index = {
        $schema: "https://solidiom.dev/schemas/registry-index/v2.json",
        version: 2,
        generatedAt: "2025-01-01T00:00:00.000Z",
        integrity: {
          algorithm: "sha256",
          entriesHash: createHash("sha256").update("").digest("hex"),
        },
        primitives: [
          {
            name: primitive,
            version: "0.0.1-next.0",
            package: `@solidiom/${primitive}`,
            label: primitive,
            description: primitive,
            category: "input",
            status: "preview",
            deliverables: ["component"],
            hasAccessibilityEvidence: false,
            accessibility: { reviewStatus: "none", evidenceIds: [] },
            documentationStatus: "stub",
            documentationLocales: {},
            stylingOutputs: [],
            themeCompatible: [],
            searchKeywords: [primitive],
            provenance: {
              repository: "https://github.com/solidiom/solidiom",
              directory: `packages/${primitive}`,
            },
          },
        ],
        adapters: [],
      }
      writeFileSync(join(registryDir, "index.json"), JSON.stringify(index))
    }

    function setUpButtonWithConflict(): { installedPath: string } {
      const primitiveSource = join(nestedCwd, "..", "..", "packages", "button", "source")
      mkdirSync(primitiveSource, { recursive: true })
      const originalContent = `export function Button() {}`
      writeFileSync(join(primitiveSource, "index.tsx"), originalContent)
      writeMatchingRegistryFor(nestedCwd, "button", originalContent)

      return { installedPath: join(nestedCwd, "src/ui/components/button/index.tsx") }
    }

    it("blocks with a red conflict list and remediation hint when a user-modified file would be overwritten", async () => {
      const { installedPath } = setUpButtonWithConflict()
      const primitiveSource = join(nestedCwd, "..", "..", "packages", "button", "source")

      await runAdd({
        primitive: "button",
        cwd: nestedCwd,
        mode: "source",
        deliverable: "component",
      })

      writeFileSync(installedPath, "export function Button() { /* user edit */ }")

      const upstreamContent = `export function Button() { /* v2 */ }`
      writeFileSync(join(primitiveSource, "index.tsx"), upstreamContent)
      writeMatchingRegistryFor(nestedCwd, "button", upstreamContent)

      const result = await runAdd({
        primitive: "button",
        cwd: nestedCwd,
        mode: "source",
        deliverable: "component",
      })
      expect(result.sourceResult!.conflicts?.hasBlockingConflicts).toBe(true)
      expect(result.sourceResult!.filesWritten).toEqual([])

      const stdoutChunks: Buffer[] = []
      const stderrChunks: Buffer[] = []
      const stdout = new Writable({
        write(chunk, _enc, cb) {
          stdoutChunks.push(Buffer.from(chunk))
          cb()
        },
      })
      const stderr = new Writable({
        write(chunk, _enc, cb) {
          stderrChunks.push(Buffer.from(chunk))
          cb()
        },
      })

      const cli = new Cli({
        binaryLabel: "solidiom",
        binaryName: "solidiom",
        binaryVersion: "test",
      })
      cli.register(AddCommand)

      const originalCwd = process.cwd()
      process.chdir(nestedCwd)
      let exitCode: number
      try {
        exitCode = await cli.run(
          ["add", "button", "--mode", "source", "--deliverable", "component"],
          {
            stdout,
            stderr,
            env: process.env,
          },
        )
      } finally {
        process.chdir(originalCwd)
      }

      expect(exitCode).toBe(1)
      const errOutput = Buffer.concat(stderrChunks).toString("utf8")
      expect(errOutput).toContain("Blocked")
      expect(errOutput).toContain("index.tsx")
      expect(errOutput).toContain("--force")
      expect(errOutput).toContain("solidiom diff button")
    })

    it("--force overwrites the user-modified file via the CLI", async () => {
      const primitiveSource = join(nestedCwd, "..", "..", "packages", "button", "source")
      mkdirSync(primitiveSource, { recursive: true })
      const originalContent = `export function Button() {}`
      writeFileSync(join(primitiveSource, "index.tsx"), originalContent)
      writeMatchingRegistryFor(nestedCwd, "button", originalContent)

      await runAdd({
        primitive: "button",
        cwd: nestedCwd,
        mode: "source",
        deliverable: "component",
      })

      const installedPath = join(nestedCwd, "src/ui/components/button/index.tsx")
      writeFileSync(installedPath, "export function Button() { /* user edit */ }")

      const upstreamContent = `export function Button() { /* v2 */ }`
      writeFileSync(join(primitiveSource, "index.tsx"), upstreamContent)
      writeMatchingRegistryFor(nestedCwd, "button", upstreamContent)

      const result = await runAdd({
        primitive: "button",
        cwd: nestedCwd,
        mode: "source",
        deliverable: "component",
        force: true,
      })

      expect(result.sourceResult!.filesWritten.length).toBeGreaterThan(0)
      expect(readFileSync(installedPath, "utf8")).toContain("v2")
    })

    it("--diff prints pending changes without writing", async () => {
      const primitiveSource = join(nestedCwd, "..", "..", "packages", "button", "source")
      mkdirSync(primitiveSource, { recursive: true })
      const originalContent = `export function Button() {}`
      writeFileSync(join(primitiveSource, "index.tsx"), originalContent)
      writeMatchingRegistryFor(nestedCwd, "button", originalContent)

      await runAdd({
        primitive: "button",
        cwd: nestedCwd,
        mode: "source",
        deliverable: "component",
      })

      const installedPath = join(nestedCwd, "src/ui/components/button/index.tsx")
      const treeBefore = readFileSync(installedPath, "utf8")

      const upstreamContent = `export function Button() { /* v2 */ }`
      writeFileSync(join(primitiveSource, "index.tsx"), upstreamContent)
      writeMatchingRegistryFor(nestedCwd, "button", upstreamContent)

      const result = await runAdd({
        primitive: "button",
        cwd: nestedCwd,
        mode: "source",
        deliverable: "component",
        diff: true,
      })

      expect(result.sourceResult!.filesWritten).toEqual([])
      expect(result.sourceResult!.conflicts).toBeDefined()
      expect(readFileSync(installedPath, "utf8")).toBe(treeBefore)
    })
  })
})
