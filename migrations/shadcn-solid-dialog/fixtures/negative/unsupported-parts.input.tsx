import { Dialog, DialogHeader, DialogFooter } from "@shadcn-solid/dialog"

export function CustomDialog() {
  return (
    <Dialog.Root>
      <Dialog.Trigger>Open</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Content>
          <DialogHeader>
            <Dialog.Title>Custom Layout</Dialog.Title>
          </DialogHeader>
          <DialogFooter>
            <Dialog.Close>Done</Dialog.Close>
          </DialogFooter>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
