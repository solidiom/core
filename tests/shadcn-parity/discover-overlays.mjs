import { chromium } from "@playwright/test"

const REF_BASE = "http://127.0.0.1:4333"
const SOL_BASE = "http://127.0.0.1:4322"

const PROPS = [
  "background-color",
  "color",
  "border-color",
  "border-width",
  "border-radius",
  "padding",
  "font-size",
  "font-weight",
  "height",
  "min-height",
  "max-height",
  "width",
  "min-width",
  "box-shadow",
  "outline",
  "gap",
  "cursor",
  "opacity",
  "backdrop-filter",
]

// Per-component config:
// refPath/solSlug: URLs. solWrap: example wrapper class.
// openScript: how to open (name -> function page).
// parts: per-part per-frame selector hints used to dump matched elements.
const CFG = {
  dialog: { solSlug: "dialog", solWrap: ".dialog-example" },
  "alert-dialog": { solSlug: "alert-dialog", solWrap: ".alert-dialog-example" },
  sheet: { solSlug: "sheet", solWrap: ".sheet-example" },
  drawer: { solSlug: "drawer", solWrap: ".drawer-example" },
  popover: { solSlug: "popover", solWrap: ".popover-example" },
  tooltip: { solSlug: "tooltip", solWrap: ".tooltip-example" },
  "hover-card": { solSlug: "hover-card", solWrap: ".hover-card-example" },
  "dropdown-menu": { solSlug: "menu", solWrap: ".menu-example" },
  "context-menu": { solSlug: "context-menu", solWrap: ".context-menu-example" },
}

function openFor(id) {
  switch (id) {
    case "context-menu":
      return async (page) => {
        await page.mouse.click(400, 400, { button: "right" })
        await page.waitForTimeout(300)
      }
    case "tooltip":
    case "hover-card":
      return async (page) => {
        await page.mouse.move(400, 200)
        await page.waitForTimeout(50)
        // hover the trigger area (component sits near top of page)
        await page.mouse.move(24, 200, { steps: 5 })
        await page.waitForTimeout(600)
      }
    default:
      return async (page) => {
        await page.mouse.click(400, 400, { button: "right" }).catch(() => {})
        // generic: click the trigger — handled below per frame
      }
  }
}

async function applyTheme(page, isRef, theme) {
  if (isRef)
    await page.evaluate(
      (t) => document.documentElement.classList.toggle("dark", t === "dark"),
      theme,
    )
  else
    await page.evaluate((t) => {
      document.documentElement.dataset.theme = t
      document.documentElement.dataset.themePreference = t
      document.documentElement.style.colorScheme = t
    }, theme)
}

// Dump all elements with data-scope / data-part / role of interest, with styles.
async function dump(page, wrapSel, label) {
  return page.evaluate(
    ({ props, wrapSel, label }) => {
      const wrap = wrapSel ? document.querySelector(wrapSel) : null
      const root = wrap || document
      const sel =
        "[data-part],[data-scope],[role='dialog'],[role='menu'],[role='menubar'],[role='menuitem'],[role='tooltip'],[role='presentation'],[role='separator'],[data-state],[data-radix-portal],.vaul-drawer,[vaul-drawer-content],[data-sonner-toaster],body > div"
      const seen = new Set()
      const out = []
      const push = (e) => {
        if (seen.has(e)) return
        seen.add(e)
        const r = e.getBoundingClientRect()
        const cs = getComputedStyle(e)
        const style = {}
        for (const p of props) style[p] = cs.getPropertyValue(p).trim()
        out.push({
          label,
          tag: e.tagName.toLowerCase(),
          scope: e.getAttribute("data-scope") ?? "",
          part: e.getAttribute("data-part") ?? "",
          role: e.getAttribute("role") ?? "",
          state: e.getAttribute("data-state") ?? "",
          expanded: e.getAttribute("aria-expanded") ?? "",
          cls: (e.getAttribute("class") || "").slice(0, 90),
          x: Math.round(r.x),
          y: Math.round(r.y),
          w: Math.round(r.width),
          h: Math.round(r.height),
          text: (e.textContent || "").trim().slice(0, 24),
          style,
        })
      }
      for (const e of root.querySelectorAll(sel)) push(e)
      // also portal content appended to body
      if (wrap) {
        for (const e of document.querySelectorAll("body > div")) {
          if (e !== wrap && !wrap.contains(e)) push(e)
        }
      }
      const ae = document.activeElement
      out.push({
        label: label + "/active",
        tag: ae?.tagName.toLowerCase() ?? "",
        scope: ae?.getAttribute("data-scope") ?? "",
        part: ae?.getAttribute("data-part") ?? "",
        role: ae?.getAttribute("role") ?? "",
        state: ae?.getAttribute("data-state") ?? "",
        cls: (ae?.getAttribute("class") || "").slice(0, 90),
        text: (ae?.textContent || "").trim().slice(0, 24),
      })
      return out
    },
    { props: PROPS, wrapSel, label },
  )
}

