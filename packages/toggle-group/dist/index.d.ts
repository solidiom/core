/**
 * @solidiom/toggle-group — Group of toggle buttons (mutually-exclusive or multi-select).
 *
 * Parts: Root, Item.
 */
import { type Accessor } from "solid-js";
import { type JSX } from "@solidjs/web";
export interface ToggleGroupRootProps {
    /** Selection mode: "single" allows one active item, "multiple" allows many. */
    type?: "single" | "multiple";
    /** Controlled value. */
    value?: Accessor<string[] | undefined>;
    /** Default value (uncontrolled). */
    defaultValue?: string[];
    /** Called when the selected values change. */
    onValueChange?: (value: string[]) => void;
    disabled?: boolean;
    /** Layout orientation. */
    orientation?: "horizontal" | "vertical";
    class?: string;
    style?: JSX.CSSProperties | string;
    children: JSX.Element;
}
/**
 * ToggleGroup root — wraps toggle items with `role="group"`.
 *
 * Emits `data-scope="toggle-group"`, `data-part="root"`.
 */
export declare function Root(props: ToggleGroupRootProps): JSX.Element;
export interface ToggleGroupItemProps {
    /** The value this item represents. */
    value: string;
    disabled?: boolean;
    class?: string;
    style?: JSX.CSSProperties | string;
    children: JSX.Element;
}
/**
 * ToggleGroup item — individual toggle button.
 *
 * Emits `data-scope="toggle-group"`, `data-part="item"`, `data-state="on"|"off"`.
 */
export declare function Item(props: ToggleGroupItemProps): JSX.Element;
//# sourceMappingURL=index.d.ts.map