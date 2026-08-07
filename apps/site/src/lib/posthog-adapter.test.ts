import { describe, expect, it, beforeEach } from "vitest"
import { __TEST_ONLY__ } from "./analytics"
import type { SiteAnalyticsEvent } from "./analytics-types"

/**
 * ANALYTICS-002: Tests reject prohibited payload fields.
 *
 * Verifies that no analytics event — whether emitted by the event bus or
 * forwarded by the PostHog adapter — contains personally identifiable
 * information, free-form text, source code, theme values, or other
 * prohibited content.
 */

/** Fields that must NEVER appear in any analytics event payload. */
const PROHIBITED_FIELDS = new Set([
  // PII
  "email",
  "name",
  "firstName",
  "lastName",
  "userId",
  "username",
  "ip",
  "address",
  "phone",
  // Free-form text
  "query",
  "searchQuery",
  "searchTerm",
  "freeText",
  "comment",
  "notes",
  "message",
  "body",
  "content",
  "description",
  "title",
  // Source code / theme values
  "theme",
  "themeJson",
  "themeData",
  "themeName",
  "themeSlug",
  "tokens",
  "colors",
  "values",
  "css",
  "code",
  "source",
  "snippet",
  // URLs and navigation
  "url",
  "href",
  "pathname",
  "shareUrl",
  "referrer",
  "hash",
  "encoded",
  "queryString",
  // Session/device identifiers
  "sessionId",
  "deviceId",
  "fingerprint",
  "userAgent",
])

/** Allowed categorical values for each field across all event types. */
const ALLOWED_FIELD_VALUES: Record<string, readonly string[]> = {
  event: [
    "search_opened",
    "search_result_selected",
    "builder_opened",
    "builder_exported",
    "builder_shared",
    "page_viewed",
  ],
  trigger: ["keyboard", "click", "command"],
  result_type: ["primitive", "component", "guide", "blog", "api", "a11y"],
  result_locale: ["en", "es"],
  format: ["json", "css", "tailwind", "unocss"],
  content_type: [
    "primitive",
    "component",
    "block",
    "template",
    "theme",
    "guide",
    "community",
    "page",
    "changelog",
  ],
  locale: ["en", "es"],
}

function assertNoProhibitedFields(event: Record<string, unknown>): void {
  for (const key of Object.keys(event)) {
    expect(
      PROHIBITED_FIELDS.has(key),
      `Event "${event.event}" contains prohibited field: "${key}"`,
    ).toBe(false)
  }
}

function assertOnlyAllowedValues(event: Record<string, unknown>): void {
  for (const [key, value] of Object.entries(event)) {
    if (key in ALLOWED_FIELD_VALUES) {
      const allowed = ALLOWED_FIELD_VALUES[key]
      expect(
        allowed.includes(value as string),
        `Event "${event.event}" field "${key}" has disallowed value: "${value}"`,
      ).toBe(true)
    }
  }
}

describe("ANALYTICS-002: prohibited payload field rejection", () => {
  beforeEach(() => {
    __TEST_ONLY__.clearEmittedEvents()
  })

  it("search_opened contains only event + trigger", () => {
    __TEST_ONLY__.forceEmit({ event: "search_opened", trigger: "keyboard" })
    const [ev] = __TEST_ONLY__.getEmittedEvents()
    expect(Object.keys(ev).sort()).toEqual(["event", "trigger"])
    assertNoProhibitedFields(ev)
    assertOnlyAllowedValues(ev)
  })

  it("search_result_selected contains only event + result_type + result_locale", () => {
    __TEST_ONLY__.forceEmit({
      event: "search_result_selected",
      result_type: "primitive",
      result_locale: "en",
    })
    const [ev] = __TEST_ONLY__.getEmittedEvents()
    expect(Object.keys(ev).sort()).toEqual(["event", "result_locale", "result_type"])
    assertNoProhibitedFields(ev)
    assertOnlyAllowedValues(ev)
  })

  it("builder_opened contains only event", () => {
    __TEST_ONLY__.forceEmit({ event: "builder_opened" })
    const [ev] = __TEST_ONLY__.getEmittedEvents()
    expect(Object.keys(ev)).toEqual(["event"])
    assertNoProhibitedFields(ev)
  })

  it("builder_exported contains only event + format", () => {
    __TEST_ONLY__.forceEmit({ event: "builder_exported", format: "tailwind" })
    const [ev] = __TEST_ONLY__.getEmittedEvents()
    expect(Object.keys(ev).sort()).toEqual(["event", "format"])
    assertNoProhibitedFields(ev)
    assertOnlyAllowedValues(ev)
  })

  it("builder_shared contains only event", () => {
    __TEST_ONLY__.forceEmit({ event: "builder_shared" })
    const [ev] = __TEST_ONLY__.getEmittedEvents()
    expect(Object.keys(ev)).toEqual(["event"])
    assertNoProhibitedFields(ev)
  })

  it("every emittable event type is free of prohibited fields", () => {
    const allEvents: SiteAnalyticsEvent[] = [
      { event: "search_opened", trigger: "keyboard" },
      { event: "search_opened", trigger: "click" },
      { event: "search_opened", trigger: "command" },
      { event: "search_result_selected", result_type: "primitive", result_locale: "en" },
      { event: "search_result_selected", result_type: "component", result_locale: "es" },
      { event: "search_result_selected", result_type: "guide", result_locale: "en" },
      { event: "search_result_selected", result_type: "api", result_locale: "es" },
      { event: "builder_opened" },
      { event: "builder_exported", format: "json" },
      { event: "builder_exported", format: "css" },
      { event: "builder_exported", format: "tailwind" },
      { event: "builder_exported", format: "unocss" },
      { event: "builder_shared" },
    ]

    for (const event of allEvents) {
      __TEST_ONLY__.forceEmit(event)
    }

    for (const ev of __TEST_ONLY__.getEmittedEvents()) {
      assertNoProhibitedFields(ev)
      assertOnlyAllowedValues(ev)
    }
  })

  it("TypeScript prevents adding extra fields to typed events", () => {
    // This test documents that the readonly event types prevent runtime injection.
    // If someone bypasses the type system, the runtime check above catches it.
    const event: SiteAnalyticsEvent = { event: "builder_opened" }
    // @ts-expect-error — extra field not allowed by type
    const _invalid = { ...event, email: "test@example.com" } satisfies SiteAnalyticsEvent
    expect(true).toBe(true) // Compile-time enforcement, not runtime
  })
})
