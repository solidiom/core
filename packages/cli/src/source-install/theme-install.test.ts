import { describe, it, expect } from "vitest"
import { planThemeInstall, ThemeNotCompatibleError } from "./theme-install"

describe("planThemeInstall", () => {
  const themeCompatible = ["solidiom-default"]

  it("plans a copy-stylesheet action for the css profile", () => {
    const plan = planThemeInstall({
      themeSlug: "solidiom-default",
      profile: "css",
      themeCompatible,
    })
    expect(plan.profile).toBe("css")
    expect(plan.actions).toHaveLength(1)
    expect(plan.actions[0]!.kind).toBe("copy-stylesheet")
    if (plan.actions[0]!.kind === "copy-stylesheet") {
      expect(plan.actions[0]!.from).toContain("solidiom-default")
      expect(plan.actions[0]!.to).toContain("solidiom-default")
    }
  })

  it("plans a copy-stylesheet action for the tailwind profile", () => {
    const plan = planThemeInstall({
      themeSlug: "solidiom-default",
      profile: "tailwind",
      themeCompatible,
    })
    expect(plan.profile).toBe("tailwind")
    expect(plan.actions[0]!.kind).toBe("copy-stylesheet")
  })

  it("plans a patch-preset-config action for the unocss profile", () => {
    const plan = planThemeInstall({
      themeSlug: "solidiom-default",
      profile: "unocss",
      themeCompatible,
    })
    expect(plan.profile).toBe("unocss")
    expect(plan.actions).toHaveLength(1)
    expect(plan.actions[0]!.kind).toBe("patch-preset-config")
    if (plan.actions[0]!.kind === "patch-preset-config") {
      expect(plan.actions[0]!.themeSlug).toBe("solidiom-default")
      expect(plan.actions[0]!.description.length).toBeGreaterThan(0)
      expect(plan.actions[0]!.presetImportPath).toBeTruthy()
    }
  })

  it("--dry-run-style consumers can tell which kind of action will occur without inspecting description text", () => {
    const cssPlan = planThemeInstall({
      themeSlug: "solidiom-default",
      profile: "css",
      themeCompatible,
    })
    const unoPlan = planThemeInstall({
      themeSlug: "solidiom-default",
      profile: "unocss",
      themeCompatible,
    })
    expect(cssPlan.actions[0]!.kind).toBe("copy-stylesheet")
    expect(unoPlan.actions[0]!.kind).toBe("patch-preset-config")
  })

  it("throws ThemeNotCompatibleError when the theme slug is not in themeCompatible", () => {
    expect(() =>
      planThemeInstall({ themeSlug: "unknown-theme", profile: "css", themeCompatible }),
    ).toThrow(ThemeNotCompatibleError)
    expect(() =>
      planThemeInstall({ themeSlug: "unknown-theme", profile: "css", themeCompatible }),
    ).toThrow(/not in this deliverable's themeCompatible list/)
  })

  it("respects overridden stylesheet source/destination paths", () => {
    const plan = planThemeInstall({
      themeSlug: "solidiom-default",
      profile: "css",
      themeCompatible,
      stylesheetSource: "custom/source.css",
      stylesheetDestination: "custom/dest.css",
    })
    if (plan.actions[0]!.kind === "copy-stylesheet") {
      expect(plan.actions[0]!.from).toBe("custom/source.css")
      expect(plan.actions[0]!.to).toBe("custom/dest.css")
    }
  })
})
