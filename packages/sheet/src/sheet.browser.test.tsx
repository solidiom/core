/**
 * Browser-mode component tests for Sheet primitive.
 *
 * Verifies open/close behavior, ARIA attributes, data-side,
 * semantic data attributes, and console cleanliness.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { render } from "@solidjs/web"
import { createConsoleGuard, type ConsoleGuard } from "@solidiom/runtime/testing/console-guard"
import * as Sheet from "./index"

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

describe("Sheet", () => {
  it("renders trigger with aria-haspopup=dialog", () => {
    const container = getContainer()
    render(
      () => (
        <Sheet.Root>
          <Sheet.Trigger>Open</Sheet.Trigger>
          <Sheet.Portal>
            <Sheet.Content>
              <Sheet.Title>Title</Sheet.Title>
              <Sheet.Description>Description</Sheet.Description>
            </Sheet.Content>
          </Sheet.Portal>
        </Sheet.Root>
      ),
      container,
    )

    const trigger = container.querySelector("[data-scope='sheet'][data-part='trigger']")
    expect(trigger).not.toBeNull()
    expect(trigger!.getAttribute("aria-haspopup")).toBe("dialog")
    expect(trigger!.getAttribute("data-state")).toBe("closed")
  })

  it("does not render content when closed", () => {
    const container = getContainer()
    render(
      () => (
        <Sheet.Root>
          <Sheet.Trigger>Open</Sheet.Trigger>
          <Sheet.Portal>
            <Sheet.Content>
              <Sheet.Title>Title</Sheet.Title>
            </Sheet.Content>
          </Sheet.Portal>
        </Sheet.Root>
      ),
      container,
    )

    const content = container.querySelector("[role='dialog']")
    expect(content).toBeNull()
  })

  it("renders content with role=dialog and data-side when defaultOpen", () => {
    const container = getContainer()
    render(
      () => (
        <Sheet.Root defaultOpen side="left">
          <Sheet.Trigger>Open</Sheet.Trigger>
          <Sheet.Portal>
            <Sheet.Content>
              <Sheet.Title>Title</Sheet.Title>
              <Sheet.Description>Desc</Sheet.Description>
            </Sheet.Content>
          </Sheet.Portal>
        </Sheet.Root>
      ),
      container,
    )

    const content = container.querySelector("[role='dialog']")
    expect(content).not.toBeNull()
    expect(content!.getAttribute("aria-modal")).toBe("true")
    expect(content!.getAttribute("data-side")).toBe("left")
  })

  it("opens on trigger click", () => {
    const container = getContainer()
    render(
      () => (
        <Sheet.Root>
          <Sheet.Trigger>Open</Sheet.Trigger>
          <Sheet.Portal>
            <Sheet.Content>
              <Sheet.Title>Title</Sheet.Title>
            </Sheet.Content>
          </Sheet.Portal>
        </Sheet.Root>
      ),
      container,
    )

    const trigger = container.querySelector("[data-part='trigger']") as HTMLElement
    trigger.click()

    const content = container.querySelector("[role='dialog']")
    expect(content).not.toBeNull()
    expect(trigger.getAttribute("aria-expanded")).toBe("true")
  })

  it("closes on Close click", () => {
    const container = getContainer()
    render(
      () => (
        <Sheet.Root defaultOpen>
          <Sheet.Trigger>Open</Sheet.Trigger>
          <Sheet.Portal>
            <Sheet.Content>
              <Sheet.Title>Title</Sheet.Title>
              <Sheet.Close>×</Sheet.Close>
            </Sheet.Content>
          </Sheet.Portal>
        </Sheet.Root>
      ),
      container,
    )

    const closeBtn = container.querySelector("[data-part='close']") as HTMLElement
    expect(closeBtn).not.toBeNull()
    closeBtn.click()

    const content = container.querySelector("[role='dialog']")
    expect(content).toBeNull()
  })

  it("applies semantic attrs", () => {
    const container = getContainer()
    render(
      () => (
        <Sheet.Root defaultOpen>
          <Sheet.Trigger>Open</Sheet.Trigger>
          <Sheet.Portal>
            <Sheet.Backdrop />
            <Sheet.Content>
              <Sheet.Title>Title</Sheet.Title>
              <Sheet.Description>Desc</Sheet.Description>
              <Sheet.Close>×</Sheet.Close>
            </Sheet.Content>
          </Sheet.Portal>
        </Sheet.Root>
      ),
      container,
    )

    expect(container.querySelector("[data-scope='sheet'][data-part='trigger']")).not.toBeNull()
    expect(container.querySelector("[data-scope='sheet'][data-part='backdrop']")).not.toBeNull()
    expect(container.querySelector("[data-scope='sheet'][data-part='content']")).not.toBeNull()
    expect(container.querySelector("[data-scope='sheet'][data-part='title']")).not.toBeNull()
    expect(container.querySelector("[data-scope='sheet'][data-part='description']")).not.toBeNull()
    expect(container.querySelector("[data-scope='sheet'][data-part='close']")).not.toBeNull()
  })

  it("no console errors", () => {
    const container = getContainer()
    render(
      () => (
        <Sheet.Root defaultOpen side="bottom">
          <Sheet.Trigger>Open</Sheet.Trigger>
          <Sheet.Portal>
            <Sheet.Backdrop />
            <Sheet.Content>
              <Sheet.Title>Title</Sheet.Title>
              <Sheet.Description>Desc</Sheet.Description>
              <Sheet.Close>×</Sheet.Close>
            </Sheet.Content>
          </Sheet.Portal>
        </Sheet.Root>
      ),
      container,
    )

    guard.expectNoErrors()
  })
})
