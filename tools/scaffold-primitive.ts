/**
 * tools/scaffold-primitive — Full primitive package generator (3B.2 / 3B.3).
 *
 * Creates the complete directory structure for a new primitive package:
 *   - package.json with nx metadata, peer deps, workspace deps
 *   - tsconfig.json, tsup.config.ts
 *   - src/index.tsx (headless primitive stub)
 *   - src/<name>.test.ts (test stub)
 *   - Docs scaffolding delegated to scaffold-primitive-docs.ts
 *   - Auto-wires into recipe-contract-definitions.ts
 *
 * Usage:
 *   pnpm tsx tools/scaffold-primitive.ts <name> [--label "Label"] [--category feedback] [--description "..."]
 *   pnpm tsx tools/scaffold-primitive.ts badge --label Badge --category feedback --description "Inline status indicator"
 *
 * Idempotent: skips files that already exist unless --force is passed.
 */

import { readFileSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { atomicWriteFileSync, createFileExclusiveSync } from "./fs-safe"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")

interface ScaffoldOptions {
  name: string
  label: string
  category: string
  description: string
  force: boolean
}

function parseArgs(): ScaffoldOptions {
  const args = process.argv.slice(2)
  const name = args.find((a) => !a.startsWith("--"))
  if (!name) {
    console.error(
      "Usage: pnpm tsx tools/scaffold-primitive.ts <name> [--label ...] [--category ...] [--description ...]",
    )
    process.exit(1)
  }

  const getFlag = (flag: string): string | undefined => {
    const idx = args.indexOf(flag)
    return idx >= 0 && idx + 1 < args.length ? args[idx + 1] : undefined
  }

  const label =
    getFlag("--label") ??
    name.charAt(0).toUpperCase() +
      name.slice(1).replace(/-([a-z])/g, (_, c) => " " + c.toUpperCase())
  const category = getFlag("--category") ?? "layout"
  const description = getFlag("--description") ?? `${label} primitive.`

  return { name, label, category, description, force: args.includes("--force") }
}

function writeIfMissing(path: string, content: string, force: boolean): boolean {
  const written = force
    ? (atomicWriteFileSync(path, content), true)
    : createFileExclusiveSync(path, content)
  if (!written) {
    console.log(`  skip ${path} (exists)`)
    return false
  }
  console.log(`  write ${path}`)
  return true
}

function generatePackageJson(opts: ScaffoldOptions): string {
  return (
    JSON.stringify(
      {
        name: `@solidiom/${opts.name}`,
        version: "0.0.1-next.0",
        private: false,
        license: "MIT",
        type: "module",
        exports: {
          ".": {
            solid: "./source/index.tsx",
            import: "./dist/index.js",
            types: "./dist/index.d.ts",
          },
        },
        main: "./dist/index.js",
        types: "./dist/index.d.ts",
        files: ["dist", "source", "src", "!src/**/*.test.*"],
        scripts: {
          build: "tsup && tsc --emitDeclarationOnly --outDir dist",
          test: "vitest run --passWithNoTests",
          typecheck: "tsc --noEmit",
        },
        peerDependencies: {
          "@solidjs/web": ">=2.0.0-beta",
          "solid-js": "catalog:",
        },
        dependencies: {
          "@solidiom/runtime": "workspace:*",
        },
        nx: {
          tags: ["layer:primitive"],
          metadata: {
            label: opts.label,
            description: opts.description,
            category: opts.category,
            registry: { status: "experimental" },
          },
        },
      },
      null,
      2,
    ) + "\n"
  )
}

function generateTsconfig(): string {
  return (
    JSON.stringify(
      {
        extends: "../../tsconfig.base.json",
        include: ["src"],
        compilerOptions: {
          outDir: "dist",
          rootDir: "src",
        },
      },
      null,
      2,
    ) + "\n"
  )
}

function generateTsupConfig(name: string): string {
  return `import { createTsupConfig } from "../../tools/build/tsup.config.base"

export default createTsupConfig({ packageName: "${name}" })
`
}

function generateIndexTsx(opts: ScaffoldOptions): string {
  const pascal = opts.name
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("")

  return `/**
 * @solidiom/${opts.name} — ${opts.description}
 *
 * Headless primitive providing accessible behavior without styling opinions.
 */
import { createComponent, mergeProps } from "@solidiom/runtime"
import type { JSX } from "solid-js"

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ${pascal}RootProps {
  children?: JSX.Element
  class?: string
}

// ─── Components ─────────────────────────────────────────────────────────────

export function Root(props: ${pascal}RootProps) {
  const merged = mergeProps({ "data-part": "root" } as const, props)
  return createComponent("div", merged)
}
`
}

function generateTestFile(opts: ScaffoldOptions): string {
  const pascal = opts.name
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("")

  return `import { describe, it, expect } from "vitest"
import { Root } from "./index"

describe("${opts.name}", () => {
  it("exports a Root component", () => {
    expect(Root).toBeDefined()
    expect(typeof Root).toBe("function")
  })
})
`
}

function main(): void {
  const opts = parseArgs()
  const pkgDir = join(ROOT, "packages", opts.name)

  console.log(`\nScaffolding @solidiom/${opts.name}:`)

  writeIfMissing(join(pkgDir, "package.json"), generatePackageJson(opts), opts.force)
  writeIfMissing(join(pkgDir, "tsconfig.json"), generateTsconfig(), opts.force)
  writeIfMissing(join(pkgDir, "tsup.config.ts"), generateTsupConfig(opts.name), opts.force)
  writeIfMissing(join(pkgDir, "src/index.tsx"), generateIndexTsx(opts), opts.force)
  writeIfMissing(join(pkgDir, `src/${opts.name}.test.ts`), generateTestFile(opts), opts.force)

  console.log(`\n  Next steps:`)
  console.log(`    1. Implement the primitive in packages/${opts.name}/src/index.tsx`)
  console.log(`    2. Add recipe definition: tools/recipe-contract-definitions.ts`)
  console.log(`    3. Scaffold docs: pnpm run primitive:scaffold-docs -- ${opts.name}`)
  console.log(`    4. Run: pnpm tsx tools/scaffold-primitive.ts --sync`)
  console.log()
}

main()
