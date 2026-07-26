/**
 * Styled Checkbox — Tailwind recipe wrapper.
 * Import stylesheet: `import "@solidiom/recipes-tailwind/styles/checkbox.css"`
 */
import { type JSX } from "@solidjs/web";
import { type Accessor } from "solid-js";
import * as Checkbox from "@solidiom/checkbox";
export declare function StyledCheckbox(props: {
    checked?: Accessor<Checkbox.CheckedState | undefined>;
    defaultChecked?: Checkbox.CheckedState;
    onCheckedChange?: (checked: Checkbox.CheckedState) => void;
    disabled?: boolean;
    children?: JSX.Element;
}): JSX.Element;
//# sourceMappingURL=checkbox.d.ts.map