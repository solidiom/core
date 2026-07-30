#!/usr/bin/env tsx
/**
 * OPS-003: Verify the protected Cloudflare Pages preview after deployment.
 *
 * Required environment variables:
 * - PREVIEW_URL: Wrangler's preview deployment URL.
 * - CLOUDFLARE_ACCESS_CLIENT_ID / CLOUDFLARE_ACCESS_CLIENT_SECRET: a
 *   Cloudflare Access service token allowed to read preview deployments.
 *
 * The unauthenticated request must be intercepted by Access. Authenticated
 * requests then prove the deployed Pages rules for headers, asset caching,
 * Pagefind, and the legacy documentation redirect.
 */

const IMMUTABLE_CACHE_CONTROL = /(?:^|,)\s*max-age=31536000(?:,|$)/i
const DAY_CACHE_CONTROL = /(?:^|,)\s*max-age=86400(?:,|$)/i

function requiredEnvironment(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`${name} must be set to verify the protected preview deployment.`)
  return value
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message)
}

function assertHeader(response: Response, name: string, expected: string): void {
  const value = response.headers.get(name)
  assert(value, `Expected ${name} header to be present.`)
  assert(
    value.toLowerCase().includes(expected.toLowerCase()),
    `Expected ${name} to contain ${JSON.stringify(expected)}; received ${JSON.stringify(value)}.`,
  )
}

function pageUrl(previewUrl: string, pathname: string): string {
  return new URL(pathname, previewUrl).toString()
}

async function authenticatedRequest(previewUrl: string, pathname: string): Promise<Response> {
  return fetch(pageUrl(previewUrl, pathname), {
    headers: {
      "CF-Access-Client-Id": requiredEnvironment("CLOUDFLARE_ACCESS_CLIENT_ID"),
      "CF-Access-Client-Secret": requiredEnvironment("CLOUDFLARE_ACCESS_CLIENT_SECRET"),
    },
    redirect: "manual",
  })
}

async function main(): Promise<void> {
  const previewUrl = requiredEnvironment("PREVIEW_URL")
  const unauthenticated = await fetch(previewUrl, { redirect: "manual" })
  assert(
    [302, 401, 403].includes(unauthenticated.status),
    `Preview must be protected by Cloudflare Access; expected 302, 401, or 403 without credentials, received ${unauthenticated.status}.`,
  )
  if (unauthenticated.status === 302) {
    assert(
      unauthenticated.headers.get("location")?.includes("/cdn-cgi/access/login"),
      "Preview redirect must point to Cloudflare Access login.",
    )
  }

  const homepage = await authenticatedRequest(previewUrl, "/")
  assert(
    homepage.status === 200,
    `Authenticated preview homepage must return 200; received ${homepage.status}.`,
  )
  assertHeader(homepage, "x-frame-options", "DENY")
  assertHeader(homepage, "x-content-type-options", "nosniff")
  assertHeader(homepage, "referrer-policy", "strict-origin-when-cross-origin")
  assertHeader(homepage, "content-security-policy", "default-src 'self'")
  assertHeader(homepage, "content-security-policy", "form-action 'self' https://buttondown.com")

  const homepageHtml = await homepage.text()
  const astroAsset = homepageHtml.match(/(?:src|href)=["'](\/_astro\/[^"']+)["']/)?.[1]
  assert(astroAsset, "Preview homepage did not reference a hashed /_astro/ asset.")

  const asset = await authenticatedRequest(previewUrl, astroAsset)
  assert(
    asset.status === 200,
    `Hashed asset ${astroAsset} must return 200; received ${asset.status}.`,
  )
  const assetCacheControl = asset.headers.get("cache-control") ?? ""
  assert(
    IMMUTABLE_CACHE_CONTROL.test(assetCacheControl) &&
      /(?:^|,)\s*immutable(?:,|$)/i.test(assetCacheControl),
    `Hashed asset must be immutable for one year; received ${JSON.stringify(assetCacheControl)}.`,
  )

  const pagefind = await authenticatedRequest(previewUrl, "/pagefind/pagefind.js")
  assert(pagefind.status === 200, `Pagefind index must be deployed; received ${pagefind.status}.`)
  const pagefindCacheControl = pagefind.headers.get("cache-control") ?? ""
  assert(
    DAY_CACHE_CONTROL.test(pagefindCacheControl),
    `Pagefind index must be cached for one day; received ${JSON.stringify(pagefindCacheControl)}.`,
  )

  const redirect = await authenticatedRequest(previewUrl, "/docs/dialog")
  assert(
    redirect.status === 301,
    `Legacy documentation redirect must return 301; received ${redirect.status}.`,
  )
  assert(
    redirect.headers.get("location") === "/primitives/dialog",
    `Legacy documentation redirect must target /primitives/dialog; received ${JSON.stringify(redirect.headers.get("location"))}.`,
  )

  console.log(`Verified protected preview deployment: ${previewUrl}`)
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
