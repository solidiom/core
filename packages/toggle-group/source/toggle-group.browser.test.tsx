/**
 * Browser-mode component tests for ToggleGroup primitive.
 *
 * Verifies selection modes, ARIA attributes, and semantic data attributes.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { render } from "@solidjs/web"
import { flush } from "solid-js"
import { createConsoleGuard, type ConsoleGuard } from "@solidiom/runtime/testing/console-guard"
import * as ToggleGroup from "./index"

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

describe("ToggleGroup", () => {
  it("renders role=group on root", () => {
    const container = getContainer()
    render(
      () => (
        <ToggleGroup.Root>
          <ToggleGroup.Item value="a">A</ToggleGroup.Item>
          <ToggleGroup.Item value="b">B</ToggleGroup.Item>
        </ToggleGroup.Root>
      ),
      container,
    )

    const root = container.querySelector("[role='group']")
    expect(root).not.toBeNull()
  })

  it("applies semantic data attributes", () => {
    const container = getContainer()
    render(
      () => (
        <ToggleGroup.Root>
          <ToggleGroup.Item value="a">A</ToggleGroup.Item>
        </ToggleGroup.Root>
      ),
      container,
    )

    const root = container.querySelector("[role='group']")!
    expect(root.getAttribute("data-scope")).toBe("toggle-group")
    expect(root.getAttribute("data-part")).toBe("root")

    const item = container.querySelector("button")!
    expect(item.getAttribute("data-scope")).toBe("toggle-group")
    expect(item.getAttribute("data-part")).toBe("item")
    expect(item.getAttribute("data-state")).toBe("off")
  })

  it("single mode - selecting one deselects others", () => {
    const container = getContainer()
    render(
      () => (
        <ToggleGroup.Root type="single" defaultValue={["a"]}>
          <ToggleGroup.Item value="a">A</ToggleGroup.Item>
          <ToggleGroup.Item value="b">B</ToggleGroup.Item>
        </ToggleGroup.Root>
      ),
      container,
    )

    const items = container.querySelectorAll<HTMLElement>("button")
    expect(items[0]!.getAttribute("aria-pressed")).toBe("true")

    items[1]!.click()
    flush()

    expect(items[0]!.getAttribute("aria-pressed")).toBe("false")
    expect(items[1]!.getAttribute("aria-pressed")).toBe("true")
  })

  it("single mode - clicking selected item deselects it", () => {
    const container = getContainer()
    render(
      () => (
        <ToggleGroup.Root type="single" defaultValue={["a"]}>
          <ToggleGroup.Item value="a">A</ToggleGroup.Item>
          <ToggleGroup.Item value="b">B</ToggleGroup.Item>
        </ToggleGroup.Root>
      ),
      container,
    )

    const items = container.querySelectorAll<HTMLElement>("button")
    items[0]!.click()
    flush()

    expect(items[0]!.getAttribute("aria-pressed")).toBe("false")
    expect(items[1]!.getAttribute("aria-pressed")).toBe("false")
  })

  it("multiple mode - can select multiple items", () => {
    const container = getContainer()
    render(
      () => (
        <ToggleGroup.Root type="multiple">
          <ToggleGroup.Item value="a">A</ToggleGroup.Item>
          <ToggleGroup.Item value="b">B</ToggleGroup.Item>
          <ToggleGroup.Item value="c">C</ToggleGroup.Item>
        </ToggleGroup.Root>
      ),
      container,
    )

    const items = container.querySelectorAll<HTMLElement>("button")
    items[0]!.click()
    flush()
    items[2]!.click()
    flush()

    expect(items[0]!.getAttribute("aria-pressed")).toBe("true")
    expect(items[1]!.getAttribute("aria-pressed")).toBe("false")
    expect(items[2]!.getAttribute("aria-pressed")).toBe("true")
  })

  it("items show aria-pressed state", () => {
    const container = getContainer()
    render(
      () => (
        <ToggleGroup.Root defaultValue={["b"]}>
          <ToggleGroup.Item value="a">A</ToggleGroup.Item>
          <ToggleGroup.Item value="b">B</ToggleGroup.Item>
        </ToggleGroup.Root>
      ),
      container,
    )

    const items = container.querySelectorAll<HTMLElement>("button")
    expect(items[0]!.getAttribute("aria-pressed")).toBe("false")
    expect(items[1]!.getAttribute("aria-pressed")).toBe("true")
  })

  it("disabled root disables all items", () => {
    const container = getContainer()
    const onChange = vi.fn()
    render(
      () => (
        <ToggleGroup.Root disabled onValueChange={onChange}>
          <ToggleGroup.Item value="a">A</ToggleGroup.Item>
          <ToggleGroup.Item value="b">B</ToggleGroup.Item>
        </ToggleGroup.Root>
      ),
      container,
    )

    const items = container.querySelectorAll<HTMLElement>("button")
    expect(items[0]!.getAttribute("aria-disabled")).toBe("true")
    expect(items[0]!.hasAttribute("data-disabled")).toBe(true)

    items[0]!.click()
    flush()
    expect(onChange).not.toHaveBeenCalled()
  })

  it("fires onValueChange", () => {
    const container = getContainer()
    const onChange = vi.fn()
    render(
      () => (
        <ToggleGroup.Root onValueChange={onChange}>
          <ToggleGroup.Item value="a">A</ToggleGroup.Item>
          <ToggleGroup.Item value="b">B</ToggleGroup.Item>
        </ToggleGroup.Root>
      ),
      container,
    )

    const items = container.querySelectorAll<HTMLElement>("button")
    items[0]!.click()
    flush()

    expect(onChange).toHaveBeenCalledWith(["a"])
  })

  it("forwards class prop", () => {
    const container = getContainer()
    render(
      () => (
        <ToggleGroup.Root class="group-cls">
          <ToggleGroup.Item value="a" class="item-cls">
            A
          </ToggleGroup.Item>
        </ToggleGroup.Root>
      ),
      container,
    )

    const root = container.querySelector("[role='group']")!
    expect(root.classList.contains("group-cls")).toBe(true)

    const item = container.querySelector("button")!
    expect(item.classList.contains("item-cls")).toBe(true)
  })

  it("produces no console errors", () => {
    const container = getContainer()
    render(
      () => (
        <ToggleGroup.Root>
          <ToggleGroup.Item value="a">A</ToggleGroup.Item>
        </ToggleGroup.Root>
      ),
      container,
    )

    guard.assertNoErrors()
  })
})
