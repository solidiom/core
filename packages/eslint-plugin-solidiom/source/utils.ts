/**
 * Shared utilities for ESLint rules — layer tag resolution from file paths.
 */

/** Known layer tags from Nx configuration. */
export type LayerTag =
  | "layer:runtime"
  | "layer:primitive"
  | "layer:adapter"
  | "layer:recipe"
  | "layer:migration"
  | "layer:legacy"
  | "layer:tooling"

/** Layer import restrictions: key cannot import from values. */
export const LAYER_RESTRICTIONS: Record<string, string[]> = {
  "layer:runtime": [
    "layer:primitive",
    "layer:adapter",
    "layer:recipe",
    "layer:migration",
    "layer:legacy",
  ],
  "layer:primitive": ["layer:recipe", "layer:migration", "layer:legacy"],
  "layer:adapter": ["layer:primitive", "layer:recipe", "layer:migration", "layer:legacy"],
  "layer:recipe": ["layer:migration", "layer:legacy"],
  "layer:migration": ["layer:legacy"],
}

/** Known external engine packages that only adapters may import. */
export const ENGINE_PACKAGES = [
  "@floating-ui/dom",
  "@floating-ui/core",
  "embla-carousel",
  "@tanstack/virtual-core",
  "@tanstack/table-core",
  "@internationalized/date",
]

/** Infer the layer tag from a file path based on package directory. */
export function inferLayerFromPath(filePath: string): LayerTag | undefined {
  if (filePath.includes("/packages/runtime/")) return "layer:runtime"
  if (filePath.includes("/packages/adapter-")) return "layer:adapter"
  if (filePath.includes("/packages/recipes-")) return "layer:recipe"
  if (filePath.includes("/packages/eslint-plugin-")) return "layer:tooling"
  if (filePath.includes("/packages/cli/")) return "layer:tooling"
  if (filePath.includes("/packages/bench/")) return "layer:tooling"
  if (filePath.includes("/packages/test-doubles/")) return "layer:tooling"
  if (filePath.includes("/migrations/")) return "layer:migration"
  if (filePath.includes("/legacy/")) return "layer:legacy"
  // Default: primitives (packages/dialog, packages/select, etc.)
  if (filePath.includes("/packages/")) return "layer:primitive"
  return undefined
}

/** Infer the layer tag of an import target from its specifier. */
export function inferLayerFromImport(specifier: string): LayerTag | undefined {
  if (specifier.startsWith("@solidiom/runtime")) return "layer:runtime"
  if (specifier.startsWith("@solidiom/adapter-")) return "layer:adapter"
  if (specifier.startsWith("@solidiom/recipes-")) return "layer:recipe"
  if (specifier.startsWith("@solidiom/eslint-plugin")) return "layer:tooling"
  if (specifier.startsWith("@solidiom/cli")) return "layer:tooling"
  if (specifier.startsWith("@solidiom/legacy-")) return "layer:legacy"
  if (specifier.startsWith("@solidiom/")) return "layer:primitive"
  return undefined
}
