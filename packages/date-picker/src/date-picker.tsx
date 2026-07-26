/**
 * DatePicker primitive — input + calendar popup for date selection.
 *
 * Uses popover pattern with dismissable layer, focus trapping, and presence phases.
 * Requires a CalendarDateMathPort adapter (uses built-in Gregorian fallback otherwise).
 *
 * Parts: Root, Input, Trigger, Content, Calendar, Header, Grid, Cell.
 */

import { type Accessor, createSignal, createMemo, onSettled, Show, untrack } from "solid-js"
import { type JSX } from "@solidjs/web"
import {
  createDisclosureState,
  createStableId,
  createPresence,
  applySemanticAttrs,
  getLayerStack,
  setupDismissableLayer,
  activateFocusScope,
  createChangeDetails,
  type DisclosureReason,
  type ChangeDetails,
} from "@solidiom/runtime"
import {
  DatePickerContext,
  useDatePickerContext,
  createDefaultDateMath,
  defaultFormatDate,
  getDaysInMonth,
  today,
  type DatePickerContextValue,
  type DateValue,
  type CalendarDateMathPort,
} from "./date-picker-context"

// ─── Root ──────────────────────────────────────────────────────────────────────

export interface DatePickerRootProps {
  value?: Accessor<DateValue | undefined>
  defaultValue?: DateValue
  onValueChange?: (value: DateValue | undefined) => void
  open?: Accessor<boolean>
  defaultOpen?: boolean
  onOpenChange?: (open: boolean, details: ChangeDetails<DisclosureReason>) => void
  isDateDisabled?: (date: DateValue) => boolean
  formatDate?: (date: DateValue) => string
  dateMath?: CalendarDateMathPort
  children: JSX.Element
}

export function Root(props: DatePickerRootProps) {
  const baseId = createStableId("date-picker")
  const dateMath = props.dateMath ?? createDefaultDateMath()

  const { open, requestOpenChange } = createDisclosureState({
    open: props.open,
    defaultOpen: props.defaultOpen,
    onOpenChange: props.onOpenChange,
  })

  const presence = createPresence({ open })

  const [internalValue, setInternalValue] = createSignal<DateValue | undefined>(props.defaultValue)
  const value = () => props.value?.() ?? internalValue()
  const setValue = (date: DateValue | undefined) => {
    if (props.onValueChange) {
      props.onValueChange(date)
    } else {
      setInternalValue(date)
    }
  }

  const [viewingMonth, setViewingMonth] = createSignal<DateValue>(untrack(value) ?? today())
  const [focusedDate, setFocusedDate] = createSignal<DateValue>(untrack(value) ?? today())

  const ctx: DatePickerContextValue = {
    open,
    requestOpenChange,
    value,
    setValue,
    focusedDate,
    setFocusedDate,
    viewingMonth,
    setViewingMonth,
    dateMath,
    isDateDisabled: props.isDateDisabled ?? (() => false),
    formatDate: props.formatDate ?? defaultFormatDate,
    contentId: `${baseId}-content`,
    triggerId: `${baseId}-trigger`,
    inputId: `${baseId}-input`,
    phase: presence.phase,
    present: presence.present,
  }

  return (
    <DatePickerContext value={ctx}>
      <div
        {...applySemanticAttrs({
          scope: "date-picker",
          part: "root",
          state: open() ? "open" : "closed",
        })}
      >
        {props.children}
      </div>
    </DatePickerContext>
  )
}

// ─── Input ─────────────────────────────────────────────────────────────────────

export interface DatePickerInputProps {
  placeholder?: string
  class?: string
  ref?: (el: HTMLInputElement) => void
}

/** Read-only input displaying the formatted date value. */
export function Input(props: DatePickerInputProps) {
  const ctx = useDatePickerContext()
  const displayValue = createMemo(() => {
    const v = ctx.value()
    return v ? ctx.formatDate(v) : ""
  })

  return (
    <input
      id={ctx.inputId}
      type="text"
      readonly
      value={displayValue()}
      placeholder={props.placeholder}
      class={props.class}
      ref={props.ref}
      {...applySemanticAttrs({ scope: "date-picker", part: "input" })}
    />
  )
}

