/**
 * @solidiom/toolbar — Grouped actions/controls in a horizontal bar.
 *
 * Parts: Root, Button, Separator, ToggleGroup, ToggleItem.
 */
import { type JSX } from "@solidjs/web";
export interface ToolbarRootProps {
    orientation?: "horizontal" | "vertical";
    class?: string;
    style?: JSX.CSSProperties | string;
    children: JSX.Element;
}
export declare function Root(props: ToolbarRootProps): JSX.Element;
export interface ToolbarButtonProps {
    disabled?: boolean;
    onClick?: () => void;
    class?: string;
    children: JSX.Element;
}
export declare function Button(props: ToolbarButtonProps): JSX.Element;
export interface ToolbarSeparatorProps {
    class?: string;
}
export declare function Separator(props: ToolbarSeparatorProps): JSX.Element;
export interface ToolbarToggleGroupProps {
    type?: "single" | "multiple";
    class?: string;
    children: JSX.Element;
}
export declare function ToggleGroup(props: ToolbarToggleGroupProps): JSX.Element;
export interface ToolbarToggleItemProps {
    pressed?: boolean;
    onPressedChange?: (pressed: boolean) => void;
    disabled?: boolean;
    class?: string;
    children: JSX.Element;
}
export declare function ToggleItem(props: ToolbarToggleItemProps): JSX.Element;
//# sourceMappingURL=index.d.ts.map