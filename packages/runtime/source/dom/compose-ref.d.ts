/**
 * Ref composition — merges multiple ref callbacks into a single ref.
 *
 * Per §8.3: supports internal node registration, user refs, adapter attachment,
 * cleanup on replacement, and multiple refs through arrays.
 * Does not use `use:` directives or `forwardRef` abstractions.
 */
/** A single ref callback or undefined. */
export type Ref<T extends Element = Element> = ((el: T) => void) | undefined;
/**
 * Composes multiple ref callbacks into one.
 *
 * When the composed ref is called with an element:
 * 1. Each non-null ref is invoked with the element.
 * 2. A cleanup function is returned that calls each ref with `undefined`
 *    (for adapters/observers that need teardown on element replacement).
 *
 * Usage in a primitive:
 * ```ts
 * const composed = composeRef(internalRef, props.ref, adapterRef)
 * <div ref={composed} />
 * ```
 */
export declare function composeRef<T extends Element = Element>(...refs: Ref<T>[]): (el: T) => void;
//# sourceMappingURL=compose-ref.d.ts.map