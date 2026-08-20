import { existsSync } from "node:fs"
import { join } from "node:path"
import { defineConfig } from "vitest/config"
import solidPlugin from "vite-plugin-solid"
import { playwright } from "@vitest/browser-playwright"

const ROOT = import.meta.dirname

/** Resolve workspace packages for root-level browser tests without publishing them first. */
function workspacePackageResolver() {
  return {
    name: "solidiom-workspace-package-resolver",
    resolveId(id: string) {
      if (!id.startsWith("@solidiom/")) return undefined

      const packageName = id.slice("@solidiom/".length)
      for (const extension of [".tsx", ".ts"]) {
        const candidate = join(ROOT, "packages", packageName, "src", `index${extension}`)
        if (existsSync(candidate)) return candidate
      }
      return undefined
    },
  }
}

/**
 * Dedicated browser configuration for the RECIPE-005 computed-style parity suite.
 *
 * Mirrors vitest.a11y.config.ts's workspace-package resolution — the recipe fixtures
 * import `@solidiom/recipes-{css,tailwind,unocss}` and the primitives they wrap
 * directly from `src/`, not from a built `dist/`, so a definition change is visible
 * to the suite without a build step in between.
 */
export default defineConfig({
  plugins: [workspacePackageResolver(), solidPlugin({ hot: false })],
  test: {
    include: ["tests/recipe-parity/**/*.browser.{test,spec}.{ts,tsx}"],
    globalSetup: ["tests/recipe-parity/globalSetupTailwind.ts"],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: "chromium" }],
    },
  },
})
