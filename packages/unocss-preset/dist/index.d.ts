/**
 * @solidiom/unocss-preset — UnoCSS preset providing semantic attribute variants.
 *
 * Variants: uiOpen, uiClosed, uiDisabled, uiHighlighted, uiSelected, uiChecked.
 * Targets data-state and boolean data-* attributes from Solidiom primitives (§14.6).
 */
export interface SolidiomPresetOptions {
    /** Prefix for variant names. Default: "ui". */
    prefix?: string;
}
/** Variant definitions mapping variant name to CSS selector. */
export interface VariantDefinition {
    name: string;
    selector: string;
}
/**
 * Returns the Solidiom UnoCSS preset variant definitions.
 */
export declare function getSolidiomVariants(options?: SolidiomPresetOptions): VariantDefinition[];
/**
 * Creates the UnoCSS preset object (compatible with UnoCSS defineConfig).
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
};
//# sourceMappingURL=index.d.ts.map