/**
 * Browser-mode component tests for EmptyState primitive.
 *
 * Verifies semantic attributes, ARIA roles, and part rendering.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { render } from "@solidjs/web"
import { createConsoleGuard, type ConsoleGuard } from "@solidiom/runtime/testing/console-guard"
import * as EmptyState from "./index"

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

describe("EmptyState.Root", () => {
  it("renders root with role=status and semantic attrs", () => {
    const container = getContainer()
    render(() => <EmptyState.Root>Empty</EmptyState.Root>, container)

    const root = container.querySelector("[data-scope='empty-state'][data-part='root']")
    expect(root).not.toBeNull()
    expect(root!.getAttribute("role")).toBe("status")
  })

  it("renders all parts", () => {
    const container = getContainer()
    render(
      () => (
        <EmptyState.Root>
          <EmptyState.Icon>icon</EmptyState.Icon>
          <EmptyState.Title>No items</EmptyState.Title>
          <EmptyState.Description>Try adding something.</EmptyState.Description>
          <EmptyState.Action>
            <button>Add item</button>
          </EmptyState.Action>
        </EmptyState.Root>
      ),
      container,
    )

    expect(container.querySelector("[data-scope='empty-state'][data-part='icon']")).not.toBeNull()
    expect(container.querySelector("[data-scope='empty-state'][data-part='title']")).not.toBeNull()
    expect(
      container.querySelector("[data-scope='empty-state'][data-part='description']"),
    ).not.toBeNull()
    expect(container.querySelector("[data-scope='empty-state'][data-part='action']")).not.toBeNull()
  })

  it("icon has aria-hidden=true", () => {
    const container = getContainer()
    render(
      () => (
        <EmptyState.Root>
          <EmptyState.Icon>icon</EmptyState.Icon>
        </EmptyState.Root>
      ),
      container,
    )

    const icon = container.querySelector("[data-scope='empty-state'][data-part='icon']")
    expect(icon!.getAttribute("aria-hidden")).toBe("true")
  })

  it("forwards class prop", () => {
    const container = getContainer()
    render(() => <EmptyState.Root class="my-empty">Empty</EmptyState.Root>, container)

    const root = container.querySelector(
      "[data-scope='empty-state'][data-part='root']",
    ) as HTMLElement
    expect(root.className).toBe("my-empty")
  })

  it("produces no console errors on render", () => {
    const container = getContainer()
    render(
      () => (
        <EmptyState.Root>
          <EmptyState.Icon>icon</EmptyState.Icon>
          <EmptyState.Title>No items</EmptyState.Title>
          <EmptyState.Description>Try adding something.</EmptyState.Description>
          <EmptyState.Action>
            <button>Add item</button>
          </EmptyState.Action>
        </EmptyState.Root>
      ),
      container,
    )
    guard.assertClean()
  })
})
