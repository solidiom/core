/**
 * Browser-mode component tests for Separator primitive.
 *
 * Verifies role attributes, orientation, decorative mode,
 * and semantic data attributes.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { render } from "@solidjs/web"
import { createConsoleGuard, type ConsoleGuard } from "@solidiom/runtime/testing/console-guard"
import * as Separator from "./index"

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

describe("Separator.Root", () => {
  it("renders with role=separator by default", () => {
    const container = getContainer()
    render(() => <Separator.Root />, container)

    const el = container.querySelector("[role='separator']")
    expect(el).not.toBeNull()
  })

  it("applies semantic data attributes", () => {
    const container = getContainer()
    render(() => <Separator.Root />, container)

    const el = container.querySelector("[role='separator']")!
    expect(el.getAttribute("data-scope")).toBe("separator")
    expect(el.getAttribute("data-part")).toBe("root")
  })

  it("sets aria-orientation", () => {
    const container = getContainer()
    render(() => <Separator.Root orientation="horizontal" />, container)

    const el = container.querySelector("[role='separator']")!
    expect(el.getAttribute("aria-orientation")).toBe("horizontal")
  })

  it("renders as decorative (role=none) when decorative=true", () => {
    const container = getContainer()
    render(() => <Separator.Root decorative />, container)

    const el = container.querySelector("[role='none']")
    expect(el).not.toBeNull()
    expect(el!.getAttribute("aria-orientation")).toBeNull()
  })

  it("forwards class prop", () => {
    const container = getContainer()
    render(() => <Separator.Root class="my-separator" />, container)

    const el = container.querySelector("[role='separator']")!
    expect((el as HTMLElement).className).toContain("my-separator")
  })

  it("supports vertical orientation", () => {
    const container = getContainer()
    render(() => <Separator.Root orientation="vertical" />, container)

    const el = container.querySelector("[role='separator']")!
    expect(el.getAttribute("aria-orientation")).toBe("vertical")
    expect(el.getAttribute("data-orientation")).toBe("vertical")
  })

  it("produces no console errors", () => {
    const container = getContainer()
    render(() => <Separator.Root />, container)
    guard.assertClean()
  })
})
