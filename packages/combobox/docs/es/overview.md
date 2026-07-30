---
contentSchemaVersion: 1
title: Combobox
description: Entrada de autocompletado con un listbox filtrable para seleccionar entre un conjunto de opciones.
keywords: [autocompletado, combobox, desplegable, listbox]
locale: es
maturity: beta
product: Combobox
productLayer: primitive
status: published
package: "@solidiom/combobox"
primitive: combobox
section: overview
---

Combobox combina una entrada de texto con un listbox filtrable. A medida que el usuario escribe, la lista se reduce a las opciones coincidentes. La navegación por teclado usa el patrón de descendiente activo para que el foco permanezca en la entrada mientras los elementos se resaltan visualmente.

## Uso

Compón `Root`, `Input`, `Content`, `Item` e `ItemText`. La entrada abre el listbox al recibir el foco o al escribir; seleccionar un elemento lo cierra y completa la entrada.

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
