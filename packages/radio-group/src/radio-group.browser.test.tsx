/**
 * Browser-mode component tests for RadioGroup primitive.
 *
 * Verifies ARIA radiogroup pattern, keyboard navigation, and selection.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { render } from "@solidjs/web"
import { createConsoleGuard, type ConsoleGuard } from "@solidiom/runtime/testing/console-guard"
import * as RadioGroup from "./index"

// ─── Setup ─────────────────────────────────────────────────────────────────────

let guard: ConsoleGuard

beforeEach(() => {
  guard = createConsoleGuard()
})

afterEach(() => {
  guard.restore()
  const container = document.getElementById("test-root")
  if (container) container.innerHTML = ""
})

function getContainer(): HTMLElement {
  let container = document.getElementById("test-root")
  if (!container) {
    container = document.createElement("div")
    container.id = "test-root"
    document.body.appendChild(container)
  }
  container.innerHTML = ""
  return container
}

// ─── Tests ─────────────────────────────────────────────────────────────────────

describe("RadioGroup", () => {
  it("renders role=radiogroup on root", () => {
    const container = getContainer()
    render(
      () => (
        <RadioGroup.Root>
          <RadioGroup.Item value="a">A</RadioGroup.Item>
          <RadioGroup.Item value="b">B</RadioGroup.Item>
        </RadioGroup.Root>
      ),
      container,
    )

    const root = container.querySelector("[role='radiogroup']")
    expect(root).not.toBeNull()
    expect(root!.getAttribute("data-scope")).toBe("radio-group")
    expect(root!.getAttribute("data-part")).toBe("root")
  })

  it("renders items with role=radio", () => {
    const container = getContainer()
    render(
      () => (
        <RadioGroup.Root>
          <RadioGroup.Item value="a">A</RadioGroup.Item>
          <RadioGroup.Item value="b">B</RadioGroup.Item>
        </RadioGroup.Root>
      ),
      container,
    )

    const items = container.querySelectorAll("[role='radio']")
    expect(items.length).toBe(2)
  })

  it("selects item on click and updates aria-checked", () => {
    const container = getContainer()
    const onChange = vi.fn()
    render(
      () => (
        <RadioGroup.Root onValueChange={onChange}>
          <RadioGroup.Item value="a">A</RadioGroup.Item>
          <RadioGroup.Item value="b">B</RadioGroup.Item>
        </RadioGroup.Root>
      ),
      container,
    )

    const items = container.querySelectorAll<HTMLElement>("[role='radio']")
    items[1]!.click()

    expect(onChange).toHaveBeenCalledWith("b")
    expect(items[1]!.getAttribute("aria-checked")).toBe("true")
    expect(items[0]!.getAttribute("aria-checked")).toBe("false")
  })

  it("applies defaultValue on initial render", () => {
    const container = getContainer()
    render(
      () => (
        <RadioGroup.Root defaultValue="b">
          <RadioGroup.Item value="a">A</RadioGroup.Item>
          <RadioGroup.Item value="b">B</RadioGroup.Item>
        </RadioGroup.Root>
      ),
      container,
    )

    const items = container.querySelectorAll<HTMLElement>("[role='radio']")
    expect(items[0]!.getAttribute("aria-checked")).toBe("false")
    expect(items[1]!.getAttribute("aria-checked")).toBe("true")
  })

  it("sets data-state=checked on selected item", () => {
    const container = getContainer()
    render(
      () => (
        <RadioGroup.Root defaultValue="a">
          <RadioGroup.Item value="a">A</RadioGroup.Item>
          <RadioGroup.Item value="b">B</RadioGroup.Item>
        </RadioGroup.Root>
      ),
      container,
    )

    const items = container.querySelectorAll<HTMLElement>("[role='radio']")
    expect(items[0]!.getAttribute("data-state")).toBe("checked")
    expect(items[1]!.getAttribute("data-state")).toBe("unchecked")
  })

  it("disables items when root is disabled", () => {
    const container = getContainer()
    render(
      () => (
        <RadioGroup.Root disabled>
          <RadioGroup.Item value="a">A</RadioGroup.Item>
        </RadioGroup.Root>
      ),
      container,
    )

    const item = container.querySelector("[role='radio']")!
    expect(item.getAttribute("aria-disabled")).toBe("true")
    expect(item.hasAttribute("data-disabled")).toBe(true)
  })

  it("disables individual items", () => {
    const container = getContainer()
    render(
      () => (
        <RadioGroup.Root>
          <RadioGroup.Item value="a">A</RadioGroup.Item>
          <RadioGroup.Item value="b" disabled>
            B
          </RadioGroup.Item>
        </RadioGroup.Root>
      ),
      container,
    )

    const items = container.querySelectorAll<HTMLElement>("[role='radio']")
    expect(items[0]!.getAttribute("aria-disabled")).toBeNull()
    expect(items[1]!.getAttribute("aria-disabled")).toBe("true")
  })

  it("navigates with ArrowDown in vertical orientation", () => {
    const container = getContainer()
    const onChange = vi.fn()
    render(
      () => (
        <RadioGroup.Root onValueChange={onChange} orientation="vertical">
          <RadioGroup.Item value="a">A</RadioGroup.Item>
          <RadioGroup.Item value="b">B</RadioGroup.Item>
          <RadioGroup.Item value="c">C</RadioGroup.Item>
        </RadioGroup.Root>
      ),
      container,
    )

    const items = container.querySelectorAll<HTMLElement>("[role='radio']")
    items[0]!.focus()
    const group = container.querySelector("[role='radiogroup']")!
    group.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }))

    expect(onChange).toHaveBeenCalledWith("b")
  })

  it("wraps around at the end with ArrowDown", () => {
    const container = getContainer()
    const onChange = vi.fn()
    render(
      () => (
        <RadioGroup.Root defaultValue="c" onValueChange={onChange}>
          <RadioGroup.Item value="a">A</RadioGroup.Item>
          <RadioGroup.Item value="b">B</RadioGroup.Item>
          <RadioGroup.Item value="c">C</RadioGroup.Item>
        </RadioGroup.Root>
      ),
      container,
    )

    const items = container.querySelectorAll<HTMLElement>("[role='radio']")
    items[2]!.focus()
    const group = container.querySelector("[role='radiogroup']")!
    group.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }))

    expect(onChange).toHaveBeenCalledWith("a")
  })

  it("sets aria-orientation on the group", () => {
    const container = getContainer()
    render(
      () => (
        <RadioGroup.Root orientation="horizontal">
          <RadioGroup.Item value="a">A</RadioGroup.Item>
        </RadioGroup.Root>
      ),
      container,
    )

    const group = container.querySelector("[role='radiogroup']")!
    expect(group.getAttribute("aria-orientation")).toBe("horizontal")
    expect(group.getAttribute("data-orientation")).toBe("horizontal")
  })

  it("forwards class prop on root and items", () => {
    const container = getContainer()
    render(
      () => (
        <RadioGroup.Root class="group-cls">
          <RadioGroup.Item value="a" class="item-cls">
            A
          </RadioGroup.Item>
        </RadioGroup.Root>
      ),
      container,
    )

    const group = container.querySelector("[role='radiogroup']")!
    const item = container.querySelector("[role='radio']")!
    expect(group.className).toBe("group-cls")
    expect(item.className).toBe("item-cls")
  })

  it("produces no console errors on render", () => {
    const container = getContainer()
    render(
      () => (
        <RadioGroup.Root>
          <RadioGroup.Item value="a">A</RadioGroup.Item>
        </RadioGroup.Root>
      ),
      container,
    )
    guard.assertClean()
  })
})
