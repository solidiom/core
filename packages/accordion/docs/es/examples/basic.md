---
contentSchemaVersion: 1
title: Acordeón - Uso básico
description: Acordeón con elementos colapsables, comportamiento a nivel de acordeón, y control de estado inicial.
keywords: [acordeón, básico, colapsable, individual, múltiple]
locale: es
maturity: draft
product: Accordion
productLayer: primitive
status: draft
package: "@solidiom/accordion"
primitive: accordion
section: examples
exampleId: accordion-basic
source:
  path: packages/accordion/src/accordion.tsx
  export: Root
  language: tsx
runnable: false
translationSourceHash: "6a10253f025e4194d5f871fa553cf940c9f8aa22b55fa97b61c655e3610ac247"
translationStatus: draft
---

El ejemplo interactivo demuestra un acordeón colapsable de expansión individual. Presiona **ArrowDown**/**ArrowUp** para mover el foco entre los triggers, **Home**/**End** para saltar al primer o último trigger, y **Enter** o **Space** para alternar la sección con foco.

```tsx
import * as Accordion from "@solidiom/accordion"

;<Accordion.Root type="single" collapsible defaultValue="item-1">
  <Accordion.Item value="item-1">
    <Accordion.Trigger>¿Qué es Solidiom?</Accordion.Trigger>
    <Accordion.Content>
      Un kit de componentes para SolidJS construido sobre HTML semántico, accesible por defecto.
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-2">
    <Accordion.Trigger>¿Es accesible?</Accordion.Trigger>
    <Accordion.Content>
      Sí, sigue las Prácticas de Autoría WAI-ARIA para patrones de acordeón.
    </Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

## Opciones a nivel de acordeón

La propiedad `type` controla si los elementos son independientes (`multiple`) o mutuamente excluyentes (`single`). Con `collapsible`, todos los elementos pueden cerrarse simultáneamente.
