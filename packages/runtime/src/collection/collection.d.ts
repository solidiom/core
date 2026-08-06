/**
 * Collection — manages a set of items with stable IDs, DOM-order reconciliation,
 * disabled state, text values, and active/selected tracking.
 *
 * Per §9.2: provides the shared data model consumed by roving focus, typeahead,
 * composite navigation, and selection primitives.
 */
import { type Accessor } from "solid-js";
/** Describes a single item in a collection. */
export interface CollectionItem {
    /** Stable unique identifier for this item. */
    id: string;
    /** Reference to the DOM element, if mounted. */
    ref?: Element;
    /** Whether this item is disabled (skipped during navigation). */
    disabled: Accessor<boolean>;
    /** Text value for typeahead matching. */
    textValue: Accessor<string>;
}
/** Options for creating a collection. */
export interface CollectionOptions {
    /** Orientation for navigation (affects arrow key interpretation). */
    orientation?: Accessor<"horizontal" | "vertical" | "both">;
    /** Text direction for RTL navigation flip. */
    direction?: Accessor<"ltr" | "rtl">;
}
/** The collection instance returned by createCollection. */
export interface Collection {
    /** Reactive list of items in DOM order. */
    items: Accessor<CollectionItem[]>;
    /** Register an item. Returns a cleanup function. */
    registerItem: (item: CollectionItem) => () => void;
    /** Remove an item by ID. */
    unregisterItem: (id: string) => void;
    /** Get enabled (non-disabled) items. */
    enabledItems: Accessor<CollectionItem[]>;
    /** Find an item by ID. */
    getItem: (id: string) => CollectionItem | undefined;
    /** Current orientation. */
    orientation: Accessor<"horizontal" | "vertical" | "both">;
    /** Current text direction. */
    direction: Accessor<"ltr" | "rtl">;
}
/**
 * Creates a collection that tracks items in DOM order.
 *
 * Items are sorted by DOM position when multiple items are registered.
 * Supports dynamic insert/remove with stable identity.
 */
export declare function createCollection(options?: CollectionOptions): Collection;
//# sourceMappingURL=collection.d.ts.map