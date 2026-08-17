import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { createRoot } from "solid-js"
import { createClipboard } from "./clipboard"

describe("createClipboard", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  describe("copy — success path", () => {
    it("copies text via navigator.clipboard.writeText", async () => {
      const writeText = vi.fn().mockResolvedValue(undefined)
      Object.defineProperty(globalThis, "navigator", {
        value: { clipboard: { writeText } },
        configurable: true,
      })
      Object.defineProperty(globalThis, "document", {
        value: {},
        configurable: true,
      })

      const { copy, lastCopied } = createClipboard()
      const result = await copy("hello")

      expect(result).toBe(true)
      expect(writeText).toHaveBeenCalledWith("hello")
      expect(lastCopied()).toBe("hello")
    })
  })

  describe("copy — fallback path", () => {
    it("uses execCommand fallback when navigator.clipboard is unavailable", async () => {
      const execCommand = vi.fn().mockReturnValue(true)
      const mockTextarea = {
        value: "",
        style: {} as CSSStyleDeclaration,
        select: vi.fn(),
      }
      Object.defineProperty(globalThis, "navigator", {
        value: {},
        configurable: true,
      })
      Object.defineProperty(globalThis, "document", {
        value: {
          createElement: vi.fn().mockReturnValue(mockTextarea),
          body: {
            appendChild: vi.fn(),
            removeChild: vi.fn(),
          },
          execCommand,
        },
        configurable: true,
      })

      const { copy } = createClipboard()
      const result = await copy("fallback-text")

      expect(result).toBe(true)
      expect(execCommand).toHaveBeenCalledWith("copy")
      expect(mockTextarea.value).toBe("fallback-text")
      expect(mockTextarea.select).toHaveBeenCalled()
    })
  })

  describe("copied signal timing", () => {
    it("becomes true after copy and resets after copiedDuration", async () => {
      const writeText = vi.fn().mockResolvedValue(undefined)
      Object.defineProperty(globalThis, "navigator", {
        value: { clipboard: { writeText } },
        configurable: true,
      })
      Object.defineProperty(globalThis, "document", {
        value: {},
        configurable: true,
      })

      const { copy, copied } = createClipboard({ copiedDuration: 1000 })

      expect(copied()).toBe(false)
      await copy("test")
      expect(copied()).toBe(true)

      await vi.advanceTimersByTimeAsync(999)
      expect(copied()).toBe(true)

      await vi.advanceTimersByTimeAsync(1)
      expect(copied()).toBe(false)
    })

    it("uses default copiedDuration of 2000ms", async () => {
      const writeText = vi.fn().mockResolvedValue(undefined)
      Object.defineProperty(globalThis, "navigator", {
        value: { clipboard: { writeText } },
        configurable: true,
      })
      Object.defineProperty(globalThis, "document", {
        value: {},
        configurable: true,
      })

      const { copy, copied } = createClipboard()

      await copy("test")
      expect(copied()).toBe(true)

      await vi.advanceTimersByTimeAsync(1999)
      expect(copied()).toBe(true)

      await vi.advanceTimersByTimeAsync(1)
      expect(copied()).toBe(false)
    })
  })

  describe("lastCopied tracks the value", () => {
    it("updates lastCopied on each successful copy", async () => {
      const writeText = vi.fn().mockResolvedValue(undefined)
      Object.defineProperty(globalThis, "navigator", {
        value: { clipboard: { writeText } },
        configurable: true,
      })
      Object.defineProperty(globalThis, "document", {
        value: {},
        configurable: true,
      })

      const { copy, lastCopied } = createClipboard()

      expect(lastCopied()).toBeUndefined()
      await copy("first")
      expect(lastCopied()).toBe("first")
      await copy("second")
      expect(lastCopied()).toBe("second")
    })
  })

  describe("read — success path", () => {
    it("reads text via navigator.clipboard.readText", async () => {
      const readText = vi.fn().mockResolvedValue("clipboard-content")
      Object.defineProperty(globalThis, "navigator", {
        value: { clipboard: { readText } },
        configurable: true,
      })
      Object.defineProperty(globalThis, "document", {
        value: {},
        configurable: true,
      })

      const { read } = createClipboard()
      const result = await read()

      expect(result).toBe("clipboard-content")
      expect(readText).toHaveBeenCalled()
    })
  })

  describe("lastRead tracks the value", () => {
    it("updates lastRead on each successful read", async () => {
      let readValue = "first-read"
      const readText = vi.fn().mockImplementation(() => Promise.resolve(readValue))
      Object.defineProperty(globalThis, "navigator", {
        value: { clipboard: { readText } },
        configurable: true,
      })
      Object.defineProperty(globalThis, "document", {
        value: {},
        configurable: true,
      })

      const { read, lastRead } = createClipboard()

      expect(lastRead()).toBeUndefined()
      await read()
      expect(lastRead()).toBe("first-read")

      readValue = "second-read"
      await read()
      expect(lastRead()).toBe("second-read")
    })
  })

  describe("error callbacks", () => {
    it("calls onCopyError when writeText rejects", async () => {
      const error = new Error("NotAllowedError")
      const writeText = vi.fn().mockRejectedValue(error)
      Object.defineProperty(globalThis, "navigator", {
        value: { clipboard: { writeText } },
        configurable: true,
      })
      Object.defineProperty(globalThis, "document", {
        value: {},
        configurable: true,
      })

      const onCopyError = vi.fn()
      const { copy } = createClipboard({ onCopyError })
      const result = await copy("text")

      expect(result).toBe(false)
      expect(onCopyError).toHaveBeenCalledWith(error)
    })

    it("calls onPasteError when readText rejects", async () => {
      const error = new Error("SecurityError")
      const readText = vi.fn().mockRejectedValue(error)
      Object.defineProperty(globalThis, "navigator", {
        value: { clipboard: { readText } },
        configurable: true,
      })
      Object.defineProperty(globalThis, "document", {
        value: {},
        configurable: true,
      })

      const onPasteError = vi.fn()
      const { read } = createClipboard({ onPasteError })
      const result = await read()

      expect(result).toBe("")
      expect(onPasteError).toHaveBeenCalledWith(error)
    })

    it("calls onCopy callback on successful copy", async () => {
      const writeText = vi.fn().mockResolvedValue(undefined)
      Object.defineProperty(globalThis, "navigator", {
        value: { clipboard: { writeText } },
        configurable: true,
      })
      Object.defineProperty(globalThis, "document", {
        value: {},
        configurable: true,
      })

      const onCopy = vi.fn()
      const { copy } = createClipboard({ onCopy })
      await copy("success")

      expect(onCopy).toHaveBeenCalledWith("success")
    })

    it("calls onPaste callback on successful read", async () => {
      const readText = vi.fn().mockResolvedValue("pasted")
      Object.defineProperty(globalThis, "navigator", {
        value: { clipboard: { readText } },
        configurable: true,
      })
      Object.defineProperty(globalThis, "document", {
        value: {},
        configurable: true,
      })

      const onPaste = vi.fn()
      const { read } = createClipboard({ onPaste })
      await read()

      expect(onPaste).toHaveBeenCalledWith("pasted")
    })
  })

  describe("reset()", () => {
    it("manually clears copied state", async () => {
      const writeText = vi.fn().mockResolvedValue(undefined)
      Object.defineProperty(globalThis, "navigator", {
        value: { clipboard: { writeText } },
        configurable: true,
      })
      Object.defineProperty(globalThis, "document", {
        value: {},
        configurable: true,
      })

      const { copy, copied, reset } = createClipboard({ copiedDuration: 5000 })

      expect(copied()).toBe(false)
      const result = await copy("test")
      expect(result).toBe(true)
      expect(writeText).toHaveBeenCalledWith("test")
      // The copy resolves but the signal update from startCopiedTimer may be deferred
      // Flush microtasks to ensure signal propagation
      await Promise.resolve()
      expect(copied()).toBe(true)

      reset()
      await Promise.resolve()
      expect(copied()).toBe(false)

      // Timer should be cleared — advancing should not change state
      await vi.advanceTimersByTimeAsync(5000)
      expect(copied()).toBe(false)
    })
  })

  describe("SSR safety", () => {
    it("copy returns false when navigator is undefined", async () => {
      const originalNavigator = globalThis.navigator
      const originalDocument = globalThis.document
      // @ts-expect-error -- removing for SSR simulation
      delete globalThis.navigator
      // @ts-expect-error -- removing for SSR simulation
      delete globalThis.document

      const onCopyError = vi.fn()
      const { copy } = createClipboard({ onCopyError })
      const result = await copy("ssr-text")

      expect(result).toBe(false)
      expect(onCopyError).toHaveBeenCalled()
      expect(onCopyError.mock.calls[0]![0].message).toContain("not available")

      // Restore
      Object.defineProperty(globalThis, "navigator", {
        value: originalNavigator,
        configurable: true,
      })
      Object.defineProperty(globalThis, "document", {
        value: originalDocument,
        configurable: true,
      })
    })

    it("read returns empty string when navigator is undefined", async () => {
      const originalNavigator = globalThis.navigator
      const originalDocument = globalThis.document
      // @ts-expect-error -- removing for SSR simulation
      delete globalThis.navigator
      // @ts-expect-error -- removing for SSR simulation
      delete globalThis.document

      const onPasteError = vi.fn()
      const { read } = createClipboard({ onPasteError })
      const result = await read()

      expect(result).toBe("")
      expect(onPasteError).toHaveBeenCalled()
      expect(onPasteError.mock.calls[0]![0].message).toContain("not available")

      // Restore
      Object.defineProperty(globalThis, "navigator", {
        value: originalNavigator,
        configurable: true,
      })
      Object.defineProperty(globalThis, "document", {
        value: originalDocument,
        configurable: true,
      })
    })
  })

  describe("cleanup on disposal", () => {
    it("clears pending timers when owner disposes", async () => {
      const writeText = vi.fn().mockResolvedValue(undefined)
      Object.defineProperty(globalThis, "navigator", {
        value: { clipboard: { writeText } },
        configurable: true,
      })
      Object.defineProperty(globalThis, "document", {
        value: {},
        configurable: true,
      })

      let clipboard: ReturnType<typeof createClipboard> | undefined

      await new Promise<void>((resolve) => {
        createRoot(async (dispose) => {
          clipboard = createClipboard({ copiedDuration: 5000 })
          await clipboard.copy("test")
          expect(clipboard.copied()).toBe(true)
          dispose()
          resolve()
        })
      })

      // After disposal, advancing timers should not throw or cause issues
      vi.advanceTimersByTime(5000)
      // The signal still holds its last value — cleanup prevented the timer from firing
      expect(clipboard!.copied()).toBe(true)
    })
  })
})
