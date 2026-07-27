/**
 * Browser-mode component tests for RangeCalendar primitive.
 *
 * Verifies rendering, range selection (start/end/restart), keyboard navigation,
 * RTL arrow reversal, disabled dates, and semantic attributes.
 */

import { describe, it, expect, afterEach } from "vitest"
import { render } from "@solidjs/web"
import * as Calendar from "./index"
import type { RangeValue, DateValue } from "./index"

// ─── Setup ─────────────────────────────────────────────────────────────────────

afterEach(() => {
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

function renderRangeCalendar(opts?: {
  defaultValue?: RangeValue
  onValueChange?: (range: RangeValue) => void
  isDateDisabled?: (date: DateValue) => boolean
  dir?: "ltr" | "rtl"
}) {
  const container = getContainer()
  render(
    () => (
      <Calendar.RangeRoot
        defaultValue={opts?.defaultValue ?? { start: { year: 2024, month: 6, day: 1 } }}
        onValueChange={opts?.onValueChange}
        isDateDisabled={opts?.isDateDisabled}
        dir={opts?.dir}
      >
        <Calendar.RangeHeader>
          <Calendar.RangePrevButton />
          <Calendar.RangeTitle />
          <Calendar.RangeNextButton />
        </Calendar.RangeHeader>
        <Calendar.RangeGrid>
          {(weeks) =>
            weeks.map((week) => (
              <tr>
                {week.map((day) =>
                  day > 0 ? <Calendar.RangeCell day={day} /> : <td />,
                )}
              </tr>
            ))
          }
        </Calendar.RangeGrid>
      </Calendar.RangeRoot>
    ),
    container,
  )
  return container
}

function getCells(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll("[data-scope='range-calendar'][data-part='cell']"))
}

function getCellByDay(container: HTMLElement, day: number): HTMLElement | null {
  return (
    getCells(container).find((el) => el.textContent?.trim() === String(day)) ?? null
  )
}

// ─── Tests ─────────────────────────────────────────────────────────────────────

describe("RangeCalendar", () => {
  describe("rendering", () => {
    it("renders root with data-scope=range-calendar and data-part=root", () => {
      const container = renderRangeCalendar()
      const root = container.querySelector("[data-scope='range-calendar'][data-part='root']")
      expect(root).not.toBeNull()
      expect(root?.getAttribute("role")).toBe("application")
      expect(root?.getAttribute("aria-label")).toBe("Range Calendar")
    })

    it("renders grid with role=grid", () => {
      const container = renderRangeCalendar()
      const grid = container.querySelector("[data-scope='range-calendar'][data-part='grid']")
      expect(grid).not.toBeNull()
      expect(grid?.getAttribute("role")).toBe("grid")
    })

    it("renders cells with role=gridcell", () => {
      const container = renderRangeCalendar()
      const cells = getCells(container)
      expect(cells.length).toBeGreaterThan(0)
      expect(cells[0]?.getAttribute("role")).toBe("gridcell")
    })

    it("renders month title with aria-live=polite", () => {
      const container = renderRangeCalendar()
      const title = container.querySelector("[data-scope='range-calendar'][data-part='title']")
      expect(title).not.toBeNull()
      expect(title?.getAttribute("aria-live")).toBe("polite")
      expect(title?.textContent).toContain("June 2024")
    })

    it("renders prev/next buttons with aria-labels", () => {
      const container = renderRangeCalendar()
      const prev = container.querySelector("[data-scope='range-calendar'][data-part='prev-button']")
      const next = container.querySelector("[data-scope='range-calendar'][data-part='next-button']")
      expect(prev?.getAttribute("aria-label")).toBe("Previous month")
      expect(next?.getAttribute("aria-label")).toBe("Next month")
    })
  })

  describe("range selection (start/end/restart)", () => {
    it("first click sets range start", () => {
      const container = renderRangeCalendar({
        onValueChange: () => {},
      })
      const cell10 = getCellByDay(container, 10)!
      cell10.click()
      // After first click, start is set but onValueChange only fires with complete range
      // The cell should be marked as range-start
      expect(cell10.hasAttribute("data-range-start")).toBe(true)
    })

    it("second click completes the range and fires onValueChange", () => {
      let result: RangeValue | undefined
      const container = renderRangeCalendar({
        onValueChange: (r) => { result = r },
      })
      const cell10 = getCellByDay(container, 10)!
      const cell15 = getCellByDay(container, 15)!
      cell10.click()
      cell15.click()
      expect(result).toBeDefined()
      expect(result!.start).toEqual({ year: 2024, month: 6, day: 10 })
      expect(result!.end).toEqual({ year: 2024, month: 6, day: 15 })
    })

    it("normalizes range when end is before start", () => {
      let result: RangeValue | undefined
      const container = renderRangeCalendar({
        onValueChange: (r) => { result = r },
      })
      const cell15 = getCellByDay(container, 15)!
      const cell10 = getCellByDay(container, 10)!
      cell15.click()
      cell10.click()
      expect(result).toBeDefined()
      expect(result!.start).toEqual({ year: 2024, month: 6, day: 10 })
      expect(result!.end).toEqual({ year: 2024, month: 6, day: 15 })
    })

    it("third click restarts selection (new start)", () => {
      const container = renderRangeCalendar({
        onValueChange: () => {},
      })
      const cell10 = getCellByDay(container, 10)!
      const cell15 = getCellByDay(container, 15)!
      const cell20 = getCellByDay(container, 20)!
      cell10.click()
      cell15.click()
      // Range complete: 10–15
      cell20.click()
      // Restart: new start at 20, previous range cleared
      expect(cell20.hasAttribute("data-range-start")).toBe(true)
      // Old range-end should be gone
      expect(cell15.hasAttribute("data-range-end")).toBe(false)
    })

    it("cells within range get data-in-range attribute", () => {
      const container = renderRangeCalendar({
        defaultValue: { start: { year: 2024, month: 6, day: 10 }, end: { year: 2024, month: 6, day: 15 } },
      })
      // Rendering with a pre-set completed range triggers the select path
      // We need to click to set the range
      const cell10 = getCellByDay(container, 10)!
      const cell15 = getCellByDay(container, 15)!
      cell10.click()
      cell15.click()
      const cell12 = getCellByDay(container, 12)!
      expect(cell12.hasAttribute("data-in-range")).toBe(true)
    })
  })

  describe("keyboard navigation", () => {
    it("Enter/Space selects range boundary from focused cell", () => {
      let result: RangeValue | undefined
      const container = renderRangeCalendar({
        onValueChange: (r) => { result = r },
      })
      const grid = container.querySelector("[data-scope='range-calendar'][data-part='grid']")!
      // Focus day 1 (initial focus)
      const cell1 = getCellByDay(container, 1)!
      cell1.focus()
      // Press Enter to set start
      grid.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }))
      // Navigate right to day 2
      grid.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }))
      // Navigate right to day 3
      grid.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }))
      // Press Enter to set end
      grid.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }))
      expect(result).toBeDefined()
      expect(result!.start).toEqual({ year: 2024, month: 6, day: 1 })
      expect(result!.end).toEqual({ year: 2024, month: 6, day: 3 })
    })

    it("ArrowDown moves focus by 7 days", () => {
      const container = renderRangeCalendar()
      const grid = container.querySelector("[data-scope='range-calendar'][data-part='grid']")!
      // Initial focus on day 1
      grid.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }))
      // Focus should be on day 8
      const cell8 = getCellByDay(container, 8)
      expect(cell8?.getAttribute("tabindex")).toBe("0")
    })

    it("PageDown navigates to next month", () => {
      const container = renderRangeCalendar()
      const grid = container.querySelector("[data-scope='range-calendar'][data-part='grid']")!
      grid.dispatchEvent(new KeyboardEvent("keydown", { key: "PageDown", bubbles: true }))
      const title = container.querySelector("[data-scope='range-calendar'][data-part='title']")
      expect(title?.textContent).toContain("July 2024")
    })
  })

  describe("RTL support", () => {
    it("root element has dir=rtl when configured", () => {
      const container = renderRangeCalendar({ dir: "rtl" })
      const root = container.querySelector("[data-scope='range-calendar'][data-part='root']")
      expect(root?.getAttribute("dir")).toBe("rtl")
    })

    it("ArrowLeft moves forward in RTL mode", () => {
      const container = renderRangeCalendar({ dir: "rtl" })
      const grid = container.querySelector("[data-scope='range-calendar'][data-part='grid']")!
      // Initial focus on day 1; ArrowLeft in RTL = +1 day
      grid.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }))
      const cell2 = getCellByDay(container, 2)
      expect(cell2?.getAttribute("tabindex")).toBe("0")
    })

    it("ArrowRight moves backward in RTL mode", () => {
      const container = renderRangeCalendar({
        dir: "rtl",
        defaultValue: { start: { year: 2024, month: 6, day: 5 } },
      })
      const grid = container.querySelector("[data-scope='range-calendar'][data-part='grid']")!
      // Focus on day 5; ArrowRight in RTL = -1 day
      grid.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }))
      const cell4 = getCellByDay(container, 4)
      expect(cell4?.getAttribute("tabindex")).toBe("0")
    })
  })

  describe("disabled dates", () => {
    it("clicking a disabled date does not select it", () => {
      let result: RangeValue | undefined
      const container = renderRangeCalendar({
        isDateDisabled: (d) => d.day === 12,
        onValueChange: (r) => { result = r },
      })
      const cell12 = getCellByDay(container, 12)!
      cell12.click()
      // Should not start selection
      expect(cell12.hasAttribute("data-range-start")).toBe(false)
      expect(result).toBeUndefined()
    })

    it("disabled cell has aria-disabled=true", () => {
      const container = renderRangeCalendar({
        isDateDisabled: (d) => d.day === 12,
      })
      const cell12 = getCellByDay(container, 12)!
      expect(cell12.getAttribute("aria-disabled")).toBe("true")
    })

    it("disabled dates within a range still show data-in-range", () => {
      const container = renderRangeCalendar({
        isDateDisabled: (d) => d.day === 12,
        onValueChange: () => {},
      })
      const cell10 = getCellByDay(container, 10)!
      const cell15 = getCellByDay(container, 15)!
      cell10.click()
      cell15.click()
      // Day 12 is disabled but geometrically in-range
      const cell12 = getCellByDay(container, 12)!
      expect(cell12.hasAttribute("data-in-range")).toBe(true)
      expect(cell12.getAttribute("aria-disabled")).toBe("true")
    })
  })

  describe("month navigation", () => {
    it("prev button navigates to previous month", () => {
      const container = renderRangeCalendar()
      const prev = container.querySelector("[data-scope='range-calendar'][data-part='prev-button']") as HTMLElement
      prev.click()
      const title = container.querySelector("[data-scope='range-calendar'][data-part='title']")
      expect(title?.textContent).toContain("May 2024")
    })

    it("next button navigates to next month", () => {
      const container = renderRangeCalendar()
      const next = container.querySelector("[data-scope='range-calendar'][data-part='next-button']") as HTMLElement
      next.click()
      const title = container.querySelector("[data-scope='range-calendar'][data-part='title']")
      expect(title?.textContent).toContain("July 2024")
    })
  })
})
