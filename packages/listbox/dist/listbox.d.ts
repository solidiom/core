/**
 * Listbox primitive — single/multiple selection list with keyboard navigation,
 * roving focus, typeahead, and disabled item support.
 *
 * Parts: Root, Item.
 */
import { type Accessor } from "solid-js";
import { type JSX } from "@solidjs/web";
import { type ChangeDetails } from "@solidiom/runtime";
import { type ListboxSelectionMode, type ListboxReason } from "./listbox-context";
/** Props for the listbox root element. */
export interface ListboxRootProps {
    /** Controlled value. */
    value?: Accessor<string[]>;
    /** Default value (uncontrolled). */
    defaultValue?: string[];
    /** Called when value change is requested. */
    onValueChange?: (value: string[], details: ChangeDetails<ListboxReason>) => void;
    /** Selection mode. Default: "single". */
    selectionMode?: ListboxSelectionMode;
    /** Disabled state. */
    disabled?: Accessor<boolean>;
    /** Accessible name for the listbox. */
    "aria-label"?: string;
    /** Orientation for keyboard navigation. Default: "vertical". */
    orientation?: "horizontal" | "vertical";
    /** Whether navigation loops. Default: true. */
    loop?: boolean;
    children: JSX.Element;
    class?: string;
    style?: JSX.CSSProperties | string;
    ref?: (el: HTMLDivElement) => void;
}
/** Root listbox element with keyboard navigation and selection management. */
export declare function Root(props: ListboxRootProps): JSX.Element;
/** Props for a listbox item. */
export interface ListboxItemProps {
    /** Unique value for this item. */
    value: string;
    /** Text for typeahead matching. Defaults to value. */
    textValue?: string;
    /** Disabled state. */
    disabled?: boolean;
    children: JSX.Element;
}
/** Individual listbox item with selection and roving focus support. */
export declare function Item(props: ListboxItemProps): JSX.Element;
//# sourceMappingURL=listbox.d.ts.map