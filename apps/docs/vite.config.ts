import { defineConfig } from "vite"
import solid from "vite-plugin-solid"
import tailwindcss from "@tailwindcss/vite"
import path from "node:path"

const packagesDir = path.resolve(__dirname, "../../packages")

/**
 * Workspace packages consumed via the "solid" export condition (raw source) import
 * @solidiom/runtime as a bare specifier. In dev mode, Vite resolves imports relative
 * to the importing file. Since pnpm hoists selectively, the dev resolver can't
 * find @solidiom/runtime from within package source dirs. We alias it to the source
 * directory directly so the dev server can resolve and transform it in-place.
 */
export default defineConfig({
  plugins: [tailwindcss(), solid()],
  build: {
    target: "es2022",
  },
  resolve: {
    dedupe: ["solid-js", "@solidjs/web"],
    alias: {
      "@solidiom/runtime": path.join(packagesDir, "runtime/source/index.ts"),
      "@solidiom/registry": path.resolve(__dirname, "../../registry/index.json"),
    },
  },
})
