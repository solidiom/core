/**
 * ButtonGroup — A layout wrapper that handles grouped button styling.
 * Removes inner border-radiuses and handles overlapping borders via CSS selectors.
 */
import { type JSX } from "@solidjs/web";
export interface ButtonGroupProps {
    children: JSX.Element;
    /** Orientation of the group layout. */
    orientation?: "horizontal" | "vertical";
    class?: string;
}
export declare function ButtonGroup(props: ButtonGroupProps): JSX.Element;
//# sourceMappingURL=button-group.d.ts.map