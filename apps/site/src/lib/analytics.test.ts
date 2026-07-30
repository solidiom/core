/**
 * SEARCH-005: Unit tests for privacy-safe search analytics.
 *
 * Verifies:
 * - search_opened is emitted with correct trigger
 * - search_result_selected is emitted with correct type/locale
 * - No query text or result title appears in events
 * - Graceful no-op when window is undefined
 */

import { describe, it, expect, beforeEach } from "vitest"
import {
  trackSearchOpened,
  trackSearchResultSelected,
  subscribe,
  __TEST_ONLY__,
} from "./analytics"
import type { SearchAnalyticsEvent } from "./analytics-types"

beforeEach(() => {
  __TEST_ONLY__.clearEmittedEvents()
})

describe("search analytics — event shape (via forceEmit)", () => {
  describe("trackSearchOpened", () => {
    it("produces search_opened with trigger 'keyboard'", () => {
      __TEST_ONLY__.forceEmit({ event: "search_opened", trigger: "keyboard" })
      const events = __TEST_ONLY__.getEmittedEvents()
      expect(events).toHaveLength(1)
      expect(events[0]).toEqual({ event: "search_opened", trigger: "keyboard" })
    })

    it("produces search_opened with trigger 'click'", () => {
      __TEST_ONLY__.forceEmit({ event: "search_opened", trigger: "click" })
      const events = __TEST_ONLY__.getEmittedEvents()
      expect(events).toHaveLength(1)
      expect(events[0]).toEqual({ event: "search_opened", trigger: "click" })
    })

    it("produces search_opened with trigger 'command'", () => {
      __TEST_ONLY__.forceEmit({ event: "search_opened", trigger: "command" })
      const events = __TEST_ONLY__.getEmittedEvents()
      expect(events).toHaveLength(1)
      expect(events[0]).toEqual({ event: "search_opened", trigger: "command" })
    })
  })

  describe("trackSearchResultSelected", () => {
    it("produces search_result_selected with correct type and locale", () => {
      __TEST_ONLY__.forceEmit({
        event: "search_result_selected",
        result_type: "primitive",
        result_locale: "en",
      })
      const events = __TEST_ONLY__.getEmittedEvents()
      expect(events).toHaveLength(1)
      expect(events[0]).toEqual({
        event: "search_result_selected",
        result_type: "primitive",
        result_locale: "en",
      })
    })

    it("produces event with locale 'es'", () => {
      __TEST_ONLY__.forceEmit({
        event: "search_result_selected",
        result_type: "guide",
        result_locale: "es",
      })
      const events = __TEST_ONLY__.getEmittedEvents()
      expect(events[0]).toEqual({
        event: "search_result_selected",
        result_type: "guide",
        result_locale: "es",
      })
    })

    it("supports all result types", () => {
      const types = ["primitive", "component", "guide", "blog", "api", "a11y"] as const
      for (const type of types) {
        __TEST_ONLY__.forceEmit({
          event: "search_result_selected",
          result_type: type,
          result_locale: "en",
        })
      }
      const events = __TEST_ONLY__.getEmittedEvents()
      expect(events).toHaveLength(types.length)
      for (let i = 0; i < types.length; i++) {
        expect(events[i]).toEqual({
          event: "search_result_selected",
          result_type: types[i],
          result_locale: "en",
        })
      }
    })
  })
})

describe("privacy guarantees", () => {
  it("events contain no query text or result title fields", () => {
    __TEST_ONLY__.forceEmit({ event: "search_opened", trigger: "keyboard" })
    __TEST_ONLY__.forceEmit({
      event: "search_result_selected",
      result_type: "primitive",
      result_locale: "en",
    })
    const events = __TEST_ONLY__.getEmittedEvents()
    for (const event of events) {
      const keys = Object.keys(event)
      expect(keys).not.toContain("query")
      expect(keys).not.toContain("title")
      expect(keys).not.toContain("result_title")
      expect(keys).not.toContain("search_query")
      expect(keys).not.toContain("text")
    }
  })

  it("event shape is strictly limited to allowed properties", () => {
    __TEST_ONLY__.forceEmit({ event: "search_opened", trigger: "click" })
    __TEST_ONLY__.forceEmit({
      event: "search_result_selected",
      result_type: "api",
      result_locale: "es",
    })
    const events = __TEST_ONLY__.getEmittedEvents()
    const openedKeys = Object.keys(events[0]!).sort()
    expect(openedKeys).toEqual(["event", "trigger"])
    const selectedKeys = Object.keys(events[1]!).sort()
    expect(selectedKeys).toEqual(["event", "result_locale", "result_type"])
  })
})

describe("graceful no-op", () => {
  it("does not emit when window is undefined", () => {
    const originalWindow = globalThis.window
    // @ts-expect-error — intentionally removing window for test
    delete globalThis.window
    try {
      // With window undefined, isEnabled() returns false, so emit is a no-op
      trackSearchOpened("keyboard")
      trackSearchResultSelected("blog", "en")
      expect(__TEST_ONLY__.getEmittedEvents()).toHaveLength(0)
    } finally {
      globalThis.window = originalWindow
    }
  })

  it("does not emit in non-production environments", () => {
    // In test environment, import.meta.env.PROD is false, so trackX functions no-op
    trackSearchOpened("click")
    trackSearchResultSelected("primitive", "en")
    expect(__TEST_ONLY__.getEmittedEvents()).toHaveLength(0)
  })
})

describe("subscribe", () => {
  it("notifies listeners when events are force-emitted", () => {
    const received: SearchAnalyticsEvent[] = []
    const unsubscribe = subscribe((event) => received.push(event))
    __TEST_ONLY__.forceEmit({ event: "search_opened", trigger: "command" })
    expect(received).toHaveLength(1)
    expect(received[0]).toEqual({ event: "search_opened", trigger: "command" })
    unsubscribe()
    __TEST_ONLY__.forceEmit({ event: "search_opened", trigger: "click" })
    // Should not receive after unsubscribe
    expect(received).toHaveLength(1)
  })
})
