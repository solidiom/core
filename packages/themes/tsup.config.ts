import { defineConfig } from "tsup"
import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from "node:fs"
import { join } from "node:path"

/**
 * Build for @solidiom/themes:
 *   1. src/index.ts → dist/index.js (theme metadata/lookup helpers)
 *   2. src/css/*.css → dist/css/*.css (THEME-002 generated CSS variables)
 *   3. src/tailwind/*.css → dist/tailwind/*.css (THEME-003 generated @theme mappings)
 *   4. source/ canonical copy (package-source parity, CLI-001/RECIPE-006 convention)
 */
export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: false,
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: "dist",
  target: "es2022",
  onSuccess: async () => {
    copyDir("src/css", "dist/css")
    copyDir("src/tailwind", "dist/tailwind")
    copyDir("src", "source")
  },
})

/**
 * Copies `src` to `dest`, first removing any existing `dest` so files deleted from
 * `src` do not linger in `dest`. Errors are not swallowed — a failed copy must fail
 * the build (see tools/audit-package-source-parity.ts).
 */
function copyDir(src: string, dest: string) {
  if (!existsSync(src)) return
  if (existsSync(dest)) rmSync(dest, { recursive: true, force: true })
  mkdirSync(dest, { recursive: true })
  const entries = readdirSync(src)
  for (const entry of entries) {
    if (entry.endsWith(".test.ts") || entry.endsWith(".spec.ts")) continue
    const srcPath = join(src, entry)
    const destPath = join(dest, entry)
    const stat = statSync(srcPath)
    if (stat.isDirectory()) {
      copyDir(srcPath, destPath)
    } else {
      copyFileSync(srcPath, destPath)
    }
  }
}
