import { afterEach, describe, expect, it } from "vitest"
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { auditRecipeParity, PROFILES } from "./audit-recipe-parity"
import { REFERENCE_DEFINITIONS } from "./recipe-contract-definitions"

const temporaryRoots: string[] = []

/**
 * Renders a minimal but complete stylesheet for `scope`, directly from the canonical
 * definition: one `[data-scope][data-part]` rule per slot, plus one
 * `[data-part][data-state]` rule per declared state. This is deliberately not styled
 * like a real emitted stylesheet — it only needs to satisfy `hasDataPart`/
 * `hasDataState`'s regexes, which is everything `auditRecipeParity` inspects.
 *
 * Building the fixture from `REFERENCE_DEFINITIONS` itself (rather than hand-writing
 * 13 stylesheets) guarantees the "clean" baseline is actually clean — it has exactly
 * the parts and states the tool expects — so each test's one deliberate omission is
 * the only signal in the diff.
 */
function renderCleanStylesheet(scope: string): string {
  const definition = REFERENCE_DEFINITIONS[scope]!
  const lines: string[] = []
  for (const slot of definition.slots) {
    lines.push(`[data-scope="${scope}"][data-part="${slot.part}"] { display: block; }`)
    for (const state of Object.keys(slot.states ?? {})) {
      lines.push(
        `[data-scope="${scope}"][data-part="${slot.part}"][data-state="${state}"] { opacity: 1; }`,
      )
    }
  }
  return lines.join("\n") + "\n"
}

function renderCleanVariantsModule(scope: string): string | undefined {
  const definition = REFERENCE_DEFINITIONS[scope]!
  if (!definition.variants || definition.variants.length === 0) return undefined
  return `export const ${scope}Variants = () => ""\n`
}

/** Every scope's clean `styles/<scope>.css` and, where applicable, `recipes/<scope>.variants.ts`. */
function cleanScopeFiles(): Record<string, string> {
  const files: Record<string, string> = {}
  for (const scope of Object.keys(REFERENCE_DEFINITIONS)) {
    files[`styles/${scope}.css`] = renderCleanStylesheet(scope)
    const variantsModule = renderCleanVariantsModule(scope)
    if (variantsModule) files[`recipes/${scope}.variants.ts`] = variantsModule
  }
  return files
}

/**
 * Builds a fixture workspace root with `packages/recipes-{css,tailwind,unocss}/src`
 * directories. Every profile gets the same clean file set from `cleanScopeFiles()`
 * unless `overrides` supplies a full replacement file set for that profile.
 */
function createWorkspace(
  overrides: Partial<Record<(typeof PROFILES)[number], Record<string, string>>> = {},
): string {
  const root = mkdtempSync(join(tmpdir(), "solidiom-recipe-parity-"))
  temporaryRoots.push(root)
  const clean = cleanScopeFiles()
  for (const profile of PROFILES) {
    const profileFiles = overrides[profile] ?? clean
    for (const [relativePath, content] of Object.entries(profileFiles)) {
      const destination = join(root, "packages", profile, "src", relativePath)
      mkdirSync(join(destination, ".."), { recursive: true })
      writeFileSync(destination, content, "utf8")
    }
  }
  return root
}

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true })
  }
})

