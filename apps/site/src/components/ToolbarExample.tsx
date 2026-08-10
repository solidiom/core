import * as Toolbar from "@solidiom/toolbar"
import type { Locale } from "../lib/locale"

const COPY: Record<
  Locale,
  {
    cut: string
    copy: string
    paste: string
    bold: string
    italic: string
  }
> = {
  en: {
    cut: "Cut",
    copy: "Copy",
    paste: "Paste",
    bold: "B",
    italic: "I",
  },
  es: {
    cut: "Cortar",
    copy: "Copiar",
    paste: "Pegar",
    bold: "N",
    italic: "C",
  },
}

export interface ToolbarExampleProps {
  locale: Locale
}

/**
 * Canonical executable source for the Toolbar documentation example.
 */
export function ToolbarExample(props: ToolbarExampleProps) {
  const copy = () => COPY[props.locale]

  return (
    <div
      ref={(element) => element.setAttribute("data-hydrated", "true")}
      class="toolbar-example"
      data-toolbar-example
    >
      <Toolbar.Root>
        <Toolbar.Button>{copy().cut}</Toolbar.Button>
        <Toolbar.Button>{copy().copy}</Toolbar.Button>
        <Toolbar.Button>{copy().paste}</Toolbar.Button>
        <Toolbar.Separator />
        <Toolbar.ToggleGroup type="single">
          <Toolbar.ToggleItem pressed={false} onPressedChange={() => undefined}>
            {copy().bold}
          </Toolbar.ToggleItem>
          <Toolbar.ToggleItem pressed={false} onPressedChange={() => undefined}>
            {copy().italic}
          </Toolbar.ToggleItem>
        </Toolbar.ToggleGroup>
      </Toolbar.Root>
    </div>
  )
}
