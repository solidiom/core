/**
 * @solidiom/skeleton — Headless skeleton loading placeholder primitive.
 *
 * Parts: Root.
 *
 * Renders a decorative placeholder div with pulse animation support.
 * Marked aria-hidden since it conveys no semantic content.
 */
import { type JSX } from "@solidjs/web";
export interface SkeletonRootProps {
    /** Shape variant. Defaults to "text". */
    variant?: "text" | "circular" | "rectangular";
    /** Explicit width. */
    width?: string | number;
    /** Explicit height. */
    height?: string | number;
    class?: string;
    style?: JSX.CSSProperties | string;
}
/**
 * Skeleton root — renders a `div` placeholder for loading states.
 *
 * Emits `data-scope="skeleton"`, `data-part="root"`, `data-variant`.
 * Marked `aria-hidden="true"` as it is purely decorative.
 */
export declare function Root(props: SkeletonRootProps): JSX.Element;
//# sourceMappingURL=index.d.ts.map