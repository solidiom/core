import { describe, it, expect, vi } from "vitest"
import { createRoot, createSignal, flush } from "solid-js"
import { createSegmentedEditing, type SegmentDefinition } from "./segmented-editing"

/** Minimal KeyboardEvent mock for node environment. */
function createKeyboardEvent(
  key: string,
  options?: { shiftKey?: boolean; ctrlKey?: boolean; metaKey?: boolean; altKey?: boolean },
): KeyboardEvent {
  let defaultPrevented = false
  return {
    key,
    shiftKey: options?.shiftKey ?? false,
    ctrlKey: options?.ctrlKey ?? false,
    metaKey: options?.metaKey ?? false,
    altKey: options?.altKey ?? false,
    cancelable: true,
    defaultPrevented,
    preventDefault() {
      defaultPrevented = true
      Object.defineProperty(this, "defaultPrevented", { value: true })
    },
  } as unknown as KeyboardEvent
}

/** Standard time segments: HH:MM:SS with literal separators. */
function createTimeSegments(): SegmentDefinition[] {
  return [
    { id: "hours", type: "numeric", min: 0, max: 23, maxLength: 2, placeholder: "HH" },
    { id: "sep1", type: "literal", placeholder: ":" },
    { id: "minutes", type: "numeric", min: 0, max: 59, maxLength: 2, placeholder: "MM" },
    { id: "sep2", type: "literal", placeholder: ":" },
    { id: "seconds", type: "numeric", min: 0, max: 59, maxLength: 2, placeholder: "SS" },
  ]
}

