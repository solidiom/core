/**
 * Rule: no-adapter-import-of-recipes
 *
 * Adapter packages must never import from recipe packages.
 * Recipes are consumer-facing styling wrappers; adapters are low-level
 * engine integrations that sit below primitives.
 *
 * The layer restriction (adapter → recipe) is already caught by
 * no-cross-layer-import, but Task 28 explicitly requires this as a
 * named, independently testable rule.
 */

import { inferLayerFromPath, inferLayerFromImport } from "../utils"

const rule = {
  meta: {
    type: "problem" as const,
    docs: {
      description: "Disallow adapter packages from importing recipe packages",
    },
    messages: {
      forbidden:
        "Adapter packages cannot import from recipes ('{{specifier}}'). Recipes are consumer-facing; adapters must not depend on them.",
    },
    schema: [],
  },
  create(context: any) {
    const filePath = context.filename ?? context.getFilename()
    const layer = inferLayerFromPath(filePath)

    // Only enforce inside adapter packages
    if (layer !== "layer:adapter") return {}

    return {
      ImportDeclaration(node: any) {
        const specifier = node.source.value as string
        if (inferLayerFromImport(specifier) === "layer:recipe") {
          context.report({ node: node.source, messageId: "forbidden", data: { specifier } })
        }
      },
    }
  },
}

export default rule
