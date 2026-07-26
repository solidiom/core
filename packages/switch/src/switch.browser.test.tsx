/**
 * Browser-mode component tests for Switch primitive.
 *
 * Verifies toggle behavior, ARIA attributes, disabled state,
 * and semantic data attributes.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { render } from "@solidjs/web"
import { createConsoleGuard, type ConsoleGuard } from "@solidiom/runtime/testing/console-guard"
import * as Switch from "./index"

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

describe("Switch.Root", () => {
  it("renders a button with role=switch", () => {
    const container = getContainer()
    render(
      () => (
        <Switch.Root>
          <Switch.Thumb />
        </Switch.Root>
      ),
      container,
    )

    const btn = container.querySelector("[role='switch']")
    expect(btn).not.toBeNull()
  })

  it("applies semantic data attributes", () => {
    const container = getContainer()
    render(
      () => (
        <Switch.Root>
          <Switch.Thumb />
        </Switch.Root>
      ),
      container,
    )

    const btn = container.querySelector("[role='switch']")!
    expect(btn.getAttribute("data-scope")).toBe("switch")
    expect(btn.getAttribute("data-part")).toBe("root")
  })

  it("defaults to off state (aria-checked=false)", () => {
    const container = getContainer()
    render(
      () => (
        <Switch.Root>
          <Switch.Thumb />
        </Switch.Root>
      ),
      container,
    )

    const btn = container.querySelector("[role='switch']")!
    expect(btn.getAttribute("aria-checked")).toBe("false")
    expect(btn.getAttribute("data-state")).toBe("off")
  })

  it("renders on state with defaultChecked=true", () => {
    const container = getContainer()
    render(
      () => (
        <Switch.Root defaultChecked={true}>
          <Switch.Thumb />
        </Switch.Root>
      ),
      container,
    )

    const btn = container.querySelector("[role='switch']")!
    expect(btn.getAttribute("aria-checked")).toBe("true")
    expect(btn.getAttribute("data-state")).toBe("on")
  })

  it("toggles on click and fires onCheckedChange", () => {
    const container = getContainer()
    const onChange = vi.fn()
    render(
      () => (
        <Switch.Root onCheckedChange={onChange}>
          <Switch.Thumb />
        </Switch.Root>
      ),
      container,
    )

    const btn = container.querySelector("[role='switch']") as HTMLElement
    btn.click()
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it("does not toggle when disabled", () => {
    const container = getContainer()
    const onChange = vi.fn()
    render(
      () => (
        <Switch.Root disabled onCheckedChange={onChange}>
          <Switch.Thumb />
        </Switch.Root>
      ),
      container,
    )

    const btn = container.querySelector("[role='switch']") as HTMLElement
    btn.click()
    expect(onChange).not.toHaveBeenCalled()
    expect(btn.getAttribute("aria-disabled")).toBe("true")
    expect(btn.hasAttribute("data-disabled")).toBe(true)
  })

  it("forwards class prop", () => {
    const container = getContainer()
    render(
      () => (
        <Switch.Root class="my-switch">
          <Switch.Thumb />
        </Switch.Root>
      ),
      container,
    )

    const btn = container.querySelector("[role='switch']")!
    expect((btn as HTMLElement).className).toBe("my-switch")
  })

  it("produces no console errors on render", () => {
    const container = getContainer()
    render(
      () => (
        <Switch.Root>
          <Switch.Thumb />
        </Switch.Root>
      ),
      container,
    )
    guard.assertClean()
  })
})

describe("Switch.Thumb", () => {
  it("renders with semantic attributes", () => {
    const container = getContainer()
    render(
      () => (
        <Switch.Root>
          <Switch.Thumb />
        </Switch.Root>
      ),
      container,
    )

    const thumb = container.querySelector("[data-scope='switch'][data-part='thumb']")
    expect(thumb).not.toBeNull()
  })

  it("reflects parent state in data-state", () => {
    const container = getContainer()
    render(
      () => (
        <Switch.Root defaultChecked={true}>
          <Switch.Thumb />
        </Switch.Root>
      ),
      container,
    )

    const thumb = container.querySelector("[data-part='thumb']")!
    expect(thumb.getAttribute("data-state")).toBe("on")
  })
})
