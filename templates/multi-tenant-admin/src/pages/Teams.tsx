import type { JSX } from "solid-js"
import { createSignal } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Card from "@solidiom/card"
import * as Button from "@solidiom/button"
import * as Dialog from "@solidiom/dialog"
import * as Alert from "@solidiom/alert"
import * as Input from "@solidiom/input"
import { StatusBadge } from "../components/StatusBadge"

interface TeamMember {
  name: string
  email: string
  role: string
  status: "active" | "inactive" | "suspended" | "pending"
}

interface Team {
  id: string
  name: string
  slug: string
  members: TeamMember[]
  created: string
}

const TEAMS: Team[] = [
  {
    id: "t1",
    name: "Engineering",
    slug: "engineering",
    created: "2025-01-15",
    members: [
      { name: "Alice Chen", email: "alice@example.com", role: "Owner", status: "active" },
      { name: "Bob Martinez", email: "bob@example.com", role: "Admin", status: "active" },
      { name: "Carol Wu", email: "carol@example.com", role: "Member", status: "active" },
      { name: "Dave Kim", email: "dave@example.com", role: "Member", status: "pending" },
    ],
  },
  {
    id: "t2",
    name: "Product",
    slug: "product",
    created: "2025-03-22",
    members: [
      { name: "Eva Singh", email: "eva@example.com", role: "Owner", status: "active" },
      { name: "Frank Lee", email: "frank@example.com", role: "Admin", status: "active" },
      { name: "Grace Park", email: "grace@example.com", role: "Member", status: "inactive" },
    ],
  },
  {
    id: "t3",
    name: "Design",
    slug: "design",
    created: "2025-06-10",
    members: [
      { name: "Henry Zhao", email: "henry@example.com", role: "Owner", status: "active" },
      { name: "Iris Tanaka", email: "iris@example.com", role: "Member", status: "active" },
    ],
  },
  {
    id: "t4",
    name: "Operations",
    slug: "operations",
    created: "2025-07-01",
    members: [
      { name: "Jack Wilson", email: "jack@example.com", role: "Owner", status: "active" },
      { name: "Karen Lopez", email: "karen@example.com", role: "Admin", status: "suspended" },
      { name: "Leo Brown", email: "leo@example.com", role: "Member", status: "active" },
      { name: "Mia Garcia", email: "mia@example.com", role: "Member", status: "active" },
      { name: "Noah Davis", email: "noah@example.com", role: "Member", status: "pending" },
    ],
  },
]

export function Teams(): JSX.Element {
  const [search, setSearch] = createSignal("")
  const [open, setOpen] = createSignal(false)
  const [inviteEmail, setInviteEmail] = createSignal("")

  const filtered = () =>
    TEAMS.filter((t) =>
      t.name.toLowerCase().includes(search().toLowerCase()) ||
      t.slug.toLowerCase().includes(search().toLowerCase()),
    )

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
                <Breadcrumb.Link href="/" current class="text-gray-900 font-medium">Teams</Breadcrumb.Link>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb.Root>
          <h1 class="text-2xl font-bold text-gray-900">Teams</h1>
          <p class="mt-1 text-sm text-gray-500">Manage your organization's teams, members, and permissions.</p>
        </div>
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger>
            <Button.Root class="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              Invite Member
            </Button.Root>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Backdrop class="fixed inset-0 bg-black/40" />
            <Dialog.Content class="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl">
              <Dialog.Title class="text-lg font-semibold text-gray-900">Invite Team Member</Dialog.Title>
              <Dialog.Description class="mt-1 text-sm text-gray-500">
                Send an invitation to join your organization.
              </Dialog.Description>
              <div class="mt-4">
                <label class="block text-sm font-medium text-gray-700">Email address</label>
                <Input.Root
                  type="email"
                  class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="colleague@company.com"
                  value={inviteEmail()}
                  onInput={(e: any) => setInviteEmail(e.currentTarget.value)}
                />
              </div>
              <div class="mt-6 flex justify-end gap-3">
                <Dialog.Close>
                  <Button.Root class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                    Cancel
                  </Button.Root>
                </Dialog.Close>
                <Dialog.Close>
                  <Button.Root class="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
                    Send Invite
                  </Button.Root>
                </Dialog.Close>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      <Alert.Root type="info" class="rounded-md border border-blue-200 bg-blue-50 p-4">
        <Alert.Title class="text-sm font-medium text-blue-800">Team Management</Alert.Title>
        <Alert.Description class="mt-1 text-sm text-blue-700">
          You have {TEAMS.length} teams with {TEAMS.reduce((s, t) => s + t.members.length, 0)} total members. Invite new members to grow your teams.
        </Alert.Description>
      </Alert.Root>

      <div class="mb-4">
        <Input.Root
          type="text"
          class="block w-full max-w-md rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Search teams..."
          value={search()}
          onInput={(e: any) => setSearch(e.currentTarget.value)}
        />
      </div>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {filtered().map((team) => (
          <Card.Root class="rounded-lg border border-gray-200 bg-white shadow-sm">
            <Card.Header class="border-b border-gray-100 px-6 py-4">
              <div class="flex items-center justify-between">
                <div>
                  <Card.Title class="text-base font-semibold text-gray-900">{team.name}</Card.Title>
                  <p class="mt-0.5 text-xs text-gray-500">/{team.slug} · Created {team.created}</p>
                </div>
                <span class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                  {team.members.length} members
                </span>
              </div>
            </Card.Header>
            <Card.Content class="px-6 py-4">
              <div class="space-y-3">
                {team.members.map((member) => (
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-medium text-indigo-700">
                        {member.name.charAt(0)}
                      </span>
                      <div>
                        <p class="text-sm font-medium text-gray-900">{member.name}</p>
                        <p class="text-xs text-gray-500">{member.email}</p>
                      </div>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="text-xs text-gray-500">{member.role}</span>
                      <StatusBadge status={member.status} />
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card.Root>
        ))}
      </div>
    </div>
  )
}
