/**
 * @solidiom/slider — Slider context.
 *
 * Provides shared slider state and interaction handlers to all slider parts.
 */
import { type Accessor } from "solid-js";
/** Orientation of the slider. */
export type SliderOrientation = "horizontal" | "vertical";
/** Context shape shared among all slider parts. */
export interface SliderContextValue {
    /** Array of current thumb values. */
    values: Accessor<number[]>;
    /** Minimum allowed value. */
    min: number;
    /** Maximum allowed value. */
    max: number;
    /** Step increment. */
    step: number;
    /** Whether the slider is disabled. */
    disabled: Accessor<boolean>;
    /** Slider orientation. */
    orientation: SliderOrientation;
    /** Request value change for a thumb at the given index. */
    requestValueChange: (index: number, next: number, reason: "drag" | "keyboard") => void;
    /** Get the percentage position for a given value. */
    getPercentage: (value: number) => number;
    /** Reference to the track element for pointer calculations. */
    trackRef: Accessor<HTMLElement | undefined>;
    /** Set the track element reference. */
    setTrackRef: (el: HTMLElement | undefined) => void;
}
declare const SliderContext: import("solid-js").Context<SliderContextValue>;
/**
 * Provides slider context to descendant parts.
 *
 * @internal Used by Root to supply context.
 */
export { SliderContext };
/**
 * Consumes the slider context. Throws if used outside a SliderRoot.
 */
export declare function useSliderContext(): SliderContextValue;
//# sourceMappingURL=slider-context.d.ts.map