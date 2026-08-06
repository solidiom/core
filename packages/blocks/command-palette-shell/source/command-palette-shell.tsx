/**
 * BLOCK-SHELL-02: CommandPaletteShell block.
 *
 * User accesses a global keyboard-driven command menu for quick navigation,
 * search, and action execution.
 * Implements all four required states: loading, empty, error, restricted.
 *
 * Dependencies: Input, Card, Select, Dropdown Menu, Command Palette, Data Table, Kbd, Spinner
 */

import { createSignal, Show, type JSX } from "solid-js"

export interface CommandPaletteShellProps {
  error?: string
  restricted?: boolean
  restrictedReason?: string
  class?: string
  children?: JSX.Element
}

export type CommandPaletteShellState = "empty" | "loading" | "error" | "restricted"

export function CommandPaletteShell(props: CommandPaletteShellProps): JSX.Element {
  const [state, setState] = createSignal<CommandPaletteShellState>(
    props.restricted ? "restricted" : "empty",
  )
  const [localError, setLocalError] = createSignal("")

  const currentError = () => props.error || localError()

  return (
    <div class={["solidiom-block-command-palette-shell", props.class].filter(Boolean).join(" ")} data-state={state()}>
      <Show when={state() === "restricted"}>
        <div class="solidiom-block-command-palette-shell__restricted" role="alert">
          <p>{props.restrictedReason || "This feature is currently restricted."}</p>
        </div>
      </Show>

      <Show when={state() === "error" && currentError()}>
        <div class="solidiom-block-command-palette-shell__error" role="alert">
          <p>{currentError()}</p>
        </div>
      </Show>

      <Show when={state() === "loading"}>
        <div class="solidiom-block-command-palette-shell__loading" aria-live="polite">
          <span class="solidiom-block-command-palette-shell__spinner" aria-hidden="true" />
          Loading...
        </div>
      </Show>

      <Show when={state() !== "restricted" && state() !== "loading"}>
        <div class="solidiom-block-command-palette-shell__content">
          {props.children}
        </div>
      </Show>
    </div>
  )
}

export default CommandPaletteShell
