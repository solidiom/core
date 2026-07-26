/**
 * @solidiom/slider — Headless slider primitive with pointer and keyboard interaction.
 *
 * Parts: Root, Track, Range, Thumb.
 * Supports horizontal/vertical orientation, multiple thumbs, min/max/step clamping.
 */
import { type Accessor } from "solid-js";
import { type JSX } from "@solidjs/web";
import { type SliderOrientation } from "./slider-context";
/** Props for the Slider Root component. */
export interface SliderRootProps {
    /** Controlled value(s). Single number or array for multiple thumbs. */
    value?: Accessor<number[] | undefined>;
    /** Default value(s) for uncontrolled mode. */
    defaultValue?: number[];
    /** Callback when any thumb value changes. */
    onValueChange?: (values: number[]) => void;
    /** Minimum value. Defaults to 0. */
    min?: number;
    /** Maximum value. Defaults to 100. */
    max?: number;
    /** Step increment. Defaults to 1. */
    step?: number;
    /** Whether the slider is disabled. */
    disabled?: boolean;
    /** Orientation. Defaults to "horizontal". */
    orientation?: SliderOrientation;
    /** CSS class. */
    class?: string;
    /** Child elements (Track, Thumb, etc). */
    children: JSX.Element;
}
/**
 * Slider Root — provides context and state to all slider parts.
 *
 * Manages controlled/uncontrolled values for one or more thumbs.
 */
export declare function Root(props: SliderRootProps): JSX.Element;
/** Props for the Slider Track component. */
export interface SliderTrackProps {
    /** Child elements (Range, Thumb). */
    children: JSX.Element;
    /** Optional pointer-down handler from consumer. */
    onPointerDown?: (event: PointerEvent) => void;
}
/**
 * Slider Track — clickable/draggable region. Pointer down on track snaps the nearest thumb.
 */
export declare function Track(props: SliderTrackProps): JSX.Element;
/** Props for the Slider Range (fill) component. */
export interface SliderRangeProps {
    /** Index of thumb this range represents (for multi-thumb). Defaults to 0. */
    index?: number;
}
/**
 * Slider Range — visual fill between min (or previous thumb) and the thumb value.
 */
export declare function Range(props: SliderRangeProps): JSX.Element;
/** Props for the Slider Thumb component. */
export interface SliderThumbProps {
    /** Index of this thumb (for multiple thumbs). Defaults to 0. */
    index?: number;
    /** Optional aria-label for the thumb. */
    "aria-label"?: string;
    /** Child content. */
    children?: JSX.Element;
}
/**
 * Slider Thumb — draggable handle with keyboard support.
 *
 * Implements pointer drag (setPointerCapture) and full keyboard navigation:
 * - ArrowRight/ArrowUp: increase by step
 * - ArrowLeft/ArrowDown: decrease by step
 * - PageUp: increase by 10*step
 * - PageDown: decrease by 10*step
 * - Home: set to min
 * - End: set to max
 */
export declare function Thumb(props: SliderThumbProps): JSX.Element;
//# sourceMappingURL=slider.d.ts.map