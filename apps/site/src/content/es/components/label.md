---
contentSchemaVersion: 1
title: Label
description: Primitiva de etiqueta sin estilos para asociar texto con un control de formulario.
keywords: [label, form, input, primitive, accessibility]
locale: es
maturity: beta
product: Label
productLayer: component
status: published
package: "@solidiom/label"
translationSourceHash: "88a1fc067ee2421e379ec528a446f66b5d6f81d27c7ee6b8fddb24a62f614dde"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

El paquete `@solidiom/label` exporta la primitiva `Label.Root`. Los paquetes de recetas no exportan un envoltorio `StyledLabel`.

## Uso

```tsx
import * as Label from "@solidiom/label"

;<Label.Root htmlFor="email">Email address</Label.Root>
```

`Label.Root` acepta las propiedades `htmlFor`, `id`, `disabled`, `required`, `invalid`, `class`, `style` y `children`.

## Instalación

```sh
pnpm add @solidiom/label
```

## Estilos

La primitiva emite los atributos semánticos `data-scope="label"` y `data-part="root"`, y acepta las propiedades `class` y `style`. Añade los estilos de la aplicación directamente; actualmente no se exporta una receta para esta primitiva.

## Accesibilidad

`Label.Root` renderiza un `<label>` nativo y lo vincula a un control mediante `htmlFor`. Consulta el [contrato de accesibilidad de la primitiva Label](/primitives/label/accessibility/).
