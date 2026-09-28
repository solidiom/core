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
  "min-width",
  "box-shadow",
  "gap",
  "cursor",
]

// Per-part per-frame selectors for token reading. ref = shadcn page,
// sol = Solidiom island (data-scope/data-part).
const CFG = {
  tabs: {
    solWrap: ".tabs-example",
    parts: {
      List: {
        ref: "[role='tablist']",
        sol: ".tabs-example [data-scope='tabs'][data-part='list']",
      },
      Trigger: {
        ref: "[role='tab']:first-of-type",
        sol: ".tabs-example [data-scope='tabs'][data-part='trigger']",
      },
      Content: {
        ref: "[role='tabpanel']",
        sol: ".tabs-example [data-scope='tabs'][data-part='content']",
      },
    },
  },
  accordion: {
    solWrap: ".accordion-example",
    parts: {
      Item: {
        ref: "[data-orientation='vertical'] > div:first-of-type",
        sol: ".accordion-example [data-scope='accordion'][data-part='item']",
      },
      Trigger: {
        ref: "button[role='button'][aria-expanded]",
        sol: ".accordion-example [data-scope='accordion'][data-part='trigger']",
      },
      Content: {
        ref: "[data-orientation='vertical'] > div > div[data-state='open']",
        sol: ".accordion-example [data-scope='accordion'][data-part='content']",
      },
    },
  },
  collapsible: {
    solWrap: ".collapsible-example",
    parts: {
      Trigger: {
        ref: "button[aria-controls]",
        sol: ".collapsible-example [data-scope='collapsible'][data-part='trigger']",
      },
      Content: {
        ref: "div[data-state='collapsible-content']",
        sol: ".collapsible-example [data-scope='collapsible'][data-part='content']",
      },
    },
  },
  breadcrumb: {
    solWrap: ".breadcrumb-example",
    parts: {
      Root: {
        ref: "nav[aria-label='breadcrumb']",
        sol: ".breadcrumb-example [data-scope='breadcrumb'][data-part='root']",
      },
      List: {
        ref: "nav[aria-label='breadcrumb'] ol",
        sol: ".breadcrumb-example [data-scope='breadcrumb'][data-part='list']",
      },
      Item: {
        ref: "nav[aria-label='breadcrumb'] li:not([role='presentation'])",
        sol: ".breadcrumb-example [data-scope='breadcrumb'][data-part='item']",
      },
      Link: {
        ref: "nav[aria-label='breadcrumb'] a",
        sol: ".breadcrumb-example [data-scope='breadcrumb'][data-part='link']",
      },
      Separator: {
        ref: "nav[aria-label='breadcrumb'] li[role='presentation']",
        sol: ".breadcrumb-example [data-scope='breadcrumb'][data-part='separator']",
      },
    },
  },
  "navigation-menu": {
    solWrap: ".navigation-menu-example",
    parts: {
      List: {
        ref: "ul",
        sol: ".navigation-menu-example [data-scope='navigation-menu'][data-part='list']",
      },
      Item: {
        ref: "ul > li",
        sol: ".navigation-menu-example [data-scope='navigation-menu'][data-part='item']",
      },
      Trigger: {
        ref: "button[aria-haspopup]",
        sol: ".navigation-menu-example [data-scope='navigation-menu'][data-part='trigger']",
      },
      Content: {
        ref: "div[data-state='open'][data-motion]",
        sol: ".navigation-menu-example [data-scope='navigation-menu'][data-part='content']",
      },
      Link: {
        ref: "a[data-active]",
        sol: ".navigation-menu-example [data-scope='navigation-menu'][data-part='link']",
      },
    },
  },
  pagination: {
    solWrap: ".pagination-example",
    parts: {
      Root: {
        ref: "nav[aria-label='pagination']",
        sol: ".pagination-example [data-scope='pagination'][data-part='root']",
      },
      Previous: {
        ref: "a[aria-label='Go to previous page']",
        sol: ".pagination-example [data-scope='pagination'][data-part='previous']",
      },
      Next: {
        ref: "a[aria-label='Go to next page']",
        sol: ".pagination-example [data-scope='pagination'][data-part='next']",
      },
      Item: {
        ref: "nav[aria-label='pagination'] li",
        sol: ".pagination-example [data-scope='pagination'][data-part='item']",
      },
    },
  },
  "resizable-panels": {
    solWrap: ".resizable-panels-example",
    parts: {
      Group: {
        ref: "[data-panel-group-direction]",
        sol: ".resizable-panels-example [data-scope='resizable-panels'][data-part='group']",
      },
      Panel: {
        ref: "[data-panel-id]",
        sol: ".resizable-panels-example [data-scope='resizable-panels'][data-part='panel']",
      },
      Handle: {
        ref: "[data-panel-handle]",
        sol: ".resizable-panels-example [data-scope='resizable-panels'][data-part='handle']",
      },
    },
  },
  "scroll-area": {
    solWrap: ".scroll-area-example",
    parts: {
      Root: {
        ref: "div[data-orientation='vertical']",
        sol: ".scroll-area-example [data-scope='scroll-area'][data-part='root']",
      },
      Viewport: {
        ref: "div[data-orientation='vertical'] > div:first-of-type",
        sol: ".scroll-area-example [data-scope='scroll-area'][data-part='viewport']",
      },
      Scrollbar: {
        ref: "div[data-orientation='vertical'][data-state]",
        sol: ".scroll-area-example [data-scope='scroll-area'][data-part='scrollbar']",
      },
      Thumb: {
        ref: "div[data-orientation='vertical'][data-state] > div",
        sol: ".scroll-area-example [data-scope='scroll-area'][data-part='thumb']",
      },
    },
  },
  avatar: {
    solWrap: ".avatar-example",
    parts: {
      Root: {
        ref: "span:not([data-slot])",
        sol: ".avatar-example [data-scope='avatar'][data-part='root']",
      },
      Image: {
        ref: "img",
        sol: ".avatar-example [data-scope='avatar'][data-part='image']",
      },
      Fallback: {
        ref: "span.bg-muted",
        sol: ".avatar-example [data-scope='avatar'][data-part='fallback']",
      },
    },
  },
  badge: {
    solWrap: ".badge-example",
    parts: {
      Root: {
        ref: "div.inline-flex.rounded-md",
        sol: ".badge-example [data-scope='badge'][data-part='root']",
      },
    },
  },
  kbd: {
    solWrap: ".kbd-example",
    parts: {
      Root: {
        ref: "kbd[data-slot='kbd']:not([data-slot='kbd-group'])",
        sol: ".kbd-example [data-scope='kbd'][data-part='root']",
      },
    },
  },
  sidebar: {
    solWrap: ".sidebar-example",
    parts: {
      Root: {
        ref: "aside",
        sol: ".sidebar-example [data-scope='sidebar'][data-part='root']",
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

async function readParts(page, frame) {
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
          cls: (el.getAttribute("class") || "").slice(0, 80),
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

const browser = await chromium.launch()
const refCtx = await browser.newContext({ viewport: { width: 1280, height: 720 } })
const solCtx = await browser.newContext({ viewport: { width: 1280, height: 720 } })
const refPage = await refCtx.newPage()
const solPage = await solCtx.newPage()

const all = {}
for (const id of IDS) {
  const cfg = CFG[id]
  all[id] = {}
  const refPath = id === "resizable-panels" ? "resizable-panels" : id
  for (const theme of ["light", "dark"]) {
    await refPage.goto(REF_BASE + "/" + refPath, { waitUntil: "networkidle" })
    await solPage.goto(SOL_BASE + "/components/" + id + "/examples/", {
      waitUntil: "networkidle",
    })
    await applyTheme(refPage, true, theme)
    await applyTheme(solPage, false, theme)
    // prime sol island
    await solPage.evaluate((wrap) => {
      const el = document.querySelector(wrap)
      el?.scrollIntoView({ block: "center" })
    }, cfg.solWrap)
    await solPage.waitForTimeout(250)
    await refPage.waitForTimeout(250)
    all[id][theme] = {
      ref: await readParts(refPage, { name: "ref", wrapSel: null, parts: cfg.parts }),
      sol: await readParts(solPage, { name: "sol", wrapSel: cfg.solWrap, parts: cfg.parts }),
    }
  }
}
console.log(JSON.stringify(all, null, 1))
await browser.close()
