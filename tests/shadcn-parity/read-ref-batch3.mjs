import { chromium } from "@playwright/test"
const REF = "http://127.0.0.1:4333"
const PROPS = [
  "background-color",
  "color",
  "border-color",
  "border-width",
  "border-radius",
  "padding",
  "font-size",
  "font-weight",
  "min-height",
  "min-width",
  "gap",
  "box-shadow",
]
const IDS = process.argv.slice(2)
const CFG = {
  accordion: { Item: "div.border-b", Trigger: "button[data-state]", Content: "div[role='region']" },
  collapsible: { Trigger: "button[aria-controls]", Content: "div.space-y-2[data-state]" },
  "navigation-menu": {
    List: "ul",
    Trigger: "button[data-state][data-radix-collection-item]",
    Content: "div[data-state='open'][class*='rounded-md']",
    Viewport: "div[data-state='open']",
  },
  "resizable-panels": {
    Group: "[data-panel-group]",
    Panel: "[data-panel-id]",
    Handle: "[data-resize-handle]",
  },
  "scroll-area": {
    Root: "div.relative.overflow-hidden",
    Viewport: "div.relative.overflow-hidden > div:first-of-type",
    Scrollbar: "div.absolute.right-0",
    Thumb: "div.absolute.right-0 > div",
  },
  avatar: { Root: "span.relative.flex.h-10", Fallback: "span[data-state]", Image: "img" },
  badge: { Root: "div.inline-flex.rounded-md" },
  kbd: { Root: "kbd" },
}
async function main() {
  const b = await chromium.launch()
  const ctx = await b.newContext({ viewport: { width: 1280, height: 720 } })
  const page = await ctx.newPage()
  const out = {}
  for (const id of IDS) {
    await page.goto(REF + "/" + id, { waitUntil: "networkidle" })
    await page.evaluate(() => document.documentElement.classList.remove("dark"))
    await page.waitForTimeout(400)
    if (id === "collapsible") {
      const t = await page.$("button[aria-controls]")
      if (t) {
        await t.click()
        await page.waitForTimeout(300)
      }
    }
    if (id === "navigation-menu") {
      const t = await page.$("button[data-state][data-radix-collection-item]")
      if (t) {
        await t.click()
        await page.waitForTimeout(500)
      }
    }
    out[id] = await page.evaluate(
      ({ props, parts }) => {
        const res = {}
        for (const [part, sel] of Object.entries(parts)) {
          const el = document.querySelector(sel)
          if (!el) {
            res[part] = { error: "no el for " + sel }
            continue
          }
          const cs = getComputedStyle(el)
          const r = el.getBoundingClientRect()
          const o = { w: Math.round(r.width), h: Math.round(r.height) }
          for (const p of props) o[p] = cs.getPropertyValue(p).trim()
          res[part] = o
        }
        return res
      },
      { props: PROPS, parts: CFG[id] },
    )
  }
  console.log(JSON.stringify(out, null, 1))
  await b.close()
}
main()
