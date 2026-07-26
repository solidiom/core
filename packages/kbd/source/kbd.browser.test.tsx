/**
 * Browser-mode component tests for Kbd primitive.
 *
 * Verifies semantic element, data attributes, class forwarding,
 * and children rendering.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { render } from "@solidjs/web"
import { createConsoleGuard, type ConsoleGuard } from "@solidiom/runtime/testing/console-guard"
import * as Kbd from "./index"

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

describe("Kbd.Root", () => {
  it("renders a <kbd> element", () => {
    const container = getContainer()
    render(() => <Kbd.Root>⌘K</Kbd.Root>, container)

    const el = container.querySelector("kbd")
    expect(el).not.toBeNull()
  })

  it("applies semantic data attributes", () => {
    const container = getContainer()
    render(() => <Kbd.Root>⌘K</Kbd.Root>, container)

    const el = container.querySelector("kbd")!
    expect(el.getAttribute("data-scope")).toBe("kbd")
    expect(el.getAttribute("data-part")).toBe("root")
  })

  it("forwards class prop", () => {
    const container = getContainer()
    render(() => <Kbd.Root class="my-kbd">⌘K</Kbd.Root>, container)

    const el = container.querySelector("kbd")!
    expect(el.className).toContain("my-kbd")
  })

  it("renders children content", () => {
    const container = getContainer()
    render(() => <Kbd.Root>Ctrl+C</Kbd.Root>, container)

    const el = container.querySelector("kbd")!
    expect(el.textContent).toBe("Ctrl+C")
  })

  it("produces no console errors", () => {
    const container = getContainer()
    render(() => <Kbd.Root>⌘K</Kbd.Root>, container)
    guard.assertClean()
  })
})
