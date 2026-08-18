import { defineConfig } from "tsup";

/**
 * Build for @solidiom/astrojs-solid-next.
 *
 * Unlike the headless primitives (which emit a `source/` copy and expose a
 * `solid` export condition pointing at raw TSX), this package is an Astro
 * integration + renderer consumed by Astro's Vite pipeline. Astro imports its
 * entrypoints at runtime (`/client.js`, `/server.js`), so it ships compiled
 * ESM `dist/` only — no `source/` emission, no `solid` condition.
 *
 * DTS is disabled here (declaration emit is done by `tsc` in the build script)
 * to match the monorepo's TS7-compatible build convention.
 */
export default defineConfig({
  entry: ["src/index.ts", "src/client.ts", "src/server.ts", "src/container-renderer.ts"],
  format: ["esm"],
  dts: false,
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: "dist",
  target: "es2022",
});
