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
---

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