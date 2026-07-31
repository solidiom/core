/**
 * Theme install planning (CLI-004).
 *
 * Theme installs are multi-artifact: for the "css"/"tailwind" styling
 * profiles, installing a theme means copying a real stylesheet file (e.g.
 * from @solidiom/themes' css/<slug>.css or tailwind/<slug>.css export path —
 * see packages/themes/package.json's `exports` map for the real path
 * convention this mirrors; this module does not read from packages/themes
 * directly, it only models the plan shape the caller then acts on).
 *
 * For the "unocss" profile, there is no copyable per-theme file: UnoCSS theme
 * preflights are consumed by wiring `presetSolidiom({ theme })` into the
 * consumer's own uno.config.ts (see
 * packages/unocss-preset/src/generated-theme-preflights.ts's
 * SOLIDIOM_THEME_PREFLIGHTS / themePreflight(slug) for the underlying data
 * shape). Writing a real AST codemod that edits a consumer's uno.config.ts
 * is out of scope for CLI-004's stated acceptance criteria — this module
 * only produces a "patch-preset-config" action whose `description` field
 * carries clear manual instructions. `--dry-run` must state plainly which
 * kind of action (copy-stylesheet vs patch-preset-config) will occur; the
 * discriminated union below is what lets a caller do that without needing to
 * inspect string content.
 */

import type { StylingProfile } from "../registry-schema"

export type ThemeInstallAction =
  | {
      kind: "copy-stylesheet"
      /** Source stylesheet path (e.g. an export from a themes package). */
      from: string
      /** Destination path within the consumer project. */
      to: string
    }
  | {
      kind: "patch-preset-config"
      /**
       * Human-readable description of the manual step required. No AST
       * codemod exists yet (out of scope for CLI-004) — this field is the
       * primary UX surface until one is written.
       */
      description: string
      /** The preset's import path the consumer's uno.config.ts should wire up. */
      presetImportPath: string
      /** The theme slug to pass as `presetSolidiom({ theme: themeSlug })`. */
      themeSlug: string
    }

export interface ThemeInstallPlan {
  profile: StylingProfile
  actions: ThemeInstallAction[]
}

export interface PlanThemeInstallOptions {
  themeSlug: string
  profile: StylingProfile
  /** Theme slugs the deliverable being installed has confirmed compatibility with. */
  themeCompatible: string[]
  /** Override for the stylesheet source path (defaults to a themes-package-shaped convention). */
  stylesheetSource?: string
  /** Override for the stylesheet destination path (defaults to a themeDir-shaped convention). */
  stylesheetDestination?: string
  /** Override for the UnoCSS preset's import path. */
  presetImportPath?: string
}

/** Thrown when the requested theme slug is not declared compatible by the deliverable being installed. */
export class ThemeNotCompatibleError extends Error {
  constructor(
    readonly themeSlug: string,
    readonly themeCompatible: string[],
  ) {
    super(
      `Theme "${themeSlug}" is not in this deliverable's themeCompatible list ` +
        `(available: ${themeCompatible.length > 0 ? themeCompatible.join(", ") : "none"})`,
    )
    this.name = "ThemeNotCompatibleError"
  }
}

/**
 * Plans a theme install for a given styling profile.
 *
 * - "css" / "tailwind" → a single copy-stylesheet action.
 * - "unocss"           → a single patch-preset-config action (manual-instructions only; see module docs).
 *
 * Throws ThemeNotCompatibleError if `themeSlug` is absent from `themeCompatible`.
 */
export function planThemeInstall(options: PlanThemeInstallOptions): ThemeInstallPlan {
  const { themeSlug, profile, themeCompatible } = options

  if (!themeCompatible.includes(themeSlug)) {
    throw new ThemeNotCompatibleError(themeSlug, themeCompatible)
  }

  if (profile === "css" || profile === "tailwind") {
    const from = options.stylesheetSource ?? `@solidiom/themes/${profile}/${themeSlug}.css`
    const to = options.stylesheetDestination ?? `src/ui/themes/${themeSlug}.css`
    return {
      profile,
      actions: [{ kind: "copy-stylesheet", from, to }],
    }
  }

  // profile === "unocss"
  const presetImportPath = options.presetImportPath ?? "@solidiom/unocss-preset"
  return {
    profile,
    actions: [
      {
        kind: "patch-preset-config",
        themeSlug,
        presetImportPath,
        description:
          `No automated codemod exists yet for UnoCSS theme installs. Manually wire this theme ` +
          `into your uno.config.ts: import the preset from "${presetImportPath}" and pass ` +
          `presetSolidiom({ theme: "${themeSlug}" }) among your UnoCSS presets.`,
      },
    ],
  }
}
