/**
 * Browser-mode component tests for Checkbox primitive.
 *
 * Verifies checked/unchecked/indeterminate states, ARIA attributes,
 * click behavior, and semantic data attributes.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { render } from "@solidjs/web"
import { createConsoleGuard, type ConsoleGuard } from "@solidiom/runtime/testing/console-guard"
import * as Checkbox from "./index"

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

describe("Checkbox.Root", () => {
  it("renders a button with role=checkbox", () => {
    const container = getContainer()
    render(
      () => (
        <Checkbox.Root>
          <Checkbox.Indicator>✓</Checkbox.Indicator>
        </Checkbox.Root>
      ),
      container,
    )

    const btn = container.querySelector("[role='checkbox']")
    expect(btn).not.toBeNull()
  })

  it("applies semantic data attributes", () => {
    const container = getContainer()
    render(
      () => (
        <Checkbox.Root>
          <Checkbox.Indicator>✓</Checkbox.Indicator>
        </Checkbox.Root>
      ),
      container,
    )

    const btn = container.querySelector("[role='checkbox']")!
    expect(btn.getAttribute("data-scope")).toBe("checkbox")
    expect(btn.getAttribute("data-part")).toBe("root")
  })

  it("defaults to unchecked state (aria-checked=false)", () => {
    const container = getContainer()
    render(
      () => (
        <Checkbox.Root>
          <Checkbox.Indicator>✓</Checkbox.Indicator>
        </Checkbox.Root>
      ),
      container,
    )

    const btn = container.querySelector("[role='checkbox']")!
    expect(btn.getAttribute("aria-checked")).toBe("false")
    expect(btn.getAttribute("data-state")).toBe("unchecked")
  })

  it("renders checked state with defaultChecked=true", () => {
    const container = getContainer()
    render(
      () => (
        <Checkbox.Root defaultChecked={true}>
          <Checkbox.Indicator>✓</Checkbox.Indicator>
        </Checkbox.Root>
      ),
      container,
    )

    const btn = container.querySelector("[role='checkbox']")!
    expect(btn.getAttribute("aria-checked")).toBe("true")
    expect(btn.getAttribute("data-state")).toBe("checked")
  })

  it("toggles on click", () => {
    const container = getContainer()
    const onChange = vi.fn()
    render(
      () => (
        <Checkbox.Root onCheckedChange={onChange}>
          <Checkbox.Indicator>✓</Checkbox.Indicator>
        </Checkbox.Root>
      ),
      container,
    )

    const btn = container.querySelector("[role='checkbox']") as HTMLElement
    btn.click()
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it("does not toggle when disabled", () => {
    const container = getContainer()
    const onChange = vi.fn()
    render(
      () => (
        <Checkbox.Root disabled onCheckedChange={onChange}>
          <Checkbox.Indicator>✓</Checkbox.Indicator>
        </Checkbox.Root>
      ),
      container,
    )

    const btn = container.querySelector("[role='checkbox']") as HTMLElement
    btn.click()
    expect(onChange).not.toHaveBeenCalled()
    expect(btn.getAttribute("aria-disabled")).toBe("true")
    expect(btn.hasAttribute("data-disabled")).toBe(true)
  })

  it("supports indeterminate state", () => {
    const container = getContainer()
    render(
      () => (
        <Checkbox.Root defaultChecked="indeterminate">
          <Checkbox.Indicator>–</Checkbox.Indicator>
        </Checkbox.Root>
      ),
      container,
    )

    const btn = container.querySelector("[role='checkbox']")!
    expect(btn.getAttribute("aria-checked")).toBe("mixed")
    expect(btn.getAttribute("data-state")).toBe("indeterminate")
  })

  it("forwards class prop", () => {
    const container = getContainer()
    render(
      () => (
        <Checkbox.Root class="my-checkbox">
          <Checkbox.Indicator>✓</Checkbox.Indicator>
        </Checkbox.Root>
      ),
      container,
    )

    const btn = container.querySelector("[role='checkbox']")!
    expect((btn as HTMLElement).className).toBe("my-checkbox")
  })

  it("produces no console errors on render", () => {
    const container = getContainer()
    render(
      () => (
        <Checkbox.Root>
          <Checkbox.Indicator>✓</Checkbox.Indicator>
        </Checkbox.Root>
      ),
      container,
    )
    guard.assertClean()
  })
})

describe("Checkbox.Indicator", () => {
  it("is visible when checked", () => {
    const container = getContainer()
    render(
      () => (
        <Checkbox.Root defaultChecked={true}>
          <Checkbox.Indicator>✓</Checkbox.Indicator>
        </Checkbox.Root>
      ),
      container,
    )

    const indicator = container.querySelector("[data-part='indicator']")
    expect(indicator).not.toBeNull()
    expect(indicator!.textContent).toBe("✓")
  })

  it("is hidden when unchecked", () => {
    const container = getContainer()
    render(
      () => (
        <Checkbox.Root defaultChecked={false}>
          <Checkbox.Indicator>✓</Checkbox.Indicator>
        </Checkbox.Root>
      ),
      container,
    )

    const indicator = container.querySelector("[data-part='indicator']")
    expect(indicator).toBeNull()
  })
})
