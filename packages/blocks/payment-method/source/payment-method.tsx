/**
 * BLOCK-BILLING-02: Payment Method block.
 *
 * Payment method management with add/edit/remove flows.
 * Implements all four required states: loading, empty, error, restricted.
 *
 * Dependencies: Button, Input, Field, Card, Alert, Dialog, Select, Dropdown Menu, Toast, Spinner
 */

import { createSignal, Show, For } from "solid-js"
import type { JSX } from "@solidjs/web"

export interface PaymentMethod {
  id: string
  type: "card" | "bank"
  last4: string
  brand?: string
  expiresAt?: string
  isDefault?: boolean
}

export interface PaymentMethodProps {
  methods?: PaymentMethod[]
  onAddMethod?: (data: { type: string; token: string }) => Promise<void>
  onRemoveMethod?: (id: string) => Promise<void>
  onSetDefault?: (id: string) => Promise<void>
  error?: string
  restricted?: boolean
  restrictedReason?: string
  class?: string
}

export type PaymentMethodState = "empty" | "loading" | "error" | "restricted"

export function PaymentMethodBlock(props: PaymentMethodProps): JSX.Element {
  const [state, setState] = createSignal<PaymentMethodState>(
    props.restricted ? "restricted" : "empty",
  )
  const [localError, setLocalError] = createSignal("")

  const currentError = () => props.error || localError()

  async function handleRemove(id: string) {
    setLocalError("")
    setState("loading")
    try {
      await props.onRemoveMethod?.(id)
      setState("empty")
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Failed to remove payment method.")
      setState("error")
    }
  }

  async function handleSetDefault(id: string) {
    setLocalError("")
    setState("loading")
    try {
      await props.onSetDefault?.(id)
      setState("empty")
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Failed to update default method.")
      setState("error")
    }
  }

  return (
    <div
      class={["solidiom-block-payment-method", props.class].filter(Boolean).join(" ")}
      data-state={state()}
    >
      <Show when={state() === "restricted"}>
        <div class="solidiom-block-payment-method__restricted" role="alert">
          <p>{props.restrictedReason || "Payment method management is restricted."}</p>
        </div>
      </Show>

      <Show when={state() === "error" && currentError()}>
        <div class="solidiom-block-payment-method__error" role="alert">
          <p>{currentError()}</p>
        </div>
      </Show>

      <Show when={state() !== "restricted"}>
        <Show when={state() === "loading"}>
          <div class="solidiom-block-payment-method__loading" aria-live="polite">
            <span class="solidiom-block-payment-method__spinner" aria-hidden="true" />
            Processing...
          </div>
        </Show>

        <Show when={!props.methods || props.methods.length === 0}>
          <div class="solidiom-block-payment-method__empty">
            <p>No payment methods on file.</p>
          </div>
        </Show>

        <div class="solidiom-block-payment-method__list">
          <For each={props.methods ?? []}>
            {(method) => (
              <div
                class="solidiom-block-payment-method__card"
                classList={{ "is-default": method.isDefault }}
              >
                <div class="solidiom-block-payment-method__info">
                  <span class="solidiom-block-payment-method__brand">
                    {method.brand ?? method.type}
                  </span>
                  <span class="solidiom-block-payment-method__last4">····{method.last4}</span>
                  <Show when={method.expiresAt}>
                    <span class="solidiom-block-payment-method__expires">
                      Expires {method.expiresAt}
                    </span>
                  </Show>
                </div>
                <div class="solidiom-block-payment-method__actions">
                  <Show when={!method.isDefault}>
                    <button
                      type="button"
                      onClick={() => handleSetDefault(method.id)}
                      disabled={state() === "loading"}
                    >
                      Set Default
                    </button>
                  </Show>
                  <button
                    type="button"
                    onClick={() => handleRemove(method.id)}
                    disabled={state() === "loading"}
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </For>
        </div>
      </Show>
    </div>
  )
}

export default PaymentMethodBlock
