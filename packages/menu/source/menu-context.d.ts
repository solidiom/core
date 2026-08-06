/**
 * Menu context — shared state between Menu parts.
 */
import { type Accessor } from "solid-js";
import type { ChangeDetails, DisclosureReason, Collection, RovingFocus, Typeahead } from "@solidiom/runtime";
export interface MenuContextValue {
    /** Whether the menu is open. */
    open: Accessor<boolean>;
    /** Request open state change. */
    requestOpenChange: (next: boolean, details: ChangeDetails<DisclosureReason>) => void;
    /** Collection instance for item management. */
    collection: Collection;
    /** Roving focus instance. */
    rovingFocus: RovingFocus;
    /** Typeahead instance. */
    typeahead: Typeahead;
    /** Generated trigger ID. */
    triggerId: string;
    /** Generated content ID. */
    contentId: string;
    /** Activate the item with the given ID. */
    activateItem: (itemId: string) => void;
    /** Trigger ref for focus restoration. */
    triggerRef: Accessor<HTMLElement | undefined>;
    /** Set the trigger ref. */
    setTriggerRef: (el: HTMLElement | undefined) => void;
}
export declare const MenuContext: import("solid-js").Context<MenuContextValue>;
/** Access the menu context. Throws if used outside Root. */
export declare function useMenuContext(): MenuContextValue;
//# sourceMappingURL=menu-context.d.ts.map