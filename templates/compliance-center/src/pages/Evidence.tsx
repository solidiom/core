import type { JSX } from "@solidjs/web"
import { createSignal } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Card from "@solidiom/card"
import * as Button from "@solidiom/button"
import * as Alert from "@solidiom/alert"
import * as Dialog from "@solidiom/dialog"
import { StatusBadge } from "../components/StatusBadge"

type EvidenceStatus = "verified" | "pending" | "missing" | "expired"

interface EvidenceItem {
  id: string
  name: string
  control: string
  owner: string
  status: EvidenceStatus
  uploaded: string
  expires: string
}

const EVIDENCE: EvidenceItem[] = [
  {
    id: "e1",
    name: "Access Review Q2 2025",
    control: "CC6.1 — Logical Access",
    owner: "Alice Chen",
    status: "verified",
    uploaded: "2025-07-10",
    expires: "2026-01-10",
  },
  {
    id: "e2",
    name: "Penetration Test Report",
    control: "CC7.2 — System Monitoring",
    owner: "Bob Martinez",
    status: "verified",
    uploaded: "2025-06-15",
    expires: "2025-12-15",
  },
  {
    id: "e3",
    name: "Incident Response Plan",
    control: "A.16.1 — Incident Management",
    owner: "Carol Wu",
    status: "pending",
    uploaded: "2025-07-28",
    expires: "2026-01-28",
  },
  {
    id: "e4",
    name: "Employee Background Checks",
    control: "164.308 — Security Mgmt",
    owner: "Eva Singh",
    status: "missing",
    uploaded: "—",
    expires: "2025-09-01",
  },
  {
    id: "e5",
    name: "Data Encryption Audit",
    control: "A.8.24 — Crypto Controls",
    owner: "Frank Lee",
    status: "expired",
    uploaded: "2025-01-20",
    expires: "2025-07-20",
  },
  {
    id: "e6",
    name: "Backup Recovery Test",
    control: "CC9.4 — Recovery Testing",
    owner: "Henry Zhao",
    status: "verified",
    uploaded: "2025-07-01",
    expires: "2026-01-01",
  },
  {
    id: "e7",
    name: "Vendor Risk Assessment",
    control: "A.15.1 — Supplier Relationships",
    owner: "Iris Tanaka",
    status: "pending",
    uploaded: "2025-08-02",
    expires: "2026-02-02",
  },
  {
    id: "e8",
    name: "Security Training Records",
    control: "CC6.3 — Awareness",
    owner: "Jack Wilson",
    status: "verified",
    uploaded: "2025-06-30",
    expires: "2025-12-30",
  },
]

export function Evidence(): JSX.Element {
  const [open, setOpen] = createSignal(false)

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
                <Breadcrumb.Link href="/evidence" current class="text-gray-900 font-medium">
                  Evidence
                </Breadcrumb.Link>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb.Root>
          <h1 class="text-2xl font-bold text-gray-900">Evidence Collection</h1>
          <p class="mt-1 text-sm text-gray-500">
            Collect, organize, and review audit evidence for compliance requirements.
          </p>
        </div>
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger>
            <Button.Root class="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              Upload Evidence
            </Button.Root>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Backdrop class="fixed inset-0 bg-black/40" />
            <Dialog.Content class="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl">
              <Dialog.Title class="text-lg font-semibold text-gray-900">
                Upload Evidence
              </Dialog.Title>
              <Dialog.Description class="mt-1 text-sm text-gray-500">
                Select a control and upload supporting documentation.
              </Dialog.Description>
              <div class="mt-4 rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                <p class="text-sm text-gray-500">Drag and drop files here, or click to browse</p>
              </div>
              <div class="mt-6 flex justify-end gap-3">
                <Dialog.Close>
                  <Button.Root class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                    Cancel
                  </Button.Root>
                </Dialog.Close>
                <Dialog.Close>
                  <Button.Root class="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
                    Upload
                  </Button.Root>
                </Dialog.Close>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      <Alert.Root type="info" class="rounded-md border border-blue-200 bg-blue-50 p-4">
        <Alert.Title class="text-sm font-medium text-blue-800">Evidence Status</Alert.Title>
        <Alert.Description class="mt-1 text-sm text-blue-700">
          {EVIDENCE.filter((e) => e.status === "verified").length} verified,{" "}
          {EVIDENCE.filter((e) => e.status === "pending").length} pending,{" "}
          {EVIDENCE.filter((e) => e.status === "missing").length} missing,{" "}
          {EVIDENCE.filter((e) => e.status === "expired").length} expired.
        </Alert.Description>
      </Alert.Root>

      <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {EVIDENCE.map((item) => (
          <Card.Root class="rounded-lg border border-gray-200 bg-white shadow-sm">
            <Card.Header class="border-b border-gray-100 px-6 py-4">
              <div class="flex items-center justify-between">
                <Card.Title class="text-sm font-semibold text-gray-900">{item.name}</Card.Title>
                <StatusBadge status={item.status} />
              </div>
              <p class="mt-0.5 text-xs text-gray-500">{item.control}</p>
            </Card.Header>
            <Card.Content class="px-6 py-3">
              <div class="flex items-center justify-between text-xs text-gray-500">
                <span>Owner: {item.owner}</span>
                <span>Uploaded: {item.uploaded}</span>
              </div>
              <div class="mt-1 text-xs text-gray-400">Expires: {item.expires}</div>
            </Card.Content>
          </Card.Root>
        ))}
      </div>
    </div>
  )
}
