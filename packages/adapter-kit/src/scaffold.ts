/**
 * Scaffold template for creating new adapter packages.
 *
 * Generates the minimal file set for a conformant adapter:
 * - package.json with layer:adapter tag and no forbidden deps
 * - tsconfig.json extending base
 * - src/index.ts with capability interface + factory function
 * - tsup.config.ts for build
 */

import type { AdapterManifest } from "./types"

/** Template file descriptors for a new adapter package. */
export const ADAPTER_TEMPLATE_FILES = [
  "package.json",
  "tsconfig.json",
  "tsup.config.ts",
  "src/index.ts",
] as const

export type TemplateFile = (typeof ADAPTER_TEMPLATE_FILES)[number]

/** Generates file content for each template file. */
export function createAdapterManifest(manifest: AdapterManifest): Record<TemplateFile, string> {
  const pkgName = manifest.name
  const capName = manifest.capabilities[0]?.name ?? "unknown"
  const capVersion = manifest.capabilities[0]?.version ?? 1
  const interfaceName = pascalCase(capName) + "Capability"
  const factoryName = `create${pascalCase(manifest.engine)}Adapter`

  return {
    "package.json": JSON.stringify(
      {
        name: pkgName,
        version: "0.0.1-next.0",
        private: false,
        license: "MIT",
        type: "module",
        exports: {
          ".": {
            import: "./dist/index.js",
            types: "./dist/index.d.ts",
          },
        },
        main: "./dist/index.js",
        types: "./dist/index.d.ts",
        files: ["dist"],
        scripts: {
          build: "tsup && tsc --emitDeclarationOnly --outDir dist",
          test: "vitest run --passWithNoTests",
          typecheck: "tsc --noEmit",
        },
        dependencies: {
          [manifest.engine]: "*",
        },
        nx: {
          tags: ["layer:adapter"],
          metadata: {
            label: manifest.label,
            description: manifest.description,
            category: "adapter",
          },
        },
      },
      null,
      2,
    ),

    "tsconfig.json": JSON.stringify(
      {
        extends: "../../tsconfig.base.json",
        compilerOptions: {
          outDir: "dist",
          rootDir: "src",
          declaration: true,
          declarationDir: "dist",
        },
        include: ["src"],
      },
      null,
      2,
    ),

    "tsup.config.ts": `import { createTsupConfig } from "../../tools/build/tsup.config.base"
export default createTsupConfig({ entry: ["src/index.ts"] })
`,

    "src/index.ts": `/**
 * ${pkgName} — ${manifest.label}
 * Implements ${interfaceName}@${capVersion} by delegating to ${manifest.engine}.
 *
 * The adapter owns the algorithm/computation. The primitive owns DOM, ARIA,
 * focus, and semantic attributes. Per §0.2: adapters return capability
 * snapshots, not component props or JSX attribute bags.
 */

// ─── Capability interface ─────────────────────────────────────────────────────

export interface ${interfaceName}Input {
  // TODO: Define input shape for the capability
}

export interface ${interfaceName}Result {
  // TODO: Define result shape (snapshot data, not DOM/JSX)
}

export interface ${interfaceName} {
  compute(input: ${interfaceName}Input): ${interfaceName}Result
  destroy(): void
}

// ─── Adapter factory ──────────────────────────────────────────────────────────

/**
 * Creates a ${manifest.label} adapter.
 * Returns a ${interfaceName} that computes snapshots from the engine.
 */
export function ${factoryName}(): ${interfaceName} {
  return {
    compute(input: ${interfaceName}Input): ${interfaceName}Result {
      // TODO: Delegate to ${manifest.engine} and return snapshot
      throw new Error("Not implemented")
    },
    destroy() {
      // TODO: Clean up engine resources if needed
    },
  }
}
`,
  }
}

function pascalCase(str: string): string {
  return str
    .split(/[-_\s]+/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("")
}
