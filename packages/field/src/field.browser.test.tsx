/**
 * Browser-mode component tests for Field primitive.
 *
 * Verifies ARIA wiring between label, control, description, and error parts.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { render } from "@solidjs/web"
import { createConsoleGuard, type ConsoleGuard } from "@solidiom/runtime/testing/console-guard"
import * as Field from "./index"

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

describe("Field", () => {
  it("renders root with semantic attributes", () => {
    const container = getContainer()
    render(
      () => (
        <Field.Root>
          <Field.Label>Name</Field.Label>
          <Field.Control>{(props) => <input {...props()} />}</Field.Control>
        </Field.Root>
      ),
      container,
    )

    const root = container.querySelector("[data-scope='field'][data-part='root']")
    expect(root).not.toBeNull()
  })

  it("links label to control via for/id", () => {
    const container = getContainer()
    render(
      () => (
        <Field.Root>
          <Field.Label>Email</Field.Label>
          <Field.Control>{(props) => <input {...props()} />}</Field.Control>
        </Field.Root>
      ),
      container,
    )

    const label = container.querySelector("label")!
    const input = container.querySelector("input")!
    expect(label.getAttribute("for")).toBe(input.id)
  })

  it("sets aria-labelledby on control", () => {
    const container = getContainer()
    render(
      () => (
        <Field.Root>
          <Field.Label>Username</Field.Label>
          <Field.Control>{(props) => <input {...props()} />}</Field.Control>
        </Field.Root>
      ),
      container,
    )

    const label = container.querySelector("label")!
    const input = container.querySelector("input")!
    expect(input.getAttribute("aria-labelledby")).toBe(label.id)
  })

  it("shows description when valid and links via aria-describedby", () => {
    const container = getContainer()
    render(
      () => (
        <Field.Root>
          <Field.Label>Name</Field.Label>
          <Field.Control>{(props) => <input {...props()} />}</Field.Control>
          <Field.Description>Enter your full name.</Field.Description>
        </Field.Root>
      ),
      container,
    )

    const desc = container.querySelector("[data-part='description']")!
    const input = container.querySelector("input")!
    expect(desc).not.toBeNull()
    expect(input.getAttribute("aria-describedby")).toBe(desc.id)
  })

  it("shows error when invalid and links via aria-describedby", () => {
    const container = getContainer()
    render(
      () => (
        <Field.Root invalid>
          <Field.Label>Name</Field.Label>
          <Field.Control>{(props) => <input {...props()} />}</Field.Control>
          <Field.Description>Enter your full name.</Field.Description>
          <Field.Error>Name is required.</Field.Error>
        </Field.Root>
      ),
      container,
    )

    const error = container.querySelector("[data-part='error']")!
    const input = container.querySelector("input")!
    const desc = container.querySelector("[data-part='description']")

    expect(error).not.toBeNull()
    expect(error.textContent).toBe("Name is required.")
    expect(error.getAttribute("role")).toBe("alert")
    expect(input.getAttribute("aria-describedby")).toBe(error.id)
    // Description is hidden when invalid
    expect(desc).toBeNull()
  })

  it("sets aria-invalid on control when invalid", () => {
    const container = getContainer()
    render(
      () => (
        <Field.Root invalid>
          <Field.Label>Name</Field.Label>
          <Field.Control>{(props) => <input {...props()} />}</Field.Control>
        </Field.Root>
      ),
      container,
    )

    const input = container.querySelector("input")!
    expect(input.getAttribute("aria-invalid")).toBe("true")
  })

  it("sets aria-required on control when required", () => {
    const container = getContainer()
    render(
      () => (
        <Field.Root required>
          <Field.Label>Name</Field.Label>
          <Field.Control>{(props) => <input {...props()} />}</Field.Control>
        </Field.Root>
      ),
      container,
    )

    const input = container.querySelector("input")!
    expect(input.getAttribute("aria-required")).toBe("true")
  })

  it("sets data-disabled on root and label when disabled", () => {
    const container = getContainer()
    render(
      () => (
        <Field.Root disabled>
          <Field.Label>Name</Field.Label>
          <Field.Control>{(props) => <input {...props()} />}</Field.Control>
        </Field.Root>
      ),
      container,
    )

    const root = container.querySelector("[data-part='root']")!
    const label = container.querySelector("[data-part='label']")!
    expect(root.hasAttribute("data-disabled")).toBe(true)
    expect(label.hasAttribute("data-disabled")).toBe(true)
  })

  it("produces no console errors on render", () => {
    const container = getContainer()
    render(
      () => (
        <Field.Root>
          <Field.Label>Name</Field.Label>
          <Field.Control>{(props) => <input {...props()} />}</Field.Control>
        </Field.Root>
      ),
      container,
    )
    guard.assertClean()
  })
})
