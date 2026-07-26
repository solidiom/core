/**
 * @solidiom/radio-group — Headless radio group primitive.
 *
 * Parts: Root, Item, Indicator.
 *
 * Implements WAI-ARIA radiogroup pattern with roving tabindex
 * keyboard navigation (Arrow keys move focus and select).
 */

import { type Accessor, createContext, useContext } from "solid-js"
import { type JSX } from "@solidjs/web"
import {
  createControllableValue,
  createChangeDetails,
  applySemanticAttrs,
  createStableId,
} from "@solidiom/runtime"

// ─── Context ─────────────────────────────────────────────────────────────────

interface RadioGroupContextValue {
  value: Accessor<string>
  setValue: (value: string) => void
  name: string | undefined
  disabled: boolean | undefined
  required: boolean | undefined
  orientation: "horizontal" | "vertical"
}

const RadioGroupContext = createContext<RadioGroupContextValue>()

function useRadioGroup(): RadioGroupContextValue {
  const ctx = useContext(RadioGroupContext)
  if (!ctx) throw new Error("[solidiom] RadioGroup.Item must be used within <RadioGroup.Root>")
  return ctx
}

// ─── Root ────────────────────────────────────────────────────────────────────

export interface RadioGroupRootProps {
  /** Controlled value. */
  value?: Accessor<string | undefined>
  /** Default value (uncontrolled). */
  defaultValue?: string
  /** Called when the selected value changes. */
  onValueChange?: (value: string) => void
  /** Form field name for hidden inputs. */
  name?: string
  disabled?: boolean
  required?: boolean
  /** Layout orientation — affects arrow key navigation direction. */
  orientation?: "horizontal" | "vertical"
  class?: string
  style?: JSX.CSSProperties | string
  children: JSX.Element
}

/**
 * RadioGroup root — wraps radio items with `role="radiogroup"`.
 *
 * Emits `data-scope="radio-group"`, `data-part="root"`.
 */
export function Root(props: RadioGroupRootProps) {
  const { value, requestChange } = createControllableValue<string, "select">({
    value: props.value,
    defaultValue: props.defaultValue ?? "",
    onChange: (next) => props.onValueChange?.(next),
  })

  const orientation = () => props.orientation ?? "vertical"

  const handleKeyDown = (e: KeyboardEvent) => {
    const target = e.currentTarget as HTMLElement
    const items = Array.from(
      target.querySelectorAll<HTMLElement>("[data-scope='radio-group'][data-part='item']"),
    ).filter((el) => !el.hasAttribute("data-disabled"))

    if (items.length === 0) return

    const currentIndex = items.findIndex((el) => el === document.activeElement)
    let nextIndex = -1

    const isVertical = orientation() === "vertical"
    const prevKey = isVertical ? "ArrowUp" : "ArrowLeft"
    const nextKey = isVertical ? "ArrowDown" : "ArrowRight"

    switch (e.key) {
      case nextKey:
        e.preventDefault()
        nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0
        break
      case prevKey:
        e.preventDefault()
        nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1
        break
      case "Home":
        e.preventDefault()
        nextIndex = 0
        break
      case "End":
        e.preventDefault()
        nextIndex = items.length - 1
        break
      default:
        return
    }

    if (nextIndex >= 0) {
      const nextItem = items[nextIndex]!
      nextItem.focus()
      const itemValue = nextItem.getAttribute("data-value")
      if (itemValue) {
        requestChange(itemValue, createChangeDetails("select"))
      }
    }
  }

  return (
    <RadioGroupContext
      value={{
        value,
        setValue: (v) => requestChange(v, createChangeDetails("select")),
        name: props.name,
        disabled: props.disabled,
        required: props.required,
        orientation: orientation(),
      }}
    >
      <div
        role="radiogroup"
        aria-required={props.required ? "true" : undefined}
        aria-disabled={props.disabled ? "true" : undefined}
        aria-orientation={orientation()}
        onKeyDown={handleKeyDown}
        class={props.class}
        style={props.style}
        {...applySemanticAttrs({
          scope: "radio-group",
          part: "root",
          orientation: orientation(),
          disabled: props.disabled,
          required: props.required,
        })}
      >
        {props.children}
      </div>
    </RadioGroupContext>
  )
}

// ─── Item ────────────────────────────────────────────────────────────────────

export interface RadioGroupItemProps {
  /** The value this item represents. */
  value: string
  disabled?: boolean
  class?: string
  style?: JSX.CSSProperties | string
  children: JSX.Element
}

/**
 * RadioGroup item — individual radio option with roving tabindex.
 *
 * Emits `data-scope="radio-group"`, `data-part="item"`, `data-state="checked"|"unchecked"`.
 */
export function Item(props: RadioGroupItemProps) {
  const ctx = useRadioGroup()
  const id = createStableId("radio")
  const isChecked = () => ctx.value() === props.value
  const isDisabled = () => props.disabled || ctx.disabled
  const isSelected = () => ctx.value() === props.value

  const handleClick = () => {
    if (isDisabled()) return
    ctx.setValue(props.value)
  }

  // Roving tabindex: only the selected item (or first if none selected) is tabbable
  const tabIndex = () => {
    if (isDisabled()) return -1
    if (isSelected()) return 0
    if (!ctx.value()) return 0 // first item gets focus when nothing selected
    return -1
  }

  return (
    <button
      id={id}
      type="button"
      role="radio"
      aria-checked={isChecked() ? "true" : "false"}
      aria-disabled={isDisabled() ? "true" : undefined}
      tabindex={tabIndex()}
      onClick={handleClick}
      data-value={props.value}
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({
        scope: "radio-group",
        part: "item",
        state: isChecked() ? "checked" : "unchecked",
        disabled: isDisabled(),
        selected: isChecked(),
      })}
    >
      {props.children}
    </button>
  )
}

// ─── Indicator ───────────────────────────────────────────────────────────────

export interface RadioGroupIndicatorProps {
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}

/**
 * RadioGroup indicator — visual indicator rendered inside an Item.
 * Only visible when the parent Item is checked.
 *
 * Must be placed as a child of `<Item>`. Reads checked state from
 * the nearest Item via DOM (checks parent's aria-checked).
 */
export function Indicator(props: RadioGroupIndicatorProps) {
  return (
    <span
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "radio-group", part: "indicator" })}
    >
      {props.children}
    </span>
  )
}
