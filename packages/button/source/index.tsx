/**
 * @solidiom/button — Headless button primitive.
 *
 * Parts: Root, IconButton, ToggleButton, ButtonGroup.
 */

import { type JSX } from "@solidjs/web"
import { applySemanticAttrs } from "@solidiom/runtime"

export interface ButtonProps {
  children: JSX.Element
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  class?: string
  type?: "button" | "submit" | "reset"
}

export function Root(props: ButtonProps) {
  const isDisabled = () => props.disabled || props.loading

  const semanticAttrs = () =>
    applySemanticAttrs({
      scope: "button",
      part: "root",
      disabled: isDisabled(),
      loading: props.loading,
    })

  return (
    <button
      type={props.type ?? "button"}
      disabled={isDisabled()}
      aria-busy={props.loading ? "true" : undefined}
      onClick={props.onClick}
      class={props.class}
      {...semanticAttrs()}
    >
      {props.children}
    </button>
  )
}

export { IconButton, type IconButtonProps } from "./icon-button"
export { ToggleButton, type ToggleButtonProps } from "./toggle-button"
export { ButtonGroup, type ButtonGroupProps } from "./button-group"
