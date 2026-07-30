/**
 * tools/recipe-contract-validate — validates recipe definitions against the contract.
 *
 * RECIPE-001f. This is the check that makes the authoring rules in
 * docs/contracts/recipe-authoring-guide.md §3 enforceable rather than review-time conventions.
 *
 * Rules, each mapping to a guide section:
 *   §3.1 every emitted class is backed  → no variant value produces empty declarations
 *   §3.2 state on the part that carries it → no ancestor/descendant selectors in a definition
 *   §3.3 both forms cover the same surface → every variant value styles a declared slot
 *   §3.4 overlays style presence states  → open/closed styled when the scope has them
 *   §3.5 tokens are canonical            → every token reference resolves
 *   §3.6 the vocabulary is closed        → states and flags come from the vocabulary
 *   §3.7 exceptions carry a reason       → consumer/adapter slots justify themselves
 */
import {
  isKnownScope,
  isKnownState,
  statesForScope,
  SEMANTIC_FLAGS,
} from "../packages/runtime/src/dom/semantic-vocabulary"
import { isSemanticToken } from "./recipe-contract-tokens"
import {
  CONTRACT_VERSION,
  eachDeclarationGroup,
  slotFor,
  variantCombinations,
  type RecipeDefinition,
} from "./recipe-contract-schema"

export interface ContractViolation {
  /** Dotted path into the definition, for actionable messages. */
  path: string
  rule: string
  message: string
}

/**
 * Scopes that retain their content while closing through `createPresence` and therefore
 * need recipe-owned enter/exit treatment. `SCOPE_STATES` describes every value a
 * primitive emits; it must not be used as the presence list because controls such as
 * accordion, menu, and select unmount their content immediately when closed.
 */
const PRESENCE_SCOPES: ReadonlySet<string> = new Set([
  "alert-dialog",
  "command-palette",
  "date-picker",
  "dialog",
  "drawer",
  "navigation-menu",
  "popover",
  "sheet",
  "tooltip",
])

const PRESENCE_STATES = ["open", "closed"] as const