// ─── Trigger ───────────────────────────────────────────────────────────────────

export interface DatePickerTriggerProps {
  children: JSX.Element
  ref?: (el: HTMLButtonElement) => void
}

/** Button that toggles the calendar popup. */
export function Trigger(props: DatePickerTriggerProps) {
  const ctx = useDatePickerContext()

  const handleClick = () => {
    ctx.requestOpenChange(!ctx.open(), createChangeDetails("trigger"))
  }

  return (
    <button
      id={ctx.triggerId}
      aria-haspopup="dialog"
      aria-expanded={ctx.open() ? "true" : undefined}
      aria-controls={ctx.open() ? ctx.contentId : undefined}
      onClick={handleClick}
      ref={props.ref}
      {...applySemanticAttrs({
        scope: "date-picker",
        part: "trigger",
        state: ctx.open() ? "open" : "closed",
      })}
    >
      {props.children}
    </button>
  )
}

// ─── Content ───────────────────────────────────────────────────────────────────

export interface DatePickerContentProps {
  children: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
  ref?: (el: HTMLDivElement) => void
}

/** Popup container with dismissable layer and focus trapping. */
export function Content(props: DatePickerContentProps) {
  const ctx = useDatePickerContext()
  let contentEl: HTMLDivElement | undefined

  onSettled(() => {
    if (!contentEl) return
    const doc = contentEl.ownerDocument
    const stack = getLayerStack(doc)
    const removeLayer = stack.push({ id: ctx.contentId, element: contentEl, modal: false })
    const removeDismissable = setupDismissableLayer({
      document: doc,
      layerId: ctx.contentId,
      element: () => contentEl,
      onDismiss: (reason) => ctx.requestOpenChange(false, createChangeDetails(reason)),
    })
    const deactivateFocus = activateFocusScope({
      element: () => contentEl,
      restoreTarget: () => doc.getElementById(ctx.triggerId),
    })
    return () => {
      deactivateFocus()
      removeDismissable()
      removeLayer()
    }
  })

  return (
    <Show when={ctx.present()}>
      <div
        id={ctx.contentId}
        role="dialog"
        aria-modal="true"
        ref={(el: HTMLDivElement) => {
          contentEl = el
          props.ref?.(el)
        }}
        class={props.class}
        style={props.style}
        {...applySemanticAttrs({
          scope: "date-picker",
          part: "content",
          state: ctx.open() ? "open" : "closed",
        })}
      >
        {props.children}
      </div>
    </Show>
  )
}

// ─── Calendar ──────────────────────────────────────────────────────────────────

export interface DatePickerCalendarProps {
  children: JSX.Element
  class?: string
}

/** Semantic wrapper for the calendar region. */
export function Calendar(props: DatePickerCalendarProps) {
  return (
    <div
      role="group"
      aria-label="Calendar"
      class={props.class}
      {...applySemanticAttrs({ scope: "date-picker", part: "calendar" })}
    >
      {props.children}
    </div>
  )
}

// ─── Header ────────────────────────────────────────────────────────────────────

export interface DatePickerHeaderProps {
  children?: JSX.Element
  class?: string
}

/** Header with prev/next month navigation and current month label. */
export function Header(props: DatePickerHeaderProps) {
  const ctx = useDatePickerContext()
  const handlePrev = () => ctx.setViewingMonth(ctx.dateMath.addMonths(ctx.viewingMonth(), -1))
  const handleNext = () => ctx.setViewingMonth(ctx.dateMath.addMonths(ctx.viewingMonth(), 1))

  return (
    <div class={props.class} {...applySemanticAttrs({ scope: "date-picker", part: "header" })}>
      <button aria-label="Previous month" onClick={handlePrev} type="button">
        ←
      </button>
      <span aria-live="polite">
        {ctx.viewingMonth().year}-{String(ctx.viewingMonth().month).padStart(2, "0")}
      </span>
      <button aria-label="Next month" onClick={handleNext} type="button">
        →
      </button>
      {props.children}
    </div>
  )
}

