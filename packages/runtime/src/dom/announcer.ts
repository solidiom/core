/**
 * Live region announcer — manages aria-live regions for screen reader announcements.
 *
 * Per §8.4: announcements are coordinated through reactive signals that drive
 * visually-hidden live regions. Two channels are maintained (polite and assertive)
 * with configurable queue management, deduplication, and auto-clear timers.
 * SSR-safe: signals update but no DOM is created server-side.
 */

import { createSignal, onCleanup, getOwner, type Accessor } from "solid-js"

/** Politeness level for live region announcements. */
export type AnnouncerPoliteness = "polite" | "assertive"

/** Options for configuring the announcer. */
export interface AnnouncerOptions {
  /** Default politeness level. Default: 'polite'. */
  defaultPoliteness?: AnnouncerPoliteness
  /** Duration (ms) before clearing the announcement. Default: 7000. Allows screen readers time to read. */
  clearDelay?: number
  /** Maximum queued messages before oldest are dropped. Default: 5. */
  maxQueue?: number
  /** Whether to deduplicate identical consecutive messages. Default: true. */
  deduplicate?: boolean
}

/** The announcer instance returned by createAnnouncer. */
export interface Announcer {
  /** Announce a message to screen readers. */
  announce: (message: string, politeness?: AnnouncerPoliteness) => void
  /** Clear all pending announcements. */
  clear: () => void
  /** Current polite announcement text (reactive). */
  politeMessage: Accessor<string>
  /** Current assertive announcement text (reactive). */
  assertiveMessage: Accessor<string>
  /** Get props to spread on the polite live region element. */
  politeRegionProps: () => Record<string, string>
  /** Get props to spread on the assertive live region element. */
  assertiveRegionProps: () => Record<string, string>
  /** Destroy the announcer, cleaning up timers and DOM. */
  destroy: () => void
}

const VISUALLY_HIDDEN_STYLE =
  "position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0"

/** Zero-width space used to force re-announcement of duplicate messages. */
const ZWS = "\u200B"

interface ChannelState {
  lastMessage: string
  queue: number[]
}

/**
 * Creates a live region announcer for screen reader accessibility.
 *
 * Manages two announcement channels (polite and assertive) with configurable
 * queue limits, deduplication, and auto-clear timers. Returns reactive accessors
 * for the current message on each channel and props objects for the live regions.
 */
export function createAnnouncer(options: AnnouncerOptions = {}): Announcer {
  const {
    defaultPoliteness = "polite",
    clearDelay = 7000,
    maxQueue = 5,
    deduplicate = true,
  } = options

  const [politeMessage, setPoliteMessage] = createSignal("", { ownedWrite: true })
  const [assertiveMessage, setAssertiveMessage] = createSignal("", { ownedWrite: true })

  const timers = new Set<ReturnType<typeof setTimeout>>()

  const channels: Record<AnnouncerPoliteness, ChannelState> = {
    polite: { lastMessage: "", queue: [] },
    assertive: { lastMessage: "", queue: [] },
  }

  function clearTimersForChannel(channel: ChannelState): void {
    for (const id of channel.queue) {
      clearTimeout(id)
      timers.delete(id)
    }
    channel.queue = []
  }

  function setMessage(politeness: AnnouncerPoliteness, message: string): void {
    if (politeness === "polite") {
      setPoliteMessage(message)
    } else {
      setAssertiveMessage(message)
    }
  }

  function announce(message: string, politeness?: AnnouncerPoliteness): void {
    const level = politeness ?? defaultPoliteness
    const channel = channels[level]

    // Deduplication: if same message as last, append ZWS to force re-read
    let text = message
    if (deduplicate && message === channel.lastMessage) {
      text = message + ZWS
    }
    channel.lastMessage = message

    // Queue management: drop oldest if over limit
    if (channel.queue.length >= maxQueue) {
      const oldest = channel.queue.shift()
      if (oldest !== undefined) {
        clearTimeout(oldest)
        timers.delete(oldest)
      }
    }

    setMessage(level, text)

    // Schedule clear after delay
    const timerId = setTimeout(() => {
      timers.delete(timerId)
      const idx = channel.queue.indexOf(timerId)
      if (idx !== -1) channel.queue.splice(idx, 1)
      setMessage(level, "")
    }, clearDelay)

    timers.add(timerId)
    channel.queue.push(timerId)
  }

  function clear(): void {
    clearTimersForChannel(channels.polite)
    clearTimersForChannel(channels.assertive)
    channels.polite.lastMessage = ""
    channels.assertive.lastMessage = ""
    setPoliteMessage("")
    setAssertiveMessage("")
  }

  function politeRegionProps(): Record<string, string> {
    return {
      role: "status",
      "aria-live": "polite",
      "aria-atomic": "true",
      style: VISUALLY_HIDDEN_STYLE,
    }
  }

  function assertiveRegionProps(): Record<string, string> {
    return {
      role: "alert",
      "aria-live": "assertive",
      "aria-atomic": "true",
      style: VISUALLY_HIDDEN_STYLE,
    }
  }

  function destroy(): void {
    for (const id of timers) {
      clearTimeout(id)
    }
    timers.clear()
    channels.polite.queue = []
    channels.assertive.queue = []
    channels.polite.lastMessage = ""
    channels.assertive.lastMessage = ""
    setPoliteMessage("")
    setAssertiveMessage("")
  }

  if (getOwner()) {
    onCleanup(destroy)
  }

  return {
    announce,
    clear,
    politeMessage,
    assertiveMessage,
    politeRegionProps,
    assertiveRegionProps,
    destroy,
  }
}
