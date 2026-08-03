import * as Tabs from "@solidiom/tabs"
import type { Locale } from "../lib/locale"

const COPY: Record<Locale, { tabs: Array<{ value: string; label: string; content: string }> }> = {
  en: {
    tabs: [
      { value: "general", label: "General", content: "General settings and preferences." },
      { value: "security", label: "Security", content: "Security and privacy options." },
      { value: "notifications", label: "Notifications", content: "Notification preferences." },
    ],
  },
  es: {
    tabs: [
      { value: "general", label: "General", content: "Configuración y preferencias generales." },
      { value: "security", label: "Seguridad", content: "Opciones de seguridad y privacidad." },
      { value: "notifications", label: "Notificaciones", content: "Preferencias de notificación." },
    ],
  },
}

export interface TabsExampleProps {
  locale: Locale
}

/** Canonical executable source for the Tabs documentation example. */
export function TabsExample(props: TabsExampleProps) {
  const copy = () => COPY[props.locale]

  return (
    <div ref={(el) => el.setAttribute("data-hydrated", "true")} class="tabs-example">
      <Tabs.Root defaultValue="general">
        <Tabs.List aria-label="Settings">
          {copy().tabs.map((tab) => (
            <Tabs.Trigger value={tab.value}>{tab.label}</Tabs.Trigger>
          ))}
        </Tabs.List>
        {copy().tabs.map((tab) => (
          <Tabs.Content value={tab.value}>{tab.content}</Tabs.Content>
        ))}
      </Tabs.Root>
    </div>
  )
}
