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
export function createPointerIntent(options: PointerIntentOptions): PointerIntent {
  const delay = options.delay ?? 150
  let intentTimer: ReturnType<typeof setTimeout> | undefined
  let leaveTimer: ReturnType<typeof setTimeout> | undefined
  let isOnTrigger = false
  let isOnContent = false
  let isConfirmed = false

  function clearTimers() {
    if (intentTimer !== undefined) {
      clearTimeout(intentTimer)
      intentTimer = undefined
    }
    if (leaveTimer !== undefined) {
      clearTimeout(leaveTimer)
      leaveTimer = undefined
    }
  }

  function handleTriggerEnter() {
    isOnTrigger = true
    // Cancel any pending leave timer (re-entry)
    if (leaveTimer !== undefined) {
      clearTimeout(leaveTimer)
      leaveTimer = undefined
    }
    // If already confirmed (content open), no need to re-confirm
    if (isConfirmed) return
    // Start intent timer
    clearTimers()
    intentTimer = setTimeout(() => {
      intentTimer = undefined
      if (isOnTrigger || isOnContent) {
        isConfirmed = true
        options.onIntentConfirm()
      }
    }, delay)
  }

  function handleTriggerLeave() {
    isOnTrigger = false
    // If already confirmed, start leave timer (give time to reach content)
    if (isConfirmed) {
      leaveTimer = setTimeout(() => {
        leaveTimer = undefined
        if (!isOnTrigger && !isOnContent) {
          isConfirmed = false
          options.onIntentCancel()
        }
      }, delay)
    } else {
      // Not yet confirmed — cancel the intent timer
      if (intentTimer !== undefined) {
        clearTimeout(intentTimer)
        intentTimer = undefined
      }
      // Brief grace period to reach content
      leaveTimer = setTimeout(() => {
        leaveTimer = undefined
        if (!isOnTrigger && !isOnContent) {
          options.onIntentCancel()
        }
      }, delay)
    }
  }

  function handleContentEnter() {
    isOnContent = true
    // Cancel any pending leave timer
    if (leaveTimer !== undefined) {
      clearTimeout(leaveTimer)
      leaveTimer = undefined
    }
    // If intent timer is running, confirm immediately
    if (!isConfirmed) {
      clearTimers()
      isConfirmed = true
      options.onIntentConfirm()
    }
  }

  function handleContentLeave() {
    isOnContent = false
    // Start leave timer
    leaveTimer = setTimeout(() => {
      leaveTimer = undefined
      if (!isOnTrigger && !isOnContent) {
        isConfirmed = false
        options.onIntentCancel()
      }
    }, delay)
  }

  function cancel() {
    clearTimers()
    isOnTrigger = false
    isOnContent = false
    isConfirmed = false
  }

  return {
    handleTriggerEnter,
    handleTriggerLeave,
    handleContentEnter,
    handleContentLeave,
    cancel,
  }
}
