import { defineConfig, type UserConfig } from "vite"
import solidPlugin from "vite-plugin-solid"
import { resolve } from "node:path"
import { copyFileSync, mkdirSync, readdirSync, statSync } from "node:fs"
import { join } from "node:path"

/**
 * Base Vite library config for JSX packages (primitives, component-shaped recipes, umbrella).
 * Uses vite-plugin-solid for Solid JSX compilation.
 * Dual emission: dist/ compiled ESM + source/ canonical TSX.
 */
export function createViteLibConfig(root: string, overrides: Partial<UserConfig> = {}): UserConfig {
  return defineConfig({
    plugins: [solidPlugin()],
    build: {
      lib: {
        entry: resolve(root, "src/index.tsx"),
        formats: ["es"],
        fileName: "index",
      },
      outDir: "dist",
      sourcemap: true,
      rollupOptions: {
        external: [/^solid-js/, /^@solidiom\//],
      },
      ...overrides.build,
    },
    ...overrides,
  }) as UserConfig
}

/**
 * Vite plugin to copy canonical source to source/ directory after build.
 */
export function copySourcePlugin() {
  return {
    name: "solidiom-copy-source",
    closeBundle() {
      copySourceDir("src", "source")
    },
  }
}

function copySourceDir(srcDir: string, destDir: string) {
  try {
    mkdirSync(destDir, { recursive: true })
    const entries = readdirSync(srcDir)
    for (const entry of entries) {
      const srcPath = join(srcDir, entry)
      const destPath = join(destDir, entry)
      const stat = statSync(srcPath)
      if (stat.isDirectory()) {
        copySourceDir(srcPath, destPath)
      } else {
        copyFileSync(srcPath, destPath)
      }
    }
  } catch {
    // Non-fatal
  }
}
