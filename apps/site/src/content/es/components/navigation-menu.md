---
contentSchemaVersion: 1
title: Navigation Menu
description: Styled navigation menu component — the recipe wrapper for the css, tailwind, unocss profile(s) using the navigation-menu primitive.
keywords: [navigation, menu, nav, menu bar, dropdown, component, css, tailwind, unocss]
locale: es
maturity: beta
product: Navigation Menu
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "navigation-menu"
stylingOutputs: ["css", "tailwind", "unocss"]
translationSourceHash: "9279724c2e92432e9b1bf577a8ce359fc5eca62484349246d12146329fc3a010"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

Styled navigation menu component — the recipe wrapper for the css, tailwind, unocss profile(s) using the navigation-menu primitive.

## Uso

El componente Navigation Menu es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/navigation-menu`. Proporciona un menú de navegación con submenús desplegables, adecuado para la navegación principal del sitio.

```tsx
import { StyledNavigationMenu } from "@solidiom/recipes-css"

;<StyledNavigationMenu>
  <StyledNavigationMenu.List>
    <StyledNavigationMenu.Item>
      <StyledNavigationMenu.Trigger>Item 1</StyledNavigationMenu.Trigger>
      <StyledNavigationMenu.Content>Content for Item 1</StyledNavigationMenu.Content>
    </StyledNavigationMenu.Item>
  </StyledNavigationMenu.List>
</StyledNavigationMenu>
```

## Instalación

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Instala el paquete de receta para tu perfil de estilo elegido. El componente requiere el primitivo `@solidiom/navigation-menu` correspondiente como dependencia par.

## Anatomía

El componente Navigation Menu envuelve el primitivo `@solidiom/navigation-menu`. Expone las partes del primitivo a través de una capa de composición con receta aplicada:

- **Root** — el elemento envoltorio que aplica estilos de receta y delega al primitivo.
- **List** — la lista principal de elementos de navegación.
- **Item** — cada elemento de navegación individual.
- **Trigger** — el botón que activa el submenú.
- **Content** — el contenido del submenú desplegable.

## Variantes y estados

Navigation Menu hereda su soporte de variantes y estados de `@solidiom/navigation-menu`. El primitivo implementa el patrón WAI-ARIA navigation menu con navegación por teclado y soporte para lector de pantalla. Consulte la documentación del primitivo para la lista completa de props soportados y estados interactivos.

## Estilos

Navigation Menu está disponible en los perfiles css, tailwind, unocss. Cada perfil aplica los mismos slots semánticos y clases de variante, permitiendo cambiar perfiles sin cambiar el uso del componente.

Las clases de receta siguen el espacio de nombres `solidiom-navigation-menu` para el perfilado y la selección CSS.

## Renderizado SSR e hidratación

Navigation Menu se renderiza como HTML semántico durante el renderizado en servidor. La capa de receta no añade dependencias de JavaScript más allá del primitivo subyacente.

## Accesibilidad

Navigation Menu delega la accesibilidad a `@solidiom/navigation-menu`. El primitivo implementa el patrón WAI-ARIA navigation menu con navegación por teclado y soporte para lector de pantalla. Consulta el [contrato de accesibilidad del primitivo Navigation Menu](/primitives/navigation-menu/accessibility/) para el contrato completo de teclado, foco y ARIA. El envoltorio de receta no introduce nuevas semánticas ni interactúa con el árbol de accesibilidad más allá del estilo.
