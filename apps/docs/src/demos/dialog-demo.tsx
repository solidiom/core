import * as Dialog from "@solidiom/dialog"

export function DialogDemo() {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <span class="inline-flex items-center rounded-md bg-[hsl(var(--primary))] px-4 py-2 text-sm font-medium text-[hsl(var(--primary-foreground))] hover:opacity-90 transition-opacity">
          Open Dialog
        </span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop class="fixed inset-0 z-50 bg-black/80" />
        <Dialog.Content class="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-6 shadow-lg">
          <Dialog.Title>
            <span class="text-lg font-semibold text-[hsl(var(--foreground))]">Are you sure?</span>
          </Dialog.Title>
          <Dialog.Description>
            <span class="mt-2 block text-sm text-[hsl(var(--muted-foreground))]">
              This action cannot be undone. This will permanently delete your account and remove
              your data from our servers.
            </span>
          </Dialog.Description>
          <div class="mt-6 flex justify-end gap-3">
            <Dialog.Close>
              <span class="inline-flex items-center rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-4 py-2 text-sm font-medium hover:bg-[hsl(var(--accent))] transition-colors">
                Cancel
              </span>
            </Dialog.Close>
            <Dialog.Close>
              <span class="inline-flex items-center rounded-md bg-[hsl(var(--destructive,0_72%_51%))] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity">
                Delete
              </span>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export const dialogDemoCode = `import * as Dialog from "@solidiom/dialog"

function DialogExample() {
  return (
    <Dialog.Root>
      <Dialog.Trigger>Open Dialog</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Content>
          <Dialog.Title>Are you sure?</Dialog.Title>
          <Dialog.Description>
            This action cannot be undone.
          </Dialog.Description>
          <Dialog.Close>Cancel</Dialog.Close>
          <Dialog.Close>Delete</Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}`
