import { existsSync } from "node:fs";
import { join } from "node:path";
import { defineConfig } from "vitest/config";
import solidPlugin from "vite-plugin-solid";
import { playwright } from "@vitest/browser-playwright";

const ROOT = import.meta.dirname ?? __dirname;

/** Resolve workspace packages for root-level browser tests without publishing them first. */
function workspacePackageResolver() {
  return {
    name: "solidiom-workspace-package-resolver",
    resolveId(id: string) {
      if (!id.startsWith("@solidiom/")) return undefined;

      const packageName = id.slice("@solidiom/".length);
      for (const extension of [".tsx", ".ts"]) {
        const candidate = join(
          ROOT,
          "packages",
          packageName,
          "src",
          `index${extension}`,
        );
        if (existsSync(candidate)) return candidate;
      }
      return undefined;
    },
  };
}

/**
 * Dedicated browser configuration for the Phase 1 axe suite.
 *
 * The suite runs in Chromium, matching the CI accessibility job. Its emitted
 * per-primitive outcomes are collected by tools/run-a11y.ts.
 */
export default defineConfig({
  plugins: [workspacePackageResolver(), solidPlugin({ hot: false })],
  optimizeDeps: {
    include: ["axe-core"],
  },
  test: {
    include: ["tests/a11y/**/*.browser.{test,spec}.{ts,tsx}"],
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: "chromium" }],
    },
  },
});
