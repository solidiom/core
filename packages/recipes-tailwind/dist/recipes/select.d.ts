/**
 * Styled Select — Tailwind recipe wrapper.
 * Import stylesheet: `import "@solidiom/recipes-tailwind/styles/select.css"`
 */
import { type JSX } from "@solidjs/web";
import { type Accessor } from "solid-js";
import { type ChangeDetails } from "@solidiom/runtime";
export declare function StyledSelect(props: {
    trigger: JSX.Element;
    children: JSX.Element;
    value?: Accessor<string | string[] | undefined>;
    onValueChange?: (value: string | string[], details: ChangeDetails<string>) => void;
}): JSX.Element;
//# sourceMappingURL=select.d.ts.map