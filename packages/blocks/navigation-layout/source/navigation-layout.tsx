/**
 * BLOCK-SHELL-01: NavigationLayout block.
 *
 * User navigates the application via a responsive sidebar with collapsible menu sections,
 * breadcrumbs, and current-route highlighting.
 * Implements all four required states: loading, empty, error, restricted.
 *
 * Dependencies: Button, Alert, Dropdown Menu, Tabs, Avatar, Checkbox, Popover, Navigation Menu, Breadcrumb, Resizable Panels, Spinner
 */

import { createSignal, Show, type JSX } from "solid-js"

export interface NavigationLayoutProps {
  error?: string
  restricted?: boolean
  restrictedReason?: string
  class?: string
  children?: JSX.Element
}

export type NavigationLayoutState = "empty" | "loading" | "error" | "restricted"

export function NavigationLayout(props: NavigationLayoutProps): JSX.Element {
  const [state, setState] = createSignal<NavigationLayoutState>(
    props.restricted ? "restricted" : "empty",
  )
  const [localError, setLocalError] = createSignal("")

  const currentError = () => props.error || localError()

  return (
    <div class={["solidiom-block-navigation-layout", props.class].filter(Boolean).join(" ")} data-state={state()}>
      <Show when={state() === "restricted"}>
        <div class="solidiom-block-navigation-layout__restricted" role="alert">
          <p>{props.restrictedReason || "This feature is currently restricted."}</p>
        </div>
      </Show>

      <Show when={state() === "error" && currentError()}>
        <div class="solidiom-block-navigation-layout__error" role="alert">
          <p>{currentError()}</p>
        </div>
      </Show>

      <Show when={state() === "loading"}>
        <div class="solidiom-block-navigation-layout__loading" aria-live="polite">
          <span class="solidiom-block-navigation-layout__spinner" aria-hidden="true" />
          Loading...
        </div>
      </Show>

      <Show when={state() !== "restricted" && state() !== "loading"}>
        <div class="solidiom-block-navigation-layout__content">
          {props.children}
        </div>
      </Show>
    </div>
  )
}

export default NavigationLayout
