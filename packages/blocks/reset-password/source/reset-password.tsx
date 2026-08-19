/**
 * BLOCK-AUTH-03: Reset Password block.
 *
 * Password reset flow with email request and new password form.
 * Implements all four required states: loading, empty, error, restricted.
 *
 * Dependencies: Button, Input, Field, Alert, Toast, Spinner
 */

import { createSignal, Show } from "solid-js"
import type { JSX } from "@solidjs/web"

export interface ResetPasswordProps {
  onRequestReset?: (email: string) => Promise<void>
  onSetNewPassword?: (password: string, token: string) => Promise<void>
  token?: string
  error?: string
  restricted?: boolean
  restrictedReason?: string
  class?: string
}

export type ResetPasswordState = "empty" | "loading" | "error" | "restricted"

export function ResetPassword(props: ResetPasswordProps): JSX.Element {
  const [email, setEmail] = createSignal("")
  const [password, setPassword] = createSignal("")
  const [confirmPassword, setConfirmPassword] = createSignal("")
  const [state, setState] = createSignal<ResetPasswordState>(
    props.restricted ? "restricted" : "empty",
  )
  const [localError, setLocalError] = createSignal("")
  const [sent, setSent] = createSignal(false)

  const currentError = () => props.error || localError()
  const hasToken = () => !!props.token

  async function handleRequestReset(e: Event) {
    e.preventDefault()
    setLocalError("")
    if (!email()) {
      setLocalError("Email is required.")
      setState("error")
      return
    }
    setState("loading")
    try {
      await props.onRequestReset?.(email())
      setSent(true)
      setState("empty")
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Request failed.")
      setState("error")
    }
  }

  async function handleSetPassword(e: Event) {
    e.preventDefault()
    setLocalError("")
    if (!password() || !confirmPassword()) {
      setLocalError("Both fields are required.")
      setState("error")
      return
    }
    if (password() !== confirmPassword()) {
      setLocalError("Passwords do not match.")
      setState("error")
      return
    }
    setState("loading")
    try {
      await props.onSetNewPassword?.(password(), props.token!)
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Password update failed.")
      setState("error")
    }
  }

  return (
    <div
      class={["solidiom-block-reset-password", props.class].filter(Boolean).join(" ")}
      data-state={state()}
    >
      <Show when={state() === "restricted"}>
        <div class="solidiom-block-reset-password__restricted" role="alert">
          <p>{props.restrictedReason || "Password reset is currently unavailable."}</p>
        </div>
      </Show>

      <Show when={state() === "error" && currentError()}>
        <div class="solidiom-block-reset-password__error" role="alert">
          <p>{currentError()}</p>
        </div>
      </Show>

      <Show when={state() !== "restricted"}>
        <Show
          when={hasToken()}
          fallback={
            <Show
              when={!sent()}
              fallback={
                <div class="solidiom-block-reset-password__sent">
                  <p>Check your email for a reset link.</p>
                </div>
              }
            >
              <form onSubmit={handleRequestReset} class="solidiom-block-reset-password__form">
                <div class="solidiom-block-reset-password__field">
                  <label for="reset-email">Email</label>
                  <input
                    id="reset-email"
                    type="email"
                    value={email()}
                    onInput={(e) => setEmail(e.currentTarget.value)}
                    placeholder="you@example.com"
                    autocomplete="email"
                    required
                    disabled={state() === "loading"}
                  />
                </div>
                <button
                  type="submit"
                  class="solidiom-block-reset-password__submit"
                  disabled={state() === "loading"}
                >
                  <Show when={state() === "loading"} fallback="Send Reset Link">
                    Sending...
                  </Show>
                </button>
              </form>
            </Show>
          }
        >
          <form onSubmit={handleSetPassword} class="solidiom-block-reset-password__form">
            <div class="solidiom-block-reset-password__field">
              <label for="reset-new-password">New Password</label>
              <input
                id="reset-new-password"
                type="password"
                value={password()}
                onInput={(e) => setPassword(e.currentTarget.value)}
                placeholder="New password"
                autocomplete="new-password"
                required
                disabled={state() === "loading"}
              />
            </div>
            <div class="solidiom-block-reset-password__field">
              <label for="reset-confirm-password">Confirm Password</label>
              <input
                id="reset-confirm-password"
                type="password"
                value={confirmPassword()}
                onInput={(e) => setConfirmPassword(e.currentTarget.value)}
                placeholder="Confirm password"
                autocomplete="new-password"
                required
                disabled={state() === "loading"}
              />
            </div>
            <button
              type="submit"
              class="solidiom-block-reset-password__submit"
              disabled={state() === "loading"}
            >
              <Show when={state() === "loading"} fallback="Set New Password">
                Updating...
              </Show>
            </button>
          </form>
        </Show>
      </Show>
    </div>
  )
}

export default ResetPassword
