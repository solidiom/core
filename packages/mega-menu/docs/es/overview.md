---
contentSchemaVersion: 1
title: Mega Menu
description: Menú desplegable de navegación expandido con contenido enriquecido en varias columnas.
keywords: [mega menu, navigation, dropdown, multi-column, disclosure, roving focus, menu]
locale: es
maturity: ga
product: Mega Menu
productLayer: primitive
status: draft
package: "@solidiom/mega-menu"
primitive: mega-menu
section: overview
notApplicable:
  - section: migration
    reason: No existe una API anterior; esta es la primera versión publicada.
  - section: testing
    reason: La guía de pruebas estándar cubre este primitivo.
translationSourceHash: "d504aa8ace893574f217815554c1fddba23682d8c4ca277468ab74187d584d32"
translationStatus: "draft"
---

Mega Menu es un menú desplegable de navegación expandido con contenido enriquecido en varias columnas. Usa `createDisclosureState` para abrir y cerrar cada elemento, `createPointerIntent` para un periodo de gracia diagonal, `createCollection` para registrar elementos y `createRovingFocus` para navegar con el teclado entre los triggers.

## Uso

Compón `Root`, `List`, `Item`, `Trigger`, `Content`, `Link`, `Group` y `GroupLabel`.

```tsx
import * as MegaMenu from "@solidiom/mega-menu"

function Navigation() {
  return (
    <MegaMenu.Root>
      <MegaMenu.List>
        <MegaMenu.Item>
          <MegaMenu.Trigger>Productos</MegaMenu.Trigger>
          <MegaMenu.Content>
            <MegaMenu.Group>
              <MegaMenu.GroupLabel>Plataforma</MegaMenu.GroupLabel>
              <MegaMenu.Link href="/analytics">Analítica</MegaMenu.Link>
              <MegaMenu.Link href="/automation">Automatización</MegaMenu.Link>
            </MegaMenu.Group>
          </MegaMenu.Content>
        </MegaMenu.Item>
      </MegaMenu.List>
    </MegaMenu.Root>
  )
}
```

## Instalación

Instala el paquete con `pnpm add @solidiom/mega-menu`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

mega-menu expone 8 partes:

- **Root** — `data-part="root"`. Contenedor de navegación que coordina el estado de disclosure y del foco.
- **List** — `data-part="list"`. Contiene los elementos de menú de nivel superior.
- **Item** — `data-part="item"`. Un elemento de menú con su propio estado de apertura y cierre.
- **Trigger** — `data-part="trigger"`. Abre el contenido del elemento y participa en el foco roving.
- **Content** — `data-part="content"`. Panel de contenido enriquecido en varias columnas para un elemento.
- **Link** — `data-part="link"`. Enlace de navegación dentro del contenido.
- **Group** — `data-part="group"`. Agrupa enlaces relacionados dentro del contenido.
- **GroupLabel** — `data-part="grouplabel"`. Etiqueta de un grupo de enlaces.

## Estilos

mega-menu incluye los atributos `data-scope="mega-menu"` y `data-part` en cada parte para seleccionar estilos CSS o recetas.

## Teclado y comportamiento

| Tecla            | Comportamiento                            |
| ---------------- | ----------------------------------------- |
| Teclas de flecha | Mueven el foco roving entre los triggers. |

## Composición

Mega Menu se compone dentro de encabezados y barras de navegación del sitio para presentar enlaces agrupados y contenido enriquecido por cada elemento de nivel superior.

## SSR e hidratación

Mega Menu renderiza las marcas de sus triggers y contenidos en el servidor y activa durante la hidratación el disclosure, la intención del puntero y el foco roving.
