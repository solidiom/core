import { defineConfig } from "vite"
import solidPlugin from "vite-plugin-solid"
import { resolve } from "node:path"
import { copySourcePlugin } from "../../tools/build/vite.lib.config.ts"

export default defineConfig({
  plugins: [solidPlugin(), copySourcePlugin()],
  build: {
    lib: {
      entry: resolve(import.meta.dirname, "src/index.tsx"),
      formats: ["es"],
      fileName: "index",
    },
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      external: [/^solid-js/, /^@solidiom\//],
    },
  },
})
