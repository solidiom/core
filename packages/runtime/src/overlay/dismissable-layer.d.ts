/**
 * Dismissable layer — routes escape-key, pointer-outside, and focus-outside
 * events to the topmost layer in the stack.
 *
 * Per §8.7: listeners are document-scoped. Only the topmost layer receives
 * dismiss requests. Nested layers shield parent layers from dismissal.
 */
import { type DismissReason } from "./layer-stack"
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
export declare function setupDismissableLayer(options: DismissableLayerOptions): () => void
//# sourceMappingURL=dismissable-layer.d.ts.map
