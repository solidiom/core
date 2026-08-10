import type { JSX } from "solid-js"
import { createSignal } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Alert from "@solidiom/alert"
import * as Button from "@solidiom/button"
import { UserCard } from "../components/UserCard"

interface User {
  id: string
  name: string
  email: string
  role: string
  status: "active" | "inactive" | "suspended"
  department: string
}

const USERS: User[] = [
  { id: "u1", name: "Alice Chen", email: "alice@example.com", role: "Super Admin", status: "active", department: "Engineering" },
  { id: "u2", name: "Bob Martinez", email: "bob@example.com", role: "Admin", status: "active", department: "Product" },
  { id: "u3", name: "Carol Wu", email: "carol@example.com", role: "Editor", status: "active", department: "Engineering" },
  { id: "u4", name: "Dave Kim", email: "dave@example.com", role: "Viewer", status: "inactive", department: "Design" },
  { id: "u5", name: "Eva Singh", email: "eva@example.com", role: "Admin", status: "active", department: "Operations" },
  { id: "u6", name: "Frank Lee", email: "frank@example.com", role: "Editor", status: "active", department: "Product" },
  { id: "u7", name: "Grace Park", email: "grace@example.com", role: "Viewer", status: "suspended", department: "Engineering" },
  { id: "u8", name: "Henry Zhao", email: "henry@example.com", role: "Admin", status: "active", department: "Design" },
  { id: "u9", name: "Iris Tanaka", email: "iris@example.com", role: "Viewer", status: "active", department: "Operations" },
  { id: "u10", name: "Jack Wilson", email: "jack@example.com", role: "Editor", status: "active", department: "Engineering" },
]

export function Users(): JSX.Element {
  const [search, setSearch] = createSignal("")
  const [statusFilter, setStatusFilter] = createSignal("")

  const filtered = () =>
    USERS.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(search().toLowerCase()) ||
        u.email.toLowerCase().includes(search().toLowerCase()) ||
        u.department.toLowerCase().includes(search().toLowerCase())
      const matchesStatus = !statusFilter() || u.status === statusFilter
      return matchesSearch && matchesStatus
    })

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
                <Breadcrumb.Link href="/" current class="text-gray-900 font-medium">Users</Breadcrumb.Link>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb.Root>
          <h1 class="text-2xl font-bold text-gray-900">Users</h1>
          <p class="mt-1 text-sm text-gray-500">Manage user directory with provisioning, deactivation, and profile details.</p>
        </div>
        <Button.Root class="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Add User
        </Button.Root>
      </div>

      <Alert.Root type="info" class="rounded-md border border-blue-200 bg-blue-50 p-4">
        <Alert.Title class="text-sm font-medium text-blue-800">User Directory</Alert.Title>
        <Alert.Description class="mt-1 text-sm text-blue-700">
          {filtered().length} of {USERS.length} users. {USERS.filter((u) => u.status === "active").length} active, {USERS.filter((u) => u.status === "inactive").length} inactive, {USERS.filter((u) => u.status === "suspended").length} suspended.
        </Alert.Description>
      </Alert.Root>

      <div class="flex flex-col gap-4 sm:flex-row">
        <input
          type="text"
          class="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:max-w-md"
          placeholder="Search by name, email, or department..."
          value={search()}
          onInput={(e: any) => setSearch(e.currentTarget.value)}
        />
        <select
          class="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:max-w-xs"
          value={statusFilter()}
          onChange={(e) => setStatusFilter(e.currentTarget.value)}
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {filtered().map((user) => (
          <UserCard
            name={user.name}
            email={user.email}
            role={user.role}
            status={user.status}
            avatar={user.name.charAt(0)}
          />
        ))}
      </div>
    </div>
  )
}
