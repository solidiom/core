/**
 * SEARCH-005: Typed analytics event definitions for the Solidiom site.
 *
 * These types enforce the privacy allowlist defined in
 * docs/contracts/posthog-event-schema.md §4.2 (Search).
 *
 * Strict types — extra properties cause TypeScript errors.
 */

/** Trigger that opened the search dialog. */
export type SearchOpenedTrigger = "keyboard" | "click" | "command"

/** Content-type classification for a selected search result. */
export type SearchResultType = "primitive" | "component" | "guide" | "blog" | "api" | "a11y"

/** Supported result locales. */
export type SearchResultLocale = "en" | "es"

/** Emitted when the search dialog opens. */
export type SearchOpenedEvent = {
  readonly event: "search_opened"
  readonly trigger: SearchOpenedTrigger
}

/** Emitted when a user clicks a search result. */
export type SearchResultSelectedEvent = {
  readonly event: "search_result_selected"
  readonly result_type: SearchResultType
  readonly result_locale: SearchResultLocale
}

/** Union of all search analytics events. */
export type SearchAnalyticsEvent = SearchOpenedEvent | SearchResultSelectedEvent

// ─── Builder analytics (BUILDER-001) ───────────────────────────────────────

export type BuilderExportFormat = "json" | "css" | "tailwind" | "unocss"

export type BuilderOpenedEvent = {
  readonly event: "builder_opened"
}

export type BuilderExportedEvent = {
  readonly event: "builder_exported"
  readonly format: BuilderExportFormat
}

export type BuilderSharedEvent = {
  readonly event: "builder_shared"
}

export type BuilderAnalyticsEvent = BuilderOpenedEvent | BuilderExportedEvent | BuilderSharedEvent

/** Union of all analytics events tracked by the site. */
export type SiteAnalyticsEvent = SearchAnalyticsEvent | BuilderAnalyticsEvent
