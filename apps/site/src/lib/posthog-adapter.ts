/**
 * ANALYTICS-001: Typed PostHog adapter.
 *
 * Subscribes to the internal analytics event bus and forwards typed events
 * to PostHog. Autocapture and session replay are explicitly disabled.
 *
 * Configuration:
 * - PostHog API key is loaded from environment (not committed to source)
 * - Adapter no-ops when the key is unavailable
 * - Only categorical events are forwarded; no free-form text, source code,
 *   theme values, emails, or user-identifiable content is ever sent
 *
 * Privacy guarantees:
 * - autocapture: disabled
 * - session_recording: disabled
 * - capture_pageview: disabled (we send typed page_viewed events instead)
 * - capture_pageleave: disabled
 * - No PII in any event property
 * - No query strings, search terms, or error payloads
 */

import { subscribe } from "./analytics"
import type { SiteAnalyticsEvent } from "./analytics-types"

/** Minimal PostHog client interface — avoids importing the full SDK at type level. */
interface PostHogClient {
  capture(event: string, properties?: Record<string, string | number | boolean>): void
  opt_out_capturing(): void
}

/** PostHog configuration — all privacy-sensitive features disabled. */
interface PostHogConfig {
  api_host: string
  autocapture: false
  capture_pageview: false
  capture_pageleave: false
  disable_session_recording: true
  persistence: "memory"
  loaded?: (posthog: PostHogClient) => void
}

let client: PostHogClient | null = null
let unsubscribe: (() => void) | null = null

/**
 * Initialize the PostHog adapter. Call once on app boot (client-side only).
 *
 * The API key must be provided via environment variable at build time:
 * `PUBLIC_POSTHOG_KEY` in .env or Astro's environment.
 */
export function initPostHog(apiKey: string | undefined): void {
  if (!apiKey || typeof window === "undefined") return

  // Dynamically import posthog-js to avoid bundling it in SSR
  import("posthog-js")
    .then((posthog) => {
      const config: PostHogConfig = {
        api_host: "https://us.i.posthog.com",
        autocapture: false,
        capture_pageview: false,
        capture_pageleave: false,
        disable_session_recording: true,
        persistence: "memory",
      }

      posthog.default.init(apiKey, config)
      client = posthog.default as unknown as PostHogClient

      // Subscribe to the internal event bus
      unsubscribe = subscribe(forwardEvent)
    })
    .catch(() => {
      // PostHog unavailable — degrade gracefully
    })
}

/** Forward a typed analytics event to PostHog. */
function forwardEvent(event: SiteAnalyticsEvent): void {
  if (!client) return

  // Extract event name and properties — never include free-form content
  const { event: eventName, ...properties } = event
  client.capture(eventName, properties as Record<string, string | number | boolean>)
}

/** Opt the current user out of tracking (consent revoked). */
export function optOut(): void {
  if (client) {
    client.opt_out_capturing()
  }
}

/** Tear down the adapter (cleanup). */
export function destroyPostHog(): void {
  if (unsubscribe) {
    unsubscribe()
    unsubscribe = null
  }
  client = null
}

/**
 * Track a page view with only categorical metadata.
 * Called on route change — no URLs, paths, or query strings are captured.
 */
export function trackPageView(contentType: string, locale: string): void {
  if (!client) return
  client.capture("page_viewed", { content_type: contentType, locale })
}