describe("auditRecipeParity", () => {
  it("passes on a workspace that mirrors every profile identically", () => {
    const root = createWorkspace()
    expect(auditRecipeParity(root)).toEqual([])
  })

  it("rejects a slot missing from one profile's stylesheet (rule 1: coverage)", () => {
    const files = cleanScopeFiles()
    files["styles/dialog.css"] = files["styles/dialog.css"]!.replace(
      /\[data-scope="dialog"\]\[data-part="close"\][^\n]*\n/,
      "",
    )
    const root = createWorkspace({ "recipes-css": files })
    const errors = auditRecipeParity(root)
    expect(errors).toContainEqual(
      expect.objectContaining({
        profile: "recipes-css",
        scope: "dialog",
        message: expect.stringContaining('no [data-part="close"] rule'),
      }),
    )
  })

  it("rejects a state missing from one profile's stylesheet (rule 1: coverage)", () => {
    const files = cleanScopeFiles()
    files["styles/button.css"] = files["styles/button.css"]!.replace(
      /\[data-scope="button"\]\[data-part="root"\]\[data-state="off"\][^\n]*\n/,
      "",
    )
    const root = createWorkspace({ "recipes-tailwind": files })
    const errors = auditRecipeParity(root)
    expect(errors).toContainEqual(
      expect.objectContaining({
        profile: "recipes-tailwind",
        scope: "button",
        message: expect.stringContaining('no [data-state="off"] rule'),
      }),
    )
  })

  it("rejects a missing .variants.ts for a scope that declares a variants axis (rule 2)", () => {
    const files = cleanScopeFiles()
    delete files["recipes/button.variants.ts"]
    const root = createWorkspace({ "recipes-unocss": files })
    const errors = auditRecipeParity(root)
    expect(errors).toContainEqual(
      expect.objectContaining({
        profile: "recipes-unocss",
        scope: "button",
        message: expect.stringContaining("does not exist"),
      }),
    )
  })

  it("rejects a .variants.ts present for a scope with no variants axis (rule 2)", () => {
    const files = cleanScopeFiles()
    // dialog has no variants axis in the canonical definition
    files["recipes/dialog.variants.ts"] = `export const dialogVariants = () => ""\n`
    const root = createWorkspace({ "recipes-css": files })
    const errors = auditRecipeParity(root)
    expect(errors).toContainEqual(
      expect.objectContaining({
        profile: "recipes-css",
        scope: "dialog",
        message: expect.stringContaining("declares no variants axis"),
      }),
    )
  })

  it("rejects an adapter-owned property declared in the recipe's own ruleset (rule 3)", () => {
    // popover's "content" slot is ownership: "adapter" with "position" among its
    // adapterOwnedProperties — declaring it in the recipe's own rule must be rejected.
    const files = cleanScopeFiles()
    files["styles/popover.css"] = files["styles/popover.css"]!.replace(
      '[data-scope="popover"][data-part="content"] { display: block; }',
      '[data-scope="popover"][data-part="content"] { display: block; position: absolute; }',
    )
    const root = createWorkspace({ "recipes-css": files })
    const errors = auditRecipeParity(root)
    expect(errors).toContainEqual(
      expect.objectContaining({
        profile: "recipes-css",
        scope: "popover",
        message: expect.stringContaining("adapter-owned properties must be exempt"),
      }),
    )
  })

  it("does not flag a consumer-owned slot that is styled but not rendered (contract §5)", () => {
    // dialog's "close" slot is ownership: "consumer" — styled in every profile's
    // fixture CSS by cleanScopeFiles(), and must not be reported as any kind of error.
    const root = createWorkspace()
    const errors = auditRecipeParity(root)
    expect(errors.filter((e) => e.scope === "dialog" && e.message.includes("close"))).toEqual([])
  })

  it("rejects a slot styled in two profiles but missing from a third (rule 4: cross-profile parity)", () => {
    const files = cleanScopeFiles()
    files["styles/dialog.css"] = files["styles/dialog.css"]!.replace(
      /\[data-scope="dialog"\]\[data-part="close"\][^\n]*\n/,
      "",
    )
    const root = createWorkspace({ "recipes-unocss": files })
    const errors = auditRecipeParity(root)
    expect(errors).toContainEqual(
      expect.objectContaining({
        profile: "all",
        scope: "dialog",
        message: expect.stringContaining("profiles must cover the same slots"),
      }),
    )
  })

  it("rejects a state styled in two profiles but missing from a third (rule 4: cross-profile parity)", () => {
    const files = cleanScopeFiles()
    files["styles/dialog.css"] = files["styles/dialog.css"]!.replace(
      /\[data-scope="dialog"\]\[data-part="backdrop"\]\[data-state="closed"\][^\n]*\n/,
      "",
    )
    const root = createWorkspace({ "recipes-unocss": files })
    const errors = auditRecipeParity(root)
    expect(errors).toContainEqual(
      expect.objectContaining({
        profile: "all",
        scope: "dialog",
        message: expect.stringContaining("profiles must cover the same states"),
      }),
    )
  })

  it("distinguishes state coverage per-slot when two slots share a state name", () => {
    // dialog's "backdrop" and "content" both declare "closed" — removing only
    // backdrop's rule must still be caught, even though content's "closed" rule
    // (a different slot, same state name) remains in the same stylesheet.
    const files = cleanScopeFiles()
    files["styles/dialog.css"] = files["styles/dialog.css"]!.replace(
      /\[data-scope="dialog"\]\[data-part="backdrop"\]\[data-state="closed"\][^\n]*\n/,
      "",
    )
    const root = createWorkspace({ "recipes-css": files })
    const errors = auditRecipeParity(root)
    expect(errors).toContainEqual(
      expect.objectContaining({
        profile: "recipes-css",
        scope: "dialog",
        message: expect.stringContaining('slot "backdrop" declares state "closed"'),
      }),
    )
    // content's own "closed" coverage must remain unaffected.
    expect(errors).not.toContainEqual(
      expect.objectContaining({
        message: expect.stringContaining('slot "content" declares state "closed"'),
      }),
    )
  })

  it("reports a missing stylesheet as undeclared rather than silently skipping the scope", () => {
    const files = cleanScopeFiles()
    delete files["styles/button.css"]
    delete files["recipes/button.variants.ts"]
    const root = createWorkspace({ "recipes-css": files })
    const errors = auditRecipeParity(root)
    expect(errors).toContainEqual(
      expect.objectContaining({
        profile: "recipes-css",
        scope: "button",
        message: expect.stringContaining("is undeclared in this profile"),
      }),
    )
  })
})
