/**
 * Layer stack — document-scoped ordered stack of overlay layers.
 *
 * Per §8.7: scoped by Document, not process-wide singleton.
 * Supports nested layers with LIFO ordering for escape-key arbitration,
 * pointer-outside routing, and focus-outside routing.
 */
/** A registered layer in the stack. */
export interface Layer {
    /** Unique identifier for this layer. */
    id: string;
    /** The layer's content element (for contains checks). */
    element?: Element;
    /** Whether this layer is modal (blocks interaction with layers below). */
    modal: boolean;
    /** Called when the layer should dismiss (escape, pointer-outside, etc.). */
    onDismiss?: (reason: DismissReason) => void;
}
/** Reasons a layer can be dismissed. */
export type DismissReason = "escape-key" | "pointer-outside" | "focus-outside";
/** Document-scoped layer stack instance. */
export interface LayerStack {
    /** Push a layer onto the stack. Returns cleanup function. */
    push: (layer: Layer) => () => void;
    /** Remove a layer by ID. */
    remove: (id: string) => void;
    /** Get the topmost layer. */
    top: () => Layer | undefined;
    /** Check if a layer is the topmost. */
    isTop: (id: string) => boolean;
    /** Get all layers (bottom to top). */
    layers: () => readonly Layer[];
    /** Check if any modal layer is active. */
    hasModal: () => boolean;
}
/**
 * Gets or creates the layer stack for a given document.
 * Per §8.7: each document has its own isolated stack.
 */
export declare function getLayerStack(doc: Document): LayerStack;
/** Removes the layer stack for a document (for testing/cleanup). */
export declare function clearLayerStack(doc: Document): void;
//# sourceMappingURL=layer-stack.d.ts.map