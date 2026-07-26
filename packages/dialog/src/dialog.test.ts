/**
 * Dialog unit tests — verifies state management and context logic.
 * Full render tests require browser mode (Task 12 demo verification).
 */

import { describe, it, expect, vi } from "vitest"
import { createRoot, createSignal, flush } from "solid-js"
import {
  createDisclosureState,
  createPresence,
  createStableId,
  applySemanticAttrs,
  createChangeDetails,
  resetIdCounter,
} from "@solidiom/runtime"

describe("Dialog state logic", () => {
  describe("disclosure state", () => {
    it("defaults to closed", () => {
      createRoot((dispose) => {
        const { open } = createDisclosureState()
        expect(open()).toBe(false)
        dispose()
      })
    })

    it("opens on trigger request", () => {
      createRoot((dispose) => {
        const { open, requestOpenChange } = createDisclosureState()
        requestOpenChange(true, createChangeDetails("trigger"))
        flush()
        expect(open()).toBe(true)
        dispose()
      })
    })

    it("closes on escape-key request", () => {
      createRoot((dispose) => {
        const { open, requestOpenChange } = createDisclosureState({ defaultOpen: true })
        requestOpenChange(false, createChangeDetails("escape-key"))
        flush()
        expect(open()).toBe(false)
        dispose()
      })
    })

    it("supports controlled mode", () => {
      createRoot((dispose) => {
        const [controlled] = createSignal<boolean | undefined>(true)
        const onOpenChange = vi.fn()
        const { open, requestOpenChange } = createDisclosureState({
          open: controlled,
          onOpenChange,
        })
        expect(open()).toBe(true)
        requestOpenChange(false, createChangeDetails("close"))
        expect(open()).toBe(true) // still controlled
        expect(onOpenChange).toHaveBeenCalledWith(
          false,
          expect.objectContaining({ reason: "close" }),
        )
        dispose()
      })
    })
  })

  describe("presence integration", () => {
    it("present tracks open state", () => {
      createRoot((dispose) => {
        const [open, setOpen] = createSignal(false, { ownedWrite: true })
        const presence = createPresence({ open })
        expect(presence.present()).toBe(false)
        setOpen(true)
        flush()
        // trackedPhase() reads open(), detects change, writes phase — another batched write
        presence.present()
        flush()
        expect(presence.present()).toBe(true)
        dispose()
      })
    })
  })

  describe("semantic attributes", () => {
    it("generates correct trigger attrs", () => {
      const attrs = applySemanticAttrs({ scope: "dialog", part: "trigger", state: "open" })
      expect(attrs["data-scope"]).toBe("dialog")
      expect(attrs["data-part"]).toBe("trigger")
      expect(attrs["data-state"]).toBe("open")
    })

    it("generates correct content attrs", () => {
      const attrs = applySemanticAttrs({ scope: "dialog", part: "content", state: "closed" })
      expect(attrs["data-scope"]).toBe("dialog")
      expect(attrs["data-part"]).toBe("content")
      expect(attrs["data-state"]).toBe("closed")
    })
  })

  describe("ID generation", () => {
    it("generates coordinated IDs from base", () => {
      resetIdCounter()
      const baseId = createStableId("dialog")
      expect(baseId).toMatch(/^dialog-\d+$/)
      expect(`${baseId}-content`).toMatch(/^dialog-\d+-content$/)
      expect(`${baseId}-title`).toMatch(/^dialog-\d+-title$/)
    })
  })

  describe("change-details reasons", () => {
    it("supports all dialog reasons", () => {
      const reasons = [
        "trigger",
        "close",
        "escape-key",
        "pointer-outside",
        "focus-outside",
        "programmatic",
      ] as const
      for (const reason of reasons) {
        const details = createChangeDetails(reason)
        expect(details.reason).toBe(reason)
      }
    })
  })
})
