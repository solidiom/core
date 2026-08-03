---
contentSchemaVersion: 1
title: Combobox
description: Campo de autocompletado con una lista filtrable para seleccionar entre un conjunto de opciones.
keywords: [autocompletado, combobox, desplegable, listbox]
locale: es
maturity: beta
product: Combobox
productLayer: primitive
status: published
package: "@solidiom/combobox"
primitive: combobox
section: overview
translationSourceHash: "b3bb2ab058919524b06c2d8ec8ac8f3bd2d24517faebbfd1c5cc1553f82b4e1d"
translationStatus: draft
notApplicable:
  - section: relationships
    reason: Combobox no tiene primitivos hermanos. Se compone internamente con su listbox e input pero no posee un contrato inter-primitivo.
  - section: migration
    reason: Sin API previa; esta es la primera versión publicada.
  - section: testing
    reason: La guía estándar de pruebas cubre este primitivo. El comportamiento del teclado está documentado en la sección Teclado.
---

Combobox combina un campo de texto con una lista filtrable. A medida que el usuario escribe, la lista se reduce a las opciones coincidentes. La navegación por teclado utiliza el patrón active-descendant para que el foco permanezca en el input mientras los elementos se resaltan visualmente.

## Uso

Compón `Root`, `Input`, `Content`, `Item` e `ItemText`. El input abre la lista al recibir foco o al escribir; seleccionar un elemento la cierra y rellena el input.

```tsx
import * as Combobox from "@solidiom/combobox"

;<Combobox.Root>
  <Combobox.Input placeholder="Elige una fruta" />
  <Combobox.Content>
    <Combobox.Item value="apple">
      <Combobox.ItemText>Manzana</Combobox.ItemText>
    </Combobox.Item>
    <Combobox.Item value="banana">
      <Combobox.ItemText>Plátano</Combobox.ItemText>
    </Combobox.Item>
    <Combobox.Item value="cherry">
      <Combobox.ItemText>Cereza</Combobox.ItemText>
    </Combobox.Item>
  </Combobox.Content>
</Combobox.Root>
```

Usa `inputValue` y `onInputValueChange` para filtrado controlado. Usa `selectedValue` y `onSelectedValueChange` para selección controlada. La variante no controlada gestiona ambos valores internamente mediante `defaultInputValue` y `defaultSelectedValue`.

## Instalación

Instala el paquete con `pnpm add @solidiom/combobox`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

Combobox expone cinco partes:

- **Root** — el contenedor que gestiona el estado abierto, la selección, el valor del input y la navegación por teclado.
- **Input** — el campo de texto que activa el filtrado. Lleva `role="combobox"`, `aria-expanded`, `aria-autocomplete` y `aria-activedescendant`.
- **Content** — la ventana emergente de la lista que contiene los elementos. Lleva `role="listbox"`.
- **Item** — una opción en la lista. Lleva `role="option"` y `aria-selected`.
- **ItemText** — la etiqueta visible de un elemento.

## Estilos

Combobox incluye recetas CSS, Tailwind y UnoCSS. Las partes llevan los atributos `data-scope="combobox"` y `data-part`. Los elementos exponen `data-highlighted` cuando están activos mediante teclado y `data-state="checked"` cuando están seleccionados.

## Interacción con teclado

| Tecla     | Comportamiento                                                           |
| --------- | ------------------------------------------------------------------------ |
| ArrowDown | Abre la lista si está cerrada; mueve el resaltado al siguiente elemento. |
| ArrowUp   | Mueve el resaltado al elemento anterior.                                 |
| Inicio    | Mueve el resaltado al primer elemento.                                   |
| Fin       | Mueve el resaltado al último elemento.                                   |
| Enter     | Selecciona el elemento resaltado y cierra la lista.                      |
| Escape    | Cierra la lista sin seleccionar; limpia el input si se repite.           |

El foco permanece en el input en todo momento. El patrón `aria-activedescendant` transmite el elemento resaltado a la tecnología de asistencia.

## Composición

Combobox está diseñado para componerse con otras primitivas. Usa un `Field` envolviendo Root para conectar la etiqueta y los mensajes de error, o coloca un `Spinner` dentro de Content para indicar la carga de resultados.

## Renderizado SSR e hidratación

Combobox renderiza el input como HTML estático. El contenido de la lista no está presente en el DOM inicial (se renderiza al abrirse). La hidratación adjunta los manejadores de teclado y posiciona la ventana emergente. No ocurre desplazamiento de diseño porque la lista usa posicionamiento absoluto/fijo.
