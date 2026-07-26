/**
 * Navigation menu context — shared state between NavigationMenu parts.
 */
import { type Accessor } from "solid-js";
import type { Collection, RovingFocus, PointerIntent } from "@solidiom/runtime";
/** Positioning adapter port injected by the consumer. */
export interface PositioningPort {
    /** Compute and apply position styles to the content element. */
    update: (reference: HTMLElement, floating: HTMLElement) => void | (() => void);
}
export interface NavigationMenuContextValue {
    /** Currently active (open) item value. */
    activeValue: Accessor<string>;
    /** Request a value change (open a specific item's content). */
    setActiveValue: (value: string) => void;
    /** Close all sub-menus. */
    close: () => void;
    /** Collection of trigger items for roving focus. */
    collection: Collection;
    /** Roving focus manager for the trigger list. */
    rovingFocus: RovingFocus;
    /** Pointer intent tracker instance. */
    pointerIntent: PointerIntent;
    /** Orientation of the navigation bar. */
    orientation: Accessor<"horizontal" | "vertical">;
    /** Optional positioning adapter. */
    positioning?: PositioningPort;
    /** Delay for pointer intent (ms). */
    delayDuration: number;
}
export declare const NavigationMenuContext: import("solid-js").Context<NavigationMenuContextValue>;
/** Access the navigation menu context. Throws if used outside Root. */
export declare function useNavigationMenuContext(): NavigationMenuContextValue;
/** Item-level context for linking trigger to content. */
export interface NavigationMenuItemContextValue {
    /** Unique value identifying this item. */
    value: string;
    /** Whether this item's content is open. */
    isOpen: Accessor<boolean>;
    /** Generated trigger ID. */
    triggerId: string;
    /** Generated content ID. */
    contentId: string;
}
export declare const NavigationMenuItemContext: import("solid-js").Context<NavigationMenuItemContextValue>;
/** Access item context. Throws if used outside Item. */
export declare function useNavigationMenuItemContext(): NavigationMenuItemContextValue;
//# sourceMappingURL=navigation-menu-context.d.ts.map