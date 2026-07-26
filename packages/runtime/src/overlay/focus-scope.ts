/**
 * Focus scope — traps focus within a layer and restores focus on close.
 *
 * Per §9.3: focus capture keeps Tab/Shift+Tab within the overlay content.
 * On deactivation, focus is restored to the element that triggered the overlay.
 */

/** Options for creating a focus scope. */
export interface FocusScopeOptions {
  /** The container element to trap focus within. */
  element: () => Element | undefined
  /** Whether focus trapping is active. */
  enabled?: boolean
  /** Element to restore focus to on deactivation. */
  restoreTarget?: () => Element | null | undefined
}

/** Returns all focusable elements within a container. */
function getFocusableElements(container: Element): HTMLElement[] {
  const selector = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
    "[contenteditable]",
  ].join(",")

  return Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
    (el) => !el.hasAttribute("disabled") && el.tabIndex >= 0,
  )
}

/**
 * Activates a focus scope that traps Tab/Shift+Tab within the container.
 *
 * On activation:
 * - Records the currently focused element for restoration.
 * - Moves focus to the first focusable element inside the container.
 *
 * On deactivation (returned cleanup):
 * - Removes the Tab trap listener.
 * - Restores focus to the recorded element (or restoreTarget if provided).
 */
export function activateFocusScope(options: FocusScopeOptions): () => void {
  const { element, enabled = true, restoreTarget } = options

  if (!enabled) return () => {}

  const doc = element()?.ownerDocument
  if (!doc) return () => {}

  // Record focus for restoration
  const previouslyFocused = doc.activeElement as HTMLElement | null

  // Move focus into the scope
  const container = element()
  if (container) {
    const focusable = getFocusableElements(container)
    if (focusable.length > 0) {
      focusable[0]!.focus()
    } else if (container instanceof HTMLElement) {
      // If no focusable children, focus the container itself
      container.setAttribute("tabindex", "-1")
      container.focus()
    }
  }

  const handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== "Tab") return
    const el = element()
    if (!el) return

    const focusable = getFocusableElements(el)
    if (focusable.length === 0) {
      event.preventDefault()
      return
    }

    const first = focusable[0]!
    const last = focusable[focusable.length - 1]!
    const active = doc.activeElement

    if (event.shiftKey) {
      // Shift+Tab at first element → wrap to last
      if (active === first || !el.contains(active)) {
        event.preventDefault()
        last.focus()
      }
    } else {
      // Tab at last element → wrap to first
      if (active === last || !el.contains(active)) {
        event.preventDefault()
        first.focus()
      }
    }
  }

  doc.addEventListener("keydown", handleKeyDown, true)

  return () => {
    doc.removeEventListener("keydown", handleKeyDown, true)

    // Restore focus
    const target = restoreTarget?.() ?? previouslyFocused
    if (target && target instanceof HTMLElement && target.isConnected) {
      target.focus()
    }
  }
}
