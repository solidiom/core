import { describe, it, expect, vi } from "vitest"
import { createRoot, createSignal, flush } from "solid-js"
import { createControllableValue } from "./controllable-value"
import { createChangeDetails } from "../events/change-details"

describe("createControllableValue", () => {
  describe("uncontrolled mode", () => {
    it("uses defaultValue as initial value", () => {
      createRoot((dispose) => {
        const { value } = createControllableValue({
          defaultValue: "hello",
        })
        expect(value()).toBe("hello")
        dispose()
      })
    })

    it("supports factory defaultValue", () => {
      createRoot((dispose) => {
        const { value } = createControllableValue({
          defaultValue: () => 42,
        })
        expect(value()).toBe(42)
        dispose()
      })
    })

    it("updates internal state on requestChange", () => {
      createRoot((dispose) => {
        const { value, requestChange } = createControllableValue<string, "test">({
          defaultValue: "a",
        })
        requestChange("b", createChangeDetails("test"))
        flush()
        expect(value()).toBe("b")
        dispose()
      })
    })

    it("calls onChange on requestChange", () => {
      createRoot((dispose) => {
        const onChange = vi.fn()
        const { requestChange } = createControllableValue<string, "test">({
          defaultValue: "a",
          onChange,
        })
        const details = createChangeDetails("test")
        requestChange("b", details)
        expect(onChange).toHaveBeenCalledWith("b", details)
        dispose()
      })
    })
  })

  describe("controlled mode", () => {
    it("returns the controlled value", () => {
      createRoot((dispose) => {
        const [controlled] = createSignal("external")
        const { value } = createControllableValue<string, "test">({
          value: controlled,
          defaultValue: "ignored",
        })
        expect(value()).toBe("external")
        dispose()
      })
    })

    it("does not update internal state on requestChange", () => {
      createRoot((dispose) => {
        const [controlled] = createSignal("external")
        const onChange = vi.fn()
        const { value, requestChange } = createControllableValue<string, "test">({
          value: controlled,
          defaultValue: "ignored",
          onChange,
        })
        requestChange("new", createChangeDetails("test"))
        // Value remains controlled — consumer must update
        expect(value()).toBe("external")
        expect(onChange).toHaveBeenCalledWith("new", expect.objectContaining({ reason: "test" }))
        dispose()
      })
    })

    it("falls back to uncontrolled when controlled returns undefined", () => {
      createRoot((dispose) => {
        const [controlled] = createSignal<string | undefined>(undefined)
        const { value } = createControllableValue<string, "test">({
          value: controlled,
          defaultValue: "fallback",
        })
        expect(value()).toBe("fallback")
        dispose()
      })
    })
  })

  describe("equality checks", () => {
    it("skips requestChange when value is equal (Object.is default)", () => {
      createRoot((dispose) => {
        const onChange = vi.fn()
        const { requestChange } = createControllableValue<string, "test">({
          defaultValue: "same",
          onChange,
        })
        requestChange("same", createChangeDetails("test"))
        expect(onChange).not.toHaveBeenCalled()
        dispose()
      })
    })

    it("uses custom equality function", () => {
      createRoot((dispose) => {
        const onChange = vi.fn()
        // Case-insensitive equality
        const { requestChange } = createControllableValue<string, "test">({
          defaultValue: "Hello",
          onChange,
          equals: (a, b) => a.toLowerCase() === b.toLowerCase(),
        })
        requestChange("hello", createChangeDetails("test"))
        expect(onChange).not.toHaveBeenCalled()
        requestChange("world", createChangeDetails("test"))
        expect(onChange).toHaveBeenCalledWith("world", expect.anything())
        dispose()
      })
    })

    it("disables equality when equals is false", () => {
      createRoot((dispose) => {
        const onChange = vi.fn()
        const { requestChange } = createControllableValue<string, "test">({
          defaultValue: "same",
          onChange,
          equals: false,
        })
        requestChange("same", createChangeDetails("test"))
        expect(onChange).toHaveBeenCalled()
        dispose()
      })
    })
  })

  describe("guards", () => {
    it("suppresses requestChange when disabled", () => {
      createRoot((dispose) => {
        const onChange = vi.fn()
        const { value, requestChange } = createControllableValue<string, "test">({
          defaultValue: "a",
          onChange,
          disabled: () => true,
        })
        requestChange("b", createChangeDetails("test"))
        expect(value()).toBe("a")
        expect(onChange).not.toHaveBeenCalled()
        dispose()
      })
    })

    it("suppresses requestChange when readOnly", () => {
      createRoot((dispose) => {
        const onChange = vi.fn()
        const { value, requestChange } = createControllableValue<string, "test">({
          defaultValue: "a",
          onChange,
          readOnly: () => true,
        })
        requestChange("b", createChangeDetails("test"))
        expect(value()).toBe("a")
        expect(onChange).not.toHaveBeenCalled()
        dispose()
      })
    })

    it("allows requestChange when disabled becomes false", () => {
      createRoot((dispose) => {
        const [disabled, setDisabled] = createSignal(true, { ownedWrite: true })
        const { value, requestChange } = createControllableValue<string, "test">({
          defaultValue: "a",
          disabled,
        })
        requestChange("b", createChangeDetails("test"))
        expect(value()).toBe("a")
        setDisabled(false)
        flush()
        requestChange("b", createChangeDetails("test"))
        flush()
        expect(value()).toBe("b")
        dispose()
      })
    })
  })

  describe("change-reason propagation", () => {
    it("passes reason and originalEvent through onChange", () => {
      createRoot((dispose) => {
        const onChange = vi.fn()
        const { requestChange } = createControllableValue<boolean, "escape-key">({
          defaultValue: true,
          onChange,
        })
        const event = new Event("keydown")
        requestChange(false, createChangeDetails("escape-key", event))
        expect(onChange).toHaveBeenCalledWith(false, {
          reason: "escape-key",
          originalEvent: event,
        })
        dispose()
      })
    })
  })
})
