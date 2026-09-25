import { mkdir, copyFile, writeFile } from "node:fs/promises"
import { join } from "node:path"
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
 * Signal 2 (behavior): read the `document.activeElement` role and which
 * declared part it belongs to, every `data-state` attribute in the page, and
 * the open flags from `aria-expanded` + Radix `data-state="open"` presence.
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
    const dataStates: Record<string, string> = {}
    for (const el of Array.from(document.querySelectorAll<HTMLElement>("[data-state]"))) {
      const key =
        `${el.tagName.toLowerCase()}.${el.getAttribute("data-part") ?? ""}.${el.className}`.trim()
      if (!(key in dataStates)) dataStates[key] = el.dataset.state ?? ""
    }
    const openFlags: Record<string, boolean> = {}
    for (const el of Array.from(
      document.querySelectorAll<HTMLElement>("[aria-expanded], [data-state='open']"),
    )) {
      const key =
        `${el.tagName.toLowerCase()}.${el.getAttribute("data-part") ?? ""}.${el.className}`.trim()
      openFlags[key] = el.getAttribute("aria-expanded") === "true" || el.dataset.state === "open"
    }
    return {
      activeElementRole: activeRole,
      activeElementPart: activePart,
      dataStates,
      openFlags,
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
  const selectors = Object.fromEntries(declaredParts.map((p) => [p, partSelector(p)]))
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
      await runInteractions(refPage, script)
      await runInteractions(solPage, script)
      await Promise.all([refPage.waitForTimeout(100), solPage.waitForTimeout(100)])

      // Signal 1: computed tokens.
      const [refTokens, solTokens] = await Promise.all([
        readComputedTokens(refPage, selectors, entry.tokens),
        readComputedTokens(solPage, selectors, entry.tokens),
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
        captureBehavior(refPage, selectors),
        captureBehavior(solPage, selectors),
      ])
      const behaviorPass =
        refBehavior.activeElementRole === solBehavior.activeElementRole &&
        refBehavior.activeElementPart === solBehavior.activeElementPart &&
        JSON.stringify(refBehavior.dataStates) === JSON.stringify(solBehavior.dataStates) &&
        JSON.stringify(refBehavior.openFlags) === JSON.stringify(solBehavior.openFlags)
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
      await screenshotPart(refPage, selectors, refPng)
      await screenshotPart(solPage, selectors, solPng)
      const diff = await pixelDiffPct(refPng, solPng)
      const pixelSignal = `pixels.${theme}.${state}`
      const pixelPass = diff <= entry.tolerance.pixelMaxPercent
      signals.push({
        signal: pixelSignal,
        expected: `≤ ${entry.tolerance.pixelMaxPercent}% diff`,
        actual: `delta ${diff}%`,
        verdict: verdictFor(pixelSignal, pixelPass),
      })

      // Drive both frames back to a known reset state for the next iteration.
      await runInteractions(refPage, "reset")
      await runInteractions(solPage, "reset")
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
  const states = Object.entries(b.dataStates)
    .map(([k, v]) => `${k}=${v}`)
    .join(" ")
  return `role=${b.activeElementRole} part=${b.activeElementPart ?? "-"} ${states}`.trim()
}

/**
 * Compare two PNGs. `sharp` is resolved at runtime via createRequire from the
 * repo root (it is a workspace devDependency); when it cannot be resolved the
 * fallback reports Infinity (a failing gap) rather than a false pass — pixel
 * signal degrades loudly, never silently green.
 */
async function pixelDiffPct(refPng: string, solPng: string): Promise<number> {
  try {
    const { createRequire } = await import("node:module")
    const req = createRequire(join(process.cwd(), "package.json"))
    type SharpRaw = { data: Buffer; info: { width: number; height: number } }
    const sharp = req("sharp") as (p: string) => {
      raw(): { toBuffer(opts?: { resolveWithObject?: boolean }): Promise<SharpRaw> }
    }
    const ref = await sharp(refPng).raw().toBuffer({ resolveWithObject: true })
    const sol = await sharp(solPng).raw().toBuffer({ resolveWithObject: true })
    if (ref.info.width !== sol.info.width || ref.info.height !== sol.info.height) {
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
    // sharp missing or unreadable PNG — treat as an unresolved gap.
    return Infinity
  }
}

export async function copyAssets(assetDir: string, outDir: string): Promise<void> {
  const target = join(outDir, "assets", assetDir)
  await mkdir(target, { recursive: true })
  const { readdir } = await import("node:fs/promises")
  for (const f of await readdir(assetDir)) {
    await copyFile(join(assetDir, f), join(target, f))
  }
  await writeFile(join(outDir, "assets", "COPYING"), `copied from ${assetDir}\n`)
}
