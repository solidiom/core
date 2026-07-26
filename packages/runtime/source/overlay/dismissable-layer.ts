/**
 * Dismissable layer — routes escape-key, pointer-outside, and focus-outside
 * events to the topmost layer in the stack.
 *
 * Per §8.7: listeners are document-scoped. Only the topmost layer receives
 * dismiss requests. Nested layers shield parent layers from dismissal.
 */

import { getLayerStack, type DismissReason } from "./layer-stack"

/** Options for setting up dismissable layer listeners on a document. */
export interface DismissableLayerOptions {
  /** The document to attach listeners to. */
  document: Document
  /** The layer ID this dismissable layer belongs to. */
  layerId: string
  /** The content element (for pointer-outside/focus-outside contains checks). */
  element: () => Element | undefined
  /** Additional elements that should not trigger pointer-outside (e.g. trigger). */
  excludeElements?: () => Element[]
  /** Whether escape-key dismissal is enabled. Default: true. */
  escapeKey?: boolean
  /** Whether pointer-outside dismissal is enabled. Default: true. */
  pointerOutside?: boolean
  /** Whether focus-outside dismissal is enabled. Default: true. */
  focusOutside?: boolean
  /** Called when dismissal is requested. */
  onDismiss: (reason: DismissReason) => void
}

/**
 * Attaches dismissable layer listeners to the document.
 * Returns a cleanup function that removes all listeners.
 *
 * Only dispatches to the layer if it is the topmost in the stack.
 */
export function setupDismissableLayer(options: DismissableLayerOptions): () => void {
  const {
    document: doc,
    layerId,
    element,
    excludeElements,
    escapeKey = true,
    pointerOutside = true,
    focusOutside = true,
    onDismiss,
  } = options

  const stack = getLayerStack(doc)

  const isTargetInside = (target: EventTarget | null): boolean => {
    if (!target) return false
    const el = element()
    if (el?.contains(target as Node)) return true
    const excludes = excludeElements?.() ?? []
    return excludes.some((ex) => ex.contains(target as Node))
  }

  const handleKeyDown = (event: KeyboardEvent): void => {
    if (!escapeKey) return
    if (event.key !== "Escape") return
    if (!stack.isTop(layerId)) return
    event.preventDefault()
    onDismiss("escape-key")
  }

  const handlePointerDown = (event: PointerEvent): void => {
    if (!pointerOutside) return
    if (!stack.isTop(layerId)) return
    if (isTargetInside(event.target)) return
    onDismiss("pointer-outside")
  }

  const handleFocusIn = (event: FocusEvent): void => {
    if (!focusOutside) return
    if (!stack.isTop(layerId)) return
    if (isTargetInside(event.target)) return
    onDismiss("focus-outside")
  }

  doc.addEventListener("keydown", handleKeyDown)
  doc.addEventListener("pointerdown", handlePointerDown)
  doc.addEventListener("focusin", handleFocusIn)

  return () => {
    doc.removeEventListener("keydown", handleKeyDown)
    doc.removeEventListener("pointerdown", handlePointerDown)
    doc.removeEventListener("focusin", handleFocusIn)
  }
}
