/**
 * @solidiom/separator — Headless separator primitive for horizontal or vertical dividers.
 *
 * Parts: Root.
 */
import { type JSX } from "@solidjs/web";
export interface RootProps {
    /** Orientation of the separator. */
    orientation?: "horizontal" | "vertical";
    /** When true, the separator is purely decorative (role="none"). */
    decorative?: boolean;
    class?: string;
    style?: JSX.CSSProperties | string;
}
/**
 * Separator root element.
 *
 * Renders with `role="separator"` by default for accessibility.
 * When `decorative` is true, renders with `role="none"` to hide from
 * the accessibility tree.
 */
export declare function Root(props: RootProps): JSX.Element;
//# sourceMappingURL=index.d.ts.map