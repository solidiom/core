/**
 * Browser-mode component tests for Toolbar primitive.
 *
 * Verifies role=toolbar, semantic data attributes, aria-orientation,
 * separator role, toggle item aria-pressed, and class forwarding.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { render } from "@solidjs/web"
import { createConsoleGuard, type ConsoleGuard } from "@solidiom/runtime/testing/console-guard"
import * as Toolbar from "./index"

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

describe("Toolbar.Root", () => {
  it("renders with role=toolbar", () => {
    const container = getContainer()
    render(
      () => (
        <Toolbar.Root>
          <Toolbar.Button>Action</Toolbar.Button>
        </Toolbar.Root>
      ),
      container,
    )

    const el = container.querySelector("[role='toolbar']")
    expect(el).not.toBeNull()
  })

  it("applies semantic data attributes", () => {
    const container = getContainer()
    render(
      () => (
        <Toolbar.Root>
          <Toolbar.Button>Action</Toolbar.Button>
        </Toolbar.Root>
      ),
      container,
    )

    const el = container.querySelector("[role='toolbar']")!
    expect(el.getAttribute("data-scope")).toBe("toolbar")
    expect(el.getAttribute("data-part")).toBe("root")
  })

  it("sets aria-orientation to horizontal by default", () => {
    const container = getContainer()
    render(
      () => (
        <Toolbar.Root>
          <Toolbar.Button>Action</Toolbar.Button>
        </Toolbar.Root>
      ),
      container,
    )

    const el = container.querySelector("[role='toolbar']")!
    expect(el.getAttribute("aria-orientation")).toBe("horizontal")
  })

  it("sets aria-orientation to vertical when specified", () => {
    const container = getContainer()
    render(
      () => (
        <Toolbar.Root orientation="vertical">
          <Toolbar.Button>Action</Toolbar.Button>
        </Toolbar.Root>
      ),
      container,
    )

    const el = container.querySelector("[role='toolbar']")!
    expect(el.getAttribute("aria-orientation")).toBe("vertical")
  })

  it("forwards class prop", () => {
    const container = getContainer()
    render(
      () => (
        <Toolbar.Root class="my-toolbar">
          <Toolbar.Button>Action</Toolbar.Button>
        </Toolbar.Root>
      ),
      container,
    )

    const el = container.querySelector("[role='toolbar']")!
    expect((el as HTMLElement).className).toContain("my-toolbar")
  })

  it("produces no console errors on render", () => {
    const container = getContainer()
    render(
      () => (
        <Toolbar.Root>
          <Toolbar.Button>Action</Toolbar.Button>
        </Toolbar.Root>
      ),
      container,
    )
    guard.assertClean()
  })
})

describe("Toolbar.Separator", () => {
  it("renders with role=separator", () => {
    const container = getContainer()
    render(
      () => (
        <Toolbar.Root>
          <Toolbar.Separator />
        </Toolbar.Root>
      ),
      container,
    )

    const el = container.querySelector("[role='separator']")
    expect(el).not.toBeNull()
  })

  it("applies semantic data attributes", () => {
    const container = getContainer()
    render(
      () => (
        <Toolbar.Root>
          <Toolbar.Separator />
        </Toolbar.Root>
      ),
      container,
    )

    const el = container.querySelector("[role='separator']")!
    expect(el.getAttribute("data-scope")).toBe("toolbar")
    expect(el.getAttribute("data-part")).toBe("separator")
  })
})

describe("Toolbar.ToggleItem", () => {
  it("has aria-pressed=false by default", () => {
    const container = getContainer()
    render(
      () => (
        <Toolbar.Root>
          <Toolbar.ToggleGroup>
            <Toolbar.ToggleItem>Bold</Toolbar.ToggleItem>
          </Toolbar.ToggleGroup>
        </Toolbar.Root>
      ),
      container,
    )

    const btn = container.querySelector("[data-part='toggle-item']")!
    expect(btn.getAttribute("aria-pressed")).toBe("false")
  })

  it("has aria-pressed=true when pressed", () => {
    const container = getContainer()
    render(
      () => (
        <Toolbar.Root>
          <Toolbar.ToggleGroup>
            <Toolbar.ToggleItem pressed>Bold</Toolbar.ToggleItem>
          </Toolbar.ToggleGroup>
        </Toolbar.Root>
      ),
      container,
    )

    const btn = container.querySelector("[data-part='toggle-item']")!
    expect(btn.getAttribute("aria-pressed")).toBe("true")
  })

  it("calls onPressedChange on click", () => {
    const container = getContainer()
    const onChange = vi.fn()
    render(
      () => (
        <Toolbar.Root>
          <Toolbar.ToggleGroup>
            <Toolbar.ToggleItem onPressedChange={onChange}>Bold</Toolbar.ToggleItem>
          </Toolbar.ToggleGroup>
        </Toolbar.Root>
      ),
      container,
    )

    const btn = container.querySelector("[data-part='toggle-item']") as HTMLElement
    btn.click()
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it("does not call onPressedChange when disabled", () => {
    const container = getContainer()
    const onChange = vi.fn()
    render(
      () => (
        <Toolbar.Root>
          <Toolbar.ToggleGroup>
            <Toolbar.ToggleItem disabled onPressedChange={onChange}>
              Bold
            </Toolbar.ToggleItem>
          </Toolbar.ToggleGroup>
        </Toolbar.Root>
      ),
      container,
    )

    const btn = container.querySelector("[data-part='toggle-item']") as HTMLElement
    btn.click()
    expect(onChange).not.toHaveBeenCalled()
  })

  it("forwards class prop", () => {
    const container = getContainer()
    render(
      () => (
        <Toolbar.Root>
          <Toolbar.ToggleGroup>
            <Toolbar.ToggleItem class="my-toggle">Bold</Toolbar.ToggleItem>
          </Toolbar.ToggleGroup>
        </Toolbar.Root>
      ),
      container,
    )

    const btn = container.querySelector("[data-part='toggle-item']")!
    expect((btn as HTMLElement).className).toContain("my-toggle")
  })
})
