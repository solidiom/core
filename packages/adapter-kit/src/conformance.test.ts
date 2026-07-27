/**
 * Tests for the adapter authoring kit conformance harness.
 *
 * Validates that the harness correctly passes conformant adapters
 * and rejects boundary violations.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { mkdirSync, writeFileSync, rmSync } from "node:fs"
import { join, resolve } from "node:path"
import { tmpdir } from "node:os"
import { fileURLToPath } from "node:url"
import { runConformance } from "./conformance"

const __dirname = resolve(fileURLToPath(import.meta.url), "..")
const REPO_ROOT = resolve(__dirname, "../../..")

function createTmpDir(): string {
  const dir = join(tmpdir(), `adapter-kit-test-${Date.now()}-${Math.random().toString(36).slice(2)}`)
  mkdirSync(dir, { recursive: true })
  return dir
}

function writePackageJson(dir: string, overrides: Record<string, unknown> = {}) {
  const base = {
    name: "@solidiom/adapter-test-fixture",
    version: "0.0.1",
    type: "module",
    dependencies: {},
    nx: { tags: ["layer:adapter"] },
    exports: { ".": { import: "./dist/index.js", types: "./dist/index.d.ts" } },
    ...overrides,
  }
  writeFileSync(join(dir, "package.json"), JSON.stringify(base, null, 2))
}

function writeSrc(dir: string, filename: string, content: string) {
  const srcDir = join(dir, "src")
  mkdirSync(srcDir, { recursive: true })
  writeFileSync(join(srcDir, filename), content)
}

describe("adapter-kit conformance harness", () => {
  let tmpDir: string

  beforeEach(() => {
    tmpDir = createTmpDir()
  })

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true })
  })

  // ─── Positive cases (should pass) ────────────────────────────────────────

  describe("conformant adapters pass", () => {
    it("minimal conformant adapter passes", () => {
      writePackageJson(tmpDir)
      writeSrc(tmpDir, "index.ts", `
        export interface FooCapability { compute(): void; destroy(): void }
        export function createFooAdapter(): FooCapability {
          return { compute() {}, destroy() {} }
        }
      `)
      const result = runConformance({ packageDir: tmpDir })
      expect(result.pass).toBe(true)
      expect(result.violations).toHaveLength(0)
      expect(result.checkedFiles).toBe(1)
    })

    it("adapter with engine dependency passes", () => {
      writePackageJson(tmpDir, {
        dependencies: { "@tanstack/virtual-core": "3.17.5" },
      })
      writeSrc(tmpDir, "index.ts", `
        import { Virtualizer } from "@tanstack/virtual-core"
        export function createAdapter() { return {} }
      `)
      const result = runConformance({ packageDir: tmpDir })
      expect(result.pass).toBe(true)
    })

    it("test files are exempt from output pattern checks", () => {
      writePackageJson(tmpDir)
      writeSrc(tmpDir, "index.ts", `export function createAdapter() { return {} }`)
      // Test file with patterns that would be forbidden in source
      writeSrc(tmpDir, "index.test.ts", `
        import { createAdapter } from "./index"
        const attrs = { "aria-label": "test", role: "button" }
        expect(attrs).toBeDefined()
      `)
      const result = runConformance({ packageDir: tmpDir })
      expect(result.pass).toBe(true)
    })

    it("real adapter-virtualization-tanstack passes", () => {
      const result = runConformance({
        packageDir: "packages/adapter-virtualization-tanstack",
        root: REPO_ROOT,
      })
      expect(result.pass).toBe(true)
    })

    it("real adapter-table-tanstack passes", () => {
      const result = runConformance({
        packageDir: "packages/adapter-table-tanstack",
        root: REPO_ROOT,
      })
      expect(result.pass).toBe(true)
    })

    it("real adapter-positioning-floating-ui passes", () => {
      const result = runConformance({
        packageDir: "packages/adapter-positioning-floating-ui",
        root: REPO_ROOT,
      })
      expect(result.pass).toBe(true)
    })
  })

  // ─── Negative cases (should fail) ────────────────────────────────────────

  describe("boundary violations are rejected", () => {
    it("rejects missing layer:adapter tag", () => {
      writePackageJson(tmpDir, { nx: { tags: ["layer:primitive"] } })
      writeSrc(tmpDir, "index.ts", `export function createAdapter() { return {} }`)
      const result = runConformance({ packageDir: tmpDir })
      expect(result.pass).toBe(false)
      expect(result.violations.some((v) => v.rule === "layer-tag")).toBe(true)
    })

    it("rejects solid-js dependency", () => {
      writePackageJson(tmpDir, {
        dependencies: { "solid-js": "2.0.0-beta.24" },
      })
      writeSrc(tmpDir, "index.ts", `export function createAdapter() { return {} }`)
      const result = runConformance({ packageDir: tmpDir })
      expect(result.pass).toBe(false)
      expect(result.violations.some((v) => v.rule === "forbidden-dependency")).toBe(true)
      expect(result.violations[0]!.message).toContain("solid-js")
    })

    it("rejects @solidjs/web dependency", () => {
      writePackageJson(tmpDir, {
        dependencies: { "@solidjs/web": "2.0.0-beta.24" },
      })
      writeSrc(tmpDir, "index.ts", `export function createAdapter() { return {} }`)
      const result = runConformance({ packageDir: tmpDir })
      expect(result.pass).toBe(false)
      expect(result.violations.some((v) => v.message.includes("@solidjs/web"))).toBe(true)
    })

    it("rejects @kobalte dependency", () => {
      writePackageJson(tmpDir, {
        dependencies: { "@kobalte/core": "0.12.0" },
      })
      writeSrc(tmpDir, "index.ts", `export function createAdapter() { return {} }`)
      const result = runConformance({ packageDir: tmpDir })
      expect(result.pass).toBe(false)
      expect(result.violations.some((v) => v.message.includes("@kobalte/core"))).toBe(true)
    })

    it("rejects @radix-ui dependency", () => {
      writePackageJson(tmpDir, {
        dependencies: { "@radix-ui/react-dialog": "1.0.0" },
      })
      writeSrc(tmpDir, "index.ts", `export function createAdapter() { return {} }`)
      const result = runConformance({ packageDir: tmpDir })
      expect(result.pass).toBe(false)
      expect(result.violations.some((v) => v.message.includes("@radix-ui"))).toBe(true)
    })

    it("rejects solid-js import in source", () => {
      writePackageJson(tmpDir)
      writeSrc(tmpDir, "index.ts", `
        import { createSignal } from "solid-js"
        export function createAdapter() { return {} }
      `)
      const result = runConformance({ packageDir: tmpDir })
      expect(result.pass).toBe(false)
      expect(result.violations.some((v) => v.rule === "forbidden-import")).toBe(true)
    })

    it("rejects ARIA attribute output in source", () => {
      writePackageJson(tmpDir)
      writeSrc(tmpDir, "index.ts", `
        export function createAdapter() {
          return { attrs: { "aria-label": "hello" } }
        }
      `)
      const result = runConformance({ packageDir: tmpDir })
      expect(result.pass).toBe(false)
      expect(result.violations.some((v) => v.rule === "forbidden-output")).toBe(true)
      expect(result.violations.some((v) => v.message.includes("ARIA"))).toBe(true)
    })

    it("rejects className output in source", () => {
      writePackageJson(tmpDir)
      writeSrc(tmpDir, "index.ts", `
        export function createAdapter() {
          return { className: "btn-primary" }
        }
      `)
      const result = runConformance({ packageDir: tmpDir })
      expect(result.pass).toBe(false)
      expect(result.violations.some((v) => v.message.includes("class names"))).toBe(true)
    })

    it("rejects data-scope output in source", () => {
      writePackageJson(tmpDir)
      writeSrc(tmpDir, "index.ts", `
        export function createAdapter() {
          return { "data-scope": "dialog" }
        }
      `)
      const result = runConformance({ packageDir: tmpDir })
      expect(result.pass).toBe(false)
      expect(result.violations.some((v) => v.message.includes("data-scope"))).toBe(true)
    })

    it("rejects JSX in .tsx source files", () => {
      writePackageJson(tmpDir)
      writeSrc(tmpDir, "index.tsx", `
        export function AdapterComponent() {
          return <div>Not allowed</div>
        }
      `)
      const result = runConformance({ packageDir: tmpDir })
      expect(result.pass).toBe(false)
      expect(result.violations.some((v) => v.rule === "no-jsx-output")).toBe(true)
    })

    it("rejects solid export condition in package.json", () => {
      writePackageJson(tmpDir, {
        exports: {
          ".": {
            solid: "./source/index.tsx",
            import: "./dist/index.js",
            types: "./dist/index.d.ts",
          },
        },
      })
      writeSrc(tmpDir, "index.ts", `export function createAdapter() { return {} }`)
      const result = runConformance({ packageDir: tmpDir })
      expect(result.pass).toBe(false)
      expect(result.violations.some((v) => v.rule === "no-solid-condition")).toBe(true)
    })

    it("reports missing package.json", () => {
      // tmpDir with no package.json
      const result = runConformance({ packageDir: join(tmpDir, "nonexistent") })
      expect(result.pass).toBe(false)
      expect(result.violations[0]!.rule).toBe("package-exists")
    })

    it("reports missing src/ directory", () => {
      writePackageJson(tmpDir)
      // No src/ dir created
      const result = runConformance({ packageDir: tmpDir })
      expect(result.pass).toBe(false)
      expect(result.violations.some((v) => v.rule === "src-exists")).toBe(true)
    })
  })

  // ─── Scaffold template ──────────────────────────────────────────────────

  describe("scaffold template", () => {
    it("generated scaffold passes conformance", async () => {
      const { createAdapterManifest } = await import("./scaffold")
      const files = createAdapterManifest({
        name: "@solidiom/adapter-test-engine",
        label: "Test Engine Adapter",
        description: "A test adapter for conformance validation",
        engine: "test-engine",
        capabilities: [{ name: "test-capability", version: 1 }],
        entry: "src/index.ts",
      })

      // Write generated files to tmpDir
      writeFileSync(join(tmpDir, "package.json"), files["package.json"])
      const srcDir = join(tmpDir, "src")
      mkdirSync(srcDir, { recursive: true })
      writeFileSync(join(srcDir, "index.ts"), files["src/index.ts"])

      const result = runConformance({ packageDir: tmpDir })
      expect(result.pass).toBe(true)
      expect(result.violations).toHaveLength(0)
    })

    it("scaffold generates all expected files", async () => {
      const { createAdapterManifest, ADAPTER_TEMPLATE_FILES } = await import("./scaffold")
      const files = createAdapterManifest({
        name: "@solidiom/adapter-foo",
        label: "Foo Adapter",
        description: "Foo",
        engine: "foo-engine",
        capabilities: [{ name: "foo", version: 1 }],
        entry: "src/index.ts",
      })

      for (const template of ADAPTER_TEMPLATE_FILES) {
        expect(files[template]).toBeDefined()
        expect(files[template].length).toBeGreaterThan(0)
      }
    })

    it("scaffold generates correct package name and layer tag", async () => {
      const { createAdapterManifest } = await import("./scaffold")
      const files = createAdapterManifest({
        name: "@solidiom/adapter-my-engine",
        label: "My Engine Adapter",
        description: "desc",
        engine: "my-engine",
        capabilities: [{ name: "my-cap", version: 2 }],
        entry: "src/index.ts",
      })

      const pkg = JSON.parse(files["package.json"])
      expect(pkg.name).toBe("@solidiom/adapter-my-engine")
      expect(pkg.nx.tags).toContain("layer:adapter")
      expect(pkg.dependencies["my-engine"]).toBe("*")
    })

    it("scaffold generates capability interface with correct name", async () => {
      const { createAdapterManifest } = await import("./scaffold")
      const files = createAdapterManifest({
        name: "@solidiom/adapter-date-temporal",
        label: "Temporal Date Adapter",
        description: "desc",
        engine: "temporal-polyfill",
        capabilities: [{ name: "date-math", version: 1 }],
        entry: "src/index.ts",
      })

      expect(files["src/index.ts"]).toContain("DateMathCapability")
      expect(files["src/index.ts"]).toContain("createTemporalPolyfillAdapter")
    })
  })
})
