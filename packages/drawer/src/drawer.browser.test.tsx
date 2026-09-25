/**
 * Browser-mode component tests for the Drawer primitive.
 *
 * Verifies the vaul drawer focus model: on open, focus is KEPT on the trigger
 * (not moved into the content); Tab still traps within the content; and on
 * close (Escape), focus is restored to the trigger.
 *
 * The drawer content portals to <body>, so teardown clears the whole body
 * (not just the render container) — otherwise the trigger leaks between tests
 * and `document.activeElement` resolves to a stale element.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { render } from "@solidjs/web"
import { flush } from "solid-js"
import { createConsoleGuard, type ConsoleGuard } from "@solidiom/runtime/testing/console-guard"
import * as Drawer from "./index"

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

function renderDrawer(container: HTMLElement) {
  render(
    () => (
      <Drawer.Root>
        <Drawer.Trigger>Open drawer</Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Title>Drawer title</Drawer.Title>
          <Drawer.Description>Drawer description</Drawer.Description>
          <Drawer.Close>Close drawer</Drawer.Close>
        </Drawer.Content>
      </Drawer.Root>
    ),
    container,
  )
}

const triggerSel = "[data-scope='drawer'][data-part='trigger']"
const contentSel = "[data-scope='drawer'][data-part='content']"
const closeSel = "[data-scope='drawer'][data-part='close']"

// ─── Tests ─────────────────────────────────────────────────────────────────────

describe("Drawer (vaul focus model)", () => {
  it("keeps focus on the trigger when the drawer opens (does NOT move into content)", async () => {
    const container = getContainer()
    renderDrawer(container)

    const trigger = document.querySelector(triggerSel) as HTMLElement
    trigger.focus()
    trigger.click()
    flush()
    await Promise.resolve()

    const content = document.querySelector(contentSel)
    expect(content).not.toBeNull()
    // The vaul model: focus stays on the trigger, not in the content.
    expect(document.activeElement).toBe(trigger)
    expect(content!.contains(document.activeElement)).toBe(false)
  })

  it("traps Tab into the content once the user tabs in (focus capture still active)", async () => {
    const container = getContainer()
    renderDrawer(container)

    const trigger = document.querySelector(triggerSel) as HTMLElement
    trigger.focus()
    trigger.click()
    flush()
    await Promise.resolve()

    expect(document.activeElement).toBe(trigger)

    // User presses Tab from the trigger: focus is outside the container, so
    // the trap pulls it to the first focusable element (the Close button).
    const tab = new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true })
    document.dispatchEvent(tab)
    flush()
    await Promise.resolve()

    const close = document.querySelector(closeSel) as HTMLElement
    expect(close).not.toBeNull()
    expect(document.activeElement).toBe(close)
  })

  it("restores focus to the trigger when the drawer closes (Escape)", async () => {
    const container = getContainer()
    renderDrawer(container)

    const trigger = document.querySelector(triggerSel) as HTMLElement
    trigger.focus()
    trigger.click()
    flush()
    await Promise.resolve()

    expect(document.activeElement).toBe(trigger)

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }))
    flush()
    await Promise.resolve()

    const content = document.querySelector(contentSel)
    expect(content).toBeNull()
    expect(document.activeElement).toBe(trigger)
  })

  it("produces no console errors or reactivity errors on open/close", async () => {
    const container = getContainer()
    renderDrawer(container)

    const trigger = document.querySelector(triggerSel) as HTMLElement
    trigger.focus()
    trigger.click()
    flush()
    await Promise.resolve()

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }))
    flush()
    await Promise.resolve()

    guard.assertNoErrors()
    guard.assertNoReactivityErrors()
  })
})
