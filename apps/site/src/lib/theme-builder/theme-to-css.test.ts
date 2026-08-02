import { describe, expect, it } from "vitest"
import {
  THEME_SCHEMA_VERSION,
  type ThemeDefinition,
} from "../../../../../tools/theme-contract-schema"
import { SOLIDIOM_DEFAULT_THEME } from "../../../../../tools/theme-contract-definitions"
import { themeToCssVariables } from "./theme-to-css"

describe("themeToCssVariables", () => {
  it("generates variables for light mode", () => {
    const vars = themeToCssVariables(SOLIDIOM_DEFAULT_THEME, "light")
    expect(vars).toBeDefined()
    expect(Object.keys(vars).length).toBeGreaterThan(0)
  })

  it("generates variables for dark mode", () => {
    const vars = themeToCssVariables(SOLIDIOM_DEFAULT_THEME, "dark")
    expect(vars).toBeDefined()
    expect(Object.keys(vars).length).toBeGreaterThan(0)
  })

  it("uses --sio- prefix for variable names", () => {
    const vars = themeToCssVariables(SOLIDIOM_DEFAULT_THEME, "light")
    const keys = Object.keys(vars)
    expect(keys.every((k) => k.startsWith("--sio-"))).toBe(true)
  })

  it("maps token id to variable name with dashes preserved", () => {
    const vars = themeToCssVariables(SOLIDIOM_DEFAULT_THEME, "light")
    expect("--sio-surface" in vars).toBe(true)
    expect("--sio-surface-raised" in vars).toBe(true)
    expect("--sio-primary" in vars).toBe(true)
    expect("--sio-radius-sm" in vars).toBe(true)
  })

  it("resolves ref tokens to their literal values", () => {
    const vars = themeToCssVariables(SOLIDIOM_DEFAULT_THEME, "light")
    const primaryValue = SOLIDIOM_DEFAULT_THEME.modes.light.primary
    if (typeof primaryValue === "string") {
      expect(vars["--sio-focus-ring"]).toBe(primaryValue)
    }
  })

  it("light and dark modes have different values", () => {
    const light = themeToCssVariables(SOLIDIOM_DEFAULT_THEME, "light")
    const dark = themeToCssVariables(SOLIDIOM_DEFAULT_THEME, "dark")
    expect(light["--sio-surface"]).not.toBe(dark["--sio-surface"])
    expect(light["--sio-primary"]).not.toBe(dark["--sio-primary"])
  })

  it("returns empty object for theme with no tokens in mode", () => {
    const emptyTheme: ThemeDefinition = {
      schemaVersion: THEME_SCHEMA_VERSION,
      meta: { name: "Empty", slug: "empty", description: "x", kind: "custom" },
      modes: {
        light: {},
        dark: {},
      },
    }
    const vars = themeToCssVariables(emptyTheme, "light")
    expect(vars).toEqual({})
  })
})
