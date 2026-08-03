import { createSignal } from "solid-js"
import * as Button from "@solidiom/button"
import type { Locale } from "../lib/locale"

const COPY: Record<
  Locale,
  {
    action: string
    loading: string
    toggle: string
    groupDraft: string
    groupPreview: string
    groupPublish: string
  }
> = {
  en: {
    action: "Click me",
    loading: "Saving...",
    toggle: "Bold",
    groupDraft: "Draft",
    groupPreview: "Preview",
    groupPublish: "Publish",
  },
  es: {
    action: "Haz clic",
    loading: "Guardando...",
    toggle: "Negrita",
    groupDraft: "Borrador",
    groupPreview: "Vista previa",
    groupPublish: "Publicar",
  },
}

export interface ButtonExampleProps {
  locale: Locale
}

/**
 * Canonical executable source for the Button documentation example.
 * Demonstrates all four parts: Root, Root with loading, ToggleButton,
 * and ButtonGroup. Keyboard activation (Enter/Space) is exercisable.
 */
export function ButtonExample(props: ButtonExampleProps) {
  const copy = () => COPY[props.locale]
  const [pressed, setPressed] = createSignal(false)
  const [loading, setLoading] = createSignal(false)

  const handleClick = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 1200)
  }

  return (
    <div
      ref={(element) => element.setAttribute("data-hydrated", "true")}
      class="button-example"
      data-button-example
    >
      <div class="button-example__row">
        <Button.Root onClick={handleClick} loading={loading()}>
          {loading() ? copy().loading : copy().action}
        </Button.Root>
      </div>

      <div class="button-example__row">
        <Button.ToggleButton pressed={pressed()} onPressedChange={setPressed}>
          {copy().toggle}
        </Button.ToggleButton>
      </div>

      <div class="button-example__row">
        <Button.ButtonGroup orientation="horizontal">
          <Button.Root>{copy().groupDraft}</Button.Root>
          <Button.Root>{copy().groupPreview}</Button.Root>
          <Button.Root>{copy().groupPublish}</Button.Root>
        </Button.ButtonGroup>
      </div>
    </div>
  )
}
