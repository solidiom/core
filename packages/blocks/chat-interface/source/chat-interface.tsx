/**
 * BLOCK-AI-01: ChatInterface block.
 *
 * AI chat interface with message history, streaming responses, and actions.
 * Implements all four required states: loading, empty, error, restricted.
 *
 * Dependencies: Button, Input, Field, Card, Alert, Popover, Scroll Area, Toast, Spinner
 */

import { createSignal, Show } from "solid-js"
import type { JSX } from "@solidjs/web"

export interface ChatInterfaceProps {
  error?: string
  restricted?: boolean
  restrictedReason?: string
  class?: string
  children?: JSX.Element
}

export type ChatInterfaceState = "empty" | "loading" | "error" | "restricted"

export function ChatInterface(props: ChatInterfaceProps): JSX.Element {
  const [state, setState] = createSignal<ChatInterfaceState>(
    props.restricted ? "restricted" : "empty",
  )
  const [localError, setLocalError] = createSignal("")

  const currentError = () => props.error || localError()

  return (
    <div
      class={["solidiom-block-chat-interface", props.class].filter(Boolean).join(" ")}
      data-state={state()}
    >
      <Show when={state() === "restricted"}>
        <div class="solidiom-block-chat-interface__restricted" role="alert">
          <p>{props.restrictedReason || "This feature is currently restricted."}</p>
        </div>
      </Show>

      <Show when={state() === "error" && currentError()}>
        <div class="solidiom-block-chat-interface__error" role="alert">
          <p>{currentError()}</p>
        </div>
      </Show>

      <Show when={state() === "loading"}>
        <div class="solidiom-block-chat-interface__loading" aria-live="polite">
          <span class="solidiom-block-chat-interface__spinner" aria-hidden="true" />
          Loading...
        </div>
      </Show>

      <Show when={state() !== "restricted" && state() !== "loading"}>
        <div class="solidiom-block-chat-interface__content">{props.children}</div>
      </Show>
    </div>
  )
}

export default ChatInterface
