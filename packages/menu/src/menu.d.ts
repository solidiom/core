/**
 * Menu primitive — trigger + dismissable menu panel with keyboard navigation,
 * typeahead, focus trapping, and context menu support.
 *
 * Parts: Root, Trigger, Content, Item, Separator.
 */
import { type Accessor } from "solid-js";
import { type JSX } from "@solidjs/web";
import { type ChangeDetails, type DisclosureReason } from "@solidiom/runtime";
/** Props for the menu root provider. */
export interface MenuRootProps {
    /** Controlled open state. */
    open?: Accessor<boolean>;
    /** Default open state (uncontrolled). */
    defaultOpen?: boolean;
    /** Called when open state change is requested. */
    onOpenChange?: (open: boolean, details: ChangeDetails<DisclosureReason>) => void;
    children: JSX.Element;
}
/** Root provider that manages menu open state and context. */
export declare function Root(props: MenuRootProps): JSX.Element;
/** Props for the menu trigger button. */
export interface MenuTriggerProps {
    children: JSX.Element;
    ref?: (el: HTMLButtonElement) => void;
    /** Enable context menu (right-click) activation. */
    contextMenu?: boolean;
}
/** Button that toggles the menu open state. */
export declare function Trigger(props: MenuTriggerProps): JSX.Element;
/** Props for the menu content panel. */
export interface MenuContentProps {
    children: JSX.Element;
    class?: string;
    style?: JSX.CSSProperties | string;
    ref?: (el: HTMLDivElement) => void;
}
/** Menu content panel with dismiss behavior, focus trapping, and keyboard navigation. */
export declare function Content(props: MenuContentProps): JSX.Element;
/** Props for a menu item. */
export interface MenuItemProps {
    /** Text for typeahead matching. */
    textValue?: string;
    /** Disabled state. */
    disabled?: boolean;
    /** Called when the item is activated. */
    onSelect?: () => void;
    children: JSX.Element;
}
/** Individual menu item with keyboard activation and disabled state support. */
export declare function Item(props: MenuItemProps): JSX.Element;
/** Props for a menu separator. */
export interface MenuSeparatorProps {
    class?: string;
}
/** Visual separator between menu items. */
export declare function Separator(props: MenuSeparatorProps): JSX.Element;
/** Props for a menu checkbox item. */
export interface MenuCheckboxItemProps {
    /** Whether the item is checked. */
    checked?: boolean;
    /** Called when checked state changes. */
    onCheckedChange?: (checked: boolean) => void;
    /** Text for typeahead matching. */
    textValue?: string;
    /** Disabled state. */
    disabled?: boolean;
    children: JSX.Element;
}
/** Menu item that toggles a boolean checked state (role=menuitemcheckbox). */
export declare function CheckboxItem(props: MenuCheckboxItemProps): JSX.Element;
/** Props for a menu radio group. */
export interface MenuRadioGroupProps {
    /** Current selected value. */
    value?: string;
    /** Called when the selected value changes. */
    onValueChange?: (value: string) => void;
    children: JSX.Element;
}
/** Groups radio items within a menu for single-selection. */
export declare function RadioGroup(props: MenuRadioGroupProps): JSX.Element;
/** Props for a menu radio item. */
export interface MenuRadioItemProps {
    /** The value this item represents. */
    value: string;
    /** Text for typeahead matching. */
    textValue?: string;
    /** Disabled state. */
    disabled?: boolean;
    children: JSX.Element;
}
/** Menu item that acts as a radio button within a RadioGroup (role=menuitemradio). */
export declare function RadioItem(props: MenuRadioItemProps): JSX.Element;
/** Props for a menu label (non-interactive group heading). */
export interface MenuLabelProps {
    class?: string;
    children: JSX.Element;
}
/** Non-interactive label/heading for a group of menu items. */
export declare function Label(props: MenuLabelProps): JSX.Element;
/** Props for a sub-menu container. */
export interface MenuSubProps {
    children: JSX.Element;
}
/** Sub-menu provider — manages open state for a nested menu. */
export declare function Sub(props: MenuSubProps): JSX.Element;
/** Props for a sub-menu trigger. */
export interface MenuSubTriggerProps {
    /** Text for typeahead matching. */
    textValue?: string;
    /** Disabled state. */
    disabled?: boolean;
    children: JSX.Element;
}
/** Menu item that opens a sub-menu on hover/ArrowRight. */
export declare function SubTrigger(props: MenuSubTriggerProps): JSX.Element;
/** Props for a sub-menu content panel. */
export interface MenuSubContentProps {
    children: JSX.Element;
    class?: string;
    style?: JSX.CSSProperties | string;
}
/** Sub-menu content panel — rendered when the SubTrigger is activated. */
export declare function SubContent(props: MenuSubContentProps): JSX.Element;
//# sourceMappingURL=menu.d.ts.map