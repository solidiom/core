---
contentSchemaVersion: 1
title: Dialog
description: Presenta contenido modal o no modal que requiere una interacción enfocada.
keywords: [modal, superposición, foco]
locale: es
maturity: ga
product: Dialog
productLayer: primitive
status: published
package: "@solidiom/dialog"
primitive: dialog
section: overview
notApplicable:
  - section: relationships
    reason: Dialog no tiene primitivos hermanos. Se compone internamente con Portal y Backdrop pero no posee un contrato inter-primitivo.
  - section: migration
    reason: Sin API previa; esta es la primera versión publicada.
  - section: testing
    reason: La guía estándar de pruebas cubre este primitivo. El atrapamiento de foco y el comportamiento del teclado están documentados en la sección Teclado.
translationSourceHash: "bbfb08330634934adf2eef2e3aff4adc311696645c8a9b4258c974e6cf4b4d47"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

Dialog presenta contenido contextual sobre la página actual. Úsalo cuando una decisión enfocada o un flujo breve deba interrumpir la tarea actual.

## Uso

Compón `Root`, `Trigger`, `Portal`, `Backdrop` y `Content`. Un diálogo modal debe incluir `Title` y una `Description` concisa para que la tecnología de asistencia pueda anunciar su propósito.

```tsx
import * as Dialog from "@solidiom/dialog"

;<Dialog.Root>
  <Dialog.Trigger>Abrir diálogo</Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Backdrop />
    <Dialog.Content>
      <Dialog.Title>Título del diálogo</Dialog.Title>
      <Dialog.Description>Explica la decisión o el siguiente paso.</Dialog.Description>
      <Dialog.Close>Cerrar</Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

Usa `modal={false}` solo cuando sea apropiado mantener la interacción con el fondo. No uses un Dialog para información que pertenezca al flujo normal del documento.

## Instalación

Instala el paquete con `pnpm add @solidiom/dialog`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

Dialog expone siete partes:

- **Root** — contenedor de estado que gestiona abierto/cerrado, modal/no modal y modos controlado/no controlado.
- **Trigger** — el botón que abre el diálogo. Lleva `aria-haspopup="dialog"` y `aria-expanded`.
- **Portal** — renderiza hijos en `document.body` para escapar restricciones de overflow/z-index.
- **Backdrop** — superposición a pantalla completa detrás del contenido. Hacer clic en ella cierra el diálogo en modo modal.
- **Content** — el panel del diálogo. Recibe `role="dialog"`, `aria-modal`, `aria-labelledby` y `aria-describedby`.
- **Title** — el encabezado visible, conectado a Content mediante `aria-labelledby`.
- **Description** — texto explicativo opcional, conectado mediante `aria-describedby`.
- **Close** — un botón que cierra el diálogo.

## Estilos

Dialog incluye recetas CSS, Tailwind y UnoCSS. Las partes llevan los atributos `data-scope="dialog"` y `data-part`. La parte Content expone `data-state="open"` o `data-state="closed"` para animaciones de entrada/salida. El Backdrop usa `data-part="backdrop"` con el mismo atributo de estado.

## Interacción con teclado

| Tecla     | Comportamiento                                                                             |
| --------- | ------------------------------------------------------------------------------------------ |
| Escape    | Cierra el diálogo y restaura el foco al disparador.                                        |
| Tab       | Mueve el foco al siguiente elemento enfocable dentro del diálogo (atrapado en modo modal). |
| Shift+Tab | Mueve el foco hacia atrás dentro del contenido del diálogo.                                |

El foco queda atrapado dentro del diálogo cuando `modal` es true. Al abrir, el foco se mueve al primer elemento enfocable dentro de Content. Al cerrar, el foco regresa a Trigger.

## Composición

Dialog está diseñado para componerse con otras primitivas. Usa un `Field` dentro de Content para flujos de formulario, `Button` para acciones de confirmar/cancelar, o anida un `Alert` para advertencias en línea dentro del cuerpo del diálogo.

## Renderizado SSR e hidratación

Dialog se renderiza como HTML oculto durante SSR — Content no está presente en el DOM inicial a menos que se establezca `defaultOpen`. La hidratación adjunta los manejadores de eventos y la lógica de atrapamiento de foco. El `Portal` se renderiza solo en el cliente para evitar desajustes de marcado servidor/cliente.
