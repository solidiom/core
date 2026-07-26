import { Dialog } from "@kobalte/core/dialog"

export function KobalteDialog() {
  return (
    <Dialog.Root>
      <Dialog.Trigger>Open</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Title>From Kobalte</Dialog.Title>
          <Dialog.CloseButton>X</Dialog.CloseButton>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
