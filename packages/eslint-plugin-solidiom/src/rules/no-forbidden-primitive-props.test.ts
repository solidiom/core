import { describe, it, expect } from "vitest"
import noForbiddenPrimitiveProps from "./no-forbidden-primitive-props"

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

describe("no-forbidden-primitive-props", () => {
  it("reports when setting role on Dialog.Content", () => {
    const errors = runRule(
      noForbiddenPrimitiveProps,
      `<Dialog.Content role="alertdialog">hello</Dialog.Content>`,
    )
    expect(errors).toHaveLength(1)
    expect(errors[0].data.prop).toBe("role")
    expect(errors[0].data.primitive).toBe("Dialog")
    expect(errors[0].data.part).toBe("Content")
  })

  it("reports when setting aria-modal on Dialog.Content", () => {
    const errors = runRule(
      noForbiddenPrimitiveProps,
      `<Dialog.Content aria-modal="true">hello</Dialog.Content>`,
    )
    expect(errors).toHaveLength(1)
    expect(errors[0].data.prop).toBe("aria-modal")
  })

  it("reports when setting aria-expanded on Menu.Trigger", () => {
    const errors = runRule(
      noForbiddenPrimitiveProps,
      `<Menu.Trigger aria-expanded="true">Open</Menu.Trigger>`,
    )
    expect(errors).toHaveLength(1)
    expect(errors[0].data.prop).toBe("aria-expanded")
    expect(errors[0].data.part).toBe("Trigger")
  })

  it("reports when setting aria-haspopup on Menu.Trigger", () => {
    const errors = runRule(
      noForbiddenPrimitiveProps,
      `<Menu.Trigger aria-haspopup="true">Open</Menu.Trigger>`,
    )
    expect(errors).toHaveLength(1)
    expect(errors[0].data.prop).toBe("aria-haspopup")
  })

  it("reports when setting role on Tabs.List", () => {
    const errors = runRule(noForbiddenPrimitiveProps, `<Tabs.List role="tablist" />`)
    expect(errors).toHaveLength(1)
    expect(errors[0].data.prop).toBe("role")
    expect(errors[0].data.part).toBe("List")
  })

  it("reports when setting aria-selected on Tabs.Trigger", () => {
    const errors = runRule(
      noForbiddenPrimitiveProps,
      `<Tabs.Trigger aria-selected="true">Tab 1</Tabs.Trigger>`,
    )
    expect(errors).toHaveLength(1)
    expect(errors[0].data.prop).toBe("aria-selected")
  })

  it("does not report allowed props on Dialog.Content", () => {
    const errors = runRule(
      noForbiddenPrimitiveProps,
      `<Dialog.Content class="my-dialog" aria-label="hello">hello</Dialog.Content>`,
    )
    expect(errors).toHaveLength(0)
  })

  it("does not report for unregistered primitives (Button)", () => {
    const errors = runRule(
      noForbiddenPrimitiveProps,
      `<Button.Root role="link">Click</Button.Root>`,
    )
    expect(errors).toHaveLength(0)
  })

  it("does not report for parts without forbidden props (Menu.Item only has role)", () => {
    const errors = runRule(noForbiddenPrimitiveProps, `<Menu.Item class="item">Action</Menu.Item>`)
    expect(errors).toHaveLength(0)
  })

  it("reports role on Combobox.Input", () => {
    const errors = runRule(noForbiddenPrimitiveProps, `<Combobox.Input role="textbox" />`)
    expect(errors).toHaveLength(1)
    expect(errors[0].data.prop).toBe("role")
    expect(errors[0].data.primitive).toBe("Combobox")
  })
})
