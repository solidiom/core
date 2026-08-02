import { expect, test } from "@playwright/test"

test.describe("SITE-010: Static assets and error pages", () => {
  test("404 is an island-free static fallback with a recovery link", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist/")
    expect(response?.status()).toBe(404)

    await expect(page.locator("h1")).toContainText("404")
    await expect(page.getByText("Page not found")).toBeVisible()
    await expect(page.getByRole("link", { name: "Go to homepage" })).toHaveAttribute("href", "/")
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex")
    await expect(page.locator("header.site-header")).toHaveCount(0)
    await expect(page.locator("footer.site-footer")).toHaveCount(0)
    await expect(page.locator("astro-island")).toHaveCount(0)
  })

  test("500 fallback is emitted as an island-free static recovery page", async ({ page }) => {
    const response = await page.goto("/500/")
    expect(response?.status()).toBe(200)

    await expect(page.locator("h1")).toContainText("500")
    await expect(page.getByText("Something went wrong")).toBeVisible()
    await expect(page.getByRole("link", { name: "Go to homepage" })).toHaveAttribute("href", "/")
    await expect(page.locator("astro-island")).toHaveCount(0)
  })

  test("robots.txt uses canonical tool paths and sitemap origin", async ({ request }) => {
    const response = await request.get("/robots.txt")
    expect(response.status()).toBe(200)

    const text = await response.text()
    expect(text).toContain("User-agent: *")
    expect(text).toContain("Allow: /")
    expect(text).toContain("Sitemap: https://solidiom.org/sitemap-index.xml")
    expect(text).toContain("Disallow: /playground/")
    expect(text).toContain("Disallow: /themes/builder/")
    expect(text).not.toContain("Disallow: /theme-builder/")
  })

  test("sitemap is generated and excludes fallback routes", async ({ request }) => {
    const indexResponse = await request.get("/sitemap-index.xml")
    expect(indexResponse.status()).toBe(200)
    expect(await indexResponse.text()).toContain("sitemap-0.xml")

    const sitemapResponse = await request.get("/sitemap-0.xml")
    expect(sitemapResponse.status()).toBe(200)
    const sitemap = await sitemapResponse.text()
    expect(sitemap).toContain("https://solidiom.org/")
    expect(sitemap).not.toContain("/404/")
    expect(sitemap).not.toContain("/500/")
  })

  test("manifest and every declared icon asset resolve", async ({ request }) => {
    const response = await request.get("/manifest.webmanifest")
    expect(response.status()).toBe(200)

    const manifest = await response.json()
    expect(manifest.name).toBe("Solidiom")
    expect(manifest.start_url).toBe("/")
    expect(manifest.icons).toHaveLength(2)

    for (const icon of manifest.icons) {
      const iconResponse = await request.get(icon.src)
      expect(iconResponse.status(), `${icon.src} should resolve`).toBe(200)
      expect(iconResponse.headers()["content-type"]).toContain(icon.type)
      expect(icon.sizes).toMatch(/^\d+x\d+$/)
      const svg = await iconResponse.text()
      expect(svg).toContain("<svg")
      expect(svg).toContain(`width="${icon.sizes.split("x")[0]}"`)
      expect(svg).toContain(`height="${icon.sizes.split("x")[1]}"`)
    }
  })

  test("canonical, social, manifest, and favicon metadata use valid URLs", async ({
    page,
    request,
  }) => {
    await page.goto("/?utm_source=test#fragment")

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://solidiom.org/",
    )
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      "content",
      "https://solidiom.org/",
    )
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "website")
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary")
    await expect(page.locator('link[rel="manifest"]')).toHaveAttribute(
      "href",
      "/manifest.webmanifest",
    )

    const favicon = page.locator('link[rel="icon"]')
    await expect(favicon).toHaveAttribute("href", "/icons/icon-192.svg")
    const faviconResponse = await request.get("/icons/icon-192.svg")
    expect(faviconResponse.status()).toBe(200)
    expect(faviconResponse.headers()["content-type"]).toContain("image/svg+xml")

    const socialImages = await page
      .locator('meta[property="og:image"], meta[name="twitter:image"]')
      .evaluateAll((elements) =>
        elements.map((element) => element.getAttribute("content")).filter(Boolean),
      )
    for (const image of socialImages) {
      const url = new URL(image!)
      expect(url.origin).toBe("https://solidiom.org")
      const imageResponse = await request.get(`${url.pathname}${url.search}`)
      expect(imageResponse.status(), `${image} should resolve`).toBe(200)
    }
  })

  test("hreflang alternates include x-default", async ({ page }) => {
    await page.goto("/")

    const alternates = page.locator('link[rel="alternate"][hreflang]')
    await expect(alternates).toHaveCount(3)
    await expect(page.locator('link[hreflang="x-default"]')).toHaveAttribute(
      "href",
      "https://solidiom.org/",
    )
  })
})
