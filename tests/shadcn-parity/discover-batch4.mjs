import { chromium } from "@playwright/test"

const REF_BASE = "http://127.0.0.1:4333"
const SOL_BASE = "http://127.0.0.1:4322"

const PROPS = [
  "background-color",
  "color",
  "border-color",
  "border-width",
  "border-style",
  "border-radius",
  "padding",
  "font-size",
  "font-weight",
  "height",
  "min-height",
  "width",
  "min-width",
  "box-shadow",
  "gap",
  "cursor",
  "line-height",
]

// Per-part per-frame selectors for token reading. ref = shadcn page,
// sol = Solidiom island (data-scope/data-part).
const CFG = {
  table: {
    solWrap: null,
    parts: {
      Root: { ref: "table", sol: "[data-scope='table'][data-part='root']" },
      Header: { ref: "thead", sol: "[data-scope='table'][data-part='header']" },
      Row: { ref: "tbody tr", sol: "[data-scope='table'][data-part='row']" },
      Head: { ref: "th", sol: "[data-scope='table'][data-part='head']" },
      Cell: { ref: "tbody td", sol: "[data-scope='table'][data-part='cell']" },
      Caption: { ref: "caption", sol: "[data-scope='table'][data-part='caption']" },
    },
  },
  calendar: {
    solWrap: ".calendar-example",
    parts: {
      Root: {
        ref: "[data-slot='calendar']",
        sol: ".calendar-example [data-scope='calendar'][data-part='root']",
      },
      Nav: {
        ref: ".rdp-nav",
        sol: ".calendar-example [data-scope='calendar'][data-part='header']",
      },
      CaptionLabel: {
        ref: ".rdp-caption_label",
        sol: ".calendar-example [data-scope='calendar'][data-part='title']",
      },
      Prev: {
        ref: "button.rdp-button_previous",
        sol: ".calendar-example [data-scope='calendar'][data-part='prev-button']",
      },
      Next: {
        ref: "button.rdp-button_next",
        sol: ".calendar-example [data-scope='calendar'][data-part='next-button']",
      },
      Weekday: {
        ref: ".rdp-weekday",
        sol: ".calendar-example [data-scope='calendar'] .rdp-weekdays",
      },
      Grid: {
        ref: ".rdp-month_grid",
        sol: ".calendar-example [data-scope='calendar'][data-part='grid']",
      },
      Day: { ref: ".rdp-day", sol: ".calendar-example [data-scope='calendar'][data-part='cell']" },
      DayButton: {
        ref: ".rdp-day button",
        sol: ".calendar-example [data-scope='calendar'][data-part='cell'] button",
      },
    },
  },
  "date-picker": {
    solWrap: ".date-picker-example",
    parts: {
      Trigger: {
        ref: "button[data-state]",
        sol: ".date-picker-example [data-scope='date-picker'][data-part='trigger'] button",
      },

      Content: {
        ref: "[data-state='open'][data-side], div[data-slot='popover-content']",
        sol: "[data-scope='date-picker'][data-part='content']",
      },
      Calendar: {
        ref: "[data-slot='calendar']",
        sol: "[data-scope='date-picker'][data-part='calendar']",
      },
    },
  },
  "data-table": {
    solWrap: ".data-table-example",
    parts: {
      Root: {
        ref: "table",
        sol: ".data-table-example [data-scope='data-table'][data-part='root']",
      },
      Header: {
        ref: "thead",
        sol: ".data-table-example [data-scope='data-table'][data-part='header']",
      },
      HeaderCell: {
        ref: "th",
        sol: ".data-table-example [data-scope='data-table'][data-part='header-cell']",
      },
      Row: {
        ref: "tbody tr",
        sol: ".data-table-example [data-scope='data-table'][data-part='row']",
      },
      Cell: {
        ref: "tbody td",
        sol: ".data-table-example [data-scope='data-table'][data-part='cell']",
      },
    },
  },
  carousel: {
    solWrap: ".carousel-example",
    parts: {
      Root: {
        ref: "[aria-roledescription='carousel']",
        sol: ".carousel-example [data-scope='carousel'][data-part='root']",
      },
      Viewport: {
        ref: "[aria-roledescription='carousel'] > div.overflow-hidden",
        sol: ".carousel-example [data-scope='carousel'][data-part='viewport']",
      },
      Slide: {
        ref: "[aria-roledescription='slide']",
        sol: ".carousel-example [data-scope='carousel'][data-part='slide']",
      },
      Prev: {
        ref: "button:has(.sr-only):first-of-type",
        sol: ".carousel-example [data-scope='carousel'][data-part='prev-button']",
      },
      Next: {
        ref: "button:has(.sr-only)",
        sol: ".carousel-example [data-scope='carousel'][data-part='next-button']",
      },
    },
  },
  progress: {
    solWrap: ".progress-example",
    parts: {
      Root: {
        ref: "[data-state='loading']",
        sol: ".progress-example [data-scope='progress'][data-part='root']",
      },
      Indicator: {
        ref: "[role='progressbar'] > div",
        sol: ".progress-example [data-scope='progress'][data-part='indicator']",
      },
    },
  },
  skeleton: {
    solWrap: ".skeleton-example",
    parts: {
      Root: {
        ref: "div.animate-pulse.rounded-md",
        sol: ".skeleton-example [data-scope='skeleton'][data-part='root']",
      },
    },
  },
  spinner: {
    solWrap: ".spinner-example",
    parts: {
      Root: {
        ref: "svg[role='status']",
        sol: ".spinner-example [data-scope='spinner'][data-part='root']",
      },
    },
  },
  toast: {
    solWrap: ".toast-example",
    trigger: "button:has-text('Show')",
    parts: {
      Root: { ref: "li[data-state]", sol: "[data-scope='toast'][data-part='root']" },
      Title: {
        ref: "li[data-state] .font-semibold",
        sol: "[data-scope='toast'][data-part='title']",
      },
      Description: {
        ref: "li[data-state] .opacity-90",
        sol: "[data-scope='toast'][data-part='description']",
      },
      Close: { ref: "li[data-state] button", sol: "[data-scope='toast'][data-part='close']" },
    },
  },
  "empty-state": {
    solWrap: ".empty-state-example",
    refPath: "empty",
    parts: {
      Root: {
        ref: "[data-slot='empty']",
        sol: ".empty-state-example [data-scope='empty-state'][data-part='root']",
      },
      Header: {
        ref: "[data-slot='empty-header']",
        sol: ".empty-state-example [data-scope='empty-state'][data-part='root']",
      },
      Icon: {
        ref: "[data-slot='empty-icon']",
        sol: ".empty-state-example [data-scope='empty-state'][data-part='icon']",
      },
      Title: {
        ref: "[data-slot='empty-title']",
        sol: ".empty-state-example [data-scope='empty-state'][data-part='title']",
      },
      Description: {
        ref: "[data-slot='empty-description']",
        sol: ".empty-state-example [data-scope='empty-state'][data-part='description']",
      },
      Content: {
        ref: "[data-slot='empty-content']",
        sol: ".empty-state-example [data-scope='empty-state'][data-part='action']",
      },
      ActionButton: {
        ref: "[data-slot='empty-content'] button",
        sol: ".empty-state-example [data-scope='empty-state'][data-part='action'] button",
      },
    },
  },
}

