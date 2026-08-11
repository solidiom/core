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
export declare const SEMANTIC_FLAGS: readonly [
  "disabled",
  "loading",
  "readonly",
  "required",
  "invalid",
  "placeholder",
  "highlighted",
  "selected",
]
export type SemanticFlagName = (typeof SEMANTIC_FLAGS)[number]
/** Legal `data-orientation` values. */
export declare const SEMANTIC_ORIENTATIONS: readonly ["horizontal", "vertical"]
/** Legal `data-side` values, set directly by positioned overlays. */
export declare const SEMANTIC_SIDES: readonly ["top", "right", "bottom", "left"]
/** Legal `data-size` values, set by composite scopes that expose a density scale. */
export declare const SEMANTIC_SIZES: readonly ["sm", "base", "lg"]
/**
 * Legal `data-state` values per scope.
 *
 * Read from the `applySemanticAttrs({ state })` call sites in each primitive.
 * Scopes with no state declare an empty list. A scope absent from this map is unknown to
 * the recipe contract, so adding a primitive or state requires updating this vocabulary.
 */
export declare const SCOPE_STATES: Readonly<Record<string, readonly string[]>>
/** Composite scopes that style a subtree of arbitrary HTML rather than named parts. */
export declare const COMPOSITE_SCOPES: readonly ["prose", "typeset"]
/**
 * State values that duplicate a boolean flag or encode a compound value.
 *
 * These are shipped reality, kept legal so current primitives validate, and recorded
 * so they are not copied into new primitives. Each names the task that resolves it.
 */
export declare const VOCABULARY_EXCEPTIONS: Readonly<
  Record<
    string,
    {
      readonly reason: string
      readonly resolvedBy: string
      readonly resolution: string
    }
  >
>
/** Every attribute a recipe selector may target. */
export declare const SEMANTIC_ATTRIBUTES: readonly string[]
/** True when `attribute` is part of the semantic vocabulary. */
export declare function isSemanticAttribute(attribute: string): boolean
/** Scopes with a declared state vocabulary. */
export declare function isKnownScope(scope: string): boolean
/** Declared state values for a scope; empty when the scope emits no state. */
export declare function statesForScope(scope: string): readonly string[]
/** True when `state` is declared for `scope`. */
export declare function isKnownState(scope: string, state: string): boolean
/** Exception record for a scope/state pair, when one exists. */
export declare function vocabularyException(
  scope: string,
  state: string,
):
  | {
      readonly reason: string
      readonly resolvedBy: string
      readonly resolution: string
    }
  | undefined
/** Every distinct state value across all scopes, sorted. */
export declare function allStateValues(): readonly string[]
//# sourceMappingURL=semantic-vocabulary.d.ts.map