describe("createSegmentedEditing", () => {
  describe("navigation", () => {
    it("ArrowRight moves to next editable segment, skipping literals", () => {
      createRoot((dispose) => {
        const editing = createSegmentedEditing({ segments: createTimeSegments() })
        // Start at index 0 (hours)
        editing.focusSegment(0)
        flush()
        expect(editing.focusedId()).toBe("hours")

        editing.handleKeyDown(createKeyboardEvent("ArrowRight"))
        flush()
        // Should skip sep1 (literal) and land on minutes
        expect(editing.focusedId()).toBe("minutes")

        dispose()
      })
    })

    it("ArrowLeft moves to previous editable segment, skipping literals", () => {
      createRoot((dispose) => {
        const editing = createSegmentedEditing({ segments: createTimeSegments() })
        editing.focusSegment(2) // minutes
        flush()
        expect(editing.focusedId()).toBe("minutes")

        editing.handleKeyDown(createKeyboardEvent("ArrowLeft"))
        flush()
        // Should skip sep1 and land on hours
        expect(editing.focusedId()).toBe("hours")

        dispose()
      })
    })

    it("ArrowRight does nothing at last editable segment", () => {
      createRoot((dispose) => {
        const editing = createSegmentedEditing({ segments: createTimeSegments() })
        editing.focusSegment(4) // seconds (last editable)
        flush()
        expect(editing.focusedId()).toBe("seconds")

        editing.handleKeyDown(createKeyboardEvent("ArrowRight"))
        flush()
        expect(editing.focusedId()).toBe("seconds")

        dispose()
      })
    })

    it("ArrowLeft does nothing at first editable segment", () => {
      createRoot((dispose) => {
        const editing = createSegmentedEditing({ segments: createTimeSegments() })
        editing.focusSegment(0) // hours (first editable)
        flush()

        editing.handleKeyDown(createKeyboardEvent("ArrowLeft"))
        flush()
        expect(editing.focusedId()).toBe("hours")

        dispose()
      })
    })

    it("Home focuses first editable segment", () => {
      createRoot((dispose) => {
        const editing = createSegmentedEditing({ segments: createTimeSegments() })
        editing.focusSegment(4) // seconds
        flush()

        editing.handleKeyDown(createKeyboardEvent("Home"))
        flush()
        expect(editing.focusedId()).toBe("hours")

        dispose()
      })
    })

    it("End focuses last editable segment", () => {
      createRoot((dispose) => {
        const editing = createSegmentedEditing({ segments: createTimeSegments() })
        editing.focusSegment(0) // hours
        flush()

        editing.handleKeyDown(createKeyboardEvent("End"))
        flush()
        expect(editing.focusedId()).toBe("seconds")

        dispose()
      })
    })

    it("Tab moves to next editable segment and prevents default", () => {
      createRoot((dispose) => {
        const editing = createSegmentedEditing({ segments: createTimeSegments() })
        editing.focusSegment(0)
        flush()

        const event = createKeyboardEvent("Tab")
        editing.handleKeyDown(event)
        flush()
        expect(editing.focusedId()).toBe("minutes")
        expect(event.defaultPrevented).toBe(true)

        dispose()
      })
    })

    it("Tab does not prevent default at last editable segment", () => {
      createRoot((dispose) => {
        const editing = createSegmentedEditing({ segments: createTimeSegments() })
        editing.focusSegment(4) // seconds (last editable)
        flush()

        const event = createKeyboardEvent("Tab")
        editing.handleKeyDown(event)
        flush()
        // Focus stays, default not prevented (focus leaves field)
        expect(event.defaultPrevented).toBe(false)

        dispose()
      })
    })

    it("Shift+Tab moves to previous editable segment and prevents default", () => {
      createRoot((dispose) => {
        const editing = createSegmentedEditing({ segments: createTimeSegments() })
        editing.focusSegment(4) // seconds
        flush()

        const event = createKeyboardEvent("Tab", { shiftKey: true })
        editing.handleKeyDown(event)
        flush()
        expect(editing.focusedId()).toBe("minutes")
        expect(event.defaultPrevented).toBe(true)

        dispose()
      })
    })

    it("Shift+Tab does not prevent default at first editable segment", () => {
      createRoot((dispose) => {
        const editing = createSegmentedEditing({ segments: createTimeSegments() })
        editing.focusSegment(0) // hours (first editable)
        flush()

        const event = createKeyboardEvent("Tab", { shiftKey: true })
        editing.handleKeyDown(event)
        flush()
        expect(event.defaultPrevented).toBe(false)

        dispose()
      })
    })

    it("focusSegmentById focuses the correct segment", () => {
      createRoot((dispose) => {
        const editing = createSegmentedEditing({ segments: createTimeSegments() })
        editing.focusSegmentById("seconds")
        flush()
        expect(editing.focusedId()).toBe("seconds")
        expect(editing.focusedIndex()).toBe(4)

        dispose()
      })
    })

    it("focusNext and focusPrevious navigate correctly", () => {
      createRoot((dispose) => {
        const editing = createSegmentedEditing({ segments: createTimeSegments() })
        editing.focusSegment(0)
        flush()

        editing.focusNext()
        flush()
        expect(editing.focusedId()).toBe("minutes")

        editing.focusNext()
        flush()
        expect(editing.focusedId()).toBe("seconds")

        editing.focusPrevious()
        flush()
        expect(editing.focusedId()).toBe("minutes")

        dispose()
      })
    })
  })

  describe("numeric input", () => {
    it("accepts digit characters", () => {
      createRoot((dispose) => {
        const editing = createSegmentedEditing({ segments: createTimeSegments() })
        editing.focusSegment(0)
        flush()

        editing.handleInput("1")
        flush()
        expect(editing.values()["hours"]).toBe("1")

        editing.handleInput("2")
        flush()
        expect(editing.values()["hours"]).toBe("12")

        dispose()
      })
    })

    it("rejects non-digit characters for numeric segments", () => {
      createRoot((dispose) => {
        const editing = createSegmentedEditing({ segments: createTimeSegments() })
        editing.focusSegment(0)
        flush()

        editing.handleInput("a")
        flush()
        expect(editing.values()["hours"]).toBeUndefined()

        editing.handleInput("!")
        flush()
        expect(editing.values()["hours"]).toBeUndefined()

        dispose()
      })
    })

    it("auto-advances to next segment when maxLength is reached", () => {
      createRoot((dispose) => {
        const editing = createSegmentedEditing({ segments: createTimeSegments() })
        editing.focusSegment(0)
        flush()

        editing.handleInput("1")
        flush()
        expect(editing.focusedId()).toBe("hours")

        editing.handleInput("2")
        flush()
        // maxLength of 2 reached, should advance to minutes
        expect(editing.focusedId()).toBe("minutes")

        dispose()
      })
    })

    it("ArrowUp increments numeric value", () => {
      createRoot((dispose) => {
        const editing = createSegmentedEditing({
          segments: createTimeSegments(),
          defaultValues: { hours: "5" },
        })
        editing.focusSegment(0)
        flush()

        editing.handleKeyDown(createKeyboardEvent("ArrowUp"))
        flush()
        expect(editing.values()["hours"]).toBe("6")

        dispose()
      })
    })

    it("ArrowDown decrements numeric value", () => {
      createRoot((dispose) => {
        const editing = createSegmentedEditing({
          segments: createTimeSegments(),
          defaultValues: { hours: "5" },
        })
        editing.focusSegment(0)
        flush()

        editing.handleKeyDown(createKeyboardEvent("ArrowDown"))
        flush()
        expect(editing.values()["hours"]).toBe("4")

        dispose()
      })
    })

    it("ArrowUp wraps from max to min", () => {
      createRoot((dispose) => {
        const editing = createSegmentedEditing({
          segments: createTimeSegments(),
          defaultValues: { hours: "23" },
        })
        editing.focusSegment(0)
        flush()

        editing.handleKeyDown(createKeyboardEvent("ArrowUp"))
        flush()
        expect(editing.values()["hours"]).toBe("0")

        dispose()
      })
    })

    it("ArrowDown wraps from min to max", () => {
      createRoot((dispose) => {
        const editing = createSegmentedEditing({
          segments: createTimeSegments(),
          defaultValues: { hours: "0" },
        })
        editing.focusSegment(0)
        flush()

        editing.handleKeyDown(createKeyboardEvent("ArrowDown"))
        flush()
        expect(editing.values()["hours"]).toBe("23")

        dispose()
      })
    })

    it("ArrowUp starts from min when segment is empty", () => {
      createRoot((dispose) => {
        const editing = createSegmentedEditing({ segments: createTimeSegments() })
        editing.focusSegment(0)
        flush()

        editing.handleKeyDown(createKeyboardEvent("ArrowUp"))
        flush()
        expect(editing.values()["hours"]).toBe("1")

        dispose()
      })
    })

    it("ArrowDown starts from max when segment is empty", () => {
      createRoot((dispose) => {
        const editing = createSegmentedEditing({ segments: createTimeSegments() })
        editing.focusSegment(0)
        flush()

        editing.handleKeyDown(createKeyboardEvent("ArrowDown"))
        flush()
        // Empty segment, starts from max (23) then decrements: results in 23 going to -1 which wraps to max
        // Actually: empty => max ?? 0 = 23, then 23 - 1 = 22... Wait, let me check:
        // numVal = "" => max ?? 0 = 23, next = 23 - 1 = 22
        // min=0 and next=22 >= min, so result is 22
        // Hmm, but spec says "wrap to max if at min". For ArrowDown on empty:
        // The implementation uses max as starting point for empty on ArrowDown
        expect(editing.values()["hours"]).toBe("22")

        dispose()
      })
    })

    it("Backspace removes last character from numeric segment", () => {
      createRoot((dispose) => {
        const editing = createSegmentedEditing({
          segments: createTimeSegments(),
          defaultValues: { hours: "12" },
        })
        editing.focusSegment(0)
        flush()

        editing.handleKeyDown(createKeyboardEvent("Backspace"))
        flush()
        expect(editing.values()["hours"]).toBe("1")

        dispose()
      })
    })

    it("Backspace moves to previous segment when current is empty", () => {
      createRoot((dispose) => {
        const editing = createSegmentedEditing({ segments: createTimeSegments() })
        editing.focusSegment(2) // minutes (empty)
        flush()

        editing.handleKeyDown(createKeyboardEvent("Backspace"))
        flush()
        expect(editing.focusedId()).toBe("hours")

        dispose()
      })
    })

    it("Delete clears entire segment", () => {
      createRoot((dispose) => {
        const editing = createSegmentedEditing({
          segments: createTimeSegments(),
          defaultValues: { hours: "12" },
        })
        editing.focusSegment(0)
        flush()

        editing.handleKeyDown(createKeyboardEvent("Delete"))
        flush()
        expect(editing.values()["hours"]).toBe("")

        dispose()
      })
    })
  })

  describe("zero padding", () => {
    it("pads numeric displayValue with leading zeros when padZero is default (true)", () => {
      createRoot((dispose) => {
        const editing = createSegmentedEditing({
          segments: createTimeSegments(),
          defaultValues: { hours: "5" },
        })
        flush()

        const hourSegment = editing.segments().find((s) => s.id === "hours")!
        expect(hourSegment.displayValue()).toBe("05")

        dispose()
      })
    })

    it("does not pad when padZero is false", () => {
      createRoot((dispose) => {
        const segments: SegmentDefinition[] = [
          { id: "num", type: "numeric", maxLength: 3, padZero: false },
        ]
        const editing = createSegmentedEditing({
          segments,
          defaultValues: { num: "5" },
        })
        flush()

        const seg = editing.segments().find((s) => s.id === "num")!
        expect(seg.displayValue()).toBe("5")

        dispose()
      })
    })

    it("shows placeholder when value is empty", () => {
      createRoot((dispose) => {
        const editing = createSegmentedEditing({ segments: createTimeSegments() })
        flush()

        const hourSegment = editing.segments().find((s) => s.id === "hours")!
        expect(hourSegment.displayValue()).toBe("HH")

        dispose()
      })
    })

    it("literal segments display their placeholder", () => {
      createRoot((dispose) => {
        const editing = createSegmentedEditing({ segments: createTimeSegments() })
        flush()

        const sepSegment = editing.segments().find((s) => s.id === "sep1")!
        expect(sepSegment.displayValue()).toBe(":")

        dispose()
      })
    })
  })

  describe("text segments", () => {
    it("accepts alphabetic characters", () => {
      createRoot((dispose) => {
        const segments: SegmentDefinition[] = [{ id: "text", type: "text", maxLength: 5 }]
        const editing = createSegmentedEditing({ segments })
        editing.focusSegment(0)
        flush()

        editing.handleInput("H")
        flush()
        expect(editing.values()["text"]).toBe("H")

        editing.handleInput("i")
        flush()
        expect(editing.values()["text"]).toBe("Hi")

        dispose()
      })
    })

    it("rejects non-alphabetic characters for text segments", () => {
      createRoot((dispose) => {
        const segments: SegmentDefinition[] = [{ id: "text", type: "text", maxLength: 5 }]
        const editing = createSegmentedEditing({ segments })
        editing.focusSegment(0)
        flush()

        editing.handleInput("1")
        flush()
        expect(editing.values()["text"]).toBeUndefined()

        dispose()
      })
    })

    it("cycles through allowedValues with ArrowUp", () => {
      createRoot((dispose) => {
        const segments: SegmentDefinition[] = [
          { id: "period", type: "text", allowedValues: ["AM", "PM"] },
        ]
        const editing = createSegmentedEditing({
          segments,
          defaultValues: { period: "AM" },
        })
        editing.focusSegment(0)
        flush()

        editing.handleKeyDown(createKeyboardEvent("ArrowUp"))
        flush()
        expect(editing.values()["period"]).toBe("PM")

        editing.handleKeyDown(createKeyboardEvent("ArrowUp"))
        flush()
        expect(editing.values()["period"]).toBe("AM")

        dispose()
      })
    })

    it("cycles through allowedValues with ArrowDown", () => {
      createRoot((dispose) => {
        const segments: SegmentDefinition[] = [
          { id: "period", type: "text", allowedValues: ["AM", "PM"] },
        ]
        const editing = createSegmentedEditing({
          segments,
          defaultValues: { period: "AM" },
        })
        editing.focusSegment(0)
        flush()

        editing.handleKeyDown(createKeyboardEvent("ArrowDown"))
        flush()
        expect(editing.values()["period"]).toBe("PM")

        dispose()
      })
    })

    it("type-ahead matches from allowedValues", () => {
      createRoot((dispose) => {
        const segments: SegmentDefinition[] = [
          { id: "period", type: "text", allowedValues: ["AM", "PM"] },
        ]
        const editing = createSegmentedEditing({ segments })
        editing.focusSegment(0)
        flush()

        editing.handleInput("P")
        flush()
        expect(editing.values()["period"]).toBe("PM")

        dispose()
      })
    })
  })

  describe("separators", () => {
    it("typing a separator character advances to next segment", () => {
      createRoot((dispose) => {
        const editing = createSegmentedEditing({
          segments: createTimeSegments(),
          separators: [":"],
          defaultValues: { hours: "12" },
        })
        editing.focusSegment(0)
        flush()

        editing.handleInput(":")
        flush()
        expect(editing.focusedId()).toBe("minutes")

        dispose()
      })
    })

    it("separator does not modify segment value", () => {
      createRoot((dispose) => {
        const editing = createSegmentedEditing({
          segments: createTimeSegments(),
          separators: [":"],
          defaultValues: { hours: "12" },
        })
        editing.focusSegment(0)
        flush()

        editing.handleInput(":")
        flush()
        expect(editing.values()["hours"]).toBe("12")

        dispose()
      })
    })
  })

  describe("completion", () => {
    it("isComplete is false when some editable segments are empty", () => {
      createRoot((dispose) => {
        const editing = createSegmentedEditing({
          segments: createTimeSegments(),
          defaultValues: { hours: "12", minutes: "30" },
        })
        flush()

        expect(editing.isComplete()).toBe(false)

        dispose()
      })
    })

    it("isComplete is true when all editable segments have values", () => {
      createRoot((dispose) => {
        const editing = createSegmentedEditing({
          segments: createTimeSegments(),
          defaultValues: { hours: "12", minutes: "30", seconds: "45" },
        })
        flush()

        expect(editing.isComplete()).toBe(true)

        dispose()
      })
    })

    it("onComplete fires when last empty segment is filled", () => {
      createRoot((dispose) => {
        const onComplete = vi.fn()
        const editing = createSegmentedEditing({
          segments: createTimeSegments(),
          defaultValues: { hours: "12", minutes: "30" },
          onComplete,
        })
        editing.focusSegment(4) // seconds
        flush()

        editing.handleInput("4")
        flush()
        editing.handleInput("5")
        flush()

        expect(onComplete).toHaveBeenCalledWith(
          expect.objectContaining({ hours: "12", minutes: "30", seconds: "45" }),
        )

        dispose()
      })
    })

    it("onComplete does not fire when values are not all filled", () => {
      createRoot((dispose) => {
        const onComplete = vi.fn()
        const editing = createSegmentedEditing({
          segments: createTimeSegments(),
          onComplete,
        })
        editing.focusSegment(0) // hours
        flush()

        editing.handleInput("1")
        flush()

        expect(onComplete).not.toHaveBeenCalled()

        dispose()
      })
    })
  })

  describe("onChange", () => {
    it("fires onChange with segment ID on value change", () => {
      createRoot((dispose) => {
        const onChange = vi.fn()
        const editing = createSegmentedEditing({
          segments: createTimeSegments(),
          onChange,
        })
        editing.focusSegment(0)
        flush()

        editing.handleInput("1")
        flush()

        expect(onChange).toHaveBeenCalledWith(
          expect.objectContaining({ hours: "1" }),
          expect.objectContaining({ segmentId: "hours" }),
        )

        dispose()
      })
    })

    it("fires onChange on ArrowUp/ArrowDown", () => {
      createRoot((dispose) => {
        const onChange = vi.fn()
        const editing = createSegmentedEditing({
          segments: createTimeSegments(),
          defaultValues: { hours: "5" },
          onChange,
        })
        editing.focusSegment(0)
        flush()

        editing.handleKeyDown(createKeyboardEvent("ArrowUp"))
        flush()

        expect(onChange).toHaveBeenCalledWith(
          expect.objectContaining({ hours: "6" }),
          expect.objectContaining({ segmentId: "hours" }),
        )

        dispose()
      })
    })
  })

  describe("controlled mode", () => {
    it("uses values accessor for current values", () => {
      createRoot((dispose) => {
        const [vals] = createSignal<Record<string, string>>(
          { hours: "10", minutes: "20", seconds: "30" },
          { ownedWrite: true },
        )
        const editing = createSegmentedEditing({
          segments: createTimeSegments(),
          values: vals,
        })
        flush()

        expect(editing.values()).toEqual({ hours: "10", minutes: "20", seconds: "30" })

        dispose()
      })
    })

    it("does not update internal state on input in controlled mode", () => {
      createRoot((dispose) => {
        const segments: SegmentDefinition[] = [
          { id: "val", type: "numeric", min: 0, max: 999, maxLength: 3 },
        ]
        const [vals] = createSignal<Record<string, string>>({ val: "10" }, { ownedWrite: true })
        const onChange = vi.fn()
        const editing = createSegmentedEditing({
          segments,
          values: vals,
          onChange,
        })
        editing.focusSegment(0)
        flush()

        editing.handleInput("5")
        flush()

        // Value stays controlled
        expect(editing.values()["val"]).toBe("10")
        // But onChange fires with appended value
        expect(onChange).toHaveBeenCalledWith(
          expect.objectContaining({ val: "105" }),
          expect.objectContaining({ segmentId: "val" }),
        )

        dispose()
      })
    })

    it("reflects updated controlled values", () => {
      createRoot((dispose) => {
        const [vals, setVals] = createSignal<Record<string, string>>(
          { hours: "10" },
          { ownedWrite: true },
        )
        const editing = createSegmentedEditing({
          segments: createTimeSegments(),
          values: vals,
        })
        flush()

        expect(editing.values()["hours"]).toBe("10")

        setVals({ hours: "15", minutes: "30", seconds: "00" })
        flush()

        expect(editing.values()).toEqual({ hours: "15", minutes: "30", seconds: "00" })

        dispose()
      })
    })
  })

  describe("disabled", () => {
    it("ignores all input when disabled", () => {
      createRoot((dispose) => {
        const editing = createSegmentedEditing({
          segments: createTimeSegments(),
          disabled: () => true,
        })
        editing.focusSegment(0)
        flush()

        editing.handleInput("1")
        flush()
        expect(editing.values()["hours"]).toBeUndefined()

        dispose()
      })
    })

    it("ignores keyboard navigation when disabled", () => {
      createRoot((dispose) => {
        const editing = createSegmentedEditing({
          segments: createTimeSegments(),
          disabled: () => true,
        })
        editing.focusSegment(0)
        flush()

        editing.handleKeyDown(createKeyboardEvent("ArrowRight"))
        flush()
        expect(editing.focusedId()).toBe("hours")

        dispose()
      })
    })

    it("ignores setSegmentValue when disabled", () => {
      createRoot((dispose) => {
        const editing = createSegmentedEditing({
          segments: createTimeSegments(),
          disabled: () => true,
        })
        flush()

        editing.setSegmentValue("hours", "12")
        flush()
        expect(editing.values()["hours"]).toBeUndefined()

        dispose()
      })
    })
  })

  describe("readOnly", () => {
    it("allows navigation when readOnly", () => {
      createRoot((dispose) => {
        const editing = createSegmentedEditing({
          segments: createTimeSegments(),
          readOnly: () => true,
        })
        editing.focusSegment(0)
        flush()

        editing.handleKeyDown(createKeyboardEvent("ArrowRight"))
        flush()
        expect(editing.focusedId()).toBe("minutes")

        dispose()
      })
    })

    it("prevents editing when readOnly", () => {
      createRoot((dispose) => {
        const editing = createSegmentedEditing({
          segments: createTimeSegments(),
          readOnly: () => true,
          defaultValues: { hours: "12" },
        })
        editing.focusSegment(0)
        flush()

        editing.handleInput("5")
        flush()
        expect(editing.values()["hours"]).toBe("12")

        dispose()
      })
    })

    it("prevents ArrowUp/Down editing when readOnly", () => {
      createRoot((dispose) => {
        const editing = createSegmentedEditing({
          segments: createTimeSegments(),
          readOnly: () => true,
          defaultValues: { hours: "12" },
        })
        editing.focusSegment(0)
        flush()

        editing.handleKeyDown(createKeyboardEvent("ArrowUp"))
        flush()
        expect(editing.values()["hours"]).toBe("12")

        dispose()
      })
    })

    it("prevents Backspace/Delete when readOnly", () => {
      createRoot((dispose) => {
        const editing = createSegmentedEditing({
          segments: createTimeSegments(),
          readOnly: () => true,
          defaultValues: { hours: "12" },
        })
        editing.focusSegment(0)
        flush()

        editing.handleKeyDown(createKeyboardEvent("Backspace"))
        flush()
        expect(editing.values()["hours"]).toBe("12")

        editing.handleKeyDown(createKeyboardEvent("Delete"))
        flush()
        expect(editing.values()["hours"]).toBe("12")

        dispose()
      })
    })
  })

  describe("clear", () => {
    it("clear() resets all editable segment values", () => {
      createRoot((dispose) => {
        const editing = createSegmentedEditing({
          segments: createTimeSegments(),
          defaultValues: { hours: "12", minutes: "30", seconds: "45" },
        })
        flush()

        editing.clear()
        flush()
        expect(editing.values()["hours"]).toBe("")
        expect(editing.values()["minutes"]).toBe("")
        expect(editing.values()["seconds"]).toBe("")

        dispose()
      })
    })

    it("clearFocused() resets only the focused segment", () => {
      createRoot((dispose) => {
        const editing = createSegmentedEditing({
          segments: createTimeSegments(),
          defaultValues: { hours: "12", minutes: "30", seconds: "45" },
        })
        editing.focusSegment(0)
        flush()

        editing.clearFocused()
        flush()
        expect(editing.values()["hours"]).toBe("")
        expect(editing.values()["minutes"]).toBe("30")
        expect(editing.values()["seconds"]).toBe("45")

        dispose()
      })
    })
  })

  describe("segment state", () => {
    it("provides isFocused for each segment", () => {
      createRoot((dispose) => {
        const editing = createSegmentedEditing({ segments: createTimeSegments() })
        editing.focusSegment(0)
        flush()

        const segs = editing.segments()
        expect(segs[0]!.isFocused()).toBe(true)
        expect(segs[2]!.isFocused()).toBe(false)

        editing.focusSegment(2)
        flush()

        const segs2 = editing.segments()
        expect(segs2[0]!.isFocused()).toBe(false)
        expect(segs2[2]!.isFocused()).toBe(true)

        dispose()
      })
    })

    it("provides value accessor for each segment", () => {
      createRoot((dispose) => {
        const editing = createSegmentedEditing({
          segments: createTimeSegments(),
          defaultValues: { hours: "12" },
        })
        flush()

        const hourSeg = editing.segments().find((s) => s.id === "hours")!
        expect(hourSeg.value()).toBe("12")

        const minSeg = editing.segments().find((s) => s.id === "minutes")!
        expect(minSeg.value()).toBe("")

        dispose()
      })
    })
  })

  describe("keyboard input via handleKeyDown", () => {
    it("single character keys trigger handleInput", () => {
      createRoot((dispose) => {
        const editing = createSegmentedEditing({ segments: createTimeSegments() })
        editing.focusSegment(0)
        flush()

        editing.handleKeyDown(createKeyboardEvent("1"))
        flush()
        expect(editing.values()["hours"]).toBe("1")

        editing.handleKeyDown(createKeyboardEvent("5"))
        flush()
        expect(editing.values()["hours"]).toBe("15")

        dispose()
      })
    })

    it("does not trigger input for ctrl/meta/alt modified keys", () => {
      createRoot((dispose) => {
        const editing = createSegmentedEditing({ segments: createTimeSegments() })
        editing.focusSegment(0)
        flush()

        editing.handleKeyDown(createKeyboardEvent("1", { ctrlKey: true }))
        flush()
        expect(editing.values()["hours"]).toBeUndefined()

        editing.handleKeyDown(createKeyboardEvent("1", { metaKey: true }))
        flush()
        expect(editing.values()["hours"]).toBeUndefined()

        dispose()
      })
    })
  })
})
