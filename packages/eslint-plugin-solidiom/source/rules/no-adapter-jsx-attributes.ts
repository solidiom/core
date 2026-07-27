/**
 * Rule: no-adapter-jsx-attributes
 *
 * Adapters must not emit public semantic attributes (data-scope, data-part,
 * data-state, role, aria-*) or class/className. These are primitive-only concerns.
 *
 * Only enforced inside adapter packages.
 */

import { inferLayerFromPath } from "../utils"

/** Attributes that adapters are forbidden from setting in JSX. */
const FORBIDDEN_ATTRS = [
  "data-scope",
  "data-part",
  "data-state",
  "data-disabled",
  "data-readonly",
  "data-required",
  "data-invalid",
  "data-placeholder",
  "data-highlighted",
  "data-selected",
  "data-orientation",
  "role",
  "class",
  "className",
]

/** Prefixes that are forbidden on adapters. */
const FORBIDDEN_PREFIXES = ["aria-", "data-"]

const rule = {
  meta: {
    type: "problem" as const,
    docs: {
      description: "Disallow adapters from emitting semantic attributes, ARIA, roles, or classes",
    },
    messages: {
      forbidden:
        "Adapter packages must not set '{{attr}}' — semantic attributes, ARIA, roles, and classes are primitive-only concerns.",
    },
    schema: [],
  },
  create(context: any) {
    const filePath = context.filename ?? context.getFilename()
    const layer = inferLayerFromPath(filePath)

    // Only enforce inside adapter packages
    if (layer !== "layer:adapter") return {}

    return {
      JSXAttribute(node: any) {
        const name: string = node.name?.name ?? node.name?.value ?? ""
        if (!name) return

        if (FORBIDDEN_ATTRS.includes(name)) {
          context.report({ node, messageId: "forbidden", data: { attr: name } })
          return
        }

        if (FORBIDDEN_PREFIXES.some((prefix) => name.startsWith(prefix))) {
          context.report({ node, messageId: "forbidden", data: { attr: name } })
        }
      },
    }
  },
}

export default rule
