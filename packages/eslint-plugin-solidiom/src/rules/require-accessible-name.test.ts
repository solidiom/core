import { describe, it, expect } from "vitest"
import requireAccessibleName from "./require-accessible-name"

/**
 * Minimal JSX AST simulator for testing the rule.
 */
function runRule(rule: any, jsx: string) {
  const errors: any[] = []
  const context = {
    filename: "/project/apps/site/src/components/example.tsx",
    report(err: any) {
      errors.push(err)
    },
  }
  const visitors = rule.create(context)

  const tagRegex = /<(\/?)([A-Z][a-zA-Z]*\.[A-Z][a-zA-Z]*)([^>]*?)(\/?)\s*>/g
  let match
  while ((match = tagRegex.exec(jsx)) !== null) {
    const isClosing = match[1] === "/"
    const isSelfClosing = match[4] === "/"
    const fullName = match[2]
    if (!fullName) continue
    const attrsStr = match[3] ?? ""

    const [namespace, member] = fullName.split(".")
    const nameNode = {
      type: "JSXMemberExpression",
      object: { name: namespace },
      property: { name: member },
    }

    // Parse attributes
    const attributes: any[] = []
    const attrRegex = /([a-zA-Z-]+)(?:=(?:"[^"]*"|{[^}]*}))?/g
    let attrMatch
    while ((attrMatch = attrRegex.exec(attrsStr)) !== null) {
      attributes.push({
        type: "JSXAttribute",
        name: { name: attrMatch[1] },
      })
    }

    if (!isClosing) {
      visitors.JSXOpeningElement?.({ name: nameNode, attributes })
      if (isSelfClosing) {
        visitors.JSXClosingElement?.({ name: nameNode })
      }
    } else {
      visitors.JSXClosingElement?.({ name: nameNode })
    }
  }
  return errors
}

describe("require-accessible-name", () => {
  it("passes when Dialog.Content has aria-label", () => {
    const errors = runRule(
      requireAccessibleName,
      `<Dialog.Root><Dialog.Content aria-label="My Dialog">hello</Dialog.Content></Dialog.Root>`,
    )
    expect(errors).toHaveLength(0)
  })

  it("passes when Dialog.Content has aria-labelledby", () => {
    const errors = runRule(
      requireAccessibleName,
      `<Dialog.Root><Dialog.Content aria-labelledby="title-id">hello</Dialog.Content></Dialog.Root>`,
    )
    expect(errors).toHaveLength(0)
  })

  it("passes when Dialog has a Title label part", () => {
    const errors = runRule(
      requireAccessibleName,
      `<Dialog.Root><Dialog.Title>My Title</Dialog.Title><Dialog.Content>hello</Dialog.Content></Dialog.Root>`,
    )
    expect(errors).toHaveLength(0)
  })

  it("warns when Dialog.Content has no accessible name", () => {
    const errors = runRule(
      requireAccessibleName,
      `<Dialog.Root><Dialog.Content>hello</Dialog.Content></Dialog.Root>`,
    )
    expect(errors).toHaveLength(1)
    expect(errors[0].data.primitive).toBe("Dialog")
    expect(errors[0].data.part).toBe("Content")
  })

  it("warns when Menu.Content has no accessible name", () => {
    const errors = runRule(
      requireAccessibleName,
      `<Menu.Root><Menu.Trigger>Open</Menu.Trigger><Menu.Content><Menu.Item /></Menu.Content></Menu.Root>`,
    )
    expect(errors).toHaveLength(1)
    expect(errors[0].data.primitive).toBe("Menu")
    expect(errors[0].data.part).toBe("Content")
  })

  it("passes when Menu.Content has aria-label", () => {
    const errors = runRule(
      requireAccessibleName,
      `<Menu.Root><Menu.Trigger>Open</Menu.Trigger><Menu.Content aria-label="Actions"><Menu.Item /></Menu.Content></Menu.Root>`,
    )
    expect(errors).toHaveLength(0)
  })

  it("passes when Menu has a Label part", () => {
    const errors = runRule(
      requireAccessibleName,
      `<Menu.Root><Menu.Label>Actions</Menu.Label><Menu.Trigger>Open</Menu.Trigger><Menu.Content><Menu.Item /></Menu.Content></Menu.Root>`,
    )
    expect(errors).toHaveLength(0)
  })

  it("does not warn for primitives without accessibleNameParts (Popover)", () => {
    const errors = runRule(
      requireAccessibleName,
      `<Popover.Root><Popover.Trigger>Open</Popover.Trigger><Popover.Content>hello</Popover.Content></Popover.Root>`,
    )
    expect(errors).toHaveLength(0)
  })

  it("does not warn if the part requiring a name is not used", () => {
    // Accordion has no accessibleNameParts, so no warning
    const errors = runRule(
      requireAccessibleName,
      `<Accordion.Root><Accordion.Item /></Accordion.Root>`,
    )
    expect(errors).toHaveLength(0)
  })
})
