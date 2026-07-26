/**
 * Browser-mode component tests for Input primitive.
 *
 * Verifies semantic attributes, validation states, and event handling.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { render } from "@solidjs/web"
import { createConsoleGuard, type ConsoleGuard } from "@solidiom/runtime/testing/console-guard"
import * as Input from "./index"

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

// ─── Input.Root Tests ──────────────────────────────────────────────────────────

describe("Input.Root", () => {
  it("renders an <input> element with type=text by default", () => {
    const container = getContainer()
    render(() => <Input.Root />, container)

    const input = container.querySelector("input")
    expect(input).not.toBeNull()
    expect(input!.getAttribute("type")).toBe("text")
  })

  it("applies semantic data attributes", () => {
    const container = getContainer()
    render(() => <Input.Root />, container)

    const input = container.querySelector("input")!
    expect(input.getAttribute("data-scope")).toBe("input")
    expect(input.getAttribute("data-part")).toBe("root")
  })

  it("forwards class prop", () => {
    const container = getContainer()
    render(() => <Input.Root class="my-input" />, container)

    const input = container.querySelector("input")!
    expect(input.className).toBe("my-input")
  })

  it("sets data-disabled when disabled", () => {
    const container = getContainer()
    render(() => <Input.Root disabled />, container)

    const input = container.querySelector("input")!
    expect(input.hasAttribute("data-disabled")).toBe(true)
    expect(input.disabled).toBe(true)
  })

  it("sets data-invalid and aria-invalid when invalid", () => {
    const container = getContainer()
    render(() => <Input.Root invalid />, container)

    const input = container.querySelector("input")!
    expect(input.hasAttribute("data-invalid")).toBe(true)
    expect(input.getAttribute("aria-invalid")).toBe("true")
  })

  it("sets data-readonly when readOnly", () => {
    const container = getContainer()
    render(() => <Input.Root readOnly />, container)

    const input = container.querySelector("input")!
    expect(input.hasAttribute("data-readonly")).toBe(true)
    expect(input.readOnly).toBe(true)
  })

  it("sets data-required and aria-required when required", () => {
    const container = getContainer()
    render(() => <Input.Root required />, container)

    const input = container.querySelector("input")!
    expect(input.hasAttribute("data-required")).toBe(true)
    expect(input.getAttribute("aria-required")).toBe("true")
  })

  it("calls onValueChange on input", () => {
    const container = getContainer()
    const onChange = vi.fn()
    render(() => <Input.Root onValueChange={onChange} />, container)

    const input = container.querySelector("input")!
    input.value = "hello"
    input.dispatchEvent(new InputEvent("input", { bubbles: true }))
    expect(onChange).toHaveBeenCalledWith("hello")
  })

  it("produces no console errors on render", () => {
    const container = getContainer()
    render(() => <Input.Root />, container)
    guard.assertClean()
  })
})

// ─── Input.Textarea Tests ──────────────────────────────────────────────────────

describe("Input.Textarea", () => {
  it("renders a <textarea> element", () => {
    const container = getContainer()
    render(() => <Input.Textarea />, container)

    const textarea = container.querySelector("textarea")
    expect(textarea).not.toBeNull()
  })

  it("applies semantic data attributes with part=textarea", () => {
    const container = getContainer()
    render(() => <Input.Textarea />, container)

    const textarea = container.querySelector("textarea")!
    expect(textarea.getAttribute("data-scope")).toBe("input")
    expect(textarea.getAttribute("data-part")).toBe("textarea")
  })

  it("sets rows attribute", () => {
    const container = getContainer()
    render(() => <Input.Textarea rows={5} />, container)

    const textarea = container.querySelector("textarea")!
    expect(textarea.rows).toBe(5)
  })

  it("calls onValueChange on input", () => {
    const container = getContainer()
    const onChange = vi.fn()
    render(() => <Input.Textarea onValueChange={onChange} />, container)

    const textarea = container.querySelector("textarea")!
    textarea.value = "world"
    textarea.dispatchEvent(new InputEvent("input", { bubbles: true }))
    expect(onChange).toHaveBeenCalledWith("world")
  })
})
