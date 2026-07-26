/**
 * Validation — constraint validity coordination for form controls.
 *
 * Per §9.5: primitives own constraint validity. This module provides
 * a message registry that coordinates custom validity messages with
 * the native constraint validation API.
 */

/** A validation message with severity. */
export interface ValidationMessage {
  /** The validation message text. */
  message: string
  /** Severity level. "error" blocks submission; "warning" is advisory. */
  severity: "error" | "warning"
}

/** Options for creating a validation state. */
export interface ValidationOptions {
  /** The native input element to synchronize validity with. */
  element?: () => HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | undefined
}

/** Validation state for a form control. */
export interface ValidationState {
  /** Current validation messages. */
  messages: () => ValidationMessage[]
  /** Whether the field has any error-level messages. */
  invalid: () => boolean
  /** Set custom validation messages (replaces previous). */
  setMessages: (messages: ValidationMessage[]) => void
  /** Clear all validation messages. */
  clear: () => void
  /** Sync the first error message to the native element's custom validity. */
  syncToNative: () => void
}

/**
 * Creates a validation state that can coordinate with native constraint validation.
 */
export function createValidation(options: ValidationOptions = {}): ValidationState {
  let currentMessages: ValidationMessage[] = []

  const messages = () => currentMessages
  const invalid = () => currentMessages.some((m) => m.severity === "error")

  const setMessages = (msgs: ValidationMessage[]): void => {
    currentMessages = msgs
    syncToNative()
  }

  const clear = (): void => {
    currentMessages = []
    syncToNative()
  }

  const syncToNative = (): void => {
    const el = options.element?.()
    if (!el) return

    const firstError = currentMessages.find((m) => m.severity === "error")
    el.setCustomValidity(firstError?.message ?? "")
  }

  return { messages, invalid, setMessages, clear, syncToNative }
}
