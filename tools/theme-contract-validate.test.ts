import { describe, expect, it } from "vitest"
import { REFERENCE_THEMES, SOLIDIOM_DEFAULT_THEME } from "./theme-contract-definitions"
import { THEME_SCHEMA_VERSION, type ThemeDefinition } from "./theme-contract-schema"
import { REQUIRED_BASELINE_TOKENS, validateThemeDefinition } from "./theme-contract-validate"

/** Minimal valid definition to mutate per test. */
function base(overrides: Partial<ThemeDefinition> = {}): ThemeDefinition {
  const baseline: Record<string, string> = {}
  for (const id of REQUIRED_BASELINE_TOKENS) baseline[id] = "#123456"
  // Override the pairs §5 checks so the fixture is legible by default; individual
  // tests that want a low-contrast pair override these again.
  baseline.foreground = "#000000"
  baseline.surface = "#ffffff"
  baseline["surface-raised"] = "#ffffff"
  baseline.primary = "#123456"
  baseline["primary-foreground"] = "#ffffff"
  return {
    schemaVersion: THEME_SCHEMA_VERSION,
    meta: { name: "Fixture", slug: "fixture-theme", description: "A fixture.", kind: "custom" },
    modes: {
      light: { ...baseline },
      dark: {
        ...baseline,
        foreground: "#ffffff",
        surface: "#000000",
        "surface-raised": "#000000",
      }, // differ from light so §4 passes, while keeping dark's own pairs legible
    },
    ...overrides,
  }
}

function rules(definition: ThemeDefinition): string[] {
  return validateThemeDefinition(definition).map((violation) => violation.rule)
}

function messages(definition: ThemeDefinition): string {
  return validateThemeDefinition(definition)
    .map((violation) => `${violation.path} ${violation.message}`)
    .join("\n")
}

describe("reference themes", () => {
  it("validate clean", () => {
    for (const [slug, definition] of Object.entries(REFERENCE_THEMES)) {
      expect(validateThemeDefinition(definition), `${slug} must validate`).toEqual([])
    }
  })

  it("solidiom-default declares independent light and dark surfaces", () => {
    expect(SOLIDIOM_DEFAULT_THEME.modes.light.surface).not.toBe(
      SOLIDIOM_DEFAULT_THEME.modes.dark.surface,
    )
  })
})

describe("envelope rules", () => {
  it("passes a minimal valid fixture", () => {
    expect(messages(base())).toBe("")
  })

  it("rejects a wrong schemaVersion", () => {
    expect(messages(base({ schemaVersion: 99 as never }))).toContain("schemaVersion")
  })

  it("rejects a missing name", () => {
    expect(
      messages(base({ meta: { name: "  ", slug: "x", description: "d", kind: "custom" } })),
    ).toContain("name")
  })

  it("rejects a non-kebab-case slug", () => {
    expect(
      messages(base({ meta: { name: "N", slug: "Not Kebab", description: "d", kind: "custom" } })),
    ).toContain("kebab-case")
  })

  it("rejects a missing description", () => {
    expect(
      messages(base({ meta: { name: "N", slug: "n", description: "", kind: "custom" } })),
    ).toContain("description")
  })

  it("rejects an invalid meta.kind", () => {
    expect(
      messages(base({ meta: { name: "N", slug: "n", description: "d", kind: "bogus" as never } })),
    ).toContain("meta.kind")
  })

  it("rejects a definition missing the dark mode entirely", () => {
    const definition = base()
    // @ts-expect-error deliberately malformed for the test
    delete definition.modes.dark
    expect(messages(definition)).toContain('mode "dark" is mandatory')
  })

  it("rejects a mode with zero declared tokens", () => {
    expect(messages(base({ modes: { light: {}, dark: base().modes.dark } }))).toContain(
      'mode "light" is mandatory',
    )
  })
})

describe("§1 known tokens", () => {
  it("rejects an identity outside the canonical set", () => {
    const definition = base()
    ;(definition.modes.light as Record<string, string>)["brand-gradient"] = "#000"
    expect(rules(definition)).toContain("§1 known tokens")
  })
})

describe("§2 baseline set", () => {
  it("rejects a mode missing a required baseline token", () => {
    const definition = base()
    const light = { ...definition.modes.light } as Record<string, string>
    delete light.primary
    expect(messages({ ...definition, modes: { ...definition.modes, light } })).toContain(
      "missing required baseline token(s): primary",
    )
  })
})

describe("§3 references", () => {
  it("rejects a reference to a token not declared in the same mode", () => {
    const definition = base()
    const light = { ...definition.modes.light, "primary-hover": { ref: "does-not-exist" } }
    expect(messages({ ...definition, modes: { ...definition.modes, light } })).toContain(
      "does not declare",
    )
  })

  it("rejects a reference cycle", () => {
    const definition = base()
    const light = {
      ...definition.modes.light,
      primary: { ref: "primary-hover" },
      "primary-hover": { ref: "primary" },
    }
    expect(messages({ ...definition, modes: { ...definition.modes, light } })).toContain(
      "reference cycle",
    )
  })

  it("accepts a valid same-mode reference", () => {
    const definition = base()
    const light = { ...definition.modes.light, "primary-hover": { ref: "primary" } }
    expect(rules({ ...definition, modes: { ...definition.modes, light } })).not.toContain(
      "§3 references",
    )
  })
})

describe("§4 mode independence", () => {
  it("rejects a theme whose dark mode is byte-identical to light for every shared colour", () => {
    const definition = base()
    const identical = base({
      modes: { light: definition.modes.light, dark: definition.modes.light },
    })
    expect(messages(identical)).toContain("independently authored")
  })

  it("accepts a theme where at least one shared colour differs", () => {
    expect(rules(base())).not.toContain("§4 independence")
  })

  it("does not require radius/shadow tokens to differ across modes", () => {
    const definition = base({
      modes: {
        light: { ...base().modes.light, "radius-sm": "8px" },
        dark: { ...base().modes.dark, "radius-sm": "8px" },
      },
    })
    expect(rules(definition)).not.toContain("§4 independence")
  })
})

describe("§5 legible pairs", () => {
  it("rejects a foreground/surface pair below the contrast floor", () => {
    const definition = base({
      modes: {
        light: { ...base().modes.light, foreground: "#888888", surface: "#999999" },
        dark: base().modes.dark,
      },
    })
    expect(messages(definition)).toContain("contrast ratio")
  })

  it("accepts a legible foreground/surface pair", () => {
    const definition = base({
      modes: {
        light: { ...base().modes.light, foreground: "#000000", surface: "#ffffff" },
        dark: base().modes.dark,
      },
    })
    expect(rules(definition)).not.toContain("§5 legible pairs")
  })

  it("does not fail when a colour form cannot be parsed, since it cannot be verified", () => {
    const definition = base({
      modes: {
        light: { ...base().modes.light, foreground: "hsl(0 0% 0%)", surface: "hsl(0 0% 100%)" },
        dark: base().modes.dark,
      },
    })
    expect(rules(definition)).not.toContain("§5 legible pairs")
  })
})
