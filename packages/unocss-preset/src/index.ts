/**
 * @solidiom/unocss-preset — UnoCSS variants for the Solidiom semantic attribute surface.
 *
 * Variants are generated from `@solidiom/runtime`'s semantic vocabulary rather than a
 * hand-maintained list, so the preset cannot drift from what primitives actually emit
 * (RECIPE-001b). Previously this file declared 11 variants by hand and was missing
 * `readonly` and `loading` entirely.
 *
 * Generated variants:
 *   - one per boolean flag — `uiDisabled` → `[data-disabled]`
 *   - one per distinct `data-state` value — `uiOpen` → `[data-state='open']`
 *   - one per orientation and side — `uiVertical`, `uiSideTop`
 *
 * Every variant matches on the element itself. UnoCSS cannot express an ancestor's
 * state, which is why the recipe contract requires each part to carry its own
 * `data-state` (docs/recipe-authoring-guide.md §3.2).
 */
import {
  SEMANTIC_FLAGS,
  SEMANTIC_ORIENTATIONS,
  SEMANTIC_SIDES,
  allStateValues,
} from "@solidiom/runtime"

export interface SolidiomPresetOptions {
  /** Prefix for variant names. Default: "ui". */
  prefix?: string
}

/** Variant definitions mapping variant name to CSS selector. */
export interface VariantDefinition {
  name: string
  selector: string
}

/** `data-state` values that collide with a boolean flag of the same name. */
const FLAG_NAMES: ReadonlySet<string> = new Set(SEMANTIC_FLAGS)

/** `sorted-asc` → `SortedAsc` */
function pascalCase(value: string): string {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")
}

/**
 * Returns the Solidiom UnoCSS preset variant definitions.
 *
 * A state value that collides with a boolean flag (`disabled`, `loading`, `selected`)
 * is namespaced as `uiStateSelected` so the bare `uiSelected` keeps targeting the
 * flag. Those collisions are the vocabulary exceptions recorded in
 * `VOCABULARY_EXCEPTIONS`; when the owning primitives stop emitting a flag as a
 * state, the namespaced variants disappear on their own.
 */
export function getSolidiomVariants(options: SolidiomPresetOptions = {}): VariantDefinition[] {
  const p = options.prefix ?? "ui"

  const flagVariants = SEMANTIC_FLAGS.map((flag) => ({
    name: `${p}${pascalCase(flag)}`,
    selector: `[data-${flag}]`,
  }))

  const stateVariants = allStateValues().map((state) => ({
    name: FLAG_NAMES.has(state) ? `${p}State${pascalCase(state)}` : `${p}${pascalCase(state)}`,
    selector: `[data-state='${state}']`,
  }))

  const orientationVariants = SEMANTIC_ORIENTATIONS.map((orientation) => ({
    name: `${p}${pascalCase(orientation)}`,
    selector: `[data-orientation='${orientation}']`,
  }))

  const sideVariants = SEMANTIC_SIDES.map((side) => ({
    name: `${p}Side${pascalCase(side)}`,
    selector: `[data-side='${side}']`,
  }))

  return [...flagVariants, ...stateVariants, ...orientationVariants, ...sideVariants]
}

/**
 * Creates the UnoCSS preset object (compatible with UnoCSS defineConfig).
 */
export function presetSolidiom(options: SolidiomPresetOptions = {}) {
  const variants = getSolidiomVariants(options)
  return {
    name: "@solidiom/unocss-preset",
    variants: variants.map((v) => ({
      name: v.name,
      match: (input: string) => {
        if (!input.startsWith(`${v.name}:`)) return undefined
        return {
          matcher: input.slice(v.name.length + 1),
          selector: (s: string) => `${s}${v.selector}`,
        }
      },
    })),
  }
}
