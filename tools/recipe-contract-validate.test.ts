import { describe, expect, it } from "vitest"
import { COMPOSED_PART_ALLOWLIST } from "./audit-recipe-dual-emission"
import {
  CONTRACT_VERSION,
  referencedTokens,
  styledStates,
  variantCombinations,
  type RecipeDefinition,
} from "./recipe-contract-schema"
import { REFERENCE_DEFINITIONS, buttonRecipe, dialogRecipe } from "./recipe-contract-definitions"
import { validateRecipeDefinition } from "./recipe-contract-validate"

/** Minimal valid definition for a scope with no presence lifecycle. */
function base(overrides: Partial<RecipeDefinition> = {}): RecipeDefinition {
  return {
    contractVersion: CONTRACT_VERSION,
    scope: "switch",
    description: "Fixture.",
    slots: [
      {
        part: "root",
        element: "button",
        ownership: "recipe",
        base: { display: "inline-flex" },
      },
    ],
    ...overrides,
  }
}

function rules(definition: RecipeDefinition): string[] {
  return validateRecipeDefinition(definition).map((violation) => violation.rule)
}

function messages(definition: RecipeDefinition): string {
  return validateRecipeDefinition(definition)
    .map((violation) => `${violation.path} ${violation.message}`)
    .join("\n")
}

describe("reference definitions", () => {
  it("validate clean", () => {
    for (const [scope, definition] of Object.entries(REFERENCE_DEFINITIONS)) {
      expect(validateRecipeDefinition(definition), `${scope} must validate`).toEqual([])
    }
  })

  it("button backs every variant value with declarations", () => {
    // The defect being fixed: recipes-css emits 11 solidiom-btn--* classes with no
    // definitions, so a variant selection has no visual effect.
    for (const axis of buttonRecipe.variants ?? []) {
      for (const [value, parts] of Object.entries(axis.values)) {
        const declarations = Object.values(parts).flatMap((group) => Object.keys(group))
        expect(declarations.length, `${axis.name}=${value} declares nothing`).toBeGreaterThan(0)
      }
    }
  })

  it("switch declares thumb state on the thumb slot", () => {
    const thumb = REFERENCE_DEFINITIONS.switch!.slots.find((slot) => slot.part === "thumb")
    expect(Object.keys(thumb?.states ?? {})).toEqual(["on", "off"])
  })

  it("dialog styles both presence states", () => {
    expect(styledStates(dialogRecipe)).toEqual(["closed", "open"])
  })

  it("dialog records its consumer-owned slot with a reason", () => {
    const close = dialogRecipe.slots.find((slot) => slot.part === "close")
    expect(close?.ownership).toBe("consumer")
    expect(close?.ownershipReason?.length ?? 0).toBeGreaterThan(20)
  })
})

describe("envelope rules", () => {
  it("rejects a wrong contract version", () => {
    expect(messages(base({ contractVersion: 99 as never }))).toContain("contractVersion")
  })

  it("rejects a missing description", () => {
    expect(messages(base({ description: "  " }))).toContain("description")
  })

  it("rejects a definition with no slots", () => {
    expect(messages(base({ slots: [] }))).toContain("at least one slot")
  })

  it("rejects duplicate slots", () => {
    const slot = {
      part: "root",
      element: "button",
      ownership: "recipe" as const,
      base: { display: "block" },
    }
    expect(messages(base({ slots: [slot, slot] }))).toContain("duplicate slot")
  })

  it("rejects a slot that declares no styling", () => {
    expect(
      messages(base({ slots: [{ part: "root", element: "div", ownership: "recipe", base: {} }] })),
    ).toContain("no styling at all")
  })

  it("rejects camelCase declaration properties", () => {
    expect(
      messages(
        base({
          slots: [
            { part: "root", element: "div", ownership: "recipe", base: { borderRadius: "4px" } },
          ],
        }),
      ),
    ).toContain("kebab-case")
  })
})

describe("§3.2 no ancestor state", () => {
  it("rejects a part name containing a selector combinator", () => {
    expect(
      rules(
        base({
          slots: [
            {
              part: 'root[data-state="on"] .thumb',
              element: "span",
              ownership: "recipe",
              base: { transform: "none" },
            },
          ],
        }),
      ),
    ).toContain("§3.2 no ancestor state")
  })
})

