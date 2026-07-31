import { type UnocssStaticRule } from "./generated-variant-rules";
import { SOLIDIOM_THEME_PREFLIGHTS, themePreflight, type UnocssThemePreflight } from "./generated-theme-preflights";
export interface SolidiomPresetOptions {
    /** Prefix for variant names. Default: "ui". */
    prefix?: string;
    /**
     * Shipped theme slug (THEME-004) whose `--ui-*` variable assignments should be
     * injected as a UnoCSS preflight. Omit to install no theme — recipes then fall back
     * to their own hardcoded `var(--ui-x, fallback)` literal, matching the CSS profile's
     * unthemed baseline (RECIPE-002 §4).
     */
    theme?: string;
}
/** Variant definitions mapping variant name to CSS selector. */
export interface VariantDefinition {
    name: string;
    selector: string;
}
export type { UnocssStaticRule };
export { SOLIDIOM_THEME_PREFLIGHTS, themePreflight, type UnocssThemePreflight };
/**
 * Returns the Solidiom UnoCSS preset variant definitions.
 *
 * A state value that collides with a boolean flag (`disabled`, `loading`, `selected`)
 * is namespaced as `uiStateSelected` so the bare `uiSelected` keeps targeting the
 * flag. Those collisions are the vocabulary exceptions recorded in
 * `VOCABULARY_EXCEPTIONS`; when the owning primitives stop emitting a flag as a
 * state, the namespaced variants disappear on their own.
 */
export declare function getSolidiomVariants(options?: SolidiomPresetOptions): VariantDefinition[];
/** Generated static UnoCSS rules for every recipe variant/compound class name. */
export declare function getSolidiomVariantRules(): UnocssStaticRule[];
/**
 * Creates the UnoCSS preset object (compatible with UnoCSS defineConfig).
 *
 * When `options.theme` names a shipped slug, its `--ui-*` preflight CSS (THEME-004) is
 * included in the returned `preflights` array so a consumer does not need a separate
 * stylesheet import to theme every profile that reads the shared runtime namespace.
 */
export declare function presetSolidiom(options?: SolidiomPresetOptions): {
    name: string;
    variants: {
        name: string;
        match: (input: string) => {
            matcher: string;
            selector: (s: string) => string;
        } | undefined;
    }[];
    rules: UnocssStaticRule[];
    preflights: {
        getCSS: () => string;
    }[];
};
//# sourceMappingURL=index.d.ts.map