import { mkdir, copyFile, writeFile } from "node:fs/promises"
import { join, basename } from "node:path"
import { execSync } from "node:child_process"
import type { Page } from "@playwright/test"
import type { MappingEntry, SignalResult, SignalVerdict, VerdictReport } from "./types"
import { runInteractions } from "./interaction-scripts"

export interface TokenAssertResult {
  pass: boolean
  expected: string
  actual: string
}

/**
 * Pure token assertion — unit-testable without a browser.
 *
 * - exact: `pass = expected === actual`. Token-identity expectations such as
 *   `var(--radius)` are compared by resolved value: the caller passes
 *   already-resolved computed strings on both sides, so identity reduces to
 *   an exact string comparison here.
 * - relational: `>=N` passes when parseFloat(actual) >= N; `<=N` when <= N.
 */
export function assertToken(expected: string, actual: string): TokenAssertResult {
  if (expected.startsWith(">=")) {
    const threshold = parseFloat(expected.slice(2))
    return { pass: parseFloat(actual) >= threshold, expected, actual }
  }
  if (expected.startsWith("<=")) {
    const threshold = parseFloat(expected.slice(2))
    return { pass: parseFloat(actual) <= threshold, expected, actual }
  }
  return { pass: expected === actual, expected, actual }
}

/**
 * Pure pixel-signal decision — unit-testable without sharp or a browser.
 *
 * - `diff === null` → "skip": sharp is unavailable, so the pixel signal is a
 *   missing CORROBORATION, not a verdict. Per the spec, computed-style tokens
 *   are the primary look signal; a skipped pixel diff must neither fail a
 *   component nor be recorded as an accepted divergence.
 * - `diff <= tolerancePct` → "pass" (parity within tolerance).
 * - otherwise (including Infinity from a size mismatch / unreadable PNG) → "fail".
 */
export function pixelVerdict(diff: number | null, tolerancePct: number): "skip" | "pass" | "fail" {
  if (diff === null) return "skip"
  return diff <= tolerancePct ? "pass" : "fail"
}

export interface PartTokenResults {
  expected: string
  actual: string
  pass: boolean
}

/**
 * Canonical behavior snapshot — scheme-independent facts keyed by the
 * mapping's declared part names, not by the frame's raw attributes.
 *
 * shadcn (Radix) and Solidiom (data-part/data-scope) express the same logical
 * state with DIFFERENT attribute vocabularies: the select trigger is
 * `role=combobox data-state=closed` on the ref frame and `data-part=trigger
 * data-state=closed` on the sol frame; the switch thumb is
 * `data-state=unchecked` vs `data-state=off`/`aria-checked`. Comparing raw
 * `tag:part=value` strings therefore flags every scheme difference as a
 * divergence. The canonical form normalizes each frame down to:
 *
 * - `focusedPart` — the declared part name whose element currently holds
 *   `document.activeElement` (resolved with `activeElement.closest(partSelector)`),
 *   or null. Scheme-independent by construction: it uses OUR part names.
 * - `open` — one boolean per part for which open/closed is meaningful, derived
 *   from `aria-expanded` / `data-state=open|closed`. Both frames carry explicit
 *   vocabulary (the shadcn trigger has `aria-expanded`, the Radix portal has
 *   `data-state` even while closed, the Solidiom trigger has both). An unmounted
 *   overlay (Solidiom's closed Select content) is recorded as `open:false` by the
 *   absence branch — presence alone is never an open signal because Radix keeps
 *   closed portals in the DOM.
 * - `checked` — one boolean per part for which checked/unchecked is
 *   meaningful, derived from `aria-checked` / `data-state=on|checked`.
 *
 * Two frames are behaviorally equal iff their canonical snapshots deep-equal.
 */
export interface BehaviorSnapshot {
  focusedPart: string | null
  open: Record<string, boolean>
  checked: Record<string, boolean>
}

/**
 * Pure normalization of one element's raw attributes to canonical flags —
 * unit-testable without a browser.
 *
 * - `checked`: `aria-checked` wins (true/false/mixed→true, "indeterminate"),
 *   else `data-state` in {`on`, `checked`}. shadcn switches/checkboxes/radios
 *   use `data-state=checked|unchecked`; Solidiom switches use
 *   `data-state=on|off` + `aria-checked` — both normalize to one boolean.
 *   (Solidiom Select items use `data-state=checked` for the SELECTED option;
 *   in that context `checked` == "selected", which is still a per-item
 *   boolean and compares correctly across frames because Radix items expose
 *   the same selection via `data-state`.)
 * - `open`: `aria-expanded === "true"` OR `data-state === "open"`.
 */
