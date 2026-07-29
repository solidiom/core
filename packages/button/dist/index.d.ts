/**
 * @solidiom/button — Headless button primitive.
 *
 * Parts: Root, IconButton, ToggleButton, ButtonGroup.
 */
import { type JSX } from "@solidjs/web";
export interface ButtonProps {
    children: JSX.Element;
    disabled?: boolean;
    loading?: boolean;
    onClick?: () => void;
    class?: string;
    type?: "button" | "submit" | "reset";
    "aria-label"?: string;
}
export declare function Root(props: ButtonProps): JSX.Element;
export { IconButton, type IconButtonProps } from "./icon-button";
export { ToggleButton, type ToggleButtonProps } from "./toggle-button";
export { ButtonGroup, type ButtonGroupProps } from "./button-group";
//# sourceMappingURL=index.d.ts.map