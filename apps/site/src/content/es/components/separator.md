---
contentSchemaVersion: 1
title: Separator
description: Primitiva de separador para divisores horizontales o verticales.
keywords: [separator, divider, primitive, accessibility]
locale: es
maturity: beta
product: Separator
productLayer: component
status: published
package: "@solidiom/separator"
translationSourceHash: "9e49d76bd5fbb6e1ff3a9096e9a117302ffecd5c75fdb8186dcd03e5ea37781d"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

El paquete `@solidiom/separator` exporta la primitiva `Separator.Root`. Los paquetes de recetas no exportan un envoltorio `StyledSeparator`.

## Uso

```tsx
import * as Separator from "@solidiom/separator"

;<Separator.Root orientation="horizontal" />
```

`Separator.Root` acepta `orientation` (`horizontal` o `vertical`), `decorative`, `class` y `style`.

## Instalación

```sh
pnpm add @solidiom/separator
```

## Estilos

La primitiva emite atributos `data-*` semánticos y acepta las propiedades `class` y `style`. Añade los estilos de la aplicación directamente; actualmente no se exporta una receta para esta primitiva.

## Accesibilidad

Por defecto, `Separator.Root` renderiza `role="separator"` y el `aria-orientation` seleccionado. Usa `decorative` para renderizarlo con `role="none"`. Consulta el [contrato de accesibilidad de la primitiva Separator](/primitives/separator/accessibility/).
