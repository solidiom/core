/**
 * Browser-mode component tests for ContextMenu primitive.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { render } from "@solidjs/web"
import { flush } from "solid-js"
import { createConsoleGuard, type ConsoleGuard } from "@solidiom/runtime/testing/console-guard"
import * as ContextMenu from "./index"

let guard: ConsoleGuard

beforeEach(() => {
  guard = createConsoleGuard()
})
afterEach(() => {
  guard.restore()
  const c = document.getElementById("test-root")
  if (c) c.innerHTML = ""
})

function getContainer(): HTMLElement {
  let c = document.getElementById("test-root")
  if (!c) {
    c = document.createElement("div")
    c.id = "test-root"
    document.body.appendChild(c)
  }
  c.innerHTML = ""
  return c
}

describe("ContextMenu", () => {
  it("renders trigger with semantic attrs", () => {
    const container = getContainer()
    render(
      () => (
        <ContextMenu.Root>
          <ContextMenu.Trigger>Right click me</ContextMenu.Trigger>
          <ContextMenu.Content>
            <ContextMenu.Item>Cut</ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu.Root>
      ),
      container,
    )

    const trigger = container.querySelector("[data-scope='context-menu'][data-part='trigger']")!
    expect(trigger).not.toBeNull()
    expect(trigger.getAttribute("data-state")).toBe("closed")
  })

  it("does not render content by default", () => {
    const container = getContainer()
    render(
      () => (
        <ContextMenu.Root>
          <ContextMenu.Trigger>Right click me</ContextMenu.Trigger>
          <ContextMenu.Content>
            <ContextMenu.Item>Cut</ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu.Root>
      ),
      container,
    )

    const content = container.querySelector("[data-part='content']")
    expect(content).toBeNull()
  })

  it("renders items with role=menuitem when open", () => {
    const container = getContainer()
    render(
      () => (
        <ContextMenu.Root>
          <ContextMenu.Trigger>Right click me</ContextMenu.Trigger>
          <ContextMenu.Content>
            <ContextMenu.Item>Cut</ContextMenu.Item>
            <ContextMenu.Item>Copy</ContextMenu.Item>
            <ContextMenu.Item>Paste</ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu.Root>
      ),
      container,
    )

    // Simulate right-click to open
    const trigger = container.querySelector("[data-part='trigger']") as HTMLElement
    const event = new MouseEvent("contextmenu", { bubbles: true, cancelable: true })
    trigger.dispatchEvent(event)
    flush()

    const items = container.querySelectorAll("[role='menuitem']")
    expect(items.length).toBe(3)
  })

  it("produces no console errors on render", () => {
    const container = getContainer()
    render(
      () => (
        <ContextMenu.Root>
          <ContextMenu.Trigger>Right click me</ContextMenu.Trigger>
          <ContextMenu.Content>
            <ContextMenu.Item>Action</ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu.Root>
      ),
      container,
    )
    guard.assertClean()
  })
})
