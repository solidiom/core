// @vitest-environment jsdom
import { describe, it, expect } from "vitest"
import { activateFocusScope } from "./focus-scope"

/**
 * Builds a minimal focusable container: a wrapper div holding a button (first
 * focusable), an input (second focusable), and a "trigger" button used as the
 * restore target. Returns the elements so tests can assert focus placement.
 */
function makeDom() {
  const wrapper = document.createElement("div")
  const first = document.createElement("button")
  first.textContent = "first"
  const second = document.createElement("input")
  const content = document.createElement("div")
  content.append(first, second)
  const trigger = document.createElement("button")
  trigger.textContent = "trigger"
  document.body.append(wrapper, content, trigger)
  return { wrapper, content, first, second, trigger }
}

describe("activateFocusScope", () => {
  it("moves focus into the container by default (no moveFocus option)", () => {
    const { content, first, trigger } = makeDom()
    trigger.focus()
    expect(document.activeElement).toBe(trigger)

    const deactivate = activateFocusScope({ element: () => content })

    expect(document.activeElement).toBe(first)

    deactivate()
  })

  it("keeps focus where it was when moveFocus is false (vaul drawer model)", () => {
    const { content, first, trigger } = makeDom()
    trigger.focus()
    expect(document.activeElement).toBe(trigger)

    const deactivate = activateFocusScope({
      element: () => content,
      moveFocus: false,
    })

    // Focus must NOT have moved into the content on activation.
    expect(document.activeElement).toBe(trigger)
    expect(document.activeElement).not.toBe(first)
    expect(content.contains(document.activeElement)).toBe(false)

    deactivate()
  })

  it("still restores focus to restoreTarget on cleanup when moveFocus is false", () => {
    const { content, first, trigger } = makeDom()
    // Focus something else (e.g. a content element, as if the user tabbed in).
    first.focus()
    expect(document.activeElement).toBe(first)

    const deactivate = activateFocusScope({
      element: () => content,
      moveFocus: false,
      restoreTarget: () => trigger,
    })

    // moveFocus:false — activation did not move focus; it stays on `first`.
    expect(document.activeElement).toBe(first)

    deactivate()
    // Cleanup restores focus to the explicit restoreTarget (the trigger).
    expect(document.activeElement).toBe(trigger)
  })

  it("still traps Tab within the container even when moveFocus is false", () => {
    const { content, first, trigger } = makeDom()
    trigger.focus()

    const deactivate = activateFocusScope({
      element: () => content,
      moveFocus: false,
    })

    // Simulate a user pressing Tab from the trigger: focus is outside the
    // container, so the trap should pull it to the first focusable element.
    const tab = new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true })
    document.dispatchEvent(tab)

    expect(document.activeElement).toBe(first)

    deactivate()
  })
})
