import type { JSX } from "solid-js"
import * as Card from "@solidiom/card"
import * as Button from "@solidiom/button"
import * as Dialog from "@solidiom/dialog"

export function DangerZoneItem(props: { title: string; description: string; actionLabel: string; onConfirm: () => void }): JSX.Element {
  return (
    <Card.Root class="rounded-lg border border-red-200 bg-red-50">
      <Card.Content class="px-4 py-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-red-900">{props.title}</p>
            <p class="text-sm text-red-700">{props.description}</p>
          </div>
          <Dialog.Root>
            <Dialog.Trigger as={Button.Root} class="inline-flex items-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-red-700">
              {props.actionLabel}
            </Dialog.Trigger>
            <Dialog.Content class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div class="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                <Dialog.Title class="text-lg font-semibold text-gray-900">Confirm Action</Dialog.Title>
                <Dialog.Description class="mt-2 text-sm text-gray-500">
                  Are you sure you want to {props.actionLabel.toLowerCase()}? This action cannot be undone.
                </Dialog.Description>
                <div class="mt-4 flex justify-end gap-3">
                  <Dialog.Close as={Button.Root} class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                    Cancel
                  </Dialog.Close>
                  <Dialog.Close as={Button.Root} class="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700" onClick={props.onConfirm}>
                    {props.actionLabel}
                  </Dialog.Close>
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Root>
        </div>
      </Card.Content>
    </Card.Root>
  )
}
