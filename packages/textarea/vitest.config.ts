import { defineConfig } from "vitest/config"
import solid from "vite-plugin-solid"

export default defineConfig({
  plugins: [solid({ extensions: [".tsx"], hot: false })],
  test: {
    include: ["src/textarea.test.tsx"],
    environment: "jsdom",
  },
})
