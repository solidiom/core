/**
 * @solidiom/switch — Headless toggle switch primitive.
 *
 * Parts: Root, Thumb.
 */

import { type Accessor, createContext, useContext } from "solid-js"
import { type JSX } from "@solidjs/web"
import {
  createControllableValue,
  createChangeDetails,
  applySemanticAttrs,
  createStableId,
} from "@solidiom/runtime"

const SwitchContext = createContext<{ checked: Accessor<boolean> }>()

export interface SwitchRootProps {
  checked?: Accessor<boolean | undefined>
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  class?: string
  style?: JSX.CSSProperties | string
  children: JSX.Element
}

export function Root(props: SwitchRootProps) {
  const id = createStableId("switch")
  const { value: checked, requestChange } = createControllableValue<boolean, "toggle">({
    value: props.checked,
    defaultValue: props.defaultChecked ?? false,
    onChange: (next) => props.onCheckedChange?.(next),
  })
  const handleClick = () => {
    if (props.disabled) return
    requestChange(!checked(), createChangeDetails("toggle"))
  }

  return (
    <SwitchContext value={{ checked }}>
      <button
        id={id}
        role="switch"
        aria-checked={checked() ? "true" : "false"}
        aria-disabled={props.disabled ? "true" : undefined}
        onClick={handleClick}
        class={props.class}
        style={props.style}
        {...applySemanticAttrs({
          scope: "switch",
          part: "root",
          state: checked() ? "on" : "off",
          disabled: props.disabled,
        })}
      >
        {props.children}
      </button>
    </SwitchContext>
  )
}

export interface SwitchThumbProps {
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}

export function Thumb(props: SwitchThumbProps) {
  const ctx = useContext(SwitchContext)
  const state = () => (ctx?.checked() ? "on" : "off")

  return (
    <span
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "switch", part: "thumb", state: state() })}
    >
      {props.children}
    </span>
  )
}
