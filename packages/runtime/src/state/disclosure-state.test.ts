import { describe, it, expect, vi } from "vitest"
import { createRoot, createSignal, flush } from "solid-js"
import { createDisclosureState } from "./disclosure-state"
import { createChangeDetails } from "../events/change-details"

describe("createDisclosureState", () => {
  it("defaults to closed", () => {
    createRoot((dispose) => {
      const { open } = createDisclosureState()
      expect(open()).toBe(false)
      dispose()
    })
  })

  it("respects defaultOpen", () => {
    createRoot((dispose) => {
      const { open } = createDisclosureState({ defaultOpen: true })
      expect(open()).toBe(true)
      dispose()
    })
  })

  it("toggles open state (uncontrolled)", () => {
    createRoot((dispose) => {
      const { open, requestOpenChange } = createDisclosureState()
      requestOpenChange(true, createChangeDetails("trigger"))
      flush()
      expect(open()).toBe(true)
      requestOpenChange(false, createChangeDetails("escape-key"))
      flush()
      expect(open()).toBe(false)
      dispose()
    })
  })

  it("calls onOpenChange with reason", () => {
    createRoot((dispose) => {
      const onOpenChange = vi.fn()
      const { requestOpenChange } = createDisclosureState({ onOpenChange })
      const event = new Event("click")
      requestOpenChange(true, createChangeDetails("trigger", event))
      expect(onOpenChange).toHaveBeenCalledWith(true, {
        reason: "trigger",
        originalEvent: event,
      })
      dispose()
    })
  })

  it("works in controlled mode", () => {
    createRoot((dispose) => {
      const [controlled, setControlled] = createSignal<boolean | undefined>(false, {
        ownedWrite: true,
      })
      const onOpenChange = vi.fn()
      const { open, requestOpenChange } = createDisclosureState({
        open: controlled,
        onOpenChange,
      })
      expect(open()).toBe(false)
      requestOpenChange(true, createChangeDetails("trigger"))
      // Still false — controlled
      expect(open()).toBe(false)
      expect(onOpenChange).toHaveBeenCalled()
      // Consumer updates
      setControlled(true)
      flush()
      expect(open()).toBe(true)
      dispose()
    })
  })

  it("suppresses changes when disabled", () => {
    createRoot((dispose) => {
      const onOpenChange = vi.fn()
      const { open, requestOpenChange } = createDisclosureState({
        disabled: () => true,
        onOpenChange,
      })
      requestOpenChange(true, createChangeDetails("trigger"))
      expect(open()).toBe(false)
      expect(onOpenChange).not.toHaveBeenCalled()
      dispose()
    })
  })
})
