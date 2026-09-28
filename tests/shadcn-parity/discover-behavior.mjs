import { chromium } from "@playwright/test"

const REF_BASE = "http://127.0.0.1:4333"
const SOL_BASE = "http://127.0.0.1:4322"
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

const out = {}
const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 900, height: 720 } })
const refPage = await ctx.newPage()
const solPage = await ctx.newPage()

for (const [id, cfg] of Object.entries(CFG)) {
  // --- ref: does Esc close? (click trigger, Escape, read state)
  await refPage.goto(REF_BASE + "/" + id, { waitUntil: "networkidle" })
  await refPage.waitForTimeout(150)
  if (id === "context-menu") {
    const b = await refPage.evaluate(() => {
      const r = document.querySelector("[data-state]").getBoundingClientRect()
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 }
    })
    await refPage.mouse.click(b.x, b.y, { button: "right" })
  } else if (id === "tooltip" || id === "hover-card") {
    const b = await refPage.evaluate(() => {
      const r = document.querySelector("[data-state]").getBoundingClientRect()
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 }
    })
    await refPage.mouse.move(b.x, b.y, { steps: 4 })
    await refPage.waitForTimeout(700)
  } else {
    await refPage.click("[data-state='closed']")
  }
  await refPage.waitForTimeout(500)
  const openState = await refPage.evaluate(
    () => document.querySelector("[data-state]")?.dataset.state ?? "(none)",
  )
  const openFocus = await refPage.evaluate(() => {
    const ae = document.activeElement
    return {
      tag: ae?.tagName.toLowerCase(),
      role: ae?.getAttribute("role"),
      text: (ae?.textContent || "").trim().slice(0, 20),
    }
  })
  await refPage.keyboard.press("Escape")
  await refPage.waitForTimeout(400)
  const escState = await refPage.evaluate(
    () => document.querySelector("[data-state]")?.dataset.state ?? "(none)",
  )
  const escFocus = await refPage.evaluate(() => {
    const ae = document.activeElement
    return {
      tag: ae?.tagName.toLowerCase(),
      role: ae?.getAttribute("role"),
      state: ae?.getAttribute("data-state"),
      text: (ae?.textContent || "").trim().slice(0, 20),
    }
  })
  // overlay click: reopen then click at (5,5)
  if (id === "context-menu") {
    const b = await refPage.evaluate(() => {
      const r = document.querySelector("[data-state]").getBoundingClientRect()
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 }
    })
    await refPage.mouse.click(b.x, b.y, { button: "right" })
  } else if (id === "tooltip" || id === "hover-card") {
    const b = await refPage.evaluate(() => {
      const r = document.querySelector("[data-state]").getBoundingClientRect()
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 }
    })
    await refPage.mouse.move(b.x, b.y, { steps: 4 })
    await refPage.waitForTimeout(700)
  } else {
    await refPage.click("[data-state='closed']")
  }
  await refPage.waitForTimeout(400)
  await refPage.mouse.click(5, 5)
  await refPage.waitForTimeout(400)
  const ovlState = await refPage.evaluate(
    () => document.querySelector("[data-state]")?.dataset.state ?? "(none)",
  )

  // --- sol: same
  await solPage.goto(SOL_BASE + "/components/" + cfg.solSlug + "/examples/", {
    waitUntil: "networkidle",
  })
  await solPage.evaluate(
    (w) => document.querySelector(w)?.scrollIntoView({ block: "center" }),
    cfg.solWrap,
  )
  await solPage.waitForTimeout(400)
  if (id === "context-menu") {
    const b = await solPage.evaluate((w) => {
      const t = document.querySelector(w + " [data-part='trigger']")
      const r = t.getBoundingClientRect()
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 }
    }, cfg.solWrap)
    await solPage.mouse.click(b.x, b.y, { button: "right" })
  } else if (id === "tooltip" || id === "hover-card") {
    const b = await solPage.evaluate((w) => {
      const t = document.querySelector(w + " [data-part='trigger']")
      const r = t.getBoundingClientRect()
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 }
    }, cfg.solWrap)
    await solPage.mouse.move(b.x, b.y, { steps: 4 })
    await solPage.waitForTimeout(700)
  } else {
    await solPage.click(cfg.solWrap + " [data-part='trigger']")
  }
  await solPage.waitForTimeout(500)
  const solOpen = await solPage.evaluate((w) => {
    const t = document.querySelector(w + " [data-part='trigger']")
    const ae = document.activeElement
    return {
      triggerState: t?.dataset.state ?? "(none)",
      focus: {
        tag: ae?.tagName.toLowerCase(),
        part: ae?.getAttribute("data-part"),
        role: ae?.getAttribute("role"),
        text: (ae?.textContent || "").trim().slice(0, 20),
      },
    }
  }, cfg.solWrap)
  await solPage.keyboard.press("Escape")
  await solPage.waitForTimeout(400)
  const solEsc = await solPage.evaluate((w) => {
    const t = document.querySelector(w + " [data-part='trigger']")
    const c = document.querySelector(w + " [data-part='content']")
    const ae = document.activeElement
    return {
      triggerState: t?.dataset.state ?? "(none)",
      contentState: c?.dataset.state ?? "(absent)",
      focus: {
        tag: ae?.tagName.toLowerCase(),
        part: ae?.getAttribute("data-part"),
        text: (ae?.textContent || "").trim().slice(0, 20),
      },
    }
  }, cfg.solWrap)
  // overlay click
  if (id === "context-menu") {
    const b = await solPage.evaluate((w) => {
      const t = document.querySelector(w + " [data-part='trigger']")
      const r = t.getBoundingClientRect()
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 }
    }, cfg.solWrap)
    await solPage.mouse.click(b.x, b.y, { button: "right" })
  } else if (id === "tooltip" || id === "hover-card") {
    const b = await solPage.evaluate((w) => {
      const t = document.querySelector(w + " [data-part='trigger']")
      const r = t.getBoundingClientRect()
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 }
    }, cfg.solWrap)
    await solPage.mouse.move(b.x, b.y, { steps: 4 })
    await solPage.waitForTimeout(700)
  } else {
    await solPage.click(cfg.solWrap + " [data-part='trigger']")
  }
  await solPage.waitForTimeout(400)
  await solPage.mouse.click(5, 5)
  await solPage.waitForTimeout(400)
  const solOvl = await solPage.evaluate((w) => {
    const t = document.querySelector(w + " [data-part='trigger']")
    const c = document.querySelector(w + " [data-part='content']")
    return {
      triggerState: t?.dataset.state ?? "(none)",
      contentState: c?.dataset.state ?? "(absent)",
    }
  }, cfg.solWrap)

  out[id] = {
    ref: { openState, openFocus, escState, escFocus, ovlState },
    sol: { ...solOpen, esc: solEsc, overlay: solOvl },
  }
}
console.log(JSON.stringify(out, null, 1))
await browser.close()