describe("§3.6 closed vocabulary", () => {
  it("rejects an unknown scope", () => {
    expect(rules(base({ scope: "fancy-widget" }))).toContain("§3.6 closed vocabulary")
  })

  it("rejects a state that is not declared for the scope", () => {
    expect(
      messages(
        base({
          slots: [
            {
              part: "root",
              element: "button",
              ownership: "recipe",
              base: { display: "block" },
              states: { open: { opacity: "1" } },
            },
          ],
        }),
      ),
    ).toContain('"open" is not a state of "switch"')
  })

  it("rejects a flag outside the vocabulary", () => {
    expect(
      messages(
        base({
          slots: [
            {
              part: "root",
              element: "button",
              ownership: "recipe",
              base: { display: "block" },
              flags: { hovered: { opacity: "1" } } as never,
            },
          ],
        }),
      ),
    ).toContain("is not a semantic flag")
  })
})

describe("§3.4 presence states", () => {
  it("rejects an overlay recipe that styles neither open nor closed", () => {
    const withoutPresence: RecipeDefinition = {
      contractVersion: CONTRACT_VERSION,
      scope: "dialog",
      description: "Fixture.",
      slots: [
        { part: "content", element: "div", ownership: "recipe", base: { position: "fixed" } },
      ],
    }
    expect(messages(withoutPresence)).toContain("open/closed lifecycle")
  })

  it("accepts a scope with no presence lifecycle", () => {
    expect(rules(base())).toEqual([])
  })
})

describe("§3.5 canonical tokens", () => {
  it("rejects an unknown token identity", () => {
    expect(
      messages(
        base({
          slots: [
            {
              part: "root",
              element: "div",
              ownership: "recipe",
              base: { color: { token: "brand-gradient" } },
            },
          ],
        }),
      ),
    ).toContain("not a canonical token identity")
  })

  it("collects every referenced identity", () => {
    expect(referencedTokens(buttonRecipe)).toContain("primary")
    expect(referencedTokens(buttonRecipe)).toContain("focus-ring")
  })
})

describe("§3.7 documented exceptions", () => {
  it("rejects a consumer-owned slot with no reason", () => {
    expect(
      rules(
        base({
          slots: [
            { part: "root", element: "div", ownership: "consumer", base: { display: "block" } },
          ],
        }),
      ),
    ).toContain("§3.7 documented exceptions")
  })

  it("rejects an adapter-owned slot with no port", () => {
    expect(
      messages(
        base({
          slots: [
            {
              part: "root",
              element: "div",
              ownership: "adapter",
              ownershipReason: "Positioning coordinates are computed by the adapter at runtime.",
              base: { position: "absolute" },
            },
          ],
        }),
      ),
    ).toContain("capability port")
  })

  it("rejects adapterPort on a slot the recipe owns", () => {
    expect(
      messages(
        base({
          slots: [
            {
              part: "root",
              element: "div",
              ownership: "recipe",
              adapterPort: "PositioningPort",
              base: { display: "block" },
            },
          ],
        }),
      ),
    ).toContain("only meaningful when")
  })

  it("accepts a correctly declared adapter-owned slot", () => {
    expect(
      rules(
        base({
          slots: [
            {
              part: "root",
              element: "div",
              ownership: "adapter",
              ownershipReason: "Positioning coordinates are computed by the adapter at runtime.",
              adapterPort: "PositioningPort",
              adapterOwnedProperties: ["top", "left", "transform"],
              base: { position: "absolute" },
            },
          ],
        }),
      ),
    ).toEqual([])
  })

  it("can express every entry currently in COMPOSED_PART_ALLOWLIST", () => {
    // RECIPE-001d acceptance: the hand-maintained allowlist must be representable as
    // per-slot ownership so it stops being a parallel table.
    for (const [scope, parts] of Object.entries(COMPOSED_PART_ALLOWLIST)) {
      for (const [part, reason] of Object.entries(parts)) {
        const definition: RecipeDefinition = {
          contractVersion: CONTRACT_VERSION,
          scope,
          description: `Expressibility check for ${scope}.`,
          slots: [
            {
              part,
              element: "div",
              ownership: "consumer",
              ownershipReason: reason,
              base: {
                display: "block",
              },
            },
          ],
        }
        const ownershipViolations = validateRecipeDefinition(definition).filter(
          (violation) => violation.rule === "§3.7 documented exceptions",
        )
        expect(ownershipViolations, `${scope}/${part} is not expressible`).toEqual([])
      }
    }
  })
})

