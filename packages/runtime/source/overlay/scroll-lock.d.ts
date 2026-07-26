/**
 * Scroll lock — reference-counted scroll prevention on the document body.
 *
 * Per §8.7: document-scoped. Multiple overlays sharing a document
 * share one scroll lock with reference counting. Only removes the lock
 * when all holders release.
 */
/**
 * Activates scroll lock on the given document's body.
 *
 * Compensates for scrollbar removal by adding equivalent paddingRight.
 * Reference-counted — multiple activations share one lock.
 *
 * Returns a release function.
 */
export declare function activateScrollLock(doc: Document): () => void
/**
 * Resets all scroll lock state (for testing).
 * @internal
 */
export declare function resetScrollLock(): void
//# sourceMappingURL=scroll-lock.d.ts.map
