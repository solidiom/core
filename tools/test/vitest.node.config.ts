import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

/**
 * Vitest config for node-mode logic tests.
 * Used by: runtime kernel, CLI, adapters, ESLint plugin, migrations.
 */
export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^solid-js$/,
        replacement: fileURLToPath(
          new URL("../../node_modules/solid-js/dist/solid.js", import.meta.url),
        ),
      },
    ],
  },
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
