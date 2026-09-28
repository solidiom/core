import { chromium } from "@playwright/test"
import { readFileSync } from "node:fs"

const REF_BASE = "http://127.0.0.1:4333"
const SOL_BASE = "http://127.0.0.1:4322"
const mapping = JSON.parse(
  readFileSync(
    "/home/opencenter/projects/solidiom/core/.worktrees/shadcn-parity/tests/shadcn-parity/mapping.json",
    "utf8",
  ),
)

const KEEP = {
  button: "[data-button-example]",
  input: ".input-example",
  label: ".label-example",
  checkbox: ".checkbox-example",
  "radio-group": ".radio-group-example",
  switch: ".switch-example",
  slider: ".slider-example",
  select: ".select-example",
  field: ".field-example",
  "input-otp": ".input-otp-example",
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

const browser = await chromium.launch()
const refPage = await (await browser.newContext()).newPage()
const solPage = await (await browser.newContext()).newPage()

for (const entry of mapping) {
  if (entry.status !== "mapped" || !entry.selectors) continue
  const id = entry.id
  const theme = "light"
  await refPage.goto(REF_BASE + "/" + id, { waitUntil: "networkidle" })
  await solPage.goto(SOL_BASE + "/components/" + id + "/examples/", { waitUntil: "networkidle" })
  await applyTheme(refPage, true, theme)
  await applyTheme(solPage, false, theme)
  await refPage.waitForTimeout(120)
  await solPage.waitForTimeout(120)

  console.log("=====" + id + "=====")
  for (const [part, ov] of Object.entries(entry.selectors)) {
    const refSel = typeof ov === "string" ? ov : ov.ref
    const solSel = typeof ov === "string" ? ov : ov.sol
    const props = Object.keys(entry.tokens[part] ?? {})
    const refVals = await refPage.evaluate(
      ([sel, ps]) => {
        const el = document.querySelector(sel)
        if (!el) return null
        const cs = getComputedStyle(el)
        const o = {}
        for (const p of ps) o[p] = cs.getPropertyValue(p).trim()
        o.__sel = sel
        return o
      },
      [refSel, props],
    )
    const solVals = await solPage.evaluate(
      ([sel, ps, wrap]) => {
        const root = (wrap && document.querySelector(wrap)) || document
        const el = root.querySelector(sel)
        if (!el) return null
        const cs = getComputedStyle(el)
        const o = {}
        for (const p of ps) o[p] = cs.getPropertyValue(p).trim()
        o.__sel = sel
        return o
      },
      [solSel, props, KEEP[id]],
    )

    for (const p of props) {
      const exp = entry.tokens[part][p]
      const refV = refVals?.[p] ?? "(none)"
      const solV = solVals?.[p] ?? "(none)"
      const rel = exp.startsWith(">=") || exp.startsWith("<=")
      const mark = rel ? "" : refV === solV ? "MATCH" : "DIFF"
      console.log(
        `  ${part}.${p} | token=${JSON.stringify(exp)} | ref=${JSON.stringify(refV)} | sol=${JSON.stringify(solV)} ${mark}`,
      )
    }
  }
}
await browser.close()
