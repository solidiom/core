/**
 * ToggleButton — A variant that accepts a pressed state and handles
 * aria-pressed, suitable for UI toggles like bold/italic formatting buttons.
 */

import { type JSX } from "@solidjs/web"
import { applySemanticAttrs } from "@solidiom/runtime"

export interface ToggleButtonProps {
  children: JSX.Element
  /** Whether the toggle is currently pressed/active. */
  pressed: boolean
  /** Called when the pressed state should change. */
  onPressedChange?: (pressed: boolean) => void
  disabled?: boolean
  loading?: boolean
  class?: string
}

export function ToggleButton(props: ToggleButtonProps) {
  const isDisabled = () => props.disabled || props.loading

  return (
    <button
      type="button"
      disabled={isDisabled()}
      aria-pressed={props.pressed ? "true" : "false"}
      aria-busy={props.loading ? "true" : undefined}
      class={props.class}
      onClick={() => {
        if (!isDisabled()) {
          props.onPressedChange?.(!props.pressed)
        }
      }}
      {...applySemanticAttrs({
        scope: "button",
        part: "toggle",
        state: props.pressed ? "on" : "off",
        disabled: isDisabled(),
        loading: props.loading,
      })}
    >
      {props.children}
    </button>
  )
}
