import type { JSX } from "solid-js"
import { createSignal } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Button from "@solidiom/button"
import * as Tabs from "@solidiom/tabs"
import * as Alert from "@solidiom/alert"

const VERSIONS = [
  { version: "v3", author: "Jane Doe", date: "2024-03-15", note: "Final review changes" },
  { version: "v2", author: "John Smith", date: "2024-03-14", note: "Added introduction section" },
  { version: "v1", author: "John Smith", date: "2024-03-10", note: "Initial draft" },
]

export function Editor(): JSX.Element {
  const [activeTab, setActiveTab] = createSignal("editor")

  const TOOLBAR_BUTTONS = [
    { label: "B", title: "Bold" },
    { label: "I", title: "Italic" },
    { label: "U", title: "Underline" },
    { label: "H", title: "Heading" },
    { label: "Link", title: "Insert Link" },
  ]

  return (
    <div>
      <Breadcrumb.Root>
        <Breadcrumb.List class="flex items-center gap-2">
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.Link href="#" current>Editor</Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>

      <div class="mt-6">
        <h1 class="text-2xl font-bold text-gray-900">Content Editor</h1>
        <p class="mt-1 text-sm text-gray-500">Create and edit content with rich text formatting and version history.</p>
      </div>

      <Tabs.Root value={activeTab()} onChange={setActiveTab} class="mt-8">
        <div class="border-b border-gray-200">
          <Tabs.List class="flex items-center gap-1 -mb-px">
            <Tabs.Trigger
              value="editor"
              class="border-b-2 px-4 py-2 text-sm font-medium transition-colors data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 text-gray-500 hover:text-gray-700"
            >
              Editor
            </Tabs.Trigger>
            <Tabs.Trigger
              value="history"
              class="border-b-2 px-4 py-2 text-sm font-medium transition-colors data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 text-gray-500 hover:text-gray-700"
            >
              Version History
            </Tabs.Trigger>
          </Tabs.List>
        </div>

        <Tabs.Content value="editor" class="mt-6">
          <Alert.Root type="info" class="mb-6">
            <Alert.Title>Draft Mode</Alert.Title>
            <Alert.Description>Your changes are saved automatically.</Alert.Description>
          </Alert.Root>

          <div class="mb-4 flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-2">
            {TOOLBAR_BUTTONS.map((btn) => (
              <Button.Root
                class="inline-flex h-8 w-8 items-center justify-center rounded text-sm font-medium text-gray-700 hover:bg-gray-100"
                title={btn.title}
              >
                {btn.label}
              </Button.Root>
            ))}
          </div>

          <div class="min-h-[300px] rounded-lg border border-gray-200 bg-white p-6">
            <h2 class="text-xl font-semibold text-gray-900">Welcome to the Content Editor</h2>
            <p class="mt-4 text-gray-600">
              Start writing your content here. Use the toolbar above to format your text with bold, italic, underline, headings, and links.
              Your document is saved automatically as you type.
            </p>
            <p class="mt-4 text-gray-600">
              You can switch to the Version History tab to see previous versions of this document and restore earlier drafts.
            </p>
          </div>

          <div class="mt-4 flex justify-end gap-3">
            <Button.Root class="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
              Save as Draft
            </Button.Root>
            <Button.Root class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
              Submit for Review
            </Button.Root>
          </div>
        </Tabs.Content>

        <Tabs.Content value="history" class="mt-6">
          <div class="space-y-4">
            {VERSIONS.map((v) => (
              <div class="flex items-start gap-4 rounded-lg border border-gray-200 bg-white p-4">
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-medium text-indigo-700">
                  {v.version}
                </div>
                <div class="flex-1">
                  <div class="font-medium text-gray-900">{v.note}</div>
                  <div class="text-sm text-gray-500">by {v.author} on {v.date}</div>
                </div>
                <Button.Root class="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100">
                  Restore
                </Button.Root>
              </div>
            ))}
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}
