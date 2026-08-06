/**
 * Command palette context — shared state between CommandPalette parts.
 */
import { type Accessor } from "solid-js";
import type { ChangeDetails, DisclosureReason, Collection } from "@solidiom/runtime";
export interface CommandPaletteContextValue {
    /** Whether the palette is open. */
    open: Accessor<boolean>;
    /** Request open state change. */
    requestOpenChange: (next: boolean, details: ChangeDetails<DisclosureReason>) => void;
    /** Current input filter value. */
    inputValue: Accessor<string>;
    /** Set input filter value. */
    setInputValue: (next: string) => void;
    /** Currently highlighted item id. */
    highlightedId: Accessor<string | null>;
    /** Set highlighted item id. */
    setHighlightedId: (id: string | null) => void;
    /** Collection instance for item registration. */
    collection: Collection;
    /** Generated IDs. */
    inputId: string;
    listId: string;
    contentId: string;
}
export declare const CommandPaletteContext: import("solid-js").Context<CommandPaletteContextValue>;
/** Retrieve command palette context. Throws if used outside CommandPalette.Root. */
export declare function useCommandPaletteContext(): CommandPaletteContextValue;
//# sourceMappingURL=command-palette-context.d.ts.map