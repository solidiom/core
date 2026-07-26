/**
 * Styled Dialog — CSS recipe wrapper.
 * Composes @solidiom/dialog with plain CSS classes targeting semantic attributes.
 * Import the stylesheet separately: `import "@solidiom/recipes-css/styles/dialog.css"`
 */
import { type JSX } from "@solidjs/web"
import * as Dialog from "@solidiom/dialog"

export function StyledDialog(props: {
  trigger: JSX.Element
  title: string
  description?: string
  children?: JSX.Element
  open?: () => boolean
  onOpenChange?: (open: boolean) => void
}) {
  return (
    <Dialog.Root open={props.open} onOpenChange={props.onOpenChange}>
      <Dialog.Trigger>{props.trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Content>
          <Dialog.Title>{props.title}</Dialog.Title>
          {props.description && <Dialog.Description>{props.description}</Dialog.Description>}
          {props.children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
