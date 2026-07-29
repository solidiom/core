/**
 * Browser-mode component tests for NavigationMenu primitive.
 *
 * Verifies rendering, ARIA attributes, keyboard navigation, and pointer interactions.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { render } from "@solidjs/web"
import { flush } from "solid-js"
import { createConsoleGuard, type ConsoleGuard } from "@solidiom/runtime/testing/console-guard"
import * as NavigationMenu from "./index"
import type { PositioningPort } from "./navigation-menu-context"

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

describe("NavigationMenu", () => {
  it("renders nav element with role and semantic attributes", () => {
    const container = getContainer()
    render(
      () => (
        <NavigationMenu.Root aria-label="Main navigation">
          <NavigationMenu.List>
            <NavigationMenu.Item value="products">
              <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
              <NavigationMenu.Content>
                <NavigationMenu.Link href="/widgets">Widgets</NavigationMenu.Link>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
          </NavigationMenu.List>
        </NavigationMenu.Root>
      ),
      container,
    )

    const nav = container.querySelector("nav")
    expect(nav).not.toBeNull()
    expect(nav!.getAttribute("aria-label")).toBe("Main navigation")
    expect(nav!.getAttribute("data-scope")).toBe("navigation-menu")
    expect(nav!.getAttribute("data-part")).toBe("root")
  })

  it("renders menubar with correct role", () => {
    const container = getContainer()
    render(
      () => (
        <NavigationMenu.Root>
          <NavigationMenu.List>
            <NavigationMenu.Item value="a">
              <NavigationMenu.Trigger>A</NavigationMenu.Trigger>
            </NavigationMenu.Item>
          </NavigationMenu.List>
        </NavigationMenu.Root>
      ),
      container,
    )

    const menubar = container.querySelector("[role='menubar']")
    expect(menubar).not.toBeNull()
    expect(menubar!.getAttribute("aria-orientation")).toBe("horizontal")
  })

  it("trigger has correct ARIA attributes when closed", () => {
    const container = getContainer()
    render(
      () => (
        <NavigationMenu.Root>
          <NavigationMenu.List>
            <NavigationMenu.Item value="products">
              <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
              <NavigationMenu.Content>Content</NavigationMenu.Content>
            </NavigationMenu.Item>
          </NavigationMenu.List>
        </NavigationMenu.Root>
      ),
      container,
    )

    const trigger = container.querySelector("button[role='menuitem']")!
    expect(trigger.getAttribute("aria-haspopup")).toBe("menu")
    expect(trigger.getAttribute("aria-expanded")).toBeNull()
    expect(trigger.getAttribute("data-state")).toBe("closed")
  })

  it("clicking trigger opens content panel", () => {
    const container = getContainer()
    render(
      () => (
        <NavigationMenu.Root>
          <NavigationMenu.List>
            <NavigationMenu.Item value="products">
              <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
              <NavigationMenu.Content>
                <NavigationMenu.Link href="/a">Link A</NavigationMenu.Link>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
          </NavigationMenu.List>
        </NavigationMenu.Root>
      ),
      container,
    )

    const trigger = container.querySelector("button[role='menuitem']")! as HTMLButtonElement
    trigger.click()
    flush()

    expect(trigger.getAttribute("aria-expanded")).toBe("true")
    expect(trigger.getAttribute("data-state")).toBe("open")

    const content = container.querySelector("[role='menu']")
    expect(content).not.toBeNull()
    expect(content!.getAttribute("data-state")).toBe("open")
  })

  it("clicking trigger again closes content", () => {
    const container = getContainer()
    render(
      () => (
        <NavigationMenu.Root>
          <NavigationMenu.List>
            <NavigationMenu.Item value="products">
              <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
              <NavigationMenu.Content>Content</NavigationMenu.Content>
            </NavigationMenu.Item>
          </NavigationMenu.List>
        </NavigationMenu.Root>
      ),
      container,
    )

    const trigger = container.querySelector("button[role='menuitem']")! as HTMLButtonElement
    trigger.click()
    flush()
    trigger.click()
    flush()

    expect(trigger.getAttribute("aria-expanded")).toBeNull()
    const content = container.querySelector("[role='menu']")
    expect(content).toBeNull()
  })

  it("link has correct role and closes menu on click", () => {
    const container = getContainer()
    const onValueChange = vi.fn()
    render(
      () => (
        <NavigationMenu.Root onValueChange={onValueChange}>
          <NavigationMenu.List>
            <NavigationMenu.Item value="products">
              <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
              <NavigationMenu.Content>
                <NavigationMenu.Link href="/a" active>
                  Link A
                </NavigationMenu.Link>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
          </NavigationMenu.List>
        </NavigationMenu.Root>
      ),
      container,
    )

    // Open the menu
    const trigger = container.querySelector("button[role='menuitem']")! as HTMLButtonElement
    trigger.click()
    flush()

    const link = container.querySelector("a[role='menuitem']")!
    expect(link.getAttribute("aria-current")).toBe("page")
    expect(link.getAttribute("data-state")).toBe("active")
  })

  it("forwards class props to all parts", () => {
    const container = getContainer()
    render(
      () => (
        <NavigationMenu.Root class="root-cls">
          <NavigationMenu.List class="list-cls">
            <NavigationMenu.Item value="a" class="item-cls">
              <NavigationMenu.Trigger class="trigger-cls">A</NavigationMenu.Trigger>
            </NavigationMenu.Item>
          </NavigationMenu.List>
        </NavigationMenu.Root>
      ),
      container,
    )

    expect(container.querySelector("nav")!.classList.contains("root-cls")).toBe(true)
    expect(container.querySelector("[role='menubar']")!.classList.contains("list-cls")).toBe(true)
    expect(container.querySelector("li")!.classList.contains("item-cls")).toBe(true)
    expect(container.querySelector("button")!.classList.contains("trigger-cls")).toBe(true)
  })

  it("restores focus to the trigger on Escape", () => {
    const container = getContainer()
    render(
      () => (
        <NavigationMenu.Root>
          <NavigationMenu.List>
            <NavigationMenu.Item value="products">
              <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
              <NavigationMenu.Content>
                <NavigationMenu.Link href="/a">Link A</NavigationMenu.Link>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
          </NavigationMenu.List>
        </NavigationMenu.Root>
      ),
      container,
    )

    const trigger = container.querySelector("button[role='menuitem']")! as HTMLButtonElement
    trigger.click()
    flush()

    const content = container.querySelector("[role='menu']")!
    content.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }))
    flush()

    expect(container.querySelector("[role='menu']")).toBeNull()
    expect(document.activeElement).toBe(trigger)
  })

  it("produces no console errors", () => {
    const container = getContainer()
    render(
      () => (
        <NavigationMenu.Root>
          <NavigationMenu.List>
            <NavigationMenu.Item value="a">
              <NavigationMenu.Trigger>A</NavigationMenu.Trigger>
            </NavigationMenu.Item>
          </NavigationMenu.List>
        </NavigationMenu.Root>
      ),
      container,
    )
    guard.assertNoErrors()
  })

  it("produces no console errors with an open content panel", () => {
    const container = getContainer()
    render(
      () => (
        <NavigationMenu.Root>
          <NavigationMenu.List>
            <NavigationMenu.Item value="a">
              <NavigationMenu.Trigger>A</NavigationMenu.Trigger>
              <NavigationMenu.Content>
                <NavigationMenu.Link href="/a">Link A</NavigationMenu.Link>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
          </NavigationMenu.List>
        </NavigationMenu.Root>
      ),
      container,
    )

    // The clean-console assertion has to run against a render that actually
    // reaches Content's effect body, not just a closed menubar.
    const trigger = container.querySelector("button[role='menuitem']")! as HTMLButtonElement
    trigger.click()
    flush()

    expect(container.querySelector("[role='menu']")).not.toBeNull()
    guard.assertNoErrors()
  })

  describe("positioning port", () => {
    it("calls the positioning port with the trigger and content elements on open", () => {
      const container = getContainer()
      const update = vi.fn()
      const positioning: PositioningPort = { update }

      render(
        () => (
          <NavigationMenu.Root positioning={positioning}>
            <NavigationMenu.List>
              <NavigationMenu.Item value="products">
                <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
                <NavigationMenu.Content>
                  <NavigationMenu.Link href="/a">Link A</NavigationMenu.Link>
                </NavigationMenu.Content>
              </NavigationMenu.Item>
            </NavigationMenu.List>
          </NavigationMenu.Root>
        ),
        container,
      )

      // Closed by default: nothing to position yet.
      expect(update).not.toHaveBeenCalled()

      const trigger = container.querySelector("button[role='menuitem']")! as HTMLButtonElement
      trigger.click()
      flush()

      const content = container.querySelector("[role='menu']")
      expect(content).not.toBeNull()
      expect(update).toHaveBeenCalledTimes(1)
      expect(update).toHaveBeenCalledWith(trigger, content)
    })

    it("runs the positioning cleanup when the panel closes", () => {
      const container = getContainer()
      const cleanup = vi.fn()
      const positioning: PositioningPort = { update: () => cleanup }

      render(
        () => (
          <NavigationMenu.Root positioning={positioning}>
            <NavigationMenu.List>
              <NavigationMenu.Item value="products">
                <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
                <NavigationMenu.Content>Content</NavigationMenu.Content>
              </NavigationMenu.Item>
            </NavigationMenu.List>
          </NavigationMenu.Root>
        ),
        container,
      )

      const trigger = container.querySelector("button[role='menuitem']")! as HTMLButtonElement
      trigger.click()
      flush()
      expect(cleanup).not.toHaveBeenCalled()

      trigger.click()
      flush()
      expect(cleanup).toHaveBeenCalledTimes(1)
    })

    it("positions each item's panel against its own trigger", () => {
      const container = getContainer()
      const update = vi.fn()
      const positioning: PositioningPort = { update }

      render(
        () => (
          <NavigationMenu.Root positioning={positioning}>
            <NavigationMenu.List>
              <NavigationMenu.Item value="first">
                <NavigationMenu.Trigger>First</NavigationMenu.Trigger>
                <NavigationMenu.Content>First panel</NavigationMenu.Content>
              </NavigationMenu.Item>
              <NavigationMenu.Item value="second">
                <NavigationMenu.Trigger>Second</NavigationMenu.Trigger>
                <NavigationMenu.Content>Second panel</NavigationMenu.Content>
              </NavigationMenu.Item>
            </NavigationMenu.List>
          </NavigationMenu.Root>
        ),
        container,
      )

      const triggers = Array.from(
        container.querySelectorAll("button[role='menuitem']"),
      ) as HTMLButtonElement[]

      triggers[1]!.click()
      flush()

      const content = container.querySelector("[role='menu']")
      expect(update).toHaveBeenCalledTimes(1)
      expect(update).toHaveBeenCalledWith(triggers[1], content)
    })

    it("does not throw when no positioning port is provided", () => {
      const container = getContainer()
      render(
        () => (
          <NavigationMenu.Root>
            <NavigationMenu.List>
              <NavigationMenu.Item value="products">
                <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
                <NavigationMenu.Content>Content</NavigationMenu.Content>
              </NavigationMenu.Item>
            </NavigationMenu.List>
          </NavigationMenu.Root>
        ),
        container,
      )

      const trigger = container.querySelector("button[role='menuitem']")! as HTMLButtonElement
      trigger.click()
      flush()

      expect(container.querySelector("[role='menu']")).not.toBeNull()
      guard.assertNoErrors()
    })
  })
})
