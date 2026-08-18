---
contentSchemaVersion: 1
title: Breadcrumb
description: Navegación jerárquica de migas de pan con estructura de lista accesible.
keywords: [breadcrumb, navegación, jerarquía, enlaces, ruta-de-migas]
locale: es
maturity: ga
product: Breadcrumb
productLayer: primitive
status: draft
package: "@solidiom/breadcrumb"
primitive: breadcrumb
section: overview
notApplicable:
  - section: composition
    reason: Primitivo autónomo sin sub-primitivos compuestos.
  - section: relationships
    reason: Sin primitivos hermanos; se usa dentro de otras composiciones pero no posee un contrato inter-primitivo.
  - section: migration
    reason: Sin API previa; esta es la primera versión publicada.
  - section: testing
    reason: La guía estándar de pruebas cubre este primitivo. No existe comportamiento no obvio específico.
translationSourceHash: "1fa32368798df2edb965b2b9c474701702937c84bbf094474c9a823c5728ac22"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

Breadcrumb renderiza un indicador de navegación jerárquica que comunica la ubicación de la página actual dentro de una jerarquía de navegación. Utiliza estructura de lista semántica con marcado ARIA adecuado para compatibilidad con lector de pantalla.

## Uso

Breadcrumb proporciona partes componibles: `Root`, `List`, `Item`, `Link`, `Separator` y `Ellipsis`. Compónlas para construir rutas de migas de pan de cualquier profundidad.

```tsx
import * as Breadcrumb from "@solidiom/breadcrumb"

;<Breadcrumb.Root>
  <Breadcrumb.List>
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/">Inicio</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/docs">Documentación</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/docs/breadcrumb" current>
        Breadcrumb
      </Breadcrumb.Link>
    </Breadcrumb.Item>
  </Breadcrumb.List>
</Breadcrumb.Root>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/breadcrumb`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes y Props

### Root

Envuelve toda la navegación de migas de pan. Se renderiza como un elemento `<nav>` con `aria-label="Breadcrumb"`.

| Prop       | Tipo          | Default | Descripción               |
| ---------- | ------------- | ------- | ------------------------- |
| `children` | `JSX.Element` | —       | Contenido del breadcrumb. |

### List

Envuelve los elementos del breadcrumb. Se renderiza como un elemento `<ol>`.

| Prop       | Tipo          | Default | Descripción                        |
| ---------- | ------------- | ------- | ---------------------------------- |
| `children` | `JSX.Element` | —       | Lista de elementos del breadcrumb. |

### Item

Envuelve una entrada individual del breadcrumb. Se renderiza como un elemento `<li>`.

| Prop       | Tipo          | Default | Descripción                                   |
| ---------- | ------------- | ------- | --------------------------------------------- |
| `children` | `JSX.Element` | —       | Contenido del elemento (típicamente un Link). |

### Link

Enlace de navegación dentro de un elemento del breadcrumb. Se renderiza como un elemento `<a>`.

| Prop       | Tipo          | Default | Descripción                                                                      |
| ---------- | ------------- | ------- | -------------------------------------------------------------------------------- |
| `children` | `JSX.Element` | —       | Texto o contenido del enlace.                                                    |
| `href`     | `string`      | —       | URL de destino de la navegación.                                                 |
| `current`  | `boolean`     | `false` | Cuando es true, marca el enlace como la página actual con `aria-current="page"`. |

### Separator

Separador visual entre elementos del breadcrumb. Se renderiza como un `<span>` con `role="presentation"` y `aria-hidden="true"`.

| Prop       | Tipo          | Default | Descripción                            |
| ---------- | ------------- | ------- | -------------------------------------- |
| `children` | `JSX.Element` | `"/"`   | Contenido personalizado del separador. |

### Ellipsis

Indica elementos del breadcrumb omitidos en una ruta truncada. Se renderiza como un `<span>` con `role="presentation"`.

| Prop       | Tipo          | Default | Descripción                       |
| ---------- | ------------- | ------- | --------------------------------- |
| `children` | `JSX.Element` | `"..."` | Contenido personalizado delipsis. |

## Estilos

Breadcrumb lleva los atributos `data-scope="breadcrumb"` y `data-part` en cada parte (`root`, `list`, `item`, `link`, `separator`, `ellipsis`). Estílalo con espaciado, tipografía o colores apropiados para tu sistema de diseño. Apunta a los elementos usando los atributos data para un estilizado robusto.

## Interacción con teclado

Este primitivo no tiene interacción con teclado. Renderiza contenido estático que no recibe foco ni responde a eventos de teclado.

## Renderizado SSR e hidratación

Breadcrumb es un elemento de visualización pasivo sin estado interactivo más allá de la navegación estándar de enlaces. Se renderiza como HTML estático y no requiere hidratación en el cliente.
