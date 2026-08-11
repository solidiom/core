/**
 * Pointer intent — delayed hover-intent detection for menu triggers.
 *
 * Implements a grace-period delay so diagonal mouse paths from trigger
 * to content panel don't accidentally dismiss the menu.
 *
 * Used by: NavigationMenu, HoverCard, Tooltip (future).
 */
/** Options for creating a pointer intent tracker. */
export interface PointerIntentOptions {
  /** Delay before intent is confirmed (ms). Default 150. */
  delay?: number
  /** Called when intent is confirmed (pointer settled on target). */
  onIntentConfirm: () => void
  /** Called when intent is cancelled (pointer left without reaching target). */
  onIntentCancel: () => void
}
/** The pointer intent instance returned by createPointerIntent. */
export interface PointerIntent {
  /** Call when pointer enters the trigger element. */
  handleTriggerEnter: () => void
  /** Call when pointer leaves the trigger element. */
  handleTriggerLeave: () => void
  /** Call when pointer enters the content element. */
  handleContentEnter: () => void
  /** Call when pointer leaves the content element. */
  handleContentLeave: () => void
  /** Force-cancel any pending intent. */
  cancel: () => void
}
/**
 * Creates a pointer intent tracker with configurable delay.
 *
 * Flow:
 * 1. Pointer enters trigger → starts delay timer.
 * 2. If pointer enters content before timer fires → confirms immediately.
 * 3. If timer fires while still on trigger → confirms (pointer settled).
 * 4. If pointer leaves trigger AND content without entering content → cancels after delay.
 */
export declare function createPointerIntent(options: PointerIntentOptions): PointerIntent
//# sourceMappingURL=pointer-intent.d.ts.map
