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
const KEEP = {
  input: ".input-example",
  label: ".label-example",
  checkbox: ".checkbox-example",
  "radio-group": ".radio-group-example",
  switch: ".switch-example",
  slider: ".slider-example",
  select: ".select-example",
  field: ".field-example",
  "input-otp": ".input-otp-example",
  button: "[data-button-example]",
}
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

async function enumerateSol(page, wrapper) {
  return page.evaluate(
    ({ props, wrapper }) => {
      const wrap = document.querySelector(wrapper)
      if (!wrap) return { error: "wrapper not found: " + wrapper }
      const seen = new Set()
      const out = []
      const add = (e) => {
        if (seen.has(e)) return
        seen.add(e)
        const r = e.getBoundingClientRect()
        const cs = getComputedStyle(e)
        const style = {}
        for (const p of props) style[p] = cs.getPropertyValue(p).trim()
        out.push({
          tag: e.tagName.toLowerCase(),
          scope: e.getAttribute("data-scope") ?? "",
          part: e.getAttribute("data-part") ?? "",
          role: e.getAttribute("role") ?? "",
          state: e.getAttribute("data-state") ?? "",
          checked: e.getAttribute("aria-checked") ?? "",
          expanded: e.getAttribute("aria-expanded") ?? "",
          invalid:
            e.getAttribute("data-invalid") ??
            (e.hasAttribute("aria-invalid") ? "aria-invalid" : ""),
          disabled: e.hasAttribute("disabled") ? "1" : "",
          type: e.getAttribute("type") ?? "",
          cls: (e.getAttribute("class") || "").slice(0, 60),
          w: Math.round(r.width),
          h: Math.round(r.height),
          text: (e.textContent || "").trim().slice(0, 20),
          style,
        })
      }
      for (const e of wrap.querySelectorAll(
        "button,input,label,select,textarea,[role='checkbox'],[role='switch'],[role='slider'],[role='radio'],[role='combobox'],[role='listbox'],[role='option'],[role='group'],[role='separator'],[data-part],[data-state]",
      ))
        add(e)
      return out
    },
    { props: PROPS, wrapper },
  )
}

async function enumerateRef(page) {
  return page.evaluate((props) => {
    const seen = new Set()
    const out = []
    const add = (e) => {
      if (seen.has(e)) return
      seen.add(e)
      const r = e.getBoundingClientRect()
      const cs = getComputedStyle(e)
      const style = {}
      for (const p of props) style[p] = cs.getPropertyValue(p).trim()
      out.push({
        tag: e.tagName.toLowerCase(),
        role: e.getAttribute("role") ?? "",
        state: e.getAttribute("data-state") ?? "",
        checked: e.getAttribute("aria-checked") ?? "",
        expanded: e.getAttribute("aria-expanded") ?? "",
        disabled: e.hasAttribute("disabled") ? "1" : "",
        type: e.getAttribute("type") ?? "",
        cls: (e.getAttribute("class") || "").slice(0, 70),
        w: Math.round(r.width),
        h: Math.round(r.height),
        text: (e.textContent || "").trim().slice(0, 20),
        style,
      })
    }
    for (const e of document.querySelectorAll(
      "button,input,label,select,textarea,[role='checkbox'],[role='switch'],[role='slider'],[role='radio'],[role='combobox'],[role='listbox'],[role='option'],[role='group'],[role='separator']",
    ))
      add(e)
    return out
  }, PROPS)
}

const browser = await chromium.launch()
const refPage = await (await browser.newContext()).newPage()
const solPage = await (await browser.newContext()).newPage()
const all = {}
for (const id of ids) {
  const wrapper = KEEP[id]
  const row = {}
  for (const theme of ["light", "dark"]) {
    await refPage.goto(REF_BASE + "/" + id, { waitUntil: "networkidle" })
    await solPage.goto(SOL_BASE + "/components/" + id + "/examples/", { waitUntil: "networkidle" })
    await applyTheme(refPage, true, theme)
    await applyTheme(solPage, false, theme)
    await refPage.waitForTimeout(120)
    await solPage.waitForTimeout(120)
    row[theme] = { ref: await enumerateRef(refPage), sol: await enumerateSol(solPage, wrapper) }
  }
  all[id] = row
}
console.log(JSON.stringify(all, null, 1))
await browser.close()
