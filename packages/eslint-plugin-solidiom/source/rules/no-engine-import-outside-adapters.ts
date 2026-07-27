/**
 * Rule: no-engine-import-outside-adapters
 *
 * External engine packages (e.g. @floating-ui/dom, embla-carousel) may only
 * be imported inside adapter packages. This prevents engine coupling in
 * primitives, runtime, recipes, or other layers.
 */

import { inferLayerFromPath, ENGINE_PACKAGES } from "../utils"

const rule = {
  meta: {
    type: "problem" as const,
    docs: {
      description: "Disallow engine package imports outside of adapter packages",
    },
    messages: {
      forbidden:
        "Engine package '{{specifier}}' may only be imported in adapter packages (current layer: '{{layer}}').",
    },
    schema: [],
  },
  create(context: any) {
    const filePath = context.filename ?? context.getFilename()
    const layer = inferLayerFromPath(filePath)

    // Adapters are allowed to import engines
    if (layer === "layer:adapter") return {}
    // Tooling (test-doubles, bench) may also reference engines for typing
    if (layer === "layer:tooling") return {}

    return {
      ImportDeclaration(node: any) {
        const specifier = node.source.value as string
        const isEngine = ENGINE_PACKAGES.some(
          (pkg) => specifier === pkg || specifier.startsWith(`${pkg}/`),
        )

        if (isEngine) {
          context.report({
            node: node.source,
            messageId: "forbidden",
            data: { specifier, layer: layer ?? "unknown" },
          })
        }
      },
    }
  },
}

export default rule
