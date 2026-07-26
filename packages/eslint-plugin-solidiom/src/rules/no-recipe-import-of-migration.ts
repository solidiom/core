/**
 * Rule: no-recipe-import-of-migration
 *
 * Recipe packages must never import from migration packages.
 * Migrations are build-time tools, not runtime dependencies.
 */

import { inferLayerFromPath } from "../utils"

const rule = {
  meta: {
    type: "problem" as const,
    docs: { description: "Disallow recipe packages from importing migration modules" },
    messages: {
      forbidden:
        "Recipe packages cannot import from migrations ('{{specifier}}'). Migrations are build-time only.",
    },
    schema: [],
  },
  create(context: any) {
    const filePath = context.filename ?? context.getFilename()
    const layer = inferLayerFromPath(filePath)
    if (layer !== "layer:recipe") return {}

    return {
      ImportDeclaration(node: any) {
        const specifier = node.source.value as string
        if (specifier.includes("migration") || specifier.startsWith("@solidiom/migration")) {
          context.report({ node: node.source, messageId: "forbidden", data: { specifier } })
        }
      },
    }
  },
}

export default rule
