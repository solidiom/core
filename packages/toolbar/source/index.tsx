/**
 * @solidiom/toolbar — Grouped actions/controls in a horizontal bar.
 *
 * Parts: Root, Button, Separator, ToggleGroup, ToggleItem.
 */

import { type JSX } from "@solidjs/web"
import { applySemanticAttrs } from "@solidiom/runtime"

export interface ToolbarRootProps {
  orientation?: "horizontal" | "vertical"
  class?: string
  style?: JSX.CSSProperties | string
  children: JSX.Element
}

export function Root(props: ToolbarRootProps) {
  const orientation = () => props.orientation ?? "horizontal"
  return (
    <div
      role="toolbar"
      aria-orientation={orientation()}
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "toolbar", part: "root", orientation: orientation() })}
    >
      {props.children}
    </div>
  )
}

export interface ToolbarButtonProps {
  disabled?: boolean
  onClick?: () => void
  class?: string
  children: JSX.Element
}

export function Button(props: ToolbarButtonProps) {
  return (
    <button
      type="button"
      disabled={props.disabled}
      onClick={props.onClick}
      class={props.class}
      {...applySemanticAttrs({ scope: "toolbar", part: "button", disabled: props.disabled })}
    >
      {props.children}
    </button>
  )
}

export interface ToolbarSeparatorProps {
  class?: string
}

export function Separator(props: ToolbarSeparatorProps) {
  return (
    <div
      role="separator"
      aria-orientation="vertical"
      class={props.class}
      {...applySemanticAttrs({ scope: "toolbar", part: "separator" })}
    />
  )
}

export interface ToolbarToggleGroupProps {
  type?: "single" | "multiple"
  class?: string
  children: JSX.Element
}

export function ToggleGroup(props: ToolbarToggleGroupProps) {
  return (
    <div
      role="group"
      class={props.class}
      {...applySemanticAttrs({ scope: "toolbar", part: "toggle-group" })}
    >
      {props.children}
    </div>
  )
}

export interface ToolbarToggleItemProps {
  pressed?: boolean
  onPressedChange?: (pressed: boolean) => void
  disabled?: boolean
  class?: string
  children: JSX.Element
}

export function ToggleItem(props: ToolbarToggleItemProps) {
  const handleClick = () => {
    if (props.disabled) return
    props.onPressedChange?.(!props.pressed)
  }
  return (
    <button
      type="button"
      aria-pressed={props.pressed ? "true" : "false"}
      disabled={props.disabled}
      onClick={handleClick}
      class={props.class}
      {...applySemanticAttrs({
        scope: "toolbar",
        part: "toggle-item",
        state: props.pressed ? "on" : "off",
        disabled: props.disabled,
      })}
    >
      {props.children}
    </button>
  )
}
