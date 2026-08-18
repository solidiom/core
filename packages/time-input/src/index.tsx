/**
 * @solidiom/time-input — Segmented time entry with hour, minute, second fields and AM/PM toggle.
 *
 * Parts: Root, Segment, Separator.
 *
 * Headless primitive providing accessible segmented time input with spinbutton
 * semantics, keyboard navigation, auto-advance, and native form participation.
 */

import { createSignal, createContext, useContext, type Accessor } from "solid-js"
import { type JSX } from "@solidjs/web"
import {
  applySemanticAttrs,
  createSegmentedEditing,
  createTimeMath,
  createStableId,
  getHiddenInputProps,
  type TimeValue,
  type HourCycle,
  type SegmentDefinition,
} from "@solidiom/runtime"

// ─── Types ──────────────────────────────────────────────────────────────────

export interface TimeInputValue {
  hour: number
  minute: number
  second?: number
}

export interface TimeInputRootProps {
  /** Controlled time value. */
  value?: TimeInputValue
  /** Default time value (uncontrolled). */
  defaultValue?: TimeInputValue
  /** Called when the time value changes. */
  onValueChange?: (value: { hour: number; minute: number; second: number }) => void
  /** Hour cycle: "12" for AM/PM, "24" for 24-hour. */
  hourCycle?: HourCycle
  /** Whether to show the seconds segment. */
  showSeconds?: boolean
  /** Minimum allowed time. */
  min?: TimeInputValue
  /** Maximum allowed time. */
  max?: TimeInputValue
  /** Whether the input is disabled. */
  disabled?: boolean
  /** Whether the input is read-only. */
  readOnly?: boolean
  /** Whether the field is required. */
  required?: boolean
  /** Whether the field is invalid. */
  invalid?: boolean
  /** Form field name. */
  name?: string
  /** Element id. */
  id?: string
  /** Locale for formatting. */
  locale?: string
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}

export interface TimeInputSegmentProps {
  /** Segment type: "hour", "minute", "second", or "period". */
  type: "hour" | "minute" | "second" | "period"
  class?: string
  style?: JSX.CSSProperties | string
}