const IDS = process.argv.slice(2)

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

async function dumpParts(page, frame) {
  return page.evaluate(
    ({ props, parts, wrapSel }) => {
      const wrap = wrapSel ? document.querySelector(wrapSel) : null
      const out = {}
      for (const [part, sel] of Object.entries(parts)) {
        const scope = wrap ?? document
        const els = scope.querySelectorAll(sel)
        const el = els.length ? els[0] : null
        if (!el) {
          out[part] = { error: "not found: " + sel }
          continue
        }
        const cs = getComputedStyle(el)
        const r = el.getBoundingClientRect()
        const style = {}
        for (const p of props) style[p] = cs.getPropertyValue(p).trim()
        out[part] = {
          tag: el.tagName.toLowerCase(),
          w: Math.round(r.width),
          h: Math.round(r.height),
          cls: (el.getAttribute("class") || "").slice(0, 100),
          style,
        }
      }
      return out
    },
    {
      props: PROPS,
      parts: Object.fromEntries(Object.entries(frame.parts).map(([k, v]) => [k, v[frame.name]])),
      wrapSel: frame.wrapSel,
    },
  )
}

// Dump the real data-scope/data-part values present in a SOL island wrapper.
async function dumpSolIslandParts(page, wrapSel) {
  return page.evaluate((wrapSel) => {
    const wrap = document.querySelector(wrapSel)
    if (!wrap) return { error: "wrapper not found: " + wrapSel }
    const seen = new Set()
    for (const el of wrap.querySelectorAll("[data-part]")) {
      const key = el.getAttribute("data-scope") + "/" + el.getAttribute("data-part")
      if (!seen.has(key)) {
        seen.add(key)
        const r = el.getBoundingClientRect()
        const cs = getComputedStyle(el)
      }
    }
    const list = []
    for (const el of wrap.querySelectorAll("[data-part]")) {
      list.push({
        scope: el.getAttribute("data-scope"),
        part: el.getAttribute("data-part"),
        tag: el.tagName.toLowerCase(),
        w: Math.round(el.getBoundingClientRect().width),
        h: Math.round(el.getBoundingClientRect().height),
        state: el.getAttribute("data-state") || undefined,
      })
    }
    return list
  }, wrapSel)
}