const ids = process.argv.slice(2)
const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 900, height: 720 } })
const refPage = await ctx.newPage()
const solPage = await ctx.newPage()
const all = {}

for (const id of ids) {
  const cfg = CFG[id]
  const row = {}
  for (const theme of ["light", "dark"]) {
    await refPage.setViewportSize({ width: 900, height: 720 })
    await solPage.setViewportSize({ width: 900, height: 720 })
    await refPage.goto(REF_BASE + "/" + id, { waitUntil: "networkidle" })
    await solPage.goto(SOL_BASE + "/components/" + cfg.solSlug + "/examples/", {
      waitUntil: "networkidle",
    })
    await applyTheme(refPage, true, theme)
    await applyTheme(solPage, false, theme)
    await refPage.waitForTimeout(150)
    await solPage.waitForTimeout(150)

    // prime sol island
    await solPage.evaluate((w) => {
      document.querySelector(w)?.scrollIntoView({ block: "center" })
    }, cfg.solWrap)
    await solPage.waitForTimeout(300)

    row[theme + "-closed"] = {
      ref: await dump(refPage, "", id + "/ref/" + theme + "/closed"),
      sol: await dump(solPage, cfg.solWrap, id + "/sol/" + theme + "/closed"),
    }

    // open the overlay
    if (id === "context-menu") {
      // click center of the trigger region: find its box first
      const rb = await refPage.evaluate(() => {
        const t = document.querySelector("[data-state='closed']")
        const e = t ?? document.body
        const r = e.getBoundingClientRect()
        return { x: r.x + r.width / 2, y: r.y + r.height / 2 }
      })
      const sb = await solPage.evaluate((w) => {
        const wrap = document.querySelector(w)
        const t = wrap?.querySelector("[data-part='trigger']") ?? wrap
        const r = t.getBoundingClientRect()
        return { x: r.x + r.width / 2, y: r.y + r.height / 2 }
      }, cfg.solWrap)
      await refPage.mouse.click(rb.x, rb.y, { button: "right" })
      await solPage.mouse.click(sb.x, sb.y, { button: "right" })
    } else if (id === "tooltip" || id === "hover-card") {
      const rb = await refPage.evaluate(() => {
        const e = document.querySelector("[data-state]")
        const r = e.getBoundingClientRect()
        return { x: r.x + r.width / 2, y: r.y + r.height / 2 }
      })
      const sb = await solPage.evaluate((w) => {
        const wrap = document.querySelector(w)
        const t = wrap?.querySelector("[data-part='trigger']") ?? wrap
        const r = t.getBoundingClientRect()
        return { x: r.x + r.width / 2, y: r.y + r.height / 2 }
      }, cfg.solWrap)
      await refPage.mouse.move(rb.x, rb.y, { steps: 5 })
      await solPage.mouse.move(sb.x, sb.y, { steps: 5 })
      await refPage.waitForTimeout(800)
      await solPage.waitForTimeout(800)
    } else {
      // click trigger
      const rb = await refPage.evaluate(() => {
        const e = document.querySelector("[data-state='closed']")
        const r = e.getBoundingClientRect()
        return { x: r.x + r.width / 2, y: r.y + r.height / 2 }
      })
      const sb = await solPage.evaluate((w) => {
        const wrap = document.querySelector(w)
        const t = wrap?.querySelector("[data-part='trigger']") ?? wrap
        const r = t.getBoundingClientRect()
        return { x: r.x + r.width / 2, y: r.y + r.height / 2 }
      }, cfg.solWrap)
      await refPage.mouse.click(rb.x, rb.y)
      await solPage.mouse.click(sb.x, sb.y)
    }
    await refPage.waitForTimeout(600)
    await solPage.waitForTimeout(600)

    row[theme + "-open"] = {
      ref: await dump(refPage, "", id + "/ref/" + theme + "/open"),
      sol: await dump(solPage, cfg.solWrap, id + "/sol/" + theme + "/open"),
    }

    // close via Escape, capture focus return
    await refPage.keyboard.press("Escape")
    await solPage.keyboard.press("Escape")
    await refPage.waitForTimeout(500)
    await solPage.waitForTimeout(500)
    row[theme + "-closed-esc"] = {
      ref: await dump(refPage, "", id + "/ref/" + theme + "/closed-esc"),
      sol: await dump(solPage, cfg.solWrap, id + "/sol/" + theme + "/closed-esc"),
    }
  }
  all[id] = row
}
console.log(JSON.stringify(all, null, 1))
await browser.close()
