/**
 * tools/recipe-contract-schema — the canonical recipe definition (RECIPE-001c/001d).
 *
 * One definition per recipe. The CSS, Tailwind, and UnoCSS emitters (RECIPE-002/003/004)
 * each consume this shape and produce their profile's two emission forms from it, so a
 * definition is the only place a recipe's slots, variants, states, and tokens are stated.
 *
 * DESIGN DECISIONS ENCODED HERE
 *
 * 1. Declarations are token-referencing, not utility-class strings. The Tailwind emitter
 *    can map a declaration to a utility; it cannot mechanically invert `bg-primary/90`
 *    into a declaration. So the declaration is canonical and Tailwind output is generated.
 *
 * 2. Variants resolve per slot. A root-level variant may restyle a child part by naming
 *    that part in its declarations, which is what makes ancestor-state selectors
 *    unnecessary — see decision 3.
 *
 * 3. State is declared on the slot that carries it. There is no ancestor-state form,
 *    because the class-string emission forms cannot express one: Tailwind needs
 *    `group-data-*` and the UnoCSS preset appends selectors to the same element only.
 *    A root state that affects a child requires the primitive to emit `data-state` on
 *    the child, which every current primitive already supports.
 *
 * 4. Compound variants resolve by declaration order, last match winning. All emitters
 *    must apply the same order or the three outputs diverge on conflicting axes.
 *
 * 5. Variant and compound-variant styles may include per-part pseudo declarations.
 *    This keeps existing variant-specific interaction styling (for example Badge's
 *    distinct hover fills) canonical instead of forcing an emitter-time exception.
 *
 * Everything is JSON-representable so definitions can be serialised, snapshotted, and
 * eventually authored outside TypeScript.
 */
import type { SemanticFlagName } from "../packages/runtime/src/dom/semantic-vocabulary"

/** Bumped when the definition shape changes incompatibly. */
export const CONTRACT_VERSION = 1 as const

/**
 * Who renders and therefore owns a slot's element.
 *
 * - `recipe`   — the recipe's own wrapper renders it; full parity is expected.
 * - `consumer` — the consumer supplies it (repeatable items, optional titles). Styled but
 *                not rendered by the wrapper. Replaces `COMPOSED_PART_ALLOWLIST`.
 * - `adapter`  — an adapter owns the element's geometry via inline styles (positioning
 *                coordinates, virtualisation transforms). Exempt from parity assertions
 *                on the properties the adapter controls.
 */
export type SlotOwnership = "recipe" | "consumer" | "adapter"

/**
 * A declaration value.
 *
 * `{ token }` references a canonical identity from recipe-contract-tokens.ts; the emitter
 * substitutes the namespace spelling. A bare string is a literal (lengths, keywords,
 * timing) and must not encode a colour or radius that a token already covers.
 */
export type DeclarationValue = string | { token: string; fallback?: string }

/** CSS property → value. Property names are kebab-case CSS, not camelCase. */
export type Declarations = Readonly<Record<string, DeclarationValue>>

/**
 * A part's conditional style contribution in a variant or compound variant.
 * `base` applies whenever that variant matches; `pseudos` is evaluated on the same part.
 */
export interface VariantPartStyling {
  base?: Declarations
  pseudos?: Readonly<Record<string, Declarations>>
}

/**
 * Per-part styling used by variants and compound variants.
 *
 * The shorthand `part: { ...declarations }` remains valid for a base-only contribution.
 * Use `{ base, pseudos }` when an interaction style varies by variant.
 */
export type PartDeclarations = Readonly<Record<string, Declarations | VariantPartStyling>>

/** True when a part contribution uses the long-form conditional shape. */
export function isVariantPartStyling(
  styling: Declarations | VariantPartStyling,
): styling is VariantPartStyling {
  return "base" in styling || "pseudos" in styling
}

/**
 * Every declaration group in a variant/compound contribution, with a path describing
 * whether it is a base or pseudo declaration. Shared by traversal and validation.
 */
export function declarationGroupsForPartStyling(
  path: string,
  part: string,
  styling: Declarations | VariantPartStyling,
): Array<{ path: string; part: string; declarations: Declarations }> {
  if (!isVariantPartStyling(styling)) return [{ path, part, declarations: styling }]

  const groups: Array<{ path: string; part: string; declarations: Declarations }> = []
  if (styling.base) groups.push({ path: `${path}.base`, part, declarations: styling.base })
  for (const [pseudo, declarations] of Object.entries(styling.pseudos ?? {})) {
    groups.push({ path: `${path}.pseudos.${pseudo}`, part, declarations })
  }
  return groups
}

