/**
 * Browser-mode component tests for Label primitive.
 *
 * Verifies semantic attributes, htmlFor association, and state flags.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { render } from "@solidjs/web"
import { createConsoleGuard, type ConsoleGuard } from "@solidiom/runtime/testing/console-guard"
import * as Label from "./index"

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

describe("Label.Root", () => {
  it("renders a <label> element", () => {
    const container = getContainer()
    render(() => <Label.Root>Username</Label.Root>, container)

    const label = container.querySelector("label")
    expect(label).not.toBeNull()
    expect(label!.textContent).toBe("Username")
  })

  it("applies semantic data attributes", () => {
    const container = getContainer()
    render(() => <Label.Root>Name</Label.Root>, container)

    const label = container.querySelector("label")!
    expect(label.getAttribute("data-scope")).toBe("label")
    expect(label.getAttribute("data-part")).toBe("root")
  })

  it("sets for attribute from htmlFor prop", () => {
    const container = getContainer()
    render(() => <Label.Root htmlFor="email-input">Email</Label.Root>, container)

    const label = container.querySelector("label")!
    expect(label.getAttribute("for")).toBe("email-input")
  })

  it("forwards class prop", () => {
    const container = getContainer()
    render(() => <Label.Root class="my-label">Test</Label.Root>, container)

    const label = container.querySelector("label")!
    expect(label.className).toBe("my-label")
  })

  it("sets data-disabled when disabled", () => {
    const container = getContainer()
    render(() => <Label.Root disabled>Disabled field</Label.Root>, container)

    const label = container.querySelector("label")!
    expect(label.hasAttribute("data-disabled")).toBe(true)
  })

  it("sets data-required when required", () => {
    const container = getContainer()
    render(() => <Label.Root required>Required field</Label.Root>, container)

    const label = container.querySelector("label")!
    expect(label.hasAttribute("data-required")).toBe(true)
  })

  it("sets data-invalid when invalid", () => {
    const container = getContainer()
    render(() => <Label.Root invalid>Invalid field</Label.Root>, container)

    const label = container.querySelector("label")!
    expect(label.hasAttribute("data-invalid")).toBe(true)
  })

  it("produces no console errors on render", () => {
    const container = getContainer()
    render(() => <Label.Root>Clean</Label.Root>, container)
    guard.assertClean()
  })
})
