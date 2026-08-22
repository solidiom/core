---
contentSchemaVersion: 1
title: Menubar
description: Barra de menú horizontal de estilo escritorio con submenús desplegables.
keywords: [menubar, menu, navigation, dropdown, submenu, keyboard, desktop]
locale: es
maturity: ga
product: Menubar
productLayer: primitive
status: draft
package: "@solidiom/menubar"
primitive: menubar
section: overview
notApplicable:
  - section: migration
    reason: No existe una API anterior; esta es la primera versión publicada.
  - section: testing
    reason: La guía de pruebas estándar cubre este primitivo.
translationSourceHash: "e8060c6934301ce2d86ad709b26810737820a370146a3b1d9f8b769aeb9dcc2c"
translationStatus: "draft"
---

Menubar es una barra de menú horizontal de estilo escritorio con submenús desplegables. Admite navegar con el teclado entre triggers, abrir menús y submenús, y cerrar los menús.

## Uso

Compón `Root`, `Menu`, `Trigger`, `Content`, `Item`, `Separator`, `SubMenu`, `SubTrigger` y `SubContent`.

```tsx
import * as Menubar from "@solidiom/menubar"

function AppMenubar() {
  return (
    <Menubar.Root>
      <Menubar.Menu>
        <Menubar.Trigger>Archivo</Menubar.Trigger>
        <Menubar.Content>
          <Menubar.Item>Nuevo</Menubar.Item>
          <Menubar.Separator />
          <Menubar.SubMenu>
            <Menubar.SubTrigger>Abrir recientes</Menubar.SubTrigger>
            <Menubar.SubContent>
              <Menubar.Item>proyecto-a</Menubar.Item>
            </Menubar.SubContent>
          </Menubar.SubMenu>
        </Menubar.Content>
      </Menubar.Menu>
    </Menubar.Root>
  )
}
```

## Instalación

Instala el paquete con `pnpm add @solidiom/menubar`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

menubar expone 9 partes:

- **Root** — `data-part="root"`. Contenedor horizontal de la barra de menú.
- **Menu** — `data-part="menu"`. Un menú de nivel superior con su trigger y contenido.
- **Trigger** — `data-part="trigger"`. Abre un menú desde la barra.
- **Content** — `data-part="content"`. Panel desplegable de contenido de un menú.
- **Item** — `data-part="item"`. Elemento de menú seleccionable.
- **Separator** — `data-part="separator"`. Separador visual entre elementos.
- **SubMenu** — `data-part="submenu"`. Submenú anidado dentro de un menú.
- **SubTrigger** — `data-part="subtrigger"`. Abre un submenú.
- **SubContent** — `data-part="subcontent"`. Panel de contenido de un submenú.

## Estilos

menubar incluye los atributos `data-scope="menubar"` y `data-part` en cada parte para seleccionar estilos CSS o recetas.

## Teclado y comportamiento

| Tecla                  | Comportamiento                                 |
| ---------------------- | ---------------------------------------------- |
| ArrowLeft / ArrowRight | Mueven el foco entre los triggers de la barra. |
| ArrowDown              | Abre un menú.                                  |
| ArrowRight             | En un SubTrigger, abre el submenú.             |
| Escape                 | Cierra el menú abierto.                        |

## Composición

Menubar se compone dentro de interfaces de aplicación y barras de herramientas para alojar menús, elementos, separadores y submenús anidados.

## SSR e hidratación

Menubar renderiza las marcas de sus triggers y contenidos en el servidor y activa durante la hidratación la navegación de teclado y el comportamiento de los menús.
