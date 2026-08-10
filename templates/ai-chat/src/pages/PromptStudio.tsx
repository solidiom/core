import type { JSX } from "solid-js"
import { createSignal } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Button from "@solidiom/button"
import * as Card from "@solidiom/card"
import * as Tabs from "@solidiom/tabs"
import * as Alert from "@solidiom/alert"
import * as Input from "@solidiom/input"

const SAVED_PROMPTS = [
  { id: "1", name: "Code Reviewer", template: "Review this code for bugs and best practices: {code}\nLanguage: {language}", variables: ["code", "language"], updatedAt: "2 hours ago" },
  { id: "2", name: "Email Draft", template: "Write a professional email to {recipient} about {topic}.\nTone: {tone}\nKey points:\n{points}", variables: ["recipient", "topic", "tone", "points"], updatedAt: "1 day ago" },
  { id: "3", name: "Data Analysis", template: "Analyze the following dataset and provide insights.\n\nData:\n{data}\n\nQuestions to answer:\n{questions}", variables: ["data", "questions"], updatedAt: "3 days ago" },
  { id: "4", name: "Blog Post Writer", template: "Write a blog post about {topic} for {audience}.\nStyle: {style}\nWord count: approximately {word_count}", variables: ["topic", "audience", "style", "word_count"], updatedAt: "1 week ago" },
]

export function PromptStudio(): JSX.Element {
  const [editorValue, setEditorValue] = createSignal("Write a detailed summary of {document} in {style} format.\n\nKey requirements:\n- Length: {length} words\n- Include sections for {sections}\n- Cite sources: {cite_sources}")
  const [activeVar, setActiveVar] = createSignal("{document}")

  const variables = () => {
    const matches = editorValue().match(/\{(\w+)\}/g)
    return matches ? [...new Set(matches.map((v) => v.replace(/[{}]/g, "")))] : []
  }

  return (
    <div class="space-y-6">
      <div>
        <Breadcrumb.Root class="mb-2">
          <Breadcrumb.List class="flex items-center gap-1.5 text-sm text-gray-500">
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/" class="hover:text-gray-700">Home</Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator class="text-gray-300">/</Breadcrumb.Separator>
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/prompts" current class="text-gray-900 font-medium">Prompts</Breadcrumb.Link>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
        <h1 class="text-2xl font-bold text-gray-900">Prompt Studio</h1>
        <p class="mt-1 text-sm text-gray-500">Design, test, and manage prompts with variable interpolation.</p>
      </div>

      <Alert.Root type="info" class="rounded-md border border-blue-200 bg-blue-50 p-4">
        <Alert.Title class="text-sm font-medium text-blue-800">Variable Interpolation</Alert.Title>
        <Alert.Description class="mt-1 text-sm text-blue-700">
          Use {"{variable}"} syntax in your prompt. Click a variable below to set its value.
        </Alert.Description>
      </Alert.Root>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card.Root class="rounded-lg border border-gray-200 bg-white shadow-sm lg:col-span-2">
          <Card.Header class="border-b border-gray-200 p-4">
            <Card.Title class="text-sm font-semibold text-gray-900">Prompt Editor</Card.Title>
          </Card.Header>
          <Card.Content class="p-4">
            <textarea
              value={editorValue()}
              onChange={(e) => setEditorValue(e.currentTarget.value)}
              class="w-full rounded-md border border-gray-300 font-mono text-sm leading-relaxed p-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              rows={12}
              spellcheck={false}
            />
            <div class="mt-3 flex gap-2">
              <Button.Root class="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                Test Prompt
              </Button.Root>
              <Button.Root class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                Save Prompt
              </Button.Root>
            </div>
          </Card.Content>
        </Card.Root>

        <Card.Root class="rounded-lg border border-gray-200 bg-white shadow-sm">
          <Card.Header class="border-b border-gray-200 p-4">
            <Card.Title class="text-sm font-semibold text-gray-900">Detected Variables</Card.Title>
          </Card.Header>
          <Card.Content class="p-4">
            <div class="space-y-2">
              {variables().map((variable) => {
                const varLabel = "{" + variable + "}"
                return (
                  <label class="flex items-center gap-3">
                    <input
                      type="radio"
                      name="active-var"
                      checked={activeVar() === varLabel}
                      onChange={() => setActiveVar(varLabel)}
                      class="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span class="rounded bg-gray-100 px-2 py-0.5 text-xs font-mono font-medium text-gray-700">
                      {varLabel}
                    </span>
                  </label>
                )
              })}
            </div>
            {variables().length > 0 && (
              <div class="mt-4">
                <label class="text-xs font-medium text-gray-500">Value for {activeVar()}</label>
                <Input.Root
                  placeholder="Enter variable value..."
                  class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            )}
          </Card.Content>
        </Card.Root>
      </div>

      <Tabs.Root defaultValue="saved">
        <Tabs.List class="flex border-b border-gray-200">
          <Tabs.Trigger
            value="saved"
            class="border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-600"
          >
            Saved Prompts
          </Tabs.Trigger>
          <Tabs.Trigger
            value="templates"
            class="border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-600"
          >
            Templates
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="saved" class="pt-6">
          <div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Variables</th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Template Preview</th>
                  <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Updated</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                {SAVED_PROMPTS.map((prompt) => (
                  <tr class="hover:bg-gray-50">
                    <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{prompt.name}</td>
                    <td class="px-6 py-4">
                      <div class="flex flex-wrap gap-1">
                        {prompt.variables.map((v) => (
                          <span class="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-mono text-gray-600">
                            {v}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td class="max-w-xs truncate px-6 py-4 text-sm text-gray-500">{prompt.template}</td>
                    <td class="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-400">{prompt.updatedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Tabs.Content>
        <Tabs.Content value="templates" class="pt-6">
          <div class="rounded-lg border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
            Browse community prompt templates to get started quickly.
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}
