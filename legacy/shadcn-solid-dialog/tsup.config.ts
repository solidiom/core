import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: false,
  clean: true,
  external: ["solid-js", "@solidjs/web", "@solidiom/dialog", "@solidiom/runtime"],
})
