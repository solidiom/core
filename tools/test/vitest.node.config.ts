import { defineConfig } from "vitest/config"

/**
 * Vitest config for node-mode logic tests.
 * Used by: runtime kernel, CLI, adapters, ESLint plugin, migrations.
 */
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.{test,spec}.ts"],
    exclude: ["src/**/*.browser.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
  },
})
