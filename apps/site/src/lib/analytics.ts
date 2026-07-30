/**
 * SEARCH-005: Privacy-safe search analytics — event bus implementation.
 *
 * Emits typed events to an internal bus that PostHog (ANALYTICS-001) will
 * later consume. No actual PostHog dependency is introduced here.
 *
 * Behavior:
 * - No-ops when `window` is undefined (SSR, build time).
 * - No-ops in non-production environments.
 * - No free-form text (query, titles) is ever accepted or emitted.
 */

import type {
  SearchAnalyticsEvent,
  SearchOpenedTrigger,
  SearchResultLocale,
  SearchResultType,
} from "./analytics-types"

type AnalyticsListener = (event: SearchAnalyticsEvent) => void

const listeners: AnalyticsListener[] = []
const emittedEvents: SearchAnalyticsEvent[] = []

function isEnabled(): boolean {
  if (typeof window === "undefined") return false
  // In production Astro sets import.meta.env.PROD to true.
  // Gracefully handle environments where import.meta.env is unavailable.
  try {
    return import.meta.env.PROD === true
  } catch {
    return false
  }
}

function emit(event: SearchAnalyticsEvent): void {
  if (!isEnabled()) return
  emittedEvents.push(event)
  for (const listener of listeners) {
    listener(event)
  }
}

/** Unconditionally emit — bypasses environment check. Used only in tests. */
function emitForce(event: SearchAnalyticsEvent): void {
  emittedEvents.push(event)
  for (const listener of listeners) {
    listener(event)
  }
}

/**
 * Subscribe to analytics events. Returns an unsubscribe function.
 * PostHog adapter (ANALYTICS-001) will use this to forward events.
 */
export function subscribe(listener: AnalyticsListener): () => void {
  listeners.push(listener)
  return () => {
    const index = listeners.indexOf(listener)
    if (index !== -1) listeners.splice(index, 1)
  }
}

/** Track that the search dialog was opened. */
export function trackSearchOpened(trigger: SearchOpenedTrigger): void {
  emit({ event: "search_opened", trigger })
}

/** Track that a search result was selected. */
export function trackSearchResultSelected(
  resultType: SearchResultType,
  resultLocale: SearchResultLocale,
): void {
  emit({ event: "search_result_selected", result_type: resultType, result_locale: resultLocale })
}

/**
 * TEST-ONLY utilities — not for production use.
 * Provides access to emitted events for unit testing.
 */
export const __TEST_ONLY__ = {
  getEmittedEvents(): readonly SearchAnalyticsEvent[] {
    return emittedEvents
  },
  clearEmittedEvents(): void {
    emittedEvents.length = 0
  },
  /** Emit bypassing the environment guard — for testing event shape only. */
  forceEmit(event: SearchAnalyticsEvent): void {
    emitForce(event)
  },
  /** Expose isEnabled for testing the guard itself. */
  isEnabled,
} as const
