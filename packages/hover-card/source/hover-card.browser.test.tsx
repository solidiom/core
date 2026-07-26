/**
 * Browser-mode component tests for HoverCard primitive.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { render } from "@solidjs/web"
import { createConsoleGuard, type ConsoleGuard } from "@solidiom/runtime/testing/console-guard"
import * as HoverCard from "./index"

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
})
