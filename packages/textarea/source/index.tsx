/**
 * @solidiom/textarea — Native textarea primitive with semantic state attrs.
 *
 * Root is intentionally one native `<textarea>` so it participates in forms
 * and composes directly with Field.Control.
 */

import { createEffect, createMemo, omit, onSettled, untrack } from "solid-js"
import { type JSX } from "@solidjs/web"
import { applySemanticAttrs } from "@solidiom/runtime"

type NativeTextareaProps = Omit<
  JSX.TextareaHTMLAttributes<HTMLTextAreaElement>,
  | "value"
  | "defaultValue"
  | "disabled"
  | "required"
  | "readonly"
  | "ref"
  | "onInput"
  | "onBlur"
  | "onFocus"
  | "class"
  | "style"
>

/** Props for the standalone textarea root. */
export interface TextareaRootProps extends NativeTextareaProps {
  /** Current value (controlled). */
  value?: string
  /** Initial value (uncontrolled). */
  defaultValue?: string
  /** Called with the native value whenever the textarea receives input. */
  onValueChange?: (value: string) => void
  /** Whether the textarea is disabled. */
  disabled?: boolean
  /** Whether the textarea is read-only. */
  readOnly?: boolean
  /** Native lowercase readonly attribute. */
  readonly?: JSX.BooleanAttribute
  /** Whether the textarea is required. */
  required?: boolean
  /** Whether the textarea is invalid. */
  invalid?: boolean
  /** Resize to fit its content. Defaults to false. */
  autoResize?: boolean
  /** Maximum number of visible text rows while auto-resizing. */
  maxRows?: number
  /** Forwarded native textarea ref. */
  ref?: JSX.Ref<HTMLTextAreaElement>
  class?: string
  style?: JSX.CSSProperties | string
  onInput?: JSX.InputEventHandlerUnion<HTMLTextAreaElement, InputEvent>
  onBlur?: JSX.FocusEventHandlerUnion<HTMLTextAreaElement, FocusEvent>
  onFocus?: JSX.FocusEventHandlerUnion<HTMLTextAreaElement, FocusEvent>
}

function ariaIsTrue(value: unknown): boolean {
  return value === true || value === "true"
}

function ariaInvalid(value: unknown): boolean {
  return value !== undefined && value !== false && value !== "false"
}

function stateAria<T extends string | false | undefined>(
  explicit: boolean | undefined,
  incoming: T,
): T | "true" | "false" {
  if (explicit === undefined) return incoming
  return explicit ? "true" : "false"
}

function callRef(ref: JSX.Ref<HTMLTextAreaElement>, element: HTMLTextAreaElement): void {
  if (typeof ref === "function") {
    ref(element)
  } else if (Array.isArray(ref)) {
    for (const nestedRef of ref) callRef(nestedRef, element)
  }
}

function callEventHandler<T extends Event>(
  handler: unknown,
  event: T & { currentTarget: HTMLTextAreaElement },
): void {
  if (typeof handler === "function") {
    ;(handler as (event: T & { currentTarget: HTMLTextAreaElement }) => void)(event)
    return
  }

  if (Array.isArray(handler) && typeof handler[0] === "function") {
    ;(handler[0] as (data: unknown, event: T & { currentTarget: HTMLTextAreaElement }) => void)(
      handler[1],
      event,
    )
  }
}

/**
 * A single native textarea with controlled/uncontrolled values, Field ARIA
 * composition, semantic state attributes, and optional client-side resizing.
 */
