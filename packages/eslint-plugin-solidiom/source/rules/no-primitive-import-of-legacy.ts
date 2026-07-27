/**
 * Rule: no-primitive-import-of-legacy
 *
 * Primitives must never import from legacy facade packages.
 * Legacy facades depend on primitives, not the other way around.
 */

import { inferLayerFromPath, inferLayerFromImport } from "../utils"

const rule = {
  meta: {
    type: "problem" as const,
    docs: { description: "Disallow primitive packages from importing legacy facades" },
    messages: {
      forbidden:
        "Primitive packages cannot import from legacy facades ('{{specifier}}'). Legacy depends on primitives, not vice versa.",
    },
    schema: [],
  },
  create(context: any) {
    const filePath = context.filename ?? context.getFilename()
    const layer = inferLayerFromPath(filePath)
    if (layer !== "layer:primitive") return {}

    return {
      ImportDeclaration(node: any) {
        const specifier = node.source.value as string
        if (inferLayerFromImport(specifier) === "layer:legacy") {
          context.report({ node: node.source, messageId: "forbidden", data: { specifier } })
        }
      },
    }
  },
}

export default rule
