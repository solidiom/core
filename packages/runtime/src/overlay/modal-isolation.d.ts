/**
 * Modal isolation — reference-counted `aria-hidden` and `inert` application
 * to siblings of modal layers.
 *
 * Per §8.7: document-scoped. When a modal layer is active, all sibling
 * subtrees of the modal's portal container are marked inert. Multiple
 * concurrent modals share a single reference count.
 */
/**
 * Activates modal isolation for a given element's document.
 *
 * Marks all siblings of the element (and its portal ancestors) as
 * `aria-hidden="true"` and `inert`. Reference-counted so nested
 * modals don't conflict.
 *
 * Returns a deactivation function.
 */
export declare function activateModalIsolation(element: Element): () => void;
/**
 * Resets all modal isolation state (for testing).
 * @internal
 */
export declare function resetModalIsolation(): void;
//# sourceMappingURL=modal-isolation.d.ts.map