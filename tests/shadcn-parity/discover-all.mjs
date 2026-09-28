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
  "width",
  "box-shadow",
  "outline",
  "gap",
  "cursor",
  "opacity",
]

const ids = process.argv.slice(2)

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

async function enumerate(page) {
  return page.evaluate((props) => {
    const seen = new Set()
    const out = []
    const add = (e, marker) => {
      if (seen.has(e)) return
      seen.add(e)
      const r = e.getBoundingClientRect()
      const cs = getComputedStyle(e)
      const style = {}
      for (const p of props) style[p] = cs.getPropertyValue(p).trim()
      out.push({
        marker,
        tag: e.tagName.toLowerCase(),
        scope: e.getAttribute("data-scope") ?? "",
        part: e.getAttribute("data-part") ?? "",
        role: e.getAttribute("role") ?? "",
        state: e.getAttribute("data-state") ?? "",
        checked: e.getAttribute("aria-checked") ?? "",
        expanded: e.getAttribute("aria-expanded") ?? "",
        disabled: e.hasAttribute("disabled") ? "1" : "",
        cls: (e.getAttribute("class") || "").slice(0, 70),
        w: Math.round(r.width),
        h: Math.round(r.height),
        text: (e.textContent || "").trim().slice(0, 16),
        style,
      })
    }
    for (const e of document.querySelectorAll("button")) add(e, "button")
    for (const e of document.querySelectorAll("input")) add(e, "input")
    for (const e of document.querySelectorAll("label")) add(e, "label")
    for (const e of document.querySelectorAll(
      "[role='checkbox'],[role='switch'],[role='slider'],[role='radio'],[role='combobox'],[role='listbox'],[role='option'],[role='tablist'],[role='tab'],[role='group'],[role='separator']",
    ))
      add(e, "role")
    return out
  }, PROPS)
}

const browser = await chromium.launch()
const refPage = await (await browser.newContext()).newPage()
const solPage = await (await browser.newContext()).newPage()

const all = {}
for (const id of ids) {
  const row = { ref: [], sol: [] }
  for (const theme of ["light", "dark"]) {
    await refPage.goto(REF_BASE + "/" + id, { waitUntil: "networkidle" })
    await solPage.goto(SOL_BASE + "/components/" + id + "/examples/", { waitUntil: "networkidle" })
    await applyTheme(refPage, true, theme)
    await applyTheme(solPage, false, theme)
    await refPage.waitForTimeout(120)
    await solPage.waitForTimeout(120)
    row[theme] = { ref: await enumerate(refPage), sol: await enumerate(solPage) }
  }
  all[id] = row
}
console.log(JSON.stringify(all, null, 1))
await browser.close()
