/**
 * Browser-mode component tests for AlertDialog primitive.
 *
 * Verifies open/close behavior, ARIA attributes, Cancel/Action patterns,
 * and semantic data attributes.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { render } from "@solidjs/web"
import { createConsoleGuard, type ConsoleGuard } from "@solidiom/runtime/testing/console-guard"
import * as AlertDialog from "./index"

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

describe("AlertDialog", () => {
  it("renders trigger with aria-haspopup=alertdialog", () => {
    const container = getContainer()
    render(
      () => (
        <AlertDialog.Root>
          <AlertDialog.Trigger>Delete</AlertDialog.Trigger>
          <AlertDialog.Portal>
            <AlertDialog.Content>
              <AlertDialog.Title>Confirm</AlertDialog.Title>
              <AlertDialog.Description>Are you sure?</AlertDialog.Description>
              <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
              <AlertDialog.Action>Delete</AlertDialog.Action>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>
      ),
      container,
    )

    const trigger = container.querySelector("[data-scope='alert-dialog'][data-part='trigger']")
    expect(trigger).not.toBeNull()
    expect(trigger!.getAttribute("aria-haspopup")).toBe("alertdialog")
    expect(trigger!.getAttribute("data-state")).toBe("closed")
  })

  it("does not render content when closed", () => {
    const container = getContainer()
    render(
      () => (
        <AlertDialog.Root>
          <AlertDialog.Trigger>Delete</AlertDialog.Trigger>
          <AlertDialog.Portal>
            <AlertDialog.Content>
              <AlertDialog.Title>Confirm</AlertDialog.Title>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>
      ),
      container,
    )

    const content = container.querySelector("[role='alertdialog']")
    expect(content).toBeNull()
  })

  it("renders content with role=alertdialog when defaultOpen", () => {
    const container = getContainer()
    render(
      () => (
        <AlertDialog.Root defaultOpen>
          <AlertDialog.Trigger>Delete</AlertDialog.Trigger>
          <AlertDialog.Portal>
            <AlertDialog.Content>
              <AlertDialog.Title>Confirm</AlertDialog.Title>
              <AlertDialog.Description>Are you sure?</AlertDialog.Description>
              <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
              <AlertDialog.Action>Delete</AlertDialog.Action>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>
      ),
      container,
    )

    const content = container.querySelector("[role='alertdialog']")
    expect(content).not.toBeNull()
    expect(content!.getAttribute("aria-modal")).toBe("true")
  })

  it("opens on trigger click", () => {
    const container = getContainer()
    render(
      () => (
        <AlertDialog.Root>
          <AlertDialog.Trigger>Delete</AlertDialog.Trigger>
          <AlertDialog.Portal>
            <AlertDialog.Content>
              <AlertDialog.Title>Confirm</AlertDialog.Title>
              <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
              <AlertDialog.Action>Delete</AlertDialog.Action>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>
      ),
      container,
    )

    const trigger = container.querySelector("[data-part='trigger']") as HTMLElement
    trigger.click()

    const content = container.querySelector("[role='alertdialog']")
    expect(content).not.toBeNull()
    expect(trigger.getAttribute("aria-expanded")).toBe("true")
  })

  it("links content to title via aria-labelledby", () => {
    const container = getContainer()
    render(
      () => (
        <AlertDialog.Root defaultOpen>
          <AlertDialog.Trigger>Delete</AlertDialog.Trigger>
          <AlertDialog.Portal>
            <AlertDialog.Content>
              <AlertDialog.Title>Confirm Deletion</AlertDialog.Title>
              <AlertDialog.Description>This cannot be undone.</AlertDialog.Description>
              <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
              <AlertDialog.Action>Delete</AlertDialog.Action>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>
      ),
      container,
    )

    const content = container.querySelector("[role='alertdialog']")!
    const title = container.querySelector("[data-part='title']")!
    expect(content.getAttribute("aria-labelledby")).toBe(title.id)
  })

  it("closes on Cancel click", () => {
    const container = getContainer()
    render(
      () => (
        <AlertDialog.Root defaultOpen>
          <AlertDialog.Trigger>Delete</AlertDialog.Trigger>
          <AlertDialog.Portal>
            <AlertDialog.Content>
              <AlertDialog.Title>Confirm</AlertDialog.Title>
              <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
              <AlertDialog.Action>Delete</AlertDialog.Action>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>
      ),
      container,
    )

    const cancelBtn = container.querySelector("[data-part='cancel']") as HTMLElement
    expect(cancelBtn).not.toBeNull()
    cancelBtn.click()

    const content = container.querySelector("[role='alertdialog']")
    expect(content).toBeNull()
  })

  it("closes on Action click and fires onAction", () => {
    const container = getContainer()
    const onAction = vi.fn()
    render(
      () => (
        <AlertDialog.Root defaultOpen>
          <AlertDialog.Trigger>Delete</AlertDialog.Trigger>
          <AlertDialog.Portal>
            <AlertDialog.Content>
              <AlertDialog.Title>Confirm</AlertDialog.Title>
              <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
              <AlertDialog.Action onAction={onAction}>Delete</AlertDialog.Action>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>
      ),
      container,
    )

    const actionBtn = container.querySelector("[data-part='action']") as HTMLElement
    expect(actionBtn).not.toBeNull()
    actionBtn.click()

    expect(onAction).toHaveBeenCalledOnce()
    const content = container.querySelector("[role='alertdialog']")
    expect(content).toBeNull()
  })

  it("applies semantic data attributes to all parts", () => {
    const container = getContainer()
    render(
      () => (
        <AlertDialog.Root defaultOpen>
          <AlertDialog.Trigger>Delete</AlertDialog.Trigger>
          <AlertDialog.Portal>
            <AlertDialog.Content>
              <AlertDialog.Title>Confirm</AlertDialog.Title>
              <AlertDialog.Description>Are you sure?</AlertDialog.Description>
              <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
              <AlertDialog.Action>Delete</AlertDialog.Action>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>
      ),
      container,
    )

    expect(
      container.querySelector("[data-scope='alert-dialog'][data-part='trigger']"),
    ).not.toBeNull()
    expect(
      container.querySelector("[data-scope='alert-dialog'][data-part='content']"),
    ).not.toBeNull()
    expect(container.querySelector("[data-scope='alert-dialog'][data-part='title']")).not.toBeNull()
    expect(
      container.querySelector("[data-scope='alert-dialog'][data-part='description']"),
    ).not.toBeNull()
    expect(
      container.querySelector("[data-scope='alert-dialog'][data-part='cancel']"),
    ).not.toBeNull()
    expect(
      container.querySelector("[data-scope='alert-dialog'][data-part='action']"),
    ).not.toBeNull()
  })

  it("produces no console errors", () => {
    const container = getContainer()
    render(
      () => (
        <AlertDialog.Root>
          <AlertDialog.Trigger>Delete</AlertDialog.Trigger>
          <AlertDialog.Portal>
            <AlertDialog.Content>
              <AlertDialog.Title>Confirm</AlertDialog.Title>
              <AlertDialog.Description>Are you sure?</AlertDialog.Description>
              <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
              <AlertDialog.Action>Delete</AlertDialog.Action>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>
      ),
      container,
    )
    guard.assertClean()
  })
})
