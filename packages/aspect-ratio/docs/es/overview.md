---
contentSchemaVersion: 1
title: Aspect Ratio
description: Contenedor que limita sus hijos a una proporción de aspecto especificada.
keywords: [aspect-ratio, layout, ratio, media, responsive]
locale: es
maturity: ga
product: Aspect Ratio
productLayer: primitive
status: draft
package: "@solidiom/aspect-ratio"
primitive: aspect-ratio
section: overview
notApplicable:
  - section: composition
    reason: Primitivo autónomo sin subprimitivos compuestos.
  - section: relationships
    reason: No tiene primitivos hermanos; se usa dentro de otras composiciones, pero no posee un contrato entre primitivos.
  - section: migration
    reason: No existe una API anterior; esta es la primera versión publicada.
  - section: testing
    reason: La guía de pruebas estándar cubre este primitivo.
translationSourceHash: "c61d08d4ed8c7d1cbf9994325a2ac911c3f01e1069b684512d65fd6a3d9f34e3"
translationStatus: "draft"
---

Aspect Ratio limita sus hijos a una proporción fija entre ancho y alto, manteniendo proporcionales los medios y elementos incrustados cuando cambia el tamaño de su contenedor.

## Uso

Aspect Ratio tiene una única parte `Root`. Pasa como hijos el contenido que quieras limitar.

```tsx
import * as AspectRatio from "@solidiom/aspect-ratio"

;<AspectRatio.Root ratio={16 / 9}>
  <img src="/cover.jpg" alt="Portada" />
</AspectRatio.Root>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/aspect-ratio`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

Aspect Ratio expone una única parte `Root` con `data-scope="aspect-ratio"` y `data-part="root"`.

## Estilos

Estiliza `Root` mediante los atributos `data-scope="aspect-ratio"` y `data-part="root"`. La proporción se aplica en línea; las recetas normalmente solo controlan el desbordamiento y `object-fit` de los hijos multimedia.

## Teclado y comportamiento

Este primitivo no tiene interacción de teclado. Renderiza un contenedor que no recibe el foco ni responde a eventos de teclado.

## SSR e hidratación

Aspect Ratio es un elemento de diseño pasivo sin estado interactivo. Se renderiza como HTML estático y no requiere hidratación en el cliente.