export function canonicalState(el: {
  dataset: { state?: string }
  getAttribute: (name: string) => string | null
}): { checked?: boolean; open?: boolean } {
  const out: { checked?: boolean; open?: boolean } = {}
  const checkedAttr = el.getAttribute("aria-checked")
  if (checkedAttr !== null) {
    out.checked = checkedAttr === "true" || checkedAttr === "mixed"
  } else {
    const ds = el.dataset.state
    if (ds === "on" || ds === "checked") out.checked = true
    else if (ds === "off" || ds === "unchecked") out.checked = false
  }
  if (el.getAttribute("aria-expanded") === "true") out.open = true
  else if (el.dataset.state === "open") out.open = true
  else if (el.getAttribute("aria-expanded") === "false") out.open = false
  else if (el.dataset.state === "closed") out.open = false
  return out
}

function behaviorSnapshotsEqual(a: BehaviorSnapshot, b: BehaviorSnapshot): boolean {
  return (
    a.focusedPart === b.focusedPart &&
    JSON.stringify(a.open) === JSON.stringify(b.open) &&
    JSON.stringify(a.checked) === JSON.stringify(b.checked)
  )
}

/**
 * Signal 1 (computed styles): for each part → element selector and each token
 * property, read `getComputedStyle(el)[prop]` on the page and run `assertToken`.
 * A missing element yields a failing result with actual = "(missing element)".
 */
export async function readComputedTokens(
  page: Page,
  partSelectors: Record<string, string>,
  tokenMap: Record<string, Record<string, string>>,
): Promise<Record<string, Record<string, PartTokenResults>>> {
  const out: Record<string, Record<string, PartTokenResults>> = {}
  for (const [part, props] of Object.entries(tokenMap)) {
    out[part] = {}
    const sel = partSelectors[part]
    const el = sel ? page.locator(sel).first() : null
    for (const [prop, expected] of Object.entries(props)) {
      if (!el || (await el.count()) === 0) {
        out[part][prop] = {
          expected,
          actual: "(missing element)",
          pass: false,
        }
      } else {
        const actual = await el.evaluate(
          (node, p) => getComputedStyle(node as HTMLElement).getPropertyValue(p),
          prop,
        )
        out[part][prop] = assertToken(expected, actual.trim())
      }
    }
  }
  return out
}

/**
 * Signal 2 (behavior), canonical form.
 *
 * Resolves each DECLARED part to its element via the per-frame selector map
 * (so part identity comes from OUR mapping, never the frame's attributes) and
 * reduces the frame to scheme-independent facts:
 *
 * - `focusedPart`: the part whose element contains `document.activeElement`
 *   (`activeElement.closest(partSelector)`).
 * - `open[part]`: the part's canonical open/closed flag, from `aria-expanded`
 *   / `data-state=open|closed`. Both frames carry explicit vocabulary here —
 *   the shadcn trigger has `aria-expanded`, the Radix portal has
 *   `data-state=open|closed` (stays mounted while closed), and the Solidiom
 *   trigger has both while its content is unmounted when closed (recorded as
 *   `open=false` by the absence branch). Presence alone is never an open
 *   signal, because Radix keeps closed portals in the DOM.
 * - `checked[part]`: the part's canonical checked/unchecked flag, from
 *   `aria-checked` / `data-state=on|checked` (see `canonicalState`).
 *
 * Only parts whose state actually differs from the neutral default are
 * recorded (checked parts: `true`; open parts: `false`, since an open overlay
 * is the exceptional state worth flagging). Two snapshots compare equal iff
 * `focusedPart` and both maps match — a raw-attribute comparison would false-❌
 * on every Radix-vs-data-part vocabulary difference.
 */
