import * as ContextMenu from "@solidiom/context-menu"
import type { Locale } from "../lib/locale"

const COPY: Record<
  Locale,
  {
    prompt: string
    copy: string
    paste: string
    edit: string
    divider: string
    showLineNumbers: string
    showWhitespace: string
    theme: string
    light: string
    dark: string
  }
> = {
  en: {
    prompt: "Right-click here",
    copy: "Copy",
    paste: "Paste",
    edit: "Edit",
    divider: "Divider",
    showLineNumbers: "Show line numbers",
    showWhitespace: "Show whitespace",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
  },
  es: {
    prompt: "Clic derecho aquí",
    copy: "Copiar",
    paste: "Pegar",
    edit: "Editar",
    divider: "Divisor",
    showLineNumbers: "Mostrar números de línea",
    showWhitespace: "Mostrar espacios en blanco",
    theme: "Tema",
    light: "Claro",
    dark: "Oscuro",
  },
}

export interface ContextMenuExampleProps {
  locale: Locale
}

/**
 * Canonical executable source for the Context Menu documentation example.
 */
export function ContextMenuExample(props: ContextMenuExampleProps) {
  const copy = () => COPY[props.locale]

  return (
    <div
      ref={(element) => element.setAttribute("data-hydrated", "true")}
      class="context-menu-example"
      data-context-menu-example
    >
      <ContextMenu.Root>
        <ContextMenu.Trigger>
          <div
            style={{
              padding: "2rem",
              border: "1px dashed var(--color-border)",
              borderRadius: "0.5rem",
              textAlign: "center",
              color: "var(--color-foreground-muted)",
              fontSize: "0.875rem",
              cursor: "context-menu",
            }}
          >
            {copy().prompt}
          </div>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item onSelect={() => undefined}>{copy().copy}</ContextMenu.Item>
          <ContextMenu.Item onSelect={() => undefined}>{copy().paste}</ContextMenu.Item>
          <ContextMenu.Item onSelect={() => undefined}>{copy().edit}</ContextMenu.Item>
          <ContextMenu.Separator />
          <ContextMenu.CheckboxItem checked={false} onCheckedChange={() => undefined}>
            {copy().showLineNumbers}
          </ContextMenu.CheckboxItem>
          <ContextMenu.CheckboxItem checked={false} onCheckedChange={() => undefined}>
            {copy().showWhitespace}
          </ContextMenu.CheckboxItem>
          <ContextMenu.Separator />
          <ContextMenu.RadioGroup value="light" onValueChange={() => undefined}>
            <ContextMenu.RadioItem value="light">{copy().light}</ContextMenu.RadioItem>
            <ContextMenu.RadioItem value="dark">{copy().dark}</ContextMenu.RadioItem>
          </ContextMenu.RadioGroup>
        </ContextMenu.Content>
      </ContextMenu.Root>
    </div>
  )
}
