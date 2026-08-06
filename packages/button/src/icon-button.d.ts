/**
 * IconButton — A strict wrapper around Button.Root that requires aria-label,
 * enforces equal width/height (size="icon"), and hides standard text children.
 */
import { type JSX } from "@solidjs/web";
import { type ButtonProps } from "./index";
export interface IconButtonProps extends Omit<ButtonProps, "children"> {
    /** Required accessible label since the button has no visible text. */
    "aria-label": string;
    /** Icon element to render inside the button. */
    children: JSX.Element;
}
export declare function IconButton(props: IconButtonProps): JSX.Element;
//# sourceMappingURL=icon-button.d.ts.map