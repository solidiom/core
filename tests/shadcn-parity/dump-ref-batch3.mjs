import { chromium } from "@playwright/test"
const REF = "http://127.0.0.1:4333"
const IDS = process.argv.slice(2)
const b = await chromium.launch()
const ctx = await b.newContext({ viewport: { width: 1280, height: 720 } })
const page = await ctx.newPage()
const out = {}
for (const id of IDS) {
  const path = id === "resizable-panels" ? "resizable-panels" : id
  await page.goto(REF + "/" + path, { waitUntil: "networkidle" })
  await page.evaluate(() => document.documentElement.classList.remove("dark"))
  await page.waitForTimeout(400)
  // Open any overlay-ish parts we can so content is visible:
  // navigation-menu trigger click; accordion first trigger; tabs tab-2.
  if (id === "navigation-menu") {
    const btn = await page.$("button[aria-haspopup]")
    if (btn) {
      await btn.click()
      await page.waitForTimeout(400)
    }
  }
  out[id] = await page.evaluate((id) => {
    const grab = (el) => {
      if (!el) return null
      const cs = getComputedStyle(el)
      const r = el.getBoundingClientRect()
      return {
        tag: el.tagName.toLowerCase(),
        role: el.getAttribute("role") || undefined,
        w: Math.round(r.width),
        h: Math.round(r.height),
        cls: (el.getAttribute("class") || "").slice(0, 140),
        "background-color": cs.getPropertyValue("background-color"),
        color: cs.getPropertyValue("color"),
        "border-color": cs.getPropertyValue("border-color"),
        "border-width": cs.getPropertyValue("border-width"),
        "border-radius": cs.getPropertyValue("border-radius"),
        padding: cs.getPropertyValue("padding"),
        "font-size": cs.getPropertyValue("font-size"),
        "font-weight": cs.getPropertyValue("font-weight"),
        gap: cs.getPropertyValue("gap"),
        "min-height": cs.getPropertyValue("min-height"),
        "min-width": cs.getPropertyValue("min-width"),
      }
    }
    const main = document.querySelector(".min-h-screen") || document.body
    const dump = { root: grab(main) }
    // generic structural dump: every element with role or data-state or data-panel
    const all = [...main.querySelectorAll("*")]
    const interesting = all
      .filter(
        (e) =>
          e.getAttribute("role") ||
          e.getAttribute("data-state") ||
          e.getAttribute("data-panel-id") ||
          e.getAttribute("data-panel-handle") ||
          e.getAttribute("data-panel-group-direction") ||
          e.getAttribute("aria-label") ||
          e.tagName === "KBD" ||
          e.tagName === "IMG" ||
          e.tagName === "OL" ||
          e.tagName === "NAV",
      )
      .slice(0, 40)
    dump.interesting = interesting.map((e) => ({
      tag: e.tagName.toLowerCase(),
      role: e.getAttribute("role") || undefined,
      "aria-label": e.getAttribute("aria-label") || undefined,
      state: e.getAttribute("data-state") || undefined,
      panelId: e.getAttribute("data-panel-id") || undefined,
      cls: (e.getAttribute("class") || "").slice(0, 120),
    }))
    return dump
  }, id)
}
console.log(JSON.stringify(out, null, 1))
await b.close()
