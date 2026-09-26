import { chromium } from "@playwright/test"

const REF_BASE = "http://127.0.0.1:4333"
const SOL_BASE = "http://127.0.0.1:4322"

// Candidate element selectors per frame to enumerate (role + plain tags).
const ENUM = [
  "button",
  "input",
  "label",
  "select",
  "textarea",
  "[role='button']",
  "[role='checkbox']",
  "[role='switch']",
  "[role='slider']",
  "[role='combobox']",
  "[role='listbox']",
  "[role='option']",
  "[role='radio']",
  "[role='tablist']",
  "[role='tab']",
  "[role='group']",
  "[role='textbox']",
  "[role='separator']",
  "[data-state]",
]

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

const args = process.argv.slice(2)
const id = args[0]
const theme = args[1] ?? "light"
// sol wrapper to scope to (optional), e.g. [data-button-example]
const solScope = args[2] ?? ""

function refPathFor(id) {
  return "/" + id
}
function solPathFor(id) {
  return "/components/" + id + "/examples/"
}

async function applyTheme(page, isRef, theme) {
  if (isRef) {
    await page.evaluate((t) => {
      document.documentElement.classList.toggle("dark", t === "dark")
    }, theme)
  } else {
    await page.evaluate((t) => {
      document.documentElement.dataset.theme = t
      document.documentElement.dataset.themePreference = t
      document.documentElement.style.colorScheme = t
    }, theme)
  }
}

async function enumerate(page, scopeSel) {
  return page.evaluate(
    ({ enums, props, scope }) => {
      const scopeEl = scope ? document.querySelector(scope) : null
      const root = scopeEl || document
      const seen = new Set()
      const out = []
      for (const sel of enums) {
        let els
        try {
          els = Array.from(root.querySelectorAll(sel))
        } catch {
          els = []
        }
        for (const e of els) {
          if (seen.has(e)) continue
          seen.add(e)
          if (e.nodeType !== 1) continue
          const r = e.getBoundingClientRect()
          if (r.width === 0 && r.height === 0 && sel !== "[role='listbox']") {
            /* keep, may be hidden */
          }
          const cs = getComputedStyle(e)
          const style = {}
          for (const p of props) style[p] = cs.getPropertyValue(p).trim()
          out.push({
            sel: sel,
            tag: e.tagName.toLowerCase(),
            scope: e.getAttribute("data-scope") ?? undefined,
            part: e.getAttribute("data-part") ?? undefined,
            role: e.getAttribute("role") ?? undefined,
            state: e.getAttribute("data-state") ?? undefined,
            checked: e.getAttribute("aria-checked") ?? undefined,
            expanded: e.getAttribute("aria-expanded") ?? undefined,
            disabled: e.hasAttribute("disabled") ? true : undefined,
            dataState2: e.hasAttribute("data-scope") ? true : undefined,
            cls: (e.getAttribute("class") || "").slice(0, 120),
            w: Math.round(r.width),
            h: Math.round(r.height),
            text: (e.textContent || "").trim().slice(0, 24),
            style,
          })
        }
      }
      return out
    },
    { enums: ENUM, props: PROPS, scope: scopeSel },
  )
}

const browser = await chromium.launch()
const refPage = await (await browser.newContext()).newPage()
const solPage = await (await browser.newContext()).newPage()

await refPage.goto(REF_BASE + refPathFor(id), { waitUntil: "networkidle" })
await solPage.goto(SOL_BASE + solPathFor(id), { waitUntil: "networkidle" })
await applyTheme(refPage, true, theme)
await applyTheme(solPage, false, theme)
await refPage.waitForTimeout(150)
await solPage.waitForTimeout(150)

const result = {
  id,
  theme,
  refPath: refPathFor(id),
  solPath: solPathFor(id),
  solScope,
  ref: await enumerate(refPage, ""),
  sol: await enumerate(solPage, solScope),
}
console.log(JSON.stringify(result, null, 2))
await browser.close()
