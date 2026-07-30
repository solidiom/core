import { describe, expect, it } from "vitest"
import { existsSync, readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"
import {
  SCOPE_STATES,
  SEMANTIC_ATTRIBUTES,
  SEMANTIC_FLAGS,
  VOCABULARY_EXCEPTIONS,
  allStateValues,
  isKnownScope,
  isKnownState,
  isSemanticAttribute,
  statesForScope,
  vocabularyException,
} from "../packages/runtime/src/dom/semantic-vocabulary"
import { getSolidiomVariants } from "../packages/unocss-preset/src/index"

const ROOT = join(import.meta.dirname ?? __dirname, "..")
const PACKAGES = join(ROOT, "packages")

/** Every non-test .tsx under a package's src/. */
function sourceFiles(packageDir: string): string[] {
  const src = join(packageDir, "src")
  if (!existsSync(src)) return []
  const walk = (dir: string): string[] =>
    readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const full = join(dir, entry.name)
      if (entry.isDirectory()) return walk(full)
      if (!entry.name.endsWith(".tsx")) return []
      if (entry.name.includes(".test.") || entry.name.includes(".browser.")) return []
      return [full]
    })
  return walk(src)
}

/**
 * Scope declared by a primitive source file, read from its applySemanticAttrs calls.
 * Files without a scope emit no semantic attributes.
 */
function scopesIn(source: string): string[] {
  return [...new Set([...source.matchAll(/scope:\s*"([a-z-]+)"/g)].map((match) => match[1]!))]
}

/**
 * State string literals passed to applySemanticAttrs.
 *
 * Line-scoped on purpose: every current call site fits on one line after formatting.
 * Computed states (`state: state()`) contribute no literal here — those are covered by
 * the per-scope declarations in SCOPE_STATES, which were read from the accessor bodies.
 *
 * Comparison operands are stripped first, so `cond !== "none" ? … : "unsorted"` yields
 * only the emitted value.
 */
function stateLiteralsIn(source: string): string[] {
  return [
    ...new Set(
      [...source.matchAll(/state:\s*([^\n]+)/g)].flatMap((match) =>
        [...match[1]!.replace(/[!=]==?\s*"[^"]*"/g, "").matchAll(/"([a-z][a-z-]*)"/g)].map(
          (literal) => literal[1]!,
        ),
      ),
    ),
  ]
}

const primitives = readdirSync(PACKAGES, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => ({ name: entry.name, dir: join(PACKAGES, entry.name) }))
  .map(({ name, dir }) => ({
    name,
    sources: sourceFiles(dir).map((file) => readFileSync(file, "utf8")),
  }))
  .filter(({ sources }) => sources.some((source) => source.includes("applySemanticAttrs")))

describe("semantic vocabulary shape", () => {
  it("covers every primitive that emits semantic attributes", () => {
    expect(primitives.length).toBeGreaterThan(30)
  })

  it("declares a flag attribute for every boolean flag", () => {
    for (const flag of SEMANTIC_FLAGS) {
      expect(isSemanticAttribute(`data-${flag}`), `data-${flag} missing`).toBe(true)
    }
  })

  it("rejects attributes applySemanticAttrs cannot emit", () => {
    expect(isSemanticAttribute("data-value")).toBe(false)
    expect(isSemanticAttribute("data-theme")).toBe(false)
  })

  it("has no duplicate state values within a scope", () => {
    for (const [scope, states] of Object.entries(SCOPE_STATES)) {
      expect(new Set(states).size, `${scope} repeats a state`).toBe(states.length)
    }
  })

  it("keeps SEMANTIC_ATTRIBUTES free of duplicates", () => {
    expect(new Set(SEMANTIC_ATTRIBUTES).size).toBe(SEMANTIC_ATTRIBUTES.length)
  })
})

