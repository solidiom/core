import type { JSX } from "@solidjs/web"
import { createSignal } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Card from "@solidiom/card"
import * as Button from "@solidiom/button"
import * as Alert from "@solidiom/alert"
import * as Switch from "@solidiom/switch"
import { StatusBadge } from "../components/StatusBadge"

type PermissionStatus = "active" | "inactive" | "pending"

interface Permission {
  id: string
  name: string
  description: string
}

interface Role {
  id: string
  name: string
  description: string
  memberCount: number
  status: PermissionStatus
  permissions: Permission[]
}

const ALL_PERMISSIONS: Permission[] = [
  { id: "p1", name: "users:read", description: "View user profiles and details" },
  { id: "p2", name: "users:write", description: "Create and modify user accounts" },
  { id: "p3", name: "users:delete", description: "Permanently delete user accounts" },
  { id: "p4", name: "roles:read", description: "View role definitions" },
  { id: "p5", name: "roles:write", description: "Create and modify role definitions" },
  { id: "p6", name: "sessions:read", description: "View active sessions" },
  { id: "p7", name: "sessions:revoke", description: "Revoke active sessions" },
  { id: "p8", name: "audit:read", description: "View audit logs" },
  { id: "p9", name: "settings:read", description: "View system settings" },
  { id: "p10", name: "settings:write", description: "Modify system settings" },
]

const ROLES: Role[] = [
  {
    id: "r1",
    name: "Super Admin",
    description: "Full access to all resources and system settings.",
    memberCount: 2,
    status: "active",
    permissions: ALL_PERMISSIONS,
  },
  {
    id: "r2",
    name: "Admin",
    description: "Manage users and roles, view sessions and audit logs.",
    memberCount: 5,
    status: "active",
    permissions: ALL_PERMISSIONS.filter(
      (p) => !["users:delete", "settings:write"].includes(p.name),
    ),
  },
  {
    id: "r3",
    name: "Editor",
    description: "Read and write access to content, limited to assigned resources.",
    memberCount: 12,
    status: "active",
    permissions: ALL_PERMISSIONS.filter((p) =>
      ["users:read", "roles:read", "audit:read"].includes(p.name),
    ),
  },
  {
    id: "r4",
    name: "Viewer",
    description: "Read-only access across all visible resources.",
    memberCount: 28,
    status: "active",
    permissions: ALL_PERMISSIONS.filter((p) => p.name.endsWith(":read")),
  },
]

export function Roles(): JSX.Element {
  const [roles, setRoles] = createSignal<Role[]>(ROLES)

  const togglePermission = (roleId: string, permId: string) => {
    setRoles((prev) =>
      prev.map((role) => {
        if (role.id !== roleId) return role
        const hasPerm = role.permissions.some((p) => p.id === permId)
        return {
          ...role,
          permissions: hasPerm
            ? role.permissions.filter((p) => p.id !== permId)
            : [...role.permissions, ALL_PERMISSIONS.find((p) => p.id === permId)!],
        }
      }),
    )
  }

  return (
    <div class="space-y-8">
      <div class="flex items-center justify-between">
        <div>
          <Breadcrumb.Root class="mb-2">
            <Breadcrumb.List class="flex items-center gap-1.5 text-sm text-gray-500">
              <Breadcrumb.Item>
                <Breadcrumb.Link href="/" class="hover:text-gray-700">
                  Home
                </Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator class="text-gray-300">/</Breadcrumb.Separator>
              <Breadcrumb.Item>
                <Breadcrumb.Link href="/roles" current class="text-gray-900 font-medium">
                  Roles
                </Breadcrumb.Link>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb.Root>
          <h1 class="text-2xl font-bold text-gray-900">Roles & Permissions</h1>
          <p class="mt-1 text-sm text-gray-500">
            Define roles, assign permissions, and manage access policies.
          </p>
        </div>
        <Button.Root class="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Create Role
        </Button.Root>
      </div>

      <Alert.Root type="success" class="rounded-md border border-green-200 bg-green-50 p-4">
        <Alert.Title class="text-sm font-medium text-green-800">Role Management</Alert.Title>
        <Alert.Description class="mt-1 text-sm text-green-700">
          {roles().length} roles configured with a total of{" "}
          {roles().reduce((s, r) => s + r.memberCount, 0)} assigned members across{" "}
          {ALL_PERMISSIONS.length} permissions.
        </Alert.Description>
      </Alert.Root>

      <div class="grid grid-cols-1 gap-6">
        {roles().map((role) => (
          <Card.Root class="rounded-lg border border-gray-200 bg-white shadow-sm">
            <Card.Header class="border-b border-gray-100 px-6 py-4">
              <div class="flex items-center justify-between">
                <div>
                  <Card.Title class="text-base font-semibold text-gray-900">{role.name}</Card.Title>
                  <p class="mt-0.5 text-sm text-gray-500">{role.description}</p>
                </div>
                <div class="flex items-center gap-3">
                  <span class="text-sm text-gray-500">{role.memberCount} members</span>
                  <StatusBadge status={role.status} />
                </div>
              </div>
            </Card.Header>
            <Card.Content class="px-6 py-4">
              <div class="space-y-3">
                {ALL_PERMISSIONS.map((perm) => {
                  const granted = role.permissions.some((p) => p.id === perm.id)
                  return (
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="text-sm font-medium text-gray-900">{perm.name}</p>
                        <p class="text-xs text-gray-500">{perm.description}</p>
                      </div>
                      <Switch.Root
                        checked={granted}
                        onCheckedChange={() => togglePermission(role.id, perm.id)}
                        class="inline-flex h-5 w-9 items-center rounded-full bg-gray-200 transition-colors data-[state=checked]:bg-indigo-600"
                      >
                        <Switch.Thumb class="block h-4 w-4 translate-x-0.5 rounded-full bg-white transition-transform data-[state=checked]:translate-x-4" />
                      </Switch.Root>
                    </div>
                  )
                })}
              </div>
            </Card.Content>
          </Card.Root>
        ))}
      </div>
    </div>
  )
}