// ─── Grid ──────────────────────────────────────────────────────────────────────

export interface DatePickerGridProps {
  children: (weeks: Accessor<number[][]>) => JSX.Element
  class?: string
  weekStartsOn?: number
}

/** Renders the month grid and provides weeks data to children. */
export function Grid(props: DatePickerGridProps) {
  const ctx = useDatePickerContext()
  const grid = createMemo(() =>
    ctx.dateMath.getMonthGrid({ date: ctx.viewingMonth(), weekStartsOn: props.weekStartsOn ?? 0 }),
  )
  const weeks = createMemo(() => grid().weeks)

  return (
    <table
      role="grid"
      class={props.class}
      {...applySemanticAttrs({ scope: "date-picker", part: "grid" })}
    >
      <tbody>{props.children(weeks)}</tbody>
    </table>
  )
}

// ─── Cell ──────────────────────────────────────────────────────────────────────

export interface DatePickerCellProps {
  day: number
  class?: string
}

/** A single day cell with selection, disabled state, and keyboard navigation. */
export function Cell(props: DatePickerCellProps) {
  const ctx = useDatePickerContext()
  const dateValue = (): DateValue => ({
    year: ctx.viewingMonth().year,
    month: ctx.viewingMonth().month,
    day: props.day,
  })
  const isSelected = createMemo(() =>
    props.day !== 0 && ctx.value() ? ctx.dateMath.isSameDay(ctx.value()!, dateValue()) : false,
  )
  const isDisabled = createMemo(() => props.day === 0 || ctx.isDateDisabled(dateValue()))
  const isFocused = createMemo(
    () => props.day !== 0 && ctx.dateMath.isSameDay(ctx.focusedDate(), dateValue()),
  )

  const handleClick = () => {
    if (isDisabled()) return
    ctx.setValue(dateValue())
    ctx.requestOpenChange(false, createChangeDetails("close"))
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (props.day === 0) return
    const current = ctx.focusedDate()
    let next: DateValue | undefined

    switch (e.key) {
      case "ArrowLeft":
        next = { ...current, day: current.day - 1 }
        break
      case "ArrowRight":
        next = { ...current, day: current.day + 1 }
        break
      case "ArrowUp":
        next = { ...current, day: current.day - 7 }
        break
      case "ArrowDown":
        next = { ...current, day: current.day + 7 }
        break
      case "Enter":
      case " ":
        e.preventDefault()
        handleClick()
        return
      default:
        return
    }

    if (next) {
      e.preventDefault()
      const daysInCurrent = getDaysInMonth(current.year, current.month)
      if (next.day < 1) {
        const prev = ctx.dateMath.addMonths(current, -1)
        const prevDays = getDaysInMonth(prev.year, prev.month)
        next = { year: prev.year, month: prev.month, day: prevDays + next.day }
        ctx.setViewingMonth(prev)
      } else if (next.day > daysInCurrent) {
        const nextMonth = ctx.dateMath.addMonths(current, 1)
        next = { year: nextMonth.year, month: nextMonth.month, day: next.day - daysInCurrent }
        ctx.setViewingMonth(nextMonth)
      }
      ctx.setFocusedDate(next)
    }
  }

  if (props.day === 0) {
    return (
      <td class={props.class} {...applySemanticAttrs({ scope: "date-picker", part: "cell" })} />
    )
  }

  return (
    <td
      role="gridcell"
      tabindex={isFocused() ? 0 : -1}
      aria-selected={isSelected() ? "true" : undefined}
      aria-disabled={isDisabled() ? "true" : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      class={props.class}
      {...applySemanticAttrs({
        scope: "date-picker",
        part: "cell",
        state: isSelected() ? "selected" : isDisabled() ? "disabled" : undefined,
      })}
    >
      {String(props.day)}
    </td>
  )
}
