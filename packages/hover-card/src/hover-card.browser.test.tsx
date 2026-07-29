/**
 * Browser-mode component tests for HoverCard primitive.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { render } from "@solidjs/web"
import { createConsoleGuard, type ConsoleGuard } from "@solidiom/runtime/testing/console-guard"
import * as HoverCard from "./index"
import type { PositioningPort } from "./hover-card-context"

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

describe("HoverCard", () => {
  it("renders trigger with semantic attrs", () => {
    const container = getContainer()
    render(
      () => (
        <HoverCard.Root>
          <HoverCard.Trigger>Hover me</HoverCard.Trigger>
          <HoverCard.Content>Preview</HoverCard.Content>
        </HoverCard.Root>
      ),
      container,
    )

    const trigger = container.querySelector("[data-scope='hover-card'][data-part='trigger']")!
    expect(trigger).not.toBeNull()
    expect(trigger.getAttribute("data-state")).toBe("closed")
  })

  it("does not render content by default", () => {
    const container = getContainer()
    render(
      () => (
        <HoverCard.Root>
          <HoverCard.Trigger>Hover me</HoverCard.Trigger>
          <HoverCard.Content>Preview</HoverCard.Content>
        </HoverCard.Root>
      ),
      container,
    )

    const content = container.querySelector("[data-part='content']")
    expect(content).toBeNull()
  })

  it("forwards class prop to trigger", () => {
    const container = getContainer()
    render(
      () => (
        <HoverCard.Root>
          <HoverCard.Trigger class="custom-trigger">Hover me</HoverCard.Trigger>
          <HoverCard.Content>Preview</HoverCard.Content>
        </HoverCard.Root>
      ),
      container,
    )

    const trigger = container.querySelector("[data-part='trigger']")!
    expect(trigger.classList.contains("custom-trigger")).toBe(true)
  })

  it("produces no console errors on render", () => {
    const container = getContainer()
    render(
      () => (
        <HoverCard.Root>
          <HoverCard.Trigger>Hover me</HoverCard.Trigger>
          <HoverCard.Content>Preview</HoverCard.Content>
        </HoverCard.Root>
      ),
      container,
    )
    guard.assertClean()
  })

  it("applies role=dialog and aria-describedby on the trigger when open", () => {
    const container = getContainer()
    let contentEl: HTMLElement | null = null

    render(
      () => (
        <HoverCard.Root openDelay={0} closeDelay={0}>
          <HoverCard.Trigger>Hover me</HoverCard.Trigger>
          <HoverCard.Content>Preview</HoverCard.Content>
        </HoverCard.Root>
      ),
      container,
    )

    const trigger = container.querySelector("[data-part='trigger']")!
    trigger.dispatchEvent(new Event("pointerenter"))

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        contentEl = container.querySelector("[data-part='content']")
        expect(contentEl).not.toBeNull()
        expect(contentEl!.getAttribute("role")).toBe("dialog")
        expect(trigger.getAttribute("aria-describedby")).toBe(contentEl!.id)
        resolve()
      }, 10)
    })
  })

  it("calls the positioning port with the trigger and content elements", () => {
    const container = getContainer()
    const update = vi.fn()
    const positioning: PositioningPort = { update }

    render(
      () => (
        <HoverCard.Root openDelay={0} closeDelay={0} positioning={positioning}>
          <HoverCard.Trigger>Hover me</HoverCard.Trigger>
          <HoverCard.Content>Preview</HoverCard.Content>
        </HoverCard.Root>
      ),
      container,
    )

    const trigger = container.querySelector("[data-part='trigger']")!
    trigger.dispatchEvent(new Event("pointerenter"))

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const content = container.querySelector("[data-part='content']")
        expect(update).toHaveBeenCalledTimes(1)
        expect(update).toHaveBeenCalledWith(trigger, content)
        resolve()
      }, 10)
    })
  })
})
