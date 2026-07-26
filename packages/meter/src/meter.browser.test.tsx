/**
 * Browser-mode component tests for Meter primitive.
 *
 * Verifies native meter element rendering, semantic data attributes,
 * data-value normalization, and data-status derivation from thresholds.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { render } from "@solidjs/web"
import { createConsoleGuard, type ConsoleGuard } from "@solidiom/runtime/testing/console-guard"
import * as Meter from "./index"

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

describe("Meter.Root", () => {
  it("renders a native meter element", () => {
    const container = getContainer()
    render(() => <Meter.Root value={0.5} />, container)

    const el = container.querySelector("meter")
    expect(el).not.toBeNull()
  })

  it("sets value, min, max attributes on the meter element", () => {
    const container = getContainer()
    render(() => <Meter.Root value={50} min={0} max={100} />, container)

    const el = container.querySelector("meter")!
    expect(el.getAttribute("value")).toBe("50")
    expect(el.getAttribute("min")).toBe("0")
    expect(el.getAttribute("max")).toBe("100")
  })

  it("sets low, high, optimum attributes when provided", () => {
    const container = getContainer()
    render(
      () => <Meter.Root value={75} min={0} max={100} low={25} high={75} optimum={100} />,
      container,
    )

    const el = container.querySelector("meter")!
    expect(el.getAttribute("low")).toBe("25")
    expect(el.getAttribute("high")).toBe("75")
    expect(el.getAttribute("optimum")).toBe("100")
  })

  it("applies semantic data attributes", () => {
    const container = getContainer()
    render(() => <Meter.Root value={0.7} />, container)

    const el = container.querySelector("meter")!
    expect(el.getAttribute("data-scope")).toBe("meter")
    expect(el.getAttribute("data-part")).toBe("root")
  })

  it("exposes normalized data-value between 0 and 1", () => {
    const container = getContainer()
    render(() => <Meter.Root value={50} min={0} max={100} />, container)

    const el = container.querySelector("meter")!
    expect(el.getAttribute("data-value")).toBe("0.50")
  })

  it("exposes data-status=safe when value is in optimal range (optimum high)", () => {
    const container = getContainer()
    render(
      () => <Meter.Root value={90} min={0} max={100} low={25} high={75} optimum={100} />,
      container,
    )

    const el = container.querySelector("meter")!
    expect(el.getAttribute("data-status")).toBe("safe")
    expect(el.getAttribute("data-state")).toBe("safe")
  })

  it("exposes data-status=caution when value is in middle range (optimum high)", () => {
    const container = getContainer()
    render(
      () => <Meter.Root value={50} min={0} max={100} low={25} high={75} optimum={100} />,
      container,
    )

    const el = container.querySelector("meter")!
    expect(el.getAttribute("data-status")).toBe("caution")
  })

  it("exposes data-status=danger when value is below low (optimum high)", () => {
    const container = getContainer()
    render(
      () => <Meter.Root value={10} min={0} max={100} low={25} high={75} optimum={100} />,
      container,
    )

    const el = container.querySelector("meter")!
    expect(el.getAttribute("data-status")).toBe("danger")
  })

  it("handles optimum low — low values are safe", () => {
    const container = getContainer()
    render(
      () => <Meter.Root value={10} min={0} max={100} low={25} high={75} optimum={0} />,
      container,
    )

    const el = container.querySelector("meter")!
    expect(el.getAttribute("data-status")).toBe("safe")
  })

  it("handles optimum low — high values are danger", () => {
    const container = getContainer()
    render(
      () => <Meter.Root value={90} min={0} max={100} low={25} high={75} optimum={0} />,
      container,
    )

    const el = container.querySelector("meter")!
    expect(el.getAttribute("data-status")).toBe("danger")
  })

  it("defaults to safe when no thresholds are provided", () => {
    const container = getContainer()
    render(() => <Meter.Root value={0.5} />, container)

    const el = container.querySelector("meter")!
    expect(el.getAttribute("data-status")).toBe("safe")
  })

  it("forwards class prop", () => {
    const container = getContainer()
    render(() => <Meter.Root value={0.5} class="my-meter" />, container)

    const el = container.querySelector("meter") as HTMLElement
    expect(el.className).toBe("my-meter")
  })

  it("renders children as fallback content", () => {
    const container = getContainer()
    render(() => <Meter.Root value={0.7}>70%</Meter.Root>, container)

    const el = container.querySelector("meter")!
    expect(el.textContent).toBe("70%")
  })

  it("produces no console errors on render", () => {
    const container = getContainer()
    render(
      () => <Meter.Root value={0.5} min={0} max={1} low={0.25} high={0.75} optimum={1} />,
      container,
    )
    guard.assertClean()
  })
})

describe("deriveMeterStatus", () => {
  it("returns safe when no thresholds", () => {
    expect(Meter.deriveMeterStatus(50)).toBe("safe")
  })

  it("returns safe when optimum high and value >= high", () => {
    expect(Meter.deriveMeterStatus(80, 25, 75, 100)).toBe("safe")
  })

  it("returns caution when optimum high and value between low and high", () => {
    expect(Meter.deriveMeterStatus(50, 25, 75, 100)).toBe("caution")
  })

  it("returns danger when optimum high and value < low", () => {
    expect(Meter.deriveMeterStatus(10, 25, 75, 100)).toBe("danger")
  })
})
