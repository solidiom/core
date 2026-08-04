import { defineConfig } from "vitest/config"
import solid from "vite-plugin-solid"

/**
 * Default vitest config — runs node-mode unit tests.
 *
 * For browser-mode component tests, use:
 *   npx vitest run --config vitest.browser.config.ts
 */
export default defineConfig({
  plugins: [solid({ extensions: [".tsx"] })],
  test: {
    include: [
      "packages/**/src/**/*.{test,spec}.ts",
      "src/**/*.{test,spec}.ts",
      "tools/**/*.{test,spec}.ts",
      "apps/site/src/**/*.{test,spec}.ts",
    ],
    exclude: ["**/*.browser.{test,spec}.*", "packages/*/source/**", "**/node_modules/**"],
    environment: "node",
    // Several tools tests drive real generators against the real tree —
    // registry-build.test.ts shells out to registry-build.ts, which hashes
    // packages/*/source, while emit-package-source.test.ts rewrites exactly
    // those files. Run in parallel they race, and the symptom is an
    // intermittent failure in "produces byte-identical output on repeated
    // runs" that looks like a determinism bug rather than a test-isolation
    // one. Serial execution costs a few seconds here and removes a class of
    // flake that is far more expensive to diagnose in CI.
    fileParallelism: false,
  },
})
