/**
 * @solidiom/slider — Headless slider primitive with pointer and keyboard interaction.
 *
 * Parts: Root, Track, Range, Thumb.
 * Supports horizontal/vertical orientation, multiple thumbs, min/max/step clamping.
 */

import { type Accessor, createSignal, onCleanup } from "solid-js"
import { type JSX } from "@solidjs/web"
import {
  createControllableValue,
  createChangeDetails,
  applySemanticAttrs,
  composeEventHandlers,
} from "@solidiom/runtime"
import { SliderContext, type SliderOrientation, useSliderContext } from "./slider-context"

// ─── Utilities ─────────────────────────────────────────────────────────────────

/** Clamps a value to min/max aligned to step. */
function clamp(value: number, min: number, max: number, step: number): number {
  const clamped = Math.min(Math.max(value, min), max)
  const stepped = Math.round((clamped - min) / step) * step + min
  return Math.min(stepped, max)
}

/** Converts a pointer position to a slider value. */
function positionToValue(
  position: number,
  trackRect: DOMRect,
  min: number,
  max: number,
  step: number,
  orientation: SliderOrientation,
): number {
  const trackSize = orientation === "horizontal" ? trackRect.width : trackRect.height
  const offset =
    orientation === "horizontal" ? position - trackRect.left : trackRect.bottom - position
  const ratio = Math.min(Math.max(offset / trackSize, 0), 1)
  const raw = min + ratio * (max - min)
  return clamp(raw, min, max, step)
}

// ─── Root ──────────────────────────────────────────────────────────────────────

/** Props for the Slider Root component. */
export interface SliderRootProps {
  /** Controlled value(s). Single number or array for multiple thumbs. */
  value?: Accessor<number[] | undefined>
  /** Default value(s) for uncontrolled mode. */
  defaultValue?: number[]
  /** Callback when any thumb value changes. */
  onValueChange?: (values: number[]) => void
  /** Minimum value. Defaults to 0. */
  min?: number
  /** Maximum value. Defaults to 100. */
  max?: number
  /** Step increment. Defaults to 1. */
  step?: number
  /** Whether the slider is disabled. */
  disabled?: boolean
  /** Orientation. Defaults to "horizontal". */
  orientation?: SliderOrientation
  /** CSS class. */
  class?: string
  /** Child elements (Track, Thumb, etc). */
  children: JSX.Element
}

/**
 * Slider Root — provides context and state to all slider parts.
 *
 * Manages controlled/uncontrolled values for one or more thumbs.
 */
export function Root(props: SliderRootProps) {
  const min = props.min ?? 0
  const max = props.max ?? 100
  const step = props.step ?? 1
  const orientation = props.orientation ?? "horizontal"
  const disabled = () => props.disabled ?? false

  const { value, requestChange } = createControllableValue<number[], "drag" | "keyboard">({
    value: props.value,
    defaultValue: props.defaultValue ?? [min],
    onChange: (next) => props.onValueChange?.(next),
    equals: (a, b) => a.length === b.length && a.every((v, i) => v === b[i]),
  })

  const [trackRef, setTrackRef] = createSignal<HTMLElement | undefined>(undefined)

  const getPercentage = (val: number): number => {
    if (max === min) return 0
    return ((val - min) / (max - min)) * 100
  }

  const requestValueChange = (index: number, next: number, reason: "drag" | "keyboard") => {
    const current = value()
    const clamped = clamp(next, min, max, step)
    const updated = [...current]
    updated[index] = clamped
    requestChange(updated, createChangeDetails(reason))
  }

  const contextValue = {
    values: value,
    min,
    max,
    step,
    disabled,
    orientation,
    requestValueChange,
    getPercentage,
    trackRef,
    setTrackRef,
  }

  return (
    <SliderContext value={contextValue}>
      <div
        role="group"
        aria-label="Slider"
        class={props.class}
        {...applySemanticAttrs({
          scope: "slider",
          part: "root",
          disabled: disabled(),
          orientation,
        })}
      >
        {props.children}
      </div>
    </SliderContext>
  )
}

// ─── Track ─────────────────────────────────────────────────────────────────────

/** Props for the Slider Track component. */
export interface SliderTrackProps {
  /** Child elements (Range, Thumb). */
  children: JSX.Element
  /** Optional pointer-down handler from consumer. */
  onPointerDown?: (event: PointerEvent) => void
}

/**
 * Slider Track — clickable/draggable region. Pointer down on track snaps the nearest thumb.
 */
