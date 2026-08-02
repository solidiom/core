import { describe, expect, it } from "vitest"
import { __TEST_ONLY__ } from "./analytics"
import type {
  BuilderAnalyticsEvent,
  BuilderExportedEvent,
  BuilderOpenedEvent,
  BuilderSharedEvent,
} from "./analytics-types"

const PROHIBITED_KEYS = new Set([
  "theme",
  "themeJson",
  "themeData",
  "themeName",
  "themeSlug",
  "tokens",
  "colors",
  "values",
  "query",
  "searchQuery",
  "email",
  "name",
  "userId",
  "username",
  "title",
  "url",
  "shareUrl",
  "hash",
  "encoded",
  "freeText",
  "comment",
  "notes",
  "ip",
])

function eventHasNoProhibitedKeys(event: Record<string, unknown>): void {
  const keys = Object.keys(event)
  for (const key of keys) {
    expect(PROHIBITED_KEYS.has(key), `Analytics event contains prohibited key: "${key}"`).toBe(
      false,
    )
  }
}

describe("Builder analytics privacy", () => {
  it("builder_opened contains only event type", () => {
    __TEST_ONLY__.clearEmittedEvents()
    const event: BuilderOpenedEvent = { event: "builder_opened" }
    __TEST_ONLY__.forceEmit(event)

    const events = __TEST_ONLY__.getEmittedEvents()
    expect(events).toHaveLength(1)
    expect(Object.keys(events[0])).toEqual(["event"])
  })

  it("builder_exported contains only event type and format", () => {
    __TEST_ONLY__.clearEmittedEvents()
    const event: BuilderExportedEvent = { event: "builder_exported", format: "css" }
    __TEST_ONLY__.forceEmit(event)

    const events = __TEST_ONLY__.getEmittedEvents()
    expect(events).toHaveLength(1)
    expect(events[0]).toHaveProperty("event", "builder_exported")
    expect(events[0]).toHaveProperty("format", "css")
    expect(Object.keys(events[0])).toEqual(["event", "format"])
    eventHasNoProhibitedKeys(events[0])
  })

  it("builder_shared contains only event type", () => {
    __TEST_ONLY__.clearEmittedEvents()
    const event: BuilderSharedEvent = { event: "builder_shared" }
    __TEST_ONLY__.forceEmit(event)

    const events = __TEST_ONLY__.getEmittedEvents()
    expect(events).toHaveLength(1)
    expect(Object.keys(events[0])).toEqual(["event"])
  })

  it("no builder event leaks theme content", () => {
    __TEST_ONLY__.clearEmittedEvents()

    const events: BuilderAnalyticsEvent[] = [
      { event: "builder_opened" },
      { event: "builder_exported", format: "json" },
      { event: "builder_shared" },
    ]

    for (const ev of events) {
      __TEST_ONLY__.forceEmit(ev)
    }

    for (const ev of __TEST_ONLY__.getEmittedEvents()) {
      eventHasNoProhibitedKeys(ev)
    }
  })

  it("format values are from the allowed enum", () => {
    const allowedFormats = ["json", "css", "tailwind", "unocss"] as const
    for (const format of allowedFormats) {
      __TEST_ONLY__.clearEmittedEvents()
      const event: BuilderExportedEvent = { event: "builder_exported", format }
      __TEST_ONLY__.forceEmit(event)
      const events = __TEST_ONLY__.getEmittedEvents()
      expect(events[0]).toHaveProperty("format", format)
    }
  })
})
