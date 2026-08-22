---
contentSchemaVersion: 1
title: Multi Selector
description: Menú desplegable multiselección con elementos checkbox y filtrado de búsqueda.
keywords: [multi-select, dropdown, tags, search, filter, roving focus, selection]
locale: es
maturity: ga
product: Multi Selector
productLayer: primitive
status: draft
package: "@solidiom/multi-selector"
primitive: multi-selector
section: overview
notApplicable:
  - section: migration
    reason: No existe una API anterior; esta es la primera versión publicada.
  - section: testing
    reason: La guía de pruebas estándar cubre este primitivo.
translationSourceHash: "7aa76edf04b10eba3012689f97b8485fecfc807087d723e9cda10f7629a88e9e"
translationStatus: "draft"
---

Multi Selector es un menú desplegable de multiselección con elementos checkbox y filtrado de búsqueda. Usa `createCollection`, `createRovingFocus`, `createSelection`, `createDisclosureState` y posicionamiento. Los valores seleccionados se muestran como Tags que se pueden quitar, y SearchInput filtra los elementos.

## Uso

Compón `Root`, `Trigger`, `TagList`, `Tag`, `TagRemove`, `Content`, `Item`, `ItemIndicator` y `SearchInput`.

```tsx
import * as MultiSelector from "@solidiom/multi-selector"

function TagPicker() {
  return (
    <MultiSelector.Root>
      <MultiSelector.Trigger>
        <MultiSelector.TagList>
          <MultiSelector.Tag>
            Diseño
            <MultiSelector.TagRemove>×</MultiSelector.TagRemove>
          </MultiSelector.Tag>
        </MultiSelector.TagList>
      </MultiSelector.Trigger>
      <MultiSelector.Content>
        <MultiSelector.SearchInput placeholder="Buscar…" />
        <MultiSelector.Item>
          Diseño
          <MultiSelector.ItemIndicator>✓</MultiSelector.ItemIndicator>
        </MultiSelector.Item>
      </MultiSelector.Content>
    </MultiSelector.Root>
  )
}
```

## Instalación

Instala el paquete con `pnpm add @solidiom/multi-selector`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

multi-selector expone 9 partes:

- **Root** — `data-part="root"`. Contenedor que coordina la selección, la colección y el estado de disclosure.
- **Trigger** — `data-part="trigger"`. Abre el menú y contiene las etiquetas seleccionadas.
- **TagList** — `data-part="taglist"`. Contiene las etiquetas de los valores seleccionados.
- **Tag** — `data-part="tag"`. Un valor seleccionado mostrado como etiqueta extraíble.
- **TagRemove** — `data-part="tagremove"`. Quita la etiqueta asociada.
- **Content** — `data-part="content"`. Panel desplegable con los elementos y el campo de búsqueda.
- **Item** — `data-part="item"`. Elemento checkbox seleccionable.
- **ItemIndicator** — `data-part="itemindicator"`. Indica el estado seleccionado del elemento.
- **SearchInput** — `data-part="searchinput"`. Filtra los elementos.

## Estilos

multi-selector incluye los atributos `data-scope="multi-selector"` y `data-part` en cada parte para seleccionar estilos CSS o recetas.

## Teclado y comportamiento

| Tecla            | Comportamiento                             |
| ---------------- | ------------------------------------------ |
| Teclas de flecha | Mueven el foco roving entre los elementos. |

## Composición

Multi Selector se compone dentro de formularios y superficies de filtrado donde se eligen varios valores de una lista con búsqueda.

## SSR e hidratación

Multi Selector renderiza las marcas de trigger y contenido en el servidor y activa durante la hidratación la selección, el filtrado, el foco roving y el disclosure.
