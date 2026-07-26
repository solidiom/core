import { defineConfig, type Options } from "tsup"
import { copyFileSync, mkdirSync, readdirSync, statSync } from "node:fs"
import { join } from "node:path"

/**
 * Base tsup config for pure-TS packages (runtime kernel, adapters, CLI, migrations, ESLint plugin).
 * Dual emission: dist/ compiled ESM + source/ canonical TS.
 *
 * DTS is disabled — use tsc separately for declarations (TS7 compat).
 */
export function createTsupConfig(
  overrides: Partial<Options> = {},
): ReturnType<typeof defineConfig> {
  return defineConfig({
    entry: ["src/index.ts"],
    format: ["esm"],
    dts: false,
    splitting: false,
    sourcemap: true,
    clean: true,
    outDir: "dist",
    target: "es2022",
    ...overrides,
    onSuccess: async () => {
      copySourceDir("src", "source")
    },
  })
}

function copySourceDir(srcDir: string, destDir: string) {
  try {
    mkdirSync(destDir, { recursive: true })
    const entries = readdirSync(srcDir)
    for (const entry of entries) {
      // Skip test files from source/ emission
      if (entry.endsWith(".test.ts") || entry.endsWith(".spec.ts")) continue
      const srcPath = join(srcDir, entry)
      const destPath = join(destDir, entry)
      const stat = statSync(srcPath)
      if (stat.isDirectory()) {
        copySourceDir(srcPath, destPath)
      } else {
        copyFileSync(srcPath, destPath)
      }
    }
  } catch {
    // Non-fatal: source/ emission is best-effort during dev
  }
}

export default createTsupConfig()
