/**
 * @solidiom/toggle — A two-state button that can be toggled on or off.
 *
 * Parts: Root.
 */
import { type Accessor } from "solid-js";
import { type JSX } from "@solidjs/web";
export interface ToggleRootProps {
    /** Controlled pressed state. */
    pressed?: Accessor<boolean | undefined>;
    /** Default pressed state (uncontrolled). */
    defaultPressed?: boolean;
    /** Called when pressed state changes. */
    onPressedChange?: (pressed: boolean) => void;
    /** Whether the toggle is disabled. */
    disabled?: boolean;
    class?: string;
    style?: JSX.CSSProperties | string;
    children?: JSX.Element;
}
/**
 * Toggle root — a two-state button with `aria-pressed`.
 *
 * Emits `data-scope="toggle"`, `data-part="root"`, `data-state="on"|"off"`.
 */
export declare function Root(props: ToggleRootProps): JSX.Element;
//# sourceMappingURL=index.d.ts.map