/**
 * BLOCK-AUTH-01: Sign In block.
 *
 * Composable authentication form using Solidiom components.
 * Implements all four required states: loading, empty, error, restricted.
 *
 * Dependencies: Button, Input, Field, Alert, Spinner (COMP-001, 002, 003, 005, 029)
 */

import { createSignal, createUniqueId, For, Show } from "solid-js"
import type { JSX } from "@solidjs/web"

// ─── Types ──────────────────────────────────────────────────────────────────

export interface SignInProps {
  /** Called when the form is submitted with credentials. */
  onSubmit?: (credentials: { email: string; password: string }) => Promise<void>
  /** Called when OAuth provider is selected. */
  onOAuthSelect?: (provider: string) => void
  /** OAuth providers to display. */
  oauthProviders?: string[]
  /** External error message to display. */
  error?: string
  /** Whether the account is restricted (locked, MFA required). */
  restricted?: boolean
  /** Restricted reason message. */
  restrictedReason?: string
  /** Additional class name. */
  class?: string
}

export type SignInState = "empty" | "loading" | "error" | "restricted"

// ─── Component ──────────────────────────────────────────────────────────────

export function SignIn(props: SignInProps): JSX.Element {
  const [email, setEmail] = createSignal("")
  const [password, setPassword] = createSignal("")
  const [state, setState] = createSignal<SignInState>("empty")
  const [localError, setLocalError] = createSignal("")
  const id = createUniqueId()
  const emailId = `sign-in-${id}-email`
  const passwordId = `sign-in-${id}-password`

  const currentError = () => props.error || localError()
  const currentState = (): SignInState => {
    if (props.restricted) return "restricted"
    if (currentError()) return "error"
    return state()
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault()
    setLocalError("")

    if (!email() || !password()) {
      setLocalError("Email and password are required.")
      setState("error")
      return
    }

    setState("loading")
    try {
      await props.onSubmit?.({ email: email(), password: password() })
      setState("empty")
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Authentication failed.")
      setState("error")
    }
  }

  return (
    <div
      class={["solidiom-block-sign-in", props.class].filter(Boolean).join(" ")}
      data-state={currentState()}
    >
      {/* Restricted state */}
      <Show when={currentState() === "restricted"}>
        <div class="solidiom-block-sign-in__restricted" role="alert">
          <p>
            {props.restrictedReason || "Your account access is restricted. Please contact support."}
          </p>
        </div>
      </Show>

      {/* Error state */}
      <Show when={currentState() === "error" && currentError()}>
        <div class="solidiom-block-sign-in__error" role="alert">
          <p>{currentError()}</p>
        </div>
      </Show>

      {/* Form */}
      <Show when={currentState() !== "restricted"}>
        <form onSubmit={handleSubmit} class="solidiom-block-sign-in__form">
          <div class="solidiom-block-sign-in__field">
            <label for={emailId}>Email</label>
            <input
              id={emailId}
              type="email"
              value={email()}
              onInput={(e) => setEmail(e.currentTarget.value)}
              placeholder="you@example.com"
              autocomplete="email"
              required
              disabled={currentState() === "loading"}
            />
          </div>

          <div class="solidiom-block-sign-in__field">
            <label for={passwordId}>Password</label>
            <input
              id={passwordId}
              type="password"
              value={password()}
              onInput={(e) => setPassword(e.currentTarget.value)}
              placeholder="Password"
              autocomplete="current-password"
              required
              disabled={currentState() === "loading"}
            />
          </div>

          <button
            type="submit"
            class="solidiom-block-sign-in__submit"
            disabled={currentState() === "loading"}
          >
            <Show when={currentState() === "loading"} fallback="Sign In">
              <span class="solidiom-block-sign-in__spinner" aria-hidden="true" />
              Signing in...
            </Show>
          </button>
        </form>

        {/* OAuth providers */}
        <Show when={props.oauthProviders?.length}>
          <div class="solidiom-block-sign-in__oauth">
            <div class="solidiom-block-sign-in__divider">
              <span>or continue with</span>
            </div>
            <div class="solidiom-block-sign-in__oauth-buttons">
              <For each={props.oauthProviders}>
                {(provider) => (
                  <button
                    type="button"
                    class="solidiom-block-sign-in__oauth-btn"
                    onClick={() => props.onOAuthSelect?.(provider)}
                    disabled={currentState() === "loading"}
                  >
                    {provider}
                  </button>
                )}
              </For>
            </div>
          </div>
        </Show>
      </Show>
    </div>
  )
}

export default SignIn
