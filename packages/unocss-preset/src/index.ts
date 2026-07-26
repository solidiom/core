/**
 * @solidiom/unocss-preset — UnoCSS preset providing semantic attribute variants.
 *
 * Variants: uiOpen, uiClosed, uiDisabled, uiHighlighted, uiSelected, uiChecked.
 * Targets data-state and boolean data-* attributes from Solidiom primitives (§14.6).
 */

export interface SolidiomPresetOptions {
  /** Prefix for variant names. Default: "ui". */
  prefix?: string
}

/** Variant definitions mapping variant name to CSS selector. */
export interface VariantDefinition {
  name: string
  selector: string
}

/**
 * Returns the Solidiom UnoCSS preset variant definitions.
 */
export function getSolidiomVariants(options: SolidiomPresetOptions = {}): VariantDefinition[] {
  const p = options.prefix ?? "ui"
  return [
    { name: `${p}Open`, selector: "[data-state='open']" },
    { name: `${p}Closed`, selector: "[data-state='closed']" },
    { name: `${p}Checked`, selector: "[data-state='checked']" },
    { name: `${p}Unchecked`, selector: "[data-state='unchecked']" },
    { name: `${p}Active`, selector: "[data-state='active']" },
    { name: `${p}Disabled`, selector: "[data-disabled]" },
    { name: `${p}Highlighted`, selector: "[data-highlighted]" },
    { name: `${p}Selected`, selector: "[data-selected]" },
    { name: `${p}Required`, selector: "[data-required]" },
    { name: `${p}Invalid`, selector: "[data-invalid]" },
    { name: `${p}Placeholder`, selector: "[data-placeholder]" },
  ]
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
