import { defineConfig } from "vitest/config"
import solid from "vite-plugin-solid"

export default defineConfig({
  plugins: [solid({ extensions: [".tsx"], refresh: false })],
  ssr: {
    // Bundle (do not Node-externalize) the Solid runtime so vite-plugin-solid +
    // the browser export condition pick the client build; vitest 5 externalizes
    // deps by default, which resolves @solidjs/web to its SSR build in jsdom.
    noExternal: ["@solidjs/web", "@solidjs/testing-library", "solid-js"],
  },
  test: {
    include: ["src/textarea.test.tsx"],
    environment: "jsdom",
  },
})
