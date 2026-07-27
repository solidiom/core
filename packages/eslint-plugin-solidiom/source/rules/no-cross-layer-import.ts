/**
 * Rule: no-cross-layer-import
 *
 * Prevents imports that violate the Solidiom layer hierarchy.
 * E.g. runtime cannot import from primitives; primitives cannot import from recipes.
 */

import { inferLayerFromPath, inferLayerFromImport, LAYER_RESTRICTIONS } from "../utils"

const rule = {
  meta: {
    type: "problem" as const,
    docs: {
      description: "Disallow imports that violate the Solidiom layer hierarchy",
    },
    messages: {
      forbidden:
        "Layer '{{sourceLayer}}' cannot import from '{{targetLayer}}' (import '{{specifier}}').",
    },
    schema: [],
  },
  create(context: any) {
    const filePath = context.filename ?? context.getFilename()
    const sourceLayer = inferLayerFromPath(filePath)
    if (!sourceLayer) return {}

    const restrictions = LAYER_RESTRICTIONS[sourceLayer]
    if (!restrictions) return {}

    return {
      ImportDeclaration(node: any) {
        const specifier = node.source.value as string
        const targetLayer = inferLayerFromImport(specifier)
        if (!targetLayer) return

        if (restrictions.includes(targetLayer)) {
          context.report({
            node: node.source,
            messageId: "forbidden",
            data: { sourceLayer, targetLayer, specifier },
          })
        }
      },
    }
  },
}

export default rule
