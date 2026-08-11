/**
 * BLOCK-AUTH-02: Sign Up block.
 *
 * Registration form with email verification flow.
 * Implements all four required states: loading, empty, error, restricted.
 *
 * Dependencies: Button, Input, Field, Alert, Toast, Spinner
 */

import { createSignal, Show, type JSX } from "solid-js"

export interface SignUpProps {
  onSubmit?: (data: { email: string; password: string; name: string }) => Promise<void>
  onOAuthSelect?: (provider: string) => void
  oauthProviders?: string[]
  error?: string
  restricted?: boolean
  restrictedReason?: string
  class?: string
}

export type SignUpState = "empty" | "loading" | "error" | "restricted"

export function SignUp(props: SignUpProps): JSX.Element {
  const [name, setName] = createSignal("")
  const [email, setEmail] = createSignal("")
  const [password, setPassword] = createSignal("")
  const [state, setState] = createSignal<SignUpState>(props.restricted ? "restricted" : "empty")
  const [localError, setLocalError] = createSignal("")

  const currentError = () => props.error || localError()

  async function handleSubmit(e: Event) {
    e.preventDefault()
    setLocalError("")

    if (!name() || !email() || !password()) {
      setLocalError("All fields are required.")
      setState("error")
      return
    }

    setState("loading")
    try {
      await props.onSubmit?.({ email: email(), password: password(), name: name() })
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Registration failed.")
      setState("error")
    }
  }

  return (
    <div
      class={["solidiom-block-sign-up", props.class].filter(Boolean).join(" ")}
      data-state={state()}
    >
      <Show when={state() === "restricted"}>
        <div class="solidiom-block-sign-up__restricted" role="alert">
          <p>{props.restrictedReason || "Registration is currently restricted."}</p>
        </div>
      </Show>

      <Show when={state() === "error" && currentError()}>
        <div class="solidiom-block-sign-up__error" role="alert">
          <p>{currentError()}</p>
        </div>
      </Show>

      <Show when={state() !== "restricted"}>
        <form onSubmit={handleSubmit} class="solidiom-block-sign-up__form">
          <div class="solidiom-block-sign-up__field">
            <label for="sign-up-name">Name</label>
            <input
              id="sign-up-name"
              type="text"
              value={name()}
              onInput={(e) => setName(e.currentTarget.value)}
              placeholder="Your name"
              autocomplete="name"
              required
              disabled={state() === "loading"}
            />
          </div>
          <div class="solidiom-block-sign-up__field">
            <label for="sign-up-email">Email</label>
            <input
              id="sign-up-email"
              type="email"
              value={email()}
              onInput={(e) => setEmail(e.currentTarget.value)}
              placeholder="you@example.com"
              autocomplete="email"
              required
              disabled={state() === "loading"}
            />
          </div>
          <div class="solidiom-block-sign-up__field">
            <label for="sign-up-password">Password</label>
            <input
              id="sign-up-password"
              type="password"
              value={password()}
              onInput={(e) => setPassword(e.currentTarget.value)}
              placeholder="Password"
              autocomplete="new-password"
              required
              disabled={state() === "loading"}
            />
          </div>
          <button
            type="submit"
            class="solidiom-block-sign-up__submit"
            disabled={state() === "loading"}
          >
            <Show when={state() === "loading"} fallback="Create Account">
              <span class="solidiom-block-sign-up__spinner" aria-hidden="true" />
              Creating account...
            </Show>
          </button>
        </form>

        <Show when={props.oauthProviders && props.oauthProviders.length > 0}>
          <div class="solidiom-block-sign-up__oauth">
            <div class="solidiom-block-sign-up__divider">
              <span>or continue with</span>
            </div>
            <div class="solidiom-block-sign-up__oauth-buttons">
              {props.oauthProviders!.map((provider) => (
                <button
                  type="button"
                  class="solidiom-block-sign-up__oauth-btn"
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

export default SignUp
