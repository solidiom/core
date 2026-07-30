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
 *
 * A state value that collides with a boolean flag (`disabled`, `loading`, `selected`)
 * is namespaced as `uiStateSelected` so the bare `uiSelected` keeps targeting the
 * flag. Those collisions are the vocabulary exceptions recorded in
 * `VOCABULARY_EXCEPTIONS`; when the owning primitives stop emitting a flag as a
 * state, the namespaced variants disappear on their own.
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