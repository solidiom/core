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
]

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

async function dump(page, label) {
  return page.evaluate(
    ({ props, label }) => {
      const sel =
        "[data-scope='command-palette'],[data-part],input[role='combobox'],[role='dialog'],[role='listbox'],[role='option'],[cmdk-input-wrapper],[cmdk-group-heading],[cmdk-group],[cmdk-item],[cmdk-list],body > div"
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
          cmdk:
            e.getAttribute("cmdk-input-wrapper") ??
            e.getAttribute("cmdk-group-heading") ??
            e.getAttribute("cmdk-item") ??
            "",
          cls: (e.getAttribute("class") || "").slice(0, 110),
          x: Math.round(r.x),
          y: Math.round(r.y),
          w: Math.round(r.width),
          h: Math.round(r.height),
          text: (e.textContent || "").trim().slice(0, 22),
          style,
        })
      }
      for (const e of document.querySelectorAll(sel)) push(e)
      const ae = document.activeElement
      out.push({
        label: label + "/active",
        tag: ae?.tagName.toLowerCase() ?? "",
        scope: ae?.getAttribute("data-scope") ?? "",
        part: ae?.getAttribute("data-part") ?? "",
        role: ae?.getAttribute("role") ?? "",
        state: ae?.getAttribute("data-state") ?? "",
        cls: (ae?.getAttribute("class") || "").slice(0, 110),
        text: (ae?.textContent || "").trim().slice(0, 22),
      })
      return out
    },
    { props: PROPS, label },
  )
}

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 900, height: 720 } })
const refPage = await ctx.newPage()
const solPage = await ctx.newPage()
const all = {}

for (const theme of ["light", "dark"]) {
  await refPage.setViewportSize({ width: 900, height: 720 })
  await solPage.setViewportSize({ width: 900, height: 720 })
  await refPage.goto(REF_BASE + "/command-palette", { waitUntil: "networkidle" })
  await solPage.goto(SOL_BASE + "/components/command-palette/examples/", {
    waitUntil: "networkidle",
  })
  await applyTheme(refPage, true, theme)
  await applyTheme(solPage, false, theme)
  await refPage.waitForTimeout(150)
  await solPage.waitForTimeout(150)

  // prime sol island (client:visible)
  await solPage
    .evaluate(() =>
      document.querySelector(".command-palette-example")?.scrollIntoView({ block: "center" }),
    )
    .catch(() => {})
  await solPage.waitForTimeout(300)

  all[theme + "-default"] = {
    ref: await dump(refPage, "ref/default"),
    sol: await dump(solPage, "sol/default"),
  }

  // open the command palette
  await refPage.evaluate(() => {
    const b = [...document.querySelectorAll("button")].find((x) =>
      x.textContent.includes("Open command"),
    )
    b?.click()
  })
  await solPage.evaluate(() => {
    // solid island is defaultOpen already (mounted). If not, the Root is present.
    const input = document.querySelector(
      ".command-palette-example [role='dialog'] input, .command-palette-example [data-part='input']",
    )
    input?.focus()
  })
  await refPage.waitForTimeout(500)
  await solPage.waitForTimeout(500)

  all[theme + "-open"] = {
    ref: await dump(refPage, "ref/open"),
    sol: await dump(solPage, "sol/open"),
  }

  // type a query
  await refPage.keyboard.type("sa")
  await solPage.keyboard.type("sa")
  await refPage.waitForTimeout(400)
  await solPage.waitForTimeout(400)
  all[theme + "-type"] = {
    ref: await dump(refPage, "ref/type"),
    sol: await dump(solPage, "sol/type"),
  }
}

console.log(JSON.stringify(all, null, 1))
await browser.close()
