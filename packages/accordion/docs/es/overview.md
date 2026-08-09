---
contentSchemaVersion: 1
title: Accordion
description: Conjunto apilado verticalmente de secciones colapsables con modos de expansión simple o múltiple.
keywords: [acordeón, colapsable, secciones, expandir, colapsar]
locale: es
maturity: ga
product: Accordion
productLayer: primitive
status: draft
package: "@solidiom/accordion"
primitive: accordion
section: overview
translationSourceHash: "1d44ce42cd4fb6fa99edf13b6930bdb02c651db9754484b682ff0b63fa6c192f"
translationStatus: human-reviewed
translationReviewedBy: "G5-gate"
translationReviewedAt: "2026-08-07"
notApplicable:
  - section: relationships
    reason: Accordion no tiene primitivos hermanos; se compone con otros pero no posee un contrato inter-primitivo.
  - section: migration
    reason: Sin API previa; esta es la primera versión publicada.
  - section: testing
    reason: La guía estándar de pruebas cubre este primitivo. El comportamiento del teclado está completamente documentado en la sección de interacción por teclado.
---

Accordion presenta un conjunto apilado verticalmente de secciones colapsables. Los usuarios expanden uno o más elementos para revelar el contenido asociado. Úsalo para organizar grandes cantidades de información en grupos manejables y escaneables.

## Uso

Compón `Root`, `Item`, `Trigger` y `Content`. Cada `Item` contiene un botón `Trigger` y una región `Content`. El primitivo gestiona los atributos ARIA, la navegación por teclado y el estado de expansión/colapso.

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

| Tecla           | Comportamiento                        |
| --------------- | ------------------------------------- |
| Flecha abajo    | Mover el foco al siguiente disparador |
| Flecha arriba   | Mover el foco al disparador anterior  |
| Inicio          | Mover el foco al primer disparador    |
| Fin             | Mover el foco al último disparador    |
| Enter / Espacio | Alternar el elemento enfocado         |

## Instalación

Instala el paquete con `pnpm add @solidiom/accordion`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

Accordion expone cuatro partes:

- **Root** — el contenedor que gestiona el estado de expansión y la navegación por teclado. Acepta `type` (`"single"` | `"multiple"`), `collapsible`, `value`/`defaultValue` y `onValueChange`.
- **Item** — un contenedor de sección colapsable identificado por su prop `value`.
- **Trigger** — el botón que alterna su Item padre. Lleva `aria-expanded` y `aria-controls`.
- **Content** — la región colapsable asociada a su Trigger hermano. Se oculta cuando el elemento está cerrado.

## Estilos

Accordion incluye recetas CSS, Tailwind y UnoCSS. Las partes `Root`, `Item`, `Trigger` y `Content` llevan los atributos `data-scope="accordion"` y `data-part` para su selección. Los elementos exponen `data-state="open"` o `data-state="closed"`, y `Trigger` expone `data-disabled` cuando está deshabilitado.

## Renderizado SSR e hidratación

Accordion se renderiza como HTML estático. Los elementos expandidos se determinan por `defaultValue` o `value` durante el renderizado en servidor. El primitivo se hidrata sin efectos secundarios; la navegación por teclado y los controladores de clic se activan en el cliente.

## Composición

Accordion está diseñado para componerse con otros primitivos. Puedes anidar un `Field` dentro del contenido de un elemento, usar `Kbd` dentro de las etiquetas del disparador para mostrar atajos, o colocar un `Button` dentro de la región de contenido para acciones secundarias.
