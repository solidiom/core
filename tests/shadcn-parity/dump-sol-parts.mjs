import { chromium } from "@playwright/test"
const SOL = "http://127.0.0.1:4322"
const IDS = process.argv.slice(2)
const b = await chromium.launch()
const ctx = await b.newContext({ viewport: { width: 1280, height: 720 } })
const page = await ctx.newPage()
const out = {}
for (const id of IDS) {
  await page.goto(SOL + "/components/" + id + "/examples/", { waitUntil: "networkidle" })
  // scroll any element whose class contains '-example'
  await page.evaluate((cid) => {
    const els = [...document.querySelectorAll(`[class*='-example']`)]
    els[0]?.scrollIntoView({ block: "center" })
  }, id)
  await page.waitForTimeout(700)
  out[id] = await page.evaluate((cid) => {
    const wrap = document.querySelector(`.${cid}-example`)
    if (!wrap) return { error: "no .<cid>-example wrapper" }
    const root = wrap.querySelector(`[data-scope="${cid}"]`)
    const nodes = [root, ...wrap.querySelectorAll(`[data-scope="${cid}"]`)]
    const parts = {}
    const seen = new Set()
    for (const n of nodes) {
      if (!n) continue
      const p = n.getAttribute("data-part")
      if (!p || seen.has(p)) continue
      seen.add(p)
      const cs = getComputedStyle(n)
      const r = n.getBoundingClientRect()
      parts[p] = {
        tag: n.tagName.toLowerCase(),
        w: Math.round(r.width),
        h: Math.round(r.height),
        "background-color": cs.getPropertyValue("background-color"),
        color: cs.getPropertyValue("color"),
        "border-color": cs.getPropertyValue("border-color"),
        "border-width": cs.getPropertyValue("border-width"),
        "border-radius": cs.getPropertyValue("border-radius"),
        padding: cs.getPropertyValue("padding"),
        "font-size": cs.getPropertyValue("font-size"),
        "font-weight": cs.getPropertyValue("font-weight"),
        height: cs.getPropertyValue("height"),
        "min-height": cs.getPropertyValue("min-height"),
        width: cs.getPropertyValue("width"),
        "min-width": cs.getPropertyValue("min-width"),
        gap: cs.getPropertyValue("gap"),
      }
    }
    return {
      wrapClass: wrap.className,
      hydrated: !!wrap.closest('[data-hydrated="true"]') || wrap.hasAttribute("data-hydrated"),
      parts,
      html: wrap.outerHTML.slice(0, 2500),
    }
  }, id)
}
console.log(JSON.stringify(out, null, 1))
await b.close()
