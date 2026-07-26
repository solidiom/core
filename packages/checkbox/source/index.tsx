/**
 * @solidiom/checkbox — Headless checkbox primitive with checked, unchecked, and indeterminate states.
 *
 * Parts: Root, Indicator, Group.
 */

import { type Accessor, Show, createContext, useContext } from "solid-js"
import { type JSX } from "@solidjs/web"
import { createControllableValue, createChangeDetails, applySemanticAttrs } from "@solidiom/runtime"

export type CheckedState = boolean | "indeterminate"

const CheckboxContext = createContext<{ checked: Accessor<CheckedState> }>()

// ─── CheckboxGroup ───────────────────────────────────────────────────────────

interface CheckboxGroupContextValue {
  value: Accessor<string[]>
  toggle: (itemValue: string) => void
  disabled: boolean | undefined
}

const CheckboxGroupContext = createContext<CheckboxGroupContextValue>()

export interface CheckboxGroupProps {
  /** Controlled value — array of checked item values. */
  value?: Accessor<string[] | undefined>
  /** Default value (uncontrolled). */
  defaultValue?: string[]
  /** Called when the set of checked values changes. */
  onValueChange?: (value: string[]) => void
  disabled?: boolean
  class?: string
  style?: JSX.CSSProperties | string
  children: JSX.Element
}

/**
 * CheckboxGroup — wraps multiple checkboxes for multi-select with a shared value array.
 *
 * Each child Checkbox.Root with a `value` prop automatically integrates with the group.
 */
export function Group(props: CheckboxGroupProps) {
  const { value, requestChange } = createControllableValue<string[], "toggle">({
    value: props.value,
    defaultValue: props.defaultValue ?? [],
    onChange: (next) => props.onValueChange?.(next),
    equals: (a, b) => a.length === b.length && a.every((v, i) => v === b[i]),
  })

  const toggle = (itemValue: string) => {
    const current = value()
    const next = current.includes(itemValue)
      ? current.filter((v) => v !== itemValue)
      : [...current, itemValue]
    requestChange(next, createChangeDetails("toggle"))
  }

  return (
    <CheckboxGroupContext value={{ value, toggle, disabled: props.disabled }}>
      <div
        role="group"
        class={props.class}
        style={props.style}
        {...applySemanticAttrs({
          scope: "checkbox",
          part: "group",
          disabled: props.disabled,
        })}
      >
        {props.children}
      </div>
    </CheckboxGroupContext>
  )
}

/** Hook to access the CheckboxGroup context (if present). */
export function useCheckboxGroup() {
  return useContext(CheckboxGroupContext)
}

export interface CheckboxRootProps {
  checked?: Accessor<CheckedState | undefined>
  defaultChecked?: CheckedState
  onCheckedChange?: (checked: CheckedState) => void
  /** When used inside a CheckboxGroup, identifies this checkbox's value. */
  value?: string
  disabled?: boolean
  name?: string
  required?: boolean
  class?: string
  style?: JSX.CSSProperties | string
  children: JSX.Element
}

export function Root(props: CheckboxRootProps) {
  const groupCtx = useContext(CheckboxGroupContext)

  // If inside a group and has a value prop, derive checked state from group
  const groupChecked = () => {
    if (groupCtx && props.value) {
      return groupCtx.value().includes(props.value)
    }
    return undefined
  }

  const { value: checked, requestChange } = createControllableValue<CheckedState, "toggle">({
    value: props.checked ?? (groupCtx && props.value ? () => groupChecked() ?? false : undefined),
    defaultValue: props.defaultChecked ?? false,
    onChange: (next) => {
      props.onCheckedChange?.(next)
      // Sync with group
      if (groupCtx && props.value && typeof next === "boolean") {
        groupCtx.toggle(props.value)
      }
    },
  })
  const isDisabled = () => props.disabled || groupCtx?.disabled
  const ariaChecked = () =>
    checked() === "indeterminate"
      ? ("mixed" as const)
      : checked()
        ? ("true" as const)
        : ("false" as const)
  const state = () =>
    checked() === "indeterminate" ? "indeterminate" : checked() ? "checked" : "unchecked"
  const handleClick = () => {
    if (isDisabled()) return
    if (groupCtx && props.value) {
      groupCtx.toggle(props.value)
    } else {
      requestChange(checked() === true ? false : true, createChangeDetails("toggle"))
    }
  }

  return (
    <CheckboxContext value={{ checked }}>
      <button
        role="checkbox"
        aria-checked={ariaChecked()}
        aria-disabled={isDisabled() ? "true" : undefined}
        aria-required={props.required ? "true" : undefined}
        onClick={handleClick}
        class={props.class}
        style={props.style}
        {...applySemanticAttrs({
          scope: "checkbox",
          part: "root",
          state: state(),
          disabled: isDisabled(),
        })}
      >
        {props.children}
      </button>
    </CheckboxContext>
  )
}

export interface CheckboxIndicatorProps {
  class?: string
  style?: JSX.CSSProperties | string
  children: JSX.Element
}

export function Indicator(props: CheckboxIndicatorProps) {
  const ctx = useContext(CheckboxContext)
  const isVisible = () => {
    const val = ctx?.checked()
    return val === true || val === "indeterminate"
  }
  const state = () => {
    const val = ctx?.checked()
    return val === "indeterminate" ? "indeterminate" : val ? "checked" : "unchecked"
  }

  return (
    <Show when={isVisible()}>
      <span
        class={props.class}
        style={props.style}
        {...applySemanticAttrs({ scope: "checkbox", part: "indicator", state: state() })}
      >
        {props.children}
      </span>
    </Show>
  )
}
