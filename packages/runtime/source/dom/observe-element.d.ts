/**
 * Element observation — owner-scoped ResizeObserver and MutationObserver wrappers.
 *
 * Per §8.2: browser measurement only after mount/settlement. These utilities
 * register observers that auto-dispose with the current reactive owner.
 * Safe to call only in browser context (no-ops during SSR).
 */
/**
 * Observes element size changes via ResizeObserver.
 * Auto-cleans up when the reactive owner disposes.
 * No-op when called during SSR (no `ResizeObserver` global).
 */
export declare function observeElementSize(
  element: () => Element | undefined,
  callback: (entry: ResizeObserverEntry) => void,
): () => void
/**
 * Observes DOM mutations on an element via MutationObserver.
 * Auto-cleans up when the reactive owner disposes.
 * No-op when called during SSR (no `MutationObserver` global).
 */
export declare function observeElementMutations(
  element: () => Element | undefined,
  callback: (mutations: MutationRecord[]) => void,
  options?: MutationObserverInit,
): () => void
//# sourceMappingURL=observe-element.d.ts.map
