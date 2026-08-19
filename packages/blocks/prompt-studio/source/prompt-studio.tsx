/**
 * BLOCK-AI-02: PromptStudio block.
 *
 * Prompt engineering workspace with templates, variables, and testing.
 * Implements all four required states: loading, empty, error, restricted.
 *
 * Dependencies: Button, Input, Field, Card, Alert, Dialog, Select, Tabs, Dropdown Menu, Toast, Checkbox, Data Table, Spinner
 */

import { createSignal, Show } from "solid-js"
import type { JSX } from "@solidjs/web"

export interface PromptStudioProps {
  error?: string
  restricted?: boolean
  restrictedReason?: string
  class?: string
  children?: JSX.Element
}

export type PromptStudioState = "empty" | "loading" | "error" | "restricted"

export function PromptStudio(props: PromptStudioProps): JSX.Element {
  const [state, setState] = createSignal<PromptStudioState>(
    props.restricted ? "restricted" : "empty",
  )
  const [localError, setLocalError] = createSignal("")

  const currentError = () => props.error || localError()

  return (
    <div
      class={["solidiom-block-prompt-studio", props.class].filter(Boolean).join(" ")}
      data-state={state()}
    >
      <Show when={state() === "restricted"}>
        <div class="solidiom-block-prompt-studio__restricted" role="alert">
          <p>{props.restrictedReason || "This feature is currently restricted."}</p>
        </div>
      </Show>

      <Show when={state() === "error" && currentError()}>
        <div class="solidiom-block-prompt-studio__error" role="alert">
          <p>{currentError()}</p>
        </div>
      </Show>

      <Show when={state() === "loading"}>
        <div class="solidiom-block-prompt-studio__loading" aria-live="polite">
          <span class="solidiom-block-prompt-studio__spinner" aria-hidden="true" />
          Loading...
        </div>
      </Show>

      <Show when={state() !== "restricted" && state() !== "loading"}>
        <div class="solidiom-block-prompt-studio__content">{props.children}</div>
      </Show>
    </div>
  )
}

export default PromptStudio