export interface TimeInputSeparatorProps {
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface TimeInputContextValue {
  /** Current time value (reactive). */
  timeValue: Accessor<TimeValue>
  /** Hour cycle in use. */
  hourCycle: Accessor<HourCycle>
  /** Whether seconds are shown. */
  showSeconds: Accessor<boolean>
  /** Disabled state. */
  disabled: boolean | undefined
  /** Read-only state. */
  readOnly: boolean | undefined
  /** Get the display value for a segment type. */
  getSegmentDisplay: (type: "hour" | "minute" | "second" | "period") => string
  /** Whether a specific segment is focused. */
  isSegmentFocused: (type: "hour" | "minute" | "second" | "period") => boolean
  /** Focus a segment by type. */
  focusSegment: (type: "hour" | "minute" | "second" | "period") => void
  /** Handle keydown on a segment. */
  handleKeyDown: (event: KeyboardEvent) => void
  /** Handle text input on a segment. */
  handleInput: (text: string, event?: Event) => void
  /** Get ARIA props for a segment. */
  getSegmentAriaProps: (type: "hour" | "minute" | "second" | "period") => Record<string, unknown>
}

const TimeInputContext = createContext<TimeInputContextValue>()

function useTimeInputContext(): TimeInputContextValue {
  const ctx = useContext(TimeInputContext)
  if (!ctx) {
    throw new Error("[solidiom] TimeInput.Segment/Separator must be used within TimeInput.Root")
  }
  return ctx
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toTimeValue(input: TimeInputValue): TimeValue {
  return {
    hour: input.hour,
    minute: input.minute,
    second: input.second ?? 0,
    millisecond: 0,
  }
}

function toISOTimeString(time: TimeValue): string {
  const h = String(time.hour).padStart(2, "0")
  const m = String(time.minute).padStart(2, "0")
  const s = String(time.second).padStart(2, "0")
  return `${h}:${m}:${s}`
}

// ─── Root ────────────────────────────────────────────────────────────────────

/**
 * TimeInput root — manages segmented time editing state and provides context.
 *
 * Emits `data-scope="time-input"`, `data-part="root"`, plus state flags.
 */
export function Root(props: TimeInputRootProps) {
  const timeMath = createTimeMath()
  const rootId = props.id ?? createStableId("time-input")
  const resolvedHourCycle = (): HourCycle => props.hourCycle ?? "12"
  const resolvedShowSeconds = (): boolean => props.showSeconds ?? false

  // ─── Internal state ──────────────────────────────────────────────────

  const defaultTime = props.defaultValue
    ? toTimeValue(props.defaultValue)
    : timeMath.createTime(0, 0, 0)

  const [internalTime, setInternalTime] = createSignal<TimeValue>(defaultTime)

  const currentTime = (): TimeValue => {
    if (props.value !== undefined) {
      return toTimeValue(props.value)
    }
    return internalTime()
  }

  // ─── Segment definitions ─────────────────────────────────────────────

  const getSegmentDefs = (): SegmentDefinition[] => {
    const hourCycle = resolvedHourCycle()
    const showSec = resolvedShowSeconds()

    const defs: SegmentDefinition[] = [
      {
        id: "hour",
        type: "numeric",
        min: hourCycle === "12" ? 1 : 0,
        max: hourCycle === "12" ? 12 : 23,
        maxLength: 2,
        placeholder: "––",
        padZero: true,
      },
      {
        id: "minute",
        type: "numeric",
        min: 0,
        max: 59,
        maxLength: 2,
        placeholder: "––",
        padZero: true,
      },
    ]

    if (showSec) {
      defs.push({
        id: "second",
        type: "numeric",
        min: 0,
        max: 59,
        maxLength: 2,
        placeholder: "––",
        padZero: true,
      })
    }

    if (hourCycle === "12") {
      defs.push({
        id: "period",
        type: "text",
        maxLength: 2,
        placeholder: "AM",
        editable: true,
        allowedValues: ["AM", "PM"],
      })
    }

    return defs
  }

  // ─── Segmented editing ───────────────────────────────────────────────

  const getInitialValues = (): Record<string, string> => {
    const time = currentTime()
    const segments = timeMath.toSegments(time, resolvedHourCycle())
    const values: Record<string, string> = {
      hour: segments.hour,
      minute: segments.minute,
      second: segments.second,
    }
    if (resolvedHourCycle() === "12" && segments.period) {
      values.period = segments.period
    }
    return values
  }

  const [segmentValues, setSegmentValues] = createSignal<Record<string, string>>(getInitialValues())

  const editing = createSegmentedEditing({
    segments: getSegmentDefs,
    values: segmentValues,
    disabled: () => props.disabled ?? false,
    readOnly: () => props.readOnly ?? false,
    separators: [":"],
    onChange(values, _details) {
      setSegmentValues(values)

      // Reconstruct time value from segments
      const hourCycle = resolvedHourCycle()
      const timeSegments = {
        hour: values.hour ?? "0",
        minute: values.minute ?? "0",
        second: values.second ?? "0",
        millisecond: "0",
        period: hourCycle === "12" ? (values.period ?? "AM") : undefined,
      }
      const newTime = timeMath.fromSegments(timeSegments, hourCycle)

      // Apply min/max clamping
      const minTime = props.min ? toTimeValue(props.min) : undefined
      const maxTime = props.max ? toTimeValue(props.max) : undefined
      const clampedTime = timeMath.clamp(newTime, minTime, maxTime)

      if (props.value === undefined) {
        setInternalTime(clampedTime)
      }

      props.onValueChange?.({
        hour: clampedTime.hour,
        minute: clampedTime.minute,
        second: clampedTime.second,
      })
    },
  })

  // Sync controlled value back to segment values
  const syncSegmentValues = (): Record<string, string> => {
    const time = currentTime()
    const segments = timeMath.toSegments(time, resolvedHourCycle())
    const values: Record<string, string> = {
      hour: segments.hour,
      minute: segments.minute,
      second: segments.second,
    }
    if (resolvedHourCycle() === "12" && segments.period) {
      values.period = segments.period
    }
    return values
  }

  // ─── Segment display and focus ──────────────────────────────────────

  const getSegmentDisplay = (type: "hour" | "minute" | "second" | "period"): string => {
    const vals = props.value !== undefined ? syncSegmentValues() : segmentValues()
    const raw = vals[type] ?? ""
    if (!raw) {
      if (type === "period") return "AM"
      return "––"
    }
    if (type === "period") return raw
    return raw.padStart(2, "0")
  }

  const isSegmentFocused = (type: "hour" | "minute" | "second" | "period"): boolean => {
    return editing.focusedId() === type
  }

  const focusSegmentByType = (type: "hour" | "minute" | "second" | "period"): void => {
    editing.focusSegmentById(type)
  }

  const getSegmentAriaProps = (
    type: "hour" | "minute" | "second" | "period",
  ): Record<string, unknown> => {
    const time = currentTime()
    const hourCycle = resolvedHourCycle()

    if (type === "period") {
      return {
        role: "spinbutton",
        "aria-label": "AM/PM",
        "aria-valuemin": 0,
        "aria-valuemax": 1,
        "aria-valuenow": time.hour < 12 ? 0 : 1,
        "aria-valuetext": timeMath.getDayPeriod(time),
        "aria-disabled": props.disabled ? "true" : undefined,
        "aria-readonly": props.readOnly ? "true" : undefined,
      }
    }

    const labels: Record<string, string> = {
      hour: "Hour",
      minute: "Minute",
      second: "Second",
    }

    const mins: Record<string, number> = {
      hour: hourCycle === "12" ? 1 : 0,
      minute: 0,
      second: 0,
    }

    const maxs: Record<string, number> = {
      hour: hourCycle === "12" ? 12 : 23,
      minute: 59,
      second: 59,
    }

    const currentValues: Record<string, number> = {
      hour: hourCycle === "12" ? timeMath.get12Hour(time) : time.hour,
      minute: time.minute,
      second: time.second,
    }

    return {
      role: "spinbutton",
      "aria-label": labels[type],
      "aria-valuemin": mins[type],
      "aria-valuemax": maxs[type],
      "aria-valuenow": currentValues[type],
      "aria-disabled": props.disabled ? "true" : undefined,
      "aria-readonly": props.readOnly ? "true" : undefined,
    }
  }

  // ─── Hidden input for form participation ─────────────────────────────

  const hiddenInputProps = () => {
    if (!props.name) return []
    return getHiddenInputProps({
      name: props.name,
      value: () => toISOTimeString(currentTime()),
      required: () => props.required ?? false,
      disabled: () => props.disabled ?? false,
    })
  }

  // ─── Context value ───────────────────────────────────────────────────

  const contextValue: TimeInputContextValue = {
    timeValue: currentTime,
    hourCycle: resolvedHourCycle,
    showSeconds: resolvedShowSeconds,
    disabled: props.disabled,
    readOnly: props.readOnly,
    getSegmentDisplay,
    isSegmentFocused,
    focusSegment: focusSegmentByType,
    handleKeyDown: editing.handleKeyDown,
    handleInput: editing.handleInput,
    getSegmentAriaProps,
  }

  return (
    <TimeInputContext value={contextValue}>
      <div
        id={rootId}
        class={props.class}
        style={props.style}
        role="group"
        aria-disabled={props.disabled ? "true" : undefined}
        aria-invalid={props.invalid ? "true" : undefined}
        aria-required={props.required ? "true" : undefined}
        {...applySemanticAttrs({
          scope: "time-input",
          part: "root",
          disabled: props.disabled,
          readonly: props.readOnly,
          required: props.required,
          invalid: props.invalid,
        })}
      >
        {props.children}
        {/* Hidden input(s) for form participation */}
        {hiddenInputProps().map((p) => (
          <input {...p} />
        ))}
      </div>
    </TimeInputContext>
  )
}

// ─── Segment ─────────────────────────────────────────────────────────────────

/**
 * TimeInput segment — individual time segment (hour, minute, second, or period).
 *
 * Emits `data-scope="time-input"`, `data-part="segment"`, and focuses/edits
 * via spinbutton keyboard interaction.
 */
export function Segment(props: TimeInputSegmentProps) {
  const ctx = useTimeInputContext()

  const handleClick = () => {
    ctx.focusSegment(props.type)
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    ctx.focusSegment(props.type)
    ctx.handleKeyDown(e)
  }

  const handleBeforeInput = (e: InputEvent) => {
    e.preventDefault()
    if (e.data) {
      ctx.focusSegment(props.type)
      ctx.handleInput(e.data, e)
    }
  }

  const isFocused = () => ctx.isSegmentFocused(props.type)

  return (
    <span
      class={props.class}
      style={props.style}
      contenteditable={ctx.disabled ? undefined : true}
      inputmode={props.type === "period" ? "text" : "numeric"}
      tabindex={ctx.disabled ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onBeforeInput={handleBeforeInput}
      onFocus={() => ctx.focusSegment(props.type)}
      {...(ctx.getSegmentAriaProps(props.type) as Record<string, string | undefined>)}
      {...applySemanticAttrs({
        scope: "time-input",
        part: "segment",
        disabled: ctx.disabled,
        readonly: ctx.readOnly,
        highlighted: isFocused(),
      })}
      data-type={props.type}
    >
      {ctx.getSegmentDisplay(props.type)}
    </span>
  )
}

// ─── Separator ───────────────────────────────────────────────────────────────

/**
 * TimeInput separator — visual separator between segments (typically ":").
 *
 * Emits `data-scope="time-input"`, `data-part="separator"`.
 */
export function Separator(props: TimeInputSeparatorProps) {
  return (
    <span
      class={props.class}
      style={props.style}
      aria-hidden="true"
      {...applySemanticAttrs({
        scope: "time-input",
        part: "separator",
      })}
    >
      {props.children ?? ":"}
    </span>
  )
}
