/**
 * @solidiom/visually-hidden — Hides content visually while keeping it accessible to screen readers.
 *
 * Parts: Root.
 */
import { type JSX } from "@solidjs/web";
export interface VisuallyHiddenProps {
    children: JSX.Element;
    class?: string;
}
/**
 * Visually hides content while keeping it in the accessibility tree.
 * Useful for screen-reader-only labels, descriptions, and announcements.
 */
export declare function Root(props: VisuallyHiddenProps): JSX.Element;
//# sourceMappingURL=index.d.ts.map