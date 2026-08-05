/**
 * Semantic vocabulary — the single source of truth for the styling attribute surface.
 *
 * RECIPE-001b. Before this module the vocabulary was defined independently in four
 * places that disagreed: `applySemanticAttrs` (free-form `state: string`), the UnoCSS
 * preset's variant list, the recipe-contract audit's selector allowlist, and the
 * recipe stylesheets themselves. Everything that needs to know which attributes and
 * state values are legal now derives from here.
 *
 * Consumers:
 *   - `packages/unocss-preset` — generates one variant per flag and state value
 *   - `tools/audit-recipe-contract.ts` — allowlists selector attributes
 *   - `tools/recipe-contract-schema.ts` — validates recipe definitions
 *
 * `SCOPE_STATES` is descriptive, not aspirational: every entry was read out of the
 * primitive that emits it. Adding a state value to a primitive without adding it here
 * fails `tools/recipe-contract-vocabulary.test.ts`.
 */

/** Boolean flags a primitive may set. Presence is truthy; absent means omitted. */
export const SEMANTIC_FLAGS = [
  "disabled",
  "loading",
  "readonly",
  "required",
  "invalid",
  "placeholder",
  "highlighted",
  "selected",
] as const

export type SemanticFlagName = (typeof SEMANTIC_FLAGS)[number]

/** Legal `data-orientation` values. */
export const SEMANTIC_ORIENTATIONS = ["horizontal", "vertical"] as const

/** Legal `data-side` values, set directly by positioned overlays. */
export const SEMANTIC_SIDES = ["top", "right", "bottom", "left"] as const

/** Legal `data-size` values, set by composite scopes that expose a density scale. */
export const SEMANTIC_SIZES = ["sm", "base", "lg"] as const

/**
 * Legal `data-state` values per scope.
 *
 * Read from the `applySemanticAttrs({ state })` call sites in each primitive.
 * Scopes with no state declare an empty list. A scope absent from this map is unknown to
 * the recipe contract, so adding a primitive or state requires updating this vocabulary.
 */
export const SCOPE_STATES: Readonly<Record<string, readonly string[]>> = {
  accordion: ["open", "closed"],
  alert: ["info", "success", "warning", "error"],
  "alert-dialog": ["open", "closed"],
  badge: [],
  button: ["on", "off"],
  carousel: ["active", "inactive"],
  checkbox: ["checked", "unchecked", "indeterminate"],
  collapsible: ["open", "closed"],
  combobox: ["open", "closed", "checked", "unchecked"],
  "command-palette": ["open", "closed"],
  "context-menu": ["open", "closed", "checked", "unchecked"],
  "data-table": ["sorted-asc", "sorted-desc", "unsorted", "selected", "unselected"],
  "date-picker": ["open", "closed", "selected", "disabled"],
  dialog: ["open", "closed"],
  drawer: ["open", "closed"],
  "hover-card": ["open", "closed"],
  input: [],
  "input-otp": ["active", "inactive"],
  listbox: ["checked", "unchecked"],
  menu: ["open", "closed", "checked", "unchecked"],
  meter: ["safe", "caution", "danger"],
  "navigation-menu": ["open", "closed", "active"],
  popover: ["open", "closed"],
  progress: ["loading", "complete"],
  "radio-group": ["checked", "unchecked"],
  "resizable-panels": ["collapsed", "expanded"],
  select: ["open", "closed", "checked", "unchecked"],
  sheet: ["open", "closed"],
  switch: ["on", "off"],
  tabs: ["active", "inactive"],
  toast: [],
  toggle: ["on", "off"],
  "toggle-group": ["on", "off"],
  toolbar: ["on", "off"],
  tooltip: ["open", "closed"],
  tree: ["open", "closed", "selected", "unselected"],
}

/** Composite scopes that style a subtree of arbitrary HTML rather than named parts. */
export const COMPOSITE_SCOPES = ["prose", "typeset"] as const

/**
 * State values that duplicate a boolean flag or encode a compound value.
 *
 * These are shipped reality, kept legal so current primitives validate, and recorded
 * so they are not copied into new primitives. Each names the task that resolves it.
 */
export const VOCABULARY_EXCEPTIONS: Readonly<
  Record<string, { readonly reason: string; readonly resolvedBy: string }>
> = {
  "date-picker/disabled": {
    reason:
      'Emits state="disabled" where disabled is a boolean flag (data-disabled). A state and a flag encode the same condition on the same element.',
    resolvedBy: "PRIM-017",
  },
  "date-picker/selected": {
    reason:
      'Emits state="selected" alongside the data-selected boolean flag, so day selection is expressed twice on the same element.',
    resolvedBy: "PRIM-017",
  },
  "data-table/selected": {
    reason:
      'Emits state="selected" alongside the data-selected boolean flag, so row selection is expressed twice.',
    resolvedBy: "PRIM-016",
  },
  "data-table/unselected": {
    reason: 'Negative form of state="selected"; absence of the flag already means unselected.',
    resolvedBy: "PRIM-016",
  },
  "data-table/sorted-asc": {
    reason:
      "Compound state value encoding direction. A dedicated data-sort-direction attribute would be cleaner but is not yet in the vocabulary.",
    resolvedBy: "PRIM-016",
  },
  "data-table/sorted-desc": {
    reason: "See data-table/sorted-asc.",
    resolvedBy: "PRIM-016",
  },
  "progress/loading": {
    reason:
      'Emits state="loading" where loading is also a boolean flag (data-loading). Here it means "in progress" rather than "awaiting data", so the collision is semantic as well as syntactic.',
    resolvedBy: "PRIM-033",
  },
  "tree/selected": {
    reason: 'Emits state="selected" alongside the data-selected boolean flag.',
    resolvedBy: "PRIM-050",
  },
  "tree/unselected": {
    reason: 'Negative form of state="selected".',
    resolvedBy: "PRIM-050",
  },
}

/** Every attribute a recipe selector may target. */
export const SEMANTIC_ATTRIBUTES: readonly string[] = [
  "data-scope",
  "data-part",
  "data-state",
  "data-orientation",
  "data-side",
  "data-size",
  ...SEMANTIC_FLAGS.map((flag) => `data-${flag}`),
]

const ATTRIBUTE_SET = new Set(SEMANTIC_ATTRIBUTES)

/** True when `attribute` is part of the semantic vocabulary. */
export function isSemanticAttribute(attribute: string): boolean {
  return ATTRIBUTE_SET.has(attribute)
}

/** Scopes with a declared state vocabulary. */
export function isKnownScope(scope: string): boolean {
  return scope in SCOPE_STATES || (COMPOSITE_SCOPES as readonly string[]).includes(scope)
}

/** Declared state values for a scope; empty when the scope emits no state. */
export function statesForScope(scope: string): readonly string[] {
  return SCOPE_STATES[scope] ?? []
}

/** True when `state` is declared for `scope`. */
export function isKnownState(scope: string, state: string): boolean {
  return statesForScope(scope).includes(state)
}

/** Exception record for a scope/state pair, when one exists. */
export function vocabularyException(
  scope: string,
  state: string,
): { readonly reason: string; readonly resolvedBy: string } | undefined {
  return VOCABULARY_EXCEPTIONS[`${scope}/${state}`]
}

/** Every distinct state value across all scopes, sorted. */
export function allStateValues(): readonly string[] {
  return [...new Set(Object.values(SCOPE_STATES).flat())].sort()
}
