import { defineConfig } from "tsup"
import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from "node:fs"
import { join } from "node:path"

/**
 * Dual-emission build for @solidiom/recipes-tailwind:
 *   1. TSX wrappers → dist/index.js (component-shaped recipes)
 *   2. Raw CSS → dist/styles/*.css (Tailwind @apply stylesheet recipes)
 *   3. source/ canonical copy
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
  esbuildOptions(options) {
    options.jsx = "preserve"
  },
  external: [
    "solid-js",
    "@solidiom/dialog",
    "@solidiom/button",
    "@solidiom/badge",
    "@solidiom/alert",
    "@solidiom/breadcrumb",
    "@solidiom/checkbox",
    "@solidiom/switch",
    "@solidiom/tabs",
    "@solidiom/accordion",
    "@solidiom/popover",
    "@solidiom/tooltip",
    "@solidiom/menu",
    "@solidiom/toast",
    "@solidiom/select",
    "@solidiom/runtime",
  ],
  onSuccess: async () => {
    // Copy CSS files to dist/styles/
    copyDir("src/styles", "dist/styles")
    // Copy source/ canonical
    copyDir("src", "source")
  },
})

/**
 * Copies `src` to `dest`, first removing any existing `dest` so files deleted
 * from `src` do not linger in `dest` (source/ must reflect src/ exactly, not
 * accumulate stale copies). Errors are not swallowed — a failed copy must fail
 * the build, since RECIPE-006's parity audit depends on source/ being a
 * faithful, build-verified copy rather than a best-effort side effect.
 */
function copyDir(src: string, dest: string) {
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
