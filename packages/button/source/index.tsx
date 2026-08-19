/**
 * @solidiom/button — Headless button primitive.
 *
 * Parts: Root, IconButton, ToggleButton, ButtonGroup.
 */

import { type JSX } from "@solidjs/web"
import { applySemanticAttrs } from "@solidiom/runtime"

export interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  children: JSX.Element
  loading?: boolean
}

export function Root(props: ButtonProps) {
  const {
    children: _children,
    disabled: _disabled,
    loading: _loading,
    class: _class,
    type: _type,
    ...buttonProps
  } = props
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
      {...buttonProps}
      type={props.type ?? "button"}
      disabled={isDisabled()}
      aria-busy={props.loading ? "true" : undefined}
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