/** A selector combinator appearing in a part name means someone hand-wrote a selector. */
const SELECTOR_CHARACTERS = /[ >+~.#[\]:]/

const FLAG_NAMES: ReadonlySet<string> = new Set(SEMANTIC_FLAGS)

export function validateRecipeDefinition(definition: RecipeDefinition): ContractViolation[] {
  const violations: ContractViolation[] = []
  const fail = (path: string, rule: string, message: string): void => {
    violations.push({ path, rule, message })
  }

  // ── Envelope ───────────────────────────────────────────────────────────────
  if (definition.contractVersion !== CONTRACT_VERSION) {
    fail(
      "contractVersion",
      "envelope",
      `expected contractVersion ${CONTRACT_VERSION}, received ${String(definition.contractVersion)}`,
    )
  }
  if (!definition.description?.trim()) {
    fail("description", "envelope", "a definition needs a description for generated docs")
  }
  if (!isKnownScope(definition.scope)) {
    fail(
      "scope",
      "§3.6 closed vocabulary",
      `scope "${definition.scope}" is not in the semantic vocabulary — add it to SCOPE_STATES or correct the spelling`,
    )
  }

  // ── Slots ──────────────────────────────────────────────────────────────────
  if (definition.slots.length === 0) {
    fail("slots", "envelope", "a definition must declare at least one slot")
  }

  const seenParts = new Set<string>()
  for (const slot of definition.slots) {
    const at = `slots.${slot.part}`

    if (seenParts.has(slot.part)) {
      fail(at, "envelope", `duplicate slot for data-part="${slot.part}"`)
    }
    seenParts.add(slot.part)

    if (SELECTOR_CHARACTERS.test(slot.part)) {
      fail(
        at,
        "§3.2 no ancestor state",
        `part "${slot.part}" looks like a selector, not a data-part value — declare state on the slot that carries it instead of writing a combinator`,
      )
    }

    if (slot.ownership !== "recipe" && !slot.ownershipReason?.trim()) {
      fail(
        `${at}.ownershipReason`,
        "§3.7 documented exceptions",
        `ownership "${slot.ownership}" requires a reason explaining why the recipe does not render this part`,
      )
    }
    if (slot.ownership === "adapter" && !slot.adapterPort?.trim()) {
      fail(
        `${at}.adapterPort`,
        "§3.7 documented exceptions",
        "adapter-owned slots must name the capability port that controls their geometry",
      )
    }
    if (slot.ownership !== "adapter" && slot.adapterPort) {
      fail(
        `${at}.adapterPort`,
        "§3.7 documented exceptions",
        'adapterPort is only meaningful when ownership is "adapter"',
      )
    }

    // States must be legal for the scope.
    for (const state of Object.keys(slot.states ?? {})) {
      if (!isKnownState(definition.scope, state)) {
        const legal = statesForScope(definition.scope)
        fail(
          `${at}.states.${state}`,
          "§3.6 closed vocabulary",
          legal.length === 0
            ? `scope "${definition.scope}" emits no state, so it cannot be styled by state`
            : `"${state}" is not a state of "${definition.scope}" — legal values: ${legal.join(", ")}`,
        )
      }
    }

    // Flags must be vocabulary flags.
    for (const flag of Object.keys(slot.flags ?? {})) {
      if (!FLAG_NAMES.has(flag)) {
        fail(
          `${at}.flags.${flag}`,
          "§3.6 closed vocabulary",
          `"${flag}" is not a semantic flag — legal flags: ${SEMANTIC_FLAGS.join(", ")}`,
        )
      }
    }

    if (Object.keys(slot.base).length === 0 && !slot.states && !slot.flags && !slot.pseudos) {
      fail(at, "§3.1 backed declarations", "slot declares no styling at all")
    }
  }

  // ── Presence states ────────────────────────────────────────────────────────
  if (PRESENCE_SCOPES.has(definition.scope)) {
    const styled = new Set(definition.slots.flatMap((slot) => Object.keys(slot.states ?? {})))
    const missing = PRESENCE_STATES.filter((state) => !styled.has(state))
    if (missing.length > 0) {
      fail(
        "slots[].states",
        "§3.4 presence states",
        `scope "${definition.scope}" has an open/closed lifecycle but no slot styles ${missing.join(" or ")} — overlays without presence styling get no enter/exit treatment`,
      )
    }
  }

  // ── Variants ───────────────────────────────────────────────────────────────
  const axisNames = new Set<string>()
  for (const axis of definition.variants ?? []) {
    const at = `variants.${axis.name}`
    if (axisNames.has(axis.name)) fail(at, "envelope", `duplicate variant axis "${axis.name}"`)
    axisNames.add(axis.name)

    const values = Object.entries(axis.values)
    if (values.length === 0) fail(at, "envelope", "a variant axis needs at least one value")

    for (const [value, parts] of values) {
      const valueAt = `${at}.${value}`
      const partEntries = Object.entries(parts)
      if (partEntries.length === 0) {
        fail(
          valueAt,
          "§3.1 backed declarations",
          `variant value "${value}" produces no declarations — an emitted class with nothing behind it renders as the default`,
        )
      }
      for (const [part, declarations] of partEntries) {
        if (!slotFor(definition, part)) {
          fail(
            `${valueAt}.${part}`,
            "§3.3 matched coverage",
            `variant styles data-part="${part}", which is not a declared slot`,
          )
        }
        if (Object.keys(declarations).length === 0) {
          fail(
            `${valueAt}.${part}`,
            "§3.1 backed declarations",
            "declaration group is empty — remove it or give it declarations",
          )
        }
      }
    }
  }

  // ── Default variants ───────────────────────────────────────────────────────
  for (const [axis, value] of Object.entries(definition.defaultVariants ?? {})) {
    const declared = (definition.variants ?? []).find((candidate) => candidate.name === axis)
    if (!declared) {
      fail(`defaultVariants.${axis}`, "envelope", `no variant axis named "${axis}" is declared`)
      continue
    }
    if (!(value in declared.values)) {
      fail(
        `defaultVariants.${axis}`,
        "envelope",
        `"${value}" is not a value of axis "${axis}" — declared: ${Object.keys(declared.values).join(", ")}`,
      )
    }
  }
  for (const axis of definition.variants ?? []) {
    if (definition.defaultVariants && !(axis.name in definition.defaultVariants)) {
      fail(
        `defaultVariants.${axis.name}`,
        "envelope",
        `axis "${axis.name}" has no default, so emitters cannot resolve an unspecified value`,
      )
    }
  }

  // ── Compound variants ──────────────────────────────────────────────────────
  const combinations = variantCombinations(definition)
  const seenConditions = new Set<string>()
  for (const [index, compound] of (definition.compoundVariants ?? []).entries()) {
    const at = `compoundVariants[${index}]`
    const conditions = Object.entries(compound.when)

    if (conditions.length < 2) {
      fail(
        at,
        "envelope",
        "a compound variant must constrain at least two axes; use the single axis value otherwise",
      )
    }

    for (const [axis, value] of conditions) {
      const declared = (definition.variants ?? []).find((candidate) => candidate.name === axis)
      if (!declared) {
        fail(`${at}.when.${axis}`, "envelope", `no variant axis named "${axis}" is declared`)
      } else if (!(value in declared.values)) {
        fail(`${at}.when.${axis}`, "envelope", `"${value}" is not a value of axis "${axis}"`)
      }
    }

    const key = conditions
      .map(([axis, value]) => `${axis}=${value}`)
      .sort()
      .join("&")
    if (seenConditions.has(key)) {
      fail(
        at,
        "envelope",
        `duplicate compound condition ${key} — declaration order would decide the winner non-obviously`,
      )
    }
    seenConditions.add(key)

    const reachable = combinations.some((combination) =>
      conditions.every(([axis, value]) => combination[axis] === value),
    )
    if (!reachable && conditions.length > 0) {
      fail(at, "envelope", `condition ${key} can never match any combination of the declared axes`)
    }

    for (const [part, declarations] of Object.entries(compound.declarations)) {
      if (!slotFor(definition, part)) {
        fail(
          `${at}.${part}`,
          "§3.3 matched coverage",
          `compound variant styles data-part="${part}", which is not a declared slot`,
        )
      }
      if (Object.keys(declarations).length === 0) {
        fail(`${at}.${part}`, "§3.1 backed declarations", "declaration group is empty")
      }
    }
  }

  // ── Declarations and tokens ────────────────────────────────────────────────
  for (const { path, declarations } of eachDeclarationGroup(definition)) {
    for (const [property, value] of Object.entries(declarations)) {
      if (/[A-Z]/.test(property)) {
        fail(`${path}.${property}`, "envelope", "use kebab-case CSS property names, not camelCase")
      }
      if (typeof value === "object" && value !== null) {
        if (!isSemanticToken(value.token)) {
          fail(
            `${path}.${property}`,
            "§3.5 canonical tokens",
            `"${value.token}" is not a canonical token identity — add it to recipe-contract-tokens.ts under a THEME-001 decision, or reference an existing identity`,
          )
        }
      } else if (typeof value !== "string" || value.trim() === "") {
        fail(`${path}.${property}`, "envelope", "declaration value must be a non-empty string")
      }
    }
  }

  return violations
}

/** Formats violations for terminal output. */
export function formatViolations(scope: string, violations: ContractViolation[]): string {
  return violations
    .map(
      (violation) =>
        `  [${scope}] ${violation.path}\n      ${violation.rule}: ${violation.message}`,
    )
    .join("\n")
}
