import { DialogRoot, DialogTrigger, DialogContent, DialogOverlay, DialogTitle, DialogDescription, DialogClose, DialogPortal } from "~/components/ui/dialog"

export function ConfirmDialog() {
  return (
    <DialogRoot>
      <DialogTrigger>Delete</DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
          <DialogClose>Cancel</DialogClose>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  )
}