export function Track(props: SliderTrackProps) {
  const ctx = useSliderContext()

  const handlePointerDown = (event: PointerEvent) => {
    if (ctx.disabled()) return
    if (event.button !== 0) return

    const trackEl = ctx.trackRef()
    if (!trackEl) return

    const rect = trackEl.getBoundingClientRect()
    const newValue = positionToValue(
      ctx.orientation === "horizontal" ? event.clientX : event.clientY,
      rect,
      ctx.min,
      ctx.max,
      ctx.step,
      ctx.orientation,
    )

    // Find nearest thumb
    const values = ctx.values()
    let nearestIdx = 0
    let nearestDist = Math.abs(values[0]! - newValue)
    for (let i = 1; i < values.length; i++) {
      const dist = Math.abs(values[i]! - newValue)
      if (dist < nearestDist) {
        nearestDist = dist
        nearestIdx = i
      }
    }

    ctx.requestValueChange(nearestIdx, newValue, "drag")
  }

  const composedPointerDown = composeEventHandlers<PointerEvent>(
    props.onPointerDown,
    handlePointerDown,
  )

  return (
    <div
      ref={(el) => ctx.setTrackRef(el)}
      onPointerDown={composedPointerDown}
      {...applySemanticAttrs({ scope: "slider", part: "track", orientation: ctx.orientation })}
    >
      {props.children}
    </div>
  )
}

// ─── Range ─────────────────────────────────────────────────────────────────────

/** Props for the Slider Range (fill) component. */
export interface SliderRangeProps {
  /** Index of thumb this range represents (for multi-thumb). Defaults to 0. */
  index?: number
}

/**
 * Slider Range — visual fill between min (or previous thumb) and the thumb value.
 */
export function Range(props: SliderRangeProps) {
  const ctx = useSliderContext()
  const index = props.index ?? 0

  const style = (): JSX.CSSProperties => {
    const values = ctx.values()
    const startPercent = index === 0 ? 0 : ctx.getPercentage(values[index - 1]!)
    const endPercent = ctx.getPercentage(values[index] ?? values[0]!)

    if (ctx.orientation === "horizontal") {
      return {
        position: "absolute",
        left: `${startPercent}%`,
        width: `${endPercent - startPercent}%`,
      }
    }
    return {
      position: "absolute",
      bottom: `${startPercent}%`,
      height: `${endPercent - startPercent}%`,
    }
  }

  return (
    <div
      style={style()}
      {...applySemanticAttrs({ scope: "slider", part: "range", orientation: ctx.orientation })}
    />
  )
}

// ─── Thumb ─────────────────────────────────────────────────────────────────────

/** Props for the Slider Thumb component. */
export interface SliderThumbProps {
  /** Index of this thumb (for multiple thumbs). Defaults to 0. */
  index?: number
  /** Optional aria-label for the thumb. */
  "aria-label"?: string
  /** Child content. */
  children?: JSX.Element
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
export function Thumb(props: SliderThumbProps) {
  const ctx = useSliderContext()
  const index = () => props.index ?? 0

  const currentValue = () => ctx.values()[index()] ?? ctx.min

  const style = (): JSX.CSSProperties => {
    const percent = ctx.getPercentage(currentValue())
    if (ctx.orientation === "horizontal") {
      return { position: "absolute", left: `${percent}%`, translate: "-50% 0" }
    }
    return { position: "absolute", bottom: `${percent}%`, translate: "0 50%" }
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (ctx.disabled()) return

    const val = currentValue()
    let next: number | undefined

    switch (event.key) {
      case "ArrowRight":
      case "ArrowUp":
        next = val + ctx.step
        break
      case "ArrowLeft":
      case "ArrowDown":
        next = val - ctx.step
        break
      case "PageUp":
        next = val + ctx.step * 10
        break
      case "PageDown":
        next = val - ctx.step * 10
        break
      case "Home":
        next = ctx.min
        break
      case "End":
        next = ctx.max
        break
      default:
        return
    }

    event.preventDefault()
    ctx.requestValueChange(index(), next, "keyboard")
  }

  const handlePointerDown = (event: PointerEvent) => {
    if (ctx.disabled()) return
    if (event.button !== 0) return

    const target = event.currentTarget as HTMLElement
    target.setPointerCapture(event.pointerId)
    target.focus()

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const trackEl = ctx.trackRef()
      if (!trackEl) return
      const rect = trackEl.getBoundingClientRect()
      const newValue = positionToValue(
        ctx.orientation === "horizontal" ? moveEvent.clientX : moveEvent.clientY,
        rect,
        ctx.min,
        ctx.max,
        ctx.step,
        ctx.orientation,
      )
      ctx.requestValueChange(index(), newValue, "drag")
    }

    const handlePointerUp = () => {
      target.releasePointerCapture(event.pointerId)
      target.removeEventListener("pointermove", handlePointerMove)
      target.removeEventListener("pointerup", handlePointerUp)
    }

    target.addEventListener("pointermove", handlePointerMove)
    target.addEventListener("pointerup", handlePointerUp)
  }

  onCleanup(() => {
    // No-op: event listeners are cleaned up in pointerup handler
  })

  return (
    <div
      role="slider"
      tabindex={ctx.disabled() ? -1 : 0}
      aria-valuemin={ctx.min}
      aria-valuemax={ctx.max}
      aria-valuenow={currentValue()}
      aria-orientation={ctx.orientation}
      aria-disabled={ctx.disabled() ? "true" : undefined}
      aria-label={props["aria-label"]}
      style={style()}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      {...applySemanticAttrs({
        scope: "slider",
        part: "thumb",
        disabled: ctx.disabled(),
        orientation: ctx.orientation,
      })}
    >
      {props.children}
    </div>
  )
}
