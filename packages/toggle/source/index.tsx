/**
 * @solidiom/toggle — A two-state button that can be toggled on or off.
 *
 * Parts: Root.
 */

import { type Accessor } from "solid-js"
import { type JSX } from "@solidjs/web"
import { createControllableValue, createChangeDetails, applySemanticAttrs } from "@solidiom/runtime"

// ─── Root ────────────────────────────────────────────────────────────────────

export interface ToggleRootProps {
  /** Controlled pressed state. */
  pressed?: Accessor<boolean | undefined>
  /** Default pressed state (uncontrolled). */
  defaultPressed?: boolean
  /** Called when pressed state changes. */
  onPressedChange?: (pressed: boolean) => void
  /** Whether the toggle is disabled. */
  disabled?: boolean
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}

/**
 * Toggle root — a two-state button with `aria-pressed`.
 *
 * Emits `data-scope="toggle"`, `data-part="root"`, `data-state="on"|"off"`.
 */
export function Root(props: ToggleRootProps) {
  const { value, requestChange } = createControllableValue<boolean, "press">({
    value: props.pressed,
    defaultValue: props.defaultPressed ?? false,
    onChange: (next: boolean) => props.onPressedChange?.(next),
  })

  const handleClick = () => {
    if (props.disabled) return
    requestChange(!value(), createChangeDetails("press"))
  }

  return (
    <button
      type="button"
      aria-pressed={value() ? "true" : "false"}
      aria-disabled={props.disabled ? "true" : undefined}
      onClick={handleClick}
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({
        scope: "toggle",
        part: "root",
        state: value() ? "on" : "off",
        disabled: props.disabled,
      })}
    >
      {props.children}
    </button>
  )
}
