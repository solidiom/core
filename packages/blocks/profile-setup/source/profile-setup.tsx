/**
 * BLOCK-ONBOARD-02: Profile Setup block.
 *
 * User profile configuration during onboarding.
 * Implements all four required states: loading, empty, error, restricted.
 *
 * Dependencies: Button, Input, Field, Alert, Select, Toast, Avatar, Spinner
 */

import { createSignal, Show } from "solid-js"
import type { JSX } from "@solidjs/web"

export interface ProfileSetupProps {
  onSubmit?: (data: { displayName: string; bio: string; avatarUrl?: string }) => Promise<void>
  error?: string
  restricted?: boolean
  restrictedReason?: string
  class?: string
}

export type ProfileSetupState = "empty" | "loading" | "error" | "restricted"

export function ProfileSetup(props: ProfileSetupProps): JSX.Element {
  const [displayName, setDisplayName] = createSignal("")
  const [bio, setBio] = createSignal("")
  const [state, setState] = createSignal<ProfileSetupState>(
    props.restricted ? "restricted" : "empty",
  )
  const [localError, setLocalError] = createSignal("")

  const currentError = () => props.error || localError()

  async function handleSubmit(e: Event) {
    e.preventDefault()
    setLocalError("")
    if (!displayName()) {
      setLocalError("Display name is required.")
      setState("error")
      return
    }
    setState("loading")
    try {
      await props.onSubmit?.({ displayName: displayName(), bio: bio() })
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Profile update failed.")
      setState("error")
    }
  }

  return (
    <div
      class={["solidiom-block-profile-setup", props.class].filter(Boolean).join(" ")}
      data-state={state()}
    >
      <Show when={state() === "restricted"}>
        <div class="solidiom-block-profile-setup__restricted" role="alert">
          <p>{props.restrictedReason || "Profile setup is unavailable."}</p>
        </div>
      </Show>
      <Show when={state() === "error" && currentError()}>
        <div class="solidiom-block-profile-setup__error" role="alert">
          <p>{currentError()}</p>
        </div>
      </Show>
      <Show when={state() !== "restricted"}>
        <form onSubmit={handleSubmit} class="solidiom-block-profile-setup__form">
          <div class="solidiom-block-profile-setup__avatar">
            <div
              class="solidiom-block-profile-setup__avatar-placeholder"
              aria-label="Avatar preview"
            />
          </div>
          <div class="solidiom-block-profile-setup__field">
            <label for="profile-display-name">Display Name</label>
            <input
              id="profile-display-name"
              type="text"
              value={displayName()}
              onInput={(e) => setDisplayName(e.currentTarget.value)}
              placeholder="Your display name"
              required
              disabled={state() === "loading"}
            />
          </div>
          <div class="solidiom-block-profile-setup__field">
            <label for="profile-bio">Bio</label>
            <textarea
              id="profile-bio"
              value={bio()}
              onInput={(e) => setBio(e.currentTarget.value)}
              placeholder="Tell us about yourself"
              disabled={state() === "loading"}
            />
          </div>
          <button
            type="submit"
            class="solidiom-block-profile-setup__submit"
            disabled={state() === "loading"}
          >
            <Show when={state() === "loading"} fallback="Save Profile">
              Saving...
            </Show>
          </button>
        </form>
      </Show>
    </div>
  )
}

export default ProfileSetup
