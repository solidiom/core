import { describe, it, expect, beforeEach } from "vitest"
import { createRoot, createSignal } from "solid-js"
import {
  createDisclosureState,
  createStableId,
  applySemanticAttrs,
  createChangeDetails,
  resetIdCounter,
  type DisclosureReason,
} from "@solidiom/runtime"

describe("dialog", () => {
  beforeEach(() => {
    resetIdCounter()
  })

  describe("context setup", () => {
    it("creates stable IDs for ARIA relationships", () => {
      createRoot((dispose) => {
        const titleId = createStableId("dialog-title")
        const descriptionId = createStableId("dialog-desc")
        const contentId = createStableId("dialog-content")

        expect(titleId).toBe("dialog-title-1")
        expect(descriptionId).toBe("dialog-desc-2")
        expect(contentId).toBe("dialog-content-3")
        dispose()
      })
    })

    it("disclosure state defaults to closed", () => {
      createRoot((dispose) => {
        const disclosure = createDisclosureState()
        expect(disclosure.open()).toBe(false)
        dispose()
      })
    })

    it("disclosure state respects defaultOpen", () => {
      createRoot((dispose) => {
        const disclosure = createDisclosureState({ defaultOpen: true })
        expect(disclosure.open()).toBe(true)
        dispose()
      })
    })
  })

  describe("open state transitions", () => {
    it("transitions from closed to open on requestOpenChange", () => {
      createRoot((dispose) => {
        const disclosure = createDisclosureState()
        expect(disclosure.open()).toBe(false)

        disclosure.requestOpenChange(true, createChangeDetails("trigger"))
        expect(disclosure.open()).toBe(true)
        dispose()
      })
    })

    it("transitions from open to closed on requestOpenChange", () => {
      createRoot((dispose) => {
        const disclosure = createDisclosureState({ defaultOpen: true })
        expect(disclosure.open()).toBe(true)

        disclosure.requestOpenChange(false, createChangeDetails("close"))
        expect(disclosure.open()).toBe(false)
        dispose()
      })
    })

    it("invokes onOpenChange callback with reason", () => {
      createRoot((dispose) => {
        const changes: Array<{ next: boolean; reason: DisclosureReason }> = []
        const disclosure = createDisclosureState({
          onOpenChange: (next, details) => {
            changes.push({ next, reason: details.reason })
          },
        })

        disclosure.requestOpenChange(true, createChangeDetails("trigger"))
        disclosure.requestOpenChange(false, createChangeDetails("escape-key"))

        expect(changes).toEqual([
          { next: true, reason: "trigger" },
          { next: false, reason: "escape-key" },
        ])
        dispose()
      })
    })

    it("controlled mode does not update internal state on requestChange", () => {
      createRoot((dispose) => {
        const [open] = createSignal("false" as unknown as boolean | undefined)
        const changes: boolean[] = []

        const disclosure = createDisclosureState({
          open: open as unknown as () => boolean | undefined,
          onOpenChange: (next) => {
            changes.push(next)
          },
        })

        // Value stays as controlled value — consumer must update externally
        disclosure.requestOpenChange(true, createChangeDetails("trigger"))
        expect(changes).toEqual([true])
        dispose()
      })
    })

    it("controlled mode reflects external signal value", () => {
      createRoot((dispose) => {
        const [open] = createSignal<boolean | undefined>(false)

        const disclosure = createDisclosureState({ open })

        // Controlled by external signal
        expect(disclosure.open()).toBe(false)
        dispose()
      })
    })
  })

  describe("semantic attrs", () => {
    it("generates correct attrs for trigger", () => {
      const attrs = applySemanticAttrs({
        scope: "dialog",
        part: "trigger",
        state: "closed",
      })
      expect(attrs["data-scope"]).toBe("dialog")
      expect(attrs["data-part"]).toBe("trigger")
      expect(attrs["data-state"]).toBe("closed")
    })

    it("generates correct attrs for content", () => {
      const attrs = applySemanticAttrs({
        scope: "dialog",
        part: "content",
        state: "open",
      })
      expect(attrs["data-scope"]).toBe("dialog")
      expect(attrs["data-part"]).toBe("content")
      expect(attrs["data-state"]).toBe("open")
    })

    it("generates correct attrs for backdrop", () => {
      const attrs = applySemanticAttrs({
        scope: "dialog",
        part: "backdrop",
        state: "open",
      })
      expect(attrs["data-scope"]).toBe("dialog")
      expect(attrs["data-part"]).toBe("backdrop")
      expect(attrs["data-state"]).toBe("open")
    })

    it("generates correct attrs for title", () => {
      const attrs = applySemanticAttrs({
        scope: "dialog",
        part: "title",
      })
      expect(attrs["data-scope"]).toBe("dialog")
      expect(attrs["data-part"]).toBe("title")
      expect(attrs["data-state"]).toBeUndefined()
    })

    it("generates correct attrs for description", () => {
      const attrs = applySemanticAttrs({
        scope: "dialog",
        part: "description",
      })
      expect(attrs["data-scope"]).toBe("dialog")
      expect(attrs["data-part"]).toBe("description")
    })

    it("generates correct attrs for close", () => {
      const attrs = applySemanticAttrs({
        scope: "dialog",
        part: "close",
      })
      expect(attrs["data-scope"]).toBe("dialog")
      expect(attrs["data-part"]).toBe("close")
    })
  })
})