export async function captureBehavior(
  page: Page,
  partSelectors: Record<string, string>,
): Promise<BehaviorSnapshot> {
  return page.evaluate((selectors) => {
    // Inlined (not imported) because page.evaluate serializes this function
    // body into the browser context, where module scope is unavailable.
    const canonical = (el: Element) => {
      const out: { checked?: boolean; open?: boolean } = {}
      const ca = el.getAttribute("aria-checked")
      if (ca !== null) out.checked = ca === "true" || ca === "mixed"
      else {
        const ds = (el as HTMLElement).dataset.state
        if (ds === "on" || ds === "checked") out.checked = true
        else if (ds === "off" || ds === "unchecked") out.checked = false
      }
      if (el.getAttribute("aria-expanded") === "true") out.open = true
      else if ((el as HTMLElement).dataset.state === "open") out.open = true
      else if (el.getAttribute("aria-expanded") === "false") out.open = false
      else if ((el as HTMLElement).dataset.state === "closed") out.open = false
      return out
    }
    const active = document.activeElement as HTMLElement | null
    let focusedPart: string | null = null
    if (active) {
      for (const [part, sel] of Object.entries(selectors)) {
        if (sel === "body") {
          focusedPart = part
          break
        }
        try {
          if (active.closest(sel)) {
            focusedPart = part
            break
          }
        } catch {
          /* invalid selector for this frame — skip the part */
        }
      }
    }
    const open: Record<string, boolean> = {}
    const checked: Record<string, boolean> = {}
    for (const [part, sel] of Object.entries(selectors)) {
      if (sel === "body") continue
      let el: HTMLElement | null = null
      try {
        el = document.querySelector(sel)
      } catch {
        continue
      }
      if (!el) {
        // Part element absent from the DOM. For parts whose open/closed is
        // meaningful, absence on the Solidiom frame means closed (unmounted);
        // on the shadcn frame it means "not rendered yet" — neither frame's
        // presence is asserted, so record false only when the part name
        // denotes an overlay (content) to keep both frames comparable.
        if (/content/i.test(part)) open[part] = false
        continue
      }
      const c = canonical(el)
      if (c.open !== undefined) open[part] = c.open
      if (c.checked !== undefined) checked[part] = c.checked
    }
    return { focusedPart, open, checked }
  }, partSelectors)
}

/**
 * Signal 3 (pixels): screenshot the component bounding box (all declared part
 * elements, or the page if none are present) into `outPath`.
 */
export async function screenshotPart(
  page: Page,
  partSelectors: Record<string, string>,
  outPath: string,
): Promise<void> {
  const clip = await page.evaluate((selectors) => {
    const els = Object.values(selectors)
      .map((s) => document.querySelector<HTMLElement>(s))
      .filter((e): e is HTMLElement => e !== null)
    const targets = els.length > 0 ? els : [document.body]
    let left = Infinity
    let top = Infinity
    let right = -Infinity
    let bottom = -Infinity
    for (const e of targets) {
      const r = e.getBoundingClientRect()
      left = Math.min(left, r.left)
      top = Math.min(top, r.top)
      right = Math.max(right, r.right)
      bottom = Math.max(bottom, r.bottom)
    }
    return {
      x: Math.max(0, left),
      y: Math.max(0, top),
      width: Math.max(1, right - left),
      height: Math.max(1, bottom - top),
    }
  }, partSelectors)
  await page.screenshot({ path: outPath, clip, animations: "disabled" })
}

const SHADCN_VERSION = "3.8.5"

