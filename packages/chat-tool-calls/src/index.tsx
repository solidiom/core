/**
 * @solidiom/chat-tool-calls — Display of tool/function call results in AI chat interfaces.
 *
 * Parts: Root, ToolCall, ToolName, ToolInput, ToolOutput, ToolStatus.
 *
 * ToolInput and ToolOutput use createDisclosureState for collapsible sections.
 * ToolCall tracks status: pending, running, success, error.
 */

import { createContext, useContext, type Accessor, Show } from "solid-js"
import { type JSX } from "@solidjs/web"
import { applySemanticAttrs, createDisclosureState, createStableId } from "@solidiom/runtime"

// ─── Types ──────────────────────────────────────────────────────────────────

export type ToolCallStatus = "pending" | "running" | "success" | "error"

interface ToolCallContextValue {
  name: () => string
  status: () => ToolCallStatus
  inputId: string
  outputId: string
}

const ToolCallContext = createContext<ToolCallContextValue>()

function useToolCallContext(): ToolCallContextValue {
  const ctx = useContext(ToolCallContext)
  if (!ctx) throw new Error("ChatToolCalls parts must be used within ToolCall")
  return ctx
}

// ─── Root ───────────────────────────────────────────────────────────────────

export interface ChatToolCallsRootProps {
  class?: string
  style?: JSX.CSSProperties | string
  children: JSX.Element
}

/**
 * ChatToolCalls.Root — container for a group of tool calls.
 */
export function Root(props: ChatToolCallsRootProps) {
  return (
    <div
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "chat-tool-calls", part: "root" })}
    >
      {props.children}
    </div>
  )
}

// ─── ToolCall ───────────────────────────────────────────────────────────────

export interface ChatToolCallProps {
  /** Name of the tool/function being called. */
  name: string
  /** Current execution status. */
  status?: ToolCallStatus
  /** Input parameters (stringified). */
  input?: string
  /** Output/result (stringified). */
  output?: string
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}

/** ChatToolCalls.ToolCall — individual tool call container. */
export function ToolCall(props: ChatToolCallProps) {
  const baseId = createStableId("tool-call")
  const status = () => props.status ?? "pending"

  const ctx: ToolCallContextValue = {
    name: () => props.name,
    status,
    inputId: `${baseId}-input`,
    outputId: `${baseId}-output`,
  }

  return (
    <ToolCallContext value={ctx}>
      <div
        data-state={status()}
        class={props.class}
        style={props.style}
        {...applySemanticAttrs({ scope: "chat-tool-calls", part: "tool-call", state: status() })}
      >
        {props.children}
      </div>
    </ToolCallContext>
  )
}

// ─── ToolName ───────────────────────────────────────────────────────────────

export interface ChatToolCallToolNameProps {
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}

/** ChatToolCalls.ToolName — displays the tool/function name. */
export function ToolName(props: ChatToolCallToolNameProps) {
  const ctx = useToolCallContext()

  return (
    <span
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "chat-tool-calls", part: "tool-name" })}
    >
      {props.children ?? ctx.name()}
    </span>
  )
}

// ─── ToolInput ──────────────────────────────────────────────────────────────

export interface ChatToolCallToolInputProps {
  /** Override input content. If not provided, reads from ToolCall props context is not available directly. */
  content?: string
  /** Whether the section is initially open. */
  defaultOpen?: boolean
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}

/** ChatToolCalls.ToolInput — collapsible section showing input parameters. */
export function ToolInput(props: ChatToolCallToolInputProps) {
  const ctx = useToolCallContext()
  const { open, requestOpenChange } = createDisclosureState({
    defaultOpen: props.defaultOpen ?? false,
    onOpenChange: () => {},
  })

  const toggle = () => {
    requestOpenChange(!open(), { reason: "trigger" } as any)
  }

  const triggerId = `${ctx.inputId}-trigger`

  return (
    <div
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "chat-tool-calls", part: "tool-input", state: open() ? "open" : "closed" })}
    >
      <button
        type="button"
        id={triggerId}
        aria-expanded={open() ? "true" : "false"}
        aria-controls={ctx.inputId}
        onClick={toggle}
        {...applySemanticAttrs({ scope: "chat-tool-calls", part: "tool-input-trigger", state: open() ? "open" : "closed" })}
      >
        Input
      </button>
      <Show when={open()}>
        <div
          id={ctx.inputId}
          role="region"
          aria-labelledby={triggerId}
          {...applySemanticAttrs({ scope: "chat-tool-calls", part: "tool-input-content", state: "open" })}
        >
          {props.children ?? <pre>{props.content}</pre>}
        </div>
      </Show>
    </div>
  )
}

// ─── ToolOutput ─────────────────────────────────────────────────────────────

export interface ChatToolCallToolOutputProps {
  /** Override output content. */
  content?: string
  /** Whether the section is initially open. */
  defaultOpen?: boolean
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}

/** ChatToolCalls.ToolOutput — collapsible section showing output/result. */
export function ToolOutput(props: ChatToolCallToolOutputProps) {
  const ctx = useToolCallContext()
  const { open, requestOpenChange } = createDisclosureState({
    defaultOpen: props.defaultOpen ?? false,
    onOpenChange: () => {},
  })

  const toggle = () => {
    requestOpenChange(!open(), { reason: "trigger" } as any)
  }

  const triggerId = `${ctx.outputId}-trigger`

  return (
    <div
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "chat-tool-calls", part: "tool-output", state: open() ? "open" : "closed" })}
    >
      <button
        type="button"
        id={triggerId}
        aria-expanded={open() ? "true" : "false"}
        aria-controls={ctx.outputId}
        onClick={toggle}
        {...applySemanticAttrs({ scope: "chat-tool-calls", part: "tool-output-trigger", state: open() ? "open" : "closed" })}
      >
        Output
      </button>
      <Show when={open()}>
        <div
          id={ctx.outputId}
          role="region"
          aria-labelledby={triggerId}
          {...applySemanticAttrs({ scope: "chat-tool-calls", part: "tool-output-content", state: "open" })}
        >
          {props.children ?? <pre>{props.content}</pre>}
        </div>
      </Show>
    </div>
  )
}

// ─── ToolStatus ─────────────────────────────────────────────────────────────

export interface ChatToolCallToolStatusProps {
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}

/** ChatToolCalls.ToolStatus — status indicator for the tool call. */
export function ToolStatus(props: ChatToolCallToolStatusProps) {
  const ctx = useToolCallContext()

  return (
    <span
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "chat-tool-calls", part: "tool-status", state: ctx.status() })}
    >
      {props.children ?? ctx.status()}
    </span>
  )
}
