import { defineConfig } from "vitest/config"
import solid from "vite-plugin-solid"

export default defineConfig({
  plugins: [solid({ extensions: [".tsx"], hot: false })],
  resolve: {
    conditions: ["node"],
  },
  test: {
    include: ["src/textarea.ssr.test.tsx"],
    environment: "node",
  },
})
