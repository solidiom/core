/**
 * Browser-mode component tests for Progress primitive.
 *
 * Verifies ARIA progressbar attributes, determinate/indeterminate states,
 * and semantic data attributes.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { render } from "@solidjs/web"
import { createConsoleGuard, type ConsoleGuard } from "@solidiom/runtime/testing/console-guard"
import * as Progress from "./index"

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

describe("Progress.Root", () => {
  it("renders role=progressbar with aria-valuenow", () => {
    const container = getContainer()
    render(() => <Progress.Root value={40} aria-label="Loading" />, container)

    const el = container.querySelector("[role='progressbar']")!
    expect(el).not.toBeNull()
    expect(el.getAttribute("aria-valuenow")).toBe("40")
    expect(el.getAttribute("aria-valuemin")).toBe("0")
    expect(el.getAttribute("aria-valuemax")).toBe("100")
  })

  it("applies semantic data attributes", () => {
    const container = getContainer()
    render(() => <Progress.Root value={50} aria-label="Loading" />, container)

    const el = container.querySelector("[role='progressbar']")!
    expect(el.getAttribute("data-scope")).toBe("progress")
    expect(el.getAttribute("data-part")).toBe("root")
    expect(el.getAttribute("data-state")).toBe("loading")
  })

  it("sets data-state=complete when value reaches max", () => {
    const container = getContainer()
    render(() => <Progress.Root value={100} aria-label="Done" />, container)

    const el = container.querySelector("[role='progressbar']")!
    expect(el.getAttribute("data-state")).toBe("complete")
  })

  it("handles indeterminate state (value=null)", () => {
    const container = getContainer()
    render(() => <Progress.Root value={null} aria-label="Loading" />, container)

    const el = container.querySelector("[role='progressbar']")!
    expect(el.getAttribute("aria-valuenow")).toBeNull()
    expect(el.getAttribute("data-state")).toBe("loading")
  })

  it("supports custom max value", () => {
    const container = getContainer()
    render(() => <Progress.Root value={5} max={10} aria-label="Steps" />, container)

    const el = container.querySelector("[role='progressbar']")!
    expect(el.getAttribute("aria-valuemax")).toBe("10")
    expect(el.getAttribute("data-max")).toBe("10")
  })

  it("forwards class prop", () => {
    const container = getContainer()
    render(() => <Progress.Root value={0} class="my-progress" aria-label="P" />, container)

    const el = container.querySelector("[role='progressbar']")!
    expect((el as HTMLElement).className).toContain("my-progress")
  })

  it("produces no console errors", () => {
    const container = getContainer()
    render(() => <Progress.Root value={50} aria-label="Test" />, container)
    guard.assertClean()
  })
})

describe("Progress.Indicator", () => {
  it("renders with semantic attributes", () => {
    const container = getContainer()
    render(
      () => (
        <Progress.Root value={75} aria-label="Loading">
          <Progress.Indicator />
        </Progress.Root>
      ),
      container,
    )

    const indicator = container.querySelector("[data-scope='progress'][data-part='indicator']")
    expect(indicator).not.toBeNull()
  })
})
