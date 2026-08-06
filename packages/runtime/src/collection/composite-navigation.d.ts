/**
 * Composite navigation — resolves arrow keys, Home/End/PageUp/PageDown
 * into next/previous item navigation within a collection.
 *
 * Per §9.2: handles orientation (horizontal/vertical/both), RTL direction flip,
 * and wrap-around behavior. Operates on the enabled items subset.
 */
import type { CollectionItem } from "./collection";
/** Navigation intent produced from a keyboard event. */
export type NavigationIntent = "next" | "previous" | "first" | "last" | "pageUp" | "pageDown";
/** Options for resolving a keyboard event into a navigation intent. */
export interface NavigationOptions {
    orientation: "horizontal" | "vertical" | "both";
    direction: "ltr" | "rtl";
    /** Whether navigation wraps from last to first and vice versa. */
    loop?: boolean;
    /** Number of items to skip for PageUp/PageDown. Default: 5. */
    pageSize?: number;
}
/**
 * Resolves a keyboard event key into a navigation intent, or undefined
 * if the key is not a navigation key for the given orientation/direction.
 */
export declare function resolveNavigationIntent(key: string, options: NavigationOptions): NavigationIntent | undefined;
/**
 * Given the current active item ID and a navigation intent, returns
 * the next item to activate from the enabled items list.
 *
 * Returns undefined if navigation cannot proceed (e.g. at boundary without loop).
 */
export declare function resolveNextItem(enabledItems: CollectionItem[], currentId: string | undefined, intent: NavigationIntent, options?: Pick<NavigationOptions, "loop" | "pageSize">): CollectionItem | undefined;
//# sourceMappingURL=composite-navigation.d.ts.map