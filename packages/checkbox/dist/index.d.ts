/**
 * @solidiom/checkbox — Headless checkbox primitive with checked, unchecked, and indeterminate states.
 *
 * Parts: Root, Indicator, Group.
 */
import { type Accessor } from "solid-js";
import { type JSX } from "@solidjs/web";
export type CheckedState = boolean | "indeterminate";
interface CheckboxGroupContextValue {
    value: Accessor<string[]>;
    toggle: (itemValue: string) => void;
    disabled: boolean | undefined;
}
export interface CheckboxGroupProps {
    /** Controlled value — array of checked item values. */
    value?: Accessor<string[] | undefined>;
    /** Default value (uncontrolled). */
    defaultValue?: string[];
    /** Called when the set of checked values changes. */
    onValueChange?: (value: string[]) => void;
    disabled?: boolean;
    class?: string;
    style?: JSX.CSSProperties | string;
    children: JSX.Element;
}
/**
 * CheckboxGroup — wraps multiple checkboxes for multi-select with a shared value array.
 *
 * Each child Checkbox.Root with a `value` prop automatically integrates with the group.
 */
export declare function Group(props: CheckboxGroupProps): JSX.Element;
/** Hook to access the CheckboxGroup context (if present). */
export declare function useCheckboxGroup(): CheckboxGroupContextValue;
export interface CheckboxRootProps {
    checked?: Accessor<CheckedState | undefined>;
    defaultChecked?: CheckedState;
    onCheckedChange?: (checked: CheckedState) => void;
    /** When used inside a CheckboxGroup, identifies this checkbox's value. */
    value?: string;
    disabled?: boolean;
    name?: string;
    required?: boolean;
    class?: string;
    style?: JSX.CSSProperties | string;
    children: JSX.Element;
}
export declare function Root(props: CheckboxRootProps): JSX.Element;
export interface CheckboxIndicatorProps {
    class?: string;
    style?: JSX.CSSProperties | string;
    children: JSX.Element;
}
export declare function Indicator(props: CheckboxIndicatorProps): JSX.Element;
export {};
//# sourceMappingURL=index.d.ts.map