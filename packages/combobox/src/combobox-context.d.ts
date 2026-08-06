/**
 * Combobox context — shared state between Combobox parts.
 */
import { type Accessor } from "solid-js";
import type { ChangeDetails, DisclosureReason, Collection } from "@solidiom/runtime";
export type ComboboxReason = "item-click" | "keyboard" | "programmatic";
export interface ComboboxContextValue {
    /** Whether the listbox is open. */
    open: Accessor<boolean>;
    /** Request open state change. */
    requestOpenChange: (next: boolean, details: ChangeDetails<DisclosureReason>) => void;
    /** Current input text value. */
    inputValue: Accessor<string>;
    /** Set input text value. */
    setInputValue: (next: string) => void;
    /** Currently selected value. */
    selectedValue: Accessor<string>;
    /** Request selected value change. */
    requestSelectedChange: (next: string, details: ChangeDetails<ComboboxReason>) => void;
    /** Currently highlighted item id (active descendant). */
    highlightedId: Accessor<string | null>;
    /** Set highlighted item id. */
    setHighlightedId: (id: string | null) => void;
    /** Collection instance for item registration. */
    collection: Collection;
    /** Generated IDs. */
    inputId: string;
    listboxId: string;
    labelId: string;
}
export declare const ComboboxContext: import("solid-js").Context<ComboboxContextValue>;
/** Retrieve combobox context. Throws if used outside Combobox.Root. */
export declare function useComboboxContext(): ComboboxContextValue;
//# sourceMappingURL=combobox-context.d.ts.map