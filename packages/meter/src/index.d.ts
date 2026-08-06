/**
 * @solidiom/meter — Scalar measurement display using the native HTML meter element.
 *
 * Parts: Root.
 *
 * Exposes `data-value` (normalized 0–1) and `data-status` ("safe" | "caution" | "danger")
 * via semantic attributes to enable CSS/Tailwind/UnoCSS styling hooks.
 */
import { type JSX } from "@solidjs/web";
export type { MeterStatus } from "./derive-status";
export { deriveMeterStatus } from "./derive-status";
export interface MeterProps {
    /** Current value. Must be between min and max. */
    value: number;
    /** Minimum bound. Defaults to 0. */
    min?: number;
    /** Maximum bound. Defaults to 1. */
    max?: number;
    /** Low threshold — values at or below this are considered "danger" when optimum is high. */
    low?: number;
    /** High threshold — values at or above this are considered "danger" when optimum is low. */
    high?: number;
    /** The optimum value — determines which end of the range is "safe". */
    optimum?: number;
    class?: string;
    children?: JSX.Element;
}
/**
 * Meter — displays a scalar measurement within a known range.
 * Uses the native `<meter>` element for built-in accessibility semantics.
 */
export declare function Root(props: MeterProps): JSX.Element;
//# sourceMappingURL=index.d.ts.map