export function Root(props: TextareaRootProps) {
  // Solid 2's omit returns a reactive proxy. Unlike a destructured rest object,
  // it keeps Field.Control's changing relationship IDs and ARIA state live.
  const rest = omit(
    props,
    "value",
    "defaultValue",
    "onValueChange",
    "disabled",
    "readOnly",
    "readonly",
    "required",
    "invalid",
    "autoResize",
    "maxRows",
    "ref",
    "class",
    "style",
    "onInput",
    "onBlur",
    "onFocus",
    "children",
    "innerHTML",
    "textContent",
  )

  // An uncontrolled default is intentionally a mount-time snapshot. A later
  // defaultValue change must not reset a user's native editing state.
  const defaultValue = untrack(() => props.defaultValue)

  const explicitDisabled = () => props.disabled
  const explicitRequired = () => props.required
  const explicitInvalid = () => props.invalid
  const explicitReadOnly = () => {
    if (props.readOnly !== undefined) return props.readOnly
    if (props.readonly !== undefined) return props.readonly === true || props.readonly === ""
    return undefined
  }

  // ARIA state by itself describes the control but never promotes to native
  // disabled/required/readonly behavior. It can still drive semantic styling
  // when no component/native state was supplied.
  const semanticDisabled = () =>
    explicitDisabled() !== undefined
      ? explicitDisabled() === true
      : ariaIsTrue(props["aria-disabled"])
  const semanticRequired = () =>
    explicitRequired() !== undefined
      ? explicitRequired() === true
      : ariaIsTrue(props["aria-required"])
  const semanticInvalid = () =>
    explicitInvalid() !== undefined
      ? explicitInvalid() === true
      : ariaInvalid(props["aria-invalid"])
  const semanticReadOnly = () =>
    explicitReadOnly() !== undefined
      ? explicitReadOnly() === true
      : ariaIsTrue(props["aria-readonly"])

  let textarea: HTMLTextAreaElement | undefined
  let autoResizeApplied = false
  let originalHeight = ""
  let originalOverflowY = ""
  let appliedHeight: string | undefined
  let appliedOverflowY: string | undefined

  const syncConsumerResizeStyles = () => {
    if (!textarea || !autoResizeApplied) return
    if (appliedHeight !== undefined && textarea.style.height !== appliedHeight) {
      originalHeight = textarea.style.height
    }
    if (appliedOverflowY !== undefined && textarea.style.overflowY !== appliedOverflowY) {
      originalOverflowY = textarea.style.overflowY
    }
  }

  const restoreResizeStyles = () => {
    if (!textarea || !autoResizeApplied) return
    syncConsumerResizeStyles()
    textarea.style.height = originalHeight
    textarea.style.overflowY = originalOverflowY
    autoResizeApplied = false
    appliedHeight = undefined
    appliedOverflowY = undefined
  }

  const applyResize = () => {
    if (typeof window === "undefined" || !textarea) return

    syncConsumerResizeStyles()

    if (!props.autoResize) {
      restoreResizeStyles()
      return
    }

    if (!autoResizeApplied) {
      originalHeight = textarea.style.height
      originalOverflowY = textarea.style.overflowY
      autoResizeApplied = true
      appliedHeight = undefined
      appliedOverflowY = undefined
    }

    const computed = window.getComputedStyle(textarea)
    const padding =
      (Number.parseFloat(computed.paddingTop) || 0) +
      (Number.parseFloat(computed.paddingBottom) || 0)
    const borders =
      (Number.parseFloat(computed.borderTopWidth) || 0) +
      (Number.parseFloat(computed.borderBottomWidth) || 0)
    const fontSize = Number.parseFloat(computed.fontSize) || 16
    const lineHeight = Number.parseFloat(computed.lineHeight) || fontSize * 1.2
    const boxSizing = computed.boxSizing
    const maxContentHeight =
      props.maxRows !== undefined && props.maxRows > 0
        ? lineHeight * props.maxRows + padding
        : Number.POSITIVE_INFINITY

    // Reset before measuring so shrinking content is handled as well as
    // growing content. jsdom reports zero layout dimensions; in that case the
    // original inline styles are restored instead of writing a bogus height.
    textarea.style.height = "auto"
    const scrollHeight = textarea.scrollHeight
    if (!Number.isFinite(scrollHeight) || scrollHeight <= 0) {
      textarea.style.height = originalHeight
      textarea.style.overflowY = originalOverflowY
      appliedHeight = originalHeight
      appliedOverflowY = originalOverflowY
      return
    }

    const limitedContentHeight = Math.min(scrollHeight, maxContentHeight)
    const height =
      boxSizing === "border-box"
        ? limitedContentHeight + borders
        : Math.max(0, limitedContentHeight - padding)
    textarea.style.height = `${height}px`
    textarea.style.overflowY = scrollHeight > maxContentHeight ? "auto" : "hidden"
    appliedHeight = textarea.style.height
    appliedOverflowY = textarea.style.overflowY
  }

  const reconcileControlledValue = () => {
    if (!textarea || props.value === undefined) return
    const next = props.value
    if (textarea.value !== next) textarea.value = next
  }

  // Compute phase: reactive inputs are read without mutating the DOM.
  const resizeInputs = createMemo(() => [
    props.autoResize,
    props.maxRows,
    props.value,
    props.class,
    props.style,
    props.rows,
  ])

  // Apply phase: each reactive update is applied after Solid's settled DOM
  // write. This also handles rejected and normalized controlled values without
  // calling the primitive flush API.
  createEffect(
    () => resizeInputs(),
    () => {
      onSettled(() => {
        reconcileControlledValue()
        applyResize()
      })
    },
  )

  const handleInput: JSX.EventHandler<HTMLTextAreaElement, InputEvent> = (event) => {
    props.onValueChange?.(event.currentTarget.value)
    callEventHandler(props.onInput, event)
    onSettled(() => {
      reconcileControlledValue()
      applyResize()
    })
  }

  const assignRef = (element: HTMLTextAreaElement) => {
    textarea = element
    if (props.ref) callRef(props.ref, element)
  }

  return (
    <textarea
      {...rest}
      ref={assignRef}
      {...(props.value !== undefined ? { value: props.value } : { defaultValue })}
      disabled={explicitDisabled() !== undefined ? explicitDisabled() : undefined}
      readonly={explicitReadOnly() !== undefined ? explicitReadOnly() : undefined}
      required={explicitRequired() !== undefined ? explicitRequired() : undefined}
      aria-invalid={stateAria(explicitInvalid(), props["aria-invalid"])}
      aria-required={stateAria(explicitRequired(), props["aria-required"])}
      aria-disabled={stateAria(explicitDisabled(), props["aria-disabled"])}
      aria-readonly={stateAria(explicitReadOnly(), props["aria-readonly"])}
      class={props.class}
      style={props.style}
      onInput={handleInput}
      onBlur={props.onBlur}
      onFocus={props.onFocus}
      {...applySemanticAttrs({
        scope: "textarea",
        part: "root",
        disabled: semanticDisabled(),
        readonly: semanticReadOnly(),
        required: semanticRequired(),
        invalid: semanticInvalid(),
      })}
    />
  )
}
