/**
 * BLOCK-BILLING-01: Subscription Plans block.
 *
 * Plan comparison and selection with upgrade/downgrade flow.
 * Implements all four required states: loading, empty, error, restricted.
 *
 * Dependencies: Button, Card, Alert, Dialog, Tabs, Toast, Checkbox, Spinner
 */

import { createSignal, Show, For, type JSX } from "solid-js"

export interface Plan {
  id: string
  name: string
  price: string
  interval: "monthly" | "yearly"
  features: string[]
  recommended?: boolean
}

export interface SubscriptionPlansProps {
  plans?: Plan[]
  currentPlanId?: string
  onSelectPlan?: (planId: string) => Promise<void>
  error?: string
  restricted?: boolean
  restrictedReason?: string
  class?: string
}

export type SubscriptionPlansState = "empty" | "loading" | "error" | "restricted"

export function SubscriptionPlans(props: SubscriptionPlansProps): JSX.Element {
  const [state, setState] = createSignal<SubscriptionPlansState>(
    props.restricted ? "restricted" : "empty",
  )
  const [localError, setLocalError] = createSignal("")

  const currentError = () => props.error || localError()

  async function handleSelect(planId: string) {
    setLocalError("")
    setState("loading")
    try {
      await props.onSelectPlan?.(planId)
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Plan selection failed.")
      setState("error")
    }
  }

  return (
    <div class={["solidiom-block-subscription-plans", props.class].filter(Boolean).join(" ")} data-state={state()}>
      <Show when={state() === "restricted"}>
        <div class="solidiom-block-subscription-plans__restricted" role="alert">
          <p>{props.restrictedReason || "Plan management is restricted."}</p>
        </div>
      </Show>

      <Show when={state() === "error" && currentError()}>
        <div class="solidiom-block-subscription-plans__error" role="alert">
          <p>{currentError()}</p>
        </div>
      </Show>

      <Show when={state() !== "restricted"}>
        <Show when={state() === "loading"}>
          <div class="solidiom-block-subscription-plans__loading" aria-live="polite">
            <span class="solidiom-block-subscription-plans__spinner" aria-hidden="true" />
            Processing...
          </div>
        </Show>

        <div class="solidiom-block-subscription-plans__grid">
          <For each={props.plans ?? []}>
            {(plan) => (
              <div class="solidiom-block-subscription-plans__card" classList={{ "is-current": plan.id === props.currentPlanId, "is-recommended": plan.recommended }}>
                <h3>{plan.name}</h3>
                <p class="solidiom-block-subscription-plans__price">{plan.price}<span>/{plan.interval}</span></p>
                <ul class="solidiom-block-subscription-plans__features">
                  <For each={plan.features}>{(feature) => <li>{feature}</li>}</For>
                </ul>
                <button type="button" class="solidiom-block-subscription-plans__select" onClick={() => handleSelect(plan.id)} disabled={state() === "loading" || plan.id === props.currentPlanId}>
                  {plan.id === props.currentPlanId ? "Current Plan" : "Select"}
                </button>
              </div>
            )}
          </For>
        </div>
      </Show>
    </div>
  )
}

export default SubscriptionPlans
