/**
 * Rule: no-forbidden-primitive-props
 *
 * Reports when a consumer sets a prop the primitive manages internally.
 * E.g. setting `role` on `Dialog.Content` or `aria-expanded` on `Menu.Trigger`.
 *
 * These props are managed by the primitive's internals and should not be
 * overridden by consumers.
 */

import { ANATOMY_REGISTRY } from "../anatomy-registry"

const rule = {
  meta: {
    type: "problem" as const,
    docs: {
      description: "Disallow setting props that are internally managed by a primitive part",
    },
    messages: {
      forbidden:
        "Do not set '{{prop}}' on {{primitive}}.{{part}} — this prop is managed internally by the {{primitive}} primitive.",
    },
    schema: [],
  },
  create(context: any) {
    return {
      JSXOpeningElement(node: any) {
        const elementName = getJSXElementName(node)
        if (!elementName) return

        const { namespace, member } = parseMemberExpression(elementName)
        if (!namespace || !member) return

        const anatomy = ANATOMY_REGISTRY[namespace]
        if (!anatomy) return

        const forbidden = anatomy.forbiddenProps[member]
        if (!forbidden || forbidden.length === 0) return

        // Check each attribute on this element
        const attributes = node.attributes ?? []
        for (const attr of attributes) {
          if (attr.type !== "JSXAttribute") continue
          const propName: string = attr.name?.name ?? attr.name?.value ?? ""
          if (!propName) continue

          if (forbidden.includes(propName)) {
            context.report({
              node: attr,
              messageId: "forbidden",
              data: {
                prop: propName,
                primitive: namespace,
                part: member,
              },
            })
          }
        }
      },
    }
  },
}

/** Extract the full element name from a JSX node. */
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
