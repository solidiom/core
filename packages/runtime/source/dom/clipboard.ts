/**
 * Clipboard read/write utilities — reactive wrapper around the Clipboard API
 * with legacy fallback and SSR safety.
 *
 * Provides `copy` and `read` operations with reactive signals for tracking
 * state, plus configurable callbacks and automatic timer cleanup.
 */

import { createSignal, onCleanup, getOwner, type Accessor } from "solid-js"

/**
 * Options for configuring clipboard behavior.
 */
export interface ClipboardOptions {
  /** Duration (ms) to keep `copied` state true after a successful copy. Default 2000. */
  copiedDuration?: number
  /** Called on successful copy. */
  onCopy?: (text: string) => void
  /** Called on copy failure. */
  onCopyError?: (error: Error) => void
  /** Called on successful read/paste. */
  onPaste?: (text: string) => void
  /** Called on read/paste failure. */
  onPasteError?: (error: Error) => void
}

/**
 * Return type of `createClipboard`.
 */
export interface Clipboard {
  /** Copy text to clipboard. Returns a promise resolving to success boolean. */
  copy: (text: string) => Promise<boolean>
  /** Read text from clipboard. Returns a promise resolving to the text or empty string on failure. */
  read: () => Promise<string>
  /** Reactive signal: true when text was recently copied (resets after copiedDuration). */
  copied: Accessor<boolean>
  /** Reactive signal: the last copied text, or undefined. */
  lastCopied: Accessor<string | undefined>
  /** Reactive signal: the last read/pasted text, or undefined. */
  lastRead: Accessor<string | undefined>
  /** Reset the copied state manually. */
  reset: () => void
}

/**
 * Attempts to copy text using the legacy `document.execCommand('copy')` fallback.
 * Creates a temporary textarea, selects its content, and executes the copy command.
 */
function legacyCopy(text: string): boolean {
  const textarea = document.createElement("textarea")
  textarea.value = text
  textarea.style.position = "fixed"
  textarea.style.left = "-9999px"
  textarea.style.top = "-9999px"
  textarea.style.opacity = "0"
  document.body.appendChild(textarea)
  textarea.select()
  try {
    return document.execCommand("copy")
  } finally {
    document.body.removeChild(textarea)
  }
}

/**
 * Creates reactive clipboard read/write utilities.
 *
 * Wraps the Clipboard API with reactive signals, fallback support,
 * and automatic timer cleanup tied to the owning reactive scope.
 *
 * @param options - Configuration for duration, callbacks, and error handling.
 * @returns A `Clipboard` object with reactive copy/read state.
 */
export function createClipboard(options: ClipboardOptions = {}): Clipboard {
  const { copiedDuration = 2000, onCopy, onCopyError, onPaste, onPasteError } = options

  const [copied, setCopied] = createSignal(false)
  const [lastCopied, setLastCopied] = createSignal<string | undefined>(undefined)
  const [lastRead, setLastRead] = createSignal<string | undefined>(undefined)

  let resetTimer: ReturnType<typeof setTimeout> | undefined

  function clearTimer(): void {
    if (resetTimer !== undefined) {
      clearTimeout(resetTimer)
      resetTimer = undefined
    }
  }

  // Register cleanup if within a reactive owner
  if (getOwner()) {
    onCleanup(clearTimer)
  }

  function reset(): void {
    clearTimer()
    setCopied(false)
  }

  function startCopiedTimer(): void {
    clearTimer()
    setCopied(true)
    resetTimer = setTimeout(() => {
      setCopied(false)
      resetTimer = undefined
    }, copiedDuration)
  }

  async function copy(text: string): Promise<boolean> {
    // SSR safety: no clipboard or document available
    if (typeof navigator === "undefined" || typeof document === "undefined") {
      const error = new Error("Clipboard API is not available in this environment")
      onCopyError?.(error)
      return false
    }

    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        await navigator.clipboard.writeText(text)
      } else {
        const success = legacyCopy(text)
        if (!success) {
          throw new Error("execCommand copy failed")
        }
      }
      setLastCopied(text)
      startCopiedTimer()
      onCopy?.(text)
      return true
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      onCopyError?.(error)
      return false
    }
  }

  async function read(): Promise<string> {
    // SSR safety: no clipboard available
    if (typeof navigator === "undefined" || typeof document === "undefined") {
      const error = new Error("Clipboard API is not available in this environment")
      onPasteError?.(error)
      return ""
    }

    try {
      if (navigator.clipboard && typeof navigator.clipboard.readText === "function") {
        const text = await navigator.clipboard.readText()
        setLastRead(text)
        onPaste?.(text)
        return text
      }
      // No execCommand fallback for read — return empty string
      return ""
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      onPasteError?.(error)
      return ""
    }
  }

  return {
    copy,
    read,
    copied,
    lastCopied,
    lastRead,
    reset,
  }
}
