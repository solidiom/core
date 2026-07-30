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
  },
})
