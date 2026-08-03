import { createSignal } from "solid-js"
import * as Switch from "@solidiom/switch"
import type { Locale } from "../lib/locale"

const COPY: Record<Locale, { label: string }> = {
  en: { label: "Enable notifications" },
  es: { label: "Activar notificaciones" },
}

export interface SwitchExampleProps {
  locale: Locale
}

/** Canonical executable source for the Switch documentation example. */
export function SwitchExample(props: SwitchExampleProps) {
  const copy = () => COPY[props.locale]
  const [on, setOn] = createSignal(false)

  return (
    <div ref={(el) => el.setAttribute("data-hydrated", "true")} class="switch-example">
      <Switch.Root checked={on()} onCheckedChange={setOn}>
        {copy().label}
        <Switch.Thumb />
      </Switch.Root>
    </div>
  )
}
