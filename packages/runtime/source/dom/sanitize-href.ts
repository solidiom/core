/**
 * URL scheme sanitization for href attributes (SOL-005).
 *
 * Primitives that render `<a href>` pass the prop through without validation
 * (standard component-library pattern). Consumers that pass user-controlled
 * input to `href` should use this utility to prevent `javascript:`, `data:`,
 * and `vbscript:` scheme injection.
 *
 * @example
 * ```tsx
 * import { sanitizeHref } from "@solidiom/runtime"
 * <HoverCard.Trigger href={sanitizeHref(userInput)}>...</HoverCard.Trigger>
 * ```
 */

/**
 * Pattern matching safe URL schemes. Allows:
 * - http:// and https://
 * - mailto:
 * - tel:
 * - Fragment-only (#...)
 * - Relative paths (no scheme)
 *
 * Rejects javascript:, data:, vbscript:, blob:, and any other scheme.
 */
const SAFE_URL_PATTERN = /^(?:https?:|mailto:|tel:|#|\/|\.)/i

/** Scheme detection — catches `javascript:`, `data:`, `vbscript:`, `blob:`, etc. */
const HAS_DANGEROUS_SCHEME = /^[a-z][a-z0-9+.-]*:/i

/**
 * Sanitizes a URL string for safe use in `href` attributes.
 *
 * Returns the URL unchanged if it uses a safe scheme (http, https, mailto, tel)
 * or is a relative/fragment reference. Returns `"#"` for dangerous schemes
 * like `javascript:`, `data:`, `vbscript:`, or `blob:`.
 *
 * @param href — The URL string to sanitize.
 * @returns The original URL if safe, or `"#"` if the scheme is dangerous.
 */
export function sanitizeHref(href: string): string {
  if (typeof href !== "string") return "#"

  const trimmed = href.trim()
  if (trimmed.length === 0) return "#"

  // Fast path: matches a known-safe scheme or is a relative/fragment reference
  if (SAFE_URL_PATTERN.test(trimmed)) return trimmed

  // If it has any scheme prefix at all and didn't match safe patterns, block it
  if (HAS_DANGEROUS_SCHEME.test(trimmed)) return "#"

  // No scheme detected — treat as relative URL (safe)
  return trimmed
}

/**
 * Type guard that checks if a URL uses a safe scheme.
 * Useful for conditional rendering rather than silent replacement.
 */
export function isSafeHref(href: string): boolean {
  return sanitizeHref(href) !== "#"
}
