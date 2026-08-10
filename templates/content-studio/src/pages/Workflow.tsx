import type { JSX } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Card from "@solidiom/card"
import { StatusBadge } from "../components/StatusBadge"

const STAGES = [
  { name: "Draft", count: 5, color: "bg-gray-500" },
  { name: "Review", count: 3, color: "bg-yellow-500" },
  { name: "Approved", count: 2, color: "bg-blue-500" },
  { name: "Published", count: 12, color: "bg-green-500" },
]

const PIPELINE_ITEMS = {
  Draft: [
    { title: "Blog Post: Spring Campaign", author: "Alice Chen" },
    { title: "Email Newsletter #14", author: "Bob Lee" },
    { title: "Landing Page Copy", author: "Carol Wu" },
    { title: "Social Media Calendar", author: "Alice Chen" },
    { title: "Product Update Announcement", author: "Bob Lee" },
  ],
  Review: [
    { title: "Case Study: Acme Corp", author: "Carol Wu" },
    { title: "White Paper: Industry Trends", author: "Alice Chen" },
    { title: "Video Script: Product Demo", author: "Bob Lee" },
  ],
  Approved: [
    { title: "Press Release: New Feature", author: "Alice Chen" },
    { title: "Customer Success Story", author: "Carol Wu" },
  ],
  Published: [
    { title: "Q1 Results Blog", author: "Bob Lee" },
    { title: "Onboarding Guide v2", author: "Alice Chen" },
    { title: "API Documentation Update", author: "Carol Wu" },
  ],
}

export function Workflow(): JSX.Element {
  return (
    <div>
      <Breadcrumb.Root>
        <Breadcrumb.List class="flex items-center gap-2">
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.Link href="#" current>Workflow</Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>

      <div class="mt-6">
        <h1 class="text-2xl font-bold text-gray-900">Editorial Workflow</h1>
        <p class="mt-1 text-sm text-gray-500">Manage content through the editorial pipeline from draft to published.</p>
      </div>

      <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STAGES.map((stage) => (
          <div class="rounded-lg border border-gray-200 bg-white p-4">
            <div class="mb-3 flex items-center justify-between">
              <h3 class="font-medium text-gray-900">{stage.name}</h3>
              <span class={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium text-white ${stage.color}`}>
                {stage.count}
              </span>
            </div>
            <div class="space-y-2">
              {(PIPELINE_ITEMS as any)[stage.name]?.map((item: { title: string; author: string }) => (
                <div class="rounded-md border border-gray-100 bg-gray-50 p-3">
                  <div class="text-sm font-medium text-gray-900">{item.title}</div>
                  <div class="text-xs text-gray-500">{item.author}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
