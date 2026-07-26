/**
 * Browser-mode component tests for Toggle primitive.
 *
 * Verifies aria-pressed state, toggling, disabled behavior, and semantic attributes.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { render } from "@solidjs/web"
import { createSignal } from "solid-js"
import { createConsoleGuard, type ConsoleGuard } from "@solidiom/runtime/testing/console-guard"
import * as Toggle from "./index"

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

describe("Toggle", () => {
  it("renders with aria-pressed='false' by default", () => {
    const container = getContainer()
    render(() => <Toggle.Root>Bold</Toggle.Root>, container)

    const btn = container.querySelector("button")!
    expect(btn.getAttribute("aria-pressed")).toBe("false")
    expect(btn.getAttribute("data-scope")).toBe("toggle")
    expect(btn.getAttribute("data-part")).toBe("root")
    expect(btn.getAttribute("data-state")).toBe("off")
  })

  it("renders with aria-pressed='true' when defaultPressed is true", () => {
    const container = getContainer()
    render(() => <Toggle.Root defaultPressed={true}>Bold</Toggle.Root>, container)

    const btn = container.querySelector("button")!
    expect(btn.getAttribute("aria-pressed")).toBe("true")
    expect(btn.getAttribute("data-state")).toBe("on")
  })

  it("toggles on click", () => {
    const container = getContainer()
    render(() => <Toggle.Root>Bold</Toggle.Root>, container)

    const btn = container.querySelector("button")!
    expect(btn.getAttribute("aria-pressed")).toBe("false")

    btn.click()
    expect(btn.getAttribute("aria-pressed")).toBe("true")
    expect(btn.getAttribute("data-state")).toBe("on")

    btn.click()
    expect(btn.getAttribute("aria-pressed")).toBe("false")
    expect(btn.getAttribute("data-state")).toBe("off")
  })

  it("calls onPressedChange on click", () => {
    const container = getContainer()
    const handler = vi.fn()
    render(() => <Toggle.Root onPressedChange={handler}>Bold</Toggle.Root>, container)

    const btn = container.querySelector("button")!
    btn.click()

    expect(handler).toHaveBeenCalledWith(true)
  })

  it("does not toggle when disabled", () => {
    const container = getContainer()
    const handler = vi.fn()
    render(
      () => (
        <Toggle.Root disabled onPressedChange={handler}>
          Bold
        </Toggle.Root>
      ),
      container,
    )

    const btn = container.querySelector("button")!
    btn.click()

    expect(handler).not.toHaveBeenCalled()
    expect(btn.getAttribute("aria-pressed")).toBe("false")
    expect(btn.getAttribute("aria-disabled")).toBe("true")
  })

  it("supports controlled mode via pressed accessor", () => {
    const container = getContainer()
    const [pressed] = createSignal(true)
    render(() => <Toggle.Root pressed={pressed}>Bold</Toggle.Root>, container)

    const btn = container.querySelector("button")!
    expect(btn.getAttribute("aria-pressed")).toBe("true")
    expect(btn.getAttribute("data-state")).toBe("on")
  })

  it("applies class prop", () => {
    const container = getContainer()
    render(() => <Toggle.Root class="custom-class">Bold</Toggle.Root>, container)

    const btn = container.querySelector("button")!
    expect(btn.classList.contains("custom-class")).toBe(true)
  })

  it("renders children", () => {
    const container = getContainer()
    render(() => <Toggle.Root>Bold Text</Toggle.Root>, container)

    const btn = container.querySelector("button")!
    expect(btn.textContent).toBe("Bold Text")
  })

  it("renders button type='button'", () => {
    const container = getContainer()
    render(() => <Toggle.Root>Bold</Toggle.Root>, container)

    const btn = container.querySelector("button")!
    expect(btn.getAttribute("type")).toBe("button")
  })

  it("produces no console errors", () => {
    const container = getContainer()
    render(() => <Toggle.Root>Bold</Toggle.Root>, container)
    guard.assertNoErrors()
  })
})
