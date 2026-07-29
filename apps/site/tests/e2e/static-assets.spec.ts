import { expect, test } from "@playwright/test"

test.describe("SITE-010: Static assets and error pages", () => {
  test("404 page renders with navigation and link back to homepage", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist/")
    expect(response?.status()).toBe(404)

    await expect(page.locator("h1")).toContainText("404")
    await expect(page.getByText("Page not found")).toBeVisible()
    await expect(page.getByRole("link", { name: "Go to homepage" })).toHaveAttribute("href", "/")

    // Header and footer still render for navigation.
    await expect(page.locator("header.site-header")).toBeVisible()
    await expect(page.locator("footer.site-footer")).toBeVisible()
  })

  test("robots.txt is served with correct content", async ({ request }) => {
    const response = await request.get("/robots.txt")
    expect(response.status()).toBe(200)

    const text = await response.text()
    expect(text).toContain("User-agent: *")
    expect(text).toContain("Allow: /")
    expect(text).toContain("Sitemap: https://solidiom.org/sitemap-index.xml")
    expect(text).toContain("Disallow: /playground/")
    expect(text).toContain("Disallow: /theme-builder/")
  })

  test("sitemap-index.xml is generated", async ({ request }) => {
    const response = await request.get("/sitemap-index.xml")
    expect(response.status()).toBe(200)

    const text = await response.text()
    expect(text).toContain("<sitemapindex")
    expect(text).toContain("sitemap-0.xml")
  })

  test("manifest.webmanifest is served", async ({ request }) => {
    const response = await request.get("/manifest.webmanifest")
    expect(response.status()).toBe(200)

    const json = await response.json()
    expect(json.name).toBe("Solidiom")
    expect(json.start_url).toBe("/")
    expect(json.icons).toHaveLength(2)
  })

  test("homepage has canonical URL and social metadata", async ({ page }) => {
    await page.goto("/")

    // Canonical
    const canonical = page.locator('link[rel="canonical"]')
    await expect(canonical).toHaveAttribute("href", "https://solidiom.org/")

    // Open Graph
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", "Solidiom")
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      "content",
      "https://solidiom.org/",
    )
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "website")

    // Twitter
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary")

    // Manifest
    await expect(page.locator('link[rel="manifest"]')).toHaveAttribute(
      "href",
      "/manifest.webmanifest",
    )
  })

  test("hreflang alternates include x-default", async ({ page }) => {
    await page.goto("/")

    const alternates = page.locator('link[rel="alternate"][hreflang]')
    const count = await alternates.count()
    expect(count).toBeGreaterThanOrEqual(3) // en, es, x-default

    await expect(page.locator('link[hreflang="x-default"]')).toHaveAttribute(
      "href",
      "https://solidiom.org/",
    )
  })
})
