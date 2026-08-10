import type { JSX } from "solid-js"
import { createSignal } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Tabs from "@solidiom/tabs"
import * as Button from "@solidiom/button"
import * as Alert from "@solidiom/alert"
import { StatusBadge } from "../components/StatusBadge"

type PermStatus = "active" | "inactive" | "pending"

interface Permission {
  id: string
  resource: string
  action: string
  description: string
}

interface Role {
  id: string
  name: string
  description: string
  memberCount: number
  status: PermStatus
  permissions: Permission[]
}

const ALL_PERMISSIONS: Permission[] = [
  { id: "p1", resource: "users", action: "read", description: "View user profiles" },
  { id: "p2", resource: "users", action: "write", description: "Create and edit users" },
  { id: "p3", resource: "users", action: "delete", description: "Delete users" },
  { id: "p4", resource: "teams", action: "read", description: "View team details" },
  { id: "p5", resource: "teams", action: "write", description: "Create and edit teams" },
  { id: "p6", resource: "settings", action: "read", description: "View settings" },
  { id: "p7", resource: "settings", action: "write", description: "Modify settings" },
  { id: "p8", resource: "audit", action: "read", description: "View audit logs" },
]

const ROLES: Role[] = [
  {
    id: "r1",
    name: "Super Admin",
    description: "Full access to all resources and settings.",
    memberCount: 2,
    status: "active",
    permissions: ALL_PERMISSIONS,
  },
  {
    id: "r2",
    name: "Admin",
    description: "Manage users and teams, view audit logs.",
    memberCount: 5,
    status: "active",
    permissions: ALL_PERMISSIONS.filter((p) => !["users.delete", "settings.write"].includes(`${p.resource}.${p.action}`)),
  },
  {
    id: "r3",
    name: "Editor",
    description: "Read and write access to content, limited settings.",
    memberCount: 12,
    status: "active",
    permissions: ALL_PERMISSIONS.filter((p) => ["users.read", "teams.read", "teams.write", "settings.read"].includes(`${p.resource}.${p.action}`)),
  },
  {
    id: "r4",
    name: "Viewer",
    description: "Read-only access across all resources.",
    memberCount: 28,
    status: "active",
    permissions: ALL_PERMISSIONS.filter((p) => p.action === "read"),
  },
  {
    id: "r5",
    name: "Auditor",
    description: "Read access to audit logs and user profiles.",
    memberCount: 3,
    status: "pending",
    permissions: ALL_PERMISSIONS.filter((p) => ["users.read", "audit.read"].includes(`${p.resource}.${p.action}`)),
  },
]

export function Roles(): JSX.Element {
  const [selectedRole, setSelectedRole] = createSignal<Role>(ROLES[0])

  return (
    <div class="space-y-8">
      <div class="flex items-center justify-between">
        <div>
          <Breadcrumb.Root class="mb-2">
            <Breadcrumb.List class="flex items-center gap-1.5 text-sm text-gray-500">
              <Breadcrumb.Item>
                <Breadcrumb.Link href="/" class="hover:text-gray-700">Home</Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator class="text-gray-300">/</Breadcrumb.Separator>
              <Breadcrumb.Item>
                <Breadcrumb.Link href="/roles" current class="text-gray-900 font-medium">Roles</Breadcrumb.Link>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb.Root>
          <h1 class="text-2xl font-bold text-gray-900">Role-Based Access Control</h1>
          <p class="mt-1 text-sm text-gray-500">Define roles and manage permission matrices across your organization.</p>
        </div>
        <Button.Root class="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Create Role
        </Button.Root>
      </div>

      <Alert.Root type="success" class="rounded-md border border-green-200 bg-green-50 p-4">
        <Alert.Title class="text-sm font-medium text-green-800">RBAC Active</Alert.Title>
        <Alert.Description class="mt-1 text-sm text-green-700">
          You have {ROLES.length} roles configured with a total of {ROLES.reduce((s, r) => s + r.memberCount, 0)} assigned members.
        </Alert.Description>
      </Alert.Root>

      <Tabs.Root defaultValue={ROLES[0].id}>
        <Tabs.List class="flex border-b border-gray-200">
          {ROLES.map((role) => (
            <Tabs.Trigger
              value={role.id}
              class="border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-600"
              onClick={() => setSelectedRole(role)}
            >
              {role.name}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {ROLES.map((role) => (
          <Tabs.Content value={role.id} class="pt-6">
            <div class="mb-4 flex items-center justify-between">
              <div>
                <h2 class="text-lg font-semibold text-gray-900">{role.name}</h2>
                <p class="text-sm text-gray-500">{role.description}</p>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-sm text-gray-500">{role.memberCount} members</span>
                <StatusBadge status={role.status} />
              </div>
            </div>

            <div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Resource</th>
                    <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Action</th>
                    <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Description</th>
                    <th class="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">Granted</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white">
                  {ALL_PERMISSIONS.map((perm) => {
                    const hasPerm = role.permissions.some((p) => p.id === perm.id)
                    return (
                      <tr class="hover:bg-gray-50">
                        <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{perm.resource}</td>
                        <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{perm.action}</td>
                        <td class="px-6 py-4 text-sm text-gray-500">{perm.description}</td>
                        <td class="whitespace-nowrap px-6 py-4 text-center">
                          {hasPerm
                            ? <span class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">Yes</span>
                            : <span class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">No</span>}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </div>
  )
}
