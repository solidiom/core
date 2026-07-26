import { describe, it, expect } from "vitest"
import { createRoot, createSignal, flush } from "solid-js"
import { createPresence } from "./presence"

describe("createPresence", () => {
  describe("non-animated (default)", () => {
    it("starts as entered/present when open=true", () => {
      createRoot((dispose) => {
        const presence = createPresence({ open: () => true })
        expect(presence.phase()).toBe("entered")
        expect(presence.present()).toBe(true)
        dispose()
      })
    })

    it("starts as exited/not-present when open=false", () => {
      createRoot((dispose) => {
        const presence = createPresence({ open: () => false })
        expect(presence.phase()).toBe("exited")
        expect(presence.present()).toBe(false)
        dispose()
      })
    })

    it("transitions directly to entered when opened", () => {
      createRoot((dispose) => {
        const [open, setOpen] = createSignal(false, { ownedWrite: true })
        const presence = createPresence({ open })
        expect(presence.phase()).toBe("exited")

        setOpen(true)
        flush()
        presence.present()
        flush()
        expect(presence.phase()).toBe("entered")
        expect(presence.present()).toBe(true)
        dispose()
      })
    })

    it("transitions directly to exited when closed", () => {
      createRoot((dispose) => {
        const [open, setOpen] = createSignal(true, { ownedWrite: true })
        const presence = createPresence({ open })
        expect(presence.phase()).toBe("entered")

        setOpen(false)
        flush()
        presence.present()
        flush()
        expect(presence.phase()).toBe("exited")
        expect(presence.present()).toBe(false)
        dispose()
      })
    })
  })

  describe("animated", () => {
    it("transitions to entering when opened", () => {
      createRoot((dispose) => {
        const [open, setOpen] = createSignal(false, { ownedWrite: true })
        const presence = createPresence({ open, animated: true })
        expect(presence.phase()).toBe("exiting")

        setOpen(true)
        flush()
        presence.present()
        flush()
        expect(presence.phase()).toBe("entering")
        expect(presence.present()).toBe(true)
        dispose()
      })
    })

    it("transitions to entered after onEntered is called", () => {
      createRoot((dispose) => {
        const [open, setOpen] = createSignal(false, { ownedWrite: true })
        const presence = createPresence({ open, animated: true })

        setOpen(true)
        flush()
        presence.present()
        flush()
        expect(presence.phase()).toBe("entering")

        presence.onEntered()
        flush()
        expect(presence.phase()).toBe("entered")
        expect(presence.present()).toBe(true)
        dispose()
      })
    })

    it("transitions to exiting when closed", () => {
      createRoot((dispose) => {
        const [open, setOpen] = createSignal(true, { ownedWrite: true })
        const presence = createPresence({ open, animated: true })
        expect(presence.phase()).toBe("entering")

        // Complete enter first
        presence.onEntered()
        flush()
        expect(presence.phase()).toBe("entered")

        setOpen(false)
        flush()
        presence.present()
        flush()
        expect(presence.phase()).toBe("exiting")
        // Still present during exit animation
        expect(presence.present()).toBe(true)
        dispose()
      })
    })

    it("transitions to exited after onExited is called", () => {
      createRoot((dispose) => {
        const [open, setOpen] = createSignal(true, { ownedWrite: true })
        const presence = createPresence({ open, animated: true })
        presence.onEntered()
        flush()

        setOpen(false)
        flush()
        presence.present()
        flush()
        expect(presence.phase()).toBe("exiting")

        presence.onExited()
        flush()
        expect(presence.phase()).toBe("exited")
        expect(presence.present()).toBe(false)
        dispose()
      })
    })

    it("onEntered is no-op when not in entering phase", () => {
      createRoot((dispose) => {
        const presence = createPresence({ open: () => true, animated: true })
        presence.onEntered() // complete entering
        flush()
        expect(presence.phase()).toBe("entered")
        presence.onEntered() // no-op
        flush()
        expect(presence.phase()).toBe("entered")
        dispose()
      })
    })

    it("onExited is no-op when not in exiting phase", () => {
      createRoot((dispose) => {
        const presence = createPresence({ open: () => false, animated: true })
        expect(presence.phase()).toBe("exiting")
        presence.onExited() // complete exiting
        flush()
        expect(presence.phase()).toBe("exited")
        presence.onExited() // no-op
        flush()
        expect(presence.phase()).toBe("exited")
        dispose()
      })
    })
  })
})
