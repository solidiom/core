/**
 * BLOCK-AUTH-01: Sign In block.
 *
 * Composable authentication form using Solidiom components.
 * Implements all four required states: loading, empty, error, restricted.
 *
 * Dependencies: Button, Input, Field, Alert, Spinner (COMP-001, 002, 003, 005, 029)
 */

import { createSignal, Show, type JSX } from "solid-js"

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
  const [state, setState] = createSignal<SignInState>(
    props.restricted ? "restricted" : "empty",
  )
  const [localError, setLocalError] = createSignal("")

  const currentError = () => props.error || localError()

  async function handleSubmit(e: Event) {
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
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Authentication failed.")
      setState("error")
    }
  }

  return (
    <div
      class={["solidiom-block-sign-in", props.class].filter(Boolean).join(" ")}
      data-state={state()}
    >
      {/* Restricted state */}
      <Show when={state() === "restricted"}>
        <div class="solidiom-block-sign-in__restricted" role="alert">
          <p>{props.restrictedReason || "Your account access is restricted. Please contact support."}</p>
        </div>
      </Show>

      {/* Error state */}
      <Show when={state() === "error" && currentError()}>
        <div class="solidiom-block-sign-in__error" role="alert">
          <p>{currentError()}</p>
        </div>
      </Show>

      {/* Form */}
      <Show when={state() !== "restricted"}>
        <form onSubmit={handleSubmit} class="solidiom-block-sign-in__form">
          <div class="solidiom-block-sign-in__field">
            <label for="sign-in-email">Email</label>
            <input
              id="sign-in-email"
              type="email"
              value={email()}
              onInput={(e) => setEmail(e.currentTarget.value)}
              placeholder="you@example.com"
              autocomplete="email"
              required
              disabled={state() === "loading"}
            />
          </div>

          <div class="solidiom-block-sign-in__field">
            <label for="sign-in-password">Password</label>
            <input
              id="sign-in-password"
              type="password"
              value={password()}
              onInput={(e) => setPassword(e.currentTarget.value)}
              placeholder="Password"
              autocomplete="current-password"
              required
              disabled={state() === "loading"}
            />
          </div>

          <button
            type="submit"
            class="solidiom-block-sign-in__submit"
            disabled={state() === "loading"}
          >
            <Show when={state() === "loading"} fallback="Sign In">
              <span class="solidiom-block-sign-in__spinner" aria-hidden="true" />
              Signing in...
            </Show>
          </button>
        </form>

        {/* OAuth providers */}
        <Show when={props.oauthProviders && props.oauthProviders.length > 0}>
          <div class="solidiom-block-sign-in__oauth">
            <div class="solidiom-block-sign-in__divider">
              <span>or continue with</span>
            </div>
            <div class="solidiom-block-sign-in__oauth-buttons">
              {props.oauthProviders!.map((provider) => (
                <button
                  type="button"
                  class="solidiom-block-sign-in__oauth-btn"
                  onClick={() => props.onOAuthSelect?.(provider)}
                  disabled={state() === "loading"}
                >
                  {provider}
                </button>
              ))}
            </div>
          </div>
        </Show>
      </Show>
    </div>
  )
}

export default SignIn
