/**
 * BLOCK-ADMIN-03: Role Permissions block.
 *
 * Role-based permission matrix with assignment and audit.
 * Implements all four required states: loading, empty, error, restricted.
 *
 * Dependencies: Button, Field, Card, Alert, Dialog, Tabs, Checkbox, Switch, Pagination, Data Table, Spinner
 */

import { createSignal, Show, For, type JSX } from "solid-js"

export interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
}

export interface RolePermissionsProps {
  roles?: Role[]
  availablePermissions?: string[]
  onUpdateRole?: (roleId: string, permissions: string[]) => Promise<void>
  onCreateRole?: (name: string, permissions: string[]) => Promise<void>
  onDeleteRole?: (roleId: string) => Promise<void>
  error?: string
  restricted?: boolean
  restrictedReason?: string
  class?: string
}

export type RolePermissionsState = "empty" | "loading" | "error" | "restricted"

export function RolePermissions(props: RolePermissionsProps): JSX.Element {
  const [state, setState] = createSignal<RolePermissionsState>(
    props.restricted ? "restricted" : "empty",
  )
  const [localError, setLocalError] = createSignal("")
  const [selectedRole, setSelectedRole] = createSignal<string | null>(null)

  const currentError = () => props.error || localError()
  const roles = () => props.roles ?? []

  async function handleTogglePermission(roleId: string, permission: string) {
    setLocalError("")
    setState("loading")
    try {
      const role = roles().find((r) => r.id === roleId)
      if (!role) return
      const updated = role.permissions.includes(permission)
        ? role.permissions.filter((p) => p !== permission)
        : [...role.permissions, permission]
      await props.onUpdateRole?.(roleId, updated)
      setState("empty")
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Permission update failed.")
      setState("error")
    }
  }

  async function handleDelete(roleId: string) {
    setLocalError("")
    setState("loading")
    try {
      await props.onDeleteRole?.(roleId)
      setState("empty")
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Role deletion failed.")
      setState("error")
    }
  }

  return (
    <div
      class={["solidiom-block-role-permissions", props.class].filter(Boolean).join(" ")}
      data-state={state()}
    >
      <Show when={state() === "restricted"}>
        <div class="solidiom-block-role-permissions__restricted" role="alert">
          <p>{props.restrictedReason || "Permission management is restricted."}</p>
        </div>
      </Show>
      <Show when={state() === "error" && currentError()}>
        <div class="solidiom-block-role-permissions__error" role="alert">
          <p>{currentError()}</p>
        </div>
      </Show>
      <Show when={state() !== "restricted"}>
        <Show when={roles().length === 0 && state() !== "loading"}>
          <div class="solidiom-block-role-permissions__empty">
            <p>No roles configured.</p>
          </div>
        </Show>
        <div class="solidiom-block-role-permissions__roles">
          <For each={roles()}>
            {(role) => (
              <div
                class="solidiom-block-role-permissions__role"
                classList={{ "is-selected": selectedRole() === role.id }}
              >
                <div class="solidiom-block-role-permissions__role-header">
                  <button
                    type="button"
                    onClick={() => setSelectedRole(selectedRole() === role.id ? null : role.id)}
                  >
                    <strong>{role.name}</strong>
                    <span>{role.description}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(role.id)}
                    disabled={state() === "loading"}
                  >
                    Delete
                  </button>
                </div>
                <Show when={selectedRole() === role.id}>
                  <div class="solidiom-block-role-permissions__permissions">
                    <For each={props.availablePermissions ?? []}>
                      {(perm) => (
                        <label class="solidiom-block-role-permissions__permission">
                          <input
                            type="checkbox"
                            checked={role.permissions.includes(perm)}
                            onChange={() => handleTogglePermission(role.id, perm)}
                            disabled={state() === "loading"}
                          />
                          {perm}
                        </label>
                      )}
                    </For>
                  </div>
                </Show>
              </div>
            )}
          </For>
        </div>
      </Show>
    </div>
  )
}

export default RolePermissions
