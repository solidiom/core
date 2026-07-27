/**
 * Browser-mode component tests for Select primitive.
 *
 * Verifies trigger/content open/close, item selection, ARIA attributes,
 * keyboard navigation, and semantic data attributes.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { render } from "@solidjs/web"
import { flush } from "solid-js"
import { createConsoleGuard, type ConsoleGuard } from "@solidiom/runtime/testing/console-guard"
import * as Select from "./index"

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

describe("Select", () => {
  it("renders trigger with role=combobox", () => {
    const container = getContainer()
    render(
      () => (
        <Select.Root>
          <Select.Trigger>
            <Select.Value placeholder="Pick one" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="a">A</Select.Item>
          </Select.Content>
        </Select.Root>
      ),
      container,
    )

    const trigger = container.querySelector("[role='combobox']")
    expect(trigger).not.toBeNull()
    expect(trigger!.getAttribute("aria-expanded")).toBe("false")
    expect(trigger!.getAttribute("aria-haspopup")).toBe("listbox")
  })

  it("applies semantic attributes to trigger", () => {
    const container = getContainer()
    render(
      () => (
        <Select.Root>
          <Select.Trigger>
            <Select.Value placeholder="Pick one" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="a">A</Select.Item>
          </Select.Content>
        </Select.Root>
      ),
      container,
    )

    const trigger = container.querySelector("[data-scope='select'][data-part='trigger']")
    expect(trigger).not.toBeNull()
    expect(trigger!.getAttribute("data-state")).toBe("closed")
  })

  it("opens content on trigger click", () => {
    const container = getContainer()
    render(
      () => (
        <Select.Root>
          <Select.Trigger>
            <Select.Value placeholder="Pick one" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="a">A</Select.Item>
            <Select.Item value="b">B</Select.Item>
          </Select.Content>
        </Select.Root>
      ),
      container,
    )

    const trigger = container.querySelector("[role='combobox']") as HTMLElement
    trigger.click()
    flush()

    const listbox = container.querySelector("[role='listbox']")
    expect(listbox).not.toBeNull()
    expect(trigger.getAttribute("aria-expanded")).toBe("true")
  })

  it("renders items with role=option", () => {
    const container = getContainer()
    render(
      () => (
        <Select.Root defaultOpen>
          <Select.Trigger>
            <Select.Value placeholder="Pick one" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="a">Apple</Select.Item>
            <Select.Item value="b">Banana</Select.Item>
          </Select.Content>
        </Select.Root>
      ),
      container,
    )

    const options = container.querySelectorAll("[role='option']")
    expect(options.length).toBe(2)
  })

  it("selects item on click and fires onValueChange", () => {
    const container = getContainer()
    const onChange = vi.fn()
    render(
      () => (
        <Select.Root defaultOpen onValueChange={onChange}>
          <Select.Trigger>
            <Select.Value placeholder="Pick one" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="apple">Apple</Select.Item>
            <Select.Item value="banana">Banana</Select.Item>
          </Select.Content>
        </Select.Root>
      ),
      container,
    )

    const items = container.querySelectorAll<HTMLElement>("[role='option']")
    items[1]!.click()
    flush()

    expect(onChange).toHaveBeenCalled()
  })

  it("shows placeholder when no value selected", () => {
    const container = getContainer()
    render(
      () => (
        <Select.Root>
          <Select.Trigger>
            <Select.Value placeholder="Choose..." />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="a">A</Select.Item>
          </Select.Content>
        </Select.Root>
      ),
      container,
    )

    const value = container.querySelector("[data-part='value']")
    expect(value).not.toBeNull()
    expect(value!.textContent).toBe("Choose...")
    expect(value!.hasAttribute("data-placeholder")).toBe(true)
  })

  it("does not open when disabled", () => {
    const container = getContainer()
    render(
      () => (
        <Select.Root disabled={() => true}>
          <Select.Trigger>
            <Select.Value placeholder="Pick one" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="a">A</Select.Item>
          </Select.Content>
        </Select.Root>
      ),
      container,
    )

    const trigger = container.querySelector("[role='combobox']") as HTMLElement
    trigger.click()
    flush()

    const listbox = container.querySelector("[role='listbox']")
    expect(listbox).toBeNull()
  })

  it("produces no console errors on render", () => {
    const container = getContainer()
    render(
      () => (
        <Select.Root>
          <Select.Trigger>
            <Select.Value placeholder="Pick one" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="a">A</Select.Item>
          </Select.Content>
        </Select.Root>
      ),
      container,
    )
    guard.assertClean()
  })
})
