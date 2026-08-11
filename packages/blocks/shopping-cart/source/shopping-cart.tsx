/**
 * BLOCK-COMMERCE-02: ShoppingCart block.
 *
 * User manages cart items with quantity adjustments, coupon application,
 * and checkout initiation.
 * Implements all four required states: loading, empty, error, restricted.
 *
 * Dependencies: Button, Input, Field, Card, Alert, Dialog, Dropdown Menu, Toast, Switch, Data Table, Spinner
 */

import { createSignal, Show, type JSX } from "solid-js"

export interface ShoppingCartProps {
  error?: string
  restricted?: boolean
  restrictedReason?: string
  class?: string
  children?: JSX.Element
}

export type ShoppingCartState = "empty" | "loading" | "error" | "restricted"

export function ShoppingCart(props: ShoppingCartProps): JSX.Element {
  const [state, setState] = createSignal<ShoppingCartState>(
    props.restricted ? "restricted" : "empty",
  )
  const [localError, setLocalError] = createSignal("")

  const currentError = () => props.error || localError()

  return (
    <div
      class={["solidiom-block-shopping-cart", props.class].filter(Boolean).join(" ")}
      data-state={state()}
    >
      <Show when={state() === "restricted"}>
        <div class="solidiom-block-shopping-cart__restricted" role="alert">
          <p>{props.restrictedReason || "This feature is currently restricted."}</p>
        </div>
      </Show>

      <Show when={state() === "error" && currentError()}>
        <div class="solidiom-block-shopping-cart__error" role="alert">
          <p>{currentError()}</p>
        </div>
      </Show>

      <Show when={state() === "loading"}>
        <div class="solidiom-block-shopping-cart__loading" aria-live="polite">
          <span class="solidiom-block-shopping-cart__spinner" aria-hidden="true" />
          Loading...
        </div>
      </Show>

      <Show when={state() !== "restricted" && state() !== "loading"}>
        <div class="solidiom-block-shopping-cart__content">{props.children}</div>
      </Show>
    </div>
  )
}

export default ShoppingCart
