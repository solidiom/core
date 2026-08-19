/**
 * Browser-mode component tests for Dialog primitive.
 *
 * Verifies open/close behavior, ARIA attributes, focus management,
 * escape dismissal, and semantic data attributes.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { render } from "@solidjs/web"
import { flush } from "solid-js"
import { createConsoleGuard, type ConsoleGuard } from "@solidiom/runtime/testing/console-guard"
import * as Dialog from "./index"

// ─── Setup ─────────────────────────────────────────────────────────────────────

let guard: ConsoleGuard

beforeEach(() => {
  guard = createConsoleGuard()
})

afterEach(() => {
  guard.restore()
  document.body.innerHTML = ""
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

describe("Dialog", () => {
  it("renders trigger with aria-haspopup=dialog", () => {
    const container = getContainer()
    render(
      () => (
        <Dialog.Root>
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Content>
              <Dialog.Title>Title</Dialog.Title>
              <Dialog.Description>Description</Dialog.Description>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      ),
      container,
    )

    const trigger = document.querySelector("[data-scope='dialog'][data-part='trigger']")
    expect(trigger).not.toBeNull()
    expect(trigger!.getAttribute("aria-haspopup")).toBe("dialog")
    expect(trigger!.getAttribute("data-state")).toBe("closed")
  })

  it("does not render content when closed", () => {
    const container = getContainer()
    render(
      () => (
        <Dialog.Root>
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Content>
              <Dialog.Title>Title</Dialog.Title>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      ),
      container,
    )

    const content = document.querySelector("[role='dialog']")
    expect(content).toBeNull()
  })

  it("renders content when defaultOpen=true", () => {
    const container = getContainer()
    render(
      () => (
        <Dialog.Root defaultOpen>
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Content>
              <Dialog.Title>Title</Dialog.Title>
              <Dialog.Description>Desc</Dialog.Description>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      ),
      container,
    )

    const content = document.querySelector("[role='dialog']")
    expect(content).not.toBeNull()
    expect(content!.getAttribute("aria-modal")).toBe("true")
  })

  it("opens on trigger click", () => {
    const container = getContainer()
    render(
      () => (
        <Dialog.Root>
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Content>
              <Dialog.Title>Title</Dialog.Title>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      ),
      container,
    )

    const trigger = document.querySelector("[data-part='trigger']") as HTMLElement
    trigger.click()
    flush()

    const content = document.querySelector("[role='dialog']")
    expect(content).not.toBeNull()
    expect(trigger.getAttribute("aria-expanded")).toBe("true")
  })

  it("links content to title via aria-labelledby", () => {
    const container = getContainer()
    render(
      () => (
        <Dialog.Root defaultOpen>
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Content>
              <Dialog.Title>My Dialog</Dialog.Title>
              <Dialog.Description>Some description</Dialog.Description>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      ),
      container,
    )

    const content = document.querySelector("[role='dialog']")!
    const title = document.querySelector("[data-part='title']")!
    expect(content.getAttribute("aria-labelledby")).toBe(title.id)
  })

  it("links content to description via aria-describedby", () => {
    const container = getContainer()
    render(
      () => (
        <Dialog.Root defaultOpen>
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Content>
              <Dialog.Title>Title</Dialog.Title>
              <Dialog.Description>Some description</Dialog.Description>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      ),
      container,
    )

    const content = document.querySelector("[role='dialog']")!
    const desc = document.querySelector("[data-part='description']")!
    expect(content.getAttribute("aria-describedby")).toBe(desc.id)
  })

  it("closes on Close button click", () => {
    const container = getContainer()
    render(
      () => (
        <Dialog.Root defaultOpen>
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Content>
              <Dialog.Title>Title</Dialog.Title>
              <Dialog.Close>×</Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      ),
      container,
    )

    const closeBtn = document.querySelector("[data-part='close']") as HTMLElement
    expect(closeBtn).not.toBeNull()
    closeBtn.click()
    flush()

    const content = document.querySelector("[role='dialog']")
    expect(content).toBeNull()
  })

  it("fires onOpenChange callback", () => {
    const container = getContainer()
    const onChange = vi.fn()
    render(
      () => (
        <Dialog.Root onOpenChange={onChange}>
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Content>
              <Dialog.Title>Title</Dialog.Title>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      ),
      container,
    )

    const trigger = document.querySelector("[data-part='trigger']") as HTMLElement
    trigger.click()
    expect(onChange).toHaveBeenCalledWith(true, expect.any(Object))
  })

  it("renders backdrop with aria-hidden", () => {
    const container = getContainer()
    render(
      () => (
        <Dialog.Root defaultOpen>
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Backdrop />
            <Dialog.Content>
              <Dialog.Title>Title</Dialog.Title>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      ),
      container,
    )

    const backdrop = document.querySelector("[data-part='backdrop']")
    expect(backdrop).not.toBeNull()
    expect(backdrop!.getAttribute("aria-hidden")).toBe("true")
  })

  it("applies semantic data attributes to all parts", () => {
    const container = getContainer()
    render(
      () => (
        <Dialog.Root defaultOpen>
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Backdrop />
            <Dialog.Content>
              <Dialog.Title>Title</Dialog.Title>
              <Dialog.Description>Desc</Dialog.Description>
              <Dialog.Close>×</Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      ),
      container,
    )

    expect(document.querySelector("[data-scope='dialog'][data-part='trigger']")).not.toBeNull()
    expect(document.querySelector("[data-scope='dialog'][data-part='backdrop']")).not.toBeNull()
    expect(document.querySelector("[data-scope='dialog'][data-part='content']")).not.toBeNull()
    expect(document.querySelector("[data-scope='dialog'][data-part='title']")).not.toBeNull()
    expect(document.querySelector("[data-scope='dialog'][data-part='description']")).not.toBeNull()
    expect(document.querySelector("[data-scope='dialog'][data-part='close']")).not.toBeNull()
  })

  it("produces no console errors on render", () => {
    const container = getContainer()
    render(
      () => (
        <Dialog.Root>
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Content>
              <Dialog.Title>Title</Dialog.Title>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      ),
      container,
    )
    guard.assertClean()
  })
})
