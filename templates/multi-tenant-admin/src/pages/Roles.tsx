import type { JSX } from "solid-js"

export function Roles(): JSX.Element {
  return (
    <main class="min-h-screen p-6">
      <h1 class="text-2xl font-bold mb-6">Role Permissions</h1>
      <p>Multi-tenant admin — RBAC matrix and permission assignment.</p>
    </main>
  )
}
