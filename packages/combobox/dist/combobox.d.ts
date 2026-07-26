/**
 * Combobox primitive — autocomplete input with filterable listbox,
 * keyboard navigation, active descendant pattern, and dismissable layer.
 *
 * Parts: Root, Input, Content (listbox), Item, ItemText.
 */
import { type Accessor } from "solid-js";
import { type JSX } from "@solidjs/web";
import { type ChangeDetails, type DisclosureReason } from "@solidiom/runtime";
import { type ComboboxReason } from "./combobox-context";
export interface ComboboxRootProps {
    /** Controlled open state. */
    open?: Accessor<boolean>;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean, details: ChangeDetails<DisclosureReason>) => void;
    /** Controlled input text value. */
    inputValue?: Accessor<string>;
    defaultInputValue?: string;
    onInputValueChange?: (value: string) => void;
    /** Controlled selected value. */
    selectedValue?: Accessor<string | undefined>;
    defaultSelectedValue?: string;
    onSelectedValueChange?: (value: string, details: ChangeDetails<ComboboxReason>) => void;
    children: JSX.Element;
}
/** Root provider — composes disclosure state, input value, and collection. */
export declare function Root(props: ComboboxRootProps): JSX.Element;
export interface ComboboxInputProps {
    /** Placeholder text when empty. */
    placeholder?: string;
    /** Called on each input change to trigger filtering. */
    onFilter?: (value: string) => void;
    ref?: (el: HTMLInputElement) => void;
    class?: string;
    style?: JSX.CSSProperties | string;
}
/** Text input with aria-autocomplete, triggers open on focus/type. */
export declare function Input(props: ComboboxInputProps): JSX.Element;
export interface ComboboxContentProps {
    children: JSX.Element;
    ref?: (el: HTMLDivElement) => void;
    class?: string;
    style?: JSX.CSSProperties | string;
}
/** Listbox container — registers dismissable layer for outside click/escape. */
export declare function Content(props: ComboboxContentProps): JSX.Element;
export interface ComboboxItemProps {
    /** Unique value for this item. */
    value: string;
    /** Text value for matching. Defaults to value. */
    textValue?: string;
    /** Disabled state. */
    disabled?: boolean;
    children: JSX.Element;
}
/** Individual option — registers in collection, highlights on hover. */
export declare function Item(props: ComboboxItemProps): JSX.Element;
export interface ComboboxItemTextProps {
    children: JSX.Element;
}
/** Display text within an item. */
export declare function ItemText(props: ComboboxItemTextProps): JSX.Element;
//# sourceMappingURL=combobox.d.ts.map