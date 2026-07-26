/**
 * Browser-mode component tests for Listbox primitive.
 *
 * Tests rendering, keyboard navigation, selection, and verifies no
 * console errors/warnings from Solid 2 reactivity system.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { userEvent } from "vitest/browser"
import { render } from "@solidjs/web"
import { createConsoleGuard, type ConsoleGuard } from "@solidiom/runtime/testing/console-guard"
import * as Listbox from "./index"

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

// ─── Helpers ───────────────────────────────────────────────────────────────────

function renderListbox(props: { onValueChange?: (v: string[]) => void } = {}) {
  let container = document.getElementById("test-root")
  if (!container) {
    container = document.createElement("div")
    container.id = "test-root"
    document.body.appendChild(container)
  }
  container.innerHTML = ""

  const dispose = render(
    () => (
      <Listbox.Root selectionMode="single" onValueChange={props.onValueChange}>
        <Listbox.Item value="apple">Apple</Listbox.Item>
        <Listbox.Item value="banana">Banana</Listbox.Item>
        <Listbox.Item value="cherry">Cherry</Listbox.Item>
      </Listbox.Root>
    ),
    container,
  )

  return { container, dispose }
}

// ─── Tests ─────────────────────────────────────────────────────────────────────

describe("Listbox", () => {
  describe("rendering", () => {
    it("renders root with role=listbox", () => {
      const { container } = renderListbox()
      const listbox = container.querySelector("[role='listbox']")
      expect(listbox).not.toBeNull()
      expect(listbox!.getAttribute("aria-orientation")).toBe("vertical")
    })

    it("renders items with role=option", () => {
      const { container } = renderListbox()
      const options = container.querySelectorAll("[role='option']")
      expect(options.length).toBe(3)
    })

    it("produces no console errors or warnings on render", () => {
      renderListbox()
      guard.assertClean()
    })
  })

  describe("keyboard navigation", () => {
    it("activates first item on ArrowDown", async () => {
      const { container } = renderListbox()
      const listbox = container.querySelector("[role='listbox']") as HTMLElement

      listbox.focus()
      await userEvent.keyboard("{ArrowDown}")

      const options = container.querySelectorAll("[role='option']")
      expect(options[0]!.getAttribute("tabindex")).toBe("0")
    })

    it("moves to next item on second ArrowDown", async () => {
      const { container } = renderListbox()
      const listbox = container.querySelector("[role='listbox']") as HTMLElement

      listbox.focus()
      await userEvent.keyboard("{ArrowDown}")
      await userEvent.keyboard("{ArrowDown}")

      const options = container.querySelectorAll("[role='option']")
      expect(options[1]!.getAttribute("tabindex")).toBe("0")
    })

    it("jumps to first item with Home", async () => {
      const { container } = renderListbox()
      const listbox = container.querySelector("[role='listbox']") as HTMLElement

      listbox.focus()
      await userEvent.keyboard("{ArrowDown}")
      await userEvent.keyboard("{ArrowDown}")
      await userEvent.keyboard("{Home}")

      const options = container.querySelectorAll("[role='option']")
      expect(options[0]!.getAttribute("tabindex")).toBe("0")
    })

    it("jumps to last item with End", async () => {
      const { container } = renderListbox()
      const listbox = container.querySelector("[role='listbox']") as HTMLElement

      listbox.focus()
      await userEvent.keyboard("{End}")

      const options = container.querySelectorAll("[role='option']")
      expect(options[2]!.getAttribute("tabindex")).toBe("0")
    })
  })

  describe("selection", () => {
    it("selects an item on click", async () => {
      const values: string[][] = []
      const { container } = renderListbox({ onValueChange: (v) => values.push(v) })
      const options = container.querySelectorAll("[role='option']")

      await userEvent.click(options[1] as HTMLElement)

      expect(values.length).toBeGreaterThanOrEqual(1)
      expect(values[0]).toContain("banana")
    })

    it("selects an item on Enter key", async () => {
      const values: string[][] = []
      const { container } = renderListbox({ onValueChange: (v) => values.push(v) })
      const listbox = container.querySelector("[role='listbox']") as HTMLElement

      listbox.focus()
      await userEvent.keyboard("{ArrowDown}")
      await userEvent.keyboard("{Enter}")

      expect(values.length).toBeGreaterThanOrEqual(1)
    })

    it("sets aria-selected on the selected option", async () => {
      const { container } = renderListbox()
      const options = container.querySelectorAll("[role='option']")

      await userEvent.click(options[0] as HTMLElement)

      expect(options[0]!.getAttribute("aria-selected")).toBe("true")
    })
  })

  describe("no reactivity errors", () => {
    it("item registration does not trigger REACTIVE_WRITE_IN_OWNED_SCOPE", () => {
      renderListbox()
      guard.assertNoReactivityErrors()
    })

    it("no STRICT_READ_UNTRACKED warnings", () => {
      renderListbox()
      guard.assertNoUntrackedWarnings()
    })

    it("no REACTIVITY_HALTED errors", () => {
      renderListbox()
      guard.assertClean()
    })
  })
})
