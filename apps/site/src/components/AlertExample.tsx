import * as Alert from "@solidiom/alert"
import type { Locale } from "../lib/locale"

const COPY: Record<
  Locale,
  {
    info: { title: string; description: string }
    success: { title: string; description: string }
    warning: { title: string; description: string }
    error: { title: string; description: string }
  }
> = {
  en: {
    info: {
      title: "Information",
      description: "A new feature is available in your dashboard.",
    },
    success: {
      title: "Success",
      description: "Your changes have been saved.",
    },
    warning: {
      title: "Warning",
      description: "You are approaching your storage limit.",
    },
    error: {
      title: "Error",
      description: "Failed to connect to the server.",
    },
  },
  es: {
    info: {
      title: "Información",
      description: "Una nueva función está disponible en su panel.",
    },
    success: {
      title: "Éxito",
      description: "Sus cambios se han guardado.",
    },
    warning: {
      title: "Advertencia",
      description: "Se está aproximando al límite de almacenamiento.",
    },
    error: {
      title: "Error",
      description: "No se pudo conectar con el servidor.",
    },
  },
}

export interface AlertExampleProps {
  locale: Locale
}

/**
 * Canonical executable source for the Alert documentation example.
 * Demonstrates all four alert type variants: info, success, warning, and error.
 */
export function AlertExample(props: AlertExampleProps) {
  const copy = () => COPY[props.locale]

  return (
    <div
      ref={(element) => element.setAttribute("data-hydrated", "true")}
      class="alert-example"
      data-alert-example
    >
      <Alert.Root type="info">
        <Alert.Title>{copy().info.title}</Alert.Title>
        <Alert.Description>{copy().info.description}</Alert.Description>
      </Alert.Root>
      <Alert.Root type="success">
        <Alert.Title>{copy().success.title}</Alert.Title>
        <Alert.Description>{copy().success.description}</Alert.Description>
      </Alert.Root>
      <Alert.Root type="warning">
        <Alert.Title>{copy().warning.title}</Alert.Title>
        <Alert.Description>{copy().warning.description}</Alert.Description>
      </Alert.Root>
      <Alert.Root type="error">
        <Alert.Title>{copy().error.title}</Alert.Title>
        <Alert.Description>{copy().error.description}</Alert.Description>
      </Alert.Root>
    </div>
  )
}
