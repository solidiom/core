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
export declare function activateFocusScope(options: FocusScopeOptions): () => void
//# sourceMappingURL=focus-scope.d.ts.map
