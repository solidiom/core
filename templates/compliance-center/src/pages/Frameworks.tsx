import type { JSX } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Alert from "@solidiom/alert"
import { FrameworkCard } from "../components/FrameworkCard"

const FRAMEWORKS = [
  {
    name: "SOC 2 Type II",
    description: "Service Organization Control for security, availability, and confidentiality.",
    progress: 78,
    totalControls: 120,
    implementedControls: 94,
    status: "on-track" as const,
  },
  {
    name: "ISO 27001",
    description: "International standard for information security management systems.",
    progress: 62,
    totalControls: 93,
    implementedControls: 58,
    status: "at-risk" as const,
  },
  {
    name: "HIPAA",
    description: "Health Insurance Portability and Accountability Act compliance requirements.",
    progress: 45,
    totalControls: 68,
    implementedControls: 31,
    status: "behind" as const,
  },
  {
    name: "GDPR",
    description: "General Data Protection Regulation for EU citizen data privacy.",
    progress: 88,
    totalControls: 54,
    implementedControls: 48,
    status: "on-track" as const,
  },
  {
    name: "PCI DSS",
    description: "Payment Card Industry Data Security Standard for payment processing.",
    progress: 0,
    totalControls: 78,
    implementedControls: 0,
    status: "not-started" as const,
  },
]

export function Frameworks(): JSX.Element {
  return (
    <div class="space-y-8">
      <div>
        <Breadcrumb.Root class="mb-2">
          <Breadcrumb.List class="flex items-center gap-1.5 text-sm text-gray-500">
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/" class="hover:text-gray-700">Home</Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator class="text-gray-300">/</Breadcrumb.Separator>
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/" current class="text-gray-900 font-medium">Frameworks</Breadcrumb.Link>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
        <h1 class="text-2xl font-bold text-gray-900">Compliance Frameworks</h1>
        <p class="mt-1 text-sm text-gray-500">Track compliance posture across SOC 2, ISO 27001, HIPAA, and custom frameworks.</p>
      </div>

      <Alert.Root type="info" class="rounded-md border border-blue-200 bg-blue-50 p-4">
        <Alert.Title class="text-sm font-medium text-blue-800">Overall Compliance</Alert.Title>
        <Alert.Description class="mt-1 text-sm text-blue-700">
          {FRAMEWORKS.filter((f) => f.status === "on-track").length} frameworks on track, {FRAMEWORKS.filter((f) => f.status === "at-risk").length} at risk, {FRAMEWORKS.filter((f) => f.status === "behind").length} behind schedule.
        </Alert.Description>
      </Alert.Root>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {FRAMEWORKS.map((fw) => (
          <FrameworkCard {...fw} />
        ))}
      </div>
    </div>
  )
}
