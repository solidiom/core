import { describe, it, expect } from "vitest"
import requirePrimitiveParts from "./require-primitive-parts"

/**
 * Minimal JSX AST simulator for testing the rule.
 * Simulates JSXOpeningElement and JSXClosingElement visitor calls.
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

  // Parse JSX-like string into open/close events
  // Supports: <Namespace.Member attr="val"> and </Namespace.Member>
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

describe("require-primitive-parts", () => {
  it("passes when Dialog.Root contains Dialog.Content", () => {
    const errors = runRule(
      requirePrimitiveParts,
      `<Dialog.Root><Dialog.Content>hello</Dialog.Content></Dialog.Root>`,
    )
    expect(errors).toHaveLength(0)
  })

  it("fails when Dialog.Root is missing Dialog.Content", () => {
    const errors = runRule(
      requirePrimitiveParts,
      `<Dialog.Root><Dialog.Trigger>Open</Dialog.Trigger></Dialog.Root>`,
    )
    expect(errors).toHaveLength(1)
    expect(errors[0].data.primitive).toBe("Dialog")
    expect(errors[0].data.part).toBe("Content")
  })

  it("fails when Menu.Root is missing Trigger", () => {
    const errors = runRule(
      requirePrimitiveParts,
      `<Menu.Root><Menu.Content><Menu.Item /></Menu.Content></Menu.Root>`,
    )
    expect(errors).toHaveLength(1)
    expect(errors[0].data.part).toBe("Trigger")
  })

  it("fails when Menu.Root is missing Content", () => {
    const errors = runRule(
      requirePrimitiveParts,
      `<Menu.Root><Menu.Trigger>Open</Menu.Trigger></Menu.Root>`,
    )
    expect(errors).toHaveLength(1)
    expect(errors[0].data.part).toBe("Content")
  })

  it("passes when Menu.Root has both Trigger and Content", () => {
    const errors = runRule(
      requirePrimitiveParts,
      `<Menu.Root><Menu.Trigger>Open</Menu.Trigger><Menu.Content><Menu.Item /></Menu.Content></Menu.Root>`,
    )
    expect(errors).toHaveLength(0)
  })

  it("passes when Tabs.Root has List and Content", () => {
    const errors = runRule(
      requirePrimitiveParts,
      `<Tabs.Root><Tabs.List><Tabs.Trigger>Tab 1</Tabs.Trigger></Tabs.List><Tabs.Content>Panel</Tabs.Content></Tabs.Root>`,
    )
    expect(errors).toHaveLength(0)
  })

  it("fails when Tabs.Root is missing List", () => {
    const errors = runRule(
      requirePrimitiveParts,
      `<Tabs.Root><Tabs.Content>Panel</Tabs.Content></Tabs.Root>`,
    )
    expect(errors).toHaveLength(1)
    expect(errors[0].data.part).toBe("List")
  })

  it("does not report for leaf primitives (Button)", () => {
    const errors = runRule(requirePrimitiveParts, `<Button.Root>Click</Button.Root>`)
    expect(errors).toHaveLength(0)
  })

  it("passes when Accordion.Root has Item", () => {
    const errors = runRule(
      requirePrimitiveParts,
      `<Accordion.Root><Accordion.Item><Accordion.Trigger>Q</Accordion.Trigger><Accordion.Content>A</Accordion.Content></Accordion.Item></Accordion.Root>`,
    )
    expect(errors).toHaveLength(0)
  })

  it("fails when Combobox.Root is missing Input and Content", () => {
    const errors = runRule(requirePrimitiveParts, `<Combobox.Root></Combobox.Root>`)
    expect(errors).toHaveLength(2)
    const parts = errors.map((e: any) => e.data.part).sort()
    expect(parts).toEqual(["Content", "Input"])
  })
})
