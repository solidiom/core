/**
 * Styled Dialog — Tailwind recipe wrapper.
 * Applies Tailwind classes via semantic data-* attribute stylesheet.
 * Import stylesheet: `import "@solidiom/recipes-tailwind/styles/dialog.css"`
 */
import { type JSX } from "@solidjs/web";
export declare function StyledDialog(props: {
    trigger: JSX.Element;
    title: string;
    description?: string;
    children?: JSX.Element;
    open?: () => boolean;
    onOpenChange?: (open: boolean) => void;
}): JSX.Element;
//# sourceMappingURL=dialog.d.ts.map