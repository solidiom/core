import * as Toast from "@solidiom/toast"
import type { Locale } from "../lib/locale"

const toaster = Toast.createToaster({ max: 3, defaultDuration: 4000 })

const COPY: Record<
  Locale,
  {
    trigger: string
    title: string
    description: string
  }
> = {
  en: {
    trigger: "Show notification",
    title: "Success",
    description: "Your action was completed.",
  },
  es: {
    trigger: "Mostrar notificación",
    title: "Éxito",
    description: "Su acción se completó.",
  },
}

export interface ToastExampleProps {
  locale: Locale
}

/**
 * Canonical executable source for the Toast documentation example.
 * Demonstrates a toast notification with programmatic triggering.
 */
export function ToastExample(props: ToastExampleProps) {
  const copy = () => COPY[props.locale]

  return (
    <div
      ref={(element) => element.setAttribute("data-hydrated", "true")}
      class="toast-example"
      data-toast-example
    >
      <button
        type="button"
        class="toast-example__trigger"
        onClick={() =>
          toaster.toast({
            title: copy().title,
            description: copy().description,
          })
        }
      >
        {copy().trigger}
      </button>
      <Toast.Region toaster={toaster}>
        {(toasts) =>
          toasts().map((entry) => (
            <Toast.Root toastId={entry.id}>
              {entry.title && <Toast.Title>{entry.title}</Toast.Title>}
              {entry.description && <Toast.Description>{entry.description}</Toast.Description>}
              <Toast.Close>✕</Toast.Close>
            </Toast.Root>
          ))
        }
      </Toast.Region>
    </div>
  )
}
