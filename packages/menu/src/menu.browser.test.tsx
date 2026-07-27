/**
 * Browser-mode component tests for Menu primitive.
 *
 * Verifies sub-menus, checkbox items, radio items, and core menu behavior.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { render } from "@solidjs/web"
import { flush } from "solid-js"
import { createConsoleGuard, type ConsoleGuard } from "@solidiom/runtime/testing/console-guard"
import * as Menu from "./index"

let guard: ConsoleGuard

beforeEach(() => {
  guard = createConsoleGuard()
})
afterEach(() => {
  guard.restore()
  const c = document.getElementById("test-root")
  if (c) c.innerHTML = ""
})

function getContainer(): HTMLElement {
  let c = document.getElementById("test-root")
  if (!c) {
    c = document.createElement("div")
    c.id = "test-root"
    document.body.appendChild(c)
  }
  c.innerHTML = ""
  return c
}

describe("Menu", () => {
  it("renders trigger with aria-haspopup=menu", () => {
    const container = getContainer()
    render(
      () => (
        <Menu.Root>
          <Menu.Trigger>Open</Menu.Trigger>
          <Menu.Content>
            <Menu.Item>Action</Menu.Item>
          </Menu.Content>
        </Menu.Root>
      ),
      container,
    )

    const trigger = container.querySelector("[data-scope='menu'][data-part='trigger']")!
    expect(trigger.getAttribute("aria-haspopup")).toBe("menu")
  })

  it("opens content on trigger click", () => {
    const container = getContainer()
    render(
      () => (
        <Menu.Root>
          <Menu.Trigger>Open</Menu.Trigger>
          <Menu.Content>
            <Menu.Item>Action</Menu.Item>
          </Menu.Content>
        </Menu.Root>
      ),
      container,
    )

    const trigger = container.querySelector("[data-part='trigger']") as HTMLElement
    trigger.click()
    flush()

    const content = container.querySelector("[role='menu']")
    expect(content).not.toBeNull()
  })

  it("renders items with role=menuitem", () => {
    const container = getContainer()
    render(
      () => (
        <Menu.Root defaultOpen>
          <Menu.Trigger>Open</Menu.Trigger>
          <Menu.Content>
            <Menu.Item>Cut</Menu.Item>
            <Menu.Item>Copy</Menu.Item>
          </Menu.Content>
        </Menu.Root>
      ),
      container,
    )

    const items = container.querySelectorAll("[role='menuitem']")
    expect(items.length).toBe(2)
  })

  it("renders separator with role=separator", () => {
    const container = getContainer()
    render(
      () => (
        <Menu.Root defaultOpen>
          <Menu.Trigger>Open</Menu.Trigger>
          <Menu.Content>
            <Menu.Item>Cut</Menu.Item>
            <Menu.Separator />
            <Menu.Item>Delete</Menu.Item>
          </Menu.Content>
        </Menu.Root>
      ),
      container,
    )

    const sep = container.querySelector("[role='separator']")
    expect(sep).not.toBeNull()
    expect(sep!.getAttribute("data-scope")).toBe("menu")
    expect(sep!.getAttribute("data-part")).toBe("separator")
  })
})

describe("Menu.CheckboxItem", () => {
  it("renders role=menuitemcheckbox with aria-checked", () => {
    const container = getContainer()
    render(
      () => (
        <Menu.Root defaultOpen>
          <Menu.Trigger>Open</Menu.Trigger>
          <Menu.Content>
            <Menu.CheckboxItem checked={true}>Show Toolbar</Menu.CheckboxItem>
            <Menu.CheckboxItem checked={false}>Show Sidebar</Menu.CheckboxItem>
          </Menu.Content>
        </Menu.Root>
      ),
      container,
    )

    const items = container.querySelectorAll("[role='menuitemcheckbox']")
    expect(items.length).toBe(2)
    expect(items[0]!.getAttribute("aria-checked")).toBe("true")
    expect(items[1]!.getAttribute("aria-checked")).toBe("false")
  })

  it("calls onCheckedChange on click", () => {
    const container = getContainer()
    const onChange = vi.fn()
    render(
      () => (
        <Menu.Root defaultOpen>
          <Menu.Trigger>Open</Menu.Trigger>
          <Menu.Content>
            <Menu.CheckboxItem checked={false} onCheckedChange={onChange}>
              Toggle
            </Menu.CheckboxItem>
          </Menu.Content>
        </Menu.Root>
      ),
      container,
    )

    const item = container.querySelector("[role='menuitemcheckbox']") as HTMLElement
    item.click()
    flush()
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it("applies semantic data attributes", () => {
    const container = getContainer()
    render(
      () => (
        <Menu.Root defaultOpen>
          <Menu.Trigger>Open</Menu.Trigger>
          <Menu.Content>
            <Menu.CheckboxItem checked={true}>Item</Menu.CheckboxItem>
          </Menu.Content>
        </Menu.Root>
      ),
      container,
    )

    const item = container.querySelector("[role='menuitemcheckbox']")!
    expect(item.getAttribute("data-scope")).toBe("menu")
    expect(item.getAttribute("data-part")).toBe("checkbox-item")
    expect(item.getAttribute("data-state")).toBe("checked")
  })
})

describe("Menu.RadioGroup + Menu.RadioItem", () => {
  it("renders radio items with role=menuitemradio", () => {
    const container = getContainer()
    render(
      () => (
        <Menu.Root defaultOpen>
          <Menu.Trigger>Open</Menu.Trigger>
          <Menu.Content>
            <Menu.RadioGroup value="a">
              <Menu.RadioItem value="a">Option A</Menu.RadioItem>
              <Menu.RadioItem value="b">Option B</Menu.RadioItem>
            </Menu.RadioGroup>
          </Menu.Content>
        </Menu.Root>
      ),
      container,
    )

    const items = container.querySelectorAll("[role='menuitemradio']")
    expect(items.length).toBe(2)
    expect(items[0]!.getAttribute("aria-checked")).toBe("true")
    expect(items[1]!.getAttribute("aria-checked")).toBe("false")
  })

  it("calls onValueChange on radio item click", () => {
    const container = getContainer()
    const onChange = vi.fn()
    render(
      () => (
        <Menu.Root defaultOpen>
          <Menu.Trigger>Open</Menu.Trigger>
          <Menu.Content>
            <Menu.RadioGroup value="a" onValueChange={onChange}>
              <Menu.RadioItem value="a">A</Menu.RadioItem>
              <Menu.RadioItem value="b">B</Menu.RadioItem>
            </Menu.RadioGroup>
          </Menu.Content>
        </Menu.Root>
      ),
      container,
    )

    const items = container.querySelectorAll<HTMLElement>("[role='menuitemradio']")
    items[1]!.click()
    flush()
    expect(onChange).toHaveBeenCalledWith("b")
  })

  it("renders radio group with role=group", () => {
    const container = getContainer()
    render(
      () => (
        <Menu.Root defaultOpen>
          <Menu.Trigger>Open</Menu.Trigger>
          <Menu.Content>
            <Menu.RadioGroup value="a">
              <Menu.RadioItem value="a">A</Menu.RadioItem>
            </Menu.RadioGroup>
          </Menu.Content>
        </Menu.Root>
      ),
      container,
    )

    const group = container.querySelector("[role='group'][data-part='radio-group']")
    expect(group).not.toBeNull()
  })
})

describe("Menu.Sub", () => {
  it("renders sub-trigger with aria-haspopup=menu", () => {
    const container = getContainer()
    render(
      () => (
        <Menu.Root defaultOpen>
          <Menu.Trigger>Open</Menu.Trigger>
          <Menu.Content>
            <Menu.Sub>
              <Menu.SubTrigger>More</Menu.SubTrigger>
              <Menu.SubContent>
                <Menu.Item>Sub Item</Menu.Item>
              </Menu.SubContent>
            </Menu.Sub>
          </Menu.Content>
        </Menu.Root>
      ),
      container,
    )

    const subTrigger = container.querySelector("[data-part='sub-trigger']")!
    expect(subTrigger.getAttribute("aria-haspopup")).toBe("menu")
    expect(subTrigger.getAttribute("role")).toBe("menuitem")
  })

  it("does not render sub-content by default", () => {
    const container = getContainer()
    render(
      () => (
        <Menu.Root defaultOpen>
          <Menu.Trigger>Open</Menu.Trigger>
          <Menu.Content>
            <Menu.Sub>
              <Menu.SubTrigger>More</Menu.SubTrigger>
              <Menu.SubContent>
                <Menu.Item>Sub Item</Menu.Item>
              </Menu.SubContent>
            </Menu.Sub>
          </Menu.Content>
        </Menu.Root>
      ),
      container,
    )

    const subContent = container.querySelector("[data-part='sub-content']")
    expect(subContent).toBeNull()
  })
})

describe("Menu.Label", () => {
  it("renders non-interactive label", () => {
    const container = getContainer()
    render(
      () => (
        <Menu.Root defaultOpen>
          <Menu.Trigger>Open</Menu.Trigger>
          <Menu.Content>
            <Menu.Label>Actions</Menu.Label>
            <Menu.Item>Cut</Menu.Item>
          </Menu.Content>
        </Menu.Root>
      ),
      container,
    )

    const label = container.querySelector("[data-part='label']")!
    expect(label).not.toBeNull()
    expect(label.textContent).toBe("Actions")
    expect(label.getAttribute("data-scope")).toBe("menu")
  })
})

describe("Menu - no console errors", () => {
  it("produces no console errors on render", () => {
    const container = getContainer()
    render(
      () => (
        <Menu.Root>
          <Menu.Trigger>Open</Menu.Trigger>
          <Menu.Content>
            <Menu.Item>Action</Menu.Item>
          </Menu.Content>
        </Menu.Root>
      ),
      container,
    )
    guard.assertClean()
  })
})
