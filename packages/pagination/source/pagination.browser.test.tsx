/**
 * Browser-mode component tests for Pagination primitive.
 *
 * Verifies rendering, semantic attributes, ARIA labels, and disabled state.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { render } from "@solidjs/web"
import { createConsoleGuard, type ConsoleGuard } from "@solidiom/runtime/testing/console-guard"
import * as Pagination from "./index"

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

describe("Pagination", () => {
  it("renders nav with aria-label=Pagination", () => {
    const container = getContainer()
    render(
      () => (
        <Pagination.Root>
          <Pagination.Content>
            <Pagination.Item>
              <button>1</button>
            </Pagination.Item>
          </Pagination.Content>
        </Pagination.Root>
      ),
      container,
    )

    const nav = container.querySelector("nav")
    expect(nav).not.toBeNull()
    expect(nav!.getAttribute("aria-label")).toBe("Pagination")
  })

  it("applies semantic attributes", () => {
    const container = getContainer()
    render(() => <Pagination.Root>content</Pagination.Root>, container)

    const nav = container.querySelector("nav")!
    expect(nav.getAttribute("data-scope")).toBe("pagination")
    expect(nav.getAttribute("data-part")).toBe("root")
  })

  it("PreviousButton has correct aria-label", () => {
    const container = getContainer()
    render(() => <Pagination.PreviousButton>Prev</Pagination.PreviousButton>, container)

    const btn = container.querySelector("button")!
    expect(btn.getAttribute("aria-label")).toBe("Go to previous page")
  })

  it("NextButton disabled when prop set", () => {
    const container = getContainer()
    render(() => <Pagination.NextButton disabled>Next</Pagination.NextButton>, container)

    const btn = container.querySelector("button")!
    expect(btn.disabled).toBe(true)
  })

  it("forwards class prop", () => {
    const container = getContainer()
    render(() => <Pagination.Root class="custom-class">content</Pagination.Root>, container)

    const nav = container.querySelector("nav")!
    expect(nav.className).toBe("custom-class")
  })

  it("produces no console errors on render", () => {
    const container = getContainer()
    render(
      () => (
        <Pagination.Root>
          <Pagination.Content>
            <Pagination.Item>
              <button>1</button>
            </Pagination.Item>
          </Pagination.Content>
          <Pagination.PreviousButton>Prev</Pagination.PreviousButton>
          <Pagination.NextButton>Next</Pagination.NextButton>
          <Pagination.Ellipsis />
        </Pagination.Root>
      ),
      container,
    )
    guard.assertClean()
  })
})
