import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { createRoot, createSignal, flush } from "solid-js"
import { createSpinButton } from "./spin-button"

/** Minimal KeyboardEvent mock for node environment. */
function createKeyboardEvent(key: string, cancelable = true): KeyboardEvent {
  let defaultPrevented = false
  return {
    key,
    cancelable,
    defaultPrevented,
    preventDefault() {
      if (cancelable) defaultPrevented = true
      Object.defineProperty(this, "defaultPrevented", { value: true })
    },
  } as unknown as KeyboardEvent
}

describe("createSpinButton", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe("increment/decrement", () => {
    it("increments value by step", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 5, step: 2 })
        expect(spin.value()).toBe(5)
        spin.increment()
        flush()
        expect(spin.value()).toBe(7)
        dispose()
      })
    })

    it("decrements value by step", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 10, step: 3 })
        spin.decrement()
        flush()
        expect(spin.value()).toBe(7)
        dispose()
      })
    })

    it("uses default step of 1", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 0 })
        spin.increment()
        flush()
        expect(spin.value()).toBe(1)
        spin.decrement()
        flush()
        expect(spin.value()).toBe(0)
        dispose()
      })
    })

    it("respects custom step as accessor", () => {
      createRoot((dispose) => {
        const [step, setStep] = createSignal(5, { ownedWrite: true })
        const spin = createSpinButton({ defaultValue: 0, step })
        spin.increment()
        flush()
        expect(spin.value()).toBe(5)
        setStep(10)
        flush()
        spin.increment()
        flush()
        expect(spin.value()).toBe(15)
        dispose()
      })
    })
  })

  describe("pageIncrement/pageDecrement", () => {
    it("increments by pageStep", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 0, pageStep: 20 })
        spin.pageIncrement()
        flush()
        expect(spin.value()).toBe(20)
        dispose()
      })
    })

    it("decrements by pageStep", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 50, pageStep: 15 })
        spin.pageDecrement()
        flush()
        expect(spin.value()).toBe(35)
        dispose()
      })
    })

    it("defaults pageStep to 10 * step", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 0, step: 3 })
        spin.pageIncrement()
        flush()
        expect(spin.value()).toBe(30)
        dispose()
      })
    })

    it("defaults pageStep to 10 when step is default (1)", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 0 })
        spin.pageIncrement()
        flush()
        expect(spin.value()).toBe(10)
        dispose()
      })
    })
  })

  describe("min/max clamping", () => {
    it("clamps value at max on increment", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 9, max: 10, step: 5 })
        spin.increment()
        flush()
        expect(spin.value()).toBe(10)
        dispose()
      })
    })

    it("clamps value at min on decrement", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 2, min: 0, step: 5 })
        spin.decrement()
        flush()
        expect(spin.value()).toBe(0)
        dispose()
      })
    })

    it("does not change value when already at max and incrementing without wrap", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 10, max: 10 })
        spin.increment()
        flush()
        expect(spin.value()).toBe(10)
        dispose()
      })
    })

    it("does not change value when already at min and decrementing without wrap", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 0, min: 0 })
        spin.decrement()
        flush()
        expect(spin.value()).toBe(0)
        dispose()
      })
    })

    it("supports reactive min/max accessors", () => {
      createRoot((dispose) => {
        const [max, setMax] = createSignal(100, { ownedWrite: true })
        const spin = createSpinButton({ defaultValue: 50, max })
        spin.setValue(200)
        flush()
        expect(spin.value()).toBe(100)
        setMax(150)
        flush()
        spin.setValue(200)
        flush()
        expect(spin.value()).toBe(150)
        dispose()
      })
    })
  })

  describe("wrap mode", () => {
    it("wraps to min when incrementing past max", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 10, min: 0, max: 10, wrap: true })
        spin.increment()
        flush()
        expect(spin.value()).toBe(0)
        dispose()
      })
    })

    it("wraps to max when decrementing past min", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 0, min: 0, max: 10, wrap: true })
        spin.decrement()
        flush()
        expect(spin.value()).toBe(10)
        dispose()
      })
    })

    it("does not wrap when wrap is false", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 10, min: 0, max: 10, wrap: false })
        spin.increment()
        flush()
        expect(spin.value()).toBe(10)
        dispose()
      })
    })
  })

  describe("home/end", () => {
    it("setToMin sets value to minimum", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 50, min: 0, max: 100 })
        spin.setToMin()
        flush()
        expect(spin.value()).toBe(0)
        dispose()
      })
    })

    it("setToMax sets value to maximum", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 50, min: 0, max: 100 })
        spin.setToMax()
        flush()
        expect(spin.value()).toBe(100)
        dispose()
      })
    })

    it("setToMin does nothing when min is -Infinity", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 50 })
        spin.setToMin()
        flush()
        expect(spin.value()).toBe(50)
        dispose()
      })
    })

    it("setToMax does nothing when max is Infinity", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 50 })
        spin.setToMax()
        flush()
        expect(spin.value()).toBe(50)
        dispose()
      })
    })
  })

  describe("disabled", () => {
    it("increment is a no-op when disabled", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 5, disabled: () => true })
        spin.increment()
        flush()
        expect(spin.value()).toBe(5)
        dispose()
      })
    })

    it("decrement is a no-op when disabled", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 5, disabled: () => true })
        spin.decrement()
        flush()
        expect(spin.value()).toBe(5)
        dispose()
      })
    })

    it("setValue is a no-op when disabled", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 5, disabled: () => true })
        spin.setValue(10)
        flush()
        expect(spin.value()).toBe(5)
        dispose()
      })
    })

    it("handleKeyDown is a no-op when disabled", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 5, disabled: () => true })
        const event = createKeyboardEvent("ArrowUp")
        spin.handleKeyDown(event)
        flush()
        expect(spin.value()).toBe(5)
        dispose()
      })
    })
  })

  describe("readOnly", () => {
    it("increment is a no-op when readOnly", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 5, readOnly: () => true })
        spin.increment()
        flush()
        expect(spin.value()).toBe(5)
        dispose()
      })
    })

    it("decrement is a no-op when readOnly", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 5, readOnly: () => true })
        spin.decrement()
        flush()
        expect(spin.value()).toBe(5)
        dispose()
      })
    })

    it("handleKeyDown is a no-op when readOnly", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 5, readOnly: () => true })
        const event = createKeyboardEvent("ArrowDown")
        spin.handleKeyDown(event)
        flush()
        expect(spin.value()).toBe(5)
        dispose()
      })
    })
  })

  describe("controlled mode", () => {
    it("uses the controlled value accessor", () => {
      createRoot((dispose) => {
        const [val] = createSignal(42, { ownedWrite: true })
        const spin = createSpinButton({ value: val })
        expect(spin.value()).toBe(42)
        dispose()
      })
    })

    it("does not update internal state on increment", () => {
      createRoot((dispose) => {
        const [val] = createSignal(5, { ownedWrite: true })
        const onChange = vi.fn()
        const spin = createSpinButton({ value: val, onChange })
        spin.increment()
        flush()
        // Value stays the same since it's controlled
        expect(spin.value()).toBe(5)
        // But onChange fires
        expect(onChange).toHaveBeenCalledWith(6, { reason: "increment" })
        dispose()
      })
    })

    it("fires onChange with reason and event", () => {
      createRoot((dispose) => {
        const [val] = createSignal(10, { ownedWrite: true })
        const onChange = vi.fn()
        const spin = createSpinButton({ value: val, onChange, step: 2 })
        const event = createKeyboardEvent("ArrowUp")
        spin.increment(event)
        flush()
        expect(onChange).toHaveBeenCalledWith(12, { reason: "increment", event })
        dispose()
      })
    })
  })

  describe("uncontrolled mode", () => {
    it("updates value internally", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 0 })
        spin.increment()
        flush()
        expect(spin.value()).toBe(1)
        spin.increment()
        flush()
        expect(spin.value()).toBe(2)
        dispose()
      })
    })

    it("fires onChange when value changes", () => {
      createRoot((dispose) => {
        const onChange = vi.fn()
        const spin = createSpinButton({ defaultValue: 0, onChange })
        spin.increment()
        flush()
        expect(onChange).toHaveBeenCalledWith(1, { reason: "increment" })
        dispose()
      })
    })

    it("defaults to 0 when no defaultValue provided", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({})
        expect(spin.value()).toBe(0)
        dispose()
      })
    })
  })

  describe("keyboard handling", () => {
    it("ArrowUp increments", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 5 })
        const event = createKeyboardEvent("ArrowUp")
        spin.handleKeyDown(event)
        flush()
        expect(spin.value()).toBe(6)
        expect(event.defaultPrevented).toBe(true)
        dispose()
      })
    })

    it("ArrowDown decrements", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 5 })
        const event = createKeyboardEvent("ArrowDown")
        spin.handleKeyDown(event)
        flush()
        expect(spin.value()).toBe(4)
        expect(event.defaultPrevented).toBe(true)
        dispose()
      })
    })

    it("PageUp page-increments", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 0, step: 2 })
        const event = createKeyboardEvent("PageUp")
        spin.handleKeyDown(event)
        flush()
        expect(spin.value()).toBe(20)
        expect(event.defaultPrevented).toBe(true)
        dispose()
      })
    })

    it("PageDown page-decrements", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 50, pageStep: 25 })
        const event = createKeyboardEvent("PageDown")
        spin.handleKeyDown(event)
        flush()
        expect(spin.value()).toBe(25)
        expect(event.defaultPrevented).toBe(true)
        dispose()
      })
    })

    it("Home sets to min", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 50, min: 0, max: 100 })
        const event = createKeyboardEvent("Home")
        spin.handleKeyDown(event)
        flush()
        expect(spin.value()).toBe(0)
        expect(event.defaultPrevented).toBe(true)
        dispose()
      })
    })

    it("End sets to max", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 50, min: 0, max: 100 })
        const event = createKeyboardEvent("End")
        spin.handleKeyDown(event)
        flush()
        expect(spin.value()).toBe(100)
        expect(event.defaultPrevented).toBe(true)
        dispose()
      })
    })

    it("Home does nothing when min is -Infinity", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 50 })
        const event = createKeyboardEvent("Home")
        spin.handleKeyDown(event)
        flush()
        expect(spin.value()).toBe(50)
        expect(event.defaultPrevented).toBe(false)
        dispose()
      })
    })

    it("End does nothing when max is Infinity", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 50 })
        const event = createKeyboardEvent("End")
        spin.handleKeyDown(event)
        flush()
        expect(spin.value()).toBe(50)
        expect(event.defaultPrevented).toBe(false)
        dispose()
      })
    })

    it("does not handle unrelated keys", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 5 })
        const event = createKeyboardEvent("a")
        spin.handleKeyDown(event)
        flush()
        expect(spin.value()).toBe(5)
        expect(event.defaultPrevented).toBe(false)
        dispose()
      })
    })
  })

  describe("long-press", () => {
    it("performs initial action immediately", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 0 })
        spin.startLongPress("increment")
        flush()
        expect(spin.value()).toBe(1)
        spin.stopLongPress()
        dispose()
      })
    })

    it("starts repeating after delay", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({
          defaultValue: 0,
          longPressDelay: 400,
          longPressInterval: 60,
        })
        spin.startLongPress("increment")
        flush()
        expect(spin.value()).toBe(1)

        // Advance past delay — starts interval but no tick yet
        vi.advanceTimersByTime(400)
        flush()
        expect(spin.value()).toBe(1)

        // First interval tick
        vi.advanceTimersByTime(60)
        flush()
        expect(spin.value()).toBe(2)

        // Second interval tick
        vi.advanceTimersByTime(60)
        flush()
        expect(spin.value()).toBe(3)

        spin.stopLongPress()
        dispose()
      })
    })

    it("does not repeat before delay elapses", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({
          defaultValue: 0,
          longPressDelay: 400,
          longPressInterval: 60,
        })
        spin.startLongPress("increment")
        flush()
        expect(spin.value()).toBe(1)

        vi.advanceTimersByTime(399)
        flush()
        expect(spin.value()).toBe(1)

        spin.stopLongPress()
        dispose()
      })
    })

    it("stopLongPress clears all timers", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({
          defaultValue: 0,
          longPressDelay: 400,
          longPressInterval: 60,
        })
        spin.startLongPress("increment")
        flush()
        expect(spin.value()).toBe(1)

        spin.stopLongPress()

        // Advance well past delay + intervals
        vi.advanceTimersByTime(1000)
        flush()
        expect(spin.value()).toBe(1)
        dispose()
      })
    })

    it("works with decrement direction", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({
          defaultValue: 10,
          longPressDelay: 400,
          longPressInterval: 60,
        })
        spin.startLongPress("decrement")
        flush()
        expect(spin.value()).toBe(9)

        vi.advanceTimersByTime(400)
        flush()
        vi.advanceTimersByTime(60)
        flush()
        expect(spin.value()).toBe(8)

        spin.stopLongPress()
        dispose()
      })
    })

    it("uses default longPressDelay of 400ms", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 0 })
        spin.startLongPress("increment")
        flush()
        expect(spin.value()).toBe(1)

        vi.advanceTimersByTime(399)
        flush()
        expect(spin.value()).toBe(1)

        vi.advanceTimersByTime(1) // delay fires at 400ms
        flush()
        expect(spin.value()).toBe(1) // interval hasn't ticked yet

        vi.advanceTimersByTime(60) // first interval tick
        flush()
        expect(spin.value()).toBe(2)

        spin.stopLongPress()
        dispose()
      })
    })

    it("uses default longPressInterval of 60ms", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 0, longPressDelay: 100 })
        spin.startLongPress("increment")
        flush()
        expect(spin.value()).toBe(1)

        vi.advanceTimersByTime(100) // delay fires
        flush()
        vi.advanceTimersByTime(59) // not yet
        flush()
        expect(spin.value()).toBe(1)

        vi.advanceTimersByTime(1) // fires at 60ms after interval start
        flush()
        expect(spin.value()).toBe(2)

        spin.stopLongPress()
        dispose()
      })
    })
  })

  describe("ARIA props", () => {
    it("returns correct role", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 5 })
        const props = spin.spinButtonProps()
        expect(props.role).toBe("spinbutton")
        dispose()
      })
    })

    it("includes aria-valuenow", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 42 })
        const props = spin.spinButtonProps()
        expect(props["aria-valuenow"]).toBe(42)
        dispose()
      })
    })

    it("includes aria-valuemin when min is finite", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 5, min: 0 })
        const props = spin.spinButtonProps()
        expect(props["aria-valuemin"]).toBe(0)
        dispose()
      })
    })

    it("excludes aria-valuemin when min is -Infinity", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 5 })
        const props = spin.spinButtonProps()
        expect(props["aria-valuemin"]).toBeUndefined()
        dispose()
      })
    })

    it("includes aria-valuemax when max is finite", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 5, max: 100 })
        const props = spin.spinButtonProps()
        expect(props["aria-valuemax"]).toBe(100)
        dispose()
      })
    })

    it("excludes aria-valuemax when max is Infinity", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 5 })
        const props = spin.spinButtonProps()
        expect(props["aria-valuemax"]).toBeUndefined()
        dispose()
      })
    })

    it("includes aria-valuetext when formatValue differs from String(value)", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({
          defaultValue: 50,
          formatValue: (v) => `${v}%`,
        })
        const props = spin.spinButtonProps()
        expect(props["aria-valuetext"]).toBe("50%")
        dispose()
      })
    })

    it("excludes aria-valuetext when formatValue matches String(value)", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({
          defaultValue: 50,
          formatValue: (v) => String(v),
        })
        const props = spin.spinButtonProps()
        expect(props["aria-valuetext"]).toBeUndefined()
        dispose()
      })
    })

    it("excludes aria-valuetext when no formatValue provided", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 50 })
        const props = spin.spinButtonProps()
        expect(props["aria-valuetext"]).toBeUndefined()
        dispose()
      })
    })

    it("includes aria-disabled when disabled", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 5, disabled: () => true })
        const props = spin.spinButtonProps()
        expect(props["aria-disabled"]).toBe("true")
        dispose()
      })
    })

    it("excludes aria-disabled when not disabled", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 5, disabled: () => false })
        const props = spin.spinButtonProps()
        expect(props["aria-disabled"]).toBeUndefined()
        dispose()
      })
    })

    it("includes aria-readonly when readOnly", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 5, readOnly: () => true })
        const props = spin.spinButtonProps()
        expect(props["aria-readonly"]).toBe("true")
        dispose()
      })
    })
  })

  describe("commitText", () => {
    it("parses and sets a valid number", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 0, min: 0, max: 100 })
        const success = spin.commitText("42")
        flush()
        expect(success).toBe(true)
        expect(spin.value()).toBe(42)
        dispose()
      })
    })

    it("returns false for invalid text", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 5 })
        const success = spin.commitText("abc")
        flush()
        expect(success).toBe(false)
        expect(spin.value()).toBe(5)
        dispose()
      })
    })

    it("clamps parsed value to min/max", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 50, min: 0, max: 100 })
        spin.commitText("200")
        flush()
        expect(spin.value()).toBe(100)
        dispose()
      })
    })

    it("uses custom parseValue", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({
          defaultValue: 0,
          parseValue: (text) => {
            const cleaned = text.replace("$", "")
            return parseFloat(cleaned)
          },
        })
        const success = spin.commitText("$25")
        flush()
        expect(success).toBe(true)
        expect(spin.value()).toBe(25)
        dispose()
      })
    })

    it("returns false when custom parseValue returns NaN", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({
          defaultValue: 10,
          parseValue: () => NaN,
        })
        const success = spin.commitText("anything")
        flush()
        expect(success).toBe(false)
        expect(spin.value()).toBe(10)
        dispose()
      })
    })
  })

  describe("displayValue", () => {
    it("returns String(value) by default", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 42 })
        expect(spin.displayValue()).toBe("42")
        dispose()
      })
    })

    it("uses formatValue when provided", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({
          defaultValue: 0.5,
          formatValue: (v) => `${(v * 100).toFixed(0)}%`,
        })
        expect(spin.displayValue()).toBe("50%")
        dispose()
      })
    })

    it("updates reactively", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({
          defaultValue: 1,
          formatValue: (v) => `$${v}`,
        })
        expect(spin.displayValue()).toBe("$1")
        spin.increment()
        flush()
        expect(spin.displayValue()).toBe("$2")
        dispose()
      })
    })
  })

  describe("isAtMin/isAtMax", () => {
    it("isAtMin is true when value equals min", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 0, min: 0, max: 10 })
        expect(spin.isAtMin()).toBe(true)
        expect(spin.isAtMax()).toBe(false)
        dispose()
      })
    })

    it("isAtMax is true when value equals max", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 10, min: 0, max: 10 })
        expect(spin.isAtMin()).toBe(false)
        expect(spin.isAtMax()).toBe(true)
        dispose()
      })
    })

    it("isAtMin is false when min is -Infinity", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: -999999 })
        expect(spin.isAtMin()).toBe(false)
        dispose()
      })
    })

    it("isAtMax is false when max is Infinity", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 999999 })
        expect(spin.isAtMax()).toBe(false)
        dispose()
      })
    })

    it("updates reactively on value change", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 1, min: 0, max: 2 })
        expect(spin.isAtMin()).toBe(false)
        expect(spin.isAtMax()).toBe(false)

        spin.decrement()
        flush()
        expect(spin.isAtMin()).toBe(true)

        spin.increment()
        flush()
        spin.increment()
        flush()
        expect(spin.isAtMax()).toBe(true)
        dispose()
      })
    })
  })

  describe("setValue", () => {
    it("sets value directly with clamping", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 0, min: 0, max: 100 })
        spin.setValue(75)
        flush()
        expect(spin.value()).toBe(75)
        dispose()
      })
    })

    it("clamps to max", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 0, max: 50 })
        spin.setValue(100)
        flush()
        expect(spin.value()).toBe(50)
        dispose()
      })
    })

    it("clamps to min", () => {
      createRoot((dispose) => {
        const spin = createSpinButton({ defaultValue: 50, min: 10 })
        spin.setValue(5)
        flush()
        expect(spin.value()).toBe(10)
        dispose()
      })
    })
  })
})
