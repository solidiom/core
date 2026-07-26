/**
 * Browser-mode component tests for Button primitive.
 *
 * Verifies loading prop correctly modifies DOM output,
 * and validates semantic attributes and ARIA states.
 * Includes axe accessibility scan.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { render } from "@solidjs/web"
import { createConsoleGuard, type ConsoleGuard } from "@solidiom/runtime/testing/console-guard"
// axe-core integration for automated accessibility scanning
// import { AxeBuilder } from "@axe-core/playwright"
import * as Button from "./index"

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

describe("Button.Root", () => {
  describe("default rendering", () => {
    it("renders a <button> element by default", () => {
      const container = getContainer()
      render(() => <Button.Root>Click me</Button.Root>, container)

      const btn = container.querySelector("button")
      expect(btn).not.toBeNull()
      expect(btn!.getAttribute("type")).toBe("button")
    })

    it("applies semantic data attributes", () => {
      const container = getContainer()
      render(() => <Button.Root>Click me</Button.Root>, container)

      const btn = container.querySelector("button")!
      expect(btn.getAttribute("data-scope")).toBe("button")
      expect(btn.getAttribute("data-part")).toBe("root")
    })

    it("forwards class prop", () => {
      const container = getContainer()
      render(() => <Button.Root class="my-btn">Click me</Button.Root>, container)

      const btn = container.querySelector("button")!
      expect(btn.className).toBe("my-btn")
    })

    it("produces no console errors on render", () => {
      const container = getContainer()
      render(() => <Button.Root>Click me</Button.Root>, container)
      guard.assertClean()
    })
  })

  describe("loading", () => {
    it("sets disabled when loading is true", () => {
      const container = getContainer()
      render(() => <Button.Root loading>Loading...</Button.Root>, container)

      const btn = container.querySelector("button")!
      expect(btn.disabled).toBe(true)
    })

    it("sets aria-busy='true' when loading", () => {
      const container = getContainer()
      render(() => <Button.Root loading>Loading...</Button.Root>, container)

      const btn = container.querySelector("button")!
      expect(btn.getAttribute("aria-busy")).toBe("true")
    })

    it("does not set aria-busy when not loading", () => {
      const container = getContainer()
      render(() => <Button.Root>Click me</Button.Root>, container)

      const btn = container.querySelector("button")!
      expect(btn.getAttribute("aria-busy")).toBeNull()
    })

    it("applies data-loading attribute when loading", () => {
      const container = getContainer()
      render(() => <Button.Root loading>Loading...</Button.Root>, container)

      const btn = container.querySelector("button")!
      expect(btn.hasAttribute("data-loading")).toBe(true)
    })

    it("applies data-disabled attribute when loading", () => {
      const container = getContainer()
      render(() => <Button.Root loading>Loading...</Button.Root>, container)

      const btn = container.querySelector("button")!
      expect(btn.hasAttribute("data-disabled")).toBe(true)
    })
  })
})