describe("variant rules", () => {
  const withAxes = (overrides: Partial<RecipeDefinition>): RecipeDefinition =>
    base({
      variants: [
        {
          name: "size",
          values: { sm: { root: { height: "2rem" } }, lg: { root: { height: "3rem" } } },
        },
      ],
      defaultVariants: { size: "sm" },
      ...overrides,
    })

  it("accepts a well-formed axis", () => {
    expect(rules(withAxes({}))).toEqual([])
  })

  it("rejects a variant value with no declarations", () => {
    expect(
      messages(
        withAxes({
          variants: [{ name: "size", values: { sm: {} } }],
          defaultVariants: { size: "sm" },
        }),
      ),
    ).toContain("produces no declarations")
  })

  it("rejects a variant that styles an undeclared part", () => {
    expect(
      messages(
        withAxes({
          variants: [{ name: "size", values: { sm: { thumb: { height: "1rem" } } } }],
          defaultVariants: { size: "sm" },
        }),
      ),
    ).toContain('data-part="thumb"')
  })

  it("rejects a default naming an undeclared axis", () => {
    expect(messages(withAxes({ defaultVariants: { tone: "loud" } }))).toContain(
      'no variant axis named "tone"',
    )
  })

  it("rejects a default naming an undeclared value", () => {
    expect(messages(withAxes({ defaultVariants: { size: "xl" } }))).toContain(
      'is not a value of axis "size"',
    )
  })

  it("rejects an axis with no default", () => {
    expect(messages(withAxes({ defaultVariants: {} }))).toContain("has no default")
  })

  it("enumerates every combination for reachability checks", () => {
    expect(variantCombinations(buttonRecipe)).toHaveLength(24)
  })
})

describe("compound variant rules", () => {
  const twoAxes = (compoundVariants: RecipeDefinition["compoundVariants"]): RecipeDefinition =>
    base({
      variants: [
        {
          name: "size",
          values: { sm: { root: { height: "2rem" } }, lg: { root: { height: "3rem" } } },
        },
        {
          name: "tone",
          values: {
            quiet: { root: { opacity: "0.8" } },
            loud: { root: { opacity: "1" } },
          },
        },
      ],
      defaultVariants: { size: "sm", tone: "quiet" },
      compoundVariants,
    })

  it("accepts a reachable two-axis condition", () => {
    expect(
      rules(
        twoAxes([
          { when: { size: "lg", tone: "loud" }, declarations: { root: { padding: "1rem" } } },
        ]),
      ),
    ).toEqual([])
  })

  it("rejects a single-axis compound", () => {
    expect(
      messages(twoAxes([{ when: { size: "lg" }, declarations: { root: { padding: "1rem" } } }])),
    ).toContain("at least two axes")
  })

  it("rejects an unreachable condition", () => {
    expect(
      messages(
        twoAxes([
          { when: { size: "xl", tone: "loud" }, declarations: { root: { padding: "1rem" } } },
        ]),
      ),
    ).toContain("is not a value of axis")
  })

  it("rejects duplicate conditions whose winner would depend on order", () => {
    expect(
      messages(
        twoAxes([
          { when: { size: "lg", tone: "loud" }, declarations: { root: { padding: "1rem" } } },
          { when: { tone: "loud", size: "lg" }, declarations: { root: { padding: "2rem" } } },
        ]),
      ),
    ).toContain("duplicate compound condition")
  })

  it("rejects a compound styling an undeclared part", () => {
    expect(
      messages(
        twoAxes([
          { when: { size: "lg", tone: "loud" }, declarations: { thumb: { padding: "1rem" } } },
        ]),
      ),
    ).toContain('data-part="thumb"')
  })
})
