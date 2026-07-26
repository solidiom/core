/**
 * Browser-mode component tests for Alert primitive.
 *
 * Verifies live region roles, ARIA relationships between Title/Description,
 * semantic data attributes, and non-focus-stealing behavior.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { render } from "@solidjs/web"
import { createConsoleGuard, type ConsoleGuard } from "@solidiom/runtime/testing/console-guard"
import * as Alert from "./index"

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

describe("Alert.Root", () => {
  it("renders with role=alert by default (assertive)", () => {
    const container = getContainer()
    render(
      () => (
        <Alert.Root>
          <Alert.Title>Error</Alert.Title>
          <Alert.Description>Something went wrong.</Alert.Description>
        </Alert.Root>
      ),
      container,
    )

    const el = container.querySelector("[role='alert']")
    expect(el).not.toBeNull()
  })

  it("renders with role=status when assertiveness is polite", () => {
    const container = getContainer()
    render(
      () => (
        <Alert.Root assertiveness="polite">
          <Alert.Title>Info</Alert.Title>
          <Alert.Description>Update available.</Alert.Description>
        </Alert.Root>
      ),
      container,
    )

    const el = container.querySelector("[role='status']")
    expect(el).not.toBeNull()
  })

  it("applies semantic data attributes with state from type", () => {
    const container = getContainer()
    render(
      () => (
        <Alert.Root type="warning">
          <Alert.Title>Warning</Alert.Title>
          <Alert.Description>Check your input.</Alert.Description>
        </Alert.Root>
      ),
      container,
    )

    const el = container.querySelector("[role='alert']")!
    expect(el.getAttribute("data-scope")).toBe("alert")
    expect(el.getAttribute("data-part")).toBe("root")
    expect(el.getAttribute("data-state")).toBe("warning")
  })

  it("defaults data-state to info when no type is specified", () => {
    const container = getContainer()
    render(
      () => (
        <Alert.Root>
          <Alert.Title>Notice</Alert.Title>
          <Alert.Description>Default info alert.</Alert.Description>
        </Alert.Root>
      ),
      container,
    )

    const el = container.querySelector("[role='alert']")!
    expect(el.getAttribute("data-state")).toBe("info")
  })

  it("wires aria-labelledby to Title id", () => {
    const container = getContainer()
    render(
      () => (
        <Alert.Root>
          <Alert.Title>Title</Alert.Title>
          <Alert.Description>Desc</Alert.Description>
        </Alert.Root>
      ),
      container,
    )

    const root = container.querySelector("[role='alert']")!
    const title = container.querySelector("[data-part='title']")!
    const labelledBy = root.getAttribute("aria-labelledby")
    expect(labelledBy).toBe(title.id)
  })

  it("wires aria-describedby to Description id", () => {
    const container = getContainer()
    render(
      () => (
        <Alert.Root>
          <Alert.Title>Title</Alert.Title>
          <Alert.Description>Desc</Alert.Description>
        </Alert.Root>
      ),
      container,
    )

    const root = container.querySelector("[role='alert']")!
    const desc = container.querySelector("[data-part='description']")!
    const describedBy = root.getAttribute("aria-describedby")
    expect(describedBy).toBe(desc.id)
  })

  it("does not steal focus when rendered", () => {
    const container = getContainer()
    const button = document.createElement("button")
    button.textContent = "Focus me"
    container.appendChild(button)
    button.focus()

    render(
      () => (
        <Alert.Root type="error">
          <Alert.Title>Error</Alert.Title>
          <Alert.Description>Critical failure.</Alert.Description>
        </Alert.Root>
      ),
      container,
    )

    expect(document.activeElement).toBe(button)
  })

  it("forwards class prop on Root", () => {
    const container = getContainer()
    render(
      () => (
        <Alert.Root class="my-alert">
          <Alert.Title>T</Alert.Title>
          <Alert.Description>D</Alert.Description>
        </Alert.Root>
      ),
      container,
    )

    const el = container.querySelector("[role='alert']") as HTMLElement
    expect(el.className).toBe("my-alert")
  })

  it("produces no console errors on render", () => {
    const container = getContainer()
    render(
      () => (
        <Alert.Root type="success">
          <Alert.Title>Success</Alert.Title>
          <Alert.Description>Operation completed.</Alert.Description>
        </Alert.Root>
      ),
      container,
    )
    guard.assertClean()
  })
})

describe("Alert.Title", () => {
  it("renders an h5 with semantic attrs", () => {
    const container = getContainer()
    render(
      () => (
        <Alert.Root>
          <Alert.Title class="title-class">My Title</Alert.Title>
          <Alert.Description>Desc</Alert.Description>
        </Alert.Root>
      ),
      container,
    )

    const title = container.querySelector("h5")!
    expect(title.textContent).toBe("My Title")
    expect(title.getAttribute("data-scope")).toBe("alert")
    expect(title.getAttribute("data-part")).toBe("title")
    expect(title.className).toBe("title-class")
  })
})

describe("Alert.Description", () => {
  it("renders a div with semantic attrs", () => {
    const container = getContainer()
    render(
      () => (
        <Alert.Root>
          <Alert.Title>T</Alert.Title>
          <Alert.Description class="desc-class">My description</Alert.Description>
        </Alert.Root>
      ),
      container,
    )

    const desc = container.querySelector("[data-part='description']")!
    expect(desc.textContent).toBe("My description")
    expect(desc.getAttribute("data-scope")).toBe("alert")
    expect(desc.className).toBe("desc-class")
  })
})
