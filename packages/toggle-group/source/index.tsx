/**
 * @solidiom/toggle-group — Group of toggle buttons (mutually-exclusive or multi-select).
 *
 * Parts: Root, Item.
 */

import { type Accessor, createContext, useContext } from "solid-js"
import { type JSX } from "@solidjs/web"
import { createControllableValue, createChangeDetails, applySemanticAttrs } from "@solidiom/runtime"

// ─── Context ─────────────────────────────────────────────────────────────────

interface ToggleGroupContextValue {
  value: Accessor<string[]>
  toggle: (itemValue: string) => void
  type: "single" | "multiple"
  disabled: boolean | undefined
  orientation: "horizontal" | "vertical"
}

const ToggleGroupContext = createContext<ToggleGroupContextValue>()

function useToggleGroup(): ToggleGroupContextValue {
  const ctx = useContext(ToggleGroupContext)
  if (!ctx) throw new Error("[solidiom] ToggleGroup.Item must be used within <ToggleGroup.Root>")
  return ctx
}

// ─── Root ────────────────────────────────────────────────────────────────────

export interface ToggleGroupRootProps {
  /** Selection mode: "single" allows one active item, "multiple" allows many. */
  type?: "single" | "multiple"
  /** Controlled value. */
  value?: Accessor<string[] | undefined>
  /** Default value (uncontrolled). */
  defaultValue?: string[]
  /** Called when the selected values change. */
  onValueChange?: (value: string[]) => void
  disabled?: boolean
  /** Layout orientation. */
  orientation?: "horizontal" | "vertical"
  class?: string
  style?: JSX.CSSProperties | string
  children: JSX.Element
}

/**
 * ToggleGroup root — wraps toggle items with `role="group"`.
 *
 * Emits `data-scope="toggle-group"`, `data-part="root"`.
 */
export function Root(props: ToggleGroupRootProps) {
  const type = () => props.type ?? "single"
  const orientation = () => props.orientation ?? "horizontal"

  const { value, requestChange } = createControllableValue<string[], "toggle">({
    value: props.value,
    defaultValue: props.defaultValue ?? [],
    onChange: (next: string[]) => props.onValueChange?.(next),
    equals: (a: string[], b: string[]) => a.length === b.length && a.every((v, i) => v === b[i]),
  })

  const toggle = (itemValue: string) => {
    if (props.disabled) return
    const current = value()

    let next: string[]
    if (type() === "single") {
      next = current.includes(itemValue) ? [] : [itemValue]
    } else {
      next = current.includes(itemValue)
        ? current.filter((v: string) => v !== itemValue)
        : [...current, itemValue]
    }

    requestChange(next, createChangeDetails("toggle"))
  }

  return (
    <ToggleGroupContext
      value={{
        value,
        toggle,
        type: type(),
        disabled: props.disabled,
        orientation: orientation(),
      }}
    >
      <div
        role="group"
        aria-orientation={orientation()}
        aria-disabled={props.disabled ? "true" : undefined}
        class={props.class}
        style={props.style}
        {...applySemanticAttrs({
          scope: "toggle-group",
          part: "root",
          orientation: orientation(),
          disabled: props.disabled,
        })}
      >
        {props.children}
      </div>
    </ToggleGroupContext>
  )
}

// ─── Item ────────────────────────────────────────────────────────────────────

export interface ToggleGroupItemProps {
  /** The value this item represents. */
  value: string
  disabled?: boolean
  class?: string
  style?: JSX.CSSProperties | string
  children: JSX.Element
}

/**
 * ToggleGroup item — individual toggle button.
 *
 * Emits `data-scope="toggle-group"`, `data-part="item"`, `data-state="on"|"off"`.
 */
export function Item(props: ToggleGroupItemProps) {
  const ctx = useToggleGroup()
  const isPressed = () => ctx.value().includes(props.value)
  const isDisabled = () => props.disabled || ctx.disabled

  const handleClick = () => {
    if (isDisabled()) return
    ctx.toggle(props.value)
  }

  return (
    <button
      type="button"
      aria-pressed={isPressed() ? "true" : "false"}
      aria-disabled={isDisabled() ? "true" : undefined}
      onClick={handleClick}
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({
        scope: "toggle-group",
        part: "item",
        state: isPressed() ? "on" : "off",
        disabled: isDisabled(),
      })}
    >
      {props.children}
    </button>
  )
}
