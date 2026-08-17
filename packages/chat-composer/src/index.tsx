/**
 * @solidiom/chat-composer — Chat input area with auto-growing textarea and submit.
 *
 * Parts: Root, Input, SendButton, AttachButton.
 *
 * Root is a <form> that handles submit. Input is a <textarea> that auto-grows
 * and submits on Enter (Shift+Enter for newline). SendButton is disabled when empty.
 */

import { createContext, useContext, createSignal, type Accessor } from "solid-js"
import { type JSX } from "@solidjs/web"
import { applySemanticAttrs, createControllableValue } from "@solidiom/runtime"

// ─── Types ──────────────────────────────────────────────────────────────────

interface ChatComposerContextValue {
  value: Accessor<string>
  setValue: (v: string) => void
  disabled: () => boolean
  placeholder: () => string
  maxLength: () => number | undefined
  submit: () => void
}

const ChatComposerContext = createContext<ChatComposerContextValue>()

function useChatComposerContext(): ChatComposerContextValue {
  const ctx = useContext(ChatComposerContext)
  if (!ctx) throw new Error("ChatComposer parts must be used within ChatComposer.Root")
  return ctx
}

// ─── Root ───────────────────────────────────────────────────────────────────

export interface ChatComposerRootProps {
  /** Callback when a message is submitted. */
  onSubmit?: (message: string) => void
  /** Placeholder text for the input. */
  placeholder?: string
  /** Disable the composer. */
  disabled?: boolean
  /** Max character length. */
  maxLength?: number
  /** Controlled value. */
  value?: Accessor<string>
  /** Default uncontrolled value. */
  defaultValue?: string
  /** Called when value changes. */
  onValueChange?: (value: string) => void
  class?: string
  style?: JSX.CSSProperties | string
  children: JSX.Element
}

/**
 * ChatComposer.Root — <form> container that handles message submission.
 */
export function Root(props: ChatComposerRootProps) {
  const disabled = () => props.disabled ?? false
  const placeholder = () => props.placeholder ?? ""
  const maxLength = () => props.maxLength

  const { value, requestChange } = createControllableValue<string, "input" | "submit">({
    value: props.value,
    defaultValue: props.defaultValue ?? "",
    onChange: (next) => props.onValueChange?.(next),
  })

  const setValue = (v: string) => {
    requestChange(v, { reason: "input" })
  }

  const submit = () => {
    const msg = value().trim()
    if (!msg || disabled()) return
    props.onSubmit?.(msg)
    requestChange("", { reason: "submit" })
  }

  const handleSubmit: JSX.EventHandler<HTMLFormElement, SubmitEvent> = (e) => {
    e.preventDefault()
    submit()
  }

  return (
    <ChatComposerContext value={{ value, setValue, disabled, placeholder, maxLength, submit }}>
      <form
        onSubmit={handleSubmit}
        class={props.class}
        style={props.style}
        {...applySemanticAttrs({ scope: "chat-composer", part: "root", disabled: disabled() })}
      >
        {props.children}
      </form>
    </ChatComposerContext>
  )
}

// ─── Input ──────────────────────────────────────────────────────────────────

export interface ChatComposerInputProps {
  class?: string
  style?: JSX.CSSProperties | string
}

/** ChatComposer.Input — auto-growing textarea, submits on Enter. */
export function Input(props: ChatComposerInputProps) {
  const ctx = useChatComposerContext()
  let textareaRef: HTMLTextAreaElement | undefined

  const autoGrow = (el: HTMLTextAreaElement) => {
    el.style.height = "auto"
    el.style.height = `${el.scrollHeight}px`
  }

  const handleInput: JSX.EventHandler<HTMLTextAreaElement, InputEvent> = (e) => {
    const target = e.currentTarget
    ctx.setValue(target.value)
    autoGrow(target)
  }

  const handleKeyDown: JSX.EventHandler<HTMLTextAreaElement, KeyboardEvent> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      ctx.submit()
      if (textareaRef) {
        textareaRef.style.height = "auto"
      }
    }
  }

  return (
    <textarea
      ref={textareaRef}
      value={ctx.value()}
      placeholder={ctx.placeholder()}
      disabled={ctx.disabled()}
      maxLength={ctx.maxLength()}
      rows={1}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "chat-composer", part: "input", disabled: ctx.disabled() })}
    />
  )
}

// ─── SendButton ─────────────────────────────────────────────────────────────

export interface ChatComposerSendButtonProps {
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}

/** ChatComposer.SendButton — submit button, disabled when input is empty. */
export function SendButton(props: ChatComposerSendButtonProps) {
  const ctx = useChatComposerContext()
  const isEmpty = () => ctx.value().trim() === ""

  return (
    <button
      type="submit"
      disabled={isEmpty() || ctx.disabled()}
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "chat-composer", part: "send-button", disabled: isEmpty() || ctx.disabled() })}
    >
      {props.children ?? "Send"}
    </button>
  )
}

// ─── AttachButton ───────────────────────────────────────────────────────────

export interface ChatComposerAttachButtonProps {
  /** Called when the attach action is triggered. */
  onClick?: () => void
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}

/** ChatComposer.AttachButton — optional file attachment trigger. */
export function AttachButton(props: ChatComposerAttachButtonProps) {
  const ctx = useChatComposerContext()

  return (
    <button
      type="button"
      disabled={ctx.disabled()}
      onClick={() => props.onClick?.()}
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "chat-composer", part: "attach-button", disabled: ctx.disabled() })}
    >
      {props.children ?? "Attach"}
    </button>
  )
}
