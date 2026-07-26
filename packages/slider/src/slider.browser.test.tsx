/**
 * Browser-mode component tests for Slider primitive.
 *
 * Verifies ARIA attributes, keyboard navigation, semantic data attributes,
 * and value computation.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { render } from "@solidjs/web"
import { createConsoleGuard, type ConsoleGuard } from "@solidiom/runtime/testing/console-guard"
import * as Slider from "./index"

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

describe("Slider", () => {
  it("renders root with semantic data attributes", () => {
    const container = getContainer()
    render(
      () => (
        <Slider.Root defaultValue={[50]}>
          <Slider.Track>
            <Slider.Range />
            <Slider.Thumb index={0} aria-label="Volume" />
          </Slider.Track>
        </Slider.Root>
      ),
      container,
    )

    const root = container.querySelector("[data-scope='slider'][data-part='root']")
    expect(root).not.toBeNull()
    expect(root!.getAttribute("data-orientation")).toBe("horizontal")
  })

  it("renders thumb with role=slider and correct ARIA values", () => {
    const container = getContainer()
    render(
      () => (
        <Slider.Root defaultValue={[25]} min={0} max={100} step={5}>
          <Slider.Track>
            <Slider.Range />
            <Slider.Thumb index={0} aria-label="Volume" />
          </Slider.Track>
        </Slider.Root>
      ),
      container,
    )

    const thumb = container.querySelector("[role='slider']")!
    expect(thumb.getAttribute("aria-valuemin")).toBe("0")
    expect(thumb.getAttribute("aria-valuemax")).toBe("100")
    expect(thumb.getAttribute("aria-valuenow")).toBe("25")
    expect(thumb.getAttribute("aria-orientation")).toBe("horizontal")
    expect(thumb.getAttribute("aria-label")).toBe("Volume")
  })

  it("renders track with semantic attributes", () => {
    const container = getContainer()
    render(
      () => (
        <Slider.Root defaultValue={[50]}>
          <Slider.Track>
            <Slider.Range />
            <Slider.Thumb index={0} aria-label="Volume" />
          </Slider.Track>
        </Slider.Root>
      ),
      container,
    )

    const track = container.querySelector("[data-scope='slider'][data-part='track']")
    expect(track).not.toBeNull()
  })

  it("renders range with semantic attributes", () => {
    const container = getContainer()
    render(
      () => (
        <Slider.Root defaultValue={[50]}>
          <Slider.Track>
            <Slider.Range />
            <Slider.Thumb index={0} aria-label="Volume" />
          </Slider.Track>
        </Slider.Root>
      ),
      container,
    )

    const range = container.querySelector("[data-scope='slider'][data-part='range']")
    expect(range).not.toBeNull()
  })

  it("increments value on ArrowRight", () => {
    const container = getContainer()
    const onChange = vi.fn()
    render(
      () => (
        <Slider.Root defaultValue={[50]} min={0} max={100} step={1} onValueChange={onChange}>
          <Slider.Track>
            <Slider.Range />
            <Slider.Thumb index={0} aria-label="Volume" />
          </Slider.Track>
        </Slider.Root>
      ),
      container,
    )

    const thumb = container.querySelector("[role='slider']") as HTMLElement
    thumb.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }))
    expect(onChange).toHaveBeenCalledWith([51])
  })

  it("decrements value on ArrowLeft", () => {
    const container = getContainer()
    const onChange = vi.fn()
    render(
      () => (
        <Slider.Root defaultValue={[50]} min={0} max={100} step={1} onValueChange={onChange}>
          <Slider.Track>
            <Slider.Range />
            <Slider.Thumb index={0} aria-label="Volume" />
          </Slider.Track>
        </Slider.Root>
      ),
      container,
    )

    const thumb = container.querySelector("[role='slider']") as HTMLElement
    thumb.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }))
    expect(onChange).toHaveBeenCalledWith([49])
  })

  it("jumps to min on Home", () => {
    const container = getContainer()
    const onChange = vi.fn()
    render(
      () => (
        <Slider.Root defaultValue={[50]} min={0} max={100} step={1} onValueChange={onChange}>
          <Slider.Track>
            <Slider.Range />
            <Slider.Thumb index={0} aria-label="Volume" />
          </Slider.Track>
        </Slider.Root>
      ),
      container,
    )

    const thumb = container.querySelector("[role='slider']") as HTMLElement
    thumb.dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true }))
    expect(onChange).toHaveBeenCalledWith([0])
  })

  it("jumps to max on End", () => {
    const container = getContainer()
    const onChange = vi.fn()
    render(
      () => (
        <Slider.Root defaultValue={[50]} min={0} max={100} step={1} onValueChange={onChange}>
          <Slider.Track>
            <Slider.Range />
            <Slider.Thumb index={0} aria-label="Volume" />
          </Slider.Track>
        </Slider.Root>
      ),
      container,
    )

    const thumb = container.querySelector("[role='slider']") as HTMLElement
    thumb.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true }))
    expect(onChange).toHaveBeenCalledWith([100])
  })

  it("sets disabled state on thumb", () => {
    const container = getContainer()
    render(
      () => (
        <Slider.Root defaultValue={[50]} disabled>
          <Slider.Track>
            <Slider.Range />
            <Slider.Thumb index={0} aria-label="Volume" />
          </Slider.Track>
        </Slider.Root>
      ),
      container,
    )

    const thumb = container.querySelector("[role='slider']")!
    expect(thumb.getAttribute("aria-disabled")).toBe("true")
    expect(thumb.hasAttribute("data-disabled")).toBe(true)
    expect(thumb.getAttribute("tabindex")).toBe("-1")
  })

  it("supports vertical orientation", () => {
    const container = getContainer()
    render(
      () => (
        <Slider.Root defaultValue={[50]} orientation="vertical">
          <Slider.Track>
            <Slider.Range />
            <Slider.Thumb index={0} aria-label="Volume" />
          </Slider.Track>
        </Slider.Root>
      ),
      container,
    )

    const root = container.querySelector("[data-part='root']")!
    const thumb = container.querySelector("[role='slider']")!
    expect(root.getAttribute("data-orientation")).toBe("vertical")
    expect(thumb.getAttribute("aria-orientation")).toBe("vertical")
  })

  it("produces no console errors on render", () => {
    const container = getContainer()
    render(
      () => (
        <Slider.Root defaultValue={[50]}>
          <Slider.Track>
            <Slider.Range />
            <Slider.Thumb index={0} aria-label="Volume" />
          </Slider.Track>
        </Slider.Root>
      ),
      container,
    )
    guard.assertClean()
  })
})
