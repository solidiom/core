/**
 * @solidiom/slider — Headless slider primitive.
 *
 * Parts: Root, Track, Range, Thumb.
 * Supports multiple thumbs, keyboard/pointer interaction, horizontal/vertical orientation.
 *
 * @example
 * ```tsx
 * import * as Slider from "@solidiom/slider"
 *
 * <Slider.Root defaultValue={[50]} min={0} max={100} step={1}>
 *   <Slider.Track>
 *     <Slider.Range />
 *     <Slider.Thumb index={0} aria-label="Volume" />
 *   </Slider.Track>
 * </Slider.Root>
 * ```
 */

export { Root, Track, Range, Thumb } from "./slider"
export type {
  SliderRootProps,
  SliderTrackProps,
  SliderRangeProps,
  SliderThumbProps,
} from "./slider"
export { useSliderContext, type SliderContextValue, type SliderOrientation } from "./slider-context"
