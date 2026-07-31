import { defineConfig, type Options } from "tsup"
import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from "node:fs"
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

/**
 * Copies `srcDir` into `destDir`, clearing `destDir` first so a file removed from
 * `srcDir` cannot linger as an orphan, and excluding test files. Failures are not
 * swallowed — a broken `source/` emission must fail the build, not report success
 * with stale or missing output (see `tools/audit-package-source-parity.ts`, CLI-001).
 */
function copySourceDir(srcDir: string, destDir: string): void {
  if (existsSync(destDir)) {
    rmSync(destDir, { recursive: true, force: true })
  }
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
}

export default createTsupConfig()
