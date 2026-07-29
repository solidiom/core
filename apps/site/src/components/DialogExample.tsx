import * as Dialog from "@solidiom/dialog"
import type { Locale } from "../lib/locale"

const COPY: Record<
  Locale,
  {
    trigger: string
    title: string
    description: string
    cancel: string
    confirm: string
  }
> = {
  en: {
    trigger: "Open confirmation dialog",
    title: "Delete workspace?",
    description:
      "This demonstration does not delete anything. It shows a modal Dialog with a label, description, and two dismissal actions.",
    cancel: "Cancel",
    confirm: "Delete workspace",
  },
  es: {
    trigger: "Abrir diálogo de confirmación",
    title: "¿Eliminar espacio de trabajo?",
    description:
      "Esta demostración no elimina nada. Muestra un Dialog modal con etiqueta, descripción y dos acciones para cerrarlo.",
    cancel: "Cancelar",
    confirm: "Eliminar espacio de trabajo",
  },
}

export interface DialogExampleProps {
  locale: Locale
}

/**
 * Canonical executable source for the Dialog documentation example.
 * The matching content entry declares this file as its source so rendered code
 * and the live behavior do not drift apart.
 */
export function DialogExample(props: DialogExampleProps) {
  const copy = () => COPY[props.locale]

  return (
    <div
      ref={(element) => element.setAttribute("data-hydrated", "true")}
      class="dialog-example"
      data-dialog-example
    >
      <Dialog.Root>
        <Dialog.Trigger>
          <span class="dialog-example__trigger">{copy().trigger}</span>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Backdrop class="dialog-example__backdrop" />
          <Dialog.Content class="dialog-example__content">
            <Dialog.Title class="dialog-example__title">{copy().title}</Dialog.Title>
            <Dialog.Description class="dialog-example__description">
              {copy().description}
            </Dialog.Description>
            <div class="dialog-example__actions">
              <Dialog.Close>
                <span class="dialog-example__button dialog-example__button--secondary">
                  {copy().cancel}
                </span>
              </Dialog.Close>
              <Dialog.Close>
                <span class="dialog-example__button dialog-example__button--danger">
                  {copy().confirm}
                </span>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
