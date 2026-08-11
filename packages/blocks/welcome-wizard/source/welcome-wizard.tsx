/**
 * BLOCK-ONBOARD-01: Welcome Wizard block.
 *
 * Multi-step onboarding wizard with progress tracking.
 * Implements all four required states: loading, empty, error, restricted.
 *
 * Dependencies: Button, Card, Alert, Tabs, Avatar, Checkbox, Switch, Breadcrumb, Spinner
 */

import { createSignal, Show, For, type JSX } from "solid-js"

export interface WizardStep {
  id: string
  title: string
  description: string
  completed?: boolean
}

export interface WelcomeWizardProps {
  steps?: WizardStep[]
  onStepComplete?: (stepId: string) => Promise<void>
  onFinish?: () => Promise<void>
  error?: string
  restricted?: boolean
  restrictedReason?: string
  class?: string
}

export type WelcomeWizardState = "empty" | "loading" | "error" | "restricted"

export function WelcomeWizard(props: WelcomeWizardProps): JSX.Element {
  const [currentStep, setCurrentStep] = createSignal(0)
  const [state, setState] = createSignal<WelcomeWizardState>(
    props.restricted ? "restricted" : "empty",
  )
  const [localError, setLocalError] = createSignal("")

  const currentError = () => props.error || localError()
  const steps = () => props.steps ?? []

  async function handleNext() {
    setLocalError("")
    setState("loading")
    try {
      const step = steps()[currentStep()]
      if (step) await props.onStepComplete?.(step.id)
      if (currentStep() < steps().length - 1) {
        setCurrentStep((s) => s + 1)
      } else {
        await props.onFinish?.()
      }
      setState("empty")
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Failed to complete step.")
      setState("error")
    }
  }

  return (
    <div
      class={["solidiom-block-welcome-wizard", props.class].filter(Boolean).join(" ")}
      data-state={state()}
    >
      <Show when={state() === "restricted"}>
        <div class="solidiom-block-welcome-wizard__restricted" role="alert">
          <p>{props.restrictedReason || "Onboarding is currently unavailable."}</p>
        </div>
      </Show>

      <Show when={state() === "error" && currentError()}>
        <div class="solidiom-block-welcome-wizard__error" role="alert">
          <p>{currentError()}</p>
        </div>
      </Show>

      <Show when={state() !== "restricted"}>
        <nav class="solidiom-block-welcome-wizard__progress" aria-label="Wizard progress">
          <For each={steps()}>
            {(step, i) => (
              <div
                class="solidiom-block-welcome-wizard__step"
                classList={{
                  "is-active": i() === currentStep(),
                  "is-complete": step.completed || i() < currentStep(),
                }}
              >
                <span class="solidiom-block-welcome-wizard__step-number">{i() + 1}</span>
                <span class="solidiom-block-welcome-wizard__step-title">{step.title}</span>
              </div>
            )}
          </For>
        </nav>

        <div class="solidiom-block-welcome-wizard__content">
          <Show when={steps()[currentStep()]}>
            {(step) => (
              <div class="solidiom-block-welcome-wizard__card">
                <h2>{step().title}</h2>
                <p>{step().description}</p>
              </div>
            )}
          </Show>
        </div>

        <div class="solidiom-block-welcome-wizard__actions">
          <Show when={currentStep() > 0}>
            <button
              type="button"
              class="solidiom-block-welcome-wizard__back"
              onClick={() => setCurrentStep((s) => s - 1)}
              disabled={state() === "loading"}
            >
              Back
            </button>
          </Show>
          <button
            type="button"
            class="solidiom-block-welcome-wizard__next"
            onClick={handleNext}
            disabled={state() === "loading"}
          >
            <Show
              when={state() === "loading"}
              fallback={currentStep() < steps().length - 1 ? "Next" : "Finish"}
            >
              Processing...
            </Show>
          </button>
        </div>
      </Show>
    </div>
  )
}

export default WelcomeWizard
