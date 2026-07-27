/**
 * Rule: require-accessible-name (warning severity)
 *
 * Reports when a part that needs an accessible name has neither its label
 * part sibling nor an explicit `aria-label`/`aria-labelledby`.
 */

import { ANATOMY_REGISTRY } from "../anatomy-registry"

/** Parts that serve as accessible name providers for their sibling. */
const LABEL_PARTS: Record<string, string[]> = {
  Dialog: ["Title", "Label"],
  Menu: ["Label"],
  Combobox: ["Label"],
  Listbox: ["Label"],
  Tabs: ["Label"],
}

interface RootScope {
  primitive: string
  node: any
  partsWithAriaName: Set<string>
  labelPartsFound: Set<string>
  allParts: Set<string>
}

const rule = {
  meta: {
    type: "suggestion" as const,
    docs: {
      description:
        "Warn when a primitive part that needs an accessible name lacks both a label part and aria-label/aria-labelledby",
    },
    messages: {
      missingAccessibleName:
        "{{primitive}}.{{part}} requires an accessible name. Add a label part ({{labelParts}}) as a sibling or provide aria-label/aria-labelledby.",
    },
    schema: [],
  },
  create(context: any) {
    const fileState: { rootScopes: RootScope[] } = { rootScopes: [] }

    return {
      JSXOpeningElement(node: any) {
        const elementName = getJSXElementName(node)
        if (!elementName) return

        const { namespace, member } = parseMemberExpression(elementName)
        if (!namespace || !member) return

        const anatomy = ANATOMY_REGISTRY[namespace]
        if (!anatomy) return

        if (member === "Root") {
          fileState.rootScopes.push({
            primitive: namespace,
            node,
            partsWithAriaName: new Set(),
            labelPartsFound: new Set(),
            allParts: new Set(),
          })
          return
        }

        const currentScopeIndex = findLastIndex(
          fileState.rootScopes,
          (scope) => scope.primitive === namespace,
        )
        const currentScope =
          currentScopeIndex === -1 ? undefined : fileState.rootScopes[currentScopeIndex]
        if (!currentScope) return

        currentScope.allParts.add(member)
        const attrs = getJSXAttributes(node)
        if (attrs.includes("aria-label") || attrs.includes("aria-labelledby")) {
          currentScope.partsWithAriaName.add(member)
        }

        const primitiveLabelParts = LABEL_PARTS[namespace] ?? []
        if (primitiveLabelParts.includes(member)) {
          currentScope.labelPartsFound.add(member)
        }
      },

      JSXClosingElement(node: any) {
        const elementName = getJSXElementName(node)
        if (!elementName) return

        const { namespace, member } = parseMemberExpression(elementName)
        if (!namespace || member !== "Root") return

        const scopeIdx = findLastIndex(
          fileState.rootScopes,
          (scope) => scope.primitive === namespace,
        )
        if (scopeIdx === -1) return

        const scope = fileState.rootScopes[scopeIdx]
        const anatomy = ANATOMY_REGISTRY[namespace]
        if (!scope || !anatomy) return

        for (const part of anatomy.accessibleNameParts) {
          if (!scope.allParts.has(part)) continue

          const hasAriaName = scope.partsWithAriaName.has(part)
          const hasLabelPart = scope.labelPartsFound.size > 0

          if (!hasAriaName && !hasLabelPart) {
            const labelParts = LABEL_PARTS[namespace] ?? ["Label"]
            context.report({
              node: scope.node,
              messageId: "missingAccessibleName",
              data: {
                primitive: namespace,
                part,
                labelParts: labelParts.map((label) => `${namespace}.${label}`).join(" or "),
              },
            })
          }
        }

        fileState.rootScopes.splice(scopeIdx, 1)
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

/** Extract attribute names from a JSXOpeningElement. */
function getJSXAttributes(node: any): string[] {
  if (!node.attributes) return []
  return node.attributes
    .filter((attr: any) => attr.type === "JSXAttribute")
    .map((attr: any) => attr.name?.name ?? attr.name?.value ?? "")
    .filter(Boolean)
}

/** Array.findLastIndex polyfill for older runtimes. */
function findLastIndex<T>(arr: T[], predicate: (item: T) => boolean): number {
  for (let i = arr.length - 1; i >= 0; i--) {
    const item = arr[i]
    if (item !== undefined && predicate(item)) return i
  }
  return -1
}

export default rule
