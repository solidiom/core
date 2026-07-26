/**
 * Browser-mode component tests for Spinner primitive.
 *
 * Verifies semantic attributes, role, aria-label, and class forwarding.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { render } from "@solidjs/web"
import { createConsoleGuard, type ConsoleGuard } from "@solidiom/runtime/testing/console-guard"
import * as Spinner from "./index"

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

describe("Spinner.Root", () => {
  it("renders a span with role=status", () => {
    const container = getContainer()
    render(() => <Spinner.Root />, container)

    const el = container.querySelector("[role=status]")
    expect(el).not.toBeNull()
    expect(el!.tagName.toLowerCase()).toBe("span")
  })

  it("applies semantic data attributes", () => {
    const container = getContainer()
    render(() => <Spinner.Root />, container)

    const el = container.querySelector("[role=status]")!
    expect(el.getAttribute("data-scope")).toBe("spinner")
    expect(el.getAttribute("data-part")).toBe("root")
  })

  it('has default aria-label="Loading"', () => {
    const container = getContainer()
    render(() => <Spinner.Root />, container)

    const el = container.querySelector("[role=status]")!
    expect(el.getAttribute("aria-label")).toBe("Loading")
  })

  it("accepts custom label prop", () => {
    const container = getContainer()
    render(() => <Spinner.Root label="Please wait" />, container)

    const el = container.querySelector("[role=status]")!
    expect(el.getAttribute("aria-label")).toBe("Please wait")
  })

  it("forwards class prop", () => {
    const container = getContainer()
    render(() => <Spinner.Root class="my-spinner" />, container)

    const el = container.querySelector("[role=status]")!
    expect(el.className).toBe("my-spinner")
  })

  it("produces no console errors", () => {
    const container = getContainer()
    render(() => <Spinner.Root />, container)
    guard.assertClean()
  })
})
