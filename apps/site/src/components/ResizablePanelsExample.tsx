import * as ResizablePanels from "@solidiom/resizable-panels"
import type { Locale } from "../lib/locale"

const COPY: Record<
  Locale,
  {
    panel1: string
    panel2: string
  }
> = {
  en: {
    panel1: "Panel 1 — Drag the handle to resize",
    panel2: "Panel 2 — This panel adjusts automatically",
  },
  es: {
    panel1: "Panel 1 — Arrastre el control para redimensionar",
    panel2: "Panel 2 — Este panel se ajusta automáticamente",
  },
}

export interface ResizablePanelsExampleProps {
  locale: Locale
}

/**
 * Canonical executable source for the Resizable Panels documentation example.
 * Demonstrates a draggable split-panel layout with two horizontally arranged panels.
 */
export function ResizablePanelsExample(props: ResizablePanelsExampleProps) {
  const copy = () => COPY[props.locale]

  return (
    <div
      ref={(element) => element.setAttribute("data-hydrated", "true")}
      class="resizable-panels-example"
      data-resizable-panels-example
    >
      <ResizablePanels.PanelGroup direction="horizontal" defaultSizes={[50, 50]}>
        <ResizablePanels.Panel order={0} defaultSize={50} minSize={20}>
          <div class="resizable-panels-example__panel">{copy().panel1}</div>
        </ResizablePanels.Panel>
        <ResizablePanels.Handle index={0}>
          <div class="resizable-panels-example__handle" />
        </ResizablePanels.Handle>
        <ResizablePanels.Panel order={1} defaultSize={50} minSize={20}>
          <div class="resizable-panels-example__panel">{copy().panel2}</div>
        </ResizablePanels.Panel>
      </ResizablePanels.PanelGroup>
    </div>
  )
}
