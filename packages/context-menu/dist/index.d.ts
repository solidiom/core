/**
 * @solidiom/context-menu — Right-click triggered menu.
 * Parts: Root, Trigger, Content, Item, CheckboxItem, RadioGroup, RadioItem, Separator, Label.
 */
import { type JSX } from "@solidjs/web";
export interface ContextMenuRootProps {
    children: JSX.Element;
}
export interface ContextMenuTriggerProps {
    children: JSX.Element;
    class?: string;
}
export interface ContextMenuContentProps {
    children: JSX.Element;
    class?: string;
    style?: JSX.CSSProperties | string;
}
export interface ContextMenuItemProps {
    textValue?: string;
    disabled?: boolean;
    onSelect?: () => void;
    children: JSX.Element;
}
export interface ContextMenuCheckboxItemProps {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    textValue?: string;
    disabled?: boolean;
    children: JSX.Element;
}
export interface ContextMenuRadioGroupProps {
    value?: string;
    onValueChange?: (value: string) => void;
    children: JSX.Element;
}
export interface ContextMenuRadioItemProps {
    value: string;
    textValue?: string;
    disabled?: boolean;
    children: JSX.Element;
}
export interface ContextMenuSeparatorProps {
    class?: string;
}
export interface ContextMenuLabelProps {
    class?: string;
    children: JSX.Element;
}
export declare function Root(props: ContextMenuRootProps): JSX.Element;
export declare function Trigger(props: ContextMenuTriggerProps): JSX.Element;
export declare function Content(props: ContextMenuContentProps): JSX.Element;
export declare function Item(props: ContextMenuItemProps): JSX.Element;
export declare function CheckboxItem(props: ContextMenuCheckboxItemProps): JSX.Element;
export declare function RadioGroup(props: ContextMenuRadioGroupProps): JSX.Element;
export declare function RadioItem(props: ContextMenuRadioItemProps): JSX.Element;
export declare function Separator(props: ContextMenuSeparatorProps): JSX.Element;
export declare function Label(props: ContextMenuLabelProps): JSX.Element;
//# sourceMappingURL=index.d.ts.map