export interface RecipeSlot {
  /** `data-part` value. Unique within the definition. */
  part: string
  /** Element the slot renders, for emitter sanity checks and documentation. */
  element: string
  ownership: SlotOwnership
  /** Required unless ownership is `recipe`. Explains why the recipe does not render it. */
  ownershipReason?: string
  /** Required when ownership is `adapter`: the capability port that owns the geometry. */
  adapterPort?: string
  /** Properties the adapter controls, exempt from cross-profile parity assertions. */
  adapterOwnedProperties?: readonly string[]
  /** Unconditional declarations. */
  base: Declarations
  /** Keyed by a `data-state` value legal for this definition's scope. */
  states?: Readonly<Record<string, Declarations>>
  /** Keyed by a boolean flag name from the semantic vocabulary. */
  flags?: Readonly<Partial<Record<SemanticFlagName, Declarations>>>
  /** Keyed by pseudo-class or pseudo-element, e.g. `:hover`, `::after`. */
  pseudos?: Readonly<Record<string, Declarations>>
}

export interface RecipeVariantAxis {
  /** Axis name, e.g. `variant` or `size`. */
  name: string
  /** Value → per-part declarations. A value may restyle any slot in the definition. */
  values: Readonly<Record<string, PartDeclarations>>
}

export interface RecipeCompoundVariant {
  /** Axis name → value. Every axis and value must exist in `variants`. */
  when: Readonly<Record<string, string>>
  declarations: PartDeclarations
}

export interface RecipeDefinition {
  contractVersion: typeof CONTRACT_VERSION
  /** Must equal the primitive package name the recipe wraps. */
  scope: string
  /** Human-readable summary for generated documentation. */
  description: string
  slots: readonly RecipeSlot[]
  variants?: readonly RecipeVariantAxis[]
  /** Axis name → value. Must resolve to a declared value on every axis. */
  defaultVariants?: Readonly<Record<string, string>>
  /** Applied after single-axis variants, in declaration order, last match winning. */
  compoundVariants?: readonly RecipeCompoundVariant[]
}

// ─── Traversal helpers shared by the validator and the emitters ───────────────

/** Every declaration group in a definition, with a path describing where it came from. */
export function eachDeclarationGroup(
  definition: RecipeDefinition,
): Array<{ path: string; part: string; declarations: Declarations }> {
  const groups: Array<{ path: string; part: string; declarations: Declarations }> = []

  for (const slot of definition.slots) {
    groups.push({ path: `slots.${slot.part}.base`, part: slot.part, declarations: slot.base })
    for (const [state, declarations] of Object.entries(slot.states ?? {})) {
      groups.push({ path: `slots.${slot.part}.states.${state}`, part: slot.part, declarations })
    }
    for (const [flag, declarations] of Object.entries(slot.flags ?? {})) {
      groups.push({
        path: `slots.${slot.part}.flags.${flag}`,
        part: slot.part,
        declarations: declarations as Declarations,
      })
    }
    for (const [pseudo, declarations] of Object.entries(slot.pseudos ?? {})) {
      groups.push({ path: `slots.${slot.part}.pseudos.${pseudo}`, part: slot.part, declarations })
    }
  }

  for (const axis of definition.variants ?? []) {
    for (const [value, parts] of Object.entries(axis.values)) {
      for (const [part, styling] of Object.entries(parts)) {
        groups.push(
          ...declarationGroupsForPartStyling(
            `variants.${axis.name}.${value}.${part}`,
            part,
            styling,
          ),
        )
      }
    }
  }

  for (const [index, compound] of (definition.compoundVariants ?? []).entries()) {
    for (const [part, styling] of Object.entries(compound.declarations)) {
      groups.push(
        ...declarationGroupsForPartStyling(`compoundVariants[${index}].${part}`, part, styling),
      )
    }
  }

  return groups
}

/** Canonical token identities a definition references, sorted and deduplicated. */
export function referencedTokens(definition: RecipeDefinition): string[] {
  const tokens = new Set<string>()
  for (const { declarations } of eachDeclarationGroup(definition)) {
    for (const value of Object.values(declarations)) {
      if (typeof value === "object" && value !== null) tokens.add(value.token)
    }
  }
  return [...tokens].sort()
}

/** Slot lookup by `data-part`. */
export function slotFor(definition: RecipeDefinition, part: string): RecipeSlot | undefined {
  return definition.slots.find((slot) => slot.part === part)
}

/** Every `data-state` value a definition styles, across all slots. */
export function styledStates(definition: RecipeDefinition): string[] {
  return [...new Set(definition.slots.flatMap((slot) => Object.keys(slot.states ?? {})))].sort()
}

/** Cartesian product of every variant axis, used to check compound reachability. */
export function variantCombinations(definition: RecipeDefinition): Array<Record<string, string>> {
  return (definition.variants ?? []).reduce<Array<Record<string, string>>>(
    (combinations, axis) =>
      combinations.flatMap((combination) =>
        Object.keys(axis.values).map((value) => ({ ...combination, [axis.name]: value })),
      ),
    [{}],
  )
}
