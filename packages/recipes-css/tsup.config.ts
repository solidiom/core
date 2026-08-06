import { defineConfig } from "tsup"
import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from "node:fs"
import { join } from "node:path"

/**
 * Dual-emission build for @solidiom/recipes-css:
 *   1. TSX wrappers → dist/index.js (component-shaped recipes)
 *   2. Raw CSS → dist/styles/*.css (stylesheet recipes)
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
    "@solidiom/accordion",
    "@solidiom/alert",
    "@solidiom/avatar",
    "@solidiom/badge",
    "@solidiom/breadcrumb",
    "@solidiom/button",
    "@solidiom/card",
    "@solidiom/checkbox",
    "@solidiom/combobox",
    "@solidiom/command-palette",
    "@solidiom/data-table",
    "@solidiom/dialog",
    "@solidiom/field",
    "@solidiom/input",
    "@solidiom/kbd",
    "@solidiom/menu",
    "@solidiom/meter",
    "@solidiom/navigation-menu",
    "@solidiom/pagination",
    "@solidiom/popover",
    "@solidiom/progress",
    "@solidiom/radio-group",
    "@solidiom/resizable-panels",
    "@solidiom/runtime",
    "@solidiom/scroll-area",
    "@solidiom/select",
    "@solidiom/sheet",
    "@solidiom/spinner",
    "@solidiom/switch",
    "@solidiom/tabs",
    "@solidiom/toast",
    "@solidiom/toolbar",
    "@solidiom/tooltip",
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
