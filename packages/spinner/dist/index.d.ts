/**
 * @solidiom/spinner — Loading spinner indicator primitive.
 *
 * Parts: Root.
 *
 * Renders a `<span>` with `role="status"` and a configurable `aria-label`.
 * Accepts optional children for custom spinner visuals.
 */
import { type JSX } from "@solidjs/web";
export interface SpinnerRootProps {
    /** Accessible label announced by screen readers. Defaults to "Loading". */
    label?: string;
    class?: string;
    style?: JSX.CSSProperties | string;
    /** Optional custom spinner content. */
    children?: JSX.Element;
}
/**
 * Spinner primitive — renders a `<span>` with role="status" and semantic attributes.
 *
 * Emits `data-scope="spinner"`, `data-part="root"`.
 */
export declare function Root(props: SpinnerRootProps): JSX.Element;
//# sourceMappingURL=index.d.ts.map