const browser = await chromium.launch()
const refCtx = await browser.newContext({ viewport: { width: 1280, height: 720 } })
const solCtx = await browser.newContext({ viewport: { width: 1280, height: 720 } })
const refPage = await refCtx.newPage()
const solPage = await solCtx.newPage()

const all = {}
for (const id of IDS) {
  const cfg = CFG[id]
  all[id] = {}
  const refPath = cfg.refPath ?? id
  for (const theme of ["light", "dark"]) {
    await refPage.goto(REF_BASE + "/" + refPath, { waitUntil: "networkidle" })
    await solPage.goto(SOL_BASE + "/components/" + id + "/examples/", {
      waitUntil: "networkidle",
    })
    await applyTheme(refPage, true, theme)
    await applyTheme(solPage, false, theme)
    if (cfg.solWrap) {
      await solPage.evaluate((wrap) => {
        const el = document.querySelector(wrap)
        el?.scrollIntoView({ block: "center" })
      }, cfg.solWrap)
      await solPage.waitForTimeout(300)
    }
    // toast: trigger a toast on both frames (wait long enough for the
    // Radix viewport to mount + the enter animation to finish)
    if (id === "toast") {
      await refPage.click(cfg.trigger)
      await solPage.click(cfg.trigger)
      await refPage.waitForTimeout(1500)
      await solPage.waitForTimeout(1500)
    }
    // date-picker: open the popover on both frames so the content exists
    if (id === "date-picker") {
      await refPage.click("button[data-state]")
      await solPage.click(
        '.date-picker-example [data-scope="date-picker"][data-part="trigger"] button',
      )
      await refPage.waitForTimeout(600)
      await solPage.waitForTimeout(600)
    }
    all[id][theme] = {
      ref: await dumpParts(refPage, { name: "ref", wrapSel: null, parts: cfg.parts }),
      sol: await dumpParts(solPage, { name: "sol", wrapSel: cfg.solWrap, parts: cfg.parts }),
    }
    if (id === "toast") {
      // close toasts for the second theme
      await refPage.keyboard.press("Escape")
      await solPage.keyboard.press("Escape")
    }
  }
  // island part dump (light, after prime)
  if (cfg.solWrap) {
    await solPage.goto(SOL_BASE + "/components/" + id + "/examples/", { waitUntil: "networkidle" })
    await solPage.evaluate((wrap) => {
      const el = document.querySelector(wrap)
      el?.scrollIntoView({ block: "center" })
    }, cfg.solWrap)
    await solPage.waitForTimeout(300)
    all[id].solParts = await dumpSolIslandParts(solPage, cfg.solWrap)
  }
}
console.log(JSON.stringify(all, null, 1))
await browser.close()
