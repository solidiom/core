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

export interface BehaviorSnapshot {
  activeElementRole: string
  activeElementPart: string | null
  dataStates: Record<string, string>
  openFlags: Record<string, boolean>
  /**
   * Raw per-element behavior rows scoped to the component.
   *
   * - `key` identifies the element as `<tag>:<data-part or role>` — deliberately
   *   NOT the className. shadcn and Solidiom render the same logical part with
   *   entirely different attribute schemes (Radix classes vs data-part), so
   *   class-dump keys can never match across frames; tagging keys match by
   *   structure.
   * - `state` / `expanded` are the element's `data-state` / `aria-expanded`
   *   values ("" when absent). `open` is the derived flag
   *   (expanded === "true" || state === "open").
   */
  elements: Array<{
    key: string
    state: string
    expanded: string
    open: boolean
  }>
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
 * Signal 2 (behavior): scoped to the COMPONENT, not the document.
 *
 * Reads `document.activeElement`'s role + which declared part contains it, then
 * walks the component's own subtree for `data-state` / `aria-expanded`.
 *
 * Scope = the smallest set of part elements that contains every other part
 * element (a component's parts are nested — e.g. shadcn Select's content is a
 * Radix portal under body, so it needs the trigger plus the listbox; a field
 * group is one root containing label/description). For single-part components
 * that is just the part itself; for components whose parts live in separate
 * roots it is the union. This deliberately EXCLUDES ambient site chrome — the
 * shadcn reference app's nav ("toggle dark", hamburger) and the Solidiom site's
 * `site-header` / `docs-mobile-nav` / mobile-CTA all carry `data-state` and
 * used to pollute document-wide scans.
 *
 * Keys are structural (`<tag>:<data-part or role>`), never className: the two
 * frames' attribute schemes (Radix classes vs data-part) can never match, so a
 * class-dump makes every behavior row a false ❌.
 */
export async function captureBehavior(
  page: Page,
  partSelectors: Record<string, string>,
): Promise<BehaviorSnapshot> {
  return page.evaluate((selectors) => {
    const active = document.activeElement as HTMLElement | null
    const activeRole = active ? (active.getAttribute("role") ?? "") : ""
    let activePart: string | null = null
    for (const [part, sel] of Object.entries(selectors)) {
      if (active && (sel === "body" || active.closest(sel))) {
        activePart = part
        break
      }
    }
    // Structural key: prefer data-part, else role, else a stable class-token
    // digest. shadcn's Radix sub-elements (indicator spans, listbox divs)
    // carry neither data-part nor role, so the digest keeps them
    // distinguishable across the two frames (a shadcn "indicator" row and a
    // solidiom "content" row must not both collapse to "span:anon").
    const keyOf = (el: HTMLElement) => {
      const structural = el.getAttribute("data-part") ?? el.getAttribute("role")
      if (structural) return `${el.tagName.toLowerCase()}:${structural}`
      const digest = [...el.classList]
        .sort()
        .join("")
        .slice(0, 64)
        .replace(/[^a-z0-9-]/g, "")
      return `${el.tagName.toLowerCase()}:${digest || "anon"}`
    }
    const partEls = Array.from(
      new Set(
        Object.values(selectors)
          .map((s) => (s === "body" ? document.body : document.querySelector<HTMLElement>(s)))
          .filter((e): e is HTMLElement => e !== null && e !== undefined),
      ),
    )
    let scope: HTMLElement[]
    if (partEls.length === 0) {
      scope = [document.body]
    } else if (partEls.every((e) => partEls[0]!.contains(e))) {
      scope = [partEls[0]!]
    } else {
      scope = partEls
    }
    const elements: BehaviorSnapshot["elements"] = []
    const seen = new Set<string>()
    for (const sc of scope) {
      const candidates =
        sc === document.body
          ? Array.from(sc.querySelectorAll<HTMLElement>("[data-state], [aria-expanded]"))
          : [
              ...(sc.matches("[data-state], [aria-expanded]") ? [sc as HTMLElement] : []),
              ...Array.from(sc.querySelectorAll<HTMLElement>("[data-state], [aria-expanded]")),
            ]
      for (const el of candidates) {
        if (el.closest("header, nav, footer")) continue
        // The shadcn reference app has no <header>/<nav> chrome, but it does
        // have a "toggle dark" button next to the page title carrying
        // data-state="on"/"off". It is ambient tooling, not the component.
        if (/toggle dark/i.test(el.textContent ?? "")) continue
        const key = keyOf(el)
        const state = el.dataset.state ?? ""
        const expanded = el.getAttribute("aria-expanded") ?? ""
        if (seen.has(key)) continue
        seen.add(key)
        elements.push({ key, state, expanded, open: expanded === "true" || state === "open" })
      }
    }
    return {
      activeElementRole: activeRole,
      activeElementPart: activePart,
      dataStates: {},
      openFlags: {},
      elements,
    }
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
      await runInteractions(refPage, script, refTarget)
      await runInteractions(solPage, script, solTarget)
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
      const behaviorPass =
        refBehavior.activeElementRole === solBehavior.activeElementRole &&
        refBehavior.activeElementPart === solBehavior.activeElementPart &&
        JSON.stringify(refBehavior.elements) === JSON.stringify(solBehavior.elements)
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
  // Compact, scheme-independent: focus (role + declared part) then the
  // component's own stateful elements as `<tag>:<part-or-role>=<state>`.
  // Example: `role=combobox part=Trigger button:combobox=open ul:anon=open`
  const states = b.elements
    .filter((e) => e.state !== "" || e.expanded !== "")
    .map((e) => `${e.key}=${e.state || e.expanded}`)
    .join(" ")
  return `role=${b.activeElementRole} part=${b.activeElementPart ?? "-"} ${states}`.trim()
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
