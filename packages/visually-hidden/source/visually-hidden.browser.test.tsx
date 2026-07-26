/**
 * Browser-mode component tests for VisuallyHidden primitive.
 *
 * Verifies DOM output, visually-hidden CSS, semantic data attributes,
 * and accessibility (content remains in the accessibility tree).
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { render } from "@solidjs/web"
import { createConsoleGuard, type ConsoleGuard } from "@solidiom/runtime/testing/console-guard"
import * as VisuallyHidden from "./index"

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

describe("VisuallyHidden.Root", () => {
  it("renders a span element with children", () => {
    const container = getContainer()
    render(() => <VisuallyHidden.Root>Hidden label</VisuallyHidden.Root>, container)

    const el = container.querySelector("span")
    expect(el).not.toBeNull()
    expect(el!.textContent).toBe("Hidden label")
  })

  it("applies visually-hidden inline styles", () => {
    const container = getContainer()
    render(() => <VisuallyHidden.Root>SR only</VisuallyHidden.Root>, container)

    const el = container.querySelector("span") as HTMLElement
    const style = el.style
    expect(style.position).toBe("absolute")
    expect(style.width).toBe("1px")
    expect(style.height).toBe("1px")
    expect(style.overflow).toBe("hidden")
    expect(style.whiteSpace).toBe("nowrap")
  })

  it("applies semantic data attributes", () => {
    const container = getContainer()
    render(() => <VisuallyHidden.Root>Label</VisuallyHidden.Root>, container)

    const el = container.querySelector("span")!
    expect(el.getAttribute("data-scope")).toBe("visually-hidden")
    expect(el.getAttribute("data-part")).toBe("root")
  })

  it("forwards class prop", () => {
    const container = getContainer()
    render(() => <VisuallyHidden.Root class="sr-only">Text</VisuallyHidden.Root>, container)

    const el = container.querySelector("span") as HTMLElement
    expect(el.className).toBe("sr-only")
  })

  it("content is accessible to screen readers (present in DOM)", () => {
    const container = getContainer()
    render(
      () => (
        <div>
          <button aria-labelledby="hidden-label">Click me</button>
          <VisuallyHidden.Root>
            <span id="hidden-label">Accessible label</span>
          </VisuallyHidden.Root>
        </div>
      ),
      container,
    )

    const label = container.querySelector("#hidden-label")
    expect(label).not.toBeNull()
    expect(label!.textContent).toBe("Accessible label")
  })

  it("produces no console errors on render", () => {
    const container = getContainer()
    render(() => <VisuallyHidden.Root>Clean render</VisuallyHidden.Root>, container)
    guard.assertClean()
  })
})
