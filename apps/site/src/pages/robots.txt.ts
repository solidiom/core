/**
 * robots.txt — search engine crawl directives (SITE-010).
 *
 * Generated as a static endpoint so it can reference the canonical origin
 * for the sitemap URL. Allows all user agents by default. The Disallow
 * rules will be refined as tool routes (playground, themes/builder) land
 * per SITE-012 / PLAY-001 / BUILDER-001.
 */
import type { APIRoute } from "astro"
import { CANONICAL_ORIGIN } from "../lib/metadata"

export const GET: APIRoute = () => {
  const body = [
    "User-agent: *",
    "Allow: /",
    "",
    "# Disallow tool routes (no indexable content)",
    "Disallow: /playground/",
    "Disallow: /themes/builder/",
    "",
    `Sitemap: ${CANONICAL_ORIGIN}/sitemap-index.xml`,
  ].join("\n")

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  })
}
