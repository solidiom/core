---
contentSchemaVersion: 1
title: Field
description: Form field wrapper with label, control, description, and error message styling.
keywords: [field, form, label, validation, error]
locale: es
maturity: draft
product: Field
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "field"
stylingOutputs: ["css", "tailwind", "unocss"]
translationSourceHash: "aca1f446c5cc0086904d23c13a0fbd28e7e4d42faf4a4449da45106f868c3126"
translationStatus: draft
---

Form field wrapper with label, control, description, and error message styling.

## Uso

El componente Field es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/field`. Proporciona una capa de composición para campos de formulario con estilos semánticos para etiqueta, descripción y estados de error.

```tsx
import { StyledField, Field } from "@solidiom/recipes-css"
import { StyledInput } from "@solidiom/recipes-css"

;<StyledField>
  <Field.Label>Email</Field.Label>
  <Field.Control>
    {(controlProps) => <StyledInput {...controlProps()} placeholder="you@example.com" />}
  </Field.Control>
  <Field.Description>Nunca compartiremos tu email.</Field.Description>
  <Field.Error>El email es obligatorio.</Field.Error>
</StyledField>
```

## Instalación

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Instala el paquete de receta para tu perfil de estilo elegido. El componente requiere el primitivo `@solidiom/field` correspondiente como dependencia par.

## Anatomía

El componente Field envuelve el primitivo `@solidiom/field`. Expone cinco partes a través de una capa de composición con receta aplicada:

- **Root** — contenedor que proporciona contexto ARIA a las partes hijas y gestiona el estado del control de formulario.
- **Label** — etiqueta accesible vinculada al control mediante `for`.
- **Control** — envoltorio render-prop que pasa propiedades ARIA al elemento de control de formulario del consumidor.
- **Description** — texto de ayuda vinculado mediante `aria-describedby` cuando el campo es válido.
- **Error** — mensaje de error mostrado solo cuando `invalid` es verdadero, con `role="alert"`.

## Variantes y estados

Field no utiliza variantes. El estilo es impulsado por banderas de estado de formulario:

- **Required** — indica que el campo debe tener un valor.
- **Disabled** — apariencia atenuada con opacidad reducida en todas las partes.
- **Invalid** — activa la visualización del mensaje de error y oculta la descripción.
- **Readonly** — indica que el campo no puede ser editado.

## Estilos

Field está disponible en los perfiles css, tailwind, unocss. Cada perfil aplica las mismas banderas semánticas y estados de formulario, permitiendo cambiar perfiles sin cambiar el uso del componente.

Las clases de receta siguen el espacio de nombres `solidiom-field` para el perfilado y la selección CSS.

## Renderizado SSR e hidratación

Field se renderiza como elementos HTML semánticos `<div>` y `<label>` durante el renderizado en servidor. El cableado de relaciones ARIA se activa en la hidratación sin desplazamiento de diseño. La capa de receta no añade dependencias de JavaScript más allá del primitivo subyacente.

## Accesibilidad

Field delega la accesibilidad a `@solidiom/field`. El primitivo automáticamente cablea relaciones ARIA entre etiqueta, control, descripción y elementos de error usando `createFormControl` desde `@solidiom/runtime`. Los mensajes de error se renderizan con `role="alert"` y `aria-live="assertive"` para anuncios del lector de pantalla. Consulta el [contrato de accesibilidad del primitivo Field](/primitives/field/accessibility/) para el contrato completo de teclado, foco y ARIA.