describe("vocabulary matches what primitives emit", () => {
  it("declares every scope that calls applySemanticAttrs", () => {
    const undeclared: string[] = []
    for (const { name, sources } of primitives) {
      for (const scope of sources.flatMap(scopesIn)) {
        // Scopes that emit no state are legitimately absent from SCOPE_STATES; they are
        // only undeclared if they also emit a state literal.
        const emitsState = sources.some((source) => stateLiteralsIn(source).length > 0)
        if (emitsState && !isKnownScope(scope)) undeclared.push(`${name}: ${scope}`)
      }
    }
    expect(undeclared, "add these scopes to SCOPE_STATES").toEqual([])
  })

  it("declares every state literal a primitive passes", () => {
    const unknown: string[] = []
    for (const { sources } of primitives) {
      for (const source of sources) {
        const scopes = scopesIn(source)
        const literals = stateLiteralsIn(source)
        if (scopes.length !== 1) continue // multi-scope file: attribute per-scope ambiguously
        const scope = scopes[0]!
        for (const state of literals) {
          if (!isKnownState(scope, state)) unknown.push(`${scope}/${state}`)
        }
      }
    }
    expect(unknown, "add these to SCOPE_STATES in semantic-vocabulary.ts").toEqual([])
  })
})

describe("recorded vocabulary exceptions", () => {
  it("references a declared scope and state", () => {
    for (const key of Object.keys(VOCABULARY_EXCEPTIONS)) {
      const [scope, state] = key.split("/") as [string, string]
      expect(isKnownScope(scope), `${key}: unknown scope`).toBe(true)
      expect(statesForScope(scope), `${key}: state not declared`).toContain(state)
    }
  })

  it("gives every exception a reason and an owning task", () => {
    for (const [key, entry] of Object.entries(VOCABULARY_EXCEPTIONS)) {
      expect(entry.reason.length, `${key} needs a reason`).toBeGreaterThan(20)
      expect(entry.resolvedBy, `${key} needs an owning task`).toMatch(/^(PRIM|RECIPE|THEME)-\d+$/)
    }
  })

  it("records every state value that duplicates a boolean flag", () => {
    const flags = new Set<string>(SEMANTIC_FLAGS)
    for (const [scope, states] of Object.entries(SCOPE_STATES)) {
      for (const state of states) {
        if (!flags.has(state)) continue
        expect(
          vocabularyException(scope, state),
          `${scope} emits "${state}" as a state and as a flag — record it in VOCABULARY_EXCEPTIONS`,
        ).toBeDefined()
      }
    }
  })
})

describe("UnoCSS preset derives from the vocabulary", () => {
  const variants = getSolidiomVariants()
  const names = new Set(variants.map((variant) => variant.name))

  it("emits one variant per boolean flag", () => {
    for (const flag of SEMANTIC_FLAGS) {
      const expected = `ui${flag.charAt(0).toUpperCase()}${flag.slice(1)}`
      expect(names.has(expected), `${expected} missing — flag ${flag} has no variant`).toBe(true)
    }
  })

  it("covers readonly and loading, which the hand-written list omitted", () => {
    expect(names.has("uiReadonly")).toBe(true)
    expect(names.has("uiLoading")).toBe(true)
  })

  it("emits one variant per distinct state value", () => {
    expect(variants.filter((variant) => variant.selector.startsWith("[data-state="))).toHaveLength(
      allStateValues().length,
    )
  })

  it("preserves the previously published variant names", () => {
    for (const name of [
      "uiOpen",
      "uiClosed",
      "uiChecked",
      "uiUnchecked",
      "uiActive",
      "uiDisabled",
      "uiHighlighted",
      "uiSelected",
      "uiRequired",
      "uiInvalid",
      "uiPlaceholder",
    ]) {
      expect(names.has(name), `${name} was published and must keep working`).toBe(true)
    }
  })

  it("namespaces a state value that collides with a flag", () => {
    // `selected` is both a flag and a state; the bare variant stays with the flag.
    expect(variants.find((variant) => variant.name === "uiSelected")?.selector).toBe(
      "[data-selected]",
    )
    expect(variants.find((variant) => variant.name === "uiStateSelected")?.selector).toBe(
      "[data-state='selected']",
    )
  })

  it("generates unique variant names", () => {
    expect(names.size).toBe(variants.length)
  })

  it("honours a custom prefix", () => {
    expect(getSolidiomVariants({ prefix: "sol" }).every((v) => v.name.startsWith("sol"))).toBe(true)
  })
})
