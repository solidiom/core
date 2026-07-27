/**
 * Rule: require-primitive-parts
 *
 * Reports when a `<Primitive.Root>` subtree is missing a required child part.
 * E.g. `Dialog.Root` without `Dialog.Content`, `Menu.Root` without
 * `Menu.Trigger` + `Menu.Content`.
 *
 * Uses the anatomy registry to determine required parts per primitive.
 */

import { ANATOMY_REGISTRY } from "../anatomy-registry"

const rule = {
  meta: {
    type: "problem" as const,
    docs: {
      description: "Require primitive Root elements to contain all structurally required parts",
    },
    messages: {
      missingPart:
        "{{primitive}}.Root is missing required child part '{{primitive}}.{{part}}'. The {{primitive}} primitive requires: {{requiredParts}}.",
    },
    schema: [],
  },
  create(context: any) {
    const rootStack: Array<{ primitive: string; parts: Set<string>; node: any }> = []

    return {
      JSXOpeningElement(node: any) {
        const elementName = getJSXElementName(node)
        if (!elementName) return

        const { namespace, member } = parseMemberExpression(elementName)
        if (!namespace || !member) return

        if (member === "Root" && ANATOMY_REGISTRY[namespace]) {
          rootStack.push({ primitive: namespace, parts: new Set(), node })
        }

        const currentRoot = rootStack.at(-1)
        if (currentRoot && namespace === currentRoot.primitive && member !== "Root") {
          currentRoot.parts.add(member)
        }
      },

      JSXClosingElement(node: any) {
        const elementName = getJSXElementName(node)
        if (!elementName) return

        const { namespace, member } = parseMemberExpression(elementName)
        if (!namespace || !member || member !== "Root") return

        const currentRoot = rootStack.at(-1)
        if (!currentRoot || currentRoot.primitive !== namespace) return

        const anatomy = ANATOMY_REGISTRY[namespace]
        if (!anatomy) return

        for (const requiredPart of anatomy.requiredParts) {
          if (!currentRoot.parts.has(requiredPart)) {
            context.report({
              node: currentRoot.node,
              messageId: "missingPart",
              data: {
                primitive: namespace,
                part: requiredPart,
                requiredParts: anatomy.requiredParts.join(", "),
              },
            })
          }
        }
        rootStack.pop()
      },
    }
  },
}

/** Extract the full element name string from a JSXOpeningElement or JSXClosingElement. */
function getJSXElementName(node: any): string | undefined {
  if (!node.name) return undefined
  if (node.name.type === "JSXMemberExpression") {
    const obj = node.name.object?.name
    const prop = node.name.property?.name
    if (obj && prop) return `${obj}.${prop}`
  }
  if (node.name.type === "JSXIdentifier" || typeof node.name.name === "string") {
    return node.name.name
  }
  return undefined
}

/** Parse "Namespace.Member" from a dot-separated name. */
function parseMemberExpression(name: string): { namespace: string | undefined; member: string | undefined } {
  const parts = name.split(".")
  if (parts.length === 2) {
    return { namespace: parts[0], member: parts[1] }
  }
  return { namespace: undefined, member: undefined }
}

export default rule
