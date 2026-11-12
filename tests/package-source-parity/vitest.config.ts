import { defineConfig } from "vitest/config"
import solidPlugin from "vite-plugin-solid"

export default defineConfig({
  plugins: [solidPlugin({ refresh: false })],
  test: {
    include: ["**/*.test.ts"],
    setupFiles: [],
    environment: "node",
  },
})
