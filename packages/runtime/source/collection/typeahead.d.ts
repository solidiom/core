/**
 * Typeahead — character-based search within a collection with timeout reset.
 *
 * Per §9.2: accumulates typed characters, matches against item text values,
 * resets after a configurable timeout, and is suppressed during IME composition.
 */
import type { CollectionItem } from "./collection";
/** Options for creating a typeahead manager. */
export interface TypeaheadOptions {
    /** Timeout in ms before the search string resets. Default: 500. */
    timeout?: number;
    /** Called when typeahead matches an item. */
    onMatch?: (item: CollectionItem) => void;
}
/** The typeahead manager instance. */
export interface Typeahead {
    /** Process a keyboard event. Returns the matched item or undefined. */
    handle: (key: string, items: CollectionItem[], currentId?: string) => CollectionItem | undefined;
    /** Reset the accumulated search string. */
    reset: () => void;
    /** Signal that IME composition has started (suppresses typeahead). */
    compositionStart: () => void;
    /** Signal that IME composition has ended. */
    compositionEnd: () => void;
}
/**
 * Creates a typeahead manager for character-based item search.
 *
 * Accumulates single printable characters into a search string.
 * Matches items by prefix against their textValue. Wraps search
 * starting from the item after the current active item.
 * Resets after the timeout elapses with no input.
 */
export declare function createTypeahead(options?: TypeaheadOptions): Typeahead;
//# sourceMappingURL=typeahead.d.ts.map