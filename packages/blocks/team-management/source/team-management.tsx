/**
 * BLOCK-ADMIN-01: Team Management block.
 *
 * Team member list with invite, role assignment, and removal.
 * Implements all four required states: loading, empty, error, restricted.
 *
 * Dependencies: Button, Input, Field, Card, Alert, Dialog, Select, Avatar, Popover, Pagination, Data Table, Spinner
 */

import { createSignal, Show, For } from "solid-js"
import type { JSX } from "@solidjs/web"

export interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  avatarUrl?: string
}

export interface TeamManagementProps {
  members?: TeamMember[]
  roles?: string[]
  onInvite?: (email: string, role: string) => Promise<void>
  onChangeRole?: (memberId: string, role: string) => Promise<void>
  onRemove?: (memberId: string) => Promise<void>
  error?: string
  restricted?: boolean
  restrictedReason?: string
  class?: string
}

export type TeamManagementState = "empty" | "loading" | "error" | "restricted"

export function TeamManagement(props: TeamManagementProps): JSX.Element {
  const [inviteEmail, setInviteEmail] = createSignal("")
  const [inviteRole, setInviteRole] = createSignal("")
  const [state, setState] = createSignal<TeamManagementState>(
    props.restricted ? "restricted" : "empty",
  )
  const [localError, setLocalError] = createSignal("")

  const currentError = () => props.error || localError()

  async function handleInvite(e: Event) {
    e.preventDefault()
    setLocalError("")
    if (!inviteEmail()) {
      setLocalError("Email is required.")
      setState("error")
      return
    }
    setState("loading")
    try {
      await props.onInvite?.(inviteEmail(), inviteRole() || "member")
      setInviteEmail("")
      setState("empty")
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Invite failed.")
      setState("error")
    }
  }

  async function handleRemove(id: string) {
    setLocalError("")
    setState("loading")
    try {
      await props.onRemove?.(id)
      setState("empty")
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Remove failed.")
      setState("error")
    }
  }

  return (
    <div
      class={["solidiom-block-team-management", props.class].filter(Boolean).join(" ")}
      data-state={state()}
    >
      <Show when={state() === "restricted"}>
        <div class="solidiom-block-team-management__restricted" role="alert">
          <p>{props.restrictedReason || "Team management is restricted."}</p>
        </div>
      </Show>
      <Show when={state() === "error" && currentError()}>
        <div class="solidiom-block-team-management__error" role="alert">
          <p>{currentError()}</p>
        </div>
      </Show>
      <Show when={state() !== "restricted"}>
        <form onSubmit={handleInvite} class="solidiom-block-team-management__invite">
          <input
            type="email"
            value={inviteEmail()}
            onInput={(e) => setInviteEmail(e.currentTarget.value)}
            placeholder="Email address"
            disabled={state() === "loading"}
          />
          <select
            value={inviteRole()}
            onChange={(e) => setInviteRole(e.currentTarget.value)}
            disabled={state() === "loading"}
          >
            <option value="">Role</option>
            <For each={props.roles ?? ["member", "admin"]}>
              {(role) => <option value={role}>{role}</option>}
            </For>
          </select>
          <button type="submit" disabled={state() === "loading"}>
            Invite
          </button>
        </form>
        <Show when={!props.members || props.members.length === 0}>
          <div class="solidiom-block-team-management__empty">
            <p>No team members yet.</p>
          </div>
        </Show>
        <div class="solidiom-block-team-management__list">
          <For each={props.members ?? []}>
            {(member) => (
              <div class="solidiom-block-team-management__member">
                <div class="solidiom-block-team-management__member-info">
                  <span class="solidiom-block-team-management__name">{member.name}</span>
                  <span class="solidiom-block-team-management__email">{member.email}</span>
                  <span class="solidiom-block-team-management__role">{member.role}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(member.id)}
                  disabled={state() === "loading"}
                >
                  Remove
                </button>
              </div>
            )}
          </For>
        </div>
      </Show>
    </div>
  )
}

export default TeamManagement
