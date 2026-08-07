/**
 * ANALYTICS-003: Production provider configuration outside source.
 *
 * All analytics configuration is loaded from environment variables at build time.
 * No API keys, hostnames, or feature flags are hardcoded in source.
 *
 * Environment variables:
 *   PUBLIC_POSTHOG_KEY — PostHog project API key
 *   PUBLIC_POSTHOG_HOST — PostHog ingestion endpoint
 *   PUBLIC_ANALYTICS_ENABLED_IN_PREVIEW — enable analytics in preview deploys
 *
 * These are set in the deployment platform (Cloudflare Pages environment variables,
 * Vercel environment settings, etc.) and injected by Astro's env system.
 */

export interface AnalyticsConfig {
  /** PostHog API key. Empty string means analytics is disabled. */
  posthogKey: string
  /** PostHog ingestion host. */
  posthogHost: string
  /** Whether analytics is active in the current environment. */
  enabled: boolean
}

/**
 * Read analytics configuration from environment.
 * Returns a config object; never throws.
 */
export function getAnalyticsConfig(): AnalyticsConfig {
  const posthogKey = getEnv("PUBLIC_POSTHOG_KEY", "")
  const posthogHost = getEnv("PUBLIC_POSTHOG_HOST", "https://us.i.posthog.com")
  const previewEnabled = getEnv("PUBLIC_ANALYTICS_ENABLED_IN_PREVIEW", "false") === "true"

  // Analytics is enabled only when:
  // 1. A PostHog key is configured
  // 2. We're in production OR preview analytics is explicitly enabled
  const isProduction = getEnv("PROD", "false") === "true" || getEnv("NODE_ENV", "") === "production"
  const enabled = posthogKey.length > 0 && (isProduction || previewEnabled)

  return { posthogKey, posthogHost, enabled }
}

/** Safe environment variable access — returns fallback on missing/undefined. */
function getEnv(key: string, fallback: string): string {
  try {
    const value = (import.meta as unknown as { env?: Record<string, string> }).env?.[key]
    return value ?? fallback
  } catch {
    return fallback
  }
}
