/**
 * Portal — resolves the target container for portalled overlay content.
 *
 * Per §8.7: portal target resolution is document-scoped.
 * Supports custom portal containers, defaults to document.body.
 */
/** Options for resolving a portal target. */
export interface PortalOptions {
    /** Explicit portal target element. */
    target?: Element | null;
    /** CSS selector to resolve the portal target. */
    selector?: string;
    /** The document context (defaults to globalThis.document). */
    document?: Document;
}
/**
 * Resolves the portal target element.
 *
 * Priority: explicit target > selector > document.body.
 * Returns undefined during SSR (no document available).
 */
export declare function resolvePortalTarget(options?: PortalOptions): Element | undefined;
//# sourceMappingURL=portal.d.ts.map