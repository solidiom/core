/**
 * ANALYTICS-001: Type stub for posthog-js.
 * The actual package is loaded dynamically at runtime only in production.
 * This stub allows TypeScript to resolve the import without installing the package.
 */
declare module "posthog-js" {
  interface PostHogConfig {
    api_host?: string
    autocapture?: boolean
    capture_pageview?: boolean
    capture_pageleave?: boolean
    disable_session_recording?: boolean
    persistence?: string
    loaded?: (posthog: PostHog) => void
  }

  interface PostHog {
    init(apiKey: string, config?: PostHogConfig): void
    capture(event: string, properties?: Record<string, unknown>): void
    opt_out_capturing(): void
  }

  const posthog: PostHog
  export default posthog
}