function solidiomSha(): string {
  try {
    return execSync("git rev-parse --short HEAD", {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim()
  } catch {
    return "unknown"
  }
}

/**
 * Build the CSS selector for a component part.
 *
 * Both frames expose part identity differently: the reference app's shadcn
 * components carry no `data-part` attribute, while Solidiom recipes mostly do
 * (see each package's src). The selector therefore tries the `data-part`
 * attribute (any scope) first and falls back to a best-effort element selector
 * derived from the part name. Phase A per-component mapping passes refine
 * these selectors (`selectors` override in the mapping).
 */
function partSelector(part: string): string {
  return `[data-part='${part}'], ${partToElement(part)}`
}

/**
 * Resolve the selector for one part on one frame, honoring the Phase A
 * `selectors` override in the mapping.
 *
 * - a string override is used verbatim on both frames;
 * - an object override uses `frame === "ref" ? sel.ref : sel.sol`;
 * - when no override exists for the part, fall back to the generic
 *   `partSelector(part)` (which may degrade to `body` for unrecognized parts).
 */
function resolveSelector(entry: MappingEntry, part: string, frame: "ref" | "sol"): string {
  const override = entry.selectors?.[part]
  if (typeof override === "string") return override
  if (override && typeof override === "object") {
    const sel = frame === "ref" ? override.ref : override.sol
    if (sel) return sel
  }
  return partSelector(part)
}

function partToElement(part: string): string {
  const p = part.toLowerCase()
  if (p.includes("content")) return `div, [role='dialog'], [role='presentation']`
  if (p.includes("trigger")) return `button, [role='button'], [role='combobox']`
  if (p.includes("item")) return `[role='option'], li`
  if (p.includes("label")) return "label"
  if (p.includes("input")) return "input"
  return "body"
}

/**
 * The per-component engine (spec §3).
 *
 * Loops `themes × states`; for each (theme, state) applies the theme to both
 * frames (ref: `dark` class on `<html>`; sol: `document.documentElement.dataset.theme`),
 * drives the state's interaction script (or "reset") into both frames, captures
 * the 3 signals (computed tokens, behavior, pixel crop) on both frames, and
 * records one signal row per comparison. A mismatch is `gap` unless the signal
 * is in the entry's `acceptedDivergences`, in which case it is `accepted`.
 * Pixel rows respect `tolerance.pixelMaxDiff` / `tolerance.pixelMaxPercent`.
 *
 * Returns the `VerdictReport`; writes PNGs under `<outDir>/<id>/`.
 */
export async function verifyEntry(
  entry: MappingEntry,
  refPage: Page,
  solPage: Page,
  outDir: string,
): Promise<VerdictReport> {
  const signals: SignalResult[] = []
  const assetDir = join(outDir, entry.id)
  await mkdir(assetDir, { recursive: true })

  const declaredParts = entry.parts.length > 0 ? entry.parts : Object.keys(entry.tokens)
  // Two per-frame selector maps: shadcn and solidiom use different attribute
  // schemes (no data-part vs data-scope/data-part), so a single shared map is
  // only correct when the part's selector is frame-agnostic. resolveSelector
  // honors entry.selectors and falls back to the generic partSelector.
  const refSelectors = Object.fromEntries(
    declaredParts.map((p) => [p, resolveSelector(entry, p, "ref")]),
  )
  const solSelectors = Object.fromEntries(
    declaredParts.map((p) => [p, resolveSelector(entry, p, "sol")]),
  )
  // The interaction "target": the component's primary interactive element per
  // frame. We use the first declared part's resolved selector — for every
  // Batch-1 component that part is the thing you click/hover/focus (Root for
  // button/checkbox, Trigger for select, Item for radio, Thumb for switch,
  // Root for slider). Passing this to runInteractions scopes the state scripts
  // to the component instead of letting them hit ambient site chrome (the nav
  // "toggle dark" button, the search input, etc.).
  const refTarget = declaredParts.length > 0 ? refSelectors[declaredParts[0]] : undefined
  const solTarget = declaredParts.length > 0 ? solSelectors[declaredParts[0]] : undefined

  // The SOL islands are Astro `client:visible` — they hydrate (and become
  // interactive) only once scrolled into the viewport. The example wrapper
  // sits well below the fold on a 720px viewport, so without an explicit
  // scroll the island is SSR'd markup with no event handlers, and every
  // stateful interaction (select open, checkbox toggle, switch flip) silently
  // no-ops while the token capture still reads the static SSR styles. Prime the
  // island: scroll its first part into view and wait for `data-hydrated`.
  if (solTarget) await primeSolIsland(solPage, solTarget)
  const scriptForState = (state: string): string =>
    entry.interactions.includes(state) ? state : "reset"

  const verdictFor = (signal: string, pass: boolean): SignalVerdict => {
    const accepted = entry.acceptedDivergences.some(
      (d) => d.signal === signal || d.signal.endsWith(`.${signal}`) || signal.startsWith(d.signal),
    )
    return pass ? "parity" : accepted ? "accepted" : "gap"
  }

  for (const theme of entry.themes) {
    await applyTheme(refPage, solPage, theme)

    for (const state of entry.states) {
      const script = scriptForState(state)
      // Reset to a deterministic baseline BEFORE advancing into the state,
      // regardless of the state's own script: a stateful component (switch,
      // radio, checkbox) would otherwise be captured "after the previous
      // run's interactions" (e.g. left ON) and the behavior signal would
      // report a spurious checked divergence.
      await runInteractions(refPage, "reset", refTarget)
      await runInteractions(solPage, "reset", solTarget)
      await runInteractions(refPage, script, refTarget)
      await runInteractions(solPage, script, solTarget)
      // Re-prime the SOL island before capture. `client:visible` islands
      // re-observe on scroll: after the per-state reset (an Escape press that
      // can leave the island mid-hydration or the viewport shifted), the
      // example may re-hydrate and briefly present stale SSR state. Scrolling
      // it back into view and waiting for `data-hydrated` before the token /
      // behavior / pixel captures ensures we read the settled, interactive
      // island — not a half-hydrated snapshot.
      if (solTarget) await primeSolIsland(solPage, solTarget)
      await Promise.all([refPage.waitForTimeout(100), solPage.waitForTimeout(100)])

      // Signal 1: computed tokens.
      const [refTokens, solTokens] = await Promise.all([
        readComputedTokens(refPage, refSelectors, entry.tokens),
        readComputedTokens(solPage, solSelectors, entry.tokens),
      ])
      for (const [part, props] of Object.entries(entry.tokens)) {
        for (const [prop] of Object.entries(props)) {
          const signal = `tokens.${part}.${prop}`
          const refVal = refTokens[part]?.[prop]?.actual ?? "(missing element)"
          const solVal = solTokens[part]?.[prop]?.actual ?? "(missing element)"
          const pass = refVal === solVal
          signals.push({
            signal,
            expected: refVal,
            actual: solVal,
            verdict: verdictFor(signal, pass),
          })
        }
      }

      // Signal 2: behavior.
      const [refBehavior, solBehavior] = await Promise.all([
        captureBehavior(refPage, refSelectors),
        captureBehavior(solPage, solSelectors),
      ])
      const behaviorPass = behaviorSnapshotsEqual(refBehavior, solBehavior)
      const behaviorSignal = `behavior.${script}`
      signals.push({
        signal: behaviorSignal,
        expected: describeBehavior(refBehavior),
        actual: describeBehavior(solBehavior),
        verdict: verdictFor(behaviorSignal, behaviorPass),
      })

      // Signal 3: pixels.
      const refPng = join(assetDir, `${entry.id}-${theme}-${state}-shadcn.png`)
      const solPng = join(assetDir, `${entry.id}-${theme}-${state}-solidiom.png`)
      await screenshotPart(refPage, refSelectors, refPng)
      await screenshotPart(solPage, solSelectors, solPng)
      const diff = await pixelDiffPct(refPng, solPng)
      const decision = pixelVerdict(diff, entry.tolerance.pixelMaxPercent)
      if (decision !== "skip") {
        const pixelSignal = `pixels.${theme}.${state}`
        signals.push({
          signal: pixelSignal,
          expected: `≤ ${entry.tolerance.pixelMaxPercent}% diff`,
          actual: `delta ${diff}%`,
          verdict: verdictFor(pixelSignal, decision === "pass"),
        })
      }

      // Drive both frames back to a known reset state for the next iteration.
      await runInteractions(refPage, "reset", refTarget)
      await runInteractions(solPage, "reset", solTarget)
    }
  }

  return {
    id: entry.id,
    shadcnVersion: SHADCN_VERSION,
    solidiomSha: solidiomSha(),
    signals,
    failures: signals.filter((s) => s.verdict === "gap").length,
    accepted: signals.filter((s) => s.verdict === "accepted").length,
  }
}

/**
 * Scroll the SOL island into the viewport and wait for it to hydrate.
 *
 * Islands are Astro `client:visible`, so they only mount + wire event handlers
 * once visible. The selector here is the first resolved part, which is already
 * scoped to the example wrapper (e.g. `.select-example [data-scope=...]`); we
 * scroll it into view, then wait (up to ~3s) for the wrapper's
 * `data-hydrated="true"` attribute. If the wrapper never hydrates (e.g. the
 * island is static or the attribute name differs) we still proceed after the
 * timeout — the token capture works on SSR markup; only stateful interactions
 * depend on hydration, and a missing island is reported as a gap downstream.
 */
async function primeSolIsland(solPage: Page, partSelector: string): Promise<void> {
  try {
    await solPage.evaluate((sel) => {
      const el = document.querySelector(sel)
      el?.scrollIntoView({ block: "center" })
    }, partSelector)
    // Wait for the nearest ancestor that carries data-hydrated, or the element
    // itself. Bounded so a static island can't hang the suite.
    await solPage
      .waitForFunction(
        (sel) => {
          const el = document.querySelector(sel)
          return !!el && !!el.closest('[data-hydrated="true"]')
        },
        partSelector,
        { timeout: 3000 },
      )
      .catch(() => {
        /* island may be static — proceed anyway */
      })
    await solPage.waitForTimeout(120)
  } catch {
    /* a selector that matches nothing is non-fatal here */
  }
}

async function applyTheme(refPage: Page, solPage: Page, theme: "light" | "dark"): Promise<void> {
  await refPage.evaluate((t) => {
    document.documentElement.classList.toggle("dark", t === "dark")
  }, theme)
  await solPage.evaluate((t) => {
    document.documentElement.dataset.theme = t
    document.documentElement.dataset.themePreference = t
    document.documentElement.style.colorScheme = t
  }, theme)
}

function describeBehavior(b: BehaviorSnapshot): string {
  // Compact canonical rendering: `focus=<part|->` plus only the non-default
  // flags (checked parts: true; open parts: false — the exceptional states).
  // Example: `focus=Trigger open=Content:false checked=Root:true`.
  const parts: string[] = []
  parts.push(`focus=${b.focusedPart ?? "-"}`)
  for (const [part, v] of Object.entries(b.open)) if (v === false) parts.push(`open=${part}:false`)
  for (const [part, v] of Object.entries(b.checked))
    if (v === true) parts.push(`checked=${part}:true`)
  return parts.join(" ")
}

type SharpRaw = { data: Buffer; info: { width: number; height: number } }

/**
 * Compare two PNGs, returning the percent of raw bytes that differ.
 *
 * Three outcomes:
 * - `null` — `sharp` could not be loaded (not resolvable in this environment).
 *   The pixel signal is a CORROBORATION of the computed-style token signal, not
 *   a gate; an unavailable sharp is not a pixel difference, so callers skip the
 *   pixel verdict entirely.
 * - `Infinity` — sharp loaded but a PNG is unreadable. That IS a real capture
 *   problem and stays a loud failing gap.
 * - number — comparable images; percent of differing bytes.
 *
 * Dimension mismatch is NOT Infinity: the per-part selectors can legitimately
 * clip differently-sized boxes (a shadcn control vs a Solidiom row that wraps
 * the control in a label). Before comparing, both raw images are normalized to
 * a common 200×200 (nearest-neighbour, fit:fill) so the byte diff measures
 * "how differently do the parts LOOK" rather than "are the crop rectangles
 * identical". A same-size comparison is unaffected (both resize to the same
 * grid; a pixel-identical pair still diffs at ~0%).
 *
 * sharp is resolved at runtime via createRequire from the repo root and typed
 * structurally (no `import("sharp")` — no declarations at the resolution path).
 */
async function pixelDiffPct(refPng: string, solPng: string): Promise<number | null> {
  const COMPARISON_SIZE = 200
  let sharp: (p: string) => {
    raw(): { toBuffer(opts?: { resolveWithObject?: boolean }): Promise<SharpRaw> }
    resize(o: { width: number; height: number; fit: "fill"; kernel: "nearest" }): any
  }
  try {
    const { createRequire } = await import("node:module")
    const req = createRequire(join(process.cwd(), "package.json"))
    sharp = req("sharp") as typeof sharp
  } catch {
    return null
  }
  try {
    const normalize = (p: string) =>
      sharp(p)
        .resize({
          width: COMPARISON_SIZE,
          height: COMPARISON_SIZE,
          fit: "fill",
          kernel: "nearest",
        })
        .raw()
        .toBuffer({ resolveWithObject: true })
    const ref = await normalize(refPng)
    const sol = await normalize(solPng)
    if (ref.info.width !== sol.info.width || ref.info.height !== sol.info.height) {
      // After normalization this can only happen if one input was unreadable
      // as an image (sharp passed it through) — treat as a genuine capture
      // failure.
      return Infinity
    }
    const a = ref.data
    const b = sol.data
    let diff = 0
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) diff++
    }
    return (diff / a.length) * 100
  } catch {
    // sharp present but PNG unreadable — a genuine capture failure.
    return Infinity
  }
}

export async function copyAssets(assetDir: string, outDir: string): Promise<void> {
  // assetDir may be a full (relative) path like `../../artifacts/.../button`;
  // only its basename is the per-component subdirectory under assets/. Using the
  // full path would collapse the `..` segments and double the `artifacts/`
  // prefix (e.g. `artifacts/artifacts/shadcn-parity/button`), so the PNGs would
  // land in a stray tree instead of next to the report's "see assets/".
  const assetsRoot = join(outDir, "assets")
  const target = join(assetsRoot, basename(assetDir))
  await mkdir(target, { recursive: true })
  const { readdir } = await import("node:fs/promises")
  for (const f of await readdir(assetDir)) {
    await copyFile(join(assetDir, f), join(target, f))
  }
  await mkdir(assetsRoot, { recursive: true })
  await writeFile(join(assetsRoot, "COPYING"), `copied from ${assetDir}\n`)
}
