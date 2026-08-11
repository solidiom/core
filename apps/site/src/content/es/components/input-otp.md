---
contentSchemaVersion: 1
title: Input OTP
description: Styled input OTP component — the recipe wrapper for the css, tailwind, unocss profile(s) using the input-otp primitive.
keywords: [input-otp, otp, verification, code, component, css, tailwind, unocss]
locale: es
maturity: beta
product: Input OTP
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "input-otp"
stylingOutputs: ["css", "tailwind", "unocss"]
translationSourceHash: "d0e37427c71490edf1a74dcdb74b94e4789a697cb4c559d06b0b1547a5564476"
translationStatus: draft
---

Styled input OTP component — the recipe wrapper for the css, tailwind, unocss profile(s) using the input-otp primitive.

## Uso

El componente Input OTP es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/input-otp`. Añade composición, slots de estilo semántico y soporte de variantes mientras delega toda la gestión de estado y el comportamiento de teclado al primitivo subyacente.

```tsx
import * as InputOtp from "@solidiom/recipes-css"

;<InputOtp.Root maxLength={6}>
  <InputOtp.Group>
    <InputOtp.Slot index={0} />
    <InputOtp.Slot index={1} />
    <InputOtp.Slot index={2} />
  </InputOtp.Group>
  <InputOtp.Separator />
  <InputOtp.Group>
    <InputOtp.Slot index={3} />
    <InputOtp.Slot index={4} />
    <InputOtp.Slot index={5} />
  </InputOtp.Group>
</InputOtp.Root>
```

## Instalación

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Instala el paquete de receta para tu perfil de estilo elegido. El componente requiere el primitivo `@solidiom/input-otp` correspondiente como dependencia par.

## Anatomía

El componente envuelve el primitivo `@solidiom/input-otp`. Expone las partes del primitivo a través de una capa de composición con receta aplicada:

- **Root** — the wrapper element that manages OTP input state.
- **Group** — groups slots together visually.
- **Slot** — individual character input slot.
- **Separator** — visual separator between groups.

## Variantes y estados

Input OTP hereda su soporte de variantes y estados de `@solidiom/input-otp`. Consulta la documentación del primitivo para la lista completa de variantes soportadas, variantes compuestas y estados interactivos.

## Estilos

Input OTP está disponible en los perfiles css, tailwind, unocss. Cada perfil aplica los mismos slots semánticos y clases de variante, permitiendo cambiar perfiles sin cambiar el uso del componente.

Las clases de receta siguen el espacio de nombres `solidiom-input-otp` para el perfilado y la selección CSS.

## Renderizado SSR e hidratación

Input OTP se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo se activa en la hidratación sin desplazamiento de diseño. La capa de receta no añade dependencias de JavaScript más allá del primitivo subyacente.

## Accesibilidad

Input OTP delega la accesibilidad a `@solidiom/input-otp`. Consulta el [contrato de accesibilidad del primitivo Input OTP](/primitives/input-otp/accessibility/) para el contrato completo de teclado, foco y ARIA. El envoltorio de receta no introduce nuevas semánticas ni interactúa con el árbol de accesibilidad más allá del estilo.
