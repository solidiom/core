/**
 * Styled Dialog — CSS recipe wrapper.
 * Composes @solidiom/dialog with plain CSS classes targeting semantic attributes.
 * Import the stylesheet separately: `import "@solidiom/recipes-css/styles/dialog.css"`
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