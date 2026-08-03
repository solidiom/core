---
contentSchemaVersion: 1
title: Accordion
description: Conjunto apilado verticalmente de secciones colapsables con modos de expansión simple o múltiple.
keywords: [acordeón, colapsable, secciones, expandir, colapsar]
locale: es
maturity: draft
product: Accordion
productLayer: primitive
status: draft
package: "@solidiom/accordion"
primitive: accordion
section: overview
translationSourceHash: "0000000000000000000000000000000000000000000000000000000000000000"
translationStatus: draft
---

Accordion presenta un conjunto apilado verticalmente de secciones colapsables. Los usuarios expanden uno o más elementos para revelar el contenido asociado. Úsalo para organizar grandes cantidades de información en grupos manejables y escaneables.

## Uso

Compón `Root`, `Item`, `Trigger` y `Content`. Cada `Item` contiene un botón `Trigger` y una región `Content`. La primitiva gestiona los atributos ARIA, la navegación por teclado y el estado de expansión/colapso.

```tsx
import * as Accordion from "@solidiom/accordion"

;<Accordion.Root>
  <Accordion.Item value="one">
    <Accordion.Trigger>Sección Uno</Accordion.Trigger>
    <Accordion.Content>Contenido de la primera sección.</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="two">
    <Accordion.Trigger>Sección Dos</Accordion.Trigger>
    <Accordion.Content>Contenido de la segunda sección.</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

Por defecto, Accordion opera en modo de expansión simple: abrir un elemento cierra los demás. Usa `type="multiple"` para permitir que varios elementos permanezcan abiertos simultáneamente. En modo simple, `collapsible={true}` permite al usuario cerrar todos los elementos.

Usa `value` y `onValueChange` para un estado controlado. La variante no controlada gestiona los elementos expandidos internamente mediante `defaultValue`.

## Interacción por teclado

| Tecla | Comportamiento |
| ----- | -------------- |
| Flecha abajo | Mover el foco al siguiente disparador |
| Flecha arriba | Mover el foco al disparador anterior |
| Inicio | Mover el foco al primer disparador |
| Fin | Mover el foco al último disparador |
| Enter / Espacio | Alternar el elemento enfocado |

## Instalación

Instala el paquete con `pnpm add @solidiom/accordion`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Estilos

Accordion incluye recetas CSS, Tailwind y UnoCSS. Las partes `Root`, `Item`, `Trigger` y `Content` llevan los atributos `data-scope="accordion"` y `data-part` para su selección. Los elementos exponen `data-state="open"` o `data-state="closed"`, y `Trigger` expone `data-disabled` cuando está deshabilitado.

## Renderizado SSR e hidratación

Accordion se renderiza como HTML estático. Los elementos expandidos se determinan por `defaultValue` o `value` durante el renderizado en servidor. La primitiva se hidrata sin efectos secundarios; la navegación por teclado y los controladores de clic se activan en el cliente.

## Composición

Accordion está diseñado para componerse con otras primitivas. Puedes anidar un `Field` dentro del contenido de un elemento, usar `Kbd` dentro de las etiquetas del disparador para mostrar atajos, o colocar un `Button` dentro de la región de contenido para acciones secundarias.