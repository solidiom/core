import * as AlertDialog from "@solidiom/alert-dialog"
import type { Locale } from "../lib/locale"

const COPY: Record<
  Locale,
  {
    trigger: string
    title: string
    description: string
    cancel: string
    action: string
  }
> = {
  en: {
    trigger: "Delete account",
    title: "Are you sure?",
    description:
      "This action cannot be undone. Your account and all data will be permanently deleted.",
    cancel: "Cancel",
    action: "Delete",
  },
  es: {
    trigger: "Eliminar cuenta",
    title: "¿Está seguro?",
    description:
      "Esta acción no se puede deshacer. Su cuenta y todos los datos serán eliminados permanentemente.",
    cancel: "Cancelar",
    action: "Eliminar",
  },
}

export interface AlertDialogExampleProps {
  locale: Locale
}

/**
 * Canonical executable source for the Alert Dialog documentation example.
 */
export function AlertDialogExample(props: AlertDialogExampleProps) {
  const copy = () => COPY[props.locale]

  return (
    <div
      ref={(element) => element.setAttribute("data-hydrated", "true")}
      class="alert-dialog-example"
      data-alert-dialog-example
    >
      <AlertDialog.Root>
        <AlertDialog.Trigger>
          <button
            type="button"
            style={{
              color: "#ef4444",
              padding: "0.5rem 1rem",
              border: "1px solid #ef4444",
              borderRadius: "0.5rem",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            {copy().trigger}
          </button>
        </AlertDialog.Trigger>
        <AlertDialog.Portal>
          <AlertDialog.Content>
            <AlertDialog.Title>{copy().title}</AlertDialog.Title>
            <AlertDialog.Description>{copy().description}</AlertDialog.Description>
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                justifyContent: "flex-end",
                marginTop: "1rem",
              }}
            >
              <AlertDialog.Cancel>
                <button type="button">{copy().cancel}</button>
              </AlertDialog.Cancel>
              <AlertDialog.Action>
                <button
                  type="button"
                  style={{
                    background: "#ef4444",
                    color: "white",
                    padding: "0.5rem 1rem",
                    border: "none",
                    borderRadius: "0.5rem",
                    cursor: "pointer",
                  }}
                >
                  {copy().action}
                </button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </div>
  